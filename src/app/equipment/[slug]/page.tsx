import { notFound } from "next/navigation";
import { ItemDetailLayout } from "@/components/sections/ItemDetailLayout";
import { readData } from "@/lib/data";
import type { SectionListData } from "@/types/site";

export default async function EquipmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = readData<SectionListData>("equipment");
  const item = data.items.find((i) => i.slug === slug);
  if (!item) notFound();
  return <ItemDetailLayout item={item} listHref="/equipment" listLabel="裝備介紹" />;
}
