import HeroSection from "./components/HeroSection";
import PlatformsSection from "./components/PlatformsSection";
import FeaturesSection from "./components/FeaturesSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PlatformsSection />
      <FeaturesSection />
    </div>
  );
}
