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
