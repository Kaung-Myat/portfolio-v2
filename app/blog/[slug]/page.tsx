import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import MDXContent from "@/app/components/MDXContent";
import { getBlogPost, getBlogPosts, extractHeadings, type TocHeading } from "@/src/lib/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getBlogPost(slug);
    return {
      title: `${frontmatter.title} · Kaung Mrat Thu`,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Post not found" };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function TableOfContents({ headings, isMobile }: { headings: TocHeading[], isMobile?: boolean }) {
  if (headings.length === 0) return null;

  const getH2sAndTheirH3s = () => {
    const result: { h2: TocHeading; h3s: TocHeading[] }[] = [];
    let currentH2: TocHeading | null = null;
    let currentH3s: TocHeading[] = [];

    headings.forEach((heading) => {
      if (heading.level === 2) {
        if (currentH2) {
          result.push({ h2: currentH2, h3s: currentH3s });
        }
        currentH2 = heading;
        currentH3s = [];
      } else if (heading.level === 3 && currentH2) {
        currentH3s.push(heading);
      }
    });

    if (currentH2) {
      result.push({ h2: currentH2, h3s: currentH3s });
    }

    return result;
  };

  const h2sWithH3s = getH2sAndTheirH3s();

  if (h2sWithH3s.length === 0) return null;

  return (
    <nav className={isMobile ? "max-h-[50vh] overflow-y-auto" : "p-4 rounded-lg border border-border bg-background max-h-[70vh] overflow-y-auto sticky top-28"}>
      {!isMobile && <h2 className="font-mono text-xs text-accent mb-3">On this page</h2>}
      <ul className="space-y-1 text-sm">
        {h2sWithH3s.map(({ h2, h3s }) => (
          <li key={h2.id}>
            <a
              href={`#${h2.id}`}
              className="text-muted hover:text-accent transition-colors block py-1"
            >
              {h2.text}
            </a>
            {h3s.length > 0 && (
              <ul className="ml-4 space-y-1">
                {h3s.map((h3) => (
                  <li key={h3.id}>
                    <a
                      href={`#${h3.id}`}
                      className="text-muted/70 hover:text-accent transition-colors block py-1 text-xs"
                    >
                      {h3.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  let post;
  try {
    post = getBlogPost(slug);
  } catch {
    notFound();
  }
  const { frontmatter, content } = post;
  const headings = extractHeadings(content);

  return (
    // Added pt-28 (112px top padding) to clear the mobile navbar cleanly
    <main className="flex flex-1 w-full flex-col px-6 sm:px-10 md:px-16 pt-28 pb-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors mb-8"
          >
            <span aria-hidden="true">←</span> back to blog
          </Link>

          <header className="mb-10">
            {frontmatter.cover && (
              <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden">
                <Image
                  src={frontmatter.cover}
                  alt={frontmatter.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <time
                dateTime={frontmatter.date}
                className="font-mono text-xs text-muted"
              >
                {formatDate(frontmatter.date)}
              </time>
              <CopyLinkButton ariaLabel={`Copy link to ${frontmatter.title}`} />
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
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
          </header>

          {/* Styled Mobile Table of Contents - Now placed BELOW the header metadata */}
          {headings.length > 0 && (
            <div className="block lg:hidden mb-10">
              <details className="group rounded-xl border border-border bg-background/50 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-mono text-sm text-foreground hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2 text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                    </svg>
                    <span>Table of Contents</span>
                  </div>
                  <svg className="w-4 h-4 text-muted transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <div className="border-t border-border px-4 py-3">
                  <TableOfContents headings={headings} isMobile={true} />
                </div>
              </details>
            </div>
          )}

          <article>
            <MDXContent source={content} />
          </article>

        </div>

        <aside className="hidden lg:block relative">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </main>
  );
}