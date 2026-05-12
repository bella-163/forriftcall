"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CatalogRef, ClassData, SectionListData, Skill, ClassStat, PhaseBlock } from "@/types/site";

const COLOR_OPTIONS = ["crimson", "gold", "violet", "blue", "green", "gray"] as const;

const EMPTY_CLASS: ClassData = {
  slug: "",
  name: "",
  role: "",
  description: "",
  color: "crimson",
  image: "",
  imageRef: undefined,
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
  phases: {
    pre: { 技能介紹: [], 推薦裝備: [], 推薦配件: [] },
    post: { 技能介紹: [], 推薦裝備: [], 推薦配件: [] },
  },
};

type CatalogOption = {
  type: CatalogRef["type"];
  parentSlug?: string;
  slug: string;
  name: string;
};

function refToValue(ref?: CatalogRef) {
  if (!ref) return "";
  return ref.parentSlug ? `${ref.type}:${ref.parentSlug}/${ref.slug}` : `${ref.type}:${ref.slug}`;
}

function valueToRef(value: string): CatalogRef | undefined {
  const [type, rawSlug] = value.split(":");
  if ((type !== "equipment" && type !== "materials") || !rawSlug) return undefined;
  const [parentSlug, slug] = rawSlug.includes("/") ? rawSlug.split("/") : ["", rawSlug];
  if (!slug) return undefined;
  if (type === "equipment" && parentSlug) return { type, parentSlug, slug };
  return { type, slug };
}

function refLabel(type: CatalogRef["type"]) {
  return type === "equipment" ? "裝備" : "素材";
}

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

