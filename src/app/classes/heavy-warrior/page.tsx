import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function HeavyWarriorPage() {
  return (
    <ClassPageLayout
      name="重裝戰士"
      role="前線坦克・近戰守護者"
      color="crimson"
      description="身披重甲、以盾為刃，是隊伍中不可或缺的前線守護者。憑藉強大的防禦力與嘲諷技能，吸引敵方仇恨，保護隊友安全輸出。"
      stats={[
        { label: "生命值", value: 95 },
        { label: "攻擊力", value: 60 },
        { label: "防禦力", value: 95 },
        { label: "機動性", value: 35 },
        { label: "團隊支援", value: 75 },
      ]}
      skills={[
        { name: "盾牆衝撞", description: "以盾牌衝向敵人，造成傷害並短暫擊退目標，同時嘲諷周圍敵人攻擊自身。" },
        { name: "鋼鐵意志", description: "激活後大幅提升自身防禦與受到治療效果，持續數秒。" },
        { name: "大地震裂", description: "重擊地面造成範圍傷害，並對命中敵人施加減速效果。" },
        { name: "守護光環", description: "為周圍隊友提供防禦加成，被動效果持續整場戰鬥。" },
      ]}
      tips={[
        "優先提升生命值與防禦相關屬性，讓隊伍更好輸出。",
        "盾牆衝撞可以打斷敵方施法，副本 BOSS 戰時掌握時機。",
        "與法師搭配效果極佳，你吸引仇恨，法師負責輸出。",
      ]}
    />
  );
}
