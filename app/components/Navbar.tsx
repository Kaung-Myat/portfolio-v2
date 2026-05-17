"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/src/data/profile";

const MAIN_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];

const ASK_LINK = { label: "Ask AI about Me", href: "/ask" };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  );
}

function MenuBars() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function socialIcon(label: string) {
  switch (label) {
    case "GitHub": return <GitHubIcon />;
    case "Facebook": return <FacebookIcon />;
    case "LinkedIn": return <LinkedInIcon />;
    case "YouTube": return <YouTubeIcon />;
    default: return null;
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <header className="fixed top-6 inset-x-0 z-40 flex justify-end md:justify-center px-4 print:hidden">
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-1.5 backdrop-blur-md shadow-lg"
        >
          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
            {MAIN_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 transition-colors ${
                      active
                        ? "text-white bg-white/10"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            <div className="mx-1 h-4 w-px bg-white/20" aria-hidden="true" />

            <li>
              <Link
                href={ASK_LINK.href}
                aria-current={isActive(pathname, ASK_LINK.href) ? "page" : undefined}
                className={`group ml-1 flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors ${
                  isActive(pathname, ASK_LINK.href)
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{ASK_LINK.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Link>
            </li>
          </ul>

          {/* Mobile View Toggle - Removed min-w-60 to fix the pill width */}
          <div className="flex md:hidden items-center justify-center">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors focus-visible:outline-none"
            >
              <MenuBars />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
          >
            <div className="flex items-center justify-between h-16 px-6 sm:px-10 border-b border-[rgba(255,255,255,0.06)]">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-mono text-sm font-medium tracking-tight"
                aria-label="Kaung Mrat Thu — home"
              >
                <span className="text-accent">kaung</span>
                <span className="text-foreground"> mrat thu</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-foreground hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="font-mono text-sm">Close</span>
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 space-y-10">
              <section>
                <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Main Pages</p>
                <ul className="space-y-1">
                  {MAIN_LINKS.map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-lg px-3 py-3 font-mono text-base transition-colors ${
                            active
                              ? "text-accent bg-surface"
                              : "text-foreground hover:bg-surface/60"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section>
                <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Other</p>
                <ul>
                  <li>
                    <Link
                      href={ASK_LINK.href}
                      aria-current={isActive(pathname, ASK_LINK.href) ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-3 font-mono text-base transition-colors ${
                        isActive(pathname, ASK_LINK.href)
                          ? "border-accent bg-accent/20 text-accent"
                          : "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
                      }`}
                    >
                      <SparkleIcon />
                      {ASK_LINK.label}
                    </Link>
                  </li>
                </ul>
              </section>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.06)] px-6 sm:px-10 py-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Elsewhere</p>
              <ul className="flex flex-wrap gap-2">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:border-accent hover:text-accent transition-colors"
                    >
                      {socialIcon(s.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}