import Link from "next/link";
import { featureCards } from "@/data/site";

const themeMap = {
  crimson: "border-rift-crimson/45 bg-rift-crimson/10 text-rift-crimson",
  gold: "border-rift-gold/45 bg-rift-gold/10 text-rift-gold",
  violet: "border-rift-violet/45 bg-rift-violet/10 text-rift-violet",
  blue: "border-rift-blue/45 bg-rift-blue/10 text-rift-blue",
};

export function FeatureCards() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`group rounded-2xl border p-6 shadow-2xl backdrop-blur transition hover:-translate-y-1 ${themeMap[card.theme]}`}
          >
            <p className="mb-3 text-sm font-black tracking-[0.18em] opacity-85">{card.eyebrow}</p>
            <h2 className="text-3xl font-black text-white">{card.title}</h2>
            <p className="mt-4 min-h-20 text-sm leading-7 text-white/72">{card.description}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-4 py-2 text-sm font-bold text-white transition group-hover:border-white/35">
              查看詳情 <span aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
