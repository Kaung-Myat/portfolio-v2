import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MDXContent from "@/app/components/MDXContent";
import JsonLd from "@/app/components/JsonLd";
import ProjectCover from "@/app/components/ProjectCover";
import { getProject, getProjects } from "@/src/lib/content";
import { absoluteUrl } from "@/src/lib/site";

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
    const title = `${frontmatter.title} · Kaung Mrat Thu`;
    const url = absoluteUrl(`/projects/${frontmatter.slug}`);
    const image = frontmatter.cover
      ? absoluteUrl(frontmatter.cover)
      : undefined;
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        title,
        description: frontmatter.description,
        url,
        images: image ? [{ url: image, alt: frontmatter.title }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: frontmatter.description,
        images: image ? [image] : [],
      },
    };
  } catch {
    return { title: "Project not found" };
  }
}

function StatusBadge({ status }: { status: string }) {
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
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: frontmatter.title,
    description: frontmatter.description,
    url: absoluteUrl(`/projects/${frontmatter.slug}`),
    dateCreated: new Date(frontmatter.date).toISOString(),
    applicationCategory: "DeveloperApplication",
    operatingSystem: frontmatter.tags.includes("Flutter")
      ? "Android, iOS, Web"
      : "Cross-platform",
    keywords: frontmatter.tags.join(", "),
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl("/")}#person`,
      name: "Kaung Mrat Thu",
    },
    ...(frontmatter.cover
      ? { image: absoluteUrl(frontmatter.cover) }
      : {}),
    ...(frontmatter.live ? { installUrl: frontmatter.live } : {}),
    ...(frontmatter.github ? { codeRepository: frontmatter.github } : {}),
  };

  return (
    <main className="page-gutter flex w-full flex-1 flex-col pb-16 pt-24 sm:py-24">
      <JsonLd data={projectJsonLd} />
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
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {frontmatter.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {frontmatter.description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-muted">
            {frontmatter.tags.map((t) => (
              <li
                key={t}
                className="before:mr-2 before:text-border before:content-['/'] first:before:hidden"
              >
                {t}
              </li>
            ))}
          </ul>

          {(frontmatter.github || frontmatter.pubdev || frontmatter.live) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {frontmatter.live && (
                <a
                  href={frontmatter.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="outbound_click"
                  data-analytics-label={`${frontmatter.slug} live project`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  View live project ↗
                </a>
              )}
              {frontmatter.github && (
                <a
                  href={frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="outbound_click"
                  data-analytics-label={`${frontmatter.slug} GitHub`}
                  className="inline-flex min-h-11 items-center gap-2 border-b border-border px-1 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  GitHub →
                </a>
              )}
              {frontmatter.pubdev && (
                <a
                  href={frontmatter.pubdev}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="outbound_click"
                  data-analytics-label={`${frontmatter.slug} pub.dev`}
                  className="inline-flex min-h-11 items-center gap-2 border-b border-border px-1 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  pub.dev →
                </a>
              )}
            </div>
          )}
        </header>

        <div className="group mt-10">
          <ProjectCover
            title={frontmatter.title}
            cover={frontmatter.cover}
            sizes="(max-width: 768px) calc(100vw - 2.5rem), 768px"
          />
        </div>

        <section
          aria-labelledby="case-study-summary"
          className="mt-12 border-y border-border py-8 sm:py-10"
        >
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="font-mono text-xs text-accent">{"// case study"}</p>
              <h2
                id="case-study-summary"
                className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl"
              >
                At a glance
              </h2>
            </div>
            <dl className="grid grid-cols-2 gap-x-7 gap-y-3 text-sm md:col-span-5 md:justify-self-end">
              <div>
                <dt className="text-xs text-muted">Role</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {frontmatter.role}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Status</dt>
                <dd className="mt-1 font-medium capitalize text-foreground">
                  {frontmatter.status.replace("-", " ")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 divide-y divide-border border-t border-border">
            {[
              {
                number: "01",
                label: "Problem",
                copy: frontmatter.problem ?? frontmatter.description,
              },
              {
                number: "02",
                label: "Solution",
                copy: frontmatter.solution ?? frontmatter.description,
              },
              {
                number: "03",
                label: "Outcome",
                copy: frontmatter.outcome ?? frontmatter.description,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="grid gap-3 py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  <span className="mr-3 text-muted/60">{item.number}</span>
                  {item.label}
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <article className="mt-12">
          <p className="mb-2 font-mono text-xs text-accent">
            {"// implementation & details"}
          </p>
          <MDXContent source={content} />
        </article>
      </div>
    </main>
  );
}
