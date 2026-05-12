import { notFound } from "next/navigation";
import { ItemDetailLayout } from "@/components/sections/ItemDetailLayout";
import { readData } from "@/lib/data";
import type { SectionListData } from "@/types/site";

export default async function MonsterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = readData<SectionListData>("monsters");
  const item = data.items.find((i) => i.slug === slug);
  if (!item) notFound();
  return <ItemDetailLayout item={item} listHref="/monsters" listLabel="怪物介紹" />;
}
