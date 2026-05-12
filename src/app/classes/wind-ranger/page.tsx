import { ClassPageLayout } from "@/components/sections/ClassPageLayout";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export default function WindRangerPage() {
  const classes = readData<ClassData[]>("classes");
  const cls = classes.find((c) => c.slug === "wind-ranger")!;
  return <ClassPageLayout {...cls} href={`/classes/${cls.slug}`} />;
}
