"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CatalogRef, CraftIngredient, CraftRecipe, ItemData, SectionListData, PhaseBlock, EquipmentPiece, Skill } from "@/types/site";

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

const EMPTY_PIECE: EquipmentPiece = { slug: "", image: "", name: "", category: "", description: "", effects: [], rating: "", sections: {} };
const EMPTY_BLOCK: PhaseBlock = { title: "", image: "", text: "" };
const EMPTY_RECIPE: CraftRecipe = { title: "", description: "", ingredients: [] };

function Input({ label, value, onChange, multiline, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) {
  const cls = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-rift-crimson/60";
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-white/50">{label}</label>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls + " resize-none"} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

type Props = {
  dataKey: string;
  backHref: string;
  backLabel: string;
  slug: string;
  showPieces?: boolean;
  showCatalogFields?: boolean;
};

type CatalogOption = {
  type: CatalogRef["type"];
  parentSlug?: string;
  slug: string;
  name: string;
  image: string;
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

export function ItemEditor({ dataKey, backHref, backLabel, slug, showPieces = false, showCatalogFields = false }: Props) {
  const isNew = slug === "new";
  const router = useRouter();

  const [item, setItem] = useState<ItemData>(EMPTY_ITEM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [listCategories, setListCategories] = useState<string[]>([]);
  const [catalogOptions, setCatalogOptions] = useState<CatalogOption[]>([]);
  const [editingPieceIndex, setEditingPieceIndex] = useState<number | null>(null);
  const newCatRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/data?key=equipment")
      .then((r) => r.json())
      .then((data: SectionListData) => data.items.flatMap((parent) =>
        (parent.pieces ?? []).map((piece) => ({
          type: "equipment" as const,
          parentSlug: parent.slug,
          slug: piece.slug || piece.name,
          name: `${parent.name} / ${piece.name || "未命名裝備"}`,
          image: piece.image,
        })),
      ))
      .then((equipment) => {
        fetch("/api/admin/data?key=materials")
          .then((r) => r.json())
          .then((data: SectionListData) => {
            const materials = data.items.map((i) => ({ type: "materials" as const, slug: i.slug, name: i.name, image: i.image }));
            setCatalogOptions([...equipment, ...materials]);
          })
          .catch(() => setCatalogOptions(equipment));
      })
      .catch(() => setCatalogOptions([]));

    fetch(`/api/admin/data?key=${dataKey}`)
      .then((r) => r.json())
      .then((data: SectionListData) => {
        setListCategories(data.categories ?? Array.from(new Set(data.items.map((i) => i.category).filter(Boolean))));
      });

    if (isNew) return;
    fetch(`/api/admin/data?key=${dataKey}`)
      .then((r) => r.json())
      .then((data: SectionListData) => {
        const found = data.items.find((i) => i.slug === slug);
        if (found) {
          setItem(showCatalogFields && (!found.categories || found.categories.length === 0) && found.category
            ? { ...found, categories: [found.category] }
            : found);
        }
      });
  }, [slug, isNew, dataKey, showCatalogFields]);

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
    const data: SectionListData = await fetch(`/api/admin/data?key=${dataKey}`).then((r) => r.json());
    const selectedCategories = (item.categories ?? []).filter(Boolean);
    const nextItem = {
      ...item,
      category: showCatalogFields ? (selectedCategories[0] ?? item.category) : item.category,
      categories: showCatalogFields ? selectedCategories : item.categories,
      attributes: (item.attributes ?? []).filter(Boolean),
      skills: (item.skills ?? []).filter((skill) => skill.name || skill.description),
      acquisition: (item.acquisition ?? []).filter((block) => block.ref || block.title || block.image || block.text),
      crafting: (item.crafting ?? []).filter((recipe) => recipe.title || recipe.description || recipe.ingredients.length > 0),
      pieces: (item.pieces ?? []).map((piece) => ({
        ...piece,
        attributes: (piece.attributes ?? []).filter(Boolean),
        skills: (piece.skills ?? []).filter((skill) => skill.name || skill.description),
        acquisition: (piece.acquisition ?? []).filter((block) => block.ref || block.title || block.image || block.text),
        crafting: (piece.crafting ?? []).filter((recipe) => recipe.title || recipe.description || recipe.ingredients.length > 0),
      })),
    };
    const updated = isNew
      ? { ...data, categories: listCategories, items: [...data.items, nextItem] }
      : { ...data, categories: listCategories, items: data.items.map((i) => (i.slug === slug ? nextItem : i)) };
    const res = await fetch(`/api/admin/data?key=${dataKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      alert(`儲存失敗：${err?.error ?? "請稍後再試"}`);
      setSaving(false);
      return;
    }
    setSaving(false);
    setSaved(true);
    if (isNew) router.push(`${backHref}/${item.slug}`);
    setTimeout(() => setSaved(false), 2000);
  }

  function setField<K extends keyof ItemData>(key: K, value: ItemData[K]) {
    setItem((i) => ({ ...i, [key]: value }));
  }

  // Sections
  function addSection() {
    const key = prompt("請輸入區塊名稱");
    if (!key) return;
    setItem((i) => ({ ...i, sections: { ...i.sections, [key]: [] } }));
  }
  function removeSection(key: string) {
    setItem((i) => { const s = { ...i.sections }; delete s[key]; return { ...i, sections: s }; });
  }
  function addBlock(sectionKey: string) {
    setItem((i) => ({ ...i, sections: { ...i.sections, [sectionKey]: [...(i.sections[sectionKey] ?? []), { title: "", image: "", text: "" }] } }));
  }
  function removeBlock(sectionKey: string, idx: number) {
    setItem((i) => ({ ...i, sections: { ...i.sections, [sectionKey]: i.sections[sectionKey].filter((_, j) => j !== idx) } }));
  }
  function updateBlock(sectionKey: string, idx: number, field: keyof PhaseBlock, value: string | CatalogRef | undefined) {
    setItem((i) => {
      const blocks = [...i.sections[sectionKey]];
      blocks[idx] = { ...blocks[idx], [field]: value };
      if (field === "ref" && value) blocks[idx] = { ...blocks[idx], image: "", title: "" };
      return { ...i, sections: { ...i.sections, [sectionKey]: blocks } };
    });
  }

  // Piece categories (master list)
  function addCategory() {
    const cat = newCatInput.trim();
    if (!cat) return;
    const current = item.pieceCategories ?? [];
    if (current.includes(cat)) return;
    setItem((i) => ({ ...i, pieceCategories: [...current, cat] }));
    setNewCatInput("");
    newCatRef.current?.focus();
  }
  function removeCategory(cat: string) {
    setItem((i) => ({
      ...i,
      pieceCategories: (i.pieceCategories ?? []).filter((c) => c !== cat),
      pieces: (i.pieces ?? []).map((p) => p.category === cat ? { ...p, category: "" } : p),
    }));
  }

  // Pieces
  function addPiece() {
    setEditingPieceIndex(item.pieces?.length ?? 0);
    setItem((i) => ({ ...i, pieces: [...(i.pieces ?? []), { ...EMPTY_PIECE }] }));
  }
  function removePiece(idx: number) {
    setEditingPieceIndex((current) => {
      if (current === idx) return null;
      if (current !== null && current > idx) return current - 1;
      return current;
    });
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

  function addPieceAttribute(pieceIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], attributes: [...(pieces[pieceIdx].attributes ?? []), ""] };
      return { ...i, pieces };
    });
  }

  function updatePieceAttribute(pieceIdx: number, attrIdx: number, value: string) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const attributes = [...(pieces[pieceIdx].attributes ?? [])];
      attributes[attrIdx] = value;
      pieces[pieceIdx] = { ...pieces[pieceIdx], attributes };
      return { ...i, pieces };
    });
  }

  function removePieceAttribute(pieceIdx: number, attrIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], attributes: (pieces[pieceIdx].attributes ?? []).filter((_, j) => j !== attrIdx) };
      return { ...i, pieces };
    });
  }

  function addPieceSkill(pieceIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], skills: [...(pieces[pieceIdx].skills ?? []), { name: "", description: "" }] };
      return { ...i, pieces };
    });
  }

  function updatePieceSkill(pieceIdx: number, skillIdx: number, field: keyof Skill, value: string) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const skills = [...(pieces[pieceIdx].skills ?? [])];
      skills[skillIdx] = { ...skills[skillIdx], [field]: value };
      pieces[pieceIdx] = { ...pieces[pieceIdx], skills };
      return { ...i, pieces };
    });
  }

  function removePieceSkill(pieceIdx: number, skillIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], skills: (pieces[pieceIdx].skills ?? []).filter((_, j) => j !== skillIdx) };
      return { ...i, pieces };
    });
  }

  function addPieceAcquisition(pieceIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], acquisition: [...(pieces[pieceIdx].acquisition ?? []), { ...EMPTY_BLOCK }] };
      return { ...i, pieces };
    });
  }

  function updatePieceAcquisition(pieceIdx: number, acqIdx: number, field: keyof PhaseBlock, value: string | CatalogRef | undefined) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const acquisition = [...(pieces[pieceIdx].acquisition ?? [])];
      acquisition[acqIdx] = { ...acquisition[acqIdx], [field]: value };
      if (field === "ref" && value) acquisition[acqIdx] = { ...acquisition[acqIdx], image: "", title: "" };
      pieces[pieceIdx] = { ...pieces[pieceIdx], acquisition };
      return { ...i, pieces };
    });
  }

  function removePieceAcquisition(pieceIdx: number, acqIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], acquisition: (pieces[pieceIdx].acquisition ?? []).filter((_, j) => j !== acqIdx) };
      return { ...i, pieces };
    });
  }

  function addPieceRecipe(pieceIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], crafting: [...(pieces[pieceIdx].crafting ?? []), { ...EMPTY_RECIPE }] };
      return { ...i, pieces };
    });
  }

  function updatePieceRecipe(pieceIdx: number, recipeIdx: number, field: keyof CraftRecipe, value: string) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const crafting = [...(pieces[pieceIdx].crafting ?? [])];
      crafting[recipeIdx] = { ...crafting[recipeIdx], [field]: value };
      pieces[pieceIdx] = { ...pieces[pieceIdx], crafting };
      return { ...i, pieces };
    });
  }

  function removePieceRecipe(pieceIdx: number, recipeIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], crafting: (pieces[pieceIdx].crafting ?? []).filter((_, j) => j !== recipeIdx) };
      return { ...i, pieces };
    });
  }

  function addPieceIngredient(pieceIdx: number, recipeIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const crafting = [...(pieces[pieceIdx].crafting ?? [])];
      crafting[recipeIdx] = { ...crafting[recipeIdx], ingredients: [...crafting[recipeIdx].ingredients, {}] };
      pieces[pieceIdx] = { ...pieces[pieceIdx], crafting };
      return { ...i, pieces };
    });
  }

  function updatePieceIngredient(pieceIdx: number, recipeIdx: number, ingredientIdx: number, field: keyof CraftIngredient, value: string | CatalogRef | undefined) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const crafting = [...(pieces[pieceIdx].crafting ?? [])];
      const ingredients = [...crafting[recipeIdx].ingredients];
      ingredients[ingredientIdx] = { ...ingredients[ingredientIdx], [field]: value };
      if (field === "ref" && value) ingredients[ingredientIdx] = { ...ingredients[ingredientIdx], name: "" };
      crafting[recipeIdx] = { ...crafting[recipeIdx], ingredients };
      pieces[pieceIdx] = { ...pieces[pieceIdx], crafting };
      return { ...i, pieces };
    });
  }

  function removePieceIngredient(pieceIdx: number, recipeIdx: number, ingredientIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const crafting = [...(pieces[pieceIdx].crafting ?? [])];
      crafting[recipeIdx] = { ...crafting[recipeIdx], ingredients: crafting[recipeIdx].ingredients.filter((_, j) => j !== ingredientIdx) };
      pieces[pieceIdx] = { ...pieces[pieceIdx], crafting };
      return { ...i, pieces };
    });
  }

  function addPieceSection(pieceIdx: number) {
    const key = prompt("請輸入區塊名稱");
    if (!key) return;
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      pieces[pieceIdx] = { ...pieces[pieceIdx], sections: { ...(pieces[pieceIdx].sections ?? {}), [key]: [] } };
      return { ...i, pieces };
    });
  }

  function removePieceSection(pieceIdx: number, sectionKey: string) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const sections = { ...(pieces[pieceIdx].sections ?? {}) };
      delete sections[sectionKey];
      pieces[pieceIdx] = { ...pieces[pieceIdx], sections };
      return { ...i, pieces };
    });
  }

  function addPieceBlock(pieceIdx: number, sectionKey: string) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const sections = pieces[pieceIdx].sections ?? {};
      pieces[pieceIdx] = { ...pieces[pieceIdx], sections: { ...sections, [sectionKey]: [...(sections[sectionKey] ?? []), { ...EMPTY_BLOCK }] } };
      return { ...i, pieces };
    });
  }

  function updatePieceBlock(pieceIdx: number, sectionKey: string, blockIdx: number, field: keyof PhaseBlock, value: string | CatalogRef | undefined) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const sections = pieces[pieceIdx].sections ?? {};
      const blocks = [...(sections[sectionKey] ?? [])];
      blocks[blockIdx] = { ...blocks[blockIdx], [field]: value };
      if (field === "ref" && value) blocks[blockIdx] = { ...blocks[blockIdx], image: "", title: "" };
      pieces[pieceIdx] = { ...pieces[pieceIdx], sections: { ...sections, [sectionKey]: blocks } };
      return { ...i, pieces };
    });
  }

  function removePieceBlock(pieceIdx: number, sectionKey: string, blockIdx: number) {
    setItem((i) => {
      const pieces = [...(i.pieces ?? [])];
      const sections = pieces[pieceIdx].sections ?? {};
      pieces[pieceIdx] = { ...pieces[pieceIdx], sections: { ...sections, [sectionKey]: (sections[sectionKey] ?? []).filter((_, j) => j !== blockIdx) } };
      return { ...i, pieces };
    });
  }

  function addListCategory() {
    const cat = prompt("請輸入新類別名稱")?.trim();
    if (!cat) return;
    setListCategories((cats) => cats.includes(cat) ? cats : [...cats, cat]);
  }

  function removeListCategory(cat: string) {
    setListCategories((cats) => cats.filter((c) => c !== cat));
    setItem((i) => ({
      ...i,
      category: i.category === cat ? "" : i.category,
      categories: (i.categories ?? []).filter((c) => c !== cat),
    }));
  }

  function toggleItemCategory(cat: string) {
    setItem((i) => {
      const current = i.categories && i.categories.length > 0 ? i.categories : i.category ? [i.category] : [];
      const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
      return { ...i, category: next[0] ?? "", categories: next };
    });
  }

  function addAttribute() {
    setItem((i) => ({ ...i, attributes: [...(i.attributes ?? []), ""] }));
  }

  function updateAttribute(idx: number, value: string) {
    setItem((i) => {
      const attributes = [...(i.attributes ?? [])];
      attributes[idx] = value;
      return { ...i, attributes };
    });
  }

  function removeAttribute(idx: number) {
    setItem((i) => ({ ...i, attributes: (i.attributes ?? []).filter((_, j) => j !== idx) }));
  }

  function addSkill() {
    setItem((i) => ({ ...i, skills: [...(i.skills ?? []), { name: "", description: "" }] }));
  }

  function updateSkill(idx: number, field: keyof Skill, value: string) {
    setItem((i) => {
      const skills = [...(i.skills ?? [])];
      skills[idx] = { ...skills[idx], [field]: value };
      return { ...i, skills };
    });
  }

  function removeSkill(idx: number) {
    setItem((i) => ({ ...i, skills: (i.skills ?? []).filter((_, j) => j !== idx) }));
  }

  function addAcquisition() {
    setItem((i) => ({ ...i, acquisition: [...(i.acquisition ?? []), { ...EMPTY_BLOCK }] }));
  }

  function updateAcquisition(idx: number, field: keyof PhaseBlock, value: string | CatalogRef | undefined) {
    setItem((i) => {
      const acquisition = [...(i.acquisition ?? [])];
      acquisition[idx] = { ...acquisition[idx], [field]: value };
      if (field === "ref" && value) acquisition[idx] = { ...acquisition[idx], image: "", title: "" };
      return { ...i, acquisition };
    });
  }

  function removeAcquisition(idx: number) {
    setItem((i) => ({ ...i, acquisition: (i.acquisition ?? []).filter((_, j) => j !== idx) }));
  }

  function addRecipe() {
    setItem((i) => ({ ...i, crafting: [...(i.crafting ?? []), { ...EMPTY_RECIPE }] }));
  }

  function updateRecipe(idx: number, field: keyof CraftRecipe, value: string) {
    setItem((i) => {
      const crafting = [...(i.crafting ?? [])];
      crafting[idx] = { ...crafting[idx], [field]: value };
      return { ...i, crafting };
    });
  }

  function removeRecipe(idx: number) {
    setItem((i) => ({ ...i, crafting: (i.crafting ?? []).filter((_, j) => j !== idx) }));
  }

  function addIngredient(recipeIdx: number) {
    setItem((i) => {
      const crafting = [...(i.crafting ?? [])];
      crafting[recipeIdx] = { ...crafting[recipeIdx], ingredients: [...crafting[recipeIdx].ingredients, {}] };
      return { ...i, crafting };
    });
  }

  function updateIngredient(recipeIdx: number, ingredientIdx: number, field: keyof CraftIngredient, value: string | CatalogRef | undefined) {
    setItem((i) => {
      const crafting = [...(i.crafting ?? [])];
      const ingredients = [...crafting[recipeIdx].ingredients];
      ingredients[ingredientIdx] = { ...ingredients[ingredientIdx], [field]: value };
      if (field === "ref" && value) ingredients[ingredientIdx] = { ...ingredients[ingredientIdx], name: "" };
      crafting[recipeIdx] = { ...crafting[recipeIdx], ingredients };
      return { ...i, crafting };
    });
  }

  function removeIngredient(recipeIdx: number, ingredientIdx: number) {
    setItem((i) => {
      const crafting = [...(i.crafting ?? [])];
      crafting[recipeIdx] = { ...crafting[recipeIdx], ingredients: crafting[recipeIdx].ingredients.filter((_, j) => j !== ingredientIdx) };
      return { ...i, crafting };
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

  const pieceCategories = item.pieceCategories ?? [];

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
                <label className="mb-1.5 block text-xs font-bold text-white/50">分類</label>
                {showCatalogFields ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {listCategories.length === 0 && <span className="text-xs text-white/25">尚無類別</span>}
                      {listCategories.map((cat) => (
                        <span key={cat} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 pl-3 pr-2 py-1 text-xs font-bold text-white/80">
                          {cat}
                          <button onClick={() => removeListCategory(cat)} className="flex h-4 w-4 items-center justify-center rounded-full text-white/40 transition hover:bg-red-500/30 hover:text-red-300">✕</button>
                        </span>
                      ))}
                    </div>
                    <div className="mb-4 flex gap-2">
                      <input
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          const cat = newCatInput.trim();
                          if (!cat) return;
                          setListCategories((cats) => cats.includes(cat) ? cats : [...cats, cat]);
                          setNewCatInput("");
                        }}
                        placeholder="輸入新類別名稱，如：強化素材"
                        className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-rift-crimson/60"
                      />
                      <button
                        onClick={() => {
                          const cat = newCatInput.trim();
                          if (!cat) return;
                          setListCategories((cats) => cats.includes(cat) ? cats : [...cats, cat]);
                          setNewCatInput("");
                        }}
                        disabled={!newCatInput.trim()}
                        className="rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15 disabled:opacity-30"
                      >
                        新增
                      </button>
                    </div>
                    {listCategories.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-bold text-white/50">此素材所屬類別</p>
                        <div className="flex flex-wrap gap-2">
                          {listCategories.map((cat) => {
                            const selected = (item.categories && item.categories.length > 0 ? item.categories : item.category ? [item.category] : []).includes(cat);
                            return (
                              <button
                                key={cat}
                                onClick={() => toggleItemCategory(cat)}
                                className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                                  selected
                                    ? "border-white/60 bg-white/20 text-white"
                                    : "border-white/15 bg-white/5 text-white/50 hover:border-white/30 hover:text-white"
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <select value={item.category} onChange={(e) => setField("category", e.target.value)}
                        className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none">
                        <option value="">未分類</option>
                        {listCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <button onClick={addListCategory} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10">+ 類別</button>
                    </div>
                    {listCategories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {listCategories.map((cat) => (
                          <span key={cat} className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-bold text-white/60">
                            {cat}
                            <button onClick={() => removeListCategory(cat)} className="text-red-400 hover:text-red-300">✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
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

        {showCatalogFields && (
          <>
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">屬性</h2>
                <button onClick={addAttribute} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增屬性</button>
              </div>
              <div className="space-y-2">
                {(item.attributes ?? []).map((attribute, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={attribute} onChange={(e) => updateAttribute(i, e.target.value)} placeholder="例如：物理攻擊 +150"
                      className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-rift-crimson/60" />
                    <button onClick={() => removeAttribute(i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">技能</h2>
                <button onClick={addSkill} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增技能</button>
              </div>
              <div className="space-y-4">
                {(item.skills ?? []).map((skill, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-4">
                    <div className="mb-3 flex justify-between">
                      <span className="text-sm font-bold text-white/50">技能 {i + 1}</span>
                      <button onClick={() => removeSkill(i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                    </div>
                    <div className="space-y-3">
                      <Input label="技能名稱" value={skill.name} onChange={(v) => updateSkill(i, "name", v)} />
                      <Input label="技能描述" value={skill.description} onChange={(v) => updateSkill(i, "description", v)} multiline />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">取得方式</h2>
                <button onClick={addAcquisition} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增取得方式</button>
              </div>
              <div className="space-y-4">
                {(item.acquisition ?? []).map((block, i) => (
                  <div key={i} className="rounded-xl border border-white/10 p-4">
                    <div className="mb-3 flex justify-between">
                      <span className="text-sm font-bold text-white/50">取得方式 {i + 1}</span>
                      <button onClick={() => removeAcquisition(i)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                    </div>
                    <div className="space-y-3">
                      <ReferenceSelect label="引用裝備或素材（選填）" value={block.ref} onChange={(ref) => updateAcquisition(i, "ref", ref)} />
                      {!block.ref && (
                        <>
                          <Input label="標題" value={block.title ?? ""} onChange={(v) => updateAcquisition(i, "title", v)} />
                          <Input label="圖片路徑（選填）" value={block.image} onChange={(v) => updateAcquisition(i, "image", v)} />
                        </>
                      )}
                      <Input label="說明" value={block.text} onChange={(v) => updateAcquisition(i, "text", v)} multiline />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">合成方式</h2>
                <button onClick={addRecipe} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增合成方式</button>
              </div>
              <div className="space-y-5">
                {(item.crafting ?? []).map((recipe, ri) => (
                  <div key={ri} className="rounded-xl border border-white/10 p-4">
                    <div className="mb-3 flex justify-between">
                      <span className="font-black text-white">{recipe.title || `合成方式 ${ri + 1}`}</span>
                      <button onClick={() => removeRecipe(ri)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                    </div>
                    <div className="space-y-3">
                      <Input label="合成標題" value={recipe.title} onChange={(v) => updateRecipe(ri, "title", v)} />
                      <Input label="合成描述" value={recipe.description} onChange={(v) => updateRecipe(ri, "description", v)} multiline />
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-xs font-bold text-white/50">材料 / 裝備</label>
                          <button onClick={() => addIngredient(ri)} className="text-xs text-white/40 hover:text-white">+ 新增項目</button>
                        </div>
                        <div className="space-y-3">
                          {recipe.ingredients.map((ingredient, ii) => (
                            <div key={ii} className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
                              <div className="mb-2 flex justify-end">
                                <button onClick={() => removeIngredient(ri, ii)} className="text-xs text-red-400 hover:text-red-300">刪除項目</button>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <ReferenceSelect label="引用裝備或素材" value={ingredient.ref} onChange={(ref) => updateIngredient(ri, ii, "ref", ref)} />
                                {!ingredient.ref && <Input label="自訂名稱" value={ingredient.name ?? ""} onChange={(v) => updateIngredient(ri, ii, "name", v)} />}
                                <Input label="數量" value={ingredient.quantity ?? ""} onChange={(v) => updateIngredient(ri, ii, "quantity", v)} />
                                <Input label="備註" value={ingredient.note ?? ""} onChange={(v) => updateIngredient(ri, ii, "note", v)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

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
                        <Input label="小方塊標題" value={block.title ?? ""} onChange={(v) => updateBlock(sectionKey, i, "title", v)} />
                        {showCatalogFields && (
                          <ReferenceSelect label="引用裝備或素材（選填）" value={block.ref} onChange={(ref) => updateBlock(sectionKey, i, "ref", ref)} />
                        )}
                        {!block.ref && (
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
                        )}
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
            <h2 className="mb-6 text-xl font-black text-white">裝備物品</h2>

            {/* Category manager */}
            <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-xs font-black tracking-widest text-white/40">類別管理</p>

              {/* Existing categories */}
              <div className="mb-3 flex flex-wrap gap-2 min-h-[28px]">
                {pieceCategories.length === 0 && (
                  <span className="text-xs text-white/25">尚無類別</span>
                )}
                {pieceCategories.map((cat) => (
                  <span key={cat} className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 pl-3 pr-2 py-1 text-xs font-bold text-white/80">
                    {cat}
                    <button
                      onClick={() => removeCategory(cat)}
                      className="flex h-4 w-4 items-center justify-center rounded-full text-white/40 hover:bg-red-500/30 hover:text-red-300 transition"
                      title="刪除類別"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Add new category */}
              <div className="flex gap-2">
                <input
                  ref={newCatRef}
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  placeholder="輸入新類別名稱，如：世界王武器"
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-rift-crimson/60"
                />
                <button
                  onClick={addCategory}
                  disabled={!newCatInput.trim()}
                  className="rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-bold text-white hover:bg-white/15 disabled:opacity-30 transition"
                >
                  新增
                </button>
              </div>
            </div>

            {/* Piece list */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-white/50">物品列表（{(item.pieces ?? []).length} 個）</p>
              <button onClick={addPiece} className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10">+ 新增物品</button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {(item.pieces ?? []).length === 0 && (
                <p className="col-span-full text-sm text-white/35">尚無物品，點上方按鈕新增。</p>
              )}
              {(item.pieces ?? []).map((piece, pi) => (
                <div key={pi} className={`${editingPieceIndex === pi ? "col-span-full" : ""} rounded-xl border border-white/10 p-3 ${editingPieceIndex === pi ? "space-y-4" : ""}`}>
                  {/* Piece header */}
                  <div className={editingPieceIndex === pi ? "flex items-center justify-between" : "space-y-2"}>
                    {editingPieceIndex === pi ? (
                      <span className="font-black text-white">{piece.name || `物品 ${pi + 1}`}</span>
                    ) : (
                      <button onClick={() => setEditingPieceIndex(pi)} className="group block w-full text-center">
                        {piece.image ? (
                          <img src={piece.image} alt="" className="mx-auto h-16 w-16 rounded-lg object-contain border border-white/10 bg-white/[0.03]" />
                        ) : (
                          <div className="mx-auto h-16 w-16 rounded-lg border border-white/10 bg-white/[0.03]" />
                        )}
                        <span className="mt-2 block truncate text-sm font-black text-white group-hover:text-rift-gold">{piece.name || `物品 ${pi + 1}`}</span>
                        {piece.category && <span className="mt-1 block truncate text-[11px] font-bold text-white/35">{piece.category}</span>}
                      </button>
                    )}
                    <div className={editingPieceIndex === pi ? "flex items-center gap-3" : "flex justify-center gap-3"}>
                      <button onClick={() => setEditingPieceIndex(editingPieceIndex === pi ? null : pi)} className="text-xs font-bold text-white/45 hover:text-white">
                        {editingPieceIndex === pi ? "收合" : "編輯"}
                      </button>
                      <button onClick={() => removePiece(pi)} className="text-xs font-bold text-red-400 hover:text-red-300">刪除</button>
                    </div>
                  </div>

                  {editingPieceIndex === pi && (
                    <>
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
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input label="物品 Slug (URL 路徑)" value={piece.slug ?? ""} onChange={(v) => updatePiece(pi, "slug", v)} placeholder="例如：flame-sword" />
                    <Input label="物品名稱" value={piece.name} onChange={(v) => updatePiece(pi, "name", v)} />
                  </div>
                  <Input label="物品描述" value={piece.description ?? ""} onChange={(v) => updatePiece(pi, "description", v)} multiline />

                  {/* Category selector */}
                  <div>
                    <label className="mb-2 block text-xs font-bold text-white/50">類別</label>
                    {pieceCategories.length === 0 ? (
                      <p className="text-xs text-white/30">請先在上方「類別管理」新增類別</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {pieceCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => updatePiece(pi, "category", piece.category === cat ? "" : cat)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold border transition ${
                              piece.category === cat
                                ? "border-white/60 bg-white/20 text-white"
                                : "border-white/15 bg-white/5 text-white/50 hover:text-white hover:border-white/30"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

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

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-black text-white">屬性</h3>
                      <button onClick={() => addPieceAttribute(pi)} className="text-xs text-white/40 hover:text-white">+ 新增屬性</button>
                    </div>
                    <div className="space-y-2">
                      {(piece.attributes ?? []).length === 0 && <p className="text-xs text-white/25">尚無屬性</p>}
                      {(piece.attributes ?? []).map((attribute, ai) => (
                        <div key={ai} className="flex gap-2">
                          <input value={attribute} onChange={(e) => updatePieceAttribute(pi, ai, e.target.value)} placeholder="例如：物理攻擊 +150"
                            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-rift-crimson/60" />
                          <button onClick={() => removePieceAttribute(pi, ai)} className="text-xs text-red-400 hover:text-red-300">刪除</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-black text-white">技能</h3>
                      <button onClick={() => addPieceSkill(pi)} className="text-xs text-white/40 hover:text-white">+ 新增技能</button>
                    </div>
                    <div className="space-y-3">
                      {(piece.skills ?? []).length === 0 && <p className="text-xs text-white/25">尚無技能</p>}
                      {(piece.skills ?? []).map((skill, si) => (
                        <div key={si} className="rounded-lg border border-white/8 p-3">
                          <div className="mb-2 flex justify-end">
                            <button onClick={() => removePieceSkill(pi, si)} className="text-xs text-red-400 hover:text-red-300">刪除技能</button>
                          </div>
                          <div className="space-y-2">
                            <Input label="技能名稱" value={skill.name} onChange={(v) => updatePieceSkill(pi, si, "name", v)} />
                            <Input label="技能描述" value={skill.description} onChange={(v) => updatePieceSkill(pi, si, "description", v)} multiline />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-black text-white">取得方式</h3>
                      <button onClick={() => addPieceAcquisition(pi)} className="text-xs text-white/40 hover:text-white">+ 新增取得方式</button>
                    </div>
                    <div className="space-y-3">
                      {(piece.acquisition ?? []).length === 0 && <p className="text-xs text-white/25">尚無取得方式</p>}
                      {(piece.acquisition ?? []).map((block, ai) => (
                        <div key={ai} className="rounded-lg border border-white/8 p-3">
                          <div className="mb-2 flex justify-end">
                            <button onClick={() => removePieceAcquisition(pi, ai)} className="text-xs text-red-400 hover:text-red-300">刪除取得方式</button>
                          </div>
                          <div className="space-y-2">
                            <ReferenceSelect label="引用裝備或素材（選填）" value={block.ref} onChange={(ref) => updatePieceAcquisition(pi, ai, "ref", ref)} />
                            {!block.ref && (
                              <>
                                <Input label="標題" value={block.title ?? ""} onChange={(v) => updatePieceAcquisition(pi, ai, "title", v)} />
                                <Input label="圖片路徑（選填）" value={block.image} onChange={(v) => updatePieceAcquisition(pi, ai, "image", v)} />
                              </>
                            )}
                            <Input label="說明" value={block.text} onChange={(v) => updatePieceAcquisition(pi, ai, "text", v)} multiline />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-black text-white">合成方式</h3>
                      <button onClick={() => addPieceRecipe(pi)} className="text-xs text-white/40 hover:text-white">+ 新增合成方式</button>
                    </div>
                    <div className="space-y-3">
                      {(piece.crafting ?? []).length === 0 && <p className="text-xs text-white/25">尚無合成方式</p>}
                      {(piece.crafting ?? []).map((recipe, ri) => (
                        <div key={ri} className="rounded-lg border border-white/8 p-3">
                          <div className="mb-2 flex justify-end">
                            <button onClick={() => removePieceRecipe(pi, ri)} className="text-xs text-red-400 hover:text-red-300">刪除合成方式</button>
                          </div>
                          <div className="space-y-2">
                            <Input label="合成標題" value={recipe.title} onChange={(v) => updatePieceRecipe(pi, ri, "title", v)} />
                            <Input label="合成描述" value={recipe.description} onChange={(v) => updatePieceRecipe(pi, ri, "description", v)} multiline />
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-white/50">材料 / 裝備</label>
                              <button onClick={() => addPieceIngredient(pi, ri)} className="text-xs text-white/40 hover:text-white">+ 新增項目</button>
                            </div>
                            {recipe.ingredients.map((ingredient, ii) => (
                              <div key={ii} className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
                                <div className="mb-2 flex justify-end">
                                  <button onClick={() => removePieceIngredient(pi, ri, ii)} className="text-xs text-red-400 hover:text-red-300">刪除項目</button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                  <ReferenceSelect label="引用裝備或素材" value={ingredient.ref} onChange={(ref) => updatePieceIngredient(pi, ri, ii, "ref", ref)} />
                                  {!ingredient.ref && <Input label="自訂名稱" value={ingredient.name ?? ""} onChange={(v) => updatePieceIngredient(pi, ri, ii, "name", v)} />}
                                  <Input label="數量" value={ingredient.quantity ?? ""} onChange={(v) => updatePieceIngredient(pi, ri, ii, "quantity", v)} />
                                  <Input label="備註" value={ingredient.note ?? ""} onChange={(v) => updatePieceIngredient(pi, ri, ii, "note", v)} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-black text-white">內容區塊</h3>
                      <button onClick={() => addPieceSection(pi)} className="text-xs text-white/40 hover:text-white">+ 新增分類</button>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(piece.sections ?? {}).length === 0 && <p className="text-xs text-white/25">尚無內容區塊</p>}
                      {Object.entries(piece.sections ?? {}).map(([sectionKey, blocks]) => (
                        <div key={sectionKey} className="rounded-lg border border-white/8 p-3">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="font-bold text-white">{sectionKey}</span>
                            <button onClick={() => removePieceSection(pi, sectionKey)} className="text-xs text-red-400 hover:text-red-300">刪除分類</button>
                          </div>
                          <div className="space-y-3">
                            {blocks.map((block, bi) => (
                              <div key={bi} className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
                                <div className="mb-2 flex justify-end">
                                  <button onClick={() => removePieceBlock(pi, sectionKey, bi)} className="text-xs text-red-400 hover:text-red-300">刪除小方塊</button>
                                </div>
                                <div className="space-y-2">
                                  <Input label="小方塊標題" value={block.title ?? ""} onChange={(v) => updatePieceBlock(pi, sectionKey, bi, "title", v)} />
                                  <ReferenceSelect label="引用裝備或素材（選填）" value={block.ref} onChange={(ref) => updatePieceBlock(pi, sectionKey, bi, "ref", ref)} />
                                  {!block.ref && <Input label="圖片路徑（選填）" value={block.image} onChange={(v) => updatePieceBlock(pi, sectionKey, bi, "image", v)} />}
                                  <Input label="文字內容" value={block.text} onChange={(v) => updatePieceBlock(pi, sectionKey, bi, "text", v)} multiline />
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => addPieceBlock(pi, sectionKey)}
                            className="mt-3 w-full rounded-lg border border-dashed border-white/20 py-2 text-xs font-bold text-white/40 hover:border-white/40 hover:text-white/70 transition">
                            + 新增小方塊
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                    </>
                  )}
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
