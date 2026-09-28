"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuMonitor,
  LuMoon,
  LuSettings2,
  LuSun,
  LuX,
} from "react-icons/lu";

type ThemePreference = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "portfolio-theme";

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  Icon: IconType;
}> = [
  { value: "light", label: "Use light theme", Icon: LuSun },
  { value: "dark", label: "Use dark theme", Icon: LuMoon },
  { value: "system", label: "Use system theme", Icon: LuMonitor },
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
          className="flex items-center gap-1 rounded-full border border-border bg-surface/95 p-1 shadow-lg backdrop-blur-xl"
          role="group"
          aria-label="Theme options"
        >
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Close theme options"
            title="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LuX aria-hidden="true" size={17} strokeWidth={1.8} />
          </button>

          <span className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />

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
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selected
                    ? "bg-foreground text-background"
                    : "text-muted hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <option.Icon aria-hidden="true" size={17} strokeWidth={1.8} />
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
          title="Theme preferences"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <LuSettings2 aria-hidden="true" size={18} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
