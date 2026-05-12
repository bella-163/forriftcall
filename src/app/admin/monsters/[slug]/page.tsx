import { use } from "react";
import { ItemEditor } from "@/components/admin/ItemEditor";

export default function AdminMonsterEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ItemEditor dataKey="monsters" backHref="/admin/monsters" backLabel="返回怪物列表" slug={slug} />;
}
