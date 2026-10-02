import Achievements from "./components/Achievements";
import ExperienceTimeline from "./components/ExperienceTimeline";
import FeaturedProjects from "./components/FeaturedProjects";
import Hero from "./components/Hero";
import SiteFooter from "./components/SiteFooter";
import { getGitHubStats } from "@/src/lib/github";
import {
  getBlogPosts as getLocalBlogPosts,
  getProjects,
} from "@/src/lib/content";
import { getAllBlogPosts } from "@/src/lib/wordpress";
import { createPageMetadata, siteDescription, siteName } from "@/src/lib/site";

export const metadata = createPageMetadata({
  title: siteName,
  description: siteDescription,
  path: "/",
  absoluteTitle: true,
});

export const revalidate = 3600;

export default async function Home() {
  const githubStats = await getGitHubStats().catch(() => null);
  const projects = getProjects();
  const featuredProjects = projects
    .filter(({ frontmatter }) => frontmatter.featured)
    .slice(0, 3)
    .map(({ frontmatter }) => frontmatter);
  const packageCount = projects.filter(
    ({ frontmatter }) => frontmatter.pubdev,
  ).length;
  const wordpressPosts = await getAllBlogPosts().catch(() => []);
  const articleSlugs = new Set([
    ...getLocalBlogPosts().map(({ frontmatter }) => frontmatter.slug),
    ...wordpressPosts.map((post) => post.slug),
  ]);
  const articleCount = articleSlugs.size;

  return (
    <main className="flex flex-1 w-full flex-col">
      <Hero initialGitHubStats={githubStats} />
      <FeaturedProjects projects={featuredProjects} />
      <Achievements
        projectCount={projects.length}
        packageCount={packageCount}
        articleCount={articleCount}
      />
      <ExperienceTimeline />
      <SiteFooter />
    </main>
  );
}
