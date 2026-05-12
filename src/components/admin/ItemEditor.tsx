"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ItemData, SectionListData, PhaseBlock, EquipmentPiece } from "@/types/site";

const COLOR_OPTIONS = ["crimson", "gold", "violet", "blue", "green", "gray"] as const;

const EMPTY_ITEM: ItemData = {
  slug: "",
  name: "",
  category: "",
  description: "",
  image: "",
  color: "crimson",
  sections: {},
};

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

const EMPTY_PIECE: EquipmentPiece = { image: "", name: "", effects: [], rating: "" };

type Props = {
  dataKey: string;
  backHref: string;
  backLabel: string;
  slug: string;
  showPieces?: boolean;
};

export function ItemEditor({ dataKey, backHref, backLabel, slug, showPieces = false }: Props) {
  const isNew = slug === "new";
  const router = useRouter();

  const [item, setItem] = useState<ItemData>(EMPTY_ITEM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/data?key=${dataKey}`)
      .then((r) => r.json())
      .then((data: SectionListData) => {
        const found = data.items.find((i) => i.slug === slug);
        if (found) setItem(found);
      });
  }, [slug, isNew, dataKey]);

  async function uploadImageTo(file: File, callback: (url: string) => void) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const { url } = await res.json();
    callback(url);
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    const data: SectionListData = await fetch(`/api/admin/data?key=${dataKey}`).then((r) => r.json());
    const updated = isNew
      ? { ...data, items: [...data.items, item] }
      : { ...data, items: data.items.map((i) => (i.slug === slug ? item : i)) };
    await fetch(`/api/admin/data?key=${dataKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    setSaved(true);
    if (isNew) router.push(`${backHref}/${item.slug}`);
    setTimeout(() => setSaved(false), 2000);
  }

  function setField<K extends keyof ItemData>(key: K, value: ItemData[K]) {
    setItem((i) => ({ ...i, [key]: value }));
  }

  function addSection() {
    const key = prompt("請輸入區塊名稱");
    if (!key) return;
    setItem((i) => ({ ...i, sections: { ...i.sections, [key]: [] } }));
  }
  function removeSection(key: string) {
    setItem((i) => { const s = { ...i.sections }; delete s[key]; return { ...i, sections: s }; });
  }
  function addBlock(sectionKey: string) {
    setItem((i) => ({ ...i, sections: { ...i.sections, [sectionKey]: [...(i.sections[sectionKey] ?? []), { image: "", text: "" }] } }));
  }
  function removeBlock(sectionKey: string, idx: number) {
    setItem((i) => ({ ...i, sections: { ...i.sections, [sectionKey]: i.sections[sectionKey].filter((_, j) => j !== idx) } }));
  }
  function updateBlock(sectionKey: string, idx: number, field: keyof PhaseBlock, value: string) {
    setItem((i) => {
      const blocks = [...i.sections[sectionKey]];
      blocks[idx] = { ...blocks[idx], [field]: value };
      return { ...i, sections: { ...i.sections, [sectionKey]: blocks } };
    });
  }

  function addPiece() {
    setItem((i) => ({ ...i, pieces: [...(i.pieces ?? []), { ...EMPTY_PIECE }] }));
  }
  function removePiece(idx: number) {
    setItem((i) => ({ ...i, pieces: (i.pieces ?? []).filter((_, j) => j !== idx) }));
  }
  function updatePiece<K extends keyof EquipmentPiece>(idx: number, field: K, value: EquipmentPiece[K]) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[idx] = { ...pieces[idx], [field]: value };
      return { ...i, pieces };
    });
  }
  function addEffect(pieceIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], effects: [...pieces[pieceIdx].effects, ""] };
      return { ...i, pieces };
    });
  }
  function updateEffect(pieceIdx: number, effIdx: number, value: string) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const effects = [...pieces[pieceIdx].effects];
      effects[effIdx] = value;
      pieces[pieceIdx] = { ...pieces[pieceIdx], effects };
      return { ...i, pieces };
    });
  }
  function removeEffect(pieceIdx: number, effIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], effects: pieces[pieceIdx].effects.filter((_, j) => j !== effIdx) };
      return { ...i, pieces };
    });
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
          <Link href={backHref} className="mb-3 inline-block text-sm text-white/40 hover:text-white">← {backLabel}</Link>
          <h1 className="text-3xl font-black text-white">{isNew ? "新增項目" : `編輯：${item.name}`}</h1>
        </div>
        <SaveBtn />
      </div>

      <div className="space-y-8">
        {/* Basic info */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">基本資訊</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Slug (URL 路徑)" value={item.slug} onChange={(v) => setField("slug", v)} />
              <Input label="名稱" value={item.name} onChange={(v) => setField("name", v)} />
              <div className="col-span-2">
                <Input label="分類標籤 (category)" value={item.category} onChange={(v) => setField("category", v)} />
              </div>
            </div>
            <Input label="描述" value={item.description} onChange={(v) => setField("description", v)} multiline />
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50">主題色</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c} onClick={() => setField("color", c)}
                    className={`rounded-lg px-4 py-2 text-sm font-bold border transition ${item.color === c ? "border-white/60 bg-white/15 text-white" : "border-white/10 bg-white/5 text-white/50 hover:text-white"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 text-xl font-black text-white">圖片</h2>
          <div className="flex items-center gap-5">
            {item.image && <img src={item.image} alt="" className="h-20 w-20 rounded-xl object-contain border border-white/10" />}
            <div className="space-y-3 flex-1">
              <Input label="圖片路徑" value={item.image} onChange={(v) => setField("image", v)} />
              <label className="block cursor-pointer rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 w-fit">
                {uploading ? "上傳中..." : "上傳圖片"}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadImageTo(e.target.files[0], (url) => setField("image", url))} />
              </label>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">內容區塊</h2>
            <button onClick={addSection} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增分類</button>
          </div>
          <div className="space-y-6">
            {Object.entries(item.sections).map(([sectionKey, blocks]) => (
              <div key={sectionKey} className="rounded-xl border border-white/10 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-black text-white">{sectionKey}</span>
                  <button onClick={() => removeSection(sectionKey)} className="text-xs text-red-400 hover:text-red-300">刪除分類</button>
                </div>
                <div className="space-y-3">
                  {blocks.map((block, i) => (
                    <div key={i} className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-white/40">小方塊 {i + 1}</span>
                        <button onClick={() => removeBlock(sectionKey, i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          {block.image && <img src={block.image} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-contain border border-white/10" />}
                          <div className="flex flex-1 gap-2">
                            <div className="flex-1">
                              <Input label="圖片路徑（選填）" value={block.image} onChange={(v) => updateBlock(sectionKey, i, "image", v)} />
                            </div>
                            <label className="mt-5 flex-shrink-0 cursor-pointer rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/10 h-fit">
                              {uploading ? "..." : "上傳"}
                              <input type="file" accept="image/*" className="hidden"
                                onChange={(e) => e.target.files?.[0] && uploadImageTo(e.target.files[0], (url) => updateBlock(sectionKey, i, "image", url))} />
                            </label>
                          </div>
                        </div>
                        <Input label="文字內容" value={block.text} onChange={(v) => updateBlock(sectionKey, i, "text", v)} multiline />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => addBlock(sectionKey)}
                  className="mt-3 w-full rounded-lg border border-dashed border-white/20 py-2 text-xs font-bold text-white/40 hover:border-white/40 hover:text-white/70 transition">
                  + 新增小方塊
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Equipment Pieces */}
        {showPieces && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">裝備物品</h2>
              <button onClick={addPiece} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增物品</button>
            </div>
            <div className="space-y-6">
              {(item.pieces ?? []).length === 0 && (
                <p className="text-sm text-white/35">尚無物品，點上方按鈕新增。</p>
              )}
              {(item.pieces ?? []).map((piece, pi) => (
                <div key={pi} className="rounded-xl border border-white/10 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white">{piece.name || `物品 ${pi + 1}`}</span>
                    <button onClick={() => removePiece(pi)} className="text-xs text-red-400 hover:text-red-300">刪除物品</button>
                  </div>

                  {/* Image */}
                  <div className="flex items-center gap-4">
                    {piece.image && <img src={piece.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-contain border border-white/10" />}
                    <div className="flex flex-1 gap-2 items-end">
                      <div className="flex-1">
                        <Input label="圖片路徑" value={piece.image} onChange={(v) => updatePiece(pi, "image", v)} />
                      </div>
                      <label className="flex-shrink-0 cursor-pointer rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/10 mb-0.5">
                        {uploading ? "..." : "上傳"}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => e.target.files?.[0] && uploadImageTo(e.target.files[0], (url) => updatePiece(pi, "image", url))} />
                      </label>
                    </div>
                  </div>

                  {/* Name */}
                  <Input label="物品名稱" value={piece.name} onChange={(v) => updatePiece(pi, "name", v)} />

                  {/* Effects */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-bold text-white/50">效果</label>
                      <button onClick={() => addEffect(pi)} className="text-xs text-white/40 hover:text-white">+ 新增效果</button>
                    </div>
                    <div className="space-y-2">
                      {piece.effects.length === 0 && <p className="text-xs text-white/25">尚無效果</p>}
                      {piece.effects.map((eff, ei) => (
                        <div key={ei} className="flex items-center gap-2">
                          <input
                            value={eff}
                            onChange={(e) => updateEffect(pi, ei, e.target.value)}
                            placeholder={`效果 ${ei + 1}，例如：攻擊力 +150`}
                            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-rift-crimson/60"
                          />
                          <button onClick={() => removeEffect(pi, ei)} className="text-xs text-red-400 hover:text-red-300 flex-shrink-0">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-white/50">評價</label>
                    <textarea
                      rows={3}
                      value={piece.rating}
                      onChange={(e) => updatePiece(pi, "rating", e.target.value)}
                      placeholder="輸入對此裝備的評價與推薦說明..."
                      className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-rift-crimson/60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <SaveBtn />
      </div>
    </div>
  );
}
