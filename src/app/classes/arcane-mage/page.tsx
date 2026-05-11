import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function ArcaneMagePage() {
  return (
    <ClassPageLayout
      name="萬象法師"
      role="爆發輸出・元素魔法師"
      color="violet"
      description="掌握萬象之力，以元素魔法橫掃戰場、輸出無雙。擁有遊戲中最高的單次爆發傷害，但需要隊友保護才能發揮全力。"
      stats={[
        { label: "生命值", value: 45 },
        { label: "攻擊力", value: 98 },
        { label: "防禦力", value: 25 },
        { label: "機動性", value: 50 },
        { label: "團隊支援", value: 55 },
      ]}
      skills={[
        { name: "元素爆炎", description: "召喚強力的元素爆炸，對範圍內敵人造成巨量魔法傷害。" },
        { name: "冰霜新星", description: "以自身為中心釋放冰霜衝擊波，凍結周圍敵人並造成傷害。" },
        { name: "萬象連鎖", description: "釋放連鎖閃電，在多個敵人間跳躍傳導，每次跳躍傷害遞增。" },
        { name: "魔力護盾", description: "消耗魔力值生成護盾，抵擋一定量的傷害後消散。" },
      ]}
      tips={[
        "法師脆弱，一定要跟在坦克後方，不要主動衝入敵群。",
        "冰霜新星可搭配重裝戰士的嘲諷使用，凍結敵人讓隊友輸出。",
        "元素爆炎冷卻較長，留在 BOSS 血量關鍵節點使用效益最大。",
      ]}
    />
  );
}
