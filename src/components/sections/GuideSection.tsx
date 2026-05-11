import { guideCards } from "@/data/site";

export function GuideSection() {
  return (
    <section id="guides" className="rounded-3xl border border-rift-crimson/30 bg-black/35 p-6 shadow-2xl backdrop-blur">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black tracking-[0.2em] text-rift-crimson">RECOMMENDED</p>
          <h2 className="mt-2 text-3xl font-black text-white">推薦攻略</h2>
        </div>
        <a href="/dungeons" className="text-sm font-bold text-white/65 transition hover:text-rift-crimson">
          查看更多攻略 →
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {guideCards.map((guide) => (
          <article key={guide.title} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-rift-crimson/45">
            <div className="h-32 bg-gradient-to-br from-rift-violet/35 via-rift-crimson/20 to-rift-gold/20" />
            <div className="p-4">
              <span className="rounded-full bg-rift-crimson/20 px-3 py-1 text-xs font-black text-rift-crimson">
                {guide.category}
              </span>
              <h3 className="mt-3 text-lg font-black text-white">{guide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/62">{guide.description}</p>
              <p className="mt-4 text-sm font-bold text-rift-gold">★ {guide.rating}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
