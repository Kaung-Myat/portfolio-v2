import type { IconType } from "react-icons";
import {
  SiAndroid,
  SiDart,
  SiFirebase,
  SiFlutter,
  SiKotlin,
  SiSupabase,
} from "react-icons/si";
import MDXContent from "@/app/components/MDXContent";
import { getAbout } from "@/src/lib/content";
import { profile } from "@/src/data/profile";
import { createPageMetadata } from "@/src/lib/site";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "About Kaung Mrat Thu — Frontend & Mobile Developer at Brainwave Data.",
  path: "/about",
});

const SKILLS: Array<{ name: string; Icon: IconType; color: string }> = [
  { name: "Flutter", Icon: SiFlutter, color: "#02569B" },
  { name: "Dart", Icon: SiDart, color: "#0175C2" },
  { name: "Kotlin", Icon: SiKotlin, color: "#7F52FF" },
  { name: "Android", Icon: SiAndroid, color: "#3DDC84" },
  { name: "Firebase", Icon: SiFirebase, color: "#FF9100" },
  { name: "Supabase", Icon: SiSupabase, color: "#3FCF8E" },
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
    <main className="page-gutter flex w-full flex-1 flex-col pb-16 pt-24 sm:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-10">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            {"// about"}
          </p>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
            {frontmatter.name}
          </h1>
          <p className="mt-2 font-mono text-sm text-muted">
            aka {frontmatter.nickname}
          </p>
          <p className="mt-4 text-base text-muted sm:text-lg">
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
          <h2 className="mb-5 font-mono text-xs text-accent">{"// skills"}</h2>
          <ul className="grid grid-cols-2 border-b border-border sm:grid-cols-3">
            {SKILLS.map((skill, index) => (
              <li
                key={skill.name}
                className="flex min-w-0 items-center gap-3 border-t border-border py-4 pr-3 font-mono text-xs text-foreground sm:text-sm"
              >
                <span className="w-5 shrink-0 text-[10px] text-muted/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="grid h-6 w-6 shrink-0 place-items-center">
                  <skill.Icon
                    aria-hidden="true"
                    className="h-[18px] w-[18px]"
                    style={{ color: skill.color }}
                  />
                </span>
                {skill.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-5 font-mono text-xs text-accent">{"// elsewhere"}</h2>
          <ul className="grid border-b border-border sm:grid-cols-2 sm:gap-x-8">
            <li>
              <a
                href={frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="outbound_click"
                data-analytics-label="About GitHub"
                className="group flex min-h-14 items-center gap-3 border-t border-border text-sm text-foreground transition-colors hover:text-accent"
              >
                <GitHubIcon />
                <span>GitHub</span>
                <span className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={frontmatter.facebook}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="outbound_click"
                data-analytics-label="About Facebook"
                className="group flex min-h-14 items-center gap-3 border-t border-border text-sm text-foreground transition-colors hover:text-accent"
              >
                <FacebookIcon />
                <span>Facebook</span>
                <span className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${frontmatter.email}`}
                data-analytics-event="contact_method"
                data-analytics-label="About email"
                className="group flex min-h-14 items-center gap-3 border-t border-border text-sm text-foreground transition-colors hover:text-accent"
              >
                <MailIcon />
                <span>Email</span>
                <span className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
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
                    data-analytics-event="outbound_click"
                    data-analytics-label={`About ${s.label}`}
                    className="group flex min-h-14 items-center gap-3 border-t border-border text-sm text-foreground transition-colors hover:text-accent"
                  >
                    {s.label === "LinkedIn" ? <LinkedInIcon /> : <YouTubeIcon />}
                    <span>{s.label}</span>
                    <span className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
