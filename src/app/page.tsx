import { FeatureCards } from "@/components/sections/FeatureCards";
import { GuideSection } from "@/components/sections/GuideSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { QuickStartSection } from "@/components/sections/QuickStartSection";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <FeatureCards />

      <main className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 lg:grid-cols-[1fr_380px] lg:px-8">
        <GuideSection />
        <QuickStartSection />
      </main>
    </>
  );
}
