import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are not configured. " +
        "Set NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, " +
        "and FIREBASE_ADMIN_PRIVATE_KEY in your environment variables."
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Vercel stores multiline secrets with literal \n — restore real newlines
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminMessaging(): Messaging {
  return getMessaging(getAdminApp());
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
