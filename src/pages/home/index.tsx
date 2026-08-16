import { AboutSection } from "../../components/home/about-section";
import { ExperienceSection } from "../../components/home/experience-section";
import { HeroSection } from "../../components/home/hero-section";
import { LeadershipSection } from "../../components/home/leadership-section";

const heroBlobBackground = {
  speed: 1,
  vibrance: 1,
};

const heroGeometricBackground = {
  maxShapeSize: 120,
  minShapeSize: 70,
  shapeCount: 10,
};

export const HomePage = () => {
  return (
    <main>
      <HeroSection
        blobBackground={heroBlobBackground}
        geometricBackground={heroGeometricBackground}
      />
      <AboutSection />
      <ExperienceSection />
      <LeadershipSection />
    </main>
  );
};
