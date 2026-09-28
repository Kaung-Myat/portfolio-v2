import ProjectGrid from "@/app/components/ProjectGrid";
import { getProjects } from "@/src/lib/content";
import { createPageMetadata } from "@/src/lib/site";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected projects by Kaung Mrat Thu — Flutter apps, open-source packages, and web tools.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getProjects().map((p) => p.frontmatter);

  return (
    <main className="page-gutter flex w-full flex-1 flex-col pb-16 pt-24 sm:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            {"// projects"}
          </p>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
            Things I&apos;ve built.
          </h1>
          <p className="mt-3 text-muted max-w-prose">
            A mix of production work, open-source packages, and side projects —
            mostly Flutter on mobile with some web sprinkled in.
          </p>
        </header>

        <ProjectGrid projects={projects} />
      </div>
    </main>
  );
}
