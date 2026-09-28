import Link from "next/link";

type Achievement = {
  value: string;
  label: string;
  detail: string;
  href: string;
};

export default function Achievements({
  projectCount,
  packageCount,
  articleCount,
}: {
  projectCount: number;
  packageCount: number;
  articleCount: number;
}) {
  const achievements: Achievement[] = [
    {
      value: String(packageCount),
      label: "Published packages",
      detail: "Developer tools available through pub.dev.",
      href: "/projects",
    },
    {
      value: String(projectCount),
      label: "Product builds",
      detail: "Mobile, language tooling, and open-source work.",
      href: "/projects",
    },
    {
      value: String(articleCount),
      label: "Technical articles",
      detail: "Practical notes on Flutter, tooling, and learning.",
      href: "/blog",
    },
    {
      value: "since ’24",
      label: "In production",
      detail: "Shipping Flutter and Android features at Brainwave Data.",
      href: "/resume",
    },
  ];

  return (
    <section
      aria-labelledby="achievements-title"
      className="page-gutter w-full py-12 sm:py-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 grid gap-4 sm:mb-10 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-7">
            <p className="mb-2 font-mono text-xs text-accent sm:text-sm">
              {"// track record"}
            </p>
            <h2
              id="achievements-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              What the work adds up to.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base md:col-span-5">
            Published tools, shipped product work, and practical writing—each
            number links back to its source.
          </p>
        </header>

        <ul className="divide-y divide-border border-y border-border lg:grid lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {achievements.map((achievement) => (
            <li
              key={achievement.label}
              className="group relative min-w-0 py-6 lg:px-6 lg:py-7 lg:first:pl-0 lg:last:pr-0"
            >
              <p className="font-mono text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
                {achievement.value}
              </p>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {achievement.label}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                {achievement.detail}
              </p>
              <Link
                href={achievement.href}
                data-analytics-event="achievement_open"
                data-analytics-label={achievement.label}
                className="mt-4 inline-flex min-h-8 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Explore
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
