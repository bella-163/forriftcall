"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SECTIONS = [
  { href: "/admin/home", label: "首頁內容", desc: "Hero 標語、功能卡片、攻略推薦、伺服器 IP" },
  { href: "/admin/classes", label: "職業列表", desc: "管理所有職業的資料與排序" },
  { href: "/admin/pages/commands", label: "功能與指令", desc: "指令清單內容" },
  { href: "/admin/news", label: "最新消息", desc: "各分類消息列表，可新增、編輯、刪除消息" },
  { href: "/admin/equipment", label: "裝備介紹", desc: "裝備項目清單，可點進去編輯內容" },
  { href: "/admin/monsters", label: "怪物介紹", desc: "怪物項目清單，可點進去編輯內容" },
  { href: "/admin/dungeons", label: "副本攻略", desc: "副本項目清單，可點進去編輯內容" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    fetch("/api/admin/data?key=home")
      .then((r) => {
        if (r.ok) {
          // try a PUT with empty body to check auth
          return fetch("/api/admin/data?key=__ping", { method: "PUT", headers: { "Content-Type": "application/json" }, body: "null" });
        }
        return r;
      })
      .then((r) => setAuthed(r.status !== 401))
      .catch(() => setAuthed(false));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLogging(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLogging(false);
    if (res.ok) {
      setAuthed(true);
    } else {
      setError("密碼錯誤，請再試一次。");
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setPassword("");
  }

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white/50">載入中...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <p className="mb-2 text-sm font-black tracking-[0.22em] text-rift-crimson">ADMIN</p>
          <h1 className="mb-8 text-4xl font-black text-white">管理員登入</h1>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              placeholder="輸入管理員密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-rift-crimson/60 focus:ring-1 focus:ring-rift-crimson/30"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={logging}
              className="w-full rounded-xl bg-rift-crimson px-4 py-3 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50"
            >
              {logging ? "登入中..." : "登入"}
            </button>
          </form>
          <p className="mt-6 text-xs text-white/30">
            管理員密碼請查看環境變數 ADMIN_PASSWORD
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-black tracking-[0.22em] text-rift-crimson">ADMIN PANEL</p>
          <h1 className="mt-2 text-4xl font-black text-white">管理員面板</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/70 transition hover:text-white"
          >
            查看網站 →
          </Link>
          <button
            onClick={logout}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/50 transition hover:text-white"
          >
            登出
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-rift-crimson/40"
          >
            <h2 className="text-xl font-black text-white group-hover:text-rift-crimson">{s.label}</h2>
            <p className="mt-2 text-sm text-white/55">{s.desc}</p>
            <p className="mt-4 text-sm font-bold text-white/30 group-hover:text-rift-crimson/70">編輯 →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
