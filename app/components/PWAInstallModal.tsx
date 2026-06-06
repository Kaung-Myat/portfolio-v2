"use client";

import { useState, useEffect, useRef } from "react";

type Browser = "chrome" | "safari-ios" | "firefox" | "other";
type NotifState = "idle" | "loading" | "granted" | "denied" | "unsupported";

function detectBrowser(): Browser {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream)
    return "safari-ios";
  if (/Firefox\//.test(ua)) return "firefox";
  if (/Chrome\//.test(ua) || /Edg\//.test(ua)) return "chrome";
  return "other";
}

export default function PWAInstallModal() {
  const [open, setOpen] = useState(false);
  const [browser, setBrowser] = useState<Browser>("other");
  const [notifState, setNotifState] = useState<NotifState>("idle");
  const deferredPrompt = useRef<{ prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const swReg = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Already installed as standalone — no need for install prompt
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Already shown before — skip
    if (localStorage.getItem("pwa-notified")) return;

    const detectedBrowser = detectBrowser();
    setBrowser(detectedBrowser);

    // Set initial notification support state based on what's already known
    if (!("Notification" in window)) {
      setNotifState("unsupported");
    } else if (Notification.permission === "granted") {
      setNotifState("granted");
    } else if (Notification.permission === "denied") {
      setNotifState("denied");
    }

    // Register the service worker (served via API route with env vars injected)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/api/firebase-messaging-sw", {
          scope: "/",
          updateViaCache: "none",
        })
        .then((reg) => {
          swReg.current = reg;
        })
        .catch(() => {
          // Silently fail — Firebase not configured yet or network issue
        });
    }

    // Capture Chrome/Edge native install prompt
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as unknown as typeof deferredPrompt.current;
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    // Show modal after a short delay so the page settles first
    const timer = setTimeout(() => setOpen(true), 2500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  function dismiss() {
    localStorage.setItem("pwa-notified", "1");
    setOpen(false);
  }

  async function handleInstall() {
    try {
      if (deferredPrompt.current) {
        deferredPrompt.current.prompt();
        const { outcome } = await deferredPrompt.current.userChoice;
        deferredPrompt.current = null;
        if (outcome === "accepted") dismiss();
      } else {
        // No deferred prompt available (e.g. already installed or non-Chrome)
        dismiss();
      }
    } catch {
      dismiss();
    }
  }

  async function handleEnableNotifications() {
    setNotifState("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setNotifState("denied");
        return;
      }

      // Dynamically import Firebase to avoid SSR issues
      const [{ getFirebaseMessaging }, { getToken }] = await Promise.all([
        import("@/src/lib/firebase"),
        import("firebase/messaging"),
      ]);

      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        // Browser doesn't support FCM (e.g. old Safari) — still mark as done
        setNotifState("granted");
        return;
      }

      let registration = swReg.current;
      if (!registration && "serviceWorker" in navigator) {
        try {
          registration = await Promise.race([
            navigator.serviceWorker.register("/api/firebase-messaging-sw", {
              scope: "/",
              updateViaCache: "none",
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("SW registration timeout")), 8000)
            ),
          ]);
          swReg.current = registration;
        } catch {
          // SW unavailable — getToken will fail below and outer catch handles it
        }
      }

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration ?? undefined,
      });

      if (token) {
        const res = await fetch("/api/fcm-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) throw new Error("Failed to save FCM token");
      }

      setNotifState("granted");
    } catch {
      setNotifState("denied");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="font-mono text-xs text-accent mb-1">// install</p>
            <h2 id="pwa-modal-title" className="text-lg font-semibold text-foreground">
              Read my blog as an app
            </h2>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Install this site and get notified whenever I publish a new post — no app store needed.
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Close"
            className="shrink-0 mt-0.5 text-muted hover:text-foreground transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 2L14 14M14 2L2 14" />
            </svg>
          </button>
        </div>

        {/* Safari iOS instructions */}
        {browser === "safari-ios" && (
          <div className="mb-5 rounded-xl border border-border bg-background/60 p-4 space-y-1.5 text-sm">
            <p className="font-medium text-foreground mb-2">To install on iOS:</p>
            <p className="text-muted">
              1. Tap the{" "}
              <span className="font-mono text-accent">Share</span> button (↑) at
              the bottom of Safari
            </p>
            <p className="text-muted">
              2. Scroll and tap{" "}
              <span className="font-mono text-accent">Add to Home Screen</span>
            </p>
            <p className="text-muted">
              3. Tap{" "}
              <span className="font-mono text-accent">Add</span> in the
              top-right corner
            </p>
          </div>
        )}

        {/* Firefox instructions */}
        {browser === "firefox" && (
          <div className="mb-5 rounded-xl border border-border bg-background/60 p-4 text-sm text-muted">
            <p className="font-medium text-foreground mb-1">To install on Firefox:</p>
            <p>
              Tap the <span className="font-mono text-accent">⋮</span> menu →{" "}
              <span className="font-mono text-accent">Install</span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Native install button — Chrome / Edge / other Chromium */}
          {(browser === "chrome" || browser === "other") && (
            <button
              onClick={handleInstall}
              className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Add to Home Screen
            </button>
          )}

          {/* Notification opt-in */}
          {notifState === "idle" && (
            <button
              onClick={handleEnableNotifications}
              className="w-full rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent active:scale-[0.98] transition-all"
            >
              Notify me when I post something new
            </button>
          )}

          {notifState === "loading" && (
            <p className="text-center text-sm text-muted py-1">
              Enabling notifications…
            </p>
          )}

          {notifState === "granted" && (
            <p className="text-center text-sm text-accent py-1">
              Notifications enabled ✓
            </p>
          )}

          {notifState === "denied" && (
            <p className="text-center text-sm text-muted py-1">
              Notification permission denied. You can change this in browser settings.
            </p>
          )}

          <button
            onClick={dismiss}
            className="text-center text-xs text-muted hover:text-foreground transition-colors py-1"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
