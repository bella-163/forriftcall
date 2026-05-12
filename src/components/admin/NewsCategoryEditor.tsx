"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NewsPageData, NewsPost } from "@/types/site";

function createPost(): NewsPost {
  return {
    id: Date.now().toString(),
    date: new Date().toISOString().split("T")[0],
    title: "",
    content: "",
    image: "",
    dcLink: "",
  };
}

const cls =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-rift-crimson/60";

export function NewsCategoryEditor({ slug, backHref }: { slug: string; backHref: string }) {
  const [pageData, setPageData] = useState<NewsPageData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draft, setDraft] = useState<NewsPost>(createPost());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/data?key=news")
      .then((r) => r.json())
      .then(setPageData);
  }, []);

  const catIdx = pageData ? pageData.categories.findIndex((c) => c.slug === slug) : -1;
  const category = catIdx >= 0 ? pageData!.categories[catIdx] : null;
  const sortedPosts = category
    ? [...category.posts].sort((a, b) => b.date.localeCompare(a.date))
    : [];

  async function persist(updated: NewsPageData) {
    setSaving(true);
    await fetch("/api/admin/data?key=news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function withUpdatedPosts(posts: NewsPost[]): NewsPageData | null {
    if (!pageData || catIdx < 0) return null;
    const cats = [...pageData.categories];
    cats[catIdx] = { ...cats[catIdx], posts };
    return { ...pageData, categories: cats };
  }

  function addPost() {
    if (!draft.title.trim()) return;
    const updated = withUpdatedPosts([...(category?.posts ?? []), draft]);
    if (!updated) return;
    setPageData(updated);
    persist(updated);
    setDraft(createPost());
    setShowAddForm(false);
  }

  function deletePost(postId: string) {
    if (!confirm("確定要刪除這則消息嗎？")) return;
    const updated = withUpdatedPosts((category?.posts ?? []).filter((p) => p.id !== postId));
    if (!updated) return;
    setPageData(updated);
    persist(updated);
  }

  function updatePostField(postId: string, field: keyof NewsPost, value: string) {
    const updated = withUpdatedPosts(
      (category?.posts ?? []).map((p) => (p.id === postId ? { ...p, [field]: value } : p))
    );
    if (updated) setPageData(updated);
  }

  function saveEdits() {
    if (pageData) persist(pageData);
  }

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white/50">載入中...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16">
        <Link href={backHref} className="text-sm text-white/40 hover:text-white">
          ← 返回
        </Link>
        <p className="mt-8 text-white/50">找不到此消息分類。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={backHref} className="mb-3 inline-block text-sm text-white/40 hover:text-white">
            ← 返回消息列表
          </Link>
          <h1 className="text-3xl font-black text-white">{category.name}</h1>
          <p className="mt-1 text-sm text-white/45">{sortedPosts.length} 則消息</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowAddForm(true);
              setExpandedId(null);
            }}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-black text-white hover:bg-white/10"
          >
            + 新增消息
          </button>
          <button
            onClick={saveEdits}
            disabled={saving}
            className="rounded-xl bg-rift-crimson px-6 py-2.5 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50"
          >
            {saving ? "儲存中..." : saved ? "已儲存 ✓" : "儲存"}
          </button>
        </div>
      </div>

      {/* Add new post form */}
      {showAddForm && (
        <div className="mb-6 rounded-2xl border border-rift-crimson/40 bg-rift-crimson/5 p-6">
          <h2 className="mb-5 text-xl font-black text-white">新增消息</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-white/50">標題</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="消息標題"
                  className={cls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-white/50">日期</label>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                  className={cls}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50">內文</label>
              <textarea
                rows={5}
                value={draft.content}
                onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                placeholder="消息內容..."
                className={cls + " resize-none"}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-white/50">圖片網址</label>
                <input
                  value={draft.image}
                  onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                  placeholder="https://..."
                  className={cls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-white/50">Discord 訊息連結</label>
                <input
                  value={draft.dcLink}
                  onChange={(e) => setDraft((d) => ({ ...d, dcLink: e.target.value }))}
                  placeholder="https://discord.com/channels/..."
                  className={cls}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={addPost}
              className="rounded-xl bg-rift-crimson px-6 py-2.5 font-black text-white hover:bg-rift-crimson/85"
            >
              新增
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setDraft(createPost());
              }}
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 font-bold text-white/70 hover:text-white"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Posts list */}
      {sortedPosts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <p className="text-white/40">尚無消息，點擊「新增消息」開始新增。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPosts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-white/10 bg-white/[0.03]">
              {/* Collapsed row */}
              <div
                className="flex cursor-pointer items-center gap-4 p-4"
                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
              >
                <span className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-white/60">
                  {post.date}
                </span>
                <p className="flex-1 font-bold text-white">{post.title || "(無標題)"}</p>
                <span className="text-white/30 text-xs">{expandedId === post.id ? "▲" : "▼"}</span>
              </div>

              {/* Expanded edit form */}
              {expandedId === post.id && (
                <div className="border-t border-white/10 p-5">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-white/50">標題</label>
                        <input
                          value={post.title}
                          onChange={(e) => updatePostField(post.id, "title", e.target.value)}
                          className={cls}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-white/50">日期</label>
                        <input
                          type="date"
                          value={post.date}
                          onChange={(e) => updatePostField(post.id, "date", e.target.value)}
                          className={cls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-white/50">內文</label>
                      <textarea
                        rows={5}
                        value={post.content}
                        onChange={(e) => updatePostField(post.id, "content", e.target.value)}
                        className={cls + " resize-none"}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-white/50">圖片網址</label>
                        <input
                          value={post.image}
                          onChange={(e) => updatePostField(post.id, "image", e.target.value)}
                          placeholder="https://..."
                          className={cls}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-white/50">Discord 訊息連結</label>
                        <input
                          value={post.dcLink}
                          onChange={(e) => updatePostField(post.id, "dcLink", e.target.value)}
                          placeholder="https://discord.com/channels/..."
                          className={cls}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between">
                    <button
                      onClick={() => deletePost(post.id)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20"
                    >
                      刪除
                    </button>
                    <button
                      onClick={saveEdits}
                      disabled={saving}
                      className="rounded-xl bg-rift-crimson px-6 py-2 text-sm font-bold text-white hover:bg-rift-crimson/85 disabled:opacity-50"
                    >
                      {saving ? "儲存中..." : saved ? "已儲存 ✓" : "儲存變更"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
