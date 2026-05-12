import { use } from "react";
import { ItemEditor } from "@/components/admin/ItemEditor";

export default function AdminEquipmentEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ItemEditor dataKey="equipment" backHref="/admin/equipment" backLabel="返回裝備列表" slug={slug} showPieces />;
}
