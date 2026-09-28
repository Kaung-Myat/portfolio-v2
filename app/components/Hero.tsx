"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { profile } from "@/src/data/profile";
import type { GitHubStatsData, HeroCta } from "@/src/types";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const line: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const portrait: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function TypingHeadline({
  text,
  startDelayMs,
}: {
  text: string;
  startDelayMs: number;
}) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const typeDelayMs = 55;
    const deleteDelayMs = 35;
    const completedPauseMs = 1800;
    const emptyPauseMs = 500;

    const schedule = (callback: () => void, delay: number) => {
      timeout = setTimeout(callback, delay);
    };

    const typeNext = (nextCount: number) => {
      if (cancelled) return;
      setCount(nextCount);

      if (nextCount < text.length) {
        schedule(() => typeNext(nextCount + 1), typeDelayMs);
      } else {
        schedule(() => deleteNext(text.length - 1), completedPauseMs);
      }
    };

    const deleteNext = (nextCount: number) => {
      if (cancelled) return;
      setCount(nextCount);

      if (nextCount > 0) {
        schedule(() => deleteNext(nextCount - 1), deleteDelayMs);
      } else {
        schedule(() => typeNext(1), emptyPauseMs);
      }
    };

    schedule(() => typeNext(0), startDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [text, startDelayMs, reduceMotion]);

  const visibleCount = reduceMotion ? text.length : count;
  const done = visibleCount >= text.length;

  return (
    <h1
      className="grid text-[1.9rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
      aria-label={text}
    >
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1"
      >
        {text}
        <span className="ml-1 inline-block w-0.5">&nbsp;</span>
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {text.slice(0, visibleCount)}
        <span
          className={`ml-1 inline-block h-[0.9em] w-0.5 translate-y-[0.12em] bg-accent ${
            done ? "animate-pulse" : ""
          }`}
        />
      </span>
    </h1>
  );
}

