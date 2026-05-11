import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function DungeonsPage() {
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder
        title="副本攻略"
        description="整理各副本進入條件、推薦等級、隊伍配置、BOSS 機制與獎勵掉落。"
        items={["新手副本", "深淵之塔", "異界副本", "世界 BOSS", "隊伍配置", "通關獎勵"]}
      />
    </>
  );
}
