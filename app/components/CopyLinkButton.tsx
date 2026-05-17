"use client";

import { useEffect, useState } from "react";

function ClipboardIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type Props = {
  url?: string;
  variant?: "label" | "icon";
  className?: string;
  ariaLabel?: string;
};

export default function CopyLinkButton({
  url,
  variant = "label",
  className,
  ariaLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = url
      ? url.startsWith("/")
        ? `${window.location.origin}${url}`
        : url
      : window.location.href;
    navigator.clipboard
      .writeText(target)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={ariaLabel ?? (copied ? "Link copied" : "Copy link")}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:text-accent transition-colors ${className ?? ""}`}
      >
        {copied ? <CheckIcon /> : <ClipboardIcon />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel ?? (copied ? "Link copied" : "Copy link")}
      className={`inline-flex items-center gap-1.5 rounded-full font-mono text-xs text-muted hover:text-accent transition-colors ${className ?? ""}`}
    >
      {copied ? <CheckIcon /> : <ClipboardIcon />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
