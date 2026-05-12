import { use } from "react";
import { ItemEditor } from "@/components/admin/ItemEditor";

export default function AdminDungeonEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ItemEditor dataKey="dungeons" backHref="/admin/dungeons" backLabel="返回副本列表" slug={slug} />;
}
