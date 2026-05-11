import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function EquipmentPage() {
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder
        title="裝備介紹"
        description="整理武器、防具、飾品、套裝、材料與強化系統，之後可擴充成完整裝備圖鑑。"
        items={["武器", "防具", "飾品", "套裝", "材料", "強化與附魔"]}
      />
    </>
  );
}
