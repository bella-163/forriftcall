import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PiecesSection } from "@/components/sections/PiecesSection";
import type { ItemData } from "@/types/site";

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
    activeBtn: "border border-rift-crimson bg-rift-crimson/20 text-rift-crimson",
  },
  gold: {
    border: "border-rift-gold/40",
    text: "text-rift-gold",
    badge: "border-rift-gold/45 bg-rift-gold/15 text-rift-gold",
    activeBtn: "border border-rift-gold bg-rift-gold/20 text-rift-gold",
  },
  violet: {
    border: "border-rift-violet/40",
    text: "text-rift-violet",
    badge: "border-rift-violet/45 bg-rift-violet/15 text-rift-violet",
    activeBtn: "border border-rift-violet bg-rift-violet/20 text-rift-violet",
  },
  blue: {
    border: "border-rift-blue/40",
    text: "text-rift-blue",
    badge: "border-rift-blue/45 bg-rift-blue/15 text-rift-blue",
    activeBtn: "border border-rift-blue bg-rift-blue/20 text-rift-blue",
  },
  green: {
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    badge: "border-emerald-500/45 bg-emerald-500/15 text-emerald-400",
    activeBtn: "border border-emerald-500 bg-emerald-500/20 text-emerald-400",
  },
  gray: {
    border: "border-slate-500/40",
    text: "text-slate-300",
    badge: "border-slate-500/45 bg-slate-500/15 text-slate-300",
    activeBtn: "border border-slate-400 bg-slate-500/20 text-slate-300",
  },
};

export function ItemDetailLayout({ item, listHref, listLabel }: ItemDetailLayoutProps) {
  const c = colorMap[item.color] ?? colorMap.gray;
  const sectionEntries = Object.entries(item.sections);
  const hasPieces = item.pieces && item.pieces.length > 0;

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

        {/* Equipment pieces with search + category filter */}
        {hasPieces && (
          <PiecesSection
            pieces={item.pieces!}
            pieceCategories={item.pieceCategories}
            borderClass={c.border}
            textClass={c.text}
            activeBtnClass={c.activeBtn}
          />
        )}

        {/* Content sections */}
        <div className="space-y-6">
          {sectionEntries.length === 0 && !hasPieces ? (
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
                        <div className="min-w-0">
                          {block.title && <h3 className="mb-1 text-base font-black text-white">{block.title}</h3>}
                          <p className="text-sm leading-7 text-white/68 whitespace-pre-line">{block.text}</p>
                        </div>
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
