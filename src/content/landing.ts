import {
  defineLandingConclusion,
  defineOriginLabContent,
  defineStorySection,
} from "./define";
import {
  LandingConclusionContent,
  LandingOriginLabContent,
  LandingStoryEntry,
  StoryTransitionKind,
} from "./types";

// EDIT HERE: landing story sections and landing page copy.
export const landingStory = [
  defineStorySection({
    id: "cellular-dawn",
    eyebrow: "01 · Cellular Dawn",
    title: "I study life extension as a systems design problem.",
    summary:
      "Longevity is not one breakthrough. It is the choreography of repair, resilience, and adaptation across scales.",
    focusAreas: [
      "Mitochondrial function",
      "Cellular senescence",
      "Epigenetic drift",
      "Inflammaging",
      "Regeneration dynamics",
    ],
    accent: "#22d3ee",
    glow: "#818cf8",
    deep: "#0f172a",
  }),
  defineStorySection({
    id: "repair-stack",
    eyebrow: "02 · The Repair Stack",
    title: "Biology can be approached as layered protocol design.",
    summary:
      "Interventions become stronger when staged together: diagnostics, metabolic tuning, regenerative inputs, and behavioral feedback loops.",
    focusAreas: [
      "Sensing",
      "Nutrient signaling",
      "Autophagy",
      "Neuroplasticity",
      "Recovery loops",
      "Behavioral control",
    ],
    accent: "#38bdf8",
    glow: "#a78bfa",
    deep: "#111827",
  }),
  defineStorySection({
    id: "neural-atlas",
    eyebrow: "03 · Neural Atlas",
    title: "Neuroscience is my map for cognition and identity.",
    summary:
      "I am interested in how memory, prediction, and attention can be understood as dynamic networks rather than isolated modules.",
    focusAreas: [
      "Predictive processing",
      "Memory encoding",
      "Network plasticity",
      "Cortical rhythms",
      "Neuro-interface pathways",
    ],
    accent: "#06b6d4",
    glow: "#f472b6",
    deep: "#020617",
  }),
  defineStorySection({
    id: "human-machine",
    eyebrow: "04 · Human x Machine",
    title: "Transhumanism for me is practical augmentation, not aesthetics.",
    summary:
      "Tools should extend agency, cognition, and healthspan while preserving autonomy, dignity, and ethical guardrails.",
    focusAreas: [
      "BCI pathways",
      "Neural prosthetics",
      "AI co-intelligence",
      "Bio-sensing wearables",
      "Ethical constraints",
      "Distributed cognition",
    ],
    accent: "#0ea5e9",
    glow: "#2dd4bf",
    deep: "#0b1120",
  }),
  defineStorySection({
    id: "future-protocol",
    eyebrow: "05 · Future Protocol",
    title: "I am building a long-horizon research and design practice.",
    summary:
      "The mission is to translate frontier science into usable interfaces, narratives, and systems people can actually live with.",
    focusAreas: [
      "Current explorations",
      "Open collaborations",
      "Research notes",
      "Prototype builds",
      "Public writing",
    ],
    accent: "#22d3ee",
    glow: "#a855f7",
    deep: "#020617",
  }),
] satisfies LandingStoryEntry[];

export const landingStoryTransitions: StoryTransitionKind[] = [
  "cell-split",
  "ring-mesh",
  "synapse-grid",
  "grid-ascend",
];

export const landingOriginLabContent: LandingOriginLabContent = defineOriginLabContent({
  eyebrow: "02 · Origin Sequence",
  title: "Enter the cinematic origin sequence.",
  summary: "From particles to galaxies, this is a dedicated immersive stage rendered on a separate route.",
  ctaLabel: "Open Origin Lab",
  ctaPath: "/origin",
});

export const landingConclusionContent: LandingConclusionContent = defineLandingConclusion({
  eyebrow: "03 · Continue",
  title: "Explore projects, writing, and ongoing research.",
  summary:
    "This site is an evolving lab across longevity science, neuroscience, and design systems. Start anywhere and follow the thread.",
  highlightedProjectsLabel: "Highlighted Projects",
  highlightedPostsLabel: "Recent Research Notes",
  routePillsLabel: "Continue To",
});
