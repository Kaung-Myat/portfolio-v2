import type { Profile } from "@/src/types";

export const profile: Profile = {
  name: "Kaung Mrat Thu",
  role: "Flutter Developer & CS Student",
  company: "Brainwave Data",
  tagline: "Hi, I'm Kaung Mrat Thu.",
  intro:
    "I build thoughtful mobile experiences with Flutter and Android — currently shipping at Brainwave Data while studying computer science.",
  stack: ["Flutter", "Dart", "Kotlin", "Java"],
  socials: [
    { label: "GitHub", href: "https://github.com/Kaung-Myat" },
    { label: "Facebook", href: "https://www.facebook.com/Kkaungmratthuu/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kaungmratthu/" },
    { label: "YouTube", href: "https://www.youtube.com/@kkaungmratthuu" },
  ],
  heroCtas: [
    {
      label: "Download Resume",
      href: "/resume.pdf",
      variant: "primary",
      download: true,
    },
    {
      label: "Contact Me",
      href: "#contact",
      variant: "secondary",
    },
  ],
};
