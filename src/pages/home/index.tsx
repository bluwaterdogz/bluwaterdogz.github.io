import { AboutSection } from "../../components/home/about-section";
import { ExperienceSection } from "../../components/home/experience-section";
import { HeroSection } from "../../components/home/hero-section";
import { LeadershipSection } from "../../components/home/leadership-section";

export const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <LeadershipSection />
    </main>
  );
};
