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
      accentLight: { x: 76, y: 18, blur: 220, opacity: 0.42 },
    },
    coverPalette: ["#c084fc", "#a5f3fc", "#334155"],
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
      accentLight: { x: 82, y: 26, blur: 190, opacity: 0.3 },
    },
    coverPalette: ["#38bdf8", "#f0abfc", "#1e293b"],
  }),
];

export const blogPosts = [...allBlogPosts]
  .filter((post) => post.status === "published")
  .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));

export const getBlogPostBySlug = (slug: string): BlogPostEntry | undefined =>
  blogPosts.find((post) => post.slug === slug.trim());