function CtaButton({ cta }: { cta: HeroCta }) {
  const base =
    "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const styles =
    cta.variant === "primary"
      ? "bg-accent text-background hover:bg-accent/90"
      : "border border-border text-foreground hover:bg-surface hover:border-foreground/20";

  return (
    <a
      href={cta.href}
      className={`${base} ${styles}`}
      {...(cta.download ? { download: true } : {})}
      {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {cta.label}
    </a>
  );
}

function GitHubStats({ initialData }: { initialData: GitHubStatsData | null }) {
  const [data, setData] = useState<GitHubStatsData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [failed, setFailed] = useState(false);

  const githubUrl =
    profile.socials.find((social) => social.label === "GitHub")?.href ?? "";
  const username = githubUrl.replace("https://github.com/", "");

  useEffect(() => {
    if (initialData) return;

    const controller = new AbortController();

    const fetchGitHubData = async () => {
      try {
        const res = await fetch("/api/github", {
          signal: controller.signal,
          cache: "no-store",
        });
        const json = (await res.json()) as GitHubStatsData & {
          error?: string;
        };

        if (
          !res.ok ||
          json.error ||
          !Number.isFinite(json.contributions) ||
          !Number.isFinite(json.repos) ||
          !Number.isFinite(json.followers)
        ) {
          throw new Error(json.error ?? "GitHub stats response was invalid");
        }

        setData(json);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.warn("GitHub fetch failed:", err);
          setFailed(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchGitHubData();
    return () => controller.abort();
  }, [initialData]);

  const weeks = 52;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;

  const contributionDays = useMemo(() => {
    if (data?.contributionDays?.length) {
      const padded = [
        ...Array(totalDays - data.contributionDays.length).fill(0),
        ...data.contributionDays,
      ];
      return padded.slice(-totalDays);
    }
    return Array<number>(totalDays).fill(0);
  }, [data, totalDays]);

  const levels = [
    "bg-muted/20",
    "bg-accent/30",
    "bg-accent/50",
    "bg-accent/70",
    "bg-accent",
  ];

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  if (loading) {
    return (
      <motion.div variants={line} className="pt-3">
        <div className="h-17 bg-muted/10 rounded animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div variants={line} className="pt-0">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap font-mono text-xs text-accent hover:underline"
        >
          @{data?.username || username}
        </a>
        <span className="font-mono text-xs text-muted">contributions in the last year</span>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto pb-2" aria-hidden="true">
        {Array.from({ length: weeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-0.5">
            {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
              const index = weekIndex * daysPerWeek + dayIndex;
              const level = getLevel(contributionDays[index] || 0);
              return (
                <div
                  key={dayIndex}
                  className={`h-2.5 w-2.5 rounded-sm ${levels[level]}`}
                  title={`${contributionDays[index] || 0} contributions`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-live="polite">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-accent">{data?.contributions ?? "—"}</span>
          <span className="text-muted">contributions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-accent">{data?.repos ?? "—"}</span>
          <span className="text-muted">public repos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-accent">{data?.followers ?? "—"}</span>
          <span className="text-muted">followers</span>
        </div>
      </div>

      {failed && (
        <p className="mt-2 font-mono text-[11px] text-muted">
          GitHub stats are temporarily unavailable.
        </p>
      )}
    </motion.div>
  );
}

interface ContactOption {
  label: string;
  href: string;
  icon: "telegram" | "email" | "facebook";
}

function ContactOptionsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const options: ContactOption[] = [
    {
      label: "Chat on Telegram",
      href: "https://telegram.me/kaungmratthu",
      icon: "telegram",
    },
    {
      label: "Send an email",
      href: "mailto:kaungmratthu.dev@gmail.com",
      icon: "email",
    },
    {
      label: "Message on Facebook",
      href: "https://www.facebook.com/Kkaungmratthuu",
      icon: "facebook",
    },
  ];

  function TelegramIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  }

  function EmailIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  function FacebookIcon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    );
  }

  const icons = { telegram: TelegramIcon, email: EmailIcon, facebook: FacebookIcon };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-4 max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Contact Me</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-muted hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {options.map((option) => {
                const Icon = icons[option.icon];
                return (
                  <a
                    key={option.icon}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-border px-4 py-3 text-foreground hover:border-accent hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Icon />
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero({
  initialGitHubStats,
}: {
  initialGitHubStats: GitHubStatsData | null;
}) {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="page-gutter relative w-full pb-8 pt-24 sm:pb-12 sm:pt-28 md:pt-32"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 md:gap-16"
        >
          <div className="order-1 flex min-w-0 flex-col gap-5 sm:gap-6">
            <motion.p
              variants={line}
              className="font-mono text-xs sm:text-sm text-accent tracking-tight"
            >
              {`// flutter developer · ${profile.company.toLowerCase()}`}
            </motion.p>

            <motion.div variants={line}>
              <TypingHeadline text={profile.tagline} startDelayMs={300} />
            </motion.div>

            <motion.p
              variants={line}
              className="max-w-xl text-[15px] leading-relaxed text-muted sm:text-lg"
            >
              {profile.intro}
            </motion.p>

            <motion.ul
              variants={line}
              className="flex flex-wrap gap-2 font-mono text-xs text-muted"
            >
              {profile.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-3 py-1"
                >
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={line}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              {profile.heroCtas.map((cta) => {
                if (cta.label === "Contact Me") {
                  return (
                    <button
                      key={cta.label}
                      type="button"
                      onClick={() => setContactModalOpen(true)}
                      className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium border border-border text-foreground hover:bg-surface hover:border-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {cta.label}
                    </button>
                  );
                }
                return <CtaButton key={cta.label} cta={cta} />;
              })}
            </motion.div>

            <GitHubStats initialData={initialGitHubStats} />
          </div>

          <motion.div
            variants={portrait}
            className="order-2 flex justify-center md:justify-end"
          >
          </motion.div>
        </motion.div>
      </section>

      <ContactOptionsModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
}
