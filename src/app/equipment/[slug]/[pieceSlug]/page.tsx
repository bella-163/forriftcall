import { notFound } from "next/navigation";
import { ItemDetailLayout } from "@/components/sections/ItemDetailLayout";
import { equipmentPieceToItem } from "@/lib/catalog";
import { readData } from "@/lib/data";
import type { SectionListData } from "@/types/site";

export const dynamic = "force-dynamic";

export default async function EquipmentPieceDetailPage({ params }: { params: Promise<{ slug: string; pieceSlug: string }> }) {
  const { slug, pieceSlug } = await params;
  const equipment = readData<SectionListData>("equipment");
  const materials = readData<SectionListData>("materials");
  const parent = equipment.items.find((item) => item.slug === slug);
  const piece = parent?.pieces?.find((p) => (p.slug || p.name) === pieceSlug);
  if (!parent || !piece) notFound();

  return (
    <ItemDetailLayout
      item={equipmentPieceToItem(piece, parent)}
      listHref={`/equipment/${parent.slug}`}
      listLabel={parent.name}
      catalogs={{ equipment, materials }}
    />
  );
}
