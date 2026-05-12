import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readData } from "@/lib/data";
import type { NewsPageData } from "@/types/site";

export const dynamic = "force-dynamic";

const colorMap: Record<string, { border: string; text: string; badge: string; dateBg: string }> = {
  crimson: { border: "border-rift-crimson/40", text: "text-rift-crimson", badge: "border-rift-crimson/45 bg-rift-crimson/15 text-rift-crimson", dateBg: "bg-rift-crimson/15 text-rift-crimson" },
  gold: { border: "border-rift-gold/40", text: "text-rift-gold", badge: "border-rift-gold/45 bg-rift-gold/15 text-rift-gold", dateBg: "bg-rift-gold/15 text-rift-gold" },
  violet: { border: "border-rift-violet/40", text: "text-rift-violet", badge: "border-rift-violet/45 bg-rift-violet/15 text-rift-violet", dateBg: "bg-rift-violet/15 text-rift-violet" },
  blue: { border: "border-rift-blue/40", text: "text-rift-blue", badge: "border-rift-blue/45 bg-rift-blue/15 text-rift-blue", dateBg: "bg-rift-blue/15 text-rift-blue" },
  green: { border: "border-emerald-500/40", text: "text-emerald-400", badge: "border-emerald-500/45 bg-emerald-500/15 text-emerald-400", dateBg: "bg-emerald-500/15 text-emerald-400" },
  gray: { border: "border-slate-500/40", text: "text-slate-300", badge: "border-slate-500/45 bg-slate-500/15 text-slate-300", dateBg: "bg-slate-500/15 text-slate-300" },
};

export default async function NewsCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = readData<NewsPageData>("news");
  const category = data.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const c = colorMap[category.color] ?? colorMap.gray;
  const posts = [...category.posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-white/45">
          <Link href="/news" className="hover:text-white/80 transition">最新消息</Link>
          <span>/</span>
          <span className={c.text}>{category.name}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className={`inline-block rounded-full border px-4 py-1.5 text-xs font-black tracking-[0.15em] ${c.badge}`}>
            消息
          </span>
          <h1 className="mt-4 text-5xl font-black text-white md:text-6xl">{category.name}</h1>
          {posts.length > 0 && (
            <p className="mt-3 text-base text-white/50">{posts.length} 則消息</p>
          )}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-sm text-white/35">暫無消息。</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.id} className={`rounded-2xl border ${c.border} bg-black/35 p-6 backdrop-blur`}>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-2xl font-black text-white">{post.title}</h2>
                  <span className={`shrink-0 rounded-lg px-3 py-1 text-xs font-bold ${c.dateBg}`}>{post.date}</span>
                </div>
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="mb-4 max-h-72 w-full rounded-xl object-cover border border-white/10"
                  />
                )}
                {post.content && (
                  <p className="text-sm leading-7 text-white/70 whitespace-pre-line">{post.content}</p>
                )}
                {post.dcLink && (
                  <a
                    href={post.dcLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition hover:opacity-80 ${c.badge}`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                    在 Discord 查看原文
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
