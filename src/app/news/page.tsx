import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder
        title="最新消息"
        description="整理伺服器更新公告、活動資訊、維護通知與版本調整紀錄。"
        items={["更新公告", "活動資訊", "維護通知", "版本調整", "公會活動", "限時任務"]}
      />
    </>
  );
}
