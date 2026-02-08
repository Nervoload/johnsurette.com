import { CARD_BACK_TEXTURES, CARD_FRONT_TEXTURES } from "./cardTextures";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  details: string;
  tags: string[];
  accent: string;
  cardFrontSrc: string;
  cardBackSrc: string;
  media: string[];
  links: ProjectLink[];
}

export const projectItems: ProjectItem[] = [
  {
    id: "portfolio-3d",
    title: "Portfolio Story Engine",
    subtitle: "Narrative UI System",
    summary: "A modular storytelling framework for scroll-based personal web experiences.",
    details:
      "Built reusable scene primitives, transition orchestration, and card-based storytelling blocks to keep animation logic composable across pages.",
    tags: ["React", "Framer Motion", "Architecture"],
    accent: "#ffd608",
    cardFrontSrc: CARD_FRONT_TEXTURES[0],
    cardBackSrc: CARD_BACK_TEXTURES[0],
    media: [CARD_FRONT_TEXTURES[0], CARD_BACK_TEXTURES[0]],
    links: [
      { label: "Live Site", href: "#" },
      { label: "Source", href: "#" },
    ],
  },
  {
    id: "vision-lab",
    title: "Vision Lab",
    subtitle: "3D + Graphics Experiments",
    summary: "Interactive visual prototypes focused on depth, motion, and tactile interfaces.",
    details:
      "Explored lightweight approaches to visual depth where real-time 3D is used selectively and performance-first fallbacks are available for mobile devices.",
    tags: ["Three.js", "R3F", "Performance"],
    accent: "#08c5ff",
    cardFrontSrc: CARD_FRONT_TEXTURES[1],
    cardBackSrc: CARD_BACK_TEXTURES[1],
    media: [CARD_BACK_TEXTURES[1], CARD_FRONT_TEXTURES[1]],
    links: [
      { label: "Case Study", href: "#" },
      { label: "Prototype", href: "#" },
    ],
  },
  {
    id: "timeline-book",
    title: "Life Timeline Book",
    subtitle: "About Page Prototype",
    summary: "A layered pop-up-book timeline concept with foreground, midground, and background scenes.",
    details:
      "Designed a card scene graph that can load decade-based snapshots, crossfade layered assets, and support gradual updates without rewriting animation timelines.",
    tags: ["Storytelling", "Timeline", "Design Systems"],
    accent: "#08ff94",
    cardFrontSrc: CARD_FRONT_TEXTURES[2],
    cardBackSrc: CARD_BACK_TEXTURES[2],
    media: [CARD_FRONT_TEXTURES[2], CARD_BACK_TEXTURES[2]],
    links: [
      { label: "Read Notes", href: "#" },
      { label: "Design Doc", href: "#" },
    ],
  },
];
