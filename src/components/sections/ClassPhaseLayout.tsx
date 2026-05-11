import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

type ClassPhaseLayoutProps = {
  className: string;
  phase: "pre" | "post";
  color: "crimson" | "gold" | "violet" | "blue" | "gray";
  classHref: string;
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

const sections = ["技能介紹", "推薦裝備", "推薦配件"];

export function ClassPhaseLayout({ className, phase, color, classHref }: ClassPhaseLayoutProps) {
  const c = colorMap[color];
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
          {sections.map((section) => (
            <section key={section} className={`rounded-2xl border ${c.border} bg-black/35 p-6 backdrop-blur`}>
              <p className={`mb-2 text-sm font-black tracking-[0.2em] ${c.text}`}>
                {section.toUpperCase()}
              </p>
              <h2 className="text-2xl font-black text-white">{section}</h2>
              <p className="mt-6 text-sm text-white/35">內容建置中...</p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
