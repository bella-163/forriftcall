import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function MonstersPage() {
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder
        title="怪物介紹"
        description="整理普通怪物、精英怪物、BOSS、副本怪物、活動怪物與掉落物資訊。"
        items={["普通怪物", "精英怪物", "BOSS", "副本怪物", "活動怪物", "掉落物"]}
      />
    </>
  );
}
