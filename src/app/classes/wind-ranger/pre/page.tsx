import { ClassPhaseLayout } from "@/components/sections/ClassPhaseLayout";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export default function WindRangerPrePage() {
  const classes = readData<ClassData[]>("classes");
  const cls = classes.find((c) => c.slug === "wind-ranger")!;
  return (
    <ClassPhaseLayout
      className={cls.name}
      phase="pre"
      color={cls.color as "blue"}
      classHref={`/classes/${cls.slug}`}
      sections={cls.phases.pre}
    />
  );
}
