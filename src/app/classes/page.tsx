import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function ClassesPage() {
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder
        title="職業介紹"
        description="整理斷界召喚中的所有職業定位、技能特色、推薦裝備與成長路線。"
        items={["劍士", "法師", "弓箭手", "刺客", "牧師", "召喚師"]}
      />
    </>
  );
}
