"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WebPushState =
  | "idle" // supported, not yet granted
  | "loading"
  | "granted"
  | "denied"
  | "unsupported";

const SW_URL = "/api/firebase-messaging-sw";
const SW_OPTIONS: RegistrationOptions = { scope: "/", updateViaCache: "none" };

/**
 * Registers the FCM service worker, mints a token, and persists it via
 * /api/fcm-token. Reused by both the install modal and the notification bell.
 */
async function registerServiceWorker(
  existing: ServiceWorkerRegistration | null
): Promise<ServiceWorkerRegistration | undefined> {
  if (existing) return existing;
  if (!("serviceWorker" in navigator)) return undefined;
  try {
    // Race the registration against a timeout so a hung SW fetch can't block forever.
    return await Promise.race([
      navigator.serviceWorker.register(SW_URL, SW_OPTIONS),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("SW registration timeout")), 8000)
      ),
    ]);
  } catch {
    // SW unavailable — getToken will fail below and the caller handles it.
    return undefined;
  }
}

async function fetchAndSaveToken(
  registration: ServiceWorkerRegistration | undefined
): Promise<boolean> {
  const [{ getFirebaseMessaging }, { getToken }] = await Promise.all([
    import("@/src/lib/firebase"),
    import("firebase/messaging"),
  ]);

  const messaging = await getFirebaseMessaging();
  if (!messaging) return false; // browser doesn't support FCM

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) return false;

  const res = await fetch("/api/fcm-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Failed to save FCM token");
  return true;
}

export function useWebPush() {
  const [state, setState] = useState<WebPushState>("idle");
  const swReg = useRef<ServiceWorkerRegistration | null>(null);

  // Determine initial support/permission state, register the SW eagerly, and —
  // crucially — if permission was already granted (e.g. before the Firestore DB
  // existed and the token write was failing), silently re-persist the token.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) {
      setState("unsupported");
      return;
    }

    const permission = Notification.permission;
    if (permission === "denied") {
      setState("denied");
      return;
    }

    let cancelled = false;

    (async () => {
      const reg = await registerServiceWorker(swReg.current);
      if (reg && !cancelled) swReg.current = reg;

      if (permission === "granted") {
        try {
          await fetchAndSaveToken(reg);
          if (!cancelled) setState("granted");
        } catch {
          // Keep state idle so the user can retry via the bell.
          if (!cancelled) setState("idle");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const subscribe = useCallback(async () => {
    if (!("Notification" in window)) {
      setState("unsupported");
      return;
    }
    setState("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const reg = await registerServiceWorker(swReg.current);
      if (reg) swReg.current = reg;

      // A null messaging (unsupported browser) still counts as "done" — there is
      // nothing more the user can do, and permission was granted.
      await fetchAndSaveToken(reg);
      setState("granted");
    } catch {
      setState("denied");
    }
  }, []);

  return { state, subscribe } as const;
}
