const trim = (value: string) => value.trim();

const normalizeStringArray = (value?: string[]) => (value ?? []).map((item) => item.trim()).filter(Boolean);

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`[aboutStory] ${message}`);
  }
};

export type AboutStoryNodeType =
  | "landing"
  | "introPortrait"
  | "globeTravel"
  | "layeredGallery"
  | "decisionBranch"
  | "cityScene"
  | "presentSummary"
  | "futureVision";

export type AboutStoryUnloadStrategy = "keep-warm" | "dispose";

export interface AboutCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface AboutCameraRail {
  start: AboutCameraPose;
  end: AboutCameraPose;
}

export interface AboutBranchOption {
  id: string;
  label: string;
  targetNodeId: string;
  previewTitle: string;
  previewSummary: string;
}

export interface AboutLandingOrbitToken {
  id: string;
  color: string;
  radius: number;
  polar: number;
  size: number;
  speed: number;
}

export interface AboutLandingSceneProps {
  accentColors: string[];
  orbitTokens: AboutLandingOrbitToken[];
  camera: AboutCameraRail;
}

export interface AboutTravelLocation {
  label: string;
  latitude: number;
  longitude: number;
  accent: string;
}

export interface AboutGlobeTravelSceneProps {
  origin: AboutTravelLocation;
  destination: AboutTravelLocation;
  routeColor: string;
  atmosphereColor: string;
  cityGlowColor: string;
  camera: {
    start: AboutCameraPose;
    focus: AboutCameraPose;
    arrival: AboutCameraPose;
  };
}

export type AboutLayeredGalleryDepth = "background" | "midground" | "foreground";

export interface AboutLayeredGalleryItem {
  id: string;
  title: string;
  caption: string;
  depth: AboutLayeredGalleryDepth;
  basePosition: [number, number, number];
  size: [number, number];
  gradient: [string, string];
  accent: string;
  entryProgress: number;
  travelDepth: number;
  parallax: number;
}

export interface AboutLayeredGallerySceneProps {
  galleryTitle: string;
  backgroundGradient: [string, string];
  ambientColor: string;
  camera: AboutCameraRail;
  items: AboutLayeredGalleryItem[];
}

export interface AboutIntroPortraitSceneProps {
  layout: "video-panel" | "portrait-panel";
  placeholderLabel: string;
  camera: AboutCameraRail;
}

export interface AboutDecisionBranchThought {
  id: string;
  label: string;
  previewTitle: string;
  tint: string;
  anchor: [number, number, number];
}

export interface AboutDecisionBranchSceneProps {
  portraitLabel: string;
  camera: AboutCameraRail;
  thoughts: AboutDecisionBranchThought[];
}

export interface AboutAbstractSceneProps {
  accent: string;
  motif: string;
  camera: AboutCameraRail;
}

interface AboutStoryNodeBase<T extends AboutStoryNodeType, P> {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
  type: T;
  yearLabel?: string;
  parentId?: string | null;
  nextIds: string[];
  branchLabel?: string;
  branchOptions?: AboutBranchOption[];
  timelineLabel: string;
  preload: string[];
  unloadStrategy: AboutStoryUnloadStrategy;
  transitionIn?: string;
  transitionOut?: string;
  scrollWeight: number;
  entryPct: number;
  holdPct: number;
  exitPct: number;
  sceneProps: P;
}

export type AboutStoryNode =
  | AboutStoryNodeBase<"landing", AboutLandingSceneProps>
  | AboutStoryNodeBase<"introPortrait", AboutIntroPortraitSceneProps>
  | AboutStoryNodeBase<"globeTravel", AboutGlobeTravelSceneProps>
  | AboutStoryNodeBase<"layeredGallery", AboutLayeredGallerySceneProps>
  | AboutStoryNodeBase<"decisionBranch", AboutDecisionBranchSceneProps>
  | AboutStoryNodeBase<"cityScene", AboutAbstractSceneProps>
  | AboutStoryNodeBase<"presentSummary", AboutAbstractSceneProps>
  | AboutStoryNodeBase<"futureVision", AboutAbstractSceneProps>;

