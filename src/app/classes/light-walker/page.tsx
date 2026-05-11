import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function LightWalkerPage() {
  return (
    <ClassPageLayout
      name="裁光行者"
      role="神聖輔助・治癒者"
      color="gold"
      href="/classes/light-walker"
      image="/images/priest2.jpg"
      description="一個半戰士半輔助的神聖職業，擅長光屬性劍技與恢復、淨化。裁光行者既是審判的執行者，也是恩澤的賜予者，他能在戰鬥中同時施展治癒之力，將攻擊與守護融為一體。"
      stats={[
        { label: "傷害", value: "C" },
        { label: "射程", value: "B" },
        { label: "機動", value: "B" },
        { label: "體質", value: "B" },
        { label: "魔法", value: "B" },
        { label: "控制", value: "C" },
      ]}
      skills={{
        pre: [
          { name: "聖光治癒", description: "對目標隊友施放治療，恢復大量生命值，並附加短暫的回復效果。" },
          { name: "神聖懲裁", description: "對敵人釋放神聖能量，對不死系敵人造成額外 50% 傷害。" },
        ],
        post: [
          { name: "庇護光環", description: "為周圍隊友施加神聖護盾，持續時間內免疫一次致命傷害。" },
          { name: "復甦之光", description: "使倒地的隊友重新站起，並恢復其一定比例的最大生命值。" },
        ],
      }}
      tips={[
        "優先為坦克治療，坦克存活才能維持陣型。",
        "庇護光環應在 BOSS 釋放大招前提前預判施放。",
        "深淵副本中對不死系怪物輸出可觀，不要忽略進攻能力。",
      ]}
    />
  );
}
