"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { EquipmentPiece } from "@/types/site";

type Props = {
  pieces: EquipmentPiece[];
  pieceCategories?: string[];
  borderClass: string;
  textClass: string;
  activeBtnClass: string;
  parentSlug: string;
};

function PieceCard({ piece, parentSlug, borderClass, textClass }: { piece: EquipmentPiece; parentSlug: string; borderClass: string; textClass: string }) {
  const href = `/equipment/${parentSlug}/${piece.slug || piece.name}`;
  return (
    <Link href={href} className={`group block rounded-xl border ${borderClass} bg-black/40 p-3 backdrop-blur transition hover:-translate-y-1 hover:bg-black/55`}>
      <div className="flex flex-col items-center gap-2 text-center">
        {piece.image ? (
          <img src={piece.image} alt={piece.name} className="h-16 w-16 rounded-lg object-contain border border-white/10 bg-white/5" />
        ) : (
          <div className="h-16 w-16 rounded-lg border border-white/10 bg-white/5" />
        )}
        <div className="min-w-0 w-full">
          {piece.category && (
            <span className={`mb-1 block truncate text-[10px] font-black tracking-widest ${textClass} opacity-80`}>
              {piece.category}
            </span>
          )}
          <h3 className="truncate text-sm font-black leading-tight text-white group-hover:text-rift-gold">{piece.name || "未命名裝備"}</h3>
        </div>
      </div>
    </Link>
  );
}

export function PiecesSection({ pieces, pieceCategories, borderClass, textClass, activeBtnClass, parentSlug }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    if (pieceCategories && pieceCategories.length > 0) return pieceCategories;
    return Array.from(new Set(pieces.map((p) => p.category).filter(Boolean)));
  }, [pieces, pieceCategories]);

  function toggleCat(cat: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return pieces.filter((p) => {
      const matchName = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      // 未分類物品在有篩選時也顯示；有類別的物品才做類別比對
      const matchCat =
        selectedCats.size === 0 ||
        !p.category ||
        selectedCats.has(p.category);
      return matchName && matchCat;
    });
  }, [pieces, search, selectedCats]);

  return (
    <div className="mb-10">
      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋裝備名稱..."
          className="w-full rounded-2xl border border-white/25 bg-white/10 py-3.5 pl-11 pr-4 text-sm font-medium text-white placeholder-white/45 outline-none focus:border-white/50 focus:bg-white/15 transition backdrop-blur"
        />
      </div>

      {/* Category filter block */}
      {categories.length > 0 && (
        <div className="mb-6 rounded-2xl border border-white/20 bg-white/8 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-black tracking-[0.18em] text-white/70">類別篩選</p>
            {selectedCats.size > 0 && (
              <button
                onClick={() => setSelectedCats(new Set())}
                className="rounded-lg px-3 py-1 text-xs font-bold text-white/55 hover:text-white hover:bg-white/10 transition"
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
                className={`rounded-xl px-5 py-2 text-sm font-bold border transition ${
                  selectedCats.has(cat)
                    ? activeBtnClass
                    : "border-white/25 bg-white/8 text-white/70 hover:text-white hover:bg-white/15 hover:border-white/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result count hint */}
      {(search !== "" || selectedCats.size > 0) && (
        <p className="mb-4 text-xs text-white/40">
          找到 {filtered.length} 個裝備
          {selectedCats.size > 0 && `，類別：${Array.from(selectedCats).join("、")}`}
        </p>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-sm text-white/40">找不到符合的裝備。</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((piece, i) => (
            <PieceCard key={piece.slug || piece.name || i} piece={piece} parentSlug={parentSlug} borderClass={borderClass} textClass={textClass} />
          ))}
        </div>
      )}
    </div>
  );
}
