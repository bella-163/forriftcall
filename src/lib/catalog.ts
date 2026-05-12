import type { CatalogRef, EquipmentPiece, ItemData, SectionListData } from "@/types/site";

export type CatalogMaps = {
  equipment: SectionListData;
  materials: SectionListData;
};

export function getCatalogHref(ref: CatalogRef): string {
  if (ref.type === "equipment" && ref.parentSlug) return `/equipment/${ref.parentSlug}/${ref.slug}`;
  return `/${ref.type}/${ref.slug}`;
}

export function getCatalogLabel(type: CatalogRef["type"]): string {
  return type === "equipment" ? "裝備介紹" : "素材介紹";
}

export function findCatalogItem(catalogs: CatalogMaps, ref?: CatalogRef): ItemData | undefined {
  if (!ref) return undefined;
  if (ref.type === "equipment" && ref.parentSlug) {
    const parent = catalogs.equipment.items.find((item) => item.slug === ref.parentSlug);
    const piece = parent?.pieces?.find((p) => (p.slug || p.name) === ref.slug);
    return piece && parent ? equipmentPieceToItem(piece, parent) : undefined;
  }
  return catalogs[ref.type]?.items.find((item) => item.slug === ref.slug);
}

export function getCatalogOptions(catalogs: CatalogMaps): Array<{ ref: CatalogRef; label: string; image: string }> {
  const equipmentPieces = catalogs.equipment.items.flatMap((parent) =>
    (parent.pieces ?? []).map((piece) => ({
      ref: { type: "equipment" as const, parentSlug: parent.slug, slug: piece.slug || piece.name },
      label: `裝備介紹 / ${parent.name} / ${piece.name || "未命名裝備"}`,
      image: piece.image,
    })),
  );
  const materials = catalogs.materials.items.map((item) => ({
    ref: { type: "materials" as const, slug: item.slug },
    label: `${getCatalogLabel("materials")} / ${item.name}`,
    image: item.image,
  }));
  return [...equipmentPieces, ...materials];
}

export function equipmentPieceToItem(piece: EquipmentPiece, parent: ItemData): ItemData {
  return {
    slug: piece.slug || piece.name,
    name: piece.name || "未命名裝備",
    category: piece.category || parent.name,
    description: piece.description || piece.rating || "",
    image: piece.image,
    color: parent.color,
    attributes: piece.attributes ?? piece.effects,
    skills: piece.skills ?? [],
    acquisition: piece.acquisition ?? [],
    crafting: piece.crafting ?? [],
    sections: piece.sections ?? {},
  };
}
