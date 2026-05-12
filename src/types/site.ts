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

export type ClassStat = {
  label: string;
  value: string | number;
};

export type ClassData = {
  slug: string;
  name: string;
  role: string;
  description: string;
  color: "crimson" | "gold" | "violet" | "blue" | "green" | "gray";
  image: string;
  stats: ClassStat[];
  skills: {
    pre: Skill[];
    post: Skill[];
  };
  tips: string[];
  phases: {
    pre: Record<string, string>;
    post: Record<string, string>;
  };
};

export type PageData = {
  title: string;
  description: string;
  items: string[];
};
