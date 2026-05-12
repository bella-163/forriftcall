import { use } from "react";
import { NewsCategoryEditor } from "@/components/admin/NewsCategoryEditor";

export default function AdminNewsCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <NewsCategoryEditor slug={slug} backHref="/admin/news" />;
}
