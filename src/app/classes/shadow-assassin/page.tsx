import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function ShadowAssassinPage() {
  return (
    <ClassPageLayout
      name="暗影刺客"
      role="單體爆發・隱匿刺殺者"
      color="violet"
      image="/images/assassin2.jpg"
      description="暗影刺客為極致的近戰爆發職業，擁有全職業最高的傷害與機動性，專注於擊殺單一目標。代價是體質、射程、魔法與控制能力皆為最低。"
      stats={[
        { label: "傷害", value: "A" },
        { label: "射程", value: "C" },
        { label: "機動", value: "A" },
        { label: "體質", value: "D" },
        { label: "魔法", value: "D" },
        { label: "控制", value: "D" },
      ]}
      skills={[
        { name: "暗影遁形", description: "進入隱匿狀態，短時間內無法被敵人偵測，並使下次攻擊傷害大幅提升。" },
        { name: "致命一擊", description: "從背後或隱匿狀態發動攻擊，造成數倍於普通攻擊的爆發傷害。" },
        { name: "毒刃連斬", description: "快速連續攻擊目標三次，每次附加持續中毒效果。" },
        { name: "影分身", description: "製造一個幻象分身吸引敵人注意，自身趁機位移至安全位置。" },
      ]}
      tips={[
        "利用暗影遁形接致命一擊，是最高傷害的基本連段。",
        "副本中優先刺殺法師型怪物，消除威脅來源。",
        "影分身不只能脫戰，也可以在被 BOSS 鎖定時救命。",
      ]}
    />
  );
}
