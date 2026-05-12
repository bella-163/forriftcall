import { ClassPhaseLayout } from "@/components/sections/ClassPhaseLayout";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export default function ShadowAssassinPrePage() {
  const classes = readData<ClassData[]>("classes");
  const cls = classes.find((c) => c.slug === "shadow-assassin")!;
  return (
    <ClassPhaseLayout
      className={cls.name}
      phase="pre"
      color={cls.color as "gray"}
      classHref={`/classes/${cls.slug}`}
      sections={cls.phases.pre}
    />
  );
}
