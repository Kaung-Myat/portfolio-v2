import ProjectGrid from "@/app/components/ProjectGrid";
import { getProjects } from "@/src/lib/content";

export const metadata = {
  title: "Projects · Kaung Mrat Thu",
  description:
    "Selected projects by Kaung Mrat Thu — Flutter apps, open-source packages, and web tools.",
};

export default function ProjectsPage() {
  const projects = getProjects().map((p) => p.frontmatter);

  return (
    <main className="flex flex-1 w-full flex-col px-6 sm:px-10 md:px-16 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            // projects
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
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
