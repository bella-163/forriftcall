"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { SectionListData } from "@/types/site";

export default function AdminMonstersPage() {
  const [data, setData] = useState<SectionListData | null>(null);

  useEffect(() => {
    fetch("/api/admin/data?key=monsters").then((r) => r.json()).then(setData);
  }, []);

  async function deleteItem(slug: string) {
    if (!data) return;
    if (!confirm("確定刪除？")) return;
    const updated = { ...data, items: data.items.filter((i) => i.slug !== slug) };
    await fetch("/api/admin/data?key=monsters", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setData(updated);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-3 inline-block text-sm text-white/40 hover:text-white">← 返回面板</Link>
          <h1 className="text-3xl font-black text-white">怪物介紹管理</h1>
        </div>
        <Link href="/admin/monsters/new" className="rounded-xl bg-rift-crimson px-5 py-2.5 text-sm font-black text-white hover:bg-rift-crimson/85">
          + 新增怪物
        </Link>
      </div>
      {!data ? (
        <p className="text-white/40">載入中...</p>
      ) : (
        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item.slug} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              {item.image && <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-contain border border-white/10" />}
              <div className="flex-1">
                <p className="font-black text-white">{item.name}</p>
                <p className="text-sm text-white/45">{item.category} · {item.slug}</p>
              </div>
              <Link href={`/admin/monsters/${item.slug}`} className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">編輯</Link>
              <button onClick={() => deleteItem(item.slug)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20">刪除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
