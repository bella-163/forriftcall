import { notFound } from "next/navigation";
import { ItemDetailLayout } from "@/components/sections/ItemDetailLayout";
import { readRuntimeData } from "@/lib/data";
import type { SectionListData } from "@/types/site";

export const dynamic = "force-dynamic";

export default async function EquipmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await readRuntimeData<SectionListData>("equipment");
  const materials = await readRuntimeData<SectionListData>("materials");
  const item = data.items.find((i) => i.slug === slug);
  if (!item) notFound();
  return <ItemDetailLayout item={item} listHref="/equipment" listLabel="裝備介紹" catalogs={{ equipment: data, materials }} />;
}
