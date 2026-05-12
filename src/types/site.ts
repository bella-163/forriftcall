export type NavItem = {
  label: string;
  href: string;
};

export type FeatureCard = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  theme: "crimson" | "gold" | "violet" | "blue";
};

export type GuideCard = {
  title: string;
  category: string;
  description: string;
  rating: string;
};

export type ServerIP = {
  label: string;
  ip: string;
};

export type QuickStartItem = {
  title: string;
  description: string;
  action: string;
  ips?: ServerIP[];
  href?: string;
};

export type HeroData = {
  tagline: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
};

export type HomeData = {
  hero: HeroData;
  featureCards: FeatureCard[];
  guideCards: GuideCard[];
  serverIPs: ServerIP[];
  quickStart: QuickStartItem[];
};

export type Skill = {
  name: string;
  description: string;
};

export type CatalogKind = "equipment" | "materials";

export type CatalogRef = {
  type: CatalogKind;
  slug: string;
  parentSlug?: string;
};

export type CraftIngredient = {
  ref?: CatalogRef;
  name?: string;
  quantity?: string;
  note?: string;
};

export type CraftRecipe = {
  title: string;
  description: string;
  ingredients: CraftIngredient[];
};

export type ClassStat = {
  label: string;
  value: string | number;
};

export type PhaseBlock = {
  title?: string;
  image: string;
  text: string;
  ref?: CatalogRef;
};

export type ClassData = {
  slug: string;
  name: string;
  role: string;
  description: string;
  color: "crimson" | "gold" | "violet" | "blue" | "green" | "gray";
  image: string;
  imageRef?: CatalogRef;
  stats: ClassStat[];
  skills: {
    pre: Skill[];
    post: Skill[];
  };
  tips: string[];
  phases: {
    pre: Record<string, PhaseBlock[]>;
    post: Record<string, PhaseBlock[]>;
  };
};

export type PageData = {
  title: string;
  description: string;
  items: string[];
};

export type NewsPost = {
  id: string;
  date: string;
  title: string;
  content: string;
  image: string;
  dcLink: string;
};

export type NewsCategoryData = {
  slug: string;
  name: string;
  color: "crimson" | "gold" | "violet" | "blue" | "green" | "gray";
  posts: NewsPost[];
};

export type NewsPageData = {
  title: string;
  description: string;
  eyebrow: string;
  categories: NewsCategoryData[];
};

export type EquipmentPiece = {
  slug?: string;
  image: string;
  name: string;
  category: string;
  description?: string;
  effects: string[];
  rating: string;
  attributes?: string[];
  skills?: Skill[];
  acquisition?: PhaseBlock[];
  crafting?: CraftRecipe[];
  sections?: Record<string, PhaseBlock[]>;
};

export type ItemData = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  color: "crimson" | "gold" | "violet" | "blue" | "green" | "gray";
  attributes?: string[];
  skills?: Skill[];
  acquisition?: PhaseBlock[];
  crafting?: CraftRecipe[];
  sections: Record<string, PhaseBlock[]>;
  pieces?: EquipmentPiece[];
  pieceCategories?: string[];
};

export type SectionListData = {
  title: string;
  description: string;
  eyebrow: string;
  categories?: string[];
  items: ItemData[];
};
