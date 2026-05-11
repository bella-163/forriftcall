import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function ShadowAssassinPage() {
  return (
    <ClassPageLayout
      name="暗影刺客"
      role="單體爆發・隱匿刺殺者"
      color="violet"
      description="潛行於暗處、一擊致命，以極致爆發力終結目標。擅長迅速消滅高價值單體敵人，但在群戰中需要謹慎選擇出手時機。"
      stats={[
        { label: "生命值", value: 50 },
        { label: "攻擊力", value: 95 },
        { label: "防禦力", value: 30 },
        { label: "機動性", value: 92 },
        { label: "團隊支援", value: 30 },
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
