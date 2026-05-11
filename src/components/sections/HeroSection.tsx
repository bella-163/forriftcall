export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-rift-radial" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.1),rgba(9,7,13,.95)),url('/images/hero-placeholder.svg')] bg-cover bg-center opacity-80" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
        <p className="mb-5 rounded-full border border-rift-crimson/45 bg-rift-crimson/10 px-5 py-2 text-sm font-bold tracking-[0.28em] text-rift-gold">
          Minecraft RPG 史詩冒險伺服器
        </p>
        <h1 className="text-6xl font-black tracking-[0.12em] text-white drop-shadow-[0_0_28px_rgba(217,45,69,.7)] md:text-8xl">
          斷界召喚
        </h1>
        <p className="mt-6 text-lg tracking-[0.32em] text-white/80 md:text-2xl">
          打破界線・召喚傳說・改寫命運
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#features"
            className="rounded-xl border border-rift-crimson/60 bg-rift-crimson px-8 py-3 text-base font-black text-white shadow-glow transition hover:-translate-y-1 hover:bg-rift-crimson/85"
          >
            查看攻略分類
          </a>
          <a
            href="#quick-start"
            className="rounded-xl border border-white/15 bg-white/10 px-8 py-3 text-base font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
          >
            快速開始
          </a>
        </div>
      </div>
    </section>
  );
}