export default function ClassEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const isNew = slug === "new";
  const router = useRouter();

  const [cls, setCls] = useState<ClassData>(EMPTY_CLASS);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [catalogOptions, setCatalogOptions] = useState<CatalogOption[]>([]);

  useEffect(() => {
    fetch("/api/admin/data?key=equipment")
      .then((r) => r.json())
      .then((data: SectionListData) => data.items.flatMap((parent) =>
        (parent.pieces ?? []).map((piece) => ({
          type: "equipment" as const,
          parentSlug: parent.slug,
          slug: piece.slug || piece.name,
          name: `${parent.name} / ${piece.name || "未命名裝備"}`,
        })),
      ))
      .then((equipment) => {
        fetch("/api/admin/data?key=materials")
          .then((r) => r.json())
          .then((data: SectionListData) => {
            const materials = data.items.map((i) => ({ type: "materials" as const, slug: i.slug, name: i.name }));
            setCatalogOptions([...equipment, ...materials]);
          })
          .catch(() => setCatalogOptions(equipment));
      })
      .catch(() => setCatalogOptions([]));

    if (isNew) return;
    fetch("/api/admin/data?key=classes")
      .then((r) => r.json())
      .then((classes: ClassData[]) => {
        const found = classes.find((c) => c.slug === slug);
        if (found) {
          // migrate old string phases to new PhaseBlock[] format
          const migrated = { ...found };
          (["pre", "post"] as const).forEach((phase) => {
            const p: Record<string, PhaseBlock[]> = {};
            Object.entries(found.phases[phase]).forEach(([k, v]) => {
              p[k] = Array.isArray(v)
                ? v.map((block) => ({ title: block.title ?? "", image: block.image ?? "", text: block.text ?? "", ref: block.ref }))
                : (v ? [{ title: "", image: "", text: v as unknown as string }] : []);
            });
            migrated.phases = { ...migrated.phases, [phase]: p };
          });
          setCls(migrated);
        }
      });
  }, [slug, isNew]);

  async function uploadImageTo(file: File, callback: (url: string) => void) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        alert("上傳失敗：" + (data.error ?? res.status));
        return;
      }
      callback(data.url);
    } catch {
      alert("上傳失敗：網路錯誤，請再試一次");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    const allClasses: ClassData[] = await fetch("/api/admin/data?key=classes").then((r) => r.json());
    let updated: ClassData[];
    if (isNew) {
      updated = [...allClasses, cls];
    } else {
      updated = allClasses.map((c) => (c.slug === slug ? cls : c));
    }
    await fetch("/api/admin/data?key=classes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    setSaved(true);
    if (isNew) router.push(`/admin/classes/${cls.slug}`);
    setTimeout(() => setSaved(false), 2000);
  }

  function setField<K extends keyof ClassData>(key: K, value: ClassData[K]) {
    setCls((c) => ({ ...c, [key]: value }));
  }
  function setImageRef(ref?: CatalogRef) {
    setCls((c) => ({ ...c, imageRef: ref, image: ref ? "" : c.image }));
  }
  function updateSkill(phase: "pre" | "post", i: number, field: keyof Skill, value: string) {
    setCls((c) => {
      const skills = [...c.skills[phase]];
      skills[i] = { ...skills[i], [field]: value };
      return { ...c, skills: { ...c.skills, [phase]: skills } };
    });
  }
  function addSkill(phase: "pre" | "post") {
    setCls((c) => ({ ...c, skills: { ...c.skills, [phase]: [...c.skills[phase], { name: "", description: "" }] } }));
  }
  function removeSkill(phase: "pre" | "post", i: number) {
    setCls((c) => ({ ...c, skills: { ...c.skills, [phase]: c.skills[phase].filter((_, idx) => idx !== i) } }));
  }
  function updateStat(i: number, field: keyof ClassStat, value: string) {
    setCls((c) => {
      const stats = [...c.stats];
      stats[i] = { ...stats[i], [field]: value };
      return { ...c, stats };
    });
  }
  function addStat() {
    setCls((c) => ({ ...c, stats: [...c.stats, { label: "", value: "C" }] }));
  }
  function removeStat(i: number) {
    setCls((c) => ({ ...c, stats: c.stats.filter((_, idx) => idx !== i) }));
  }
  function updateTip(i: number, value: string) {
    setCls((c) => { const tips = [...c.tips]; tips[i] = value; return { ...c, tips }; });
  }
  function addTip() { setCls((c) => ({ ...c, tips: [...c.tips, ""] })); }
  function removeTip(i: number) { setCls((c) => ({ ...c, tips: c.tips.filter((_, idx) => idx !== i) })); }

  // Phase block management
  function addPhaseSection(phase: "pre" | "post") {
    const newKey = prompt("請輸入區塊名稱（例如：技能介紹）");
    if (!newKey) return;
    setCls((c) => ({ ...c, phases: { ...c.phases, [phase]: { ...c.phases[phase], [newKey]: [] } } }));
  }
  function removePhaseSection(phase: "pre" | "post", key: string) {
    setCls((c) => {
      const p = { ...c.phases[phase] };
      delete p[key];
      return { ...c, phases: { ...c.phases, [phase]: p } };
    });
  }
  function addBlock(phase: "pre" | "post", sectionKey: string) {
    setCls((c) => {
      const blocks = [...(c.phases[phase][sectionKey] ?? []), { title: "", image: "", text: "" }];
      return { ...c, phases: { ...c.phases, [phase]: { ...c.phases[phase], [sectionKey]: blocks } } };
    });
  }
  function removeBlock(phase: "pre" | "post", sectionKey: string, i: number) {
    setCls((c) => {
      const blocks = c.phases[phase][sectionKey].filter((_, idx) => idx !== i);
      return { ...c, phases: { ...c.phases, [phase]: { ...c.phases[phase], [sectionKey]: blocks } } };
    });
  }
  function updateBlock(phase: "pre" | "post", sectionKey: string, i: number, field: keyof PhaseBlock, value: string | CatalogRef | undefined) {
    setCls((c) => {
      const blocks = [...c.phases[phase][sectionKey]];
      blocks[i] = { ...blocks[i], [field]: value };
      if (field === "ref" && value) blocks[i] = { ...blocks[i], image: "", title: "" };
      return { ...c, phases: { ...c.phases, [phase]: { ...c.phases[phase], [sectionKey]: blocks } } };
    });
  }

  function ReferenceSelect({ value, onChange, label }: { value?: CatalogRef; onChange: (ref?: CatalogRef) => void; label: string }) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-bold text-white/50">{label}</label>
        <select
          value={refToValue(value)}
          onChange={(e) => onChange(valueToRef(e.target.value))}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
        >
          <option value="">不引用</option>
          {catalogOptions.map((option) => (
            <option key={refToValue(option)} value={refToValue(option)}>
              {refLabel(option.type)} / {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const SaveBtn = () => (
    <button onClick={save} disabled={saving} className="rounded-xl bg-rift-crimson px-6 py-2.5 font-black text-white transition hover:bg-rift-crimson/85 disabled:opacity-50">
      {saving ? "儲存中..." : saved ? "已儲存 ✓" : "儲存"}
    </button>
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/admin/classes" className="mb-3 inline-block text-sm text-white/40 hover:text-white">← 返回職業列表</Link>
          <h1 className="text-3xl font-black text-white">{isNew ? "新增職業" : `編輯：${cls.name}`}</h1>
        </div>
        <SaveBtn />
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">基本資訊</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Slug (URL 路徑)" value={cls.slug} onChange={(v) => setField("slug", v)} />
              <Input label="職業名稱" value={cls.name} onChange={(v) => setField("name", v)} />
              <div className="col-span-2">
                <Input label="職業定位 (role)" value={cls.role} onChange={(v) => setField("role", v)} />
              </div>
            </div>
            <Input label="職業描述" value={cls.description} onChange={(v) => setField("description", v)} multiline />
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50">主題色</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setField("color", c)}
                    className={`rounded-lg px-4 py-2 text-sm font-bold border transition ${cls.color === c ? "border-white/60 bg-white/15 text-white" : "border-white/10 bg-white/5 text-white/50 hover:text-white"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">職業圖片</h2>
          <div className="flex items-center gap-5">
            {cls.image && !cls.imageRef && <img src={cls.image} alt="" className="h-24 w-24 object-contain rounded-xl border border-white/10" />}
            <div className="space-y-3">
              <ReferenceSelect label="引用裝備或素材（選了之後會使用該項目的圖片與連結）" value={cls.imageRef} onChange={setImageRef} />
              {!cls.imageRef && (
                <>
                  <Input label="圖片路徑" value={cls.image} onChange={(v) => setField("image", v)} />
                  <label className="block cursor-pointer rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 w-fit">
                    {uploading ? "上傳中..." : "上傳圖片"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadImageTo(e.target.files[0], (url) => setField("image", url))}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
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
                  <select
                    value={String(stat.value)}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
                  >
                    {["S", "A", "B", "C", "D", "E"].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <button onClick={() => removeStat(i)} className="mb-0.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20">刪除</button>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        {(["pre", "post"] as const).map((phase) => (
          <section key={phase} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">技能 — {phase === "pre" ? "二轉前" : "二轉後"}</h2>
              <button onClick={() => addSkill(phase)} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增</button>
            </div>
            <div className="space-y-4">
              {cls.skills[phase].map((skill, i) => (
                <div key={i} className="rounded-xl border border-white/10 p-4">
                  <div className="mb-3 flex justify-between">
                    <span className="text-sm font-bold text-white/50">技能 {i + 1}</span>
                    <button onClick={() => removeSkill(phase, i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                  </div>
                  <div className="space-y-3">
                    <Input label="技能名稱" value={skill.name} onChange={(v) => updateSkill(phase, i, "name", v)} />
                    <Input label="技能描述" value={skill.description} onChange={(v) => updateSkill(phase, i, "description", v)} multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Tips */}
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

        {/* Phase sections with blocks */}
        {(["pre", "post"] as const).map((phase) => (
          <section key={phase} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">詳細頁內容 — {phase === "pre" ? "二轉前" : "二轉後"}</h2>
              <button onClick={() => addPhaseSection(phase)} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增分類</button>
            </div>
            <div className="space-y-6">
              {Object.entries(cls.phases[phase]).map(([sectionKey, blocks]) => (
                <div key={sectionKey} className="rounded-xl border border-white/10 p-4">
                  {/* Section header */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-black text-white">{sectionKey}</span>
                    <button onClick={() => removePhaseSection(phase, sectionKey)} className="text-xs text-red-400 hover:text-red-300">刪除分類</button>
                  </div>

                  {/* Blocks */}
                  <div className="space-y-3">
                    {blocks.map((block, i) => (
                      <div key={i} className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-white/40">小方塊 {i + 1}</span>
                          <button onClick={() => removeBlock(phase, sectionKey, i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            label="小方塊標題"
                            value={block.title ?? ""}
                            onChange={(v) => updateBlock(phase, sectionKey, i, "title", v)}
                          />
                          <ReferenceSelect label="引用裝備或素材（選填）" value={block.ref} onChange={(ref) => updateBlock(phase, sectionKey, i, "ref", ref)} />
                          {/* Image row */}
                          {!block.ref && (
                            <div className="flex items-center gap-3">
                              {block.image && (
                                <img src={block.image} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-contain border border-white/10" />
                              )}
                              <div className="flex flex-1 gap-2">
                                <div className="flex-1">
                                  <Input
                                    label="圖片路徑（選填）"
                                    value={block.image}
                                    onChange={(v) => updateBlock(phase, sectionKey, i, "image", v)}
                                  />
                                </div>
                                <label className="mt-5 flex-shrink-0 cursor-pointer rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/10 h-fit">
                                  {uploading ? "..." : "上傳"}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && uploadImageTo(e.target.files[0], (url) => updateBlock(phase, sectionKey, i, "image", url))}
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                          {/* Text */}
                          <Input
                            label="文字內容"
                            value={block.text}
                            onChange={(v) => updateBlock(phase, sectionKey, i, "text", v)}
                            multiline
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addBlock(phase, sectionKey)}
                    className="mt-3 w-full rounded-lg border border-dashed border-white/20 py-2 text-xs font-bold text-white/40 hover:border-white/40 hover:text-white/70 transition"
                  >
                    + 新增小方塊
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <SaveBtn />
      </div>
    </div>
  );
}
