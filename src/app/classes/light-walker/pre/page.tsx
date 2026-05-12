import { ClassPhaseLayout } from "@/components/sections/ClassPhaseLayout";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export const dynamic = "force-dynamic";

export default function LightWalkerPrePage() {
  const classes = readData<ClassData[]>("classes");
  const cls = classes.find((c) => c.slug === "light-walker")!;
  return (
    <ClassPhaseLayout
      className={cls.name}
      phase="pre"
      color={cls.color as "gold"}
      classHref={`/classes/${cls.slug}`}
      sections={cls.phases.pre}
    />
  );
}
