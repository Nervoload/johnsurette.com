export interface TimelineAction {
  label: string;
  path: string;
}

export interface TimelineDetail {
  kicker: string;
  body: string;
  studioNote: string;
  assetLabel: string;
  assetGradient: string;
}

export interface TimelineScene {
  id: string;
  year: string;
  title: string;
  summary: string;
  foreground: string;
  midground: string;
  background: string;
  detail: TimelineDetail;
  nowActions?: TimelineAction[];
}

export const timelineScenes: TimelineScene[] = [
  {
    id: "origin",
    year: "2017",
    title: "Origin Point",
    summary: "First experiments turning ideas into visual interfaces and interactive sketches.",
    foreground: "#fb7185",
    midground: "#38bdf8",
    background: "#e0e7ff",
    detail: {
      kicker: "First Prototype Era",
      body: "This phase was about learning by shipping. Small interfaces, fast iteration loops, and visual experiments laid the baseline for everything that came after.",
      studioNote: "Focus: intuition, composition, and interaction basics.",
      assetLabel: "Sketchbook Grid",
      assetGradient: "linear-gradient(148deg, rgba(251,113,133,0.38), rgba(56,189,248,0.3), rgba(255,255,255,0.9))",
    },
  },
  {
    id: "systems",
    year: "2020",
    title: "Systems Shift",
    summary: "Moved from one-off builds to reusable architecture with components designed to evolve.",
    foreground: "#22c55e",
    midground: "#a78bfa",
    background: "#dbeafe",
    detail: {
      kicker: "System Design Shift",
      body: "This period introduced modular thinking: reusable components, cleaner boundaries, and patterns that scale without constant rewrites.",
      studioNote: "Focus: maintainability, consistency, and velocity.",
      assetLabel: "Component Atlas",
      assetGradient: "linear-gradient(152deg, rgba(34,197,94,0.34), rgba(167,139,250,0.26), rgba(255,255,255,0.92))",
    },
  },
  {
    id: "motion",
    year: "2023",
    title: "Motion + Depth",
    summary: "Started blending motion systems, layered depth, and narrative pacing into product storytelling.",
    foreground: "#f97316",
    midground: "#06b6d4",
    background: "#e0f2fe",
    detail: {
      kicker: "Motion Narrative Era",
      body: "Animation became structural, not decorative. Depth, pacing, and transitions were shaped to improve understanding and guide attention.",
      studioNote: "Focus: timing systems, depth language, and scroll choreography.",
      assetLabel: "Motion Storyboard",
      assetGradient: "linear-gradient(155deg, rgba(249,115,22,0.34), rgba(6,182,212,0.26), rgba(255,255,255,0.9))",
    },
  },
  {
    id: "current",
    year: "Now",
    title: "Narrative Portfolio",
    summary: "Building a long-term platform where projects, writing, and personal story evolve in one system.",
    foreground: "#ec4899",
    midground: "#60a5fa",
    background: "#f1f5f9",
    detail: {
      kicker: "Now",
      body: "The current stage is a living studio: portfolio, projects, and writing connected in a single narrative product with room for continuous evolution.",
      studioNote: "Focus: polish, consistency, and clear storytelling.",
      assetLabel: "Live Studio Plane",
      assetGradient: "linear-gradient(158deg, rgba(236,72,153,0.3), rgba(96,165,250,0.24), rgba(255,255,255,0.94))",
    },
    nowActions: [
      { label: "View Projects", path: "/projects" },
      { label: "Open Contact", path: "/contact" },
      { label: "Read Blog", path: "/blog" },
    ],
  },
];
