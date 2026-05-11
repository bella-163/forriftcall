import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function CommandsPage() {
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder
        title="功能與指令"
        description="整理伺服器常用指令、系統功能、公會、隊伍、傳送、商店與玩家互動功能。"
        items={["/spawn", "/home", "/warp", "/shop", "/guild", "/party", "/back", "/daily"]}
      />
    </>
  );
}
