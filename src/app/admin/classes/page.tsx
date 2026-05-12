"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ClassData } from "@/types/site";

const colorBadge: Record<string, string> = {
  crimson: "bg-rift-crimson/20 text-rift-crimson",
  blue: "bg-rift-blue/20 text-rift-blue",
  violet: "bg-rift-violet/20 text-rift-violet",
  gold: "bg-rift-gold/20 text-rift-gold",
  gray: "bg-slate-500/20 text-slate-300",
  green: "bg-emerald-500/20 text-emerald-400",
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassData[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/data?key=classes").then((r) => r.json()).then(setClasses);
  }, []);

  async function deleteClass(slug: string) {
    if (!confirm(`確定要刪除「${slug}」職業嗎？`)) return;
    const updated = classes!.filter((c) => c.slug !== slug);
    await fetch("/api/admin/data?key=classes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setClasses(updated);
  }

  if (!classes) return <div className="flex min-h-screen items-center justify-center"><p className="text-white/50">載入中...</p></div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-3 inline-block text-sm text-white/40 hover:text-white">← 返回面板</Link>
          <h1 className="text-3xl font-black text-white">職業管理</h1>
        </div>
        <Link
          href="/admin/classes/new"
          className="rounded-xl bg-rift-crimson px-5 py-2.5 font-black text-white transition hover:bg-rift-crimson/85"
        >
          + 新增職業
        </Link>
      </div>

      <div className="space-y-3">
        {classes.map((cls) => (
          <div key={cls.slug} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            {cls.image && (
              <img src={cls.image} alt={cls.name} className="h-16 w-16 shrink-0 object-contain" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-black text-white">{cls.name}</h2>
                <span className={`rounded-full px-2 py-0.5 text-xs font-black ${colorBadge[cls.color] ?? colorBadge.gray}`}>
                  {cls.color}
                </span>
              </div>
              <p className="text-sm text-white/50">{cls.role}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/admin/classes/${cls.slug}`}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
              >
                編輯
              </Link>
              <button
                onClick={() => deleteClass(cls.slug)}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <p className="text-center text-white/30 py-12">還沒有任何職業，點擊「新增職業」開始。</p>
        )}
      </div>
    </div>
  );
}
