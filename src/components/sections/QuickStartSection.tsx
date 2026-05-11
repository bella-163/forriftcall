import { quickStartItems } from "@/data/site";

export function QuickStartSection() {
  return (
    <aside id="quick-start" className="rounded-3xl border border-rift-crimson/40 bg-rift-crimson/10 p-6 shadow-glow backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-black tracking-[0.2em] text-rift-gold">START HERE</p>
        <h2 className="mt-2 text-3xl font-black text-white">快速開始</h2>
      </div>

      <div className="space-y-4">
        {quickStartItems.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/58">{item.description}</p>
              </div>
              <button className="shrink-0 rounded-lg border border-rift-crimson/45 bg-rift-crimson/20 px-3 py-2 text-sm font-bold text-white transition hover:bg-rift-crimson/35">
                {item.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
