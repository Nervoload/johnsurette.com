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
}

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
  },
];
