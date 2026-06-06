"use client";

import { useWebPush } from "@/app/hooks/useWebPush";

/**
 * Always-available opt-in control for blog push notifications. Unlike the
 * one-time install modal, this is never suppressed by localStorage, so visitors
 * (and the author, when testing across devices) can subscribe at any time.
 */
export default function NotificationBell() {
  const { state, subscribe } = useWebPush();

  // Nothing to show on browsers without the Notification API.
  if (state === "unsupported") return null;

  const base =
    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors";

  if (state === "granted") {
    return (
      <span className={`${base} border-accent text-accent`}>
        <BellIcon />
        Notifications on
      </span>
    );
  }

  if (state === "denied") {
    return (
      <span
        className={`${base} border-border text-muted`}
        title="Notifications are blocked — enable them in your browser settings."
      >
        <BellOffIcon />
        Notifications blocked
      </span>
    );
  }

  const loading = state === "loading";

  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={loading}
      aria-busy={loading}
      className={`${base} border-border text-foreground hover:border-accent hover:text-accent active:scale-[0.98] disabled:opacity-60`}
    >
      <BellIcon />
      {loading ? "Enabling…" : "Get notified of new posts"}
    </button>
  );
}

function BellIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.5a4 4 0 0 0-4 4c0 3-1.5 4-1.5 4h11s-1.5-1-1.5-4a4 4 0 0 0-4-4Z" />
      <path d="M6.5 13a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

function BellOffIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.5a4 4 0 0 0-4 4c0 3-1.5 4-1.5 4h11s-1.5-1-1.5-4a4 4 0 0 0-4-4Z" />
      <path d="M6.5 13a1.5 1.5 0 0 0 3 0" />
      <path d="M2 2l12 12" />
    </svg>
  );
}
