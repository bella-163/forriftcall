import { SiteHeader } from "@/components/layout/SiteHeader";
import { MaterialsCatalogSection } from "@/components/sections/MaterialsCatalogSection";
import { readData } from "@/lib/data";
import type { SectionListData } from "@/types/site";

export const dynamic = "force-dynamic";

export default function MaterialsPage() {
  const data = readData<SectionListData>("materials");
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <p className="text-sm font-black tracking-[0.22em] text-rift-gold">{data.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-black text-white">{data.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">{data.description}</p>
        <MaterialsCatalogSection items={data.items} categories={data.categories} />
      </main>
    </>
  );
}
