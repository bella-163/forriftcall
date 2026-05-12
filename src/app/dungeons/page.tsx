import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { readData } from "@/lib/data";
import type { PageData } from "@/types/site";

export default function DungeonsPage() {
  const data = readData<PageData>("dungeons");
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder title={data.title} description={data.description} items={data.items} />
    </>
  );
}
