import Link from "next/link";
import { navItems } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-rift-violet/60 bg-rift-violet/15 shadow-glow transition group-hover:scale-105">
            <span className="text-xl">✦</span>
          </div>
          <div>
            <p className="text-xl font-black tracking-[0.16em] text-white">斷界召喚</p>
            <p className="text-xs tracking-[0.22em] text-white/55">Minecraft RPG Server</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/75 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative transition hover:text-rift-crimson"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/commands"
          className="hidden rounded-lg border border-rift-crimson/50 bg-rift-crimson/15 px-4 py-2 text-sm font-bold text-white transition hover:bg-rift-crimson/25 md:inline-flex"
        >
          快速開始
        </Link>
      </div>
    </header>
  );
}