const defineAboutStoryNode = <T extends AboutStoryNode>(input: T): T => {
  return {
    ...input,
    id: trim(input.id),
    title: trim(input.title),
    eyebrow: trim(input.eyebrow),
    summary: trim(input.summary),
    yearLabel: input.yearLabel?.trim(),
    parentId: input.parentId === undefined ? undefined : input.parentId === null ? null : trim(input.parentId),
    nextIds: normalizeStringArray(input.nextIds),
    highlights: normalizeStringArray(input.highlights),
    timelineLabel: trim(input.timelineLabel),
    branchLabel: input.branchLabel?.trim(),
    preload: normalizeStringArray(input.preload),
    transitionIn: input.transitionIn?.trim(),
    transitionOut: input.transitionOut?.trim(),
    branchOptions: (input.branchOptions ?? []).map((option) => ({
      id: trim(option.id),
      label: trim(option.label),
      targetNodeId: trim(option.targetNodeId),
      previewTitle: trim(option.previewTitle),
      previewSummary: trim(option.previewSummary),
    })),
  };
};

export const aboutStoryNodes: AboutStoryNode[] = [
  defineAboutStoryNode({
    id: "start",
    title: "A concise story of how I got here.",
    eyebrow: "About",
    summary:
      "A cinematic, scroll-driven walkthrough of the places, decisions, and moments that shaped the way I think and build.",
    highlights: [
      "Philippines to Ottawa",
      "Researcher-builder mindset",
      "3D story engine ready for future chapters",
    ],
    type: "landing",
    yearLabel: "Overview",
    parentId: null,
    nextIds: ["birthMigration"],
    timelineLabel: "Start",
    preload: ["about/globe", "about/childhood-gallery"],
    unloadStrategy: "keep-warm",
    transitionOut: "timeline-dock",
    scrollWeight: 0.96,
    entryPct: 0.18,
    holdPct: 0.58,
    exitPct: 0.24,
    sceneProps: {
      accentColors: ["#7dd3fc", "#c084fc", "#f59e0b"],
      orbitTokens: [
        { id: "token-ph", color: "#7dd3fc", radius: 2.4, polar: 0.16, size: 0.13, speed: 0.24 },
        { id: "token-ca", color: "#f59e0b", radius: 1.72, polar: -0.18, size: 0.11, speed: -0.34 },
        { id: "token-ai", color: "#c084fc", radius: 2.88, polar: 0.32, size: 0.09, speed: 0.19 },
      ],
      camera: {
        start: {
          position: [0.2, 0.28, 6.6],
          target: [0, 0.04, 0],
          fov: 40,
        },
        end: {
          position: [0.42, 0.14, 6.1],
          target: [0.08, 0.02, 0],
          fov: 36,
        },
      },
    },
  }),
  defineAboutStoryNode({
    id: "birthMigration",
    title: "Born in the Philippines, then carried toward Ottawa.",
    eyebrow: "2003",
    summary:
      "This chapter moves from a global view to a personal route: birthplace, migration, and the city that became home.",
    highlights: ["Birth in the Philippines", "Family relocation", "Ottawa arrival"],
    type: "globeTravel",
    yearLabel: "2003",
    parentId: null,
    nextIds: ["childhood"],
    timelineLabel: "Birth",
    preload: ["about/globe", "about/air-route", "about/ottawa-glow"],
    unloadStrategy: "dispose",
    transitionIn: "earth-zoom",
    transitionOut: "arrival-handoff",
    scrollWeight: 1.28,
    entryPct: 0.16,
    holdPct: 0.56,
    exitPct: 0.28,
    sceneProps: {
      origin: {
        label: "Philippines",
        latitude: 13.41,
        longitude: 122.56,
        accent: "#38bdf8",
      },
      destination: {
        label: "Ottawa, Canada",
        latitude: 45.4215,
        longitude: -75.6972,
        accent: "#f59e0b",
      },
      routeColor: "#7dd3fc",
      atmosphereColor: "#dbeafe",
      cityGlowColor: "#f59e0b",
      camera: {
        start: {
          position: [0.12, 0.32, 6.4],
          target: [0, 0.02, 0],
          fov: 35,
        },
        focus: {
          position: [1.18, 0.28, 4.2],
          target: [0.72, 0.04, 0],
          fov: 29,
        },
        arrival: {
          position: [1.64, 0.18, 3.12],
          target: [1.16, -0.06, 0],
          fov: 23,
        },
      },
    },
  }),
  defineAboutStoryNode({
    id: "childhood",
    title: "Childhood becomes a stack of memories moving in depth.",
    eyebrow: "2000s",
    summary:
      "Instead of a flat reel, childhood is treated like a moving pop-out memory wall: layered images, moments surfacing, and a sense of momentum.",
    highlights: ["Layered memories", "Playful motion", "Pop-out-book depth"],
    type: "layeredGallery",
    yearLabel: "2000s",
    parentId: null,
    nextIds: ["highSchoolDecisionPrototype"],
    timelineLabel: "Childhood",
    preload: ["about/childhood-gallery", "about/paper-cutouts"],
    unloadStrategy: "dispose",
    transitionIn: "gallery-unfold",
    transitionOut: "gallery-fade",
    scrollWeight: 1.36,
    entryPct: 0.14,
    holdPct: 0.62,
    exitPct: 0.24,
    sceneProps: {
      galleryTitle: "Childhood highlights",
      backgroundGradient: ["#dbeafe", "#eff6ff"],
      ambientColor: "#7dd3fc",
      camera: {
        start: {
          position: [0, 0.16, 7.24],
          target: [0, 0.04, 0],
          fov: 34,
        },
        end: {
          position: [0.18, 0.08, 6.18],
          target: [0.12, 0.02, 0],
          fov: 31,
        },
      },
      items: [
        {
          id: "memory-family",
          title: "Family",
          caption: "A grounding layer beneath everything else.",
          depth: "background",
          basePosition: [-1.32, 0.26, -1.8],
          size: [2.2, 1.42],
          gradient: ["#bfdbfe", "#e0f2fe"],
          accent: "#38bdf8",
          entryProgress: 0.06,
          travelDepth: 2.1,
          parallax: 0.18,
        },
        {
          id: "memory-curiosity",
          title: "Curiosity",
          caption: "Experiments, questions, and little obsessions.",
          depth: "midground",
          basePosition: [1.06, 0.42, -0.88],
          size: [1.56, 1.06],
          gradient: ["#fde68a", "#fef3c7"],
          accent: "#f59e0b",
          entryProgress: 0.2,
          travelDepth: 2.84,
          parallax: 0.24,
        },
        {
          id: "memory-music",
          title: "Music",
          caption: "Creative energy beginning to surface.",
          depth: "foreground",
          basePosition: [-0.24, -0.28, 0.16],
          size: [1.32, 1.78],
          gradient: ["#ddd6fe", "#ede9fe"],
          accent: "#a855f7",
          entryProgress: 0.4,
          travelDepth: 3.6,
          parallax: 0.32,
        },
        {
          id: "memory-play",
          title: "Play",
          caption: "Motion, rhythm, and a sense of momentum.",
          depth: "foreground",
          basePosition: [1.44, -0.14, 0.34],
          size: [1.18, 1.46],
          gradient: ["#bae6fd", "#cffafe"],
          accent: "#06b6d4",
          entryProgress: 0.58,
          travelDepth: 3.92,
          parallax: 0.36,
        },
      ],
    },
  }),
  defineAboutStoryNode({
    id: "introPortraitPrototype",
    title: "Introduction portrait",
    eyebrow: "Prototype",
    summary: "Framework-only placeholder for a future headshot or video panel scene.",
    highlights: ["Dormant scene template"],
    type: "introPortrait",
    yearLabel: "Prototype",
    parentId: "start",
    nextIds: ["birthMigration"],
    timelineLabel: "Intro",
    preload: ["about/portrait-panel"],
    unloadStrategy: "dispose",
    transitionIn: "portrait-reveal",
    transitionOut: "portrait-fade",
    scrollWeight: 1,
    entryPct: 0.2,
    holdPct: 0.56,
    exitPct: 0.24,
    sceneProps: {
      layout: "video-panel",
      placeholderLabel: "Headshot / video panel placeholder",
      camera: {
        start: {
          position: [0.18, 0.18, 5.8],
          target: [0, 0, 0],
          fov: 35,
        },
        end: {
          position: [0.36, 0.08, 5.2],
          target: [0.12, 0, 0],
          fov: 31,
        },
      },
    },
  }),
  defineAboutStoryNode({
    id: "highSchoolDecisionPrototype",
    title: "High school paths",
    eyebrow: "Prototype",
    summary: "Dormant branch node for future career-path exploration.",
    highlights: ["Decision branch skeleton"],
    type: "decisionBranch",
    yearLabel: "Prototype",
    parentId: "childhood",
    nextIds: ["highSchoolSoftwarePrototype", "highSchoolMedicalPrototype", "highSchoolEntertainmentPrototype"],
    branchLabel: "Explore the paths",
    branchOptions: [
      {
        id: "branch-software",
        label: "Software engineering",
        targetNodeId: "highSchoolSoftwarePrototype",
        previewTitle: "Software path",
        previewSummary: "A prototype branch focused on product building and engineering depth.",
      },
      {
        id: "branch-medical",
        label: "Medical school",
        targetNodeId: "highSchoolMedicalPrototype",
        previewTitle: "Medical path",
        previewSummary: "A prototype branch focused on medicine, care, and clinical direction.",
      },
      {
        id: "branch-entertainment",
        label: "Entertainment",
        targetNodeId: "highSchoolEntertainmentPrototype",
        previewTitle: "Entertainment path",
        previewSummary: "A prototype branch focused on performance, music, and creative momentum.",
      },
    ],
    timelineLabel: "High School",
    preload: ["about/decision-bubbles"],
    unloadStrategy: "dispose",
    transitionIn: "branch-bloom",
    transitionOut: "branch-collapse",
    scrollWeight: 1,
    entryPct: 0.18,
    holdPct: 0.56,
    exitPct: 0.26,
    sceneProps: {
      portraitLabel: "Thinking portrait placeholder",
      camera: {
        start: {
          position: [0.1, 0.16, 5.7],
          target: [0, 0.02, 0],
          fov: 34,
        },
        end: {
          position: [0.18, 0.08, 5.1],
          target: [0.08, 0, 0],
          fov: 30,
        },
      },
      thoughts: [
        { id: "software", label: "Software", previewTitle: "Software path", tint: "#38bdf8", anchor: [-1.2, 1.06, 0] },
        { id: "medical", label: "Medicine", previewTitle: "Medical path", tint: "#f59e0b", anchor: [0, 1.24, 0] },
        { id: "entertainment", label: "Entertainment", previewTitle: "Creative path", tint: "#c084fc", anchor: [1.18, 1.02, 0] },
      ],
    },
  }),
  defineAboutStoryNode({
    id: "highSchoolSoftwarePrototype",
    title: "Software path prototype",
    eyebrow: "Prototype",
    summary: "A future branch destination for the software engineering track.",
    highlights: ["Future branch target"],
    type: "futureVision",
    yearLabel: "Prototype",
    parentId: "highSchoolDecisionPrototype",
    nextIds: ["highSchoolDecisionPrototype"],
    timelineLabel: "Software",
    preload: [],
    unloadStrategy: "dispose",
    transitionIn: "branch-focus",
    transitionOut: "branch-return",
    scrollWeight: 1,
    entryPct: 0.2,
    holdPct: 0.55,
    exitPct: 0.25,
    sceneProps: {
      accent: "#38bdf8",
      motif: "Software branch placeholder",
      camera: {
        start: {
          position: [0.12, 0.12, 5.4],
          target: [0, 0, 0],
          fov: 33,
        },
        end: {
          position: [0.24, 0.08, 5],
          target: [0.08, 0, 0],
          fov: 30,
        },
      },
    },
  }),
  defineAboutStoryNode({
    id: "highSchoolMedicalPrototype",
    title: "Medical path prototype",
    eyebrow: "Prototype",
    summary: "A future branch destination for the medical school track.",
    highlights: ["Future branch target"],
    type: "futureVision",
    yearLabel: "Prototype",
    parentId: "highSchoolDecisionPrototype",
    nextIds: ["highSchoolDecisionPrototype"],
    timelineLabel: "Medical",
    preload: [],
    unloadStrategy: "dispose",
    transitionIn: "branch-focus",
    transitionOut: "branch-return",
    scrollWeight: 1,
    entryPct: 0.2,
    holdPct: 0.55,
    exitPct: 0.25,
    sceneProps: {
      accent: "#f59e0b",
      motif: "Medical branch placeholder",
      camera: {
        start: {
          position: [0.12, 0.12, 5.4],
          target: [0, 0, 0],
          fov: 33,
        },
        end: {
          position: [0.24, 0.08, 5],
          target: [0.08, 0, 0],
          fov: 30,
        },
      },
    },
  }),
  defineAboutStoryNode({
    id: "highSchoolEntertainmentPrototype",
    title: "Entertainment path prototype",
    eyebrow: "Prototype",
    summary: "A future branch destination for the entertainment track.",
    highlights: ["Future branch target"],
    type: "futureVision",
    yearLabel: "Prototype",
    parentId: "highSchoolDecisionPrototype",
    nextIds: ["highSchoolDecisionPrototype"],
    timelineLabel: "Entertainment",
    preload: [],
    unloadStrategy: "dispose",
    transitionIn: "branch-focus",
    transitionOut: "branch-return",
    scrollWeight: 1,
    entryPct: 0.2,
    holdPct: 0.55,
    exitPct: 0.25,
    sceneProps: {
      accent: "#c084fc",
      motif: "Entertainment branch placeholder",
      camera: {
        start: {
          position: [0.12, 0.12, 5.4],
          target: [0, 0, 0],
          fov: 33,
        },
        end: {
          position: [0.24, 0.08, 5],
          target: [0.08, 0, 0],
          fov: 30,
        },
      },
    },
  }),
];

