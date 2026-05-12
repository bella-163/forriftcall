import { CatalogListAdmin } from "@/components/admin/CatalogListAdmin";

export default function AdminEquipmentPage() {
  return <CatalogListAdmin dataKey="equipment" title="裝備介紹管理" adminHref="/admin/equipment" newLabel="新增裝備" />;
}
