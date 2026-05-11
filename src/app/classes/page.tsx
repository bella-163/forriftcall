import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

const classes = [
  {
    name: "重裝戰士",
    role: "前線坦克・近戰守護者",
    description: "身披重甲、以盾為刃，是隊伍中不可或缺的前線守護者。",
    href: "/classes/heavy-warrior",
    color: "border-rift-crimson/45 bg-rift-crimson/10 hover:border-rift-crimson/70",
    badge: "bg-rift-crimson/20 text-rift-crimson",
    arrow: "text-rift-crimson",
  },
  {
    name: "疾風遊俠",
    role: "遠距輸出・機動射手",
    description: "來去如風、箭無虛發，以靈活機動在遠距離掌控戰局。",
    href: "/classes/wind-ranger",
    color: "border-rift-blue/45 bg-rift-blue/10 hover:border-rift-blue/70",
    badge: "bg-rift-blue/20 text-rift-blue",
    arrow: "text-rift-blue",
  },
  {
    name: "萬象法師",
    role: "爆發輸出・元素魔法師",
    description: "掌握萬象之力，以元素魔法橫掃戰場、輸出無雙。",
    href: "/classes/arcane-mage",
    color: "border-rift-violet/45 bg-rift-violet/10 hover:border-rift-violet/70",
    badge: "bg-rift-violet/20 text-rift-violet",
    arrow: "text-rift-violet",
  },
  {
    name: "裁光行者",
    role: "神聖輔助・治癒者",
    description: "以神聖之光治癒盟友、懲戒敵人，是支撐隊伍續戰的核心。",
    href: "/classes/light-walker",
    color: "border-rift-gold/45 bg-rift-gold/10 hover:border-rift-gold/70",
    badge: "bg-rift-gold/20 text-rift-gold",
    arrow: "text-rift-gold",
  },
  {
    name: "暗影刺客",
    role: "單體爆發・隱匿刺殺者",
    description: "潛行於暗處、一擊致命，以極致爆發力終結目標。",
    href: "/classes/shadow-assassin",
    color: "border-slate-500/45 bg-slate-500/10 hover:border-slate-400/70",
    badge: "bg-slate-500/20 text-slate-300",
    arrow: "text-slate-300",
  },
];

export default function ClassesPage() {
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
          {classes.map((cls) => (
            <Link
              key={cls.href}
              href={cls.href}
              className={`group rounded-2xl border p-6 backdrop-blur transition hover:-translate-y-1 ${cls.color}`}
            >
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-black ${cls.badge}`}>
                {cls.role}
              </span>
              <h2 className="mt-3 text-3xl font-black text-white">{cls.name}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{cls.description}</p>
              <div className={`mt-5 flex items-center gap-1 text-sm font-bold ${cls.arrow}`}>
                查看詳情 <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
