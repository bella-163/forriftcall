"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ClassData, Skill, ClassStat } from "@/types/site";

const COLOR_OPTIONS = ["crimson", "gold", "violet", "blue", "green", "gray"] as const;

const EMPTY_CLASS: ClassData = {
  slug: "",
  name: "",
  role: "",
  description: "",
  color: "crimson",
  image: "",
  stats: [
    { label: "傷害", value: "B" },
    { label: "射程", value: "C" },
    { label: "機動", value: "C" },
    { label: "控制", value: "C" },
    { label: "魔法", value: "C" },
    { label: "體質", value: "C" },
  ],
  skills: { pre: [{ name: "", description: "" }], post: [{ name: "", description: "" }] },
  tips: [""],
  phases: { pre: { 技能介紹: [], 推薦裝備: [], 推薦配件: [] }, post: { 技能介紹: [], 推薦裝備: [], 推薦配件: [] } },
};

function Input({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const cls = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-rift-crimson/60";
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-white/50">{label}</label>
      {multiline ? (
        <textarea rows={5} value={value} onChange={(e) => onChange(e.target.value)} className={cls + " resize-none"} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

export default function NewClassPage() {
  const router = useRouter();
  const [cls, setCls] = useState<ClassData>(EMPTY_CLASS);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function uploadImage(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const { url } = await res.json();
    setCls((c) => ({ ...c, image: url }));
    setUploading(false);
  }

  async function save() {
    if (!cls.slug) { alert("請填寫 Slug"); return; }
    setSaving(true);
    const allClasses: ClassData[] = await fetch("/api/admin/data?key=classes").then((r) => r.json());
    await fetch("/api/admin/data?key=classes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...allClasses, cls]),
    });
    router.push(`/admin/classes/${cls.slug}`);
  }

  function setField<K extends keyof ClassData>(key: K, value: ClassData[K]) { setCls((c) => ({ ...c, [key]: value })); }
  function updateSkill(phase: "pre" | "post", i: number, field: keyof Skill, value: string) {
    setCls((c) => { const skills = [...c.skills[phase]]; skills[i] = { ...skills[i], [field]: value }; return { ...c, skills: { ...c.skills, [phase]: skills } }; });
  }
  function addSkill(phase: "pre" | "post") { setCls((c) => ({ ...c, skills: { ...c.skills, [phase]: [...c.skills[phase], { name: "", description: "" }] } })); }
  function removeSkill(phase: "pre" | "post", i: number) { setCls((c) => ({ ...c, skills: { ...c.skills, [phase]: c.skills[phase].filter((_, idx) => idx !== i) } })); }
  function updateStat(i: number, field: keyof ClassStat, value: string) { setCls((c) => { const stats = [...c.stats]; stats[i] = { ...stats[i], [field]: value }; return { ...c, stats }; }); }
  function addStat() { setCls((c) => ({ ...c, stats: [...c.stats, { label: "", value: "C" }] })); }
  function removeStat(i: number) { setCls((c) => ({ ...c, stats: c.stats.filter((_, idx) => idx !== i) })); }
  function updateTip(i: number, value: string) { setCls((c) => { const tips = [...c.tips]; tips[i] = value; return { ...c, tips }; }); }
  function addTip() { setCls((c) => ({ ...c, tips: [...c.tips, ""] })); }
  function removeTip(i: number) { setCls((c) => ({ ...c, tips: c.tips.filter((_, idx) => idx !== i) })); }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin/classes" className="mb-3 inline-block text-sm text-white/40 hover:text-white">← 返回職業列表</Link>
          <h1 className="text-3xl font-black text-white">新增職業</h1>
        </div>
        <button onClick={save} disabled={saving} className="rounded-xl bg-rift-crimson px-6 py-2.5 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50">
          {saving ? "儲存中..." : "建立職業"}
        </button>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">基本資訊</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Slug (URL 路徑，英文)" value={cls.slug} onChange={(v) => setField("slug", v)} />
              <Input label="職業名稱" value={cls.name} onChange={(v) => setField("name", v)} />
              <div className="col-span-2"><Input label="職業定位" value={cls.role} onChange={(v) => setField("role", v)} /></div>
            </div>
            <Input label="職業描述" value={cls.description} onChange={(v) => setField("description", v)} multiline />
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50">主題色</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c} onClick={() => setField("color", c)} className={`rounded-lg px-4 py-2 text-sm font-bold border transition ${cls.color === c ? "border-white/60 bg-white/15 text-white" : "border-white/10 bg-white/5 text-white/50 hover:text-white"}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">職業圖片</h2>
          <div className="flex items-center gap-5">
            {cls.image && <img src={cls.image} alt="" className="h-24 w-24 object-contain rounded-xl border border-white/10" />}
            <div className="space-y-3 flex-1">
              <Input label="圖片路徑" value={cls.image} onChange={(v) => setField("image", v)} />
              <label className="block cursor-pointer rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 w-fit">
                {uploading ? "上傳中..." : "上傳圖片"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">能力值</h2>
            <button onClick={addStat} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
          </div>
          <div className="space-y-2">
            {cls.stats.map((stat, i) => (
              <div key={i} className="flex items-end gap-3">
                <div className="flex-1"><Input label="名稱" value={stat.label} onChange={(v) => updateStat(i, "label", v)} /></div>
                <div className="w-24">
                  <label className="mb-1.5 block text-xs font-bold text-white/50">等級</label>
                  <select value={String(stat.value)} onChange={(e) => updateStat(i, "value", e.target.value)} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none">
                    {["S", "A", "B", "C", "D", "E"].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <button onClick={() => removeStat(i)} className="mb-0.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20">刪除</button>
              </div>
            ))}
          </div>
        </section>

        {(["pre", "post"] as const).map((phase) => (
          <section key={phase} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">技能 — {phase === "pre" ? "二轉前" : "二轉後"}</h2>
              <button onClick={() => addSkill(phase)} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
            </div>
            <div className="space-y-4">
              {cls.skills[phase].map((skill, i) => (
                <div key={i} className="rounded-xl border border-white/10 p-4">
                  <div className="mb-3 flex justify-between"><span className="text-sm font-bold text-white/50">技能 {i + 1}</span><button onClick={() => removeSkill(phase, i)} className="text-xs text-red-400 hover:text-red-300">刪除</button></div>
                  <div className="space-y-3">
                    <Input label="技能名稱" value={skill.name} onChange={(v) => updateSkill(phase, i, "name", v)} />
                    <Input label="技能描述" value={skill.description} onChange={(v) => updateSkill(phase, i, "description", v)} multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">攻略提示</h2>
            <button onClick={addTip} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
          </div>
          <div className="space-y-3">
            {cls.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-1"><Input label={`提示 ${i + 1}`} value={tip} onChange={(v) => updateTip(i, v)} /></div>
                <button onClick={() => removeTip(i)} className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20">刪除</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={save} disabled={saving} className="rounded-xl bg-rift-crimson px-8 py-3 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50">
          {saving ? "儲存中..." : "建立職業"}
        </button>
      </div>
    </div>
  );
}
