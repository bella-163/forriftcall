export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-rift-radial" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.1),rgba(9,7,13,.95))] opacity-80" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
        <div className="relative flex items-center justify-center">
          <img
            src="/images/icon.png"
            alt=""
            className="absolute z-0 h-52 w-auto opacity-90 md:h-72"
          />
          <img
            src="/images/logo.png"
            alt="斷界召喚"
            className="relative z-10 h-40 w-auto drop-shadow-[0_0_28px_rgba(217,45,69,.7)] md:h-56"
          />
        </div>
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
