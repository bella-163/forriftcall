"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import type { PageData } from "@/types/site";

const PAGE_LABELS: Record<string, string> = {
  commands: "功能與指令",
  news: "最新消息",
  equipment: "裝備介紹",
  monsters: "怪物介紹",
  dungeons: "副本攻略",
};

export default function AdminPageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const [data, setData] = useState<PageData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/data?key=${page}`).then((r) => r.json()).then(setData);
  }, [page]);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/data?key=${page}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateItem(i: number, value: string) {
    setData((d) => { if (!d) return d; const items = [...d.items]; items[i] = value; return { ...d, items }; });
  }
  function addItem() { setData((d) => d ? { ...d, items: [...d.items, ""] } : d); }
  function removeItem(i: number) { setData((d) => d ? { ...d, items: d.items.filter((_, idx) => idx !== i) } : d); }

  if (!data) return <div className="flex min-h-screen items-center justify-center"><p className="text-white/50">載入中...</p></div>;

  const cls = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-rift-crimson/60";

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-3 inline-block text-sm text-white/40 hover:text-white">← 返回面板</Link>
          <h1 className="text-3xl font-black text-white">{PAGE_LABELS[page] ?? page}</h1>
        </div>
        <button onClick={save} disabled={saving} className="rounded-xl bg-rift-crimson px-6 py-2.5 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50">
          {saving ? "儲存中..." : saved ? "已儲存 ✓" : "儲存"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Page Meta */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">頁面資訊</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50">頁面標題</label>
              <input value={data.title} onChange={(e) => setData((d) => d ? { ...d, title: e.target.value } : d)} className={cls} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50">描述</label>
              <textarea rows={3} value={data.description} onChange={(e) => setData((d) => d ? { ...d, description: e.target.value } : d)} className={cls + " resize-none"} />
            </div>
          </div>
        </section>

        {/* Items */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">項目清單</h2>
            <button onClick={addItem} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
          </div>
          <div className="space-y-2">
            {data.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  className={cls + " flex-1"}
                />
                <button onClick={() => removeItem(i)} className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20">刪除</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={save} disabled={saving} className="rounded-xl bg-rift-crimson px-8 py-3 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50">
          {saving ? "儲存中..." : saved ? "已儲存 ✓" : "儲存所有變更"}
        </button>
      </div>
    </div>
  );
}
