export type SocialLink = {
  label: string;
  href: string;
};

export type HeroCta = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  download?: boolean;
  external?: boolean;
};

export type Profile = {
  name: string;
  role: string;
  company: string;
  tagline: string;
  intro: string;
  stack: string[];
  socials: SocialLink[];
  heroCtas: HeroCta[];
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  stack?: string[];
  current?: boolean;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  link?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
