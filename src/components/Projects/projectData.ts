export interface ProjectLink {
  label: string;
  href: string;
}

export interface CardPalette {
  deep: string;
  mid: string;
  bright: string;
  line: string;
}

export type ProjectCardStatus = "Active" | "In Progress" | "Paused" | "Archived";

export type ProjectCardFrontFamily = "atlas" | "signal" | "forge" | "lattice";

export type ProjectCardPopoutPreset =
  | "orbitalCore"
  | "dataSpines"
  | "nodeConstellation"
  | "ribbonArc"
  | "pillarArray";

export interface ProjectCardFrontSpec {
  dateLabel?: string;
  status?: ProjectCardStatus;
  iconSvg?: string;
  frontFamily: ProjectCardFrontFamily;
  popoutPreset: ProjectCardPopoutPreset;
  popoutIntensity?: number;
}

export interface ResolvedProjectCardFrontSpec {
  dateLabel: string;
  status: ProjectCardStatus;
  iconSvg: string;
  frontFamily: ProjectCardFrontFamily;
  popoutPreset: ProjectCardPopoutPreset;
  popoutIntensity: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  details: string;
  tags: string[];
  accent: string;
  palette: CardPalette;
  media: string[];
  links: ProjectLink[];
  front: ProjectCardFrontSpec;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const initialsFromTitle = (title: string) => {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "PR";
  if (words.length === 1) {
    const first = words[0].slice(0, 2).toUpperCase();
    return first || "PR";
  }
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const monogramIcon = (title: string, accent: string, palette: CardPalette) => {
  const initials = escapeXml(initialsFromTitle(title));
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
    <defs>
      <linearGradient id='monogramBg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${accent}' stop-opacity='0.92'/>
        <stop offset='100%' stop-color='${palette.mid}' stop-opacity='0.92'/>
      </linearGradient>
    </defs>
    <rect x='8' y='8' width='80' height='80' rx='24' fill='url(#monogramBg)'/>
    <rect x='13' y='13' width='70' height='70' rx='20' stroke='${palette.line}' stroke-opacity='0.55'/>
    <text x='48' y='58' text-anchor='middle' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='30' font-weight='700' fill='${palette.line}'>${initials}</text>
  </svg>`;
};

const iconFrame = (accent: string, palette: CardPalette, body: string) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none'>
  <rect x='8' y='8' width='80' height='80' rx='24' fill='${palette.bright}' fill-opacity='0.92'/>
  <rect x='8' y='8' width='80' height='80' rx='24' stroke='${accent}' stroke-opacity='0.42' stroke-width='2'/>
  <g stroke='${accent}' fill='none' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'>
    ${body}
  </g>
</svg>`;

const iconSuite = {
  deck: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<rect x='26' y='24' width='44' height='26' rx='8'/><rect x='22' y='40' width='52' height='30' rx='9' opacity='0.88'/><path d='M48 28v38'/><path d='M34 58h28'/>",
    ),
  lens: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<circle cx='46' cy='46' r='16'/><circle cx='46' cy='46' r='8' opacity='0.78'/><path d='M58 58 72 72'/><path d='M24 72c8-7 14-8 22-8' opacity='0.64'/>",
    ),
  timeline: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      `<path d='M18 28h60'/><path d='M18 48h60'/><path d='M18 68h60'/><circle cx='32' cy='28' r='4' fill='${accent}'/><circle cx='58' cy='48' r='4' fill='${accent}'/><circle cx='42' cy='68' r='4' fill='${accent}'/>`,
    ),
  neural: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      `<circle cx='30' cy='32' r='4' fill='${accent}'/><circle cx='62' cy='30' r='4' fill='${accent}'/><circle cx='28' cy='62' r='4' fill='${accent}'/><circle cx='64' cy='62' r='4' fill='${accent}'/><path d='M30 32 62 30 64 62 28 62 30 32'/><path d='M30 32 64 62'/><path d='M62 30 28 62'/>`,
    ),
  dashboard: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<rect x='22' y='24' width='52' height='44' rx='10'/><path d='M30 60v-8'/><path d='M40 60V44'/><path d='M50 60V36'/><path d='M60 60V48'/><path d='M24 72h48' opacity='0.7'/>",
    ),
};

const mediaTexture = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 400'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${a}'/>
          <stop offset='100%' stop-color='${b}'/>
        </linearGradient>
      </defs>
      <rect width='720' height='400' fill='url(#g)'/>
      <g opacity='0.26' stroke='white'>
        <circle cx='360' cy='200' r='110' fill='none' stroke-width='6'/>
        <circle cx='360' cy='200' r='70' fill='none' stroke-width='4'/>
      </g>
    </svg>
  `)}`;

const defaultFrontSpec: Pick<ResolvedProjectCardFrontSpec, "dateLabel" | "status" | "popoutIntensity"> = {
  dateLabel: "TBD",
  status: "Active",
  popoutIntensity: 1,
};

export const resolveProjectCardFront = (item: ProjectItem): ResolvedProjectCardFrontSpec => {
  const front = item.front;
  return {
    dateLabel: front.dateLabel?.trim() || defaultFrontSpec.dateLabel,
    status: front.status ?? defaultFrontSpec.status,
    iconSvg: front.iconSvg?.trim() || monogramIcon(item.title, item.accent, item.palette),
    frontFamily: front.frontFamily,
    popoutPreset: front.popoutPreset,
    popoutIntensity: clamp(front.popoutIntensity ?? defaultFrontSpec.popoutIntensity, 0.45, 1.9),
  };
};

