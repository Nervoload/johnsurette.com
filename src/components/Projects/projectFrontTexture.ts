import {
  ProjectCardFrontFamily,
  ProjectItem,
  resolveProjectCardFront,
} from "./projectData";
import { ResolvedThemeMode } from "../theme/themeMode";

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

const createFamilyTheme = (
  item: ProjectItem,
  themeMode: ResolvedThemeMode,
  family: ProjectCardFrontFamily,
): FamilyTheme => {
  const { palette, accent } = item;
  const familyPortalOpacity = {
    atlas: palette.line,
    signal: accent,
    forge: palette.bright,
    lattice: palette.mid,
  } satisfies Record<ProjectCardFrontFamily, string>;

  if (themeMode === "dark") {
    return {
      bgStart: palette.deep,
      bgEnd: palette.mid,
      portal: familyPortalOpacity[family],
      trim: palette.line,
      text: palette.bright,
      muted: palette.line,
      chip: palette.deep,
      chipText: palette.bright,
    };
  }

  return {
    bgStart: palette.bright,
    bgEnd: palette.line,
    portal: familyPortalOpacity[family],
    trim: accent,
    text: palette.deep,
    muted: palette.mid,
    chip: "#ffffff",
    chipText: palette.deep,
  };
};

const LANDSCAPE_WIDTH = 1024;
const LANDSCAPE_HEIGHT = 720;
const PORTRAIT_WIDTH = 720;
const PORTRAIT_HEIGHT = 1024;
export type ProjectFrontOrientation = "landscape" | "portrait";

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

const tspanLines = (lines: string[], x: number, lineHeight: number) =>
  lines
    .map((line, i) => `<tspan x='${x}' dy='${i === 0 ? 0 : lineHeight}'>${escapeXml(line)}</tspan>`)
    .join("");

const estimateChipWidth = (label: string, { min, max }: { min: number; max: number }) =>
  Math.max(min, Math.min(max, 44 + label.trim().length * 10.4));

export const makeProjectFrontTexture = (
  item: ProjectItem,
  seed: number,
  orientation: ProjectFrontOrientation = "landscape",
  themeMode: ResolvedThemeMode = "light",
): string => {
  const front = resolveProjectCardFront(item);
  const theme = createFamilyTheme(item, themeMode, front.frontFamily);

  const titleLines = clampLines(item.title, 24, 2);
  const subtitleLines = clampLines(item.subtitle, 26, 2);
  const summaryLines = clampLines(item.summary, 40, 2);
  const landscapeMode = orientation === "landscape";

  const dateWidth = estimateChipWidth(front.dateLabel, {
    min: 188,
    max: landscapeMode ? 336 : 308,
  });

  const gradientX2 = landscapeMode ? LANDSCAPE_WIDTH : PORTRAIT_WIDTH;
  const gradientY2 = landscapeMode ? LANDSCAPE_HEIGHT : PORTRAIT_HEIGHT;
  const portalCx = landscapeMode ? 512 : 360;
  const portalCy = landscapeMode ? 360 : 512;
  const portalR = landscapeMode ? 260 : 250;

  const body = landscapeMode
    ? `
  <g transform='translate(720 0) rotate(90)'>
    <rect width='${LANDSCAPE_WIDTH}' height='${LANDSCAPE_HEIGHT}' fill='url(#bg)'/>
    <rect width='${LANDSCAPE_WIDTH}' height='${LANDSCAPE_HEIGHT}' fill='url(#grid)'/>

    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${theme.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='984' height='680' rx='34' fill='none' stroke='${item.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='936' height='632' rx='28' fill='none' stroke='${theme.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='512' cy='360' rx='228' ry='148' fill='url(#portalGlow)'/>
    <circle cx='512' cy='360' r='108' fill='none' stroke='${item.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='512' cy='360' r='68' fill='none' stroke='${theme.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='122' fill='${theme.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='54' font-weight='700'>
      ${tspanLines(titleLines, 84, 60)}
    </text>

    <g transform='translate(84 588)'>
      <rect x='0' y='0' width='${dateWidth}' height='44' rx='22' fill='${theme.chip}'/>
      <text x='18' y='29' fill='${theme.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${escapeXml(front.dateLabel)}</text>
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
  </g>`
    : `
  <g>
    <rect width='${PORTRAIT_WIDTH}' height='${PORTRAIT_HEIGHT}' fill='url(#bg)'/>
    <rect width='${PORTRAIT_WIDTH}' height='${PORTRAIT_HEIGHT}' fill='url(#grid)'/>

    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${theme.trim}' stroke-opacity='0.34' stroke-width='9'/>
    <rect x='20' y='20' width='680' height='984' rx='34' fill='none' stroke='${item.accent}' stroke-opacity='0.72' stroke-width='4.8'/>
    <rect x='44' y='44' width='632' height='936' rx='28' fill='none' stroke='${theme.trim}' stroke-opacity='0.28' stroke-width='2.2'/>

    <ellipse cx='360' cy='512' rx='206' ry='142' fill='url(#portalGlow)'/>
    <circle cx='360' cy='512' r='108' fill='none' stroke='${item.accent}' stroke-opacity='0.44' stroke-width='4'/>
    <circle cx='360' cy='512' r='68' fill='none' stroke='${theme.trim}' stroke-opacity='0.42' stroke-width='3'/>

    <text x='84' y='144' fill='${theme.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='52' font-weight='700'>
      ${tspanLines(titleLines, 84, 58)}
    </text>

    <g transform='translate(84 812)'>
      <rect x='0' y='0' width='${dateWidth}' height='44' rx='22' fill='${theme.chip}'/>
      <text x='18' y='29' fill='${theme.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='18' font-weight='600'>${escapeXml(front.dateLabel)}</text>
    </g>

    <g transform='translate(636 702)'>
      <text x='0' y='0' text-anchor='end' fill='${theme.muted}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='27' font-weight='600'>
        ${tspanLines(subtitleLines, 0, 32)}
      </text>
      <text x='0' y='80' text-anchor='end' fill='${theme.text}' font-family='ui-sans-serif,system-ui,-apple-system,sans-serif' font-size='21' font-weight='500' opacity='0.92'>
        ${tspanLines(summaryLines, 0, 27)}
      </text>
    </g>

    <path d='M98 644 H262' stroke='${item.accent}' stroke-opacity='0.5' stroke-width='3'/>
    <path d='M458 644 H622' stroke='${item.accent}' stroke-opacity='0.38' stroke-width='3'/>
  </g>`;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='${gradientX2}' y2='${gradientY2}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${theme.bgStart}'/>
      <stop offset='100%' stop-color='${theme.bgEnd}'/>
    </linearGradient>
    <radialGradient id='portalGlow' cx='${portalCx}' cy='${portalCy}' r='${portalR}' gradientUnits='userSpaceOnUse'>
      <stop offset='0%' stop-color='${theme.portal}' stop-opacity='0.56'/>
      <stop offset='100%' stop-color='${theme.portal}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${seed * 11})'>
      <path d='M16 0V32 M0 16H32' stroke='${theme.trim}' stroke-opacity='0.08' stroke-width='1'/>
    </pattern>
  </defs>

  ${body}
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
