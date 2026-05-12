import { FeatureCards } from "@/components/sections/FeatureCards";
import { GuideSection } from "@/components/sections/GuideSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { QuickStartSection } from "@/components/sections/QuickStartSection";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readData } from "@/lib/data";
import type { HomeData } from "@/types/site";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const home = readData<HomeData>("home");
  return (
    <div className="home-bg min-h-screen">
      <SiteHeader />
      <HeroSection hero={home.hero} />
      <FeatureCards cards={home.featureCards} />

      <main className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 lg:grid-cols-[1fr_380px] lg:px-8">
        <GuideSection cards={home.guideCards} />
        <QuickStartSection items={home.quickStart} />
      </main>
    </div>
  );
}
