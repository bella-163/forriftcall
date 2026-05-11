import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function WindRangerPage() {
  return (
    <ClassPageLayout
      name="疾風遊俠"
      role="遠距輸出・機動射手"
      color="blue"
      description="來去如風、箭無虛發，以靈活機動在遠距離掌控戰局。擅長持續輸出與快速位移，是副本中穩定的遠程傷害來源。"
      stats={[
        { label: "生命值", value: 60 },
        { label: "攻擊力", value: 85 },
        { label: "防禦力", value: 40 },
        { label: "機動性", value: 90 },
        { label: "團隊支援", value: 45 },
      ]}
      skills={[
        { name: "穿雲箭", description: "蓄力射出一支高速穿透箭矢，穿透多個敵人並造成大量傷害。" },
        { name: "疾風步", description: "瞬間向指定方向位移，短暫進入加速狀態並重置基本攻擊。" },
        { name: "毒霧箭雨", description: "向範圍內射出大量毒箭，造成持續毒傷並減慢敵方移動速度。" },
        { name: "鷹眼專注", description: "激活後提升攻擊距離與暴擊率，持續時間內輸出大幅提升。" },
      ]}
      tips={[
        "保持與敵人的距離是疾風遊俠的生存關鍵，善用疾風步拉開間距。",
        "毒霧箭雨適合在怪物密集時使用，效果最大化。",
        "與裁光行者搭配，治療加成讓你的續戰力大幅提升。",
      ]}
    />
  );
}
