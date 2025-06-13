// src/components/sections.ts
export interface Section {
  name: string;
  color: string;
}

/** App‑wide palette & ordering for the landing circle */
export const sections: Section[] = [
  { name: "Overview",   color: "#ff085a" },
  { name: "My Projects",    color: "#ffd608" },
  { name: "My Story",    color: "#08ff94" },
  { name: "Connect", color: "#08c5ff" },
  { name: "Research Blog",    color: "#da08ff" },
];
