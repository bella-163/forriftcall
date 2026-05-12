import Link from "next/link";
import { findCatalogItem, getCatalogHref, getCatalogLabel, type CatalogMaps } from "@/lib/catalog";
import type { CatalogRef } from "@/types/site";

type Props = {
  refData: CatalogRef;
  catalogs: CatalogMaps;
  compact?: boolean;
};

export function CatalogRefCard({ refData, catalogs, compact = false }: Props) {
  const item = findCatalogItem(catalogs, refData);
  if (!item) return null;

  return (
    <Link
      href={getCatalogHref(refData)}
      className={`group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] transition hover:border-rift-gold/45 hover:bg-white/[0.08] ${
        compact ? "px-3 py-2" : "p-4"
      }`}
    >
      {item.image ? (
        <img src={item.image} alt={item.name} className={`${compact ? "h-10 w-10" : "h-16 w-16"} flex-shrink-0 rounded-lg object-contain bg-black/25`} />
      ) : (
        <div className={`${compact ? "h-10 w-10" : "h-16 w-16"} flex-shrink-0 rounded-lg border border-white/10 bg-black/25`} />
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-black tracking-widest text-white/35">{getCatalogLabel(refData.type)}</p>
        <p className="truncate text-sm font-black text-white group-hover:text-rift-gold">{item.name}</p>
      </div>
    </Link>
  );
}
