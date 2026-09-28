"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProjectCover from "@/app/components/ProjectCover";
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
  const label =
    status === "in-progress"
      ? "In Progress"
      : status[0].toUpperCase() + status.slice(1);
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          status === "active"
            ? "bg-accent"
            : status === "in-progress"
              ? "bg-yellow-400"
              : "bg-muted"
        }`}
      />
      {label}
    </span>
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
      <ul className="mb-8 flex gap-5 overflow-x-auto border-b border-border font-mono text-xs sm:gap-7">
        {FILTERS.map((f) => (
          <li key={f} className="shrink-0">
            <button
              type="button"
              onClick={() => setFilter(f)}
              data-analytics-event="project_filter"
              data-analytics-label={f}
              aria-pressed={filter === f}
              className={`relative min-h-11 pb-3 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-accent after:transition-opacity ${
                filter === f
                  ? "text-accent after:opacity-100"
                  : "text-muted after:opacity-0 hover:text-foreground"
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
        <ol className="border-b border-border">
          {filtered.map((p, index) => (
            <li
              key={p.slug}
              className="group border-t border-border py-8 sm:py-10"
            >
              <article className="grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
                <div className="md:col-span-7">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-mono text-[10px] text-muted/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <StatusBadge status={p.status} />
                    {p.featured && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                        Selected
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    <Link
                      href={`/projects/${p.slug}`}
                      data-analytics-event="project_open"
                      data-analytics-label={p.slug}
                      className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {p.title}
                    </Link>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                    {p.outcome ?? p.description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] text-muted sm:text-[11px]">
                    {p.tags.slice(0, 5).map((t) => (
                      <li
                        key={t}
                        className="before:mr-2 before:text-border before:content-['/'] first:before:hidden"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-5 text-muted">
                    <Link
                      href={`/projects/${p.slug}`}
                      data-analytics-event="project_open"
                      data-analytics-label={p.slug}
                      className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      Read case study <span aria-hidden="true">→</span>
                    </Link>
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 items-center gap-1.5 text-xs transition-colors hover:text-accent"
                        data-analytics-event="outbound_click"
                        data-analytics-label={`${p.slug} GitHub`}
                      >
                        <GitHubIcon /> GitHub
                      </a>
                    )}
                    {p.pubdev && (
                      <a
                        href={p.pubdev}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 items-center gap-1.5 text-xs transition-colors hover:text-accent"
                        data-analytics-event="outbound_click"
                        data-analytics-label={`${p.slug} pub.dev`}
                      >
                        <PubDevIcon />
                      </a>
                    )}
                  </div>
                </div>

                <Link
                  href={`/projects/${p.slug}`}
                  data-analytics-event="project_open"
                  data-analytics-label={p.slug}
                  className="md:col-span-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <ProjectCover
                    title={p.title}
                    cover={p.cover}
                    sizes="(max-width: 767px) calc(100vw - 2.5rem), 40vw"
                  />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
