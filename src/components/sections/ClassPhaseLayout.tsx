import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CatalogRefCard } from "@/components/sections/CatalogRefCard";
import { readData } from "@/lib/data";
import type { PhaseBlock, SectionListData } from "@/types/site";

type ClassPhaseLayoutProps = {
  className: string;
  phase: "pre" | "post";
  color: "crimson" | "gold" | "violet" | "blue" | "green" | "gray";
  classHref: string;
  sections?: Record<string, PhaseBlock[]>;
};

const colorMap = {
  crimson: {
    border: "border-rift-crimson/40",
    bg: "bg-rift-crimson/10",
    text: "text-rift-crimson",
    badge: "border-rift-crimson/45 bg-rift-crimson/15 text-rift-crimson",
  },
  gold: {
    border: "border-rift-gold/40",
    bg: "bg-rift-gold/10",
    text: "text-rift-gold",
    badge: "border-rift-gold/45 bg-rift-gold/15 text-rift-gold",
  },
  violet: {
    border: "border-rift-violet/40",
    bg: "bg-rift-violet/10",
    text: "text-rift-violet",
    badge: "border-rift-violet/45 bg-rift-violet/15 text-rift-violet",
  },
  blue: {
    border: "border-rift-blue/40",
    bg: "bg-rift-blue/10",
    text: "text-rift-blue",
    badge: "border-rift-blue/45 bg-rift-blue/15 text-rift-blue",
  },
  green: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    badge: "border-emerald-500/45 bg-emerald-500/15 text-emerald-400",
  },
  gray: {
    border: "border-slate-500/40",
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    badge: "border-slate-500/45 bg-slate-500/15 text-slate-300",
  },
};

const phaseLabel = {
  pre: "1 - 80 等・二轉前",
  post: "80 - 180 等・二轉後",
};

export function ClassPhaseLayout({ className, phase, color, classHref, sections }: ClassPhaseLayoutProps) {
  const c = colorMap[color];
  const sectionEntries = sections ? Object.entries(sections) : [];
  const catalogs = {
    equipment: readData<SectionListData>("equipment"),
    materials: readData<SectionListData>("materials"),
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-white/45">
          <Link href="/classes" className="hover:text-white/80 transition">職業介紹</Link>
          <span>/</span>
          <Link href={classHref} className="hover:text-white/80 transition">{className}</Link>
          <span>/</span>
          <span className={c.text}>{phaseLabel[phase]}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className={`inline-block rounded-full border px-5 py-2 text-sm font-black tracking-[0.15em] ${c.badge}`}>
            {phaseLabel[phase]}
          </span>
          <h1 className="mt-4 text-5xl font-black text-white md:text-6xl">{className}</h1>
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          {sectionEntries.length === 0 ? (
            <p className="text-sm text-white/35">內容建置中...</p>
          ) : (
            sectionEntries.map(([sectionName, blocks]) => (
              <details key={sectionName} open className={`group rounded-2xl border ${c.border} bg-black/35 p-6 backdrop-blur`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <div>
                    <p className={`mb-2 text-sm font-black tracking-[0.2em] ${c.text}`}>
                      {sectionName.toUpperCase()}
                    </p>
                    <h2 className="text-2xl font-black text-white">{sectionName}</h2>
                  </div>
                  <span className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-black ${c.badge}`}>
                    <span className="group-open:hidden">展開</span>
                    <span className="hidden group-open:inline">收合</span>
                  </span>
                </summary>

                {blocks.length === 0 ? (
                  <p className="mt-6 text-sm text-white/35">內容建置中...</p>
                ) : (
                  <div className="mt-6 space-y-3">
                    {blocks.map((block, i) => (
                      block.ref ? (
                        <details key={i} className="group/block rounded-xl border border-white/8 bg-white/[0.03] p-4">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                            <CatalogRefCard refData={block.ref} catalogs={catalogs} />
                            <span className="shrink-0 text-xs font-black text-white/35 group-open/block:hidden">展開</span>
                            <span className="hidden shrink-0 text-xs font-black text-white/35 group-open/block:inline">收合</span>
                          </summary>
                          {block.text && <p className="mt-3 text-sm leading-7 text-white/68 whitespace-pre-line">{block.text}</p>}
                        </details>
                      ) : (
                        <details key={i} className="group/block rounded-xl border border-white/8 bg-white/[0.03] p-4">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                            <div className="flex min-w-0 items-center gap-4">
                              {block.image && (
                                <img
                                  src={block.image}
                                  alt=""
                                  className="h-14 w-14 flex-shrink-0 rounded-lg object-contain"
                                />
                              )}
                              <div className="min-w-0">
                                <h3 className="truncate text-base font-black text-white">{block.title || `項目 ${i + 1}`}</h3>
                                {block.text && <p className="mt-1 truncate text-xs text-white/38">{block.text.split("\n").find(Boolean)}</p>}
                              </div>
                            </div>
                            <span className="shrink-0 text-xs font-black text-white/35 group-open/block:hidden">展開</span>
                            <span className="hidden shrink-0 text-xs font-black text-white/35 group-open/block:inline">收合</span>
                          </summary>
                          {block.text && <p className="mt-4 text-sm leading-7 text-white/68 whitespace-pre-line">{block.text}</p>}
                        </details>
                      )
                    ))}
                  </div>
                )}
              </details>
            ))
          )}
        </div>
      </main>
    </>
  );
}
