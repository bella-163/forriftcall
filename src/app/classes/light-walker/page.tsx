import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function LightWalkerPage() {
  return (
    <ClassPageLayout
      name="裁光行者"
      role="神聖輔助・治癒者"
      color="gold"
      description="以神聖之光治癒盟友、懲戒敵人，是支撐隊伍續戰的核心。掌握強力治療與輔助技能，同時能對不死系怪物造成額外傷害。"
      stats={[
        { label: "生命值", value: 70 },
        { label: "攻擊力", value: 50 },
        { label: "防禦力", value: 65 },
        { label: "機動性", value: 55 },
        { label: "團隊支援", value: 98 },
      ]}
      skills={[
        { name: "聖光治癒", description: "對目標隊友施放治療，恢復大量生命值，並附加短暫的回復效果。" },
        { name: "神聖懲裁", description: "對敵人釋放神聖能量，對不死系敵人造成額外 50% 傷害。" },
        { name: "庇護光環", description: "為周圍隊友施加神聖護盾，持續時間內免疫一次致命傷害。" },
        { name: "復甦之光", description: "使倒地的隊友重新站起，並恢復其一定比例的最大生命值。" },
      ]}
      tips={[
        "優先為坦克治療，坦克存活才能維持陣型。",
        "庇護光環應在 BOSS 釋放大招前提前預判施放。",
        "深淵副本中對不死系怪物輸出可觀，不要忽略進攻能力。",
      ]}
    />
  );
}
