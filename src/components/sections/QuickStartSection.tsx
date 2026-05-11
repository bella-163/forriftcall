"use client";

import { useState } from "react";
import { quickStartItems } from "@/data/site";

export function QuickStartSection() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyIP(ip: string) {
    navigator.clipboard.writeText(ip);
    setCopied(ip);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <aside id="quick-start" className="rounded-3xl border border-rift-crimson/40 bg-rift-crimson/10 p-6 shadow-glow backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-black tracking-[0.2em] text-rift-gold">START HERE</p>
        <h2 className="mt-2 text-3xl font-black text-white">快速開始</h2>
      </div>

      <div className="space-y-4">
        {quickStartItems.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-black/35 p-4">
            {item.ips ? (
              <div>
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/58">{item.description}</p>
                <div className="mt-3 space-y-2">
                  {item.ips.map(({ label, ip }) => (
                    <div key={ip} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white/50">{label}</p>
                        <p className="truncate text-sm font-black text-rift-gold">{ip}</p>
                      </div>
                      <button
                        onClick={() => copyIP(ip)}
                        className="shrink-0 rounded-lg border border-rift-crimson/45 bg-rift-crimson/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rift-crimson/35"
                      >
                        {copied === ip ? "已複製！" : "複製"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/58">{item.description}</p>
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-rift-crimson/45 bg-rift-crimson/20 px-3 py-2 text-sm font-bold text-white transition hover:bg-rift-crimson/35"
                  >
                    {item.action}
                  </a>
                ) : (
                  <button className="shrink-0 rounded-lg border border-rift-crimson/45 bg-rift-crimson/20 px-3 py-2 text-sm font-bold text-white transition hover:bg-rift-crimson/35">
                    {item.action}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
