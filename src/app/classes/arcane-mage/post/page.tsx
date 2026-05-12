import { ClassPhaseLayout } from "@/components/sections/ClassPhaseLayout";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export default function ArcaneMagePostPage() {
  const classes = readData<ClassData[]>("classes");
  const cls = classes.find((c) => c.slug === "arcane-mage")!;
  return (
    <ClassPhaseLayout
      className={cls.name}
      phase="post"
      color={cls.color as "violet"}
      classHref={`/classes/${cls.slug}`}
      sections={cls.phases.post}
    />
  );
}
