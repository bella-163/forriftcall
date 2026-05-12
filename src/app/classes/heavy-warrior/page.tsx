import { ClassPageLayout } from "@/components/sections/ClassPageLayout";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export default function HeavyWarriorPage() {
  const classes = readData<ClassData[]>("classes");
  const cls = classes.find((c) => c.slug === "heavy-warrior")!;
  return <ClassPageLayout {...cls} href={`/classes/${cls.slug}`} />;
}
