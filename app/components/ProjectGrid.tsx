"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProjectFrontmatter } from "@/src/lib/content";

const FILTERS = ["All", "Flutter", "Web", "Open Source"] as const;
type Filter = (typeof FILTERS)[number];

function GitHubIcon() {
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
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function PubDevIcon() {
  return (
    <span className="font-mono text-[10px] font-semibold tracking-tight">
      pub.dev
    </span>
  );
}

function StatusBadge({ status }: { status: ProjectFrontmatter["status"] }) {
  const styles =
    status === "active"
      ? "bg-accent/15 text-accent"
      : status === "in-progress"
        ? "bg-yellow-500/15 text-yellow-400"
        : "bg-surface text-muted";
  const label =
    status === "in-progress"
      ? "In Progress"
      : status[0].toUpperCase() + status.slice(1);
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styles}`}
    >
      {label}
    </span>
  );
}

function CoverPlaceholder({
  title,
  cover,
}: {
  title: string;
  cover?: string;
}) {
  if (cover) {
    return (
      <div
        className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-surface"
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
      </div>
    );
  }
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface to-background flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
      <span className="relative font-mono text-3xl font-semibold text-foreground/30">
        {title[0]}
      </span>
    </div>
  );
}

export default function ProjectGrid({
  projects,
}: {
  projects: ProjectFrontmatter[];
}) {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const list =
      filter === "All"
        ? projects
        : projects.filter((p) => p.tags.includes(filter));
    return [...list].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filter, projects]);

  return (
    <>
      <ul className="mb-8 flex flex-wrap gap-2 font-mono text-xs">
        {FILTERS.map((f) => (
          <li key={f}>
            <button
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full border px-3 py-1.5 transition-colors ${
                filter === f
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface/60 text-muted hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {f}
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-muted">No projects match this filter yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filtered.map((p) => (
            <li
              key={p.slug}
              className="group relative rounded-2xl border border-border bg-surface/30 p-5 transition-colors hover:border-accent/40"
            >
              <Link
                href={`/projects/${p.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`Read about ${p.title}`}
              />

              <CoverPlaceholder title={p.title} cover={p.cover} />

              <div className="mt-4 flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                  {p.title}
                </h2>
                {p.featured && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                    Featured
                  </span>
                )}
                <span className="ml-auto">
                  <StatusBadge status={p.status} />
                </span>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-[#888] line-clamp-3">
                {p.description}
              </p>

              <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px] text-muted">
                {p.tags.slice(0, 5).map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border px-2 py-0.5"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              {(p.github || p.pubdev) && (
                <div className="mt-4 flex items-center gap-3 text-muted">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-20 inline-flex items-center gap-1.5 text-xs hover:text-accent transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GitHubIcon />
                      GitHub
                    </a>
                  )}
                  {p.pubdev && (
                    <a
                      href={p.pubdev}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-20 inline-flex items-center gap-1.5 text-xs hover:text-accent transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PubDevIcon />
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
