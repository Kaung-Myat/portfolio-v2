import ExperienceTimeline from "./components/ExperienceTimeline";
import Hero from "./components/Hero";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col">
      <Hero />
      <ExperienceTimeline />
      <SiteFooter />
    </main>
  );
}
