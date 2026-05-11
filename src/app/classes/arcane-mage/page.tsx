import { ClassPageLayout } from "@/components/sections/ClassPageLayout";

export default function ArcaneMagePage() {
  return (
    <ClassPageLayout
      name="萬象法師"
      role="爆發輸出・元素魔法師"
      color="violet"
      href="/classes/arcane-mage"
      image="/images/magician2.jpg"
      description="萬象法師是一名掌控多重元素的遠程施法者，擁有穩定的輸出能力與絕佳的群體魔法。雖然缺乏機動力與體質，但只要站位得當，就能發揮毀滅性的戰場影響力。"
      stats={[
        { label: "傷害", value: "B" },
        { label: "射程", value: "A" },
        { label: "機動", value: "D" },
        { label: "控制", value: "A" },
        { label: "魔法", value: "A" },
        { label: "體質", value: "B" },
      ]}
      skills={{
        pre: [
          { name: "元素爆炎", description: "召喚強力的元素爆炸，對範圍內敵人造成巨量魔法傷害。" },
          { name: "冰霜新星", description: "以自身為中心釋放冰霜衝擊波，凍結周圍敵人並造成傷害。" },
        ],
        post: [
          { name: "萬象連鎖", description: "釋放連鎖閃電，在多個敵人間跳躍傳導，每次跳躍傷害遞增。" },
          { name: "魔力護盾", description: "消耗魔力值生成護盾，抵擋一定量的傷害後消散。" },
        ],
      }}
      tips={[
        "法師脆弱，一定要跟在坦克後方，不要主動衝入敵群。",
        "冰霜新星可搭配重裝戰士的嘲諷使用，凍結敵人讓隊友輸出。",
        "元素爆炎冷卻較長，留在 BOSS 血量關鍵節點使用效益最大。",
      ]}
    />
  );
}
