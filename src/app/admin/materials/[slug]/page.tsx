import { use } from "react";
import { ItemEditor } from "@/components/admin/ItemEditor";

export default function AdminMaterialEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ItemEditor dataKey="materials" backHref="/admin/materials" backLabel="返回素材列表" slug={slug} showCatalogFields />;
}
