import Link from "next/link";
import ProjectCover from "@/app/components/ProjectCover";
import type { ProjectFrontmatter } from "@/src/lib/content";

export default function FeaturedProjects({
  projects,
}: {
  projects: ProjectFrontmatter[];
}) {
  return (
    <section
      id="selected-work"
      aria-labelledby="selected-work-title"
      className="page-gutter w-full py-12 sm:py-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
          <div>
            <p className="mb-2 font-mono text-xs text-accent sm:text-sm">
              {"// selected work"}
            </p>
            <h2
              id="selected-work-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Products I&apos;ve shaped.
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden shrink-0 font-mono text-xs text-muted transition-colors hover:text-accent sm:inline-flex"
          >
            View all projects →
          </Link>
        </header>

        <ol className="border-b border-border">
          {projects.map((project, index) => (
            <li key={project.slug} className="border-t border-border">
              <article className="group grid gap-6 py-8 sm:py-10 md:grid-cols-12 md:items-center md:gap-8 lg:gap-12">
                <div
                  className={`md:col-span-5 ${
                    index % 2 === 1
                      ? "md:order-2 md:pl-4"
                      : "md:order-1 md:pr-4"
                  }`}
                >
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <span className="text-muted/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-border" aria-hidden="true" />
                    <span className="text-accent">{project.role}</span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                    <Link
                      href={`/projects/${project.slug}`}
                      data-analytics-event="project_open"
                      data-analytics-label={project.slug}
                      className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted sm:text-base">
                    {project.outcome ?? project.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] text-muted sm:text-[11px]">
                    {project.tags.slice(0, 3).map((tag) => (
                      <li
                        key={tag}
                        className="before:mr-2 before:text-border before:content-['/'] first:before:hidden"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/projects/${project.slug}`}
                    data-analytics-event="project_open"
                    data-analytics-label={project.slug}
                    className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Read case study
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  data-analytics-event="project_open"
                  data-analytics-label={project.slug}
                  className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background md:col-span-7 ${
                    index % 2 === 1 ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <ProjectCover
                    title={project.title}
                    cover={project.cover}
                    sizes="(max-width: 767px) calc(100vw - 2.5rem), 58vw"
                  />
                </Link>
              </article>
            </li>
          ))}
        </ol>

        <Link
          href="/projects"
          className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border text-sm font-medium transition-colors hover:border-accent hover:text-accent sm:hidden"
        >
          View all projects
        </Link>
      </div>
    </section>
  );
}
