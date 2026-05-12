"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ItemData } from "@/types/site";

type Props = {
  items: ItemData[];
  categories?: string[];
};

function itemCategories(item: ItemData) {
  const cats = item.categories && item.categories.length > 0 ? item.categories : item.category ? [item.category] : [];
  return cats.filter(Boolean);
}

function MaterialCard({ item }: { item: ItemData }) {
  return (
    <Link
      href={`/materials/${item.slug}`}
      className="group block rounded-xl border border-rift-gold/30 bg-black/40 p-3 text-center backdrop-blur transition hover:-translate-y-1 hover:border-rift-gold/60 hover:bg-black/55"
    >
      <div className="flex flex-col items-center gap-2">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg border border-white/10 bg-white/5 object-contain" />
        ) : (
          <div className="h-16 w-16 rounded-lg border border-white/10 bg-white/5" />
        )}
        <h2 className="w-full truncate text-sm font-black leading-tight text-white group-hover:text-rift-gold">{item.name || "未命名素材"}</h2>
      </div>
    </Link>
  );
}

export function MaterialsCatalogSection({ items, categories: listCategories }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    if (listCategories && listCategories.length > 0) return listCategories;
    return Array.from(new Set(items.flatMap(itemCategories)));
  }, [items, listCategories]);

  function toggleCat(cat: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchName = keyword === "" || item.name.toLowerCase().includes(keyword);
      const cats = itemCategories(item);
      const matchCat = selectedCats.size === 0 || cats.some((cat) => selectedCats.has(cat));
      return matchName && matchCat;
    });
  }, [items, search, selectedCats]);

  return (
    <div className="mt-10">
      <div className="relative mb-3">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋素材名稱..."
          className="w-full rounded-2xl border border-white/25 bg-white/10 py-3.5 pl-11 pr-4 text-sm font-medium text-white outline-none backdrop-blur transition placeholder-white/45 focus:border-white/50 focus:bg-white/15"
        />
      </div>

      {categories.length > 0 && (
        <div className="mb-6 rounded-2xl border border-white/20 bg-white/8 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-black tracking-[0.18em] text-white/70">類別篩選</p>
            {selectedCats.size > 0 && (
              <button
                onClick={() => setSelectedCats(new Set())}
                className="rounded-lg px-3 py-1 text-xs font-bold text-white/55 transition hover:bg-white/10 hover:text-white"
              >
                清除全部
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                className={`rounded-xl border px-5 py-2 text-sm font-bold transition ${
                  selectedCats.has(cat)
                    ? "border-rift-gold bg-rift-gold/20 text-rift-gold"
                    : "border-white/25 bg-white/8 text-white/70 hover:border-white/40 hover:bg-white/15 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {(search !== "" || selectedCats.size > 0) && (
        <p className="mb-4 text-xs text-white/40">
          找到 {filtered.length} 個素材
          {selectedCats.size > 0 && `，類別：${Array.from(selectedCats).join("、")}`}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-white/40">找不到符合的素材。</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => (
            <MaterialCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
