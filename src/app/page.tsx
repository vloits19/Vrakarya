import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { CreatorIntro } from "@/components/sections/CreatorIntro";
import { LatestUploads } from "@/components/sections/LatestUploads";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedProjects />
      <CreatorIntro />
      <LatestUploads />
    </div>
  );
}
