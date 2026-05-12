import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";
import { readData } from "@/lib/data";
import type { PageData } from "@/types/site";

export const dynamic = "force-dynamic";

export default function CommandsPage() {
  const data = readData<PageData>("commands");
  return (
    <>
      <SiteHeader />
      <SectionPlaceholder title={data.title} description={data.description} items={data.items} />
    </>
  );
}
