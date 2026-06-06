import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminMessaging, getAdminFirestore } from "@/src/lib/firebase-admin";

const FCM_BATCH_LIMIT = 500;

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

export async function POST(req: NextRequest) {
  if (!verifySecret(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("fcm_tokens").get();

    if (snapshot.empty) {
      return NextResponse.json({ sent: 0, failed: 0 });
    }

    const allTokens = snapshot.docs.map((doc) => doc.data().token as string);
    const messaging = getAdminMessaging();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kaungmratthu.vercel.app";

    let totalSent = 0;
    let totalFailed = 0;
    const staleTokens: string[] = [];

    // FCM sendEachForMulticast is capped at 500 tokens per call
    for (const batch of chunkArray(allTokens, FCM_BATCH_LIMIT)) {
      const result = await messaging.sendEachForMulticast({
        tokens: batch,
        notification: {
          title: "New Blog Post",
          body: "A new post is live — tap to read it.",
        },
        data: { url: `${siteUrl}/blog` },
        webpush: {
          notification: { icon: "/icons/icon-192.png" },
          fcmOptions: { link: `${siteUrl}/blog` },
        },
      });

      totalSent += result.successCount;
      totalFailed += result.failureCount;

      result.responses.forEach((resp, i) => {
        if (
          !resp.success &&
          resp.error?.code === "messaging/registration-token-not-registered"
        ) {
          staleTokens.push(batch[i]);
        }
      });
    }

    // Clean up stale / unregistered tokens
    if (staleTokens.length > 0) {
      const writeBatch = db.batch();
      staleTokens.forEach((token) =>
        writeBatch.delete(db.collection("fcm_tokens").doc(token))
      );
      await writeBatch.commit();
    }

    return NextResponse.json({ sent: totalSent, failed: totalFailed });
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