export const projectItems: ProjectItem[] = [
  {
    id: "portfolio-3d",
    title: "Projects",
    subtitle: "Ideas realized.",
    summary: "A collection of my favorite projects, experiments, and prototypes.",
    details:
      "Built reusable scene primitives, transition orchestration, and card-based storytelling blocks to keep animation logic composable across pages.",
    tags: ["React", "Framer Motion", "Architecture"],
    accent: "#ffd608",
    palette: { deep: "#8a6b00", mid: "#d4a800", bright: "#fff8e0", line: "#fffdf2" },
    media: [mediaTexture("#e2e8f0", "#cbd5e1"), mediaTexture("#1f5fd8", "#1947a6")],
    links: [
      { label: "Live Site", href: "#" },
      { label: "Source", href: "#" },
    ],
    front: {
      dateLabel: "2026",
      status: "Active",
      frontFamily: "atlas",
      popoutPreset: "orbitalCore",
      popoutIntensity: 1.15,
      iconSvg: iconSuite.deck("#ffd608", { deep: "#8a6b00", mid: "#d4a800", bright: "#fff8e0", line: "#fffdf2" }),
    },
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
    palette: { deep: "#004a6b", mid: "#0891b2", bright: "#e0f7ff", line: "#f0fbff" },
    media: [mediaTexture("#1b2a44", "#132339"), mediaTexture("#0ea390", "#0f6f67")],
    links: [
      { label: "Case Study", href: "#" },
      { label: "Prototype", href: "#" },
    ],
    front: {
      dateLabel: "2025",
      status: "In Progress",
      frontFamily: "signal",
      popoutPreset: "nodeConstellation",
      popoutIntensity: 1.24,
      iconSvg: iconSuite.lens("#08c5ff", { deep: "#004a6b", mid: "#0891b2", bright: "#e0f7ff", line: "#f0fbff" }),
    },
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
    palette: { deep: "#004d2d", mid: "#06b66f", bright: "#e0fff0", line: "#f0fff8" },
    media: [mediaTexture("#b91c1c", "#7f1d1d"), mediaTexture("#4f46e5", "#312e81")],
    links: [
      { label: "Read Notes", href: "#" },
      { label: "Design Doc", href: "#" },
    ],
    front: {
      dateLabel: "Prototype",
      status: "Active",
      frontFamily: "lattice",
      popoutPreset: "ribbonArc",
      popoutIntensity: 1.05,
      iconSvg: iconSuite.timeline("#08ff94", { deep: "#004d2d", mid: "#06b66f", bright: "#e0fff0", line: "#f0fff8" }),
    },
  },
  {
    id: "neural-search",
    title: "Neural Search Engine",
    subtitle: "Semantic Retrieval System",
    summary: "A vector-based search tool that understands intent, not just keywords.",
    details:
      "Built an embeddings pipeline with nearest-neighbor retrieval, query expansion, and a lightweight React front-end. Optimised for sub-100ms latency on commodity hardware.",
    tags: ["Python", "FAISS", "NLP", "React"],
    accent: "#a855f7",
    palette: { deep: "#4c1d95", mid: "#7c3aed", bright: "#f3e8ff", line: "#faf5ff" },
    media: [mediaTexture("#4c1d95", "#6d28d9"), mediaTexture("#7c3aed", "#a78bfa")],
    links: [
      { label: "Demo", href: "#" },
      { label: "Source", href: "#" },
    ],
    front: {
      dateLabel: "2024",
      status: "Paused",
      frontFamily: "forge",
      popoutPreset: "dataSpines",
      popoutIntensity: 1,
      iconSvg: iconSuite.neural("#a855f7", { deep: "#4c1d95", mid: "#7c3aed", bright: "#f3e8ff", line: "#faf5ff" }),
    },
  },
  {
    id: "homelab-dashboard",
    title: "Homelab Dashboard",
    subtitle: "Infrastructure Monitor",
    summary: "A real-time dashboard for self-hosted services, container health, and network metrics.",
    details:
      "Aggregates Prometheus metrics, Docker container states, and uptime checks into a single glanceable UI with WebSocket-driven live updates and alerting hooks.",
    tags: ["TypeScript", "WebSockets", "Docker", "Grafana"],
    accent: "#f97316",
    palette: { deep: "#7c2d12", mid: "#ea580c", bright: "#fff7ed", line: "#fffbf5" },
    media: [mediaTexture("#7c2d12", "#c2410c"), mediaTexture("#ea580c", "#fb923c")],
    links: [
      { label: "Live Panel", href: "#" },
      { label: "Source", href: "#" },
    ],
    front: {
      dateLabel: "2026",
      status: "Active",
      frontFamily: "signal",
      popoutPreset: "pillarArray",
      popoutIntensity: 1.18,
      iconSvg: iconSuite.dashboard("#f97316", { deep: "#7c2d12", mid: "#ea580c", bright: "#fff7ed", line: "#fffbf5" }),
    },
  },
];
