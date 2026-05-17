"use client";

import { motion, type Variants } from "framer-motion";
import { experience } from "@/src/data/experience";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ExperienceTimeline() {
  return (
    <section
      id="experience"
      className="relative w-full px-6 sm:px-10 md:px-16 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-12">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            // experience
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Where I&apos;ve been building.
          </h2>
        </header>

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative pl-8 sm:pl-10"
        >
          <span
            aria-hidden="true"
            className="absolute left-1.75 sm:left-2.25 top-2 bottom-2 w-px bg-border"
          />

          {experience.map((entry) => (
            <motion.li
              key={entry.id}
              variants={item}
              className="relative pb-10 last:pb-0"
            >
              <span
                aria-hidden="true"
                className={`absolute -left-8 sm:-left-10 top-1.5 grid h-4 w-4 place-items-center rounded-full ${
                  entry.current
                    ? "bg-accent shadow-[0_0_0_4px_rgba(124,106,247,0.18)]"
                    : "bg-surface border border-border"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    entry.current ? "bg-background" : "bg-muted"
                  }`}
                />
              </span>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-base sm:text-lg font-medium text-foreground">
                  {entry.role}
                </h3>
                <span className="text-muted">·</span>
                <span className="text-sm sm:text-base text-foreground/80">
                  {entry.company}
                </span>
              </div>

              <p className="mt-1 font-mono text-xs text-muted">
                {entry.period}
              </p>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted max-w-prose">
                {entry.description}
              </p>

              {entry.stack && entry.stack.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-muted">
                  {entry.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border px-2.5 py-0.5"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
