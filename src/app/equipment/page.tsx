import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { readData } from "@/lib/data";
import type { PageData } from "@/types/site";

export default function EquipmentPage() {
  const data = readData<PageData>("equipment");
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder title={data.title} description={data.description} items={data.items} />
    </>
  );
}
