// Throwaway FCM diagnostic. Sends 4 labeled payload variants to a single token
// so we can see which shapes actually display on Android Chrome web push.
//
//   node scripts/fcm-diag.mjs "<FCM_TOKEN>"
//
// Watch the device: each variant has a distinct title (A/B/C/D). Whichever
// titles appear tell us which payload shape Android accepts. Delete this file
// when done.

import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Minimal .env.local loader (no dotenv dependency).
function loadEnv(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const env = loadEnv(new URL("../.env.local", import.meta.url).pathname);

const token = process.argv[2];
if (!token) {
  console.error('Usage: node scripts/fcm-diag.mjs "<FCM_TOKEN>"');
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const messaging = getMessaging();
const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://kaungmratthu.vercel.app";

// A = exactly what /api/notify-deploy sends today (top-level notification + data + webpush)
const variantA = {
  token,
  notification: { title: "TEST A (current)", body: "top-level notification + data + webpush" },
  data: { url: `${siteUrl}/blog` },
  webpush: {
    notification: { icon: "/icons/icon-192.png" },
    fcmOptions: { link: `${siteUrl}/blog` },
  },
};

// B = notification fully inside webpush.notification (title+body+icon), data kept, no top-level notification
const variantB = {
  token,
  data: { url: `${siteUrl}/blog` },
  webpush: {
    notification: {
      title: "TEST B (webpush.notification)",
      body: "title/body/icon all under webpush.notification",
      icon: "/icons/icon-192.png",
    },
    fcmOptions: { link: `${siteUrl}/blog` },
  },
};

// C = data-only. Relies on the service worker's onBackgroundMessage to display.
const variantC = {
  token,
  data: {
    url: `${siteUrl}/blog`,
    title: "TEST C (data-only)",
    body: "no notification block at all",
  },
};

// D = top-level notification only. Mimics the Firebase Console test that works on your Android.
const variantD = {
  token,
  notification: { title: "TEST D (console-like)", body: "top-level notification only, no data/webpush" },
};

const variants = [
  ["A", variantA],
  ["B", variantB],
  ["C", variantC],
  ["D", variantD],
];

for (const [name, msg] of variants) {
  try {
    const id = await messaging.send(msg);
    console.log(`Variant ${name}: ACCEPTED by FCM -> ${id}`);
  } catch (err) {
    console.log(`Variant ${name}: REJECTED -> ${err.code || ""} ${err.message}`);
  }
  // small gap so notifications arrive in order
  await new Promise((r) => setTimeout(r, 1500));
}

console.log("\nDone. Check your Android device: note which of A/B/C/D appeared.");
