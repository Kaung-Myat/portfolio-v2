import type { MetadataRoute } from "next";
import { getBlogPosts, getProjects } from "@/src/lib/content";
import { absoluteUrl } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPageConfig: Array<{
    path: string;
    priority: number;
    frequency: NonNullable<
      MetadataRoute.Sitemap[number]["changeFrequency"]
    >;
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

  const posts: MetadataRoute.Sitemap = getBlogPosts().map(
    ({ frontmatter }) => ({
      url: absoluteUrl(`/blog/${frontmatter.slug}`),
      lastModified: new Date(frontmatter.date),
      changeFrequency: "yearly",
      priority: 0.7,
      ...(frontmatter.cover
        ? { images: [absoluteUrl(frontmatter.cover)] }
        : {}),
    }),
  );

  return [...staticPages, ...projects, ...posts];
}
