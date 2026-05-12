import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { ItemData, EquipmentPiece } from "@/types/site";

type ItemDetailLayoutProps = {
  item: ItemData;
  listHref: string;
  listLabel: string;
};

const colorMap = {
  crimson: {
    border: "border-rift-crimson/40",
    text: "text-rift-crimson",
    badge: "border-rift-crimson/45 bg-rift-crimson/15 text-rift-crimson",
  },
  gold: {
    border: "border-rift-gold/40",
    text: "text-rift-gold",
    badge: "border-rift-gold/45 bg-rift-gold/15 text-rift-gold",
  },
  violet: {
    border: "border-rift-violet/40",
    text: "text-rift-violet",
    badge: "border-rift-violet/45 bg-rift-violet/15 text-rift-violet",
  },
  blue: {
    border: "border-rift-blue/40",
    text: "text-rift-blue",
    badge: "border-rift-blue/45 bg-rift-blue/15 text-rift-blue",
  },
  green: {
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    badge: "border-emerald-500/45 bg-emerald-500/15 text-emerald-400",
  },
  gray: {
    border: "border-slate-500/40",
    text: "text-slate-300",
    badge: "border-slate-500/45 bg-slate-500/15 text-slate-300",
  },
};

function PieceCard({ piece, borderClass, textClass }: { piece: EquipmentPiece; borderClass: string; textClass: string }) {
  return (
    <div className={`rounded-2xl border ${borderClass} bg-black/35 p-5 backdrop-blur`}>
      <div className="flex items-start gap-4">
        {piece.image ? (
          <img src={piece.image} alt={piece.name} className="h-20 w-20 flex-shrink-0 rounded-xl object-contain border border-white/10 bg-white/5" />
        ) : (
          <div className="h-20 w-20 flex-shrink-0 rounded-xl border border-white/10 bg-white/5" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-white leading-tight">{piece.name || "未命名裝備"}</h3>
          {piece.effects.length > 0 && (
            <ul className="mt-2 space-y-1">
              {piece.effects.map((eff, i) => (
                <li key={i} className={`text-xs font-bold ${textClass}`}>• {eff}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {piece.rating && (
        <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <p className="mb-1 text-xs font-black tracking-widest text-white/35">評價</p>
          <p className="text-sm leading-6 text-white/65 whitespace-pre-line">{piece.rating}</p>
        </div>
      )}
    </div>
  );
}

export function ItemDetailLayout({ item, listHref, listLabel }: ItemDetailLayoutProps) {
  const c = colorMap[item.color] ?? colorMap.gray;
  const sectionEntries = Object.entries(item.sections);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-white/45">
          <Link href={listHref} className="hover:text-white/80 transition">{listLabel}</Link>
          <span>/</span>
          <span className={c.text}>{item.name}</span>
        </div>

        {/* Header */}
        <div className="mb-12 flex items-start gap-6">
          {item.image && (
            <img src={item.image} alt={item.name} className="h-24 w-24 flex-shrink-0 rounded-2xl object-contain border border-white/10" />
          )}
          <div>
            <span className={`inline-block rounded-full border px-4 py-1.5 text-xs font-black tracking-[0.15em] ${c.badge}`}>
              {item.category}
            </span>
            <h1 className="mt-4 text-5xl font-black text-white md:text-6xl">{item.name}</h1>
            {item.description && (
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">{item.description}</p>
            )}
          </div>
        </div>

        {/* Equipment pieces */}
        {item.pieces && item.pieces.length > 0 && (
          <div className="mb-8">
            <p className={`mb-6 text-sm font-black tracking-[0.2em] ${c.text}`}>裝備列表</p>
            <div className="grid gap-5 sm:grid-cols-2">
              {item.pieces.map((piece, i) => (
                <PieceCard key={i} piece={piece} borderClass={c.border} textClass={c.text} />
              ))}
            </div>
          </div>
        )}

        {/* Content sections */}
        <div className="space-y-6">
          {sectionEntries.length === 0 && (!item.pieces || item.pieces.length === 0) ? (
            <p className="text-sm text-white/35">內容建置中...</p>
          ) : (
            sectionEntries.map(([sectionName, blocks]) => (
              <section key={sectionName} className={`rounded-2xl border ${c.border} bg-black/35 p-6 backdrop-blur`}>
                <p className={`mb-2 text-sm font-black tracking-[0.2em] ${c.text}`}>
                  {sectionName.toUpperCase()}
                </p>
                <h2 className="mb-6 text-2xl font-black text-white">{sectionName}</h2>

                {blocks.length === 0 ? (
                  <p className="text-sm text-white/35">內容建置中...</p>
                ) : (
                  <div className="space-y-4">
                    {blocks.map((block, i) => (
                      <div key={i} className="flex gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-4">
                        {block.image && (
                          <img src={block.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-contain" />
                        )}
                        <p className="text-sm leading-7 text-white/68 whitespace-pre-line">{block.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </main>
    </>
  );
}
