import { experience } from "@/src/data/experience";
import { getAbout, getProjects } from "@/src/lib/content";

export const metadata = {
  title: "Resume · Kaung Mrat Thu",
  description:
    "Resume for Kaung Mrat Thu — Frontend & Mobile Developer at Brainwave Data.",
};

const SKILL_GROUPS: { label: string; items: string[] }[] = [
  { label: "Mobile", items: ["Flutter", "Dart", "Kotlin", "Android"] },
  { label: "Tools", items: ["Firebase", "Supabase", "Git", "Figma"] },
];

const EDUCATION = {
  school: "University of Computer Studies, Pyay (UCS Pyay)",
  degree: "B.C.Sc. — Computer Science",
  period: "2021 — Present",
};

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

export default function ResumePage() {
  const { frontmatter } = getAbout();
  const projects = getProjects().map((p) => p.frontmatter);

  return (
    <main className="flex flex-1 w-full flex-col px-6 sm:px-10 md:px-16 py-16 sm:py-24 print:py-8 print:bg-white print:text-black">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs sm:text-sm text-accent mb-2 print:text-[#7c6af7]">
              // resume
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight print:text-black">
              {frontmatter.name}
            </h1>
          </div>
          <a
            href="/resume.pdf"
            download
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-accent text-background px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors print:hidden"
          >
            <DownloadIcon />
            Download PDF
          </a>
        </div>

        <div className="mb-10 grid gap-1 font-mono text-xs text-muted print:text-black/70">
          <p className="text-sm text-foreground print:text-black">
            {frontmatter.role} · {frontmatter.company}
          </p>
          <p>{frontmatter.location}</p>
          <p>
            <a
              href={`mailto:${frontmatter.email}`}
              className="hover:text-accent transition-colors"
            >
              {frontmatter.email}
            </a>
          </p>
          <p>
            <a
              href={frontmatter.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {frontmatter.github}
            </a>
          </p>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 border-b border-accent/60 pb-2 font-mono text-xs uppercase tracking-wider text-accent print:text-[#7c6af7]">
            Experience
          </h2>
          <ul className="space-y-5">
            {experience.map((e) => (
              <li key={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-base font-medium text-foreground print:text-black">
                    {e.role} ·{" "}
                    <span className="text-foreground/80 print:text-black/80">
                      {e.company}
                    </span>
                  </h3>
                  <span className="font-mono text-xs text-muted print:text-black/60">
                    {e.period}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[#888] print:text-black/70">
                  {e.description}
                </p>
                {e.stack && e.stack.length > 0 && (
                  <p className="mt-2 font-mono text-[11px] text-muted print:text-black/60">
                    {e.stack.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 border-b border-accent/60 pb-2 font-mono text-xs uppercase tracking-wider text-accent print:text-[#7c6af7]">
            Projects
          </h2>
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.slug} className="flex flex-col sm:flex-row gap-2">
                <span className="shrink-0 font-medium text-foreground sm:w-48 print:text-black">
                  {p.title}
                </span>
                <span className="text-sm leading-relaxed text-[#888] print:text-black/70">
                  {p.description}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 border-b border-accent/60 pb-2 font-mono text-xs uppercase tracking-wider text-accent print:text-[#7c6af7]">
            Education
          </h2>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-base font-medium text-foreground print:text-black">
                {EDUCATION.school}
              </h3>
              <span className="font-mono text-xs text-muted print:text-black/60">
                {EDUCATION.period}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#888] print:text-black/70">
              {EDUCATION.degree}
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 border-b border-accent/60 pb-2 font-mono text-xs uppercase tracking-wider text-accent print:text-[#7c6af7]">
            Skills
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <dt className="mb-2 font-mono text-xs text-muted print:text-black/60">
                  {group.label}
                </dt>
                <dd>
                  <ul className="space-y-1 text-sm text-foreground print:text-black">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
