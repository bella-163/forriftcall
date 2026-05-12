import { notFound } from "next/navigation";
import { ItemDetailLayout } from "@/components/sections/ItemDetailLayout";
import { readData } from "@/lib/data";
import type { SectionListData } from "@/types/site";

export const dynamic = "force-dynamic";

export default async function DungeonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = readData<SectionListData>("dungeons");
  const item = data.items.find((i) => i.slug === slug);
  if (!item) notFound();
  return <ItemDetailLayout item={item} listHref="/dungeons" listLabel="副本攻略" />;
}
