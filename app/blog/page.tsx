import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { getBlogPosts as getLocalBlogPosts } from "@/src/lib/content";
import { getAllBlogPosts } from "@/src/lib/wordpress";
import { createPageMetadata } from "@/src/lib/site";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Notes and write-ups by Kaung Mrat Thu on Flutter, Dart, AI tooling, and shipping mobile apps.",
  path: "/blog",
});

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
  const requestedPage = Number.parseInt(page || "1", 10);
  const currentPage = Number.isFinite(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;
  const localPosts = getLocalBlogPosts().map(({ frontmatter }, index) => ({
    id: -(index + 1),
    title: frontmatter.title,
    slug: frontmatter.slug,
    description: frontmatter.description,
    publishedAt: frontmatter.date,
    tags: frontmatter.tags,
  }));
  const wordpressPosts = await getAllBlogPosts().catch(() => []);
  const postsBySlug = new Map(localPosts.map((post) => [post.slug, post]));
  for (const post of wordpressPosts) postsBySlug.set(post.slug, post);
  const allPosts = [...postsBySlug.values()].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  if (currentPage > Math.max(totalPages, 1)) notFound();

  return (
    <main className="page-gutter flex w-full flex-1 flex-col pb-16 pt-24 sm:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-12">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            {"// blog"}
          </p>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
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

        {posts.length === 0 ? (
          <p className="text-muted">Nothing posted yet — check back soon.</p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li key={post.id} className="group relative">
                <Link
                  href={`/blog/${post.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Read ${post.title}`}
                />
                <div className="flex flex-col gap-2 py-6 px-4 -mx-4 sm:flex-row sm:gap-8">
                  <time
                    dateTime={post.publishedAt}
                    className="shrink-0 font-mono text-xs text-muted sm:w-24 sm:pt-1"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-lg">
                        {post.title}
                      </h2>
                      <div className="relative z-20 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                        <CopyLinkButton
                          variant="icon"
                          url={`/blog/${post.slug}`}
                          ariaLabel={`Copy link to ${post.title}`}
                        />
                      </div>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {post.description}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-muted">
                      {post.tags.map((t) => (
                        <li
                          key={t}
                          className="before:mr-2 before:text-border before:content-['/'] first:before:hidden"
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
