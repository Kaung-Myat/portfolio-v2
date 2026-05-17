import Image from "next/image";
import MDXContent from "@/app/components/MDXContent";
import { getAbout } from "@/src/lib/content";
import { profile } from "@/src/data/profile";

export const metadata = {
  title: "About · Kaung Mrat Thu",
  description:
    "About Kaung Mrat Thu — Frontend & Mobile Developer at Brainwave Data.",
};

const SKILLS = [
  { name: "Flutter", icon: "flutter.png" },
  { name: "Dart", icon: "dart.png" },
  { name: "Kotlin", icon: "kotlin.png" },
  { name: "Android", icon: "android.png" },
  { name: "Firebase", icon: "firebase.png" },
  { name: "Supabase", icon: "supabase.png" },
];

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function AboutPage() {
  const { frontmatter, content } = getAbout();

  return (
    <main className="flex flex-1 w-full flex-col px-6 sm:px-10 md:px-16 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-10">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            // about
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {frontmatter.name}
          </h1>
          <p className="mt-2 font-mono text-sm text-muted">
            aka {frontmatter.nickname}
          </p>
          <p className="mt-4 text-lg text-muted">
            {frontmatter.role} · {frontmatter.company}
          </p>
          <p className="mt-1 text-sm text-muted">{frontmatter.location}</p>

          {frontmatter.available && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-foreground">
                Open to opportunities
              </span>
            </div>
          )}
        </header>

        <section className="mb-12">
          <MDXContent source={content} />
        </section>

        <section className="mb-12">
          <h2 className="font-mono text-xs text-accent mb-4">// skills</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SKILLS.map((skill) => (
              <li
                key={skill.name}
                className="rounded-lg border border-border bg-surface/40 px-3 py-2.5 font-mono text-sm text-foreground text-center flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 relative flex-shrink-0">
                  <Image
                    src={`/images/skills/${skill.icon}`}
                    alt={skill.name}
                    fill
                    sizes="20px"
                    className="object-contain"
                  />
                </span>
                {skill.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-xs text-accent mb-4">// elsewhere</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <a
                href={frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <GitHubIcon />
                GitHub
              </a>
            </li>
            <li>
              <a
                href={frontmatter.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <FacebookIcon />
                Facebook
              </a>
            </li>
            <li>
              <a
                href={`mailto:${frontmatter.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <MailIcon />
                Email
              </a>
            </li>
            {profile.socials
              .filter((s) => s.label === "LinkedIn" || s.label === "YouTube")
              .map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                  >
                    {s.label === "LinkedIn" ? <LinkedInIcon /> : <YouTubeIcon />}
                    {s.label}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
