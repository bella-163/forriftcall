import { ClassPageLayout } from "@/components/sections/ClassPageLayout";
import { readData } from "@/lib/data";
import type { ClassData } from "@/types/site";

export const dynamic = "force-dynamic";

export default function LightWalkerPage() {
  const classes = readData<ClassData[]>("classes");
  const cls = classes.find((c) => c.slug === "light-walker")!;
  return <ClassPageLayout {...cls} href={`/classes/${cls.slug}`} />;
}
