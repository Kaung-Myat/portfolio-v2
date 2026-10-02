import type { MetadataRoute } from "next";
import {
  getBlogPosts as getLocalBlogPosts,
  getProjects,
} from "@/src/lib/content";
import { getAllBlogPosts } from "@/src/lib/wordpress";
import { absoluteUrl } from "@/src/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPageConfig: Array<{
    path: string;
    priority: number;
    frequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  }> = [
    { path: "", priority: 1, frequency: "weekly" },
    { path: "/projects", priority: 0.9, frequency: "monthly" },
    { path: "/blog", priority: 0.8, frequency: "weekly" },
    { path: "/about", priority: 0.7, frequency: "monthly" },
    { path: "/resume", priority: 0.7, frequency: "monthly" },
    { path: "/ask", priority: 0.5, frequency: "monthly" },
  ];
  const staticPages: MetadataRoute.Sitemap = staticPageConfig.map(
    ({ path, priority, frequency }) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency: frequency,
      priority,
    }),
  );

  const projects: MetadataRoute.Sitemap = getProjects().map(
    ({ frontmatter }) => ({
      url: absoluteUrl(`/projects/${frontmatter.slug}`),
      lastModified: new Date(frontmatter.date),
      changeFrequency: "monthly",
      priority: 0.8,
      ...(frontmatter.cover
        ? { images: [absoluteUrl(frontmatter.cover)] }
        : {}),
    }),
  );

  const wordpressPosts = await getAllBlogPosts().catch(() => []);
  const localPosts = getLocalBlogPosts().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
    modifiedAt: frontmatter.date,
    cover: frontmatter.cover ? absoluteUrl(frontmatter.cover) : undefined,
  }));
  const postsBySlug = new Map<
    string,
    { slug: string; modifiedAt: string; cover?: string }
  >(localPosts.map((post) => [post.slug, post]));
  for (const post of wordpressPosts) postsBySlug.set(post.slug, post);
  const posts: MetadataRoute.Sitemap = [...postsBySlug.values()].map(
    (post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.modifiedAt),
      changeFrequency: "yearly",
      priority: 0.7,
      ...(post.cover ? { images: [post.cover] } : {}),
    }),
  );

  return [...staticPages, ...projects, ...posts];
}
