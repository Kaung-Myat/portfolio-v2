import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { getBlogPosts } from "@/src/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog · Kaung Mrat Thu",
  description:
    "Notes and write-ups by Kaung Mrat Thu on Flutter, Dart, AI tooling, and shipping mobile apps.",
};

const POSTS_PER_PAGE = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {prevPage >= 1 && (
        <Link
          href={`/blog?page=${prevPage}`}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
        >
          ← Previous
        </Link>
      )}
      <span className="font-mono text-xs text-muted">
        Page {currentPage} of {totalPages}
      </span>
      {nextPage <= totalPages && (
        <Link
          href={`/blog?page=${nextPage}`}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
        >
          Next →
        </Link>
      )}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const posts = getBlogPosts();
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const currentPage = Math.min(Math.max(1, parseInt(page || "1", 10)), totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  if (paginatedPosts.length === 0) {
    notFound();
  }

  return (
    <main className="flex flex-1 w-full flex-col px-6 sm:px-10 md:px-16 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-12">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            // blog
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Writing.
          </h1>
          <p className="mt-3 text-muted max-w-prose">
            Short notes on what I&apos;m building and the things I figure out
            along the way.
          </p>
          {totalPosts > POSTS_PER_PAGE && (
            <p className="mt-2 font-mono text-xs text-muted">
              {totalPosts} posts · Page {currentPage} of {totalPages}
            </p>
          )}
        </header>

        {paginatedPosts.length === 0 ? (
          <p className="text-muted">Nothing posted yet — check back soon.</p>
        ) : (
          <ul className="divide-y divide-border">
            {paginatedPosts.map(({ frontmatter }) => (
              <li
                key={frontmatter.slug}
                className="group relative rounded-lg transition-colors hover:bg-surface/30"
              >
                <Link
                  href={`/blog/${frontmatter.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Read ${frontmatter.title}`}
                />
                <div className="flex flex-col gap-2 py-6 px-4 -mx-4 sm:flex-row sm:gap-8">
                  <time
                    dateTime={frontmatter.date}
                    className="shrink-0 font-mono text-xs text-muted sm:w-24 sm:pt-1"
                  >
                    {formatDate(frontmatter.date)}
                  </time>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-medium text-foreground tracking-tight group-hover:text-accent transition-colors">
                        {frontmatter.title}
                      </h2>
                      <div className="relative z-20 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                        <CopyLinkButton
                          variant="icon"
                          url={`/blog/${frontmatter.slug}`}
                          ariaLabel={`Copy link to ${frontmatter.title}`}
                        />
                      </div>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#888]">
                      {frontmatter.description}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px] text-muted">
                      {frontmatter.tags.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-border px-2 py-0.5"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}
