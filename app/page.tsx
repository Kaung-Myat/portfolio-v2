import ExperienceTimeline from "./components/ExperienceTimeline";
import Hero from "./components/Hero";
import SiteFooter from "./components/SiteFooter";
import { getGitHubStats } from "@/src/lib/github";

export const revalidate = 3600;

export default async function Home() {
  const githubStats = await getGitHubStats().catch(() => null);

  return (
    <main className="flex flex-1 w-full flex-col">
      <Hero initialGitHubStats={githubStats} />
      <ExperienceTimeline />
      <SiteFooter />
    </main>
  );
}
