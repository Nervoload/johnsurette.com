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
  eyebrow: "Research Blog",
  title: "Research Notes",
  summary:
    "A scrollable field of essays, working notes, and experiments in computational neuroscience, machine learning systems, and engineering craft.",
  emptyLabel: "No published posts yet.",
});

export const allBlogPosts: BlogPostEntry[] = [
  createPlaceholderPost({
    id: "latent-lab-notes",
    slug: "latent-lab-notes",
    title: "Latent Lab Notes",
    tag: "Placeholder Essay",
    summary:
      "A draft frame for how I want to document the overlap between exploratory research, software tooling, and weekly note-taking rhythms.",
    hook: "This placeholder essay tests how a long-form article can feel both rigorous and cinematic before the real writing is ready.",
    intro: [
      "This placeholder article stands in for a future note about how research fragments become durable narratives. I want the blog to support half-formed models, technical reflections, and higher-level synthesis without forcing everything into a finished-paper voice from the start.",
      "In practice that means the article page has to handle both dense argument and gentle orientation. The collage preview, meanwhile, should suggest enough texture that each note feels alive before it is opened.",
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
  createPlaceholderPost({
    id: "memory-as-interface",
    slug: "memory-as-interface",
    title: "Memory As Interface",
    tag: "Placeholder Essay",
    summary:
      "A placeholder exploration of how archives, timelines, and notebooks can share one interaction grammar while still serving different kinds of recall.",
    hook: "A good archive should let you remember where an idea came from before it asks you to understand everything about it.",
    intro: [
      "This seeded article is a future-facing note about memory structures in personal sites and research tooling. Some interfaces are optimized for discovery, others for retrieval, and the interesting work often sits in between.",
      "The blog collage leans into that in-between space by letting posts move between low-detail recall objects and high-detail reading invitations.",
    ],
    articleSections: [
      {
        id: "archive-shapes",
        eyebrow: "Archive",
        title: "Different shapes of memory",
        paragraphs: [
          "Timelines, card stacks, and article feeds each imply a different mental model. Timelines suggest continuity, decks suggest comparison, and essays suggest immersion.",
          "One long-term goal for the site is to let those models echo each other without collapsing them into the same component.",
        ],
      },
      {
        id: "progressive-disclosure",
        eyebrow: "Disclosure",
        title: "Progressive disclosure as a narrative tool",
        paragraphs: [
          "The four blog card states are a useful example of progressive disclosure with emotional texture. Each reveal adds context, but none of them should feel like a hard mode switch.",
          "That is why smooth resizing, consistent metadata, and a stable call-to-action matter even in a placeholder pass like this one.",
        ],
      },
    ],
    dateLabel: "January 2026",
    publishedAt: "2026-01-14",
    status: "published",
    visualIdentity: {
      material: "satin",
      grain: "paper",
      articleTheme: "essay",
      sceneId: "neuralBloom",
      accentLight: { x: 28, y: 34, blur: 164, opacity: 0.28 },
    },
    coverPalette: ["#67e8f9", "#fde68a", "#0f172a"],
  }),
  createPlaceholderPost({
    id: "notes-toward-a-lab-log",
    slug: "notes-toward-a-lab-log",
    title: "Notes Toward A Lab Log",
    tag: "Placeholder Essay",
    summary:
      "A final placeholder post describing how quick observations, implementation snapshots, and article drafts might eventually connect inside the research blog.",
    hook: "Small observations become much more valuable once they have a stable place to accumulate.",
    intro: [
      "This placeholder entry stands in for shorter-form writing: build logs, literature reactions, and compact records of what changed in a research or engineering workflow from week to week.",
      "Even though the blog is launching with essay-scale placeholders, the infrastructure should already be capable of supporting smaller notes and mixed cadences later.",
    ],
    articleSections: [
      {
        id: "cadence",
        eyebrow: "Cadence",
        title: "Writing with different tempos",
        paragraphs: [
          "Not every post needs the same density or polish. Some pieces will probably arrive as slower, reflective essays, while others may be rapid notes attached to an experiment or build.",
          "Typed content and reusable article sections make it easier to support both rhythms without redesigning the system every time.",
        ],
      },
      {
        id: "future-extensions",
        eyebrow: "Future",
        title: "Where richer media can plug in later",
        paragraphs: [
          "A later pass could introduce pull quotes, figures, embedded demos, or richer media frames. The important thing in this foundation is that the article page and preview cards already have clean boundaries.",
          "That way future visual upgrades can focus on expression instead of untangling data, routes, and interaction rules.",
        ],
      },
    ],
    dateLabel: "December 2025",
    publishedAt: "2025-12-04",
    status: "published",
    visualIdentity: {
      material: "glass",
      grain: "paper",
      articleTheme: "field-notes",
      sceneId: "orbitalField",
      accentLight: { x: 68, y: 22, blur: 176, opacity: 0.33 },
    },
    coverPalette: ["#818cf8", "#bfdbfe", "#334155"],
  }),
  createPlaceholderPost({
    id: "threshold-signal",
    slug: "threshold-signal",
    title: "Threshold Signal",
    tag: "Placeholder Essay",
    summary:
      "A placeholder article about deciding when a note should remain a sketch and when it should become a fully surfaced reading experience.",
    hook: "Sometimes the most useful threshold is the one that lets a rough idea stay rough for a little longer.",
    intro: [
      "This seeded piece is here to test how the blog handles the boundary between a quick observation and a more durable essay. The collage should feel light enough to skim, but the article page should still reward opening the note when the idea needs more room.",
      "That tension is useful because it mirrors the real editorial problem: not every thought deserves the same visual weight, even when every thought deserves a place in the archive.",
    ],
    articleSections: [
      {
        id: "thresholds",
        eyebrow: "Signal",
        title: "When a sketch starts to matter",
        paragraphs: [
          "A good archive needs a way to say, 'This is still in motion.' Placeholder content gives the system a chance to practice that distinction without pretending the writing is already final.",
          "The collage state machine should keep this feeling legible by reserving the most prominent treatment for the newest post while still leaving room for everything else to breathe.",
        ],
      },
      {
        id: "weight",
        eyebrow: "Scale",
        title: "Visual weight should track editorial weight",
        paragraphs: [
          "Cards that are only partially formed can still look intentional if the spacing, image treatment, and motion language stay consistent.",
          "That consistency matters here because the research blog is meant to grow into a real writing surface, not just a placeholder grid with decorative copy.",
        ],
      },
    ],
    dateLabel: "November 2025",
    publishedAt: "2025-11-18",
    status: "published",
    visualIdentity: {
      material: "mist",
      grain: "soft",
      articleTheme: "essay",
      sceneId: "signalGrid",
      accentLight: { x: 78, y: 18, blur: 188, opacity: 0.32 },
    },
    coverPalette: ["#f472b6", "#67e8f9", "#1e293b"],
  }),
  createPlaceholderPost({
    id: "paper-trail-systems",
    slug: "paper-trail-systems",
    title: "Paper Trail Systems",
    tag: "Placeholder Essay",
    summary:
      "A seeded note on how research breadcrumbs, references, and working drafts might eventually become a navigable memory system.",
    hook: "An archive becomes useful when it stops acting like storage and starts acting like a trail.",
    intro: [
      "This placeholder essay imagines the blog as a trail of linked observations rather than a flat list of posts. The article copy is intentionally modest, but the structure is a stand-in for richer essay bodies later.",
      "The point of the system is not to make every entry the same. It is to make every entry easy to find, easy to scan, and easy to return to when the ideas start connecting.",
    ],
    articleSections: [
      {
        id: "breadcrumbs",
        eyebrow: "Archive",
        title: "Breadcrumbs that stay readable",
        paragraphs: [
          "A trail of notes only works if each note has enough identity to be recognized at a glance. That is part of what the blog collage is practicing with these seeded posts.",
          "The article route then gives each breadcrumb a place to expand without losing the sense that it belongs to a larger sequence.",
        ],
      },
      {
        id: "retrieval",
        eyebrow: "Retrieval",
        title: "Finding old ideas quickly",
        paragraphs: [
          "If the archive is going to be useful during real work, the retrieval path needs to be obvious. That is why the sidebar and route structure both matter here.",
          "These placeholder posts are mostly a way to make sure that eventual retrieval feels fluid instead of feeling bolted onto the page later.",
        ],
      },
    ],
    dateLabel: "October 2025",
    publishedAt: "2025-10-23",
    status: "published",
    visualIdentity: {
      material: "satin",
      grain: "paper",
      articleTheme: "lab",
      sceneId: "orbitalField",
      accentLight: { x: 70, y: 28, blur: 172, opacity: 0.31 },
    },
    coverPalette: ["#22d3ee", "#fda4af", "#0f172a"],
  }),
  createPlaceholderPost({
    id: "noisy-archive",
    slug: "noisy-archive",
    title: "Noisy Archive",
    tag: "Placeholder Essay",
    summary:
      "A placeholder article for testing how the blog handles a more cluttered thought process while keeping the UI calm and readable.",
    hook: "A noisy archive is still valuable if the interface knows how to lower the volume around it.",
    intro: [
      "This note stands in for a future essay about uncertainty, false starts, and the kind of research logging that contains more questions than conclusions. The blog needs to support that style without making the page feel messy.",
      "For that reason, the article is structured in a way that lets the reader settle in quickly even when the content itself is intentionally provisional.",
    ],
    articleSections: [
      {
        id: "signal-to-noise",
        eyebrow: "Clarity",
        title: "Separating signal from the surrounding noise",
        paragraphs: [
          "Editorial clarity is not the same thing as simplicity. A note can hold ambiguity and still present itself cleanly.",
          "The collage is meant to carry that idea visually: a noisy archive can still have a calm surface if the spacing and hierarchy are stable.",
        ],
      },
      {
        id: "provisional",
        eyebrow: "Draft",
        title: "Provisional notes deserve a stable home",
        paragraphs: [
          "There is real value in writing down ideas before they feel complete. This placeholder article exists to keep that kind of writing visible in the system.",
          "Future posts can be much more specific, but this scaffolding needs to be comfortable enough for imperfect thinking from day one.",
        ],
      },
    ],
    dateLabel: "September 2025",
    publishedAt: "2025-09-29",
    status: "published",
    visualIdentity: {
      material: "mist",
      grain: "paper",
      articleTheme: "field-notes",
      sceneId: "neuralBloom",
      accentLight: { x: 24, y: 26, blur: 178, opacity: 0.29 },
    },
    coverPalette: ["#f59e0b", "#60a5fa", "#1f2937"],
  }),
  createPlaceholderPost({
    id: "model-notes",
    slug: "model-notes",
    title: "Model Notes",
    tag: "Placeholder Essay",
    summary:
      "A seeded article about how to keep working model sketches visible without letting them crowd out finished thinking.",
    hook: "Model notes are most useful when they are visible enough to revisit and small enough not to dominate the archive.",
    intro: [
      "This placeholder essay is a stand-in for future writing about conceptual models, working diagrams, and the not-quite-ready frameworks that often sit between research and implementation.",
      "It is intentionally plain so the layout can do the heavy lifting while the content remains obviously provisional.",
    ],
    articleSections: [
      {
        id: "sketches",
        eyebrow: "Notes",
        title: "Keeping sketches close without overcommitting to them",
        paragraphs: [
          "A model note should be easy to browse because it may change as understanding changes. The blog's progressive disclosure gives us a place to make that visible.",
          "The article page can feel more complete, but the text itself is still obviously a working draft by design.",
        ],
      },
      {
        id: "evolution",
        eyebrow: "Change",
        title: "Why models need room to evolve",
        paragraphs: [
          "The most valuable parts of a working model often arrive after the first pass. Preserving the earlier version can make later refinements easier to understand.",
          "That is why these placeholder entries are structured as full posts instead of terse cards with no body at all.",
        ],
      },
    ],
    dateLabel: "August 2025",
    publishedAt: "2025-08-19",
    status: "published",
    visualIdentity: {
      material: "glass",
      grain: "soft",
      articleTheme: "lab",
      sceneId: "signalGrid",
      accentLight: { x: 74, y: 24, blur: 184, opacity: 0.32 },
    },
    coverPalette: ["#34d399", "#c084fc", "#0f172a"],
  }),
  createPlaceholderPost({
    id: "quiet-prototypes",
    slug: "quiet-prototypes",
    title: "Quiet Prototypes",
    tag: "Placeholder Essay",
    summary:
      "A placeholder note about low-noise experimentation, subtle iteration, and how prototypes can stay emotionally calm while still being technically ambitious.",
    hook: "A quiet prototype can still be a very serious prototype.",
    intro: [
      "This seeded article is here to keep the archive from feeling too loud too soon. Some experiments should announce themselves, but others work best when they feel understated and careful.",
      "That same idea applies to the blog cards: the most important post can be visually dominant without the rest of the page turning into visual static.",
    ],
    articleSections: [
      {
        id: "calm",
        eyebrow: "Tone",
        title: "A quieter kind of experimentation",
        paragraphs: [
          "Not every prototype needs to feel playful or chaotic. Some of the most useful ones are the ones that quietly demonstrate the rule they are testing.",
          "The blog layout should give those notes enough room to speak without asking them to become a spectacle.",
        ],
      },
      {
        id: "discipline",
        eyebrow: "Craft",
        title: "Discipline is part of the aesthetic",
        paragraphs: [
          "A restrained prototype is still a prototype with ambition. It just expresses that ambition through clarity rather than volume.",
          "This placeholder article exists to make sure that future writing can inhabit that mode without any special-case layout work.",
        ],
      },
    ],
    dateLabel: "July 2025",
    publishedAt: "2025-07-15",
    status: "published",
    visualIdentity: {
      material: "satin",
      grain: "soft",
      articleTheme: "essay",
      sceneId: "orbitalField",
      accentLight: { x: 64, y: 20, blur: 168, opacity: 0.3 },
    },
    coverPalette: ["#14b8a6", "#fda4af", "#1e293b"],
  }),
  createPlaceholderPost({
    id: "context-shifting",
    slug: "context-shifting",
    title: "Context Shifting",
    tag: "Placeholder Essay",
    summary:
      "A seeded essay on how to move between different scales of thinking without making the reading experience feel abrupt.",
    hook: "Good context switching feels like a gradual change in focus rather than a hard reset.",
    intro: [
      "This placeholder essay stands in for writing about moving between technical detail, conceptual framing, and the broader narrative around a project. The article page should support that shift without breaking rhythm.",
      "The collage and sidebar are useful practice for that because they make the archive feel spatial while still preserving chronological structure.",
    ],
    articleSections: [
      {
        id: "scale",
        eyebrow: "Scale",
        title: "Thinking at the right scale",
        paragraphs: [
          "The most useful note is often the one that helps you shift scales quickly. A title, a hook, and a section outline can be enough to orient a returning reader.",
          "The expanded card state should mirror that by showing just enough context to feel complete before the article page takes over.",
        ],
      },
      {
        id: "continuity",
        eyebrow: "Flow",
        title: "Keeping transitions continuous",
        paragraphs: [
          "When the archive changes scale, the motion should feel continuous rather than arbitrary. That is a strong fit for future liquid-glass or bouncy treatments.",
          "For now, this seeded note ensures the content stack is ready for those later transitions.",
        ],
      },
    ],
    dateLabel: "June 2025",
    publishedAt: "2025-06-20",
    status: "published",
    visualIdentity: {
      material: "glass",
      grain: "paper",
      articleTheme: "lab",
      sceneId: "neuralBloom",
      accentLight: { x: 80, y: 18, blur: 194, opacity: 0.34 },
    },
    coverPalette: ["#38bdf8", "#fde68a", "#1f2937"],
  }),
  createPlaceholderPost({
    id: "pattern-drift",
    slug: "pattern-drift",
    title: "Pattern Drift",
    tag: "Placeholder Essay",
    summary:
      "A placeholder article about how recurring ideas change shape over time and how the archive should preserve that drift.",
    hook: "Patterns are rarely lost; they just drift until you notice them in a new form.",
    intro: [
      "This seeded article is meant to hold a thought about repetition, variation, and the way recurring themes slowly mutate across a body of notes.",
      "The archive benefits from that kind of drift as long as the interface keeps the posts legible enough to compare side by side.",
    ],
    articleSections: [
      {
        id: "recurrence",
        eyebrow: "Pattern",
        title: "Why repetition matters",
        paragraphs: [
          "Recurrence gives a personal research archive a sense of continuity. It is often how an idea proves that it deserves another pass.",
          "The blog collage can surface that continuity through consistent structure even as the visual treatments vary from post to post.",
        ],
      },
      {
        id: "variation",
        eyebrow: "Variation",
        title: "Letting the same idea evolve",
        paragraphs: [
          "Variation is what keeps a pattern alive. A post can revisit familiar territory and still contribute something new to the archive.",
          "This placeholder entry exists so the content layer can practice that kind of controlled drift before the real articles arrive.",
        ],
      },
    ],
    dateLabel: "May 2025",
    publishedAt: "2025-05-14",
    status: "published",
    visualIdentity: {
      material: "mist",
      grain: "paper",
      articleTheme: "essay",
      sceneId: "orbitalField",
      accentLight: { x: 72, y: 30, blur: 170, opacity: 0.28 },
    },
    coverPalette: ["#a78bfa", "#f97316", "#0f172a"],
  }),
  createPlaceholderPost({
    id: "interface-latency",
    slug: "interface-latency",
    title: "Interface Latency",
    tag: "Placeholder Essay",
    summary:
      "A seeded note about the small delay between intent, interaction, and interpretation in a richly animated interface.",
    hook: "Latency is not just a performance problem; it is also a feeling problem.",
    intro: [
      "This placeholder post exists to think through the emotional part of UI latency. Even when a page is technically fast, the interaction can still feel heavy if the transitions do not line up with user intent.",
      "The blog system can use this entry to validate that future motion stays smooth and responsive without becoming visually abrupt.",
    ],
    articleSections: [
      {
        id: "perception",
        eyebrow: "Feeling",
        title: "How latency changes the way a page feels",
        paragraphs: [
          "Interaction latency is often noticed before it is measured. A slow-feeling transition can make a page seem less trustworthy even when the actual delay is small.",
          "That is why the blog foundation tries to keep motion layers predictable and low-cost.",
        ],
      },
      {
        id: "response",
        eyebrow: "Response",
        title: "Fast enough to feel alive",
        paragraphs: [
          "The goal is not to eliminate all delay. It is to make the delay feel intentional and aligned with the action the user just took.",
          "This placeholder article helps keep that requirement visible while the collage evolves.",
        ],
      },
    ],
    dateLabel: "April 2025",
    publishedAt: "2025-04-09",
    status: "published",
    visualIdentity: {
      material: "glass",
      grain: "soft",
      articleTheme: "lab",
      sceneId: "signalGrid",
      accentLight: { x: 84, y: 20, blur: 180, opacity: 0.33 },
    },
    coverPalette: ["#fb7185", "#60a5fa", "#1f2937"],
  }),
  createPlaceholderPost({
    id: "rough-drafts",
    slug: "rough-drafts",
    title: "Rough Drafts",
    tag: "Placeholder Essay",
    summary:
      "A placeholder article about embracing unfinished writing as a legitimate part of the archive instead of hiding it away.",
    hook: "A rough draft can be a finished artifact if the system knows how to present it honestly.",
    intro: [
      "This seeded essay keeps space for unfinished thinking. It is intentionally blunt in places so the archive can prove it supports writing that is still being shaped.",
      "A blog like this should not force every note to sound polished. Sometimes the useful thing is simply a well-placed first pass.",
    ],
    articleSections: [
      {
        id: "honesty",
        eyebrow: "Drafting",
        title: "Being honest about what is unfinished",
        paragraphs: [
          "There is value in letting a draft remain visibly in draft form for a while. That honesty can make the eventual final version stronger.",
          "The collage preview and article page can both carry that attitude without making the experience feel incomplete.",
        ],
      },
      {
        id: "progress",
        eyebrow: "Progress",
        title: "Progress that stays visible",
        paragraphs: [
          "The archive should help show what has changed, not just what is finished. That is why a stable article route is useful even for placeholder entries.",
          "The infrastructure can grow into more sophisticated publishing later, but this is enough to get started cleanly.",
        ],
      },
    ],
    dateLabel: "March 2025",
    publishedAt: "2025-03-11",
    status: "published",
    visualIdentity: {
      material: "satin",
      grain: "paper",
      articleTheme: "field-notes",
      sceneId: "neuralBloom",
      accentLight: { x: 30, y: 26, blur: 172, opacity: 0.3 },
    },
    coverPalette: ["#f472b6", "#facc15", "#1f2937"],
  }),
  createPlaceholderPost({
    id: "field-notebook",
    slug: "field-notebook",
    title: "Field Notebook",
    tag: "Placeholder Essay",
    summary:
      "A seeded final placeholder about treating the archive as a field notebook that can hold observations, questions, and future directions.",
    hook: "A field notebook is valuable because it keeps the next question within reach.",
    intro: [
      "This placeholder entry closes the current seeded archive with a simple idea: the blog should feel like a working notebook, not a finished museum of answers.",
      "That keeps room for discoveries, revisions, and the kind of notes that only make sense once they sit beside other notes.",
    ],
    articleSections: [
      {
        id: "questions",
        eyebrow: "Inquiry",
        title: "Keeping questions as first-class content",
        paragraphs: [
          "A notebook that only stores conclusions becomes less useful over time. Questions are often the more important thing to preserve.",
          "This seeded article is meant to remind the interface to make room for those questions alongside the more polished writing.",
        ],
      },
      {
        id: "archive-future",
        eyebrow: "Future",
        title: "Where the archive can go next",
        paragraphs: [
          "Later passes can bring in richer media, citations, and more specific article formatting.",
          "For now, this note gives the blog a strong enough base to keep building the archive without changing the core schema again.",
        ],
      },
    ],
    dateLabel: "February 2025",
    publishedAt: "2025-02-06",
    status: "published",
    visualIdentity: {
      material: "mist",
      grain: "soft",
      articleTheme: "field-notes",
      sceneId: "orbitalField",
      accentLight: { x: 66, y: 24, blur: 166, opacity: 0.29 },
    },
    coverPalette: ["#22c55e", "#38bdf8", "#0f172a"],
  }),
];

export const blogPosts = [...allBlogPosts]
  .filter((post) => post.status === "published")
  .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));

export const getBlogPostBySlug = (slug: string): BlogPostEntry | undefined =>
  blogPosts.find((post) => post.slug === slug.trim());
