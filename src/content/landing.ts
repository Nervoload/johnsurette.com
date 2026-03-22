import {
  defineLandingAspirationSection,
  defineLandingBiologySection,
  defineLandingComputationalSection,
  defineLandingHeroIdentity,
  defineLandingConclusion,
  defineLandingPersonalIntroduction,
  defineOriginLabContent,
  defineStorySection,
} from "./define";
import {
  LandingAspirationSectionContent,
  LandingBiologySectionContent,
  LandingConclusionContent,
  LandingComputationalSectionContent,
  LandingHeroIdentityContent,
  LandingOriginLabContent,
  LandingPersonalIntroductionContent,
  LandingStoryEntry,
  StoryTransitionKind,
} from "./types";

// EDIT HERE: landing story sections and landing page copy.
export const landingStory = [
  defineStorySection({
    id: "personal-introduction",
    eyebrow: "01 · Introduction",
    title: "Understanding Living Systems with adaptive technology",
    summary:
      "Systems thinking across machine learning, biology, and computation.",
    focusAreas: [
      "Adaptive technology",
      "Neuromorphic intuition",
      "Biological information",
      "In vivo systems",
      "In silico systems",
    ],
    accent: "#22d3ee",
    glow: "#818cf8",
    deep: "#0f172a",
  }),
  defineStorySection({
    id: "computational-systems",
    eyebrow: "02 · Computation",
    title: "Simple rules, Complex systems",
    summary:
      "AI systems, emergent behavior, and engineered intelligence.",
    focusAreas: [
      "Learning algorithms",
      "Networked inference",
      "Model architecture",
      "Emergent simplicity",
      "Applied engineering",
    ],
    accent: "#38bdf8",
    glow: "#a78bfa",
    deep: "#111827",
  }),
  defineStorySection({
    id: "biology-intelligence",
    eyebrow: "03 · Biology",
    title: "Life is intelligent.",
    summary:
      "Cellular signaling, synapses, and the computations of life.",
    focusAreas: [
      "Synaptic transmission",
      "Signal diffusion",
      "Cellular computation",
      "Neurobiology",
      "Health technology",
    ],
    accent: "#06b6d4",
    glow: "#f472b6",
    deep: "#020617",
  }),
  defineStorySection({
    id: "aspiration-journey",
    eyebrow: "04 · Aspiration",
    title: "My journey has just started.",
    summary:
      "Branching paths across science, computation, and future research.",
    focusAreas: [
      "Life science",
      "Computer science",
      "AI research",
      "Neuroscience",
      "Longevity",
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
];

export const landingOriginLabContent: LandingOriginLabContent = defineOriginLabContent({
  eyebrow: "02 · Origin Sequence",
  title: "Enter the cinematic origin sequence.",
  summary: "From particles to galaxies, this is a dedicated immersive stage rendered on a separate route.",
  ctaLabel: "Open Origin Lab",
  ctaPath: "/origin",
  isVisible: false,
});

export const landingHeroIdentityContent: LandingHeroIdentityContent = defineLandingHeroIdentity({
  kicker: "This is",
  firstName: "John",
  lastName: "Surette",
  domainSuffix: ".com",
});

export const landingPersonalIntroductionContent: LandingPersonalIntroductionContent = defineLandingPersonalIntroduction({
  title: "Understanding Living Systems with adaptive technology",
  subtitle: "Using neuromorphic computing to learn emergent complexity",
  body: [
    "I build applications of learning algorithms, AI, and systems to decode, interpret and generate biological information.",
    "I study Computer Science and Life Sciences at the University of Ottawa, to refine my intuition for systems - in vivo and in silico.",
  ],
  photos: [
    {
      id: "portrait-research",
      alt: "Portrait placeholder in a research context",
      caption: "Research context",
      palette: ["#0f172a", "#06b6d4", "#f8fafc"],
    },
    {
      id: "portrait-campus",
      alt: "Portrait placeholder on campus",
      caption: "Campus portrait",
      palette: ["#111827", "#818cf8", "#e2e8f0"],
    },
    {
      id: "portrait-builder",
      alt: "Portrait placeholder in a builder context",
      caption: "Builder portrait",
      palette: ["#052e16", "#22c55e", "#dcfce7"],
    },
  ],
});

export const landingComputationalSectionContent: LandingComputationalSectionContent = defineLandingComputationalSection({
  title: "Simple rules, Complex systems",
  quote: "A fool admires complexity, a genius admires simplicity.",
  body:
    "Science is about unlocking underlying principles so that we can understand and exploit them. I engineer solutions to explore exploitation.",
  cta: {
    label: "Check out my projects here",
    path: "/projects",
  },
});

export const landingBiologySectionContent: LandingBiologySectionContent = defineLandingBiologySection({
  overlayTitle: "Life is intelligent.",
  overlayBody: "Trillions of computations, between cells, across organ systems, and even within DNA.",
  body:
    "The future of human health is to design technology that can analyze, simulate, and generate these computations so that we may control the dynamics of life.",
  cta: {
    label: "See my research here",
    path: "/blog",
  },
});

export const landingAspirationSectionContent: LandingAspirationSectionContent = defineLandingAspirationSection({
  title: "My journey has just started.",
  body: "I hope that you can be a part of it!",
  footerTitle: "My journey has just started.",
  footerBody: "I hope that you can be a part of it!",
  nodes: [
    { id: "life-science-major", label: "Major in Life science", stage: 1, lane: "left" },
    { id: "computer-science-major", label: "Major in computer science", stage: 1, lane: "right" },
    { id: "science-student-association", label: "Science Student Association", stage: 2, lane: "left" },
    { id: "computational-neuroscience", label: "Computational neuroscience", stage: 2, lane: "center" },
    { id: "ai-research", label: "AI research", stage: 2, lane: "center" },
    { id: "entrepreneurship", label: "Entrepreneurship", stage: 2, lane: "right" },
    { id: "graduation-2027", label: "Graduation (2027)", stage: 3, lane: "center" },
    { id: "brain-computer-interface", label: "Brain computer interface", stage: 4, lane: "left" },
    { id: "longevity", label: "Longevity", stage: 4, lane: "center" },
    { id: "aging-biology", label: "Aging Biology", stage: 4, lane: "right" },
  ],
  edges: [
    { from: "life-science-major", to: "science-student-association", weight: "branch" },
    { from: "life-science-major", to: "computational-neuroscience", weight: "branch" },
    { from: "computer-science-major", to: "ai-research", weight: "branch" },
    { from: "computer-science-major", to: "entrepreneurship", weight: "branch" },
    { from: "science-student-association", to: "graduation-2027", weight: "branch" },
    { from: "computational-neuroscience", to: "graduation-2027", weight: "branch" },
    { from: "ai-research", to: "graduation-2027", weight: "branch" },
    { from: "entrepreneurship", to: "graduation-2027", weight: "branch" },
    { from: "graduation-2027", to: "brain-computer-interface", weight: "trunk" },
    { from: "graduation-2027", to: "longevity", weight: "trunk" },
    { from: "graduation-2027", to: "aging-biology", weight: "trunk" },
  ],
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