export const aboutPrimaryTimelineIds = ["start", "birthMigration", "childhood"] as const;

export type AboutPrimaryTimelineId = (typeof aboutPrimaryTimelineIds)[number];

export const aboutStoryNodesById = aboutStoryNodes.reduce<Record<string, AboutStoryNode>>((acc, node) => {
  acc[node.id] = node;
  return acc;
}, {});

export const aboutStoryInitialNodeId: AboutPrimaryTimelineId = aboutPrimaryTimelineIds[0];

const validateAboutStory = () => {
  const ids = new Set<string>();

  aboutStoryNodes.forEach((node) => {
    assert(!ids.has(node.id), `Duplicate node id: ${node.id}`);
    ids.add(node.id);
    assert(node.title.length > 0, `Node ${node.id} must include a title.`);
    assert(node.summary.length > 0, `Node ${node.id} must include a summary.`);
    assert(node.scrollWeight > 0, `Node ${node.id} must have a positive scrollWeight.`);
    assert(node.entryPct > 0 && node.holdPct > 0 && node.exitPct > 0, `Node ${node.id} must define entry/hold/exit values.`);
  });

  aboutStoryNodes.forEach((node) => {
    node.nextIds.forEach((nextId) => {
      assert(ids.has(nextId), `Node ${node.id} references unknown nextId: ${nextId}`);
    });

    node.branchOptions?.forEach((option) => {
      assert(ids.has(option.targetNodeId), `Node ${node.id} branch ${option.id} targets unknown node: ${option.targetNodeId}`);
    });

    if (node.parentId) {
      assert(ids.has(node.parentId), `Node ${node.id} references unknown parentId: ${node.parentId}`);
    }
  });

  aboutPrimaryTimelineIds.forEach((id) => {
    assert(ids.has(id), `Primary timeline references unknown node: ${id}`);
  });
};

validateAboutStory();
