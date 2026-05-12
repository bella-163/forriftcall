"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { HomeData, FeatureCard, GuideCard, QuickStartItem } from "@/types/site";

const THEME_OPTIONS = ["crimson", "gold", "violet", "blue"] as const;

function Input({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const cls = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-rift-crimson/60";
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-white/50">{label}</label>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={cls + " resize-none"} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

export default function AdminHomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/data?key=home").then((r) => r.json()).then(setData);
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/data?key=home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateHero(field: string, value: string) {
    setData((d) => d ? { ...d, hero: { ...d.hero, [field]: value } } : d);
  }
  function updateHeroCta(which: "ctaPrimary" | "ctaSecondary", field: string, value: string) {
    setData((d) => d ? { ...d, hero: { ...d.hero, [which]: { ...d.hero[which], [field]: value } } } : d);
  }
  function updateFeatureCard(i: number, field: keyof FeatureCard, value: string) {
    setData((d) => {
      if (!d) return d;
      const cards = [...d.featureCards];
      cards[i] = { ...cards[i], [field]: value };
      return { ...d, featureCards: cards };
    });
  }
  function addFeatureCard() {
    setData((d) => d ? { ...d, featureCards: [...d.featureCards, { title: "新分類", eyebrow: "", description: "", href: "/", theme: "crimson" }] } : d);
  }
  function removeFeatureCard(i: number) {
    setData((d) => d ? { ...d, featureCards: d.featureCards.filter((_, idx) => idx !== i) } : d);
  }
  function updateGuideCard(i: number, field: keyof GuideCard, value: string) {
    setData((d) => {
      if (!d) return d;
      const cards = [...d.guideCards];
      cards[i] = { ...cards[i], [field]: value };
      return { ...d, guideCards: cards };
    });
  }
  function addGuideCard() {
    setData((d) => d ? { ...d, guideCards: [...d.guideCards, { title: "新攻略", category: "熱門", description: "", rating: "5.0" }] } : d);
  }
  function removeGuideCard(i: number) {
    setData((d) => d ? { ...d, guideCards: d.guideCards.filter((_, idx) => idx !== i) } : d);
  }
  function updateServerIP(i: number, field: "label" | "ip", value: string) {
    setData((d) => {
      if (!d) return d;
      const ips = [...d.serverIPs];
      ips[i] = { ...ips[i], [field]: value };
      return { ...d, serverIPs: ips };
    });
  }
  function addServerIP() {
    setData((d) => d ? { ...d, serverIPs: [...d.serverIPs, { label: "新伺服器", ip: "" }] } : d);
  }
  function removeServerIP(i: number) {
    setData((d) => d ? { ...d, serverIPs: d.serverIPs.filter((_, idx) => idx !== i) } : d);
  }
  function updateQuickStart(i: number, field: keyof QuickStartItem, value: string) {
    setData((d) => {
      if (!d) return d;
      const items = [...d.quickStart];
      items[i] = { ...items[i], [field]: value };
      return { ...d, quickStart: items };
    });
  }
  function addQuickStart() {
    setData((d) => d ? { ...d, quickStart: [...d.quickStart, { title: "新項目", description: "", action: "查看" }] } : d);
  }
  function removeQuickStart(i: number) {
    setData((d) => d ? { ...d, quickStart: d.quickStart.filter((_, idx) => idx !== i) } : d);
  }

  if (!data) return <div className="flex min-h-screen items-center justify-center"><p className="text-white/50">載入中...</p></div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-3 inline-block text-sm text-white/40 hover:text-white">← 返回面板</Link>
          <h1 className="text-3xl font-black text-white">首頁內容</h1>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-rift-crimson px-6 py-2.5 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50"
        >
          {saving ? "儲存中..." : saved ? "已儲存 ✓" : "儲存"}
        </button>
      </div>

      <div className="space-y-10">
        {/* Hero */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">Hero 區塊</h2>
          <div className="space-y-4">
            <Input label="標語文字" value={data.hero.tagline} onChange={(v) => updateHero("tagline", v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="主按鈕文字" value={data.hero.ctaPrimary.text} onChange={(v) => updateHeroCta("ctaPrimary", "text", v)} />
              <Input label="主按鈕連結" value={data.hero.ctaPrimary.href} onChange={(v) => updateHeroCta("ctaPrimary", "href", v)} />
              <Input label="次按鈕文字" value={data.hero.ctaSecondary.text} onChange={(v) => updateHeroCta("ctaSecondary", "text", v)} />
              <Input label="次按鈕連結" value={data.hero.ctaSecondary.href} onChange={(v) => updateHeroCta("ctaSecondary", "href", v)} />
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">功能卡片</h2>
            <button onClick={addFeatureCard} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
          </div>
          <div className="space-y-4">
            {data.featureCards.map((card, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-white/60">卡片 {i + 1}</span>
                  <button onClick={() => removeFeatureCard(i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="標題" value={card.title} onChange={(v) => updateFeatureCard(i, "title", v)} />
                  <Input label="副標題 (eyebrow)" value={card.eyebrow} onChange={(v) => updateFeatureCard(i, "eyebrow", v)} />
                  <div className="col-span-2">
                    <Input label="描述" value={card.description} onChange={(v) => updateFeatureCard(i, "description", v)} multiline />
                  </div>
                  <Input label="連結" value={card.href} onChange={(v) => updateFeatureCard(i, "href", v)} />
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-white/50">主題色</label>
                    <select
                      value={card.theme}
                      onChange={(e) => updateFeatureCard(i, "theme", e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none"
                    >
                      {THEME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guide Cards */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">推薦攻略卡片</h2>
            <button onClick={addGuideCard} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
          </div>
          <div className="space-y-4">
            {data.guideCards.map((card, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-white/60">攻略 {i + 1}</span>
                  <button onClick={() => removeGuideCard(i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="標題" value={card.title} onChange={(v) => updateGuideCard(i, "title", v)} />
                  <Input label="分類" value={card.category} onChange={(v) => updateGuideCard(i, "category", v)} />
                  <div className="col-span-2">
                    <Input label="描述" value={card.description} onChange={(v) => updateGuideCard(i, "description", v)} />
                  </div>
                  <Input label="評分" value={card.rating} onChange={(v) => updateGuideCard(i, "rating", v)} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Server IPs */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">伺服器 IP</h2>
            <button onClick={addServerIP} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
          </div>
          <div className="space-y-3">
            {data.serverIPs.map((ip, i) => (
              <div key={i} className="flex items-end gap-3">
                <div className="flex-1">
                  <Input label="標籤" value={ip.label} onChange={(v) => updateServerIP(i, "label", v)} />
                </div>
                <div className="flex-1">
                  <Input label="IP 位址" value={ip.ip} onChange={(v) => updateServerIP(i, "ip", v)} />
                </div>
                <button onClick={() => removeServerIP(i)} className="mb-0.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20">刪除</button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">快速開始</h2>
            <button onClick={addQuickStart} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
          </div>
          <div className="space-y-4">
            {data.quickStart.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-white/60">項目 {i + 1}</span>
                  <button onClick={() => removeQuickStart(i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="標題" value={item.title} onChange={(v) => updateQuickStart(i, "title", v)} />
                  <Input label="描述" value={item.description} onChange={(v) => updateQuickStart(i, "description", v)} />
                  <Input label="按鈕文字" value={item.action} onChange={(v) => updateQuickStart(i, "action", v)} />
                  <Input label="連結 (選填)" value={item.href ?? ""} onChange={(v) => updateQuickStart(i, "href", v)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-rift-crimson px-8 py-3 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50"
        >
          {saving ? "儲存中..." : saved ? "已儲存 ✓" : "儲存所有變更"}
        </button>
      </div>
    </div>
  );
}
