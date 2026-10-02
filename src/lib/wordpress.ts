export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  contentHtml: string;
  publishedAt: string;
  modifiedAt: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
}

interface WordPressRenderedValue {
  rendered: string;
}

interface WordPressTerm {
  name: string;
  taxonomy: "category" | "post_tag";
}

interface WordPressMedia {
  alt_text?: string;
  source_url?: string;
}

interface WordPressPost {
  id: number;
  date: string;
  date_gmt?: string;
  modified: string;
  modified_gmt?: string;
  slug: string;
  title: WordPressRenderedValue;
  content: WordPressRenderedValue;
  excerpt: WordPressRenderedValue;
  jetpack_featured_media_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressTerm[][];
  };
}

const WORDPRESS_SITE =
  process.env.WORDPRESS_SITE ?? "kaungmyatthuvercel.wordpress.com";
const WORDPRESS_API_URL = `https://public-api.wordpress.com/wp/v2/sites/${WORDPRESS_SITE}`;
const CACHE_SECONDS = 300;
const DESCRIPTION_MAX_LENGTH = 180;

function decodeHtml(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    nbsp: " ",
    ndash: "–",
    quot: '"',
    rdquo: "”",
    rsquo: "’",
  };

  return value.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (entity, code) => {
    if (code.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }
    if (code.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }
    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

function textFromHtml(value: string) {
  return decodeHtml(
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  const candidate = value.slice(0, maxLength - 1).trimEnd();
  const lastSpace = candidate.lastIndexOf(" ");
  const shortened =
    lastSpace >= Math.floor(maxLength * 0.7)
      ? candidate.slice(0, lastSpace)
      : candidate;

  return `${shortened.trimEnd()}…`;
}

function mapPost(post: WordPressPost): BlogPost {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const tags = terms
    .filter((term) => term.taxonomy === "post_tag")
    .map((term) => decodeHtml(term.name));
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: post.id,
    title: textFromHtml(post.title.rendered),
    slug: post.slug,
    description: truncateText(
      textFromHtml(post.excerpt.rendered),
      DESCRIPTION_MAX_LENGTH,
    ),
    contentHtml: post.content.rendered,
    publishedAt: post.date_gmt ? `${post.date_gmt}Z` : post.date,
    modifiedAt: post.modified_gmt ? `${post.modified_gmt}Z` : post.modified,
    tags,
    cover:
      featuredMedia?.source_url || post.jetpack_featured_media_url || undefined,
    coverAlt: featuredMedia?.alt_text || textFromHtml(post.title.rendered),
  };
}

async function fetchPosts(params: URLSearchParams) {
  params.set("_embed", "1");
  const response = await fetch(`${WORDPRESS_API_URL}/posts?${params}`, {
    next: { revalidate: CACHE_SECONDS, tags: ["blog-posts"] },
  });

  if (!response.ok) {
    throw new Error(`WordPress request failed with status ${response.status}`);
  }

  const posts = (await response.json()) as WordPressPost[];
  return {
    posts: posts.map(mapPost),
    totalPosts: Number(response.headers.get("x-wp-total") ?? posts.length),
    totalPages: Number(response.headers.get("x-wp-totalpages") ?? 1),
  };
}

export async function getBlogPosts(page = 1, perPage = 10) {
  return fetchPosts(
    new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      orderby: "date",
      order: "desc",
    }),
  );
}

export async function getBlogPost(slug: string) {
  const { posts } = await fetchPosts(
    new URLSearchParams({ slug, per_page: "1" }),
  );
  return posts[0] ?? null;
}

export async function getAllBlogPosts() {
  const firstPage = await getBlogPosts(1, 100);
  if (firstPage.totalPages <= 1) return firstPage.posts;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getBlogPosts(index + 2, 100),
    ),
  );

  return [...firstPage.posts, ...remainingPages.flatMap(({ posts }) => posts)];
}

export async function getBlogPostCount() {
  const { totalPosts } = await getBlogPosts(1, 1);
  return totalPosts;
}
