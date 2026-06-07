import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { Firestore } from "firebase-admin/firestore";
import { getAdminMessaging, getAdminFirestore } from "@/src/lib/firebase-admin";

// firebase-admin needs the Node.js runtime (not Edge), and the response must
// never be cached. maxDuration gives the batched FCM sends room to finish.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FCM_BATCH_LIMIT = 500;
// Firestore commits a maximum of 500 writes per batch.
const FIRESTORE_BATCH_LIMIT = 500;

// FCM error codes that mean the token is permanently dead and safe to delete.
const DEAD_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument",
]);

function verifySecret(incoming: string | null): boolean {
  const secret = process.env.NOTIFY_DEPLOY_SECRET;
  // Reject immediately if the server secret is not configured
  if (!secret) return false;
  if (!incoming) return false;
  const expected = `Bearer ${secret}`;
  // Use constant-time comparison to prevent timing attacks
  try {
    const a = Buffer.from(incoming);
    const b = Buffer.from(expected);
    if (a.byteLength !== b.byteLength) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Idempotency guard. The GitHub Action retries the request on any error
 * (`--retry-all-errors`), so a send that succeeds but whose HTTP response is
 * lost would otherwise re-notify every subscriber. We atomically claim a marker
 * keyed by the deploy id (commit SHA); only the first caller for a given deploy
 * proceeds. Returns true if this request won the claim.
 */
async function claimDeploy(
  db: Firestore,
  deployId: string
): Promise<boolean> {
  const ref = db.collection("notify_dedup").doc(deployId);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) return false;
    tx.set(ref, { processedAt: new Date().toISOString() });
    return true;
  });
}

export async function POST(req: NextRequest) {
  if (!verifySecret(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminFirestore();

    // Per-deploy idempotency so workflow retries can't double-notify users.
    const deployId = req.headers.get("x-deploy-id");
    if (deployId) {
      const claimed = await claimDeploy(db, deployId);
      if (!claimed) {
        return NextResponse.json({ deduped: true, sent: 0, failed: 0 });
      }
    }

    const snapshot = await db.collection("fcm_tokens").get();
    if (snapshot.empty) {
      return NextResponse.json({ sent: 0, failed: 0 });
    }

    // The document id IS the token (stored via .doc(token)), making it the
    // authoritative source. Filter out anything malformed and de-duplicate so a
    // bad row can never crash the multicast or send the same device twice.
    const allTokens = Array.from(
      new Set(
        snapshot.docs
          .map((doc) => doc.id)
          .filter((id): id is string => typeof id === "string" && id.length > 0)
      )
    );

    if (allTokens.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0 });
    }

    const messaging = getAdminMessaging();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://kaungmratthu.vercel.app";

    let totalSent = 0;
    let totalFailed = 0;
    const deadTokens: string[] = [];

    // FCM sendEachForMulticast is capped at 500 tokens per call.
    for (const batch of chunkArray(allTokens, FCM_BATCH_LIMIT)) {
      try {
        // Data-only message: deliberately NO `notification` block anywhere. A
        // notification payload makes the FCM SDK auto-display the push AND still
        // fire the service worker's onBackgroundMessage, so every push rendered
        // twice (confirmed on both Chrome/Android and iOS). With data-only, only
        // the service worker renders it — exactly one notification per device on
        // every platform. The SW reads title/body/url from `data`.
        const result = await messaging.sendEachForMulticast({
          tokens: batch,
          data: {
            title: "New Blog Post",
            body: "A new post is live — tap to read it.",
            url: `${siteUrl}/blog`,
          },
          webpush: {
            // Default urgency for data messages is "normal"; bump it so the push
            // service wakes the SW promptly while the device is in the background.
            headers: { Urgency: "high" },
          },
        });

        totalSent += result.successCount;
        totalFailed += result.failureCount;

        result.responses.forEach((resp, i) => {
          if (!resp.success && resp.error?.code && DEAD_TOKEN_CODES.has(resp.error.code)) {
            deadTokens.push(batch[i]);
          }
        });
      } catch (batchErr) {
        // A transient batch failure (network, FCM hiccup) must not abort the
        // remaining batches — log it, count it, and keep going.
        console.error("[notify-deploy] batch send failed", batchErr);
        totalFailed += batch.length;
      }
    }

    // Clean up dead / unregistered tokens, respecting Firestore's 500-write cap.
    if (deadTokens.length > 0) {
      for (const delChunk of chunkArray(deadTokens, FIRESTORE_BATCH_LIMIT)) {
        const writeBatch = db.batch();
        delChunk.forEach((token) =>
          writeBatch.delete(db.collection("fcm_tokens").doc(token))
        );
        await writeBatch.commit();
      }
    }

    return NextResponse.json({
      sent: totalSent,
      failed: totalFailed,
      pruned: deadTokens.length,
    });
  } catch (err) {
    console.error("[notify-deploy]", err);
    // This block is only reachable after verifySecret() passes, so it is safe to
    // surface the underlying error to the (authorized) caller for diagnostics.
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as { code?: string | number })?.code;
    return NextResponse.json(
      { error: "Internal server error", code, message },
      { status: 500 }
    );
  }
}
