import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/src/lib/firebase-admin";

// firebase-admin requires the Node.js runtime (not Edge); never cache writes.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// FCM web tokens are ~152-163 chars; 500 is a safe upper bound
const TOKEN_MAX_LEN = 500;
// Firestore document IDs cannot contain '/'
const TOKEN_INVALID_CHARS = /\//;

function isValidToken(token: unknown): token is string {
  return (
    typeof token === "string" &&
    token.length > 0 &&
    token.length <= TOKEN_MAX_LEN &&
    !TOKEN_INVALID_CHARS.test(token)
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!isValidToken(body?.token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    const token = body.token;
    const db = getAdminFirestore();
    await db
      .collection("fcm_tokens")
      .doc(token)
      .set({ token, updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Public endpoint: log the real error for Vercel runtime logs, but keep the
    // client-facing response generic to avoid leaking internal details.
    console.error("[fcm-token]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
