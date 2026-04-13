import { defineBlogPage, defineBlogPost } from "./define";
import {
  BlogAccentLight,
  BlogPageContent,
  BlogPostEntry,
  BlogSceneId,
  BlogVisualIdentity,
} from "./types";

const createBlogCoverSvg = ({
  palette,
  material,
  sceneId,
  grain,
}: {
  palette: BlogVisualIdentity["palette"];
  material: BlogVisualIdentity["material"];
  sceneId?: BlogSceneId;
  grain: BlogVisualIdentity["grain"];
}): string => {
  const { background, surface, accent, highlight, text } = palette;
  const materialOpacity = material === "glass" ? "0.16" : material === "satin" ? "0.22" : "0.12";
  const grainOpacity = grain === "paper" ? "0.1" : grain === "soft" ? "0.06" : "0.02";
  const sceneMarkup =
    sceneId === "signalGrid"
      ? `
        <path d="M132 620C248 512 342 474 474 486C608 498 724 594 858 600C966 604 1049 567 1082 526" stroke="${highlight}" stroke-opacity="0.36" stroke-width="3.2" />
        <path d="M138 686H1062" stroke="${surface}" stroke-opacity="0.16" stroke-width="2" />
        <path d="M228 184V716M430 184V716M632 184V716M834 184V716" stroke="${surface}" stroke-opacity="0.14" stroke-width="1.6" />
      `
      : sceneId === "neuralBloom"
        ? `
          <circle cx="358" cy="282" r="126" fill="${highlight}" fill-opacity="0.12" />
          <circle cx="812" cy="578" r="188" fill="${accent}" fill-opacity="0.12" />
          <path d="M326 278C430 286 520 334 592 430C656 515 733 560 822 576" stroke="${highlight}" stroke-opacity="0.34" stroke-width="3.6" />
          <path d="M372 236C474 262 551 320 632 422C706 516 796 592 916 636" stroke="${surface}" stroke-opacity="0.2" stroke-width="2.4" />
        `
        : `
          <ellipse cx="684" cy="438" rx="288" ry="208" stroke="${highlight}" stroke-opacity="0.22" stroke-width="3.2" />
          <ellipse cx="684" cy="438" rx="212" ry="148" stroke="${surface}" stroke-opacity="0.22" stroke-width="2.2" />
          <path d="M228 566C360 474 476 438 634 442C802 446 918 500 1042 606" stroke="${accent}" stroke-opacity="0.2" stroke-width="2.6" />
        `;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" fill="none">
      <defs>
        <linearGradient id="bg" x1="120" y1="80" x2="1080" y2="760" gradientUnits="userSpaceOnUse">
          <stop stop-color="${background}" />
          <stop offset="0.5" stop-color="${surface}" />
          <stop offset="1" stop-color="${accent}" />
        </linearGradient>
        <radialGradient id="glowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(904 220) rotate(118) scale(420 520)">
          <stop stop-color="${highlight}" stop-opacity="0.72" />
          <stop offset="1" stop-color="${highlight}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="glowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(266 708) rotate(45) scale(320 280)">
          <stop stop-color="${accent}" stop-opacity="0.26" />
          <stop offset="1" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
        <pattern id="grain" width="72" height="72" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="18" r="1.2" fill="${text}" fill-opacity="${grainOpacity}" />
          <circle cx="38" cy="34" r="1" fill="${text}" fill-opacity="${grainOpacity}" />
          <circle cx="58" cy="52" r="1.4" fill="${text}" fill-opacity="${grainOpacity}" />
          <circle cx="26" cy="58" r="0.9" fill="${text}" fill-opacity="${grainOpacity}" />
        </pattern>
        <linearGradient id="panel" x1="188" y1="126" x2="986" y2="744" gradientUnits="userSpaceOnUse">
          <stop stop-color="${highlight}" stop-opacity="${materialOpacity}" />
          <stop offset="1" stop-color="${surface}" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="80" fill="url(#bg)" />
      <rect width="1200" height="900" rx="80" fill="url(#grain)" />
      <ellipse cx="904" cy="220" rx="308" ry="246" fill="url(#glowA)" />
      <ellipse cx="250" cy="724" rx="240" ry="194" fill="url(#glowB)" />
      <rect x="82" y="82" width="1036" height="736" rx="58" fill="url(#panel)" stroke="${highlight}" stroke-opacity="0.18" stroke-width="2" />
      <path d="M132 690C248 632 376 598 524 602C712 608 842 664 1056 760" stroke="${text}" stroke-opacity="0.12" stroke-width="2" />
      ${sceneMarkup}
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const createPlaceholderVisualIdentity = (
  coverPalette: [string, string, string],
  seed: Omit<BlogVisualIdentity, "palette" | "accentLight"> & { accentLight?: Partial<BlogAccentLight> },
): BlogVisualIdentity => ({
  palette: {
    background: coverPalette[0],
    surface: coverPalette[1],
    accent: coverPalette[2],
    highlight: "#f8fafc",
    text: "#e2e8f0",
  },
  material: seed.material,
  grain: seed.grain,
  accentLight: {
    color: seed.accentLight?.color ?? coverPalette[1],
    x: seed.accentLight?.x ?? 78,
    y: seed.accentLight?.y ?? 24,
    blur: seed.accentLight?.blur ?? 180,
    opacity: seed.accentLight?.opacity ?? 0.34,
  },
  articleTheme: seed.articleTheme,
  sceneId: seed.sceneId,
});

const createPlaceholderPost = (
  input: Omit<BlogPostEntry, "coverImage" | "visualIdentity"> & {
    coverPalette: [string, string, string];
    visualIdentity: Omit<BlogVisualIdentity, "palette" | "accentLight"> & {
      accentLight?: Partial<BlogAccentLight>;
    };
  },
): BlogPostEntry => {
  const { coverPalette, visualIdentity: visualSeed, ...post } = input;
  const visualIdentity = createPlaceholderVisualIdentity(coverPalette, visualSeed);

  return defineBlogPost({
    ...post,
    visualIdentity,
    coverImage: {
      src: createBlogCoverSvg({
        palette: visualIdentity.palette,
        material: visualIdentity.material,
        sceneId: visualIdentity.sceneId,
        grain: visualIdentity.grain,
      }),
      alt: `${input.title} abstract placeholder cover artwork`,
    },
  });
};

// EDIT HERE: blog page copy and blog metadata.
export const blogPageContent: BlogPageContent = defineBlogPage({
  eyebrow: "John Surette",
  title: "Experiences, Experiments, and Ideas",
  summary:
    "My collection of refined thoughts and discoveries. I explore design, research, products, metaphysics and more, wherever my curiosity takes me.",
  emptyLabel: "No published posts yet.",
});

type ArticlePaletteId =
  | "consortia"
  | "signal-over-surface"
  | "mapping-the-middle-distance"
  | "field-notes-on-interface-rhythm";

interface ArticlePaletteSpec {
  family: string;
  coverPalette: [string, string, string];
  accentLightColor: string;
}

type ArticlePaletteSet = Record<ArticlePaletteId, ArticlePaletteSpec>;

const ARTICLE_PALETTE_PRESETS: Record<string, ArticlePaletteSet> = {
  bioluminescent: {
    consortia: {
      family: "bioluminescent meadow",
      coverPalette: ["#16a34a", "#22d3ee", "#2563eb"],
      accentLightColor: "#34d399",
    },
    "signal-over-surface": {
      family: "neon reef",
      coverPalette: ["#0891b2", "#e879f9", "#4f46e5"],
      accentLightColor: "#67e8f9",
    },
    "mapping-the-middle-distance": {
      family: "aurora bloom",
      coverPalette: ["#14b8a6", "#f97316", "#6366f1"],
      accentLightColor: "#fb7185",
    },
    "field-notes-on-interface-rhythm": {
      family: "signal canopy",
      coverPalette: ["#22c55e", "#f472b6", "#0ea5e9"],
      accentLightColor: "#e879f9",
    },
  },
  prismLab: {
    consortia: {
      family: "prism lab",
      coverPalette: ["#2563eb", "#34d399", "#f472b6"],
      accentLightColor: "#34d399",
    },
    "signal-over-surface": {
      family: "sunset terminal",
      coverPalette: ["#0ea5e9", "#f59e0b", "#8b5cf6"],
      accentLightColor: "#f59e0b",
    },
    "mapping-the-middle-distance": {
      family: "ion stream",
      coverPalette: ["#14b8a6", "#f97316", "#6366f1"],
      accentLightColor: "#f97316",
    },
    "field-notes-on-interface-rhythm": {
      family: "chromatic grove",
      coverPalette: ["#22d3ee", "#e879f9", "#84cc16"],
      accentLightColor: "#e879f9",
    },
  },
};

// Single-line theme switch for all article palettes.
const ACTIVE_ARTICLE_PALETTE_PRESET = "prismLab";

const articlePaletteSet = ARTICLE_PALETTE_PRESETS[ACTIVE_ARTICLE_PALETTE_PRESET] ?? ARTICLE_PALETTE_PRESETS.prismLab;
const articlePalette = (id: ArticlePaletteId): ArticlePaletteSpec => articlePaletteSet[id];

export const allBlogPosts: BlogPostEntry[] = [
  createPlaceholderPost({
    id: "consortia",
    slug: "consortia",
    title: "Can we Culture Uncurturable Microbes using synthetic Microbiomes?",
    tag: "Consortia",
    summary:
      "AI-Designed consortia recipes might be the key to enable the cultivation of previously unculturable microbes, unlocking new frontiers in microbiology and biotechnology.",
    hook: "A Heterogenous Graph Transformer for Consortia Design.",
    intro: [
      "Bacteria exist in functionally-linked, multispecies communities that develop emergent properties with implications for host health. However, they are studied under axenic (i.e., single-strain) culture conditions that cannot recapitulate the metabolic interdependence, cross-feeding, and competitive dynamics that define consortia; they serve as poor models for understanding native microbiota to benefit human and planetary health.",
      "In order to investigate diverse microbiota, the field needs a tool  capable of modelling community profiles to predict culture conditions that enrich a targeted consortium. We aim to start with the oral microbiome before moving to other niches.",
    ],
    articleSections: [
      {
        id: "why-this-blog",
        eyebrow: "Intent",
        title: "Why build the blog this way",
        paragraphs: [
          "The goal is not only to publish essays, but to make the archive itself feel exploratory. Newer work should feel close at hand, while older notes remain visible as part of a broader research trail.",
          "That is why this placeholder content is structured with hooks, intros, and sections. Each layer lets the homepage reveal more context without forcing a single monolithic card design.",
        ],
      },
      {
        id: "what-gets-recorded",
        eyebrow: "Workflow",
        title: "What belongs in a research note",
        paragraphs: [
          "Future entries will likely mix conceptual diagrams, implementation tradeoffs, literature takeaways, and engineering decisions made under real constraints.",
          "For now, the main purpose of this seeded article is to prove the route, typography, and layout system from collage preview through full reading mode.",
        ],
      },
      {
        id: "what-comes-next",
        eyebrow: "Next",
        title: "How the foundation can evolve",
        paragraphs: [
          "Once the baseline DOM and motion system feel solid, later passes can layer in more liquid transitions, subtle depth, and stronger visual differentiation between posts.",
          "Because the content structure is typed up front, those richer treatments can evolve without rewriting the article data model.",
        ],
      },
    ],
    dateLabel: "March 2026",
    publishedAt: "2026-03-20",
    status: "published",
    featured: true,
    visualIdentity: {
      material: "glass",
      grain: "soft",
      articleTheme: "essay",
      sceneId: "orbitalField",
      accentLight: { color: articlePalette("consortia").accentLightColor, x: 76, y: 18, blur: 220, opacity: 0.42 },
    },
    coverPalette: articlePalette("consortia").coverPalette,
  }),
  createPlaceholderPost({
    id: "signal-over-surface",
    slug: "signal-over-surface",
    title: "Signal Over Surface",
    tag: "Placeholder Essay",
    summary:
      "A seeded article about balancing visual experimentation with clarity, speed, and reading comfort across a portfolio-scale interface.",
    hook: "Design flourishes should feel earned by the story, not stapled on after the system is already overloaded.",
    intro: [
      "This placeholder note is a stand-in for a future piece on how expressive interfaces can stay legible under pressure. The underlying question is how to create a sense of atmosphere without compromising hierarchy, speed, or accessibility.",
      "For the blog specifically, that tension shows up in every card state. A layout can be glossy and motion-rich, but it still needs predictable reading order, clear interaction rules, and graceful mobile behavior.",
    ],
    articleSections: [
      {
        id: "performance-first",
        eyebrow: "Constraint",
        title: "Performance has to shape the visual language",
        paragraphs: [
          "The most persuasive animation systems are often the ones that know when to stay quiet. That is especially true on scroll-heavy pages where layout, blur, and depth can become expensive very quickly.",
          "This foundation keeps state-driven motion in the DOM layer so later visual experiments have a stable performance baseline to build from.",
        ],
      },
      {
        id: "reading-order",
        eyebrow: "Behavior",
        title: "Reading order still matters in a collage",
        paragraphs: [
          "Even when the layout feels spatial or playful, the content should still tell the reader where to look next. Chronological structure gives the collage a backbone so the motion can stay expressive without becoming arbitrary.",
          "The sidebar exists for the same reason: it gives the user a simple, low-friction map through the archive when the collage is feeling more atmospheric than utilitarian.",
        ],
      },
    ],
    dateLabel: "February 2026",
    publishedAt: "2026-02-11",
    status: "published",
    visualIdentity: {
      material: "mist",
      grain: "soft",
      articleTheme: "lab",
      sceneId: "signalGrid",
      accentLight: { color: articlePalette("signal-over-surface").accentLightColor, x: 82, y: 26, blur: 190, opacity: 0.3 },
    },
    coverPalette: articlePalette("signal-over-surface").coverPalette,
  }),
  createPlaceholderPost({
    id: "mapping-the-middle-distance",
    slug: "mapping-the-middle-distance",
    title: "Mapping The Middle Distance",
    tag: "Research Notes",
    summary:
      "A placeholder entry on bridging polished hero moments and practical reading interfaces without losing narrative continuity.",
    hook: "The hardest part of a portfolio is often the middle: not the first impression, and not the final detail, but the transition between them.",
    intro: [
      "This article draft explores how to design the in-between moments where users shift from browsing to committing attention. Those moments are where context, hierarchy, and pacing quietly determine whether the experience feels coherent.",
      "The current blog system uses layered sections and progressive disclosure to keep this middle distance legible. Future iterations can refine density and cadence while preserving a stable reading spine.",
    ],
    articleSections: [
      {
        id: "threshold-design",
        eyebrow: "Transition",
        title: "Designing for threshold moments",
        paragraphs: [
          "Users do not switch from overview to deep reading in a single click. They scan metadata, preview a thesis, and test whether the voice feels worth following. Interfaces should support that gradient instead of forcing abrupt jumps.",
          "Card expansion, visual continuity, and lightweight chronology rails can create confidence without requiring modal-heavy choreography.",
        ],
      },
      {
        id: "stack-consistency",
        eyebrow: "System",
        title: "Consistency across the full stack",
        paragraphs: [
          "Archive cards, hero features, and article views should share visual DNA while still expressing different density levels. Reusing layout IDs and palette semantics is one way to keep transitions believable.",
          "This avoids the common pitfall where each stage looks independently polished but disconnected from the rest of the reading flow.",
        ],
      },
      {
        id: "future-tuning",
        eyebrow: "Iteration",
        title: "What to tune next",
        paragraphs: [
          "Later passes can tighten typography scales, adjust spacing under extreme viewport sizes, and refine how reduced-motion behavior preserves clarity under constrained devices.",
          "The goal is not visual maximalism. It is steady comprehension with enough atmosphere to make exploration feel intentional.",
        ],
      },
    ],
    dateLabel: "November 2025",
    publishedAt: "2025-11-09",
    status: "published",
    visualIdentity: {
      material: "satin",
      grain: "paper",
      articleTheme: "lab",
      sceneId: "neuralBloom",
      accentLight: { color: articlePalette("mapping-the-middle-distance").accentLightColor, x: 68, y: 22, blur: 210, opacity: 0.32 },
    },
    coverPalette: articlePalette("mapping-the-middle-distance").coverPalette,
  }),
  createPlaceholderPost({
    id: "field-notes-on-interface-rhythm",
    slug: "field-notes-on-interface-rhythm",
    title: "Field Notes On Interface Rhythm",
    tag: "Lab Journal",
    summary:
      "An older placeholder journal entry on pacing visual complexity so interfaces remain readable over long sessions.",
    hook: "Rhythm is an information architecture tool, not just a motion principle.",
    intro: [
      "This entry captures observations from iterative interface studies where the same content was shown with different pacing models. Small changes in rhythm altered comprehension and perceived effort more than expected.",
      "The findings suggest that spacing, cadence, and contrast handoffs should be treated as first-class system constraints, especially in narrative-heavy pages.",
    ],
    articleSections: [
      {
        id: "cadence-baseline",
        eyebrow: "Cadence",
        title: "Build a baseline before adding flourish",
        paragraphs: [
          "Teams often jump to expressive visuals before stabilizing default reading cadence. A better sequence is to lock baseline rhythm first, then layer motion that reinforces rather than competes with content hierarchy.",
          "In practice, that means measured section spacing, predictable action placement, and restrained animation timing in dense text regions.",
        ],
      },
      {
        id: "contrast-handshake",
        eyebrow: "Contrast",
        title: "Treat contrast as a handshake between states",
        paragraphs: [
          "When layouts transition between cards, feature panels, and article bodies, contrast should not reset arbitrarily. Users track continuity partly through consistent luminance relationships.",
          "Theme-aware palette remapping helps keep those relationships stable across dark and light modes while preserving post identity.",
        ],
      },
      {
        id: "archive-longevity",
        eyebrow: "Longevity",
        title: "Design for archives, not just launch screens",
        paragraphs: [
          "A blog grows over time, so visual systems should anticipate older entries living alongside new work. Chronology needs to remain navigable even when cards vary in tone and topic.",
          "Well-structured placeholders help pressure-test this now, so future content can scale without forcing architecture rewrites.",
        ],
      },
    ],
    dateLabel: "July 2025",
    publishedAt: "2025-07-18",
    status: "published",
    visualIdentity: {
      material: "mist",
      grain: "soft",
      articleTheme: "essay",
      sceneId: "signalGrid",
      accentLight: { color: articlePalette("field-notes-on-interface-rhythm").accentLightColor, x: 80, y: 30, blur: 188, opacity: 0.28 },
    },
    coverPalette: articlePalette("field-notes-on-interface-rhythm").coverPalette,
  }),
];

export const blogPosts = [...allBlogPosts]
  .filter((post) => post.status === "published")
  .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));

export const getBlogPostBySlug = (slug: string): BlogPostEntry | undefined =>
  blogPosts.find((post) => post.slug === slug.trim());
