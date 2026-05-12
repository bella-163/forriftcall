import { CatalogListAdmin } from "@/components/admin/CatalogListAdmin";

export default function AdminMaterialsPage() {
  return <CatalogListAdmin dataKey="materials" title="素材介紹管理" adminHref="/admin/materials" newLabel="新增素材" />;
}
