import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function WindRangerPage() {
  return (
    <ClassPageLayout
      name="疾風遊俠"
      role="遠距輸出・機動射手"
      color="blue"
      href="/classes/wind-ranger"
      image="/images/ranger2.png"
      description="疾風遊俠是身法輕盈、箭術精準的遠程職業，以風的速度制敵於無形。擁有穩定的傷害與控制，能在戰場上保持距離並持續穩定輸出。擅長牽制與游擊，是一位相當均衡、機動性極高的弓箭手。"
      stats={[
        { label: "傷害", value: "B" },
        { label: "射程", value: "A" },
        { label: "機動", value: "A" },
        { label: "控制", value: "A" },
        { label: "魔法", value: "C" },
        { label: "體質", value: "C" },
      ]}
      skills={{
        pre: [
          { name: "穿雲箭", description: "蓄力射出一支高速穿透箭矢，穿透多個敵人並造成大量傷害。" },
          { name: "疾風步", description: "瞬間向指定方向位移，短暫進入加速狀態並重置基本攻擊。" },
        ],
        post: [
          { name: "毒霧箭雨", description: "向範圍內射出大量毒箭，造成持續毒傷並減慢敵方移動速度。" },
          { name: "鷹眼專注", description: "激活後提升攻擊距離與暴擊率，持續時間內輸出大幅提升。" },
        ],
      }}
      tips={[
        "保持與敵人的距離是疾風遊俠的生存關鍵，善用疾風步拉開間距。",
        "毒霧箭雨適合在怪物密集時使用，效果最大化。",
        "與裁光行者搭配，治療加成讓你的續戰力大幅提升。",
      ]}
    />
  );
}
