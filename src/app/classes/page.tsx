import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export const dynamic = "force-dynamic";

const colorStyles: Record<string, { card: string; badge: string; arrow: string }> = {
  crimson: {
    card: "border-rift-crimson/45 bg-rift-crimson/10 hover:border-rift-crimson/70",
    badge: "bg-rift-crimson/20 text-rift-crimson",
    arrow: "text-rift-crimson",
  },
  blue: {
    card: "border-rift-blue/45 bg-rift-blue/10 hover:border-rift-blue/70",
    badge: "bg-rift-blue/20 text-rift-blue",
    arrow: "text-rift-blue",
  },
  violet: {
    card: "border-rift-violet/45 bg-rift-violet/10 hover:border-rift-violet/70",
    badge: "bg-rift-violet/20 text-rift-violet",
    arrow: "text-rift-violet",
  },
  gold: {
    card: "border-rift-gold/45 bg-rift-gold/10 hover:border-rift-gold/70",
    badge: "bg-rift-gold/20 text-rift-gold",
    arrow: "text-rift-gold",
  },
  gray: {
    card: "border-slate-500/45 bg-slate-500/10 hover:border-slate-400/70",
    badge: "bg-slate-500/20 text-slate-300",
    arrow: "text-slate-300",
  },
  green: {
    card: "border-emerald-500/45 bg-emerald-500/10 hover:border-emerald-400/70",
    badge: "bg-emerald-500/20 text-emerald-400",
    arrow: "text-emerald-400",
  },
};

export default function ClassesPage() {
  const classes = readData<ClassData[]>("classes");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <p className="text-sm font-black tracking-[0.22em] text-rift-crimson">斷界召喚資料庫</p>
        <h1 className="mt-4 text-5xl font-black text-white">職業介紹</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
          整理斷界召喚中的所有職業定位、技能特色、推薦裝備與成長路線。
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {classes.map((cls) => {
            const s = colorStyles[cls.color] ?? colorStyles.gray;
            return (
              <Link
                key={cls.slug}
                href={`/classes/${cls.slug}`}
                className={`group rounded-2xl border p-6 backdrop-blur transition hover:-translate-y-1 ${s.card}`}
              >
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-black ${s.badge}`}>
                  {cls.role}
                </span>
                <h2 className="mt-3 text-3xl font-black text-white">{cls.name}</h2>
                <p className="mt-3 text-sm leading-7 text-white/65">{cls.description.split("\n")[0]}</p>
                <div className={`mt-5 flex items-center gap-1 text-sm font-bold ${s.arrow}`}>
                  查看詳情 <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
