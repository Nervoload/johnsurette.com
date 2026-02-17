import {
  ProjectCardFrontFamily,
  ProjectCardStatus,
  ProjectItem,
  resolveProjectCardFront,
} from "./projectData";

interface FamilyTheme {
  bgStart: string;
  bgEnd: string;
  portal: string;
  trim: string;
  text: string;
  muted: string;
  chip: string;
  chipText: string;
}

const familyThemes: Record<ProjectCardFrontFamily, FamilyTheme> = {
  atlas: {
    bgStart: "#fcfdff",
    bgEnd: "#eef5ff",
    portal: "#dbeafe",
    trim: "#60a5fa",
    text: "#0f172a",
    muted: "#475569",
    chip: "#e2e8f0",
    chipText: "#334155",
  },
  signal: {
    bgStart: "#f0fdff",
    bgEnd: "#e0f2fe",
    portal: "#bae6fd",
    trim: "#0ea5e9",
    text: "#082f49",
    muted: "#155e75",
    chip: "#d9f8ff",
    chipText: "#0c4a6e",
  },
  forge: {
    bgStart: "#faf5ff",
    bgEnd: "#f3e8ff",
    portal: "#e9d5ff",
    trim: "#a855f7",
    text: "#3b0764",
    muted: "#6b21a8",
    chip: "#f3e8ff",
    chipText: "#581c87",
  },
  lattice: {
    bgStart: "#f0fdf4",
    bgEnd: "#dcfce7",
    portal: "#bbf7d0",
    trim: "#22c55e",
    text: "#052e16",
    muted: "#166534",
    chip: "#dcfce7",
    chipText: "#14532d",
  },
};

const statusTone: Record<ProjectCardStatus, { bg: string; fg: string }> = {
  Active: { bg: "#dcfce7", fg: "#166534" },
  "In Progress": { bg: "#e0f2fe", fg: "#0c4a6e" },
  Paused: { bg: "#ffedd5", fg: "#9a3412" },
  Archived: { bg: "#e2e8f0", fg: "#334155" },
};

const LANDSCAPE_WIDTH = 1024;
const LANDSCAPE_HEIGHT = 720;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const clampLines = (text: string, maxCharsPerLine: number, maxLines: number) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && current) lines.push(current);
  if (lines.length > maxLines) lines.length = maxLines;

  const source = words.join(" ");
  const used = lines.join(" ");
  if (source.length > used.length) {
    const index = lines.length - 1;
    lines[index] = `${lines[index].replace(/\.{3}$/, "").trim()}...`;
  }

  return lines;
};

const initials = (title: string) => {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "PR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const tspanLines = (lines: string[], x: number, lineHeight: number) =>
  lines
    .map((line, i) => `<tspan x='${x}' dy='${i === 0 ? 0 : lineHeight}'>${escapeXml(line)}</tspan>`)
    .join("");

export const makeProjectFrontTexture = (item: ProjectItem, seed: number): string => {
  const front = resolveProjectCardFront(item);
  const theme = familyThemes[front.frontFamily];
  const status = statusTone[front.status];

  const titleLines = clampLines(item.title, 24, 2);
  const subtitleLines = clampLines(item.subtitle, 26, 2);
  const summaryLines = clampLines(item.summary, 40, 2);
  const iconLabel = initials(item.title);

  const statusWidth = Math.min(280, 38 + front.status.length * 9);
  const dateWidth = Math.min(184, 36 + front.dateLabel.length * 9);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${LANDSCAPE_WIDTH}' y2='${LANDSCAPE_HEIGHT}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${theme.bgStart}'/>
      <stop offset='100%' stop-color='${theme.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='512' cy='360' r='260' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${theme.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${theme.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${seed * 11})'>
      <path d='M16 0V32 M0 16H32' stroke='${theme.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  <g transform='translate(720 0) rotate(90)'>
    <rect width='${LANDSCAPE_WIDTH}' height='${LANDSCAPE_HEIGHT}' fill='url(#bg)'/>
    <rect width='${LANDSCAPE_WIDTH}' height='${LANDSCAPE_HEIGHT}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${theme.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${item.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${theme.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${item.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${theme.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <path d='M84 86 H150 M84 86 V152 M940 86 H874 M940 86 V152 M84 634 H150 M84 634 V568 M940 634 H874 M940 634 V568' stroke='${item.accent}' stroke-opacity='0.62' stroke-width='2.2' stroke-linecap='round' fill='none'/>

    <text x='84' y='122' fill='${theme.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='54' font-weight='700'>
      ${tspanLines(titleLines, 84, 60)}
    </text>

    <g transform='translate(852 74)'>
      <rect width='96' height='96' rx='24' fill='${theme.chip}'/>
      <rect x='1.5' y='1.5' width='93' height='93' rx='22.5' fill='none' stroke='${item.accent}' stroke-opacity='0.54'/>
      <text x='48' y='58' text-anchor='middle' fill='${theme.chipText}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='33' font-weight='700'>${escapeXml(iconLabel)}</text>
    </g>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${dateWidth}' height='44' rx='22' fill='${theme.chip}'/>
      <text x='18' y='29' fill='${theme.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${escapeXml(front.dateLabel)}</text>

      <rect x='${dateWidth + 12}' y='0' width='${statusWidth}' height='44' rx='22' fill='${status.bg}'/>
      <text x='${dateWidth + 30}' y='29' fill='${status.fg}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='700'>${escapeXml(front.status)}</text>
    </g>

    <g transform='translate(938 520)'>
      <text x='0' y='0' text-anchor='end' fill='${theme.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='29' font-weight='600'>
        ${tspanLines(subtitleLines, 0, 34)}
      </text>
      <text x='0' y='86' text-anchor='end' fill='${theme.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='22' font-weight='500' opacity='0.92'>
        ${tspanLines(summaryLines, 0, 28)}
      </text>
    </g>

    <path d='M98 440 H262' stroke='${item.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M760 440 H924' stroke='${item.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
