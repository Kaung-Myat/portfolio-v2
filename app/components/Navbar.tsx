"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MAIN_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];

const MOBILE_LINKS = [MAIN_LINKS[0], MAIN_LINKS[1], MAIN_LINKS[4]];
const MORE_LINKS = [MAIN_LINKS[2], MAIN_LINKS[3], { label: "Ask AI", href: "/ask" }];
const ASK_LINK = { label: "Ask AI about Me", href: "/ask" };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const moreOpen = openedOnPath === pathname;
  const moreActive = MORE_LINKS.some((link) => isActive(pathname, link.href));

  useEffect(() => {
    if (!moreOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOnPath(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [moreOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-6 z-40 hidden justify-center px-4 md:flex print:hidden">
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-border bg-surface/80 px-2 py-1.5 shadow-lg backdrop-blur-md"
        >
          <ul className="flex items-center gap-1 text-sm font-medium">
            {MAIN_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 transition-colors ${
                      active
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            <li
              className="mx-1 h-4 w-px bg-foreground/15"
              aria-hidden="true"
            />

            <li>
              <Link
                href={ASK_LINK.href}
                aria-current={isActive(pathname, ASK_LINK.href) ? "page" : undefined}
                className={`group ml-1 flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors ${
                  isActive(pathname, ASK_LINK.href)
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <span>{ASK_LINK.label}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="opacity-50 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {moreOpen && (
        <button
          type="button"
          aria-label="Close more navigation"
          onClick={() => setOpenedOnPath(null)}
          className="fixed inset-0 z-40 bg-transparent md:hidden print:hidden"
        />
      )}

      <div className="mobile-nav-shell fixed left-1/2 z-50 w-max max-w-[calc(100vw-1rem)] -translate-x-1/2 md:hidden print:hidden">
        {moreOpen && (
          <div
            id="mobile-more-menu"
            className="absolute bottom-[calc(100%+0.625rem)] right-0 w-44 rounded-2xl border border-border bg-surface/95 p-1.5 text-foreground shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          >
            <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              More
            </p>
            <ul>
              {MORE_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpenedOnPath(null)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-10 items-center rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        active
                          ? "bg-foreground text-background"
                          : "text-muted hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <nav
          aria-label="Primary"
          className="rounded-full border border-border bg-surface/95 px-1 py-1 shadow-[0_8px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl min-[360px]:px-1.5"
        >
          <ul className="flex items-center">
            {MOBILE_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex min-h-11 items-center justify-center rounded-full px-2.5 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-[360px]:px-3.5 min-[360px]:text-xs ${
                      active
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-2.5 bottom-1 h-0.5 rounded-full bg-foreground transition-opacity min-[360px]:inset-x-3.5 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}

            <li>
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-controls="mobile-more-menu"
                onClick={() => setOpenedOnPath(moreOpen ? null : pathname)}
                className={`relative flex min-h-11 items-center justify-center rounded-full px-2.5 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-[360px]:px-3.5 min-[360px]:text-xs ${
                  moreActive || moreOpen
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted hover:text-foreground"
                }`}
              >
                <span>More</span>
                <span
                  aria-hidden="true"
                  className={`ml-1.5 h-1.5 w-1.5 border-b border-r border-current transition-transform ${
                    moreOpen ? "translate-y-0.5 rotate-[225deg]" : "-translate-y-0.5 rotate-45"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2.5 bottom-1 h-0.5 rounded-full bg-foreground transition-opacity min-[360px]:inset-x-3.5 ${
                    moreActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
