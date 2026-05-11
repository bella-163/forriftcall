import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function HeavyWarriorPage() {
  return (
    <ClassPageLayout
      name="重裝戰士"
      role="前線坦克・近戰守護者"
      color="crimson"
      href="/classes/heavy-warrior"
      image="/images/warrior2.png"
      description="重裝戰士是一個以近戰為主的高生存職業，擁有不錯的傷害能力，並以強大的生命值與防禦力著稱。適合正面迎擊敵人並吸收大量傷害。

然而，由於缺乏遠程手段與魔法能力，機動性也相對較差，對於機動戰與控場需求較高的場合較為吃力。"
      stats={[
        { label: "傷害", value: "B" },
        { label: "射程", value: "C" },
        { label: "機動", value: "C" },
        { label: "控制", value: "C" },
        { label: "魔法", value: "D" },
        { label: "體質", value: "A" },
      ]}
      skills={{
        pre: [
          { name: "盾牆衝撞", description: "以盾牌衝向敵人，造成傷害並短暫擊退目標，同時嘲諷周圍敵人攻擊自身。" },
          { name: "鋼鐵意志", description: "激活後大幅提升自身防禦與受到治療效果，持續數秒。" },
        ],
        post: [
          { name: "大地震裂", description: "重擊地面造成範圍傷害，並對命中敵人施加減速效果。" },
          { name: "守護光環", description: "為周圍隊友提供防禦加成，被動效果持續整場戰鬥。" },
        ],
      }}
      tips={[
        "優先提升生命值與防禦相關屬性，讓隊伍更好輸出。",
        "盾牆衝撞可以打斷敵方施法，副本 BOSS 戰時掌握時機。",
        "與法師搭配效果極佳，你吸引仇恨，法師負責輸出。",
      ]}
    />
  );
}
