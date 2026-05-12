"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NewsPageData } from "@/types/site";

export default function AdminNewsPage() {
  const [data, setData] = useState<NewsPageData | null>(null);

  useEffect(() => {
    fetch("/api/admin/data?key=news")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="mb-10">
        <Link href="/admin" className="mb-3 inline-block text-sm text-white/40 hover:text-white">
          ← 返回面板
        </Link>
        <h1 className="text-3xl font-black text-white">最新消息管理</h1>
        <p className="mt-1 text-sm text-white/45">點擊各分類來新增或編輯消息</p>
      </div>

      {!data ? (
        <p className="text-white/40">載入中...</p>
      ) : (
        <div className="space-y-3">
          {data.categories.map((cat) => {
            const latestPost =
              cat.posts.length > 0
                ? [...cat.posts].sort((a, b) => b.date.localeCompare(a.date))[0]
                : null;
            return (
              <div
                key={cat.slug}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex-1">
                  <p className="font-black text-white">{cat.name}</p>
                  <p className="text-sm text-white/45">
                    {cat.posts.length} 則消息
                    {latestPost ? ` · 最新：${latestPost.date} ${latestPost.title}` : ""}
                  </p>
                </div>
                <Link
                  href={`/admin/news/${cat.slug}`}
                  className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  編輯
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
