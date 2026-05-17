import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MDXContent from "@/app/components/MDXContent";
import { getProject, getProjects } from "@/src/lib/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getProject(slug);
    return {
      title: `${frontmatter.title} · Kaung Mrat Thu`,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Project not found" };
  }
}

function StatusBadge({ status }: { status: string }) {
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
      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styles}`}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  let project;
  try {
    project = getProject(slug);
  } catch {
    notFound();
  }
  const { frontmatter, content } = project;

  return (
    <main className="flex flex-1 w-full flex-col px-6 sm:px-10 md:px-16 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors mb-8"
        >
          <span aria-hidden="true">←</span> back to projects
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <StatusBadge status={frontmatter.status} />
            <span className="font-mono text-xs text-muted">
              {formatDate(frontmatter.date)}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {frontmatter.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {frontmatter.description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5 font-mono text-[11px] text-muted">
            {frontmatter.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border px-2.5 py-0.5"
              >
                {t}
              </li>
            ))}
          </ul>

          {(frontmatter.github || frontmatter.pubdev) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {frontmatter.github && (
                <a
                  href={frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  GitHub →
                </a>
              )}
              {frontmatter.pubdev && (
                <a
                  href={frontmatter.pubdev}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  pub.dev →
                </a>
              )}
            </div>
          )}
        </header>

        <article className="mt-10">
          <MDXContent source={content} />
        </article>
      </div>
    </main>
  );
}
