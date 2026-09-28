"use client";

import { useEffect, useState } from "react";

type ThemePreference = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "portfolio-theme";

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  symbol: string;
}> = [
  { value: "light", label: "Use light theme", symbol: "☀" },
  { value: "dark", label: "Use dark theme", symbol: "☾" },
  { value: "system", label: "Use system theme", symbol: "▣" },
];

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;

  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.dataset.theme = theme;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies when storage is unavailable.
  }
}

function SlidersIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-4 w-4 flex-col justify-between py-0.5"
    >
      <span className="relative block h-px w-full bg-current">
        <span className="absolute -top-0.75 left-1 h-1.5 w-1.5 rounded-full border border-current bg-surface" />
      </span>
      <span className="relative block h-px w-full bg-current">
        <span className="absolute -top-0.75 right-0.5 h-1.5 w-1.5 rounded-full border border-current bg-surface" />
      </span>
      <span className="relative block h-px w-full bg-current">
        <span className="absolute -top-0.75 left-0.5 h-1.5 w-1.5 rounded-full border border-current bg-surface" />
      </span>
    </span>
  );
}

export default function ThemeSwitcher() {
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>("system");

  useEffect(() => {
    let stored: ThemePreference = "system";

    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY);
      if (value === "light" || value === "dark" || value === "system") {
        stored = value;
      }
    } catch {
      // Keep the system preference when storage is unavailable.
    }

    const timeout = window.setTimeout(() => setTheme(stored), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!expanded) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [expanded]);

  const chooseTheme = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="fixed left-4 top-4 z-[70] sm:left-6 sm:top-6 print:hidden">
      {expanded ? (
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Theme options"
        >
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Close theme options"
            title="Close"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/95 text-lg text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span aria-hidden="true">×</span>
          </button>

          {OPTIONS.map((option) => {
            const selected = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => chooseTheme(option.value)}
                aria-label={option.label}
                aria-pressed={selected}
                title={option.value[0].toUpperCase() + option.value.slice(1)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-base shadow-lg backdrop-blur-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface/95 text-foreground hover:border-accent hover:text-accent"
                }`}
              >
                <span aria-hidden="true">{option.symbol}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Open theme options"
          aria-expanded="false"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <SlidersIcon />
        </button>
      )}
    </div>
  );
}
