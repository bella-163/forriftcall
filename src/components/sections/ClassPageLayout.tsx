import { SiteHeader } from "@/components/layout/SiteHeader";

type Skill = {
  name: string;
  description: string;
};

type ClassPageProps = {
  name: string;
  role: string;
  description: string;
  color: "crimson" | "gold" | "violet" | "blue" | "green";
  stats: { label: string; value: number }[];
  skills: Skill[];
  tips: string[];
};

const colorMap = {
  crimson: {
    border: "border-rift-crimson/40",
    bg: "bg-rift-crimson/10",
    text: "text-rift-crimson",
    bar: "bg-rift-crimson",
    badge: "border-rift-crimson/45 bg-rift-crimson/15 text-rift-crimson",
  },
  gold: {
    border: "border-rift-gold/40",
    bg: "bg-rift-gold/10",
    text: "text-rift-gold",
    bar: "bg-rift-gold",
    badge: "border-rift-gold/45 bg-rift-gold/15 text-rift-gold",
  },
  violet: {
    border: "border-rift-violet/40",
    bg: "bg-rift-violet/10",
    text: "text-rift-violet",
    bar: "bg-rift-violet",
    badge: "border-rift-violet/45 bg-rift-violet/15 text-rift-violet",
  },
  blue: {
    border: "border-rift-blue/40",
    bg: "bg-rift-blue/10",
    text: "text-rift-blue",
    bar: "bg-rift-blue",
    badge: "border-rift-blue/45 bg-rift-blue/15 text-rift-blue",
  },
  green: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    bar: "bg-emerald-400",
    badge: "border-emerald-500/45 bg-emerald-500/15 text-emerald-400",
  },
};

export function ClassPageLayout({ name, role, description, color, stats, skills, tips }: ClassPageProps) {
  const c = colorMap[color];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <span className={`inline-block rounded-full border px-4 py-1 text-xs font-black tracking-[0.2em] ${c.badge}`}>
            職業介紹
          </span>
          <h1 className="mt-4 text-5xl font-black text-white md:text-6xl">{name}</h1>
          <p className={`mt-2 text-lg font-bold ${c.text}`}>{role}</p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/68">{description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">

            {/* Skills */}
            <section className={`rounded-2xl border ${c.border} bg-black/35 p-6 backdrop-blur`}>
              <p className={`mb-4 text-sm font-black tracking-[0.2em] ${c.text}`}>SKILLS</p>
              <h2 className="mb-5 text-2xl font-black text-white">技能介紹</h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                    <h3 className="font-black text-white">{skill.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/60">{skill.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section className="rounded-2xl border border-white/10 bg-black/35 p-6 backdrop-blur">
              <p className="mb-4 text-sm font-black tracking-[0.2em] text-rift-gold">TIPS</p>
              <h2 className="mb-5 text-2xl font-black text-white">攻略提示</h2>
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-white/68">
                    <span className={`mt-0.5 shrink-0 font-black ${c.text}`}>0{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Stats sidebar */}
          <aside className={`h-fit rounded-2xl border ${c.border} ${c.bg} p-6 backdrop-blur`}>
            <p className={`mb-4 text-sm font-black tracking-[0.2em] ${c.text}`}>STATS</p>
            <h2 className="mb-5 text-2xl font-black text-white">職業能力值</h2>
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-bold text-white/80">{stat.label}</span>
                    <span className={`font-black ${c.text}`}>{stat.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${c.bar}`}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
