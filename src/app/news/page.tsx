import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readData } from "@/lib/data";
import type { NewsPageData } from "@/types/site";

export const dynamic = "force-dynamic";

const colorStyles: Record<string, { card: string; badge: string; arrow: string }> = {
  crimson: { card: "border-rift-crimson/45 bg-rift-crimson/10 hover:border-rift-crimson/70", badge: "bg-rift-crimson/20 text-rift-crimson", arrow: "text-rift-crimson" },
  gold: { card: "border-rift-gold/45 bg-rift-gold/10 hover:border-rift-gold/70", badge: "bg-rift-gold/20 text-rift-gold", arrow: "text-rift-gold" },
  violet: { card: "border-rift-violet/45 bg-rift-violet/10 hover:border-rift-violet/70", badge: "bg-rift-violet/20 text-rift-violet", arrow: "text-rift-violet" },
  blue: { card: "border-rift-blue/45 bg-rift-blue/10 hover:border-rift-blue/70", badge: "bg-rift-blue/20 text-rift-blue", arrow: "text-rift-blue" },
  green: { card: "border-emerald-500/45 bg-emerald-500/10 hover:border-emerald-400/70", badge: "bg-emerald-500/20 text-emerald-400", arrow: "text-emerald-400" },
  gray: { card: "border-slate-500/45 bg-slate-500/10 hover:border-slate-400/70", badge: "bg-slate-500/20 text-slate-300", arrow: "text-slate-300" },
};

export default function NewsPage() {
  const data = readData<NewsPageData>("news");
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <p className="text-sm font-black tracking-[0.22em] text-rift-crimson">{data.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-black text-white">{data.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">{data.description}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {data.categories.map((cat) => {
            const s = colorStyles[cat.color] ?? colorStyles.gray;
            const latestPost = cat.posts.length > 0
              ? [...cat.posts].sort((a, b) => b.date.localeCompare(a.date))[0]
              : null;
            return (
              <Link key={cat.slug} href={`/news/${cat.slug}`} className={`group rounded-2xl border p-6 backdrop-blur transition hover:-translate-y-1 ${s.card}`}>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-black ${s.badge}`}>消息</span>
                <h2 className="mt-3 text-3xl font-black text-white">{cat.name}</h2>
                <p className="mt-2 text-sm text-white/50">
                  {cat.posts.length > 0
                    ? `${cat.posts.length} 則消息${latestPost ? ` · 最新：${latestPost.date}` : ""}`
                    : "暫無消息"}
                </p>
                <div className={`mt-5 flex items-center gap-1 text-sm font-bold ${s.arrow}`}>
                  查看消息 <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
