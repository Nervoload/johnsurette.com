export interface TimelineScene {
  id: string;
  year: string;
  title: string;
  summary: string;
  foreground: string;
  midground: string;
  background: string;
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
  },
  {
    id: "systems",
    year: "2020",
    title: "Systems Shift",
    summary: "Moved from one-off builds to reusable architecture with components designed to evolve.",
    foreground: "#22c55e",
    midground: "#a78bfa",
    background: "#dbeafe",
  },
  {
    id: "motion",
    year: "2023",
    title: "Motion + Depth",
    summary: "Started blending motion systems, layered depth, and narrative pacing into product storytelling.",
    foreground: "#f97316",
    midground: "#06b6d4",
    background: "#e0f2fe",
  },
  {
    id: "current",
    year: "Now",
    title: "Narrative Portfolio",
    summary: "Building a long-term platform where projects, writing, and personal story evolve in one system.",
    foreground: "#ec4899",
    midground: "#60a5fa",
    background: "#f1f5f9",
  },
];
