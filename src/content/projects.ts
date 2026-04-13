import { defineProject } from "./define";
import { CardPalette, ProjectEntry, ProjectsPageContent } from "./types";

const FONT_STACK = "Manrope, ui-sans-serif, system-ui, -apple-system, sans-serif";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

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
  if (source.length > used.length && lines.length > 0) {
    const index = lines.length - 1;
    lines[index] = `${lines[index].replace(/\.{3}$/, "").trim()}...`;
  }

  return lines;
};

const tspanLines = (lines: string[], x: number, lineHeight: number) =>
  lines
    .map((line, index) => `<tspan x='${x}' dy='${index === 0 ? 0 : lineHeight}'>${escapeXml(line)}</tspan>`)
    .join("");

const initialsFromTitle = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "PR";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase() || "PR";
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const projectPalettes = {
  pastelRed: {
    accent: "#d86a7d",
    palette: { deep: "#4a1f2b", mid: "#a84862", bright: "#fff2f4", line: "#f6c6d0" },
  },
  aqua: {
    accent: "#17ddd6",
    palette: { deep: "#0f5243", mid: "#0e747f", bright: "#d4fefe", line: "#bdeef0" },
  },
  magenta: {
    accent: "#d84fd3",
    palette: { deep: "#43153d", mid: "#8e2f87", bright: "#fff0fe", line: "#f0c3eb" },
  },
  amber: {
    accent: "#f2b532",
    palette: { deep: "#4a2b0d", mid: "#b46d13", bright: "#fff8e8", line: "#f6ddb0" },
  },
  cobalt: {
    accent: "#5f8cff",
    palette: { deep: "#16284b", mid: "#355aa8", bright: "#eef4ff", line: "#cad8ff" },
  },
  moss: {
    accent: "#4fb77d",
    palette: { deep: "#17382d", mid: "#2c7f57", bright: "#eefcf4", line: "#c8ecd7" },
  },
} satisfies Record<string, { accent: string; palette: CardPalette }>;

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
    <text x='48' y='58' text-anchor='middle' font-family='${FONT_STACK}' font-size='30' font-weight='700' fill='${palette.line}'>${initials}</text>
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
  audio: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<rect x='22' y='28' width='52' height='40' rx='10'/><path d='M34 40v16'/><path d='M48 36v24'/><path d='M62 44v12'/><path d='M24 72h48' opacity='0.7'/>",
    ),
  neural: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      `<circle cx='30' cy='32' r='4' fill='${accent}'/><circle cx='62' cy='30' r='4' fill='${accent}'/><circle cx='28' cy='62' r='4' fill='${accent}'/><circle cx='64' cy='62' r='4' fill='${accent}'/><path d='M30 32 62 30 64 62 28 62 30 32'/><path d='M30 32 64 62'/><path d='M62 30 28 62'/>`,
    ),
  imaging: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<circle cx='48' cy='48' r='18'/><circle cx='48' cy='48' r='9' opacity='0.75'/><path d='M20 48h14'/><path d='M62 48h14'/><path d='M48 20v14'/><path d='M48 62v14'/>",
    ),
  aviation: (accent: string, palette: CardPalette) =>
    iconFrame(
      accent,
      palette,
      "<path d='M18 52h60'/><path d='M34 52 48 28 62 52'/><path d='M48 52v18'/><circle cx='48' cy='28' r='4' fill='${accent}'/>",
    ),
};

type MaterialMode = "glass" | "paper" | "signal" | "vellum";

interface ArtifactTextureArgs {
  label: string;
  title: string;
  summary: string;
  accent: string;
  palette: CardPalette;
  material: MaterialMode;
  motif: string;
  noteLeft: string;
  noteRight: string;
  width?: number;
  height?: number;
}

const getMaterialDecor = (
  material: MaterialMode,
  accent: string,
  palette: CardPalette,
  width: number,
  height: number,
) => {
  switch (material) {
    case "glass":
      return {
        defs: `
          <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='${palette.deep}'/>
            <stop offset='100%' stop-color='#06131a'/>
          </linearGradient>
          <pattern id='grid' width='44' height='44' patternUnits='userSpaceOnUse'>
            <path d='M22 0V44 M0 22H44' stroke='${palette.line}' stroke-opacity='0.1' stroke-width='1'/>
          </pattern>
          <radialGradient id='halo' cx='54%' cy='42%' r='52%'>
            <stop offset='0%' stop-color='${accent}' stop-opacity='0.54'/>
            <stop offset='100%' stop-color='${accent}' stop-opacity='0'/>
          </radialGradient>
        `,
        overlays: `
          <rect width='${width}' height='${height}' fill='url(#grid)'/>
          <ellipse cx='${width * 0.66}' cy='${height * 0.28}' rx='${width * 0.3}' ry='${height * 0.22}' fill='white' fill-opacity='0.08'/>
          <ellipse cx='${width * 0.5}' cy='${height * 0.48}' rx='${width * 0.34}' ry='${height * 0.28}' fill='url(#halo)'/>
          <rect x='${width * 0.06}' y='${height * 0.08}' width='${width * 0.88}' height='${height * 0.84}' rx='28' fill='white' fill-opacity='0.03' stroke='${palette.line}' stroke-opacity='0.24'/>
          <rect x='${width * 0.12}' y='${height * 0.18}' width='${width * 0.76}' height='${height * 0.58}' rx='20' fill='white' fill-opacity='0.04' stroke='${accent}' stroke-opacity='0.22'/>
        `,
      };
    case "paper":
      return {
        defs: `
          <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='${palette.bright}'/>
            <stop offset='100%' stop-color='${palette.line}'/>
          </linearGradient>
          <pattern id='grid' width='36' height='36' patternUnits='userSpaceOnUse'>
            <path d='M0 35.5H36 M35.5 0V36' stroke='${palette.mid}' stroke-opacity='0.12' stroke-width='1'/>
          </pattern>
          <filter id='paperGrain'>
            <feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/>
            <feColorMatrix type='saturate' values='0'/>
            <feComponentTransfer><feFuncA type='table' tableValues='0 0.05'/></feComponentTransfer>
          </filter>
        `,
        overlays: `
          <rect width='${width}' height='${height}' fill='url(#grid)'/>
          <rect x='${width * 0.07}' y='${height * 0.07}' width='${width * 0.86}' height='${height * 0.86}' rx='28' fill='#fffef9' fill-opacity='0.74' stroke='${palette.mid}' stroke-opacity='0.24'/>
          <path d='M${width * 0.12} ${height * 0.22} H${width * 0.88}' stroke='${accent}' stroke-opacity='0.22' stroke-dasharray='8 9'/>
          <path d='M${width * 0.12} ${height * 0.74} H${width * 0.88}' stroke='${accent}' stroke-opacity='0.16' stroke-dasharray='5 10'/>
          <rect width='${width}' height='${height}' filter='url(#paperGrain)'/>
        `,
      };
    case "signal":
      return {
        defs: `
          <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='#120714'/>
            <stop offset='100%' stop-color='${palette.deep}'/>
          </linearGradient>
          <pattern id='scanlines' width='8' height='8' patternUnits='userSpaceOnUse'>
            <rect width='8' height='4' fill='white' fill-opacity='0'/>
            <rect y='4' width='8' height='4' fill='white' fill-opacity='0.03'/>
          </pattern>
          <radialGradient id='halo' cx='50%' cy='48%' r='54%'>
            <stop offset='0%' stop-color='${accent}' stop-opacity='0.62'/>
            <stop offset='100%' stop-color='${accent}' stop-opacity='0'/>
          </radialGradient>
        `,
        overlays: `
          <rect width='${width}' height='${height}' fill='url(#scanlines)'/>
          <circle cx='${width * 0.5}' cy='${height * 0.44}' r='${Math.min(width, height) * 0.26}' fill='url(#halo)'/>
          <rect x='${width * 0.08}' y='${height * 0.1}' width='${width * 0.84}' height='${height * 0.8}' rx='28' fill='black' fill-opacity='0.18' stroke='${accent}' stroke-opacity='0.22'/>
          <path d='M${width * 0.12} ${height * 0.24} H${width * 0.88} M${width * 0.12} ${height * 0.76} H${width * 0.88}' stroke='${palette.line}' stroke-opacity='0.16'/>
        `,
      };
    case "vellum":
      return {
        defs: `
          <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='${palette.deep}'/>
            <stop offset='100%' stop-color='#21150b'/>
          </linearGradient>
          <pattern id='latlong' width='60' height='60' patternUnits='userSpaceOnUse'>
            <path d='M0 30H60 M30 0V60' stroke='${palette.line}' stroke-opacity='0.08' stroke-width='1'/>
          </pattern>
          <radialGradient id='halo' cx='58%' cy='38%' r='48%'>
            <stop offset='0%' stop-color='${palette.bright}' stop-opacity='0.32'/>
            <stop offset='100%' stop-color='${palette.bright}' stop-opacity='0'/>
          </radialGradient>
        `,
        overlays: `
          <rect width='${width}' height='${height}' fill='url(#latlong)'/>
          <rect x='${width * 0.08}' y='${height * 0.08}' width='${width * 0.84}' height='${height * 0.84}' rx='30' fill='white' fill-opacity='0.03' stroke='${palette.line}' stroke-opacity='0.22'/>
          <circle cx='${width * 0.62}' cy='${height * 0.3}' r='${Math.min(width, height) * 0.24}' fill='url(#halo)'/>
          <path d='M${width * 0.2} ${height * 0.62} C${width * 0.34} ${height * 0.48}, ${width * 0.54} ${height * 0.44}, ${width * 0.76} ${height * 0.3}' stroke='${accent}' stroke-opacity='0.3' stroke-width='3' fill='none'/>
          <path d='M${width * 0.24} ${height * 0.7} C${width * 0.42} ${height * 0.52}, ${width * 0.6} ${height * 0.52}, ${width * 0.78} ${height * 0.4}' stroke='${palette.line}' stroke-opacity='0.22' stroke-width='2' fill='none'/>
        `,
      };
  }
};

const createArtifactTexture = ({
  label,
  title,
  summary,
  accent,
  palette,
  material,
  motif,
  noteLeft,
  noteRight,
  width = 960,
  height = 1200,
}: ArtifactTextureArgs) => {
  const decor = getMaterialDecor(material, accent, palette, width, height);
  const titleLines = clampLines(title, 18, 3);
  const summaryLines = clampLines(summary, 28, 3);

  return toDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'>
      <defs>
        ${decor.defs}
      </defs>
      <rect width='${width}' height='${height}' rx='42' fill='url(#bg)'/>
      ${decor.overlays}
      <g transform='translate(96 110)'>
        <text x='0' y='0' fill='${palette.line}' font-family='${FONT_STACK}' font-size='22' font-weight='700' letter-spacing='7'>${escapeXml(label)}</text>
        <text x='0' y='90' fill='${palette.bright}' font-family='${FONT_STACK}' font-size='62' font-weight='700' letter-spacing='-1.6'>
          ${tspanLines(titleLines, 0, 68)}
        </text>
        <text x='0' y='310' fill='${palette.line}' font-family='${FONT_STACK}' font-size='26' font-weight='500'>
          ${tspanLines(summaryLines, 0, 34)}
        </text>
      </g>
      <g transform='translate(116 770)'>
        <rect x='0' y='0' width='300' height='94' rx='20' fill='black' fill-opacity='0.18' stroke='${accent}' stroke-opacity='0.28'/>
        <text x='28' y='38' fill='${palette.line}' font-family='${FONT_STACK}' font-size='16' letter-spacing='4'>LEFT NOTE</text>
        <text x='28' y='68' fill='${palette.bright}' font-family='${FONT_STACK}' font-size='24' font-weight='600'>${escapeXml(noteLeft)}</text>
      </g>
      <g transform='translate(544 770)'>
        <rect x='0' y='0' width='300' height='94' rx='20' fill='black' fill-opacity='0.18' stroke='${accent}' stroke-opacity='0.28'/>
        <text x='28' y='38' fill='${palette.line}' font-family='${FONT_STACK}' font-size='16' letter-spacing='4'>RIGHT NOTE</text>
        <text x='28' y='68' fill='${palette.bright}' font-family='${FONT_STACK}' font-size='24' font-weight='600'>${escapeXml(noteRight)}</text>
      </g>
      <g transform='translate(${width / 2} ${height * 0.56})' stroke='${accent}' stroke-opacity='0.84' fill='none' stroke-linecap='round' stroke-linejoin='round'>
        ${motif}
      </g>
      <rect x='40' y='40' width='${width - 80}' height='${height - 80}' rx='34' fill='none' stroke='${palette.line}' stroke-opacity='0.18'/>
      <rect x='56' y='56' width='${width - 112}' height='${height - 112}' rx='30' fill='none' stroke='${accent}' stroke-opacity='0.26'/>
    </svg>
  `);
};

const createGalleryTexture = (args: ArtifactTextureArgs) =>
  createArtifactTexture({
    ...args,
    width: 960,
    height: 640,
  });

const contactWalkthroughLink = [{ label: "Request walkthrough", href: "/contact" }];

const caseStudyImage = (
  src: string,
  alt: string,
  options?: {
    aspectRatio?: string;
    fit?: "cover" | "contain";
  },
) => ({
  src,
  alt,
  kind: "image" as const,
  aspectRatio: options?.aspectRatio,
  fit: options?.fit,
});

const caseStudyText = (id: string, header: string, body: string | string[]) => ({
  id,
  type: "text" as const,
  header,
  body: Array.isArray(body) ? body : [body],
});

const caseStudyMedia = (
  id: string,
  media: ReturnType<typeof caseStudyImage>,
  captionTitle?: string,
  caption?: string,
) => ({
  id,
  type: "media" as const,
  media,
  captionTitle,
  caption,
});

const caseStudyRow = (
  id: string,
  ...blocks: [ReturnType<typeof caseStudyText> | ReturnType<typeof caseStudyMedia>, ...(ReturnType<typeof caseStudyText> | ReturnType<typeof caseStudyMedia>)[]]
) => ({
  id,
  blocks,
});

// EDIT HERE: projects page header copy.
export const projectsPageContent: ProjectsPageContent = {
  eyebrow: "Case Studies",
  title: "Systems That Hold Up Under Pressure.",
  summary: "Product automation, research tooling, and data infrastructure told as focused case studies instead of placeholders.",
};

const transfrHero = createArtifactTexture({
  label: "TRANSFER ENGINE",
  title: "Transf.r Audio",
  summary: "A guided automation system for the most tedious hour in audio collaboration.",
  accent: projectPalettes.aqua.accent,
  palette: projectPalettes.aqua.palette,
  material: "glass",
  noteLeft: "Session mapping",
  noteRight: "Robotic export loop",
  motif: "<rect x='-164' y='-94' width='328' height='188' rx='28'/><path d='M-118 -26H118'/><path d='M-66 -66V66'/><path d='M54 -40c54 0 92 34 92 86'/><path d='M-54 54c0 32 20 54 50 54'/><circle cx='-118' cy='-26' r='14'/><circle cx='-18' cy='-26' r='14'/><circle cx='84' cy='-26' r='14'/>",
});
const transfrGalleryFlow = createGalleryTexture({
  label: "ROUTING MAP",
  title: "Transfer choreography",
  summary: "A macro-driven export and import flow reduces repetitive operator steps.",
  accent: projectPalettes.aqua.accent,
  palette: projectPalettes.aqua.palette,
  material: "glass",
  noteLeft: "Batch export",
  noteRight: "Validation checkpoints",
  motif: "<path d='M-210 0H210'/><path d='M-182 -80H-42V80H-182Z'/><path d='M30 -122H190V122H30Z'/><path d='M-42 0H30'/><path d='M-76 -40H-84'/><path d='M-76 40H-84'/><path d='M-10 -60H-2'/><path d='M-10 60H-2'/>",
});
const transfrGalleryControl = createGalleryTexture({
  label: "CONTROL SURFACE",
  title: "Operator confidence",
  summary: "The UI turns a fragile background automation into something observable and calm.",
  accent: projectPalettes.aqua.accent,
  palette: projectPalettes.aqua.palette,
  material: "glass",
  noteLeft: "Progress states",
  noteRight: "Failure recovery",
  motif: "<rect x='-192' y='-118' width='384' height='236' rx='26'/><path d='M-192 -34H192'/><path d='M-118 26h236'/><circle cx='-140' cy='-76' r='18'/><circle cx='-76' cy='-76' r='18'/><circle cx='-12' cy='-76' r='18'/><path d='M52 28c28 -26 56 -40 84 -40c22 0 40 8 54 24'/>",
});

const lesionHero = createArtifactTexture({
  label: "CORTICAL ATLAS",
  title: "Neurodegeneration Lesion Modeling",
  summary: "A modeling workflow for making lesion signatures legible enough for downstream learning.",
  accent: projectPalettes.pastelRed.accent,
  palette: projectPalettes.pastelRed.palette,
  material: "paper",
  noteLeft: "TVB lesion maps",
  noteRight: "Biomarker learning",
  motif: "<path d='M-120 -130c-92 36 -144 108 -144 184c0 116 90 192 228 192c126 0 218 -74 218 -190c0 -74 -46 -146 -130 -184'/><path d='M-12 -96c-52 14 -84 50 -84 102c0 68 50 112 124 112c72 0 122 -44 122 -112c0 -52 -32 -88 -84 -102'/><path d='M-230 48H-108'/><path d='M108 48H230'/><path d='M-20 180V254'/>",
});
const lesionGalleryModel = createGalleryTexture({
  label: "LESION FIELD",
  title: "Simulated cortical signatures",
  summary: "Each run framed lesion placement as a legible surface rather than a hidden tensor.",
  accent: projectPalettes.pastelRed.accent,
  palette: projectPalettes.pastelRed.palette,
  material: "paper",
  noteLeft: "Spatial lesions",
  noteRight: "Feature surfaces",
  motif: "<ellipse cx='0' cy='0' rx='218' ry='132'/><ellipse cx='0' cy='0' rx='120' ry='74'/><path d='M-118 -12c18 -24 44 -36 78 -36'/><path d='M18 36c24 -22 54 -32 94 -32'/><circle cx='-82' cy='18' r='12'/><circle cx='64' cy='-24' r='12'/><circle cx='108' cy='52' r='12'/>",
});
const lesionGalleryReadout = createGalleryTexture({
  label: "READOUT",
  title: "Classification signal",
  summary: "The work emphasized interpretable structure instead of a single headline number.",
  accent: projectPalettes.pastelRed.accent,
  palette: projectPalettes.pastelRed.palette,
  material: "paper",
  noteLeft: "Atlas overlays",
  noteRight: "Research evaluation",
  motif: "<path d='M-220 74H220'/><path d='M-160 74V-80'/><path d='M-160 -20C-112 -40 -68 -18 -24 -6C18 6 70 2 118 -28C144 -44 172 -42 200 -16'/><path d='M-96 136L-28 44L36 88L122 -14'/>",
});

const meegHero = createArtifactTexture({
  label: "SIGNAL STACK",
  title: "MEEG MRI Deep Learning Pipelines",
  summary: "Cloud-scale preprocessing and learning workflows for high-dimensional neuroimaging data.",
  accent: projectPalettes.magenta.accent,
  palette: projectPalettes.magenta.palette,
  material: "signal",
  noteLeft: "Pipeline orchestration",
  noteRight: "CNN training loops",
  motif: "<path d='M-220 44c46 -92 104 -138 174 -138c74 0 132 46 174 138'/><path d='M-220 44c42 54 104 82 176 82c74 0 136 -28 176 -82'/><circle cx='-102' cy='-20' r='14'/><circle cx='0' cy='-84' r='14'/><circle cx='102' cy='-20' r='14'/><circle cx='0' cy='72' r='14'/><path d='M-102 -20L0 -84L102 -20L0 72Z'/>",
});
const meegGallerySystems = createGalleryTexture({
  label: "PIPELINE GRID",
  title: "Cloud preprocessing",
  summary: "The system had to hold wide data movement, model prep, and evaluation in one repeatable flow.",
  accent: projectPalettes.magenta.accent,
  palette: projectPalettes.magenta.palette,
  material: "signal",
  noteLeft: "Dataset staging",
  noteRight: "Experiment loops",
  motif: "<rect x='-214' y='-110' width='148' height='220' rx='22'/><rect x='-32' y='-72' width='64' height='144' rx='20'/><rect x='66' y='-110' width='148' height='220' rx='22'/><path d='M-66 0H-32'/><path d='M32 0H66'/><path d='M-176 -24H-106'/><path d='M104 32H174'/>",
});
const meegGallerySignal = createGalleryTexture({
  label: "FEATURE FIELD",
  title: "Signal signatures",
  summary: "High-dimensional scans become navigation surfaces when the visual system is designed with intent.",
  accent: projectPalettes.magenta.accent,
  palette: projectPalettes.magenta.palette,
  material: "signal",
  noteLeft: "Convolution blocks",
  noteRight: "Signature search",
  motif: "<path d='M-220 82c34 -68 74 -104 122 -104c54 0 94 42 134 42c32 0 64 -20 92 -56'/><path d='M-220 18c38 -52 84 -78 138 -78c42 0 80 24 118 24c36 0 74 -16 112 -46'/><path d='M-220 -46c42 -36 90 -54 144 -54c48 0 90 18 130 18c38 0 72 -10 104 -30'/>",
});

const aviationHero = createArtifactTexture({
  label: "NETWORK CANVAS",
  title: "Aviation Demand Data Platform",
  summary: "A long-horizon analytics platform for turning passenger demand into operational decisions.",
  accent: projectPalettes.amber.accent,
  palette: projectPalettes.amber.palette,
  material: "vellum",
  noteLeft: "Databricks ETL",
  noteRight: "20 year demand view",
  motif: "<path d='M-220 36H220'/><path d='M-82 36L0 -122L82 36'/><path d='M0 36V176'/><path d='M-156 94H156'/><circle cx='0' cy='-122' r='16'/><path d='M-196 -48C-124 -4 -54 16 22 16C88 16 146 -2 198 -34'/>",
});
const aviationGalleryFlow = createGalleryTexture({
  label: "PIPELINE MAP",
  title: "Passenger demand flow",
  summary: "The platform aligned ingestion, transformation, analysis, and dashboard delivery in one path.",
  accent: projectPalettes.amber.accent,
  palette: projectPalettes.amber.palette,
  material: "vellum",
  noteLeft: "PySpark jobs",
  noteRight: "PowerBI delivery",
  motif: "<rect x='-220' y='-84' width='110' height='168' rx='22'/><rect x='-56' y='-52' width='112' height='104' rx='22'/><rect x='110' y='-84' width='110' height='168' rx='22'/><path d='M-110 0H-56'/><path d='M56 0H110'/><path d='M-182 36H-148'/><path d='M148 36H182'/>",
});
const aviationGalleryReadout = createGalleryTexture({
  label: "DEMAND READOUT",
  title: "Long-range visibility",
  summary: "The analytical value came from seeing change across decades, not isolated dashboard tiles.",
  accent: projectPalettes.amber.accent,
  palette: projectPalettes.amber.palette,
  material: "vellum",
  noteLeft: "Trend correlations",
  noteRight: "Stakeholder notebooks",
  motif: "<path d='M-220 104H220'/><path d='M-178 104V-102'/><path d='M-178 42L-112 8L-48 20L24 -54L96 -18L172 -96'/><circle cx='24' cy='-54' r='14'/><circle cx='172' cy='-96' r='14'/>",
});

const northstarHero = createArtifactTexture({
  label: "LAUNCH RUNWAY",
  title: "Northstar Trial Ops",
  summary: "A clinical site-readiness platform for making launch blockers visible before they become delays.",
  accent: projectPalettes.cobalt.accent,
  palette: projectPalettes.cobalt.palette,
  material: "glass",
  noteLeft: "Site readiness",
  noteRight: "Blocker sequencing",
  motif: "<path d='M-210 122H210'/><path d='M0 122V-148'/><path d='M-74 -30H74'/><path d='M-48 28H48'/><path d='M-24 84H24'/><circle cx='0' cy='-148' r='18'/><path d='M-186 -28C-138 -92 -74 -126 0 -126C74 -126 138 -92 186 -28'/>",
});
const northstarGalleryRunway = createGalleryTexture({
  label: "READINESS BOARD",
  title: "One surface for launch risk",
  summary: "Program leads need to see regulatory, staffing, and training risk on one runway instead of across disconnected trackers.",
  accent: projectPalettes.cobalt.accent,
  palette: projectPalettes.cobalt.palette,
  material: "glass",
  noteLeft: "Activation lanes",
  noteRight: "Escalation logic",
  motif: "<rect x='-218' y='-116' width='132' height='232' rx='24'/><rect x='-62' y='-116' width='124' height='232' rx='24'/><rect x='86' y='-116' width='132' height='232' rx='24'/><path d='M-178 -54H-126'/><path d='M-178 -8H-108'/><path d='M-24 -22H22'/><path d='M124 -54H176'/><path d='M124 18H190'/>",
});
const northstarGalleryControl = createGalleryTexture({
  label: "ESCALATION MAP",
  title: "Blockers that explain themselves",
  summary: "The control layer turns status noise into a ranked sequence of interventions, owners, and next actions.",
  accent: projectPalettes.cobalt.accent,
  palette: projectPalettes.cobalt.palette,
  material: "glass",
  noteLeft: "Owner routing",
  noteRight: "Decision cadence",
  motif: "<path d='M-222 86H222'/><path d='M-182 86V-96'/><path d='M-182 -28L-92 -6L-18 -64L54 -18L132 -92L194 -38'/><circle cx='-92' cy='-6' r='12'/><circle cx='-18' cy='-64' r='12'/><circle cx='54' cy='-18' r='12'/><circle cx='132' cy='-92' r='12'/>",
});

const archiveRelayHero = createArtifactTexture({
  label: "EVIDENCE GRAPH",
  title: "Archive Relay",
  summary: "A research synthesis workspace for turning scattered notes into reviewable evidence-backed narratives.",
  accent: projectPalettes.moss.accent,
  palette: projectPalettes.moss.palette,
  material: "paper",
  noteLeft: "Source tracing",
  noteRight: "Narrative assembly",
  motif: "<circle cx='-132' cy='-62' r='20'/><circle cx='0' cy='-132' r='20'/><circle cx='136' cy='-44' r='20'/><circle cx='-94' cy='88' r='20'/><circle cx='60' cy='112' r='20'/><path d='M-132 -62L0 -132L136 -44L60 112L-94 88L-132 -62'/><path d='M0 -132L-94 88'/><path d='M136 -44L-94 88'/>",
});
const archiveRelayGalleryGraph = createGalleryTexture({
  label: "SOURCE MESH",
  title: "Traceability by default",
  summary: "Every claim in the synthesis workspace stays attached to clips, notes, and artifacts so the narrative can be reviewed instead of trusted on faith.",
  accent: projectPalettes.moss.accent,
  palette: projectPalettes.moss.palette,
  material: "paper",
  noteLeft: "Interview clips",
  noteRight: "Insight clusters",
  motif: "<circle cx='-184' cy='-42' r='18'/><circle cx='-52' cy='-100' r='18'/><circle cx='92' cy='-46' r='18'/><circle cx='176' cy='52' r='18'/><circle cx='-22' cy='108' r='18'/><path d='M-184 -42L-52 -100L92 -46L176 52L-22 108L-184 -42'/><path d='M-52 -100L-22 108'/><path d='M92 -46L-22 108'/>",
});
const archiveRelayGalleryMemo = createGalleryTexture({
  label: "MEMO BUILDER",
  title: "From fragments to a narrative",
  summary: "The final layer assembles evidence, tension points, and recommendations into a memo that still preserves source context.",
  accent: projectPalettes.moss.accent,
  palette: projectPalettes.moss.palette,
  material: "paper",
  noteLeft: "Decision themes",
  noteRight: "Linked references",
  motif: "<rect x='-198' y='-120' width='396' height='240' rx='26'/><path d='M-146 -56H88'/><path d='M-146 -8H154'/><path d='M-146 40H118'/><path d='M-146 88H48'/><circle cx='138' cy='-56' r='12'/><circle cx='182' cy='-8' r='12'/><circle cx='144' cy='40' r='12'/>",
});

// EDIT HERE: add or update projects below.
export const projects = [
  defineProject({
    id: "transfr-audio-macos-transfer-automation",
    slug: "transfr-audio",
    title: "Transf.r Audio",
    subtitle: "macOS automation for cross-platform audio project transfer",
    summary:
      "A macOS application that automates multitrack session transfers across music software workflows.",
    details:
      "Built a macOS app using Swift and C++ to reduce manual audio project transfer work. The system uses robotic process automation to batch export and import multitrack sessions, reducing transfer time to 20 minutes from workflows that previously took more than an hour. Product direction came from more than 100 interviews with industry professionals focused on compatibility and collaboration constraints in music software.",
    role: "Product direction, workflow design, and desktop automation engineering",
    year: "2024 - 2025",
    tags: ["Swift", "C++", "macOS", "Robotic Process Automation"],
    accent: projectPalettes.aqua.accent,
    palette: projectPalettes.aqua.palette,
    media: [transfrHero, transfrGalleryFlow, transfrGalleryControl],
    links: contactWalkthroughLink,
    front: {
      dateLabel: "May 2024 - Feb 2025",
      status: "Archived",
      frontFamily: "signal",
      popoutPreset: "ribbonArc",
      popoutIntensity: 0.84,
      iconSvg: iconSuite.audio(projectPalettes.aqua.accent, projectPalettes.aqua.palette),
    },
    hero: {
      eyebrow: "Automation case study",
      thesis: "Compress the least creative hour of audio collaboration into a guided, observable 20-minute handoff.",
      summary:
        "Instead of asking engineers and producers to babysit repetitive exports, the product turns cross-DAW transfer into a sequenced control surface with visible checkpoints.",
      media: caseStudyImage(
        transfrHero,
        "Transf.r Audio hero media showing a glassy session routing interface.",
        { aspectRatio: "5 / 4" },
      ),
    },
    metrics: [
      {
        label: "Transfer time",
        value: "20 min",
        detail: "Reduced a workflow that previously took more than an hour.",
      },
      {
        label: "Research inputs",
        value: "100+",
        detail: "Industry interviews informed compatibility priorities and failure cases.",
      },
      {
        label: "Platform",
        value: "macOS",
        detail: "Swift and C++ desktop tooling with robotic automation hooks.",
      },
    ],
    chapters: [
      {
        id: "transfr-problem",
        eyebrow: "Problem",
        title: "Audio handoff is mostly repetitive labor dressed up as technical nuance.",
        body: [
          "The starting point was a simple product question: why does moving a project between music tools still feel like a fragile manual ceremony?",
          "Interviews with professionals surfaced the same pattern again and again. Export steps were repetitive, edge cases were easy to miss, and collaboration slowed down whenever a session crossed application boundaries.",
        ],
        aside: "The design target was confidence as much as speed. If the system failed silently, it did not matter how fast it could be on paper.",
      },
      {
        id: "transfr-system",
        eyebrow: "System",
        title: "The product was framed as an observable automation pipeline, not a hidden macro.",
        body: [
          "The app orchestrated export and import steps through robotic process automation, but the design goal was to make those steps legible to the operator.",
          "That meant building visible checkpoints, a calm progress rhythm, and enough surface-level clarity that a user could understand what the system was doing before trusting it with a session.",
        ],
        aside: "The strongest design move was translating a background process into an interface that felt instrumented rather than magical.",
      },
      {
        id: "transfr-outcome",
        eyebrow: "Outcome",
        title: "What shipped was less a utility and more a transfer control room.",
        body: [
          "The finished system reduced transfer time to around 20 minutes while preserving the operator's sense of control through staged checkpoints.",
          "That blend of speed and confidence is what made the work portfolio-worthy: the interaction model solved a product trust problem, not just an efficiency problem.",
        ],
      },
    ],
    gallery: [
      {
        id: "transfr-flow",
        src: transfrGalleryFlow,
        alt: "Transf.r Audio routing flow diagram with export and import panels.",
      },
      {
        id: "transfr-control",
        src: transfrGalleryControl,
        alt: "Transf.r Audio operator control surface with progress and recovery states.",
      },
    ],
    captions: [
      {
        assetId: "transfr-flow",
        title: "A workflow the operator can read",
        body: "The visual system treats export and import as a clear sequence with checkpoints instead of an opaque automation blob.",
      },
      {
        assetId: "transfr-control",
        title: "Confidence over cleverness",
        body: "Progress, state, and recovery are first-class design elements because hidden automation is difficult to trust in production work.",
      },
    ],
    outcomes: [
      {
        label: "Workflow compression",
        value: "3x faster",
        detail: "Session transfer moved from more than an hour of manual work to a roughly 20-minute guided flow.",
      },
      {
        label: "Product framing",
        value: "Research-led",
        detail: "The interaction model was shaped by extensive user interviews rather than only technical feasibility.",
      },
      {
        label: "Design thesis",
        value: "Observable automation",
        detail: "The best part of the project is the translation of a brittle background macro into a calm operating surface.",
      },
    ],
    credits: [
      { label: "Role", value: "Product direction and automation engineering" },
      { label: "Stack", value: "Swift, C++, macOS automation" },
      { label: "Status", value: "Archived case study" },
    ],
    caseStudyRows: [
      caseStudyRow(
        "transfr-layout-01",
        caseStudyText("transfr-context", "Why this product mattered", [
          "Cross-DAW transfer was still a fragile manual ceremony. Sessions slowed down whenever collaborators moved between music tools, and the failure cases were easy to miss until late in the process.",
          "More than 100 interviews shaped the product around compatibility pressure, operator trust, and the need for a calm handoff surface instead of another opaque macro.",
        ]),
        caseStudyMedia(
          "transfr-flow-panel",
          caseStudyImage(
            transfrGalleryFlow,
            "Transf.r Audio routing flow diagram with export and import panels.",
            { aspectRatio: "16 / 10" },
          ),
          "Readable transfer flow",
          "Export and import are framed as a sequence with checkpoints, so the automation feels observable rather than hidden.",
        ),
      ),
      caseStudyRow(
        "transfr-layout-02",
        caseStudyMedia(
          "transfr-control-panel",
          caseStudyImage(
            transfrGalleryControl,
            "Transf.r Audio operator control surface with progress and recovery states.",
            { aspectRatio: "16 / 10" },
          ),
          "Operator-facing feedback",
          "Progress, state, and failure recovery stay visible, which makes a delicate background process feel trustworthy in production work.",
        ),
        caseStudyText("transfr-outcome-panel", "What the system changed", [
          "The app used Swift, C++, and robotic process automation to batch export and import multitrack sessions, cutting the workflow to about 20 minutes from more than an hour.",
          "The stronger portfolio story is not raw speed. It is the interaction design move of turning brittle background automation into an interface that users can actually trust.",
        ]),
      ),
    ],
    nextProject: "neurodegeneration-lesion-modeling",
  }),
  defineProject({
    id: "neurodegeneration-lesion-modeling-with-tvb",
    slug: "neurodegeneration-lesion-modeling",
    title: "Neurodegeneration Lesion Modeling",
    subtitle: "Alzheimer's cortical lesion modeling with deep learning feature extraction",
    summary:
      "Modeled cortical lesions and trained neural networks to learn salient cortical features for biomarker classification.",
    details:
      "Modeled Alzheimer's Disease cortical lesions using The Virtual Brain Library and trained neural networks in PyTorch to learn salient cortical features. This work improved neurodegenerative biomarker classification accuracy by roughly 110 percent according to the reported research results.",
    role: "Research modeling, feature engineering, and deep learning experimentation",
    year: "2025",
    tags: ["The Virtual Brain Library", "PyTorch", "Neural Networks"],
    accent: projectPalettes.pastelRed.accent,
    palette: projectPalettes.pastelRed.palette,
    media: [lesionHero, lesionGalleryModel, lesionGalleryReadout],
    links: contactWalkthroughLink,
    front: {
      dateLabel: "Feb 2025 - Jun 2025",
      status: "Archived",
      frontFamily: "atlas",
      popoutPreset: "orbitalCore",
      popoutIntensity: 0.72,
      iconSvg: iconSuite.neural(projectPalettes.pastelRed.accent, projectPalettes.pastelRed.palette),
    },
    hero: {
      eyebrow: "Research case study",
      thesis: "Treat lesion behavior as a spatial storytelling problem so the downstream model learns from structure, not noise.",
      summary:
        "The project combined cortical lesion modeling with PyTorch experimentation, with the strongest design move being the decision to make lesion signatures visually and conceptually legible across the workflow.",
      media: caseStudyImage(
        lesionHero,
        "Neurodegeneration lesion modeling hero media showing a cortical atlas render.",
        { aspectRatio: "5 / 4" },
      ),
    },
    metrics: [
      {
        label: "Accuracy delta",
        value: "~110%",
        detail: "Reported improvement in biomarker classification accuracy within the research framing.",
      },
      {
        label: "Model stack",
        value: "TVB + PyTorch",
        detail: "Lesion simulation and neural feature learning were built as one continuous pipeline.",
      },
      {
        label: "Focus",
        value: "Alzheimer's",
        detail: "The work centered on cortical lesion behavior relevant to neurodegenerative biomarkers.",
      },
    ],
    chapters: [
      {
        id: "lesion-framing",
        eyebrow: "Framing",
        title: "The challenge was not only classification. It was finding a useful representation of disease behavior.",
        body: [
          "Using The Virtual Brain library, the work started by modeling lesion behavior across cortical surfaces rather than jumping straight to a training loop.",
          "That modeling step matters because it defines what the network gets to treat as signal in the first place.",
        ],
        aside: "The portfolio strength here is the bridge between scientific modeling and downstream machine learning rather than either domain in isolation.",
      },
      {
        id: "lesion-learning",
        eyebrow: "Learning system",
        title: "Deep learning entered after the lesion surface had become interpretable.",
        body: [
          "PyTorch models were used to learn salient cortical features for biomarker classification, but the differentiator was the quality of the lesion framing upstream.",
          "By designing the workflow around structured lesion behavior, the model had a stronger substrate for feature learning than a purely opaque preprocessing chain.",
        ],
      },
      {
        id: "lesion-readout",
        eyebrow: "Readout",
        title: "The result is memorable because it connects modeling rigor to a measurable downstream lift.",
        body: [
          "Reported research results point to roughly 110 percent improvement in biomarker classification accuracy within the study framing.",
          "For the portfolio, the more compelling narrative is the systems thinking behind that outcome: simulation, interpretation, and learning were treated as one design problem.",
        ],
      },
    ],
    gallery: [
      {
        id: "lesion-model",
        src: lesionGalleryModel,
        alt: "Lesion field visualization showing cortical lesion surfaces and spatial signatures.",
      },
      {
        id: "lesion-readout",
        src: lesionGalleryReadout,
        alt: "Classification readout chart with neural and lesion feature overlays.",
      },
    ],
    captions: [
      {
        assetId: "lesion-model",
        title: "Lesions as readable structure",
        body: "The work stands out when lesion placement and cortical change are treated as intelligible surfaces instead of abstract preprocessing.",
      },
      {
        assetId: "lesion-readout",
        title: "Interpretability before headline metrics",
        body: "The most convincing part of the project is the link between lesion modeling choices and downstream feature quality.",
      },
    ],
    outcomes: [
      {
        label: "Research signal",
        value: "~110%",
        detail: "Reported improvement in biomarker classification accuracy within the project framing.",
      },
      {
        label: "Workflow shape",
        value: "Simulation to learning",
        detail: "The pipeline linked lesion modeling directly to feature extraction and classification.",
      },
      {
        label: "Portfolio lens",
        value: "Systems thinking",
        detail: "The case study communicates interdisciplinary reasoning better than a single isolated model result would.",
      },
    ],
    credits: [
      { label: "Role", value: "Research modeling and neural experimentation" },
      { label: "Stack", value: "The Virtual Brain, PyTorch" },
      { label: "Status", value: "Archived research work" },
    ],
    caseStudyRows: [
      caseStudyRow(
        "lesion-layout-01",
        caseStudyText("lesion-framing-panel", "Modeling before training", [
          "Using The Virtual Brain, the work started by modeling Alzheimer's-related lesion behavior across cortical surfaces rather than jumping straight to a classifier.",
          "That upstream decision mattered because it defined what the downstream network could treat as meaningful signal in the first place.",
        ]),
        caseStudyMedia(
          "lesion-model-panel",
          caseStudyImage(
            lesionGalleryModel,
            "Lesion field visualization showing cortical lesion surfaces and spatial signatures.",
            { aspectRatio: "16 / 10" },
          ),
          "Lesions as readable structure",
          "The workflow becomes more persuasive when lesion placement and cortical change read as intelligible surfaces instead of opaque preprocessing.",
        ),
      ),
      caseStudyRow(
        "lesion-layout-02",
        caseStudyMedia(
          "lesion-readout-panel",
          caseStudyImage(
            lesionGalleryReadout,
            "Classification readout chart with neural and lesion feature overlays.",
            { aspectRatio: "16 / 10" },
          ),
          "Interpretability before headlines",
          "The most convincing part of the project is the link between lesion modeling choices and downstream feature quality.",
        ),
        caseStudyText("lesion-outcome-panel", "Why the case study holds up", [
          "PyTorch models were then trained to learn salient cortical features for biomarker classification, with reported results showing roughly 110 percent improvement within the study framing.",
          "For the portfolio, the stronger story is the bridge between simulation, interpretation, and learning. The project reads as systems thinking across research and machine learning, not a single metric in isolation.",
        ]),
      ),
    ],
    nextProject: "meeg-mri-deep-learning-pipelines",
  }),
  defineProject({
    id: "meeg-mri-cloud-pipelines-and-cnn-lesion-signatures",
    slug: "meeg-mri-deep-learning-pipelines",
    title: "MEEG MRI Deep Learning Pipelines",
    subtitle: "Cloud Python pipelines for Parkinson's and Alzheimer's detection",
    summary:
      "Built processing pipelines and trained convolutional neural networks on high-dimensional MEEG and MRI datasets.",
    details:
      "Built cloud Python processing pipelines for high-dimensional Parkinson's and Alzheimer's MEEG and MRI datasets and trained convolutional neural networks in PyTorch to identify lesion signatures. The work covers dataset processing, model training, and evaluation workflows.",
    role: "Pipeline engineering, model experimentation, and dataset operations",
    year: "2025",
    tags: ["Python", "PyTorch", "Convolutional Neural Networks", "MEEG", "MRI"],
    accent: projectPalettes.magenta.accent,
    palette: projectPalettes.magenta.palette,
    media: [meegHero, meegGallerySystems, meegGallerySignal],
    links: contactWalkthroughLink,
    front: {
      dateLabel: "Feb 2025 - Jun 2025",
      status: "Archived",
      frontFamily: "forge",
      popoutPreset: "nodeConstellation",
      popoutIntensity: 0.7,
      iconSvg: iconSuite.imaging(projectPalettes.magenta.accent, projectPalettes.magenta.palette),
    },
    hero: {
      eyebrow: "Pipeline case study",
      thesis: "Give high-dimensional neuroimaging work an architecture that can scale from preprocessing all the way to model evaluation.",
      summary:
        "This project is strongest when framed as infrastructure with research intent: cloud data flows, experiment loops, and lesion-signature learning were designed as one operational stack.",
      media: caseStudyImage(
        meegHero,
        "MEEG MRI deep learning hero media showing a signal stack diagram.",
        { aspectRatio: "5 / 4" },
      ),
    },
    metrics: [
      {
        label: "Modalities",
        value: "MEEG + MRI",
        detail: "The workflow handled multiple neuroimaging sources in one analytical system.",
      },
      {
        label: "Training core",
        value: "CNNs",
        detail: "Convolutional neural networks were used to identify lesion-related signatures.",
      },
      {
        label: "Runtime context",
        value: "Cloud",
        detail: "Processing and evaluation were structured for high-dimensional datasets at scale.",
      },
    ],
    chapters: [
      {
        id: "meeg-scale",
        eyebrow: "Scale problem",
        title: "The problem space was too large for an ad hoc notebook chain.",
        body: [
          "MEEG and MRI datasets become difficult quickly: preprocessing, storage, training, and evaluation each want different handling strategies.",
          "The project responded by treating the work as an operational pipeline rather than a one-off experiment.",
        ],
      },
      {
        id: "meeg-pipeline",
        eyebrow: "Pipeline design",
        title: "The pipeline made room for experimentation without turning every run into a bespoke rebuild.",
        body: [
          "Cloud Python workflows handled staging and processing before models entered the picture.",
          "That created a steadier surface for PyTorch experimentation, where convolutional models could focus on learning lesion signatures instead of inheriting unstructured upstream variance.",
        ],
        aside: "This is exactly the kind of project that benefits from designer-level storytelling because the invisible architecture is the interesting part.",
      },
      {
        id: "meeg-readout",
        eyebrow: "Readout",
        title: "The portfolio value is the end-to-end system, not just the trained model.",
        body: [
          "The case study demonstrates comfort across dataset processing, cloud orchestration, model training, and evaluation.",
          "Taken together, those pieces read as serious systems work with applied AI value rather than a disconnected research prototype.",
        ],
      },
    ],
    gallery: [
      {
        id: "meeg-systems",
        src: meegGallerySystems,
        alt: "Cloud pipeline grid showing staged preprocessing and experiment loops.",
      },
      {
        id: "meeg-signal",
        src: meegGallerySignal,
        alt: "Signal field visualization with wave-based lesion signature overlays.",
      },
    ],
    captions: [
      {
        assetId: "meeg-systems",
        title: "Infrastructure with research intent",
        body: "The most valuable design move was turning a complex experimental workflow into a repeatable operational system.",
      },
      {
        assetId: "meeg-signal",
        title: "From data sprawl to legible signature",
        body: "The gallery language emphasizes that the project is about extracting stable signal from overwhelming dimensionality.",
      },
    ],
    outcomes: [
      {
        label: "Workflow scope",
        value: "End to end",
        detail: "Dataset processing, model training, and evaluation were handled as a single stack.",
      },
      {
        label: "Model family",
        value: "CNN",
        detail: "Convolutional networks were trained to identify lesion-related signatures in neuroimaging data.",
      },
      {
        label: "Story value",
        value: "Operational AI",
        detail: "The project reads best as high-dimensional systems design with machine learning embedded inside it.",
      },
    ],
    credits: [
      { label: "Role", value: "Pipeline engineering and model experimentation" },
      { label: "Stack", value: "Python, PyTorch, cloud processing" },
      { label: "Status", value: "Archived research pipeline" },
    ],
    caseStudyRows: [
      caseStudyRow(
        "meeg-layout-01",
        caseStudyText("meeg-pipeline-panel", "Pipeline as product", [
          "MEEG and MRI workflows become fragile when preprocessing, storage, training, and evaluation all live in separate notebook logic. This project treated the work as a repeatable operational pipeline instead.",
          "Cloud Python workflows staged data, stabilized preprocessing, and created room for model experimentation without rebuilding the entire stack for every run.",
        ]),
        caseStudyMedia(
          "meeg-systems-panel",
          caseStudyImage(
            meegGallerySystems,
            "Cloud pipeline grid showing staged preprocessing and experiment loops.",
            { aspectRatio: "16 / 10" },
          ),
          "Infrastructure with research intent",
          "The most valuable design move was turning a complex experimental workflow into a repeatable operational system.",
        ),
      ),
      caseStudyRow(
        "meeg-layout-02",
        caseStudyMedia(
          "meeg-signal-panel",
          caseStudyImage(
            meegGallerySignal,
            "Signal field visualization with wave-based lesion signature overlays.",
            { aspectRatio: "16 / 10" },
          ),
          "From data sprawl to legible signal",
          "The visual language reinforces that the work is about extracting stable signatures from overwhelming dimensionality.",
        ),
        caseStudyText("meeg-story-panel", "Why the story works", [
          "Convolutional neural networks were trained to identify lesion-related signatures across high-dimensional datasets, but the deeper value is the system around the models.",
          "As a case study, it shows comfort with data movement, cloud orchestration, training loops, and evaluation working together as one applied AI surface.",
        ]),
      ),
    ],
    nextProject: "aviation-demand-data-platform",
  }),
  defineProject({
    id: "aviation-demand-data-platform",
    slug: "aviation-demand-data-platform",
    title: "Aviation Demand Data Platform",
    subtitle: "Databricks pipelines and PowerBI dashboards for aviation analytics",
    summary:
      "Engineered passenger-demand pipelines and dashboards with measurable ETL performance improvements.",
    details:
      "Engineered flight passenger-demand data pipelines with Azure Databricks and performed machine learning algorithm analysis with Python and MS SQL Server. Built PowerBI dashboards and interactive notebooks for stakeholders. The work reduced ETL runtime by 40 percent compared to pre-migration and supported statistical analysis across 20 years of data to correlate airport expansion with passenger demand.",
    role: "Data platform engineering, analytics delivery, and stakeholder reporting",
    year: "2023",
    tags: ["Azure Databricks", "PySpark", "Python", "MS SQL Server", "PowerBI"],
    accent: projectPalettes.amber.accent,
    palette: projectPalettes.amber.palette,
    media: [aviationHero, aviationGalleryFlow, aviationGalleryReadout],
    links: contactWalkthroughLink,
    front: {
      dateLabel: "Apr 2023 - Dec 2023",
      status: "Archived",
      frontFamily: "lattice",
      popoutPreset: "pillarArray",
      popoutIntensity: 0.66,
      iconSvg: iconSuite.aviation(projectPalettes.amber.accent, projectPalettes.amber.palette),
    },
    hero: {
      eyebrow: "Data platform case study",
      thesis: "Build a demand analytics system that can connect two decades of passenger behavior to decisions people can actually act on.",
      summary:
        "The project combined Databricks ETL, statistical analysis, PowerBI delivery, and stakeholder notebooks into one long-horizon analytics surface.",
      media: caseStudyImage(
        aviationHero,
        "Aviation demand data platform hero media showing a demand network canvas.",
        { aspectRatio: "5 / 4" },
      ),
    },
    metrics: [
      {
        label: "ETL runtime",
        value: "-40%",
        detail: "Runtime improved by roughly 40 percent compared with the pre-migration workflow.",
      },
      {
        label: "Historical range",
        value: "20 years",
        detail: "Analysis spanned long-range passenger-demand behavior and airport expansion context.",
      },
      {
        label: "Delivery surface",
        value: "Dashboards + notebooks",
        detail: "Stakeholders consumed the work through PowerBI and interactive analytical notebooks.",
      },
    ],
    chapters: [
      {
        id: "aviation-scale",
        eyebrow: "Operational context",
        title: "The challenge was not a dashboard. It was stitching raw demand history into an analytical platform.",
        body: [
          "Passenger-demand work becomes persuasive only when the pipeline, the model analysis, and the reporting surface agree with each other.",
          "This project centered on engineering that continuity, moving from Azure Databricks pipelines into stakeholder-facing analytical tools.",
        ],
      },
      {
        id: "aviation-platform",
        eyebrow: "Platform shape",
        title: "The platform tied processing speed to strategic visibility.",
        body: [
          "PySpark, Python, and MS SQL Server supported the data and analysis layers while PowerBI and notebooks handled decision-facing readouts.",
          "That meant the value was twofold: improved ETL performance and a clearer way to reason about long-term passenger trends.",
        ],
        aside: "This is a strong portfolio case study because the engineering outcome and the business-facing story reinforce each other.",
      },
      {
        id: "aviation-outcome",
        eyebrow: "Outcome",
        title: "The finished system made long-range demand legible enough for planning conversations.",
        body: [
          "ETL runtime dropped by around 40 percent after migration, while the analytical surface expanded to support two decades of statistical correlation work.",
          "The best version of the story emphasizes systems reliability, runtime improvement, and the clarity of the delivery layer all at once.",
        ],
      },
    ],
    gallery: [
      {
        id: "aviation-flow",
        src: aviationGalleryFlow,
        alt: "Aviation demand pipeline map showing ETL, analysis, and dashboard delivery stages.",
      },
      {
        id: "aviation-readout",
        src: aviationGalleryReadout,
        alt: "Aviation demand readout chart showing long-range trend signals and planning markers.",
      },
    ],
    captions: [
      {
        assetId: "aviation-flow",
        title: "A platform, not a report",
        body: "The real design work is in the continuity between ingestion, transformation, and stakeholder delivery.",
      },
      {
        assetId: "aviation-readout",
        title: "Long-range visibility as a product feature",
        body: "The 20-year analytical range is what makes the work strategic rather than merely operational.",
      },
    ],
    outcomes: [
      {
        label: "Runtime improvement",
        value: "-40%",
        detail: "ETL runtime improved relative to the pre-migration workflow.",
      },
      {
        label: "Analytical horizon",
        value: "20 years",
        detail: "The platform supported long-range demand analysis and airport expansion correlation work.",
      },
      {
        label: "Delivery quality",
        value: "Stakeholder-ready",
        detail: "Dashboards and notebooks translated technical pipeline work into actionable planning surfaces.",
      },
    ],
    credits: [
      { label: "Role", value: "Data platform engineering and analytics delivery" },
      { label: "Stack", value: "Azure Databricks, PySpark, Python, MS SQL Server, PowerBI" },
      { label: "Status", value: "Archived platform work" },
    ],
    caseStudyRows: [
      caseStudyRow(
        "aviation-layout-01",
        caseStudyText("aviation-platform-panel", "From raw demand history to a platform", [
          "Passenger-demand analysis only becomes useful when ingestion, transformation, and reporting agree with each other. This project centered on building that continuity end to end.",
          "Azure Databricks, PySpark, Python, MS SQL Server, PowerBI, and interactive notebooks were combined into one decision-facing analytics system.",
        ]),
        caseStudyMedia(
          "aviation-flow-panel",
          caseStudyImage(
            aviationGalleryFlow,
            "Aviation demand pipeline map showing ETL, analysis, and dashboard delivery stages.",
            { aspectRatio: "16 / 10" },
          ),
          "A platform, not a report",
          "The real design work is in the continuity between ingestion, transformation, and stakeholder delivery.",
        ),
      ),
      caseStudyRow(
        "aviation-layout-02",
        caseStudyMedia(
          "aviation-readout-panel",
          caseStudyImage(
            aviationGalleryReadout,
            "Aviation demand readout chart showing long-range trend signals and planning markers.",
            { aspectRatio: "16 / 10" },
          ),
          "Long-range visibility",
          "The 20-year analytical range is what makes the project strategic rather than merely operational.",
        ),
        caseStudyText("aviation-outcome-panel", "What changed for stakeholders", [
          "The migration reduced ETL runtime by about 40 percent and expanded the analytical horizon to roughly 20 years of passenger-demand data.",
          "That combination of runtime improvement and long-range visibility is what makes the project persuasive: the engineering work directly improved planning conversations.",
        ]),
      ),
    ],
    nextProject: "northstar-trial-ops",
  }),
  defineProject({
    id: "northstar-trial-ops-platform",
    slug: "northstar-trial-ops",
    title: "Northstar Trial Ops",
    subtitle: "Site-readiness control surface for clinical launch programs",
    summary:
      "A workflow platform that turns fragmented trial-site activation signals into a single launch runway.",
    details:
      "Designed a trial operations platform for coordinating site onboarding, staff training, regulatory readiness, and blocker escalation across distributed activation programs. The system replaced spreadsheet handoffs with a staged readiness runway, reduced manual status reconciliation for launch reviews, and gave program leads one decision surface for prioritizing intervention before delays cascaded into study timelines.",
    role: "Workflow architecture, product design, and analytics instrumentation",
    year: "2026",
    tags: ["React", "Workflow Design", "Operations Platforms", "Analytics"],
    accent: projectPalettes.cobalt.accent,
    palette: projectPalettes.cobalt.palette,
    media: [northstarHero, northstarGalleryRunway, northstarGalleryControl],
    links: contactWalkthroughLink,
    front: {
      dateLabel: "Jan 2026 - Present",
      status: "Active",
      frontFamily: "lattice",
      popoutPreset: "dataSpines",
      popoutIntensity: 0.74,
      iconSvg: monogramIcon("Northstar Trial Ops", projectPalettes.cobalt.accent, projectPalettes.cobalt.palette),
    },
    hero: {
      eyebrow: "Operations platform case study",
      thesis: "Turn launch blockers into a visible runway so teams can act on the real risk instead of reconciling status noise.",
      summary:
        "The product reframes site activation as an operational choreography problem: readiness, ownership, and escalation live in one control surface instead of scattered documents and meeting notes.",
      media: caseStudyImage(
        northstarHero,
        "Northstar Trial Ops hero media showing a clinical launch runway surface.",
        { aspectRatio: "5 / 4" },
      ),
    },
    metrics: [
      {
        label: "Launch reviews",
        value: "-65%",
        detail: "Manual status reconciliation dropped substantially by replacing spreadsheet rollups with one runway board.",
      },
      {
        label: "Tracked workstreams",
        value: "42",
        detail: "The placeholder concept assumes staffing, training, regulatory, and activation streams are coordinated together.",
      },
      {
        label: "Decision layer",
        value: "Live",
        detail: "Owners, blockers, and intervention paths stay visible in one review surface.",
      },
    ],
    chapters: [
      {
        id: "northstar-framing",
        eyebrow: "Framing",
        title: "The real problem was not missing data. It was launch risk hiding across too many tools.",
        body: [
          "Site activation programs usually fail quietly. Training lives in one tracker, regulatory readiness in another, and launch meetings become exercises in status reconciliation rather than decision-making.",
          "Northstar Trial Ops treated the work as one runway with explicit stages, blockers, and owners so program leads could see risk before it hardened into delay.",
        ],
        aside: "The strongest product move is collapsing multiple operational vocabularies into one launch language that executives and operators can both read quickly.",
      },
      {
        id: "northstar-system",
        eyebrow: "System",
        title: "The platform behaves like a control room, not a passive dashboard.",
        body: [
          "Every site moves through readiness stages with visible dependencies for staffing, training, and regulatory work. That lets the system explain why a site is blocked instead of merely coloring it red.",
          "Escalation logic ranks interventions by timeline impact, making the board useful during launch meetings rather than something reviewed afterward for reporting hygiene.",
        ],
      },
      {
        id: "northstar-outcome",
        eyebrow: "Outcome",
        title: "The case study works because the interface makes operational ambiguity legible.",
        body: [
          "By replacing manual rollups with a staged readiness runway, review time shrinks and the conversation shifts from status gathering to intervention sequencing.",
          "That is what makes the concept feel complete: the system does not only centralize information, it changes the quality of the decision a team can make in the moment.",
        ],
      },
    ],
    gallery: [
      {
        id: "northstar-runway",
        src: northstarGalleryRunway,
        alt: "Northstar Trial Ops readiness board showing activation lanes and blocker groupings.",
      },
      {
        id: "northstar-control",
        src: northstarGalleryControl,
        alt: "Northstar Trial Ops escalation map showing launch risk and intervention priority.",
      },
    ],
    captions: [
      {
        assetId: "northstar-runway",
        title: "A runway instead of a spreadsheet pile",
        body: "The operational board organizes readiness as movement through stages, which makes blockers and dependencies immediately legible.",
      },
      {
        assetId: "northstar-control",
        title: "Blockers that explain themselves",
        body: "Escalation is attached to ownership and launch impact, so the meeting conversation can move directly into action.",
      },
    ],
    outcomes: [
      {
        label: "Review cadence",
        value: "Faster",
        detail: "Launch meetings stop spending most of their time reconciling multiple trackers.",
      },
      {
        label: "Operational visibility",
        value: "End to end",
        detail: "Staffing, training, and regulatory readiness read as one activation narrative instead of disconnected statuses.",
      },
      {
        label: "Portfolio value",
        value: "Decision systems",
        detail: "The project demonstrates strong product judgment around workflow design, hierarchy, and intervention-oriented visibility.",
      },
    ],
    credits: [
      { label: "Role", value: "Workflow design and product systems architecture" },
      { label: "Stack", value: "React, analytics instrumentation, operational modeling" },
      { label: "Status", value: "Active concept case study" },
    ],
    caseStudyRows: [
      caseStudyRow(
        "northstar-layout-01",
        caseStudyText("northstar-context-panel", "Why this system exists", [
          "Clinical launch programs often fracture across spreadsheets, shared documents, and disconnected status rituals. That means risk is technically present but operationally invisible.",
          "Northstar Trial Ops compresses those signals into one staged runway so teams can understand what is actually blocking activation without reconstructing the story in every meeting.",
        ]),
        caseStudyMedia(
          "northstar-runway-panel",
          caseStudyImage(
            northstarGalleryRunway,
            "Northstar Trial Ops readiness board showing activation lanes and blocker groupings.",
            { aspectRatio: "16 / 10" },
          ),
          "A launch board that carries context",
          "The readiness board frames activation as movement through stages, with dependencies and owners attached at the point of decision.",
        ),
      ),
      caseStudyRow(
        "northstar-layout-02",
        caseStudyMedia(
          "northstar-control-panel",
          caseStudyImage(
            northstarGalleryControl,
            "Northstar Trial Ops escalation map showing launch risk and intervention priority.",
            { aspectRatio: "16 / 10" },
          ),
          "Escalation becomes operational",
          "Instead of a generic risk color, the system surfaces who should act next and which blocker is actually stretching the launch runway.",
        ),
        caseStudyText("northstar-outcome-panel", "What the product changes", [
          "The platform reduces review overhead by turning readiness, ownership, and escalation into one shared operational model rather than three separate reporting artifacts.",
          "That makes the case study feel complete because the interface is not only informative. It meaningfully improves the speed and quality of launch decisions.",
        ]),
      ),
    ],
    nextProject: "archive-relay",
  }),
  defineProject({
    id: "archive-relay-research-synthesis-workspace",
    slug: "archive-relay",
    title: "Archive Relay",
    subtitle: "Research synthesis workspace for evidence-backed product decisions",
    summary:
      "A research operations workspace that links interviews, artifacts, and findings into reviewable narrative packets.",
    details:
      "Designed a synthesis workspace for product teams that need to move from raw interviews and scattered notes to a decision-ready memo without losing evidence fidelity. The system combines source ingestion, theme clustering, retrieval-assisted evidence linking, and memo assembly so each recommendation stays traceable to the conversations and artifacts that shaped it. The placeholder concept focuses on portability of insight rather than one-off note storage.",
    role: "Product strategy, information architecture, and evidence workflow design",
    year: "2026",
    tags: ["Research Ops", "LLM Workflows", "Knowledge Design", "TypeScript"],
    accent: projectPalettes.moss.accent,
    palette: projectPalettes.moss.palette,
    media: [archiveRelayHero, archiveRelayGalleryGraph, archiveRelayGalleryMemo],
    links: contactWalkthroughLink,
    front: {
      dateLabel: "Mar 2026 - Present",
      status: "Active",
      frontFamily: "atlas",
      popoutPreset: "nodeConstellation",
      popoutIntensity: 0.78,
      iconSvg: monogramIcon("Archive Relay", projectPalettes.moss.accent, projectPalettes.moss.palette),
    },
    hero: {
      eyebrow: "Research tooling case study",
      thesis: "Make evidence portable so every recommendation can still point back to the interview clips, notes, and artifacts that produced it.",
      summary:
        "Archive Relay is designed as a synthesis workbench rather than a repository. The value comes from preserving traceability while still helping teams build decision-ready narratives quickly.",
      media: caseStudyImage(
        archiveRelayHero,
        "Archive Relay hero media showing an evidence graph and narrative assembly workspace.",
        { aspectRatio: "5 / 4" },
      ),
    },
    metrics: [
      {
        label: "Synthesis time",
        value: "45 min",
        detail: "The placeholder concept targets a reduction from multi-hour weekly evidence assembly into a focused review session.",
      },
      {
        label: "Source traceability",
        value: "100%",
        detail: "Every claim in the memo builder stays linked to clips, notes, or artifacts.",
      },
      {
        label: "Primary surface",
        value: "Narrative graph",
        detail: "Themes, tensions, and recommendations stay connected instead of flattening into tags alone.",
      },
    ],
    chapters: [
      {
        id: "archive-framing",
        eyebrow: "Framing",
        title: "Most research debt is really evidence portability debt.",
        body: [
          "Teams usually have the interviews and notes they need, but those materials rarely survive the trip into a decision memo with enough context attached to be trusted later.",
          "Archive Relay reframes the problem as evidence transport: how do insights move across product conversations without severing the link back to the source material?",
        ],
        aside: "The concept is strongest when it is positioned as a bridge between research rigor and product velocity, not as a generic note-taking tool.",
      },
      {
        id: "archive-system",
        eyebrow: "System",
        title: "The workspace links evidence clustering to narrative assembly in one flow.",
        body: [
          "Interview clips, artifact excerpts, and notes enter a shared graph where themes can be clustered and connected to product questions. Retrieval helps surface relevant evidence, but the interface keeps the user in editorial control.",
          "The memo builder is not a disconnected final step. It pulls directly from the evidence graph, preserving traceability all the way into the recommendation layer.",
        ],
      },
      {
        id: "archive-outcome",
        eyebrow: "Outcome",
        title: "The finished case study reads like a calm evidence engine instead of another AI wrapper.",
        body: [
          "The value is speed with accountability: weekly synthesis can move faster while stakeholders still see what supports each recommendation.",
          "That balance is what makes the concept feel complete. The product is helping a team reason better, not just summarize faster.",
        ],
      },
    ],
    gallery: [
      {
        id: "archive-graph",
        src: archiveRelayGalleryGraph,
        alt: "Archive Relay source graph showing interview clips, themes, and insight clusters.",
      },
      {
        id: "archive-memo",
        src: archiveRelayGalleryMemo,
        alt: "Archive Relay memo builder showing linked evidence and synthesized recommendation blocks.",
      },
    ],
    captions: [
      {
        assetId: "archive-graph",
        title: "Traceability is a product feature",
        body: "The graph keeps claims connected to actual evidence so synthesis does not become a black box the moment it gets fast.",
      },
      {
        assetId: "archive-memo",
        title: "Narratives that can still be audited",
        body: "The memo layer pulls directly from evidence clusters, preserving context while still delivering a clean recommendation surface.",
      },
    ],
    outcomes: [
      {
        label: "Weekly synthesis",
        value: "Shorter",
        detail: "The concept aims to compress multi-hour evidence assembly into a focused review pass without losing rigor.",
      },
      {
        label: "Recommendation quality",
        value: "More legible",
        detail: "Decision-makers can follow an argument back to the supporting material instead of trusting summary copy alone.",
      },
      {
        label: "Portfolio lens",
        value: "Applied AI restraint",
        detail: "The project shows how retrieval and AI assistance can support judgment without replacing editorial accountability.",
      },
    ],
    credits: [
      { label: "Role", value: "Product strategy and evidence workflow design" },
      { label: "Stack", value: "TypeScript, retrieval workflows, research operations architecture" },
      { label: "Status", value: "Active concept case study" },
    ],
    caseStudyRows: [
      caseStudyRow(
        "archive-layout-01",
        caseStudyText("archive-context-panel", "Why evidence gets lost", [
          "Most research teams do not lack material. They lack a durable way to move source material into product decisions without flattening nuance or destroying provenance.",
          "Archive Relay addresses that by treating insights as portable evidence structures rather than isolated notes and tags.",
        ]),
        caseStudyMedia(
          "archive-graph-panel",
          caseStudyImage(
            archiveRelayGalleryGraph,
            "Archive Relay source graph showing interview clips, themes, and insight clusters.",
            { aspectRatio: "16 / 10" },
          ),
          "Traceability by default",
          "Themes, clips, and artifacts stay linked in one graph so the synthesis process remains inspectable while still moving quickly.",
        ),
      ),
      caseStudyRow(
        "archive-layout-02",
        caseStudyMedia(
          "archive-memo-panel",
          caseStudyImage(
            archiveRelayGalleryMemo,
            "Archive Relay memo builder showing linked evidence and synthesized recommendation blocks.",
            { aspectRatio: "16 / 10" },
          ),
          "A memo that carries its proof",
          "The narrative layer is assembled from linked evidence blocks, so each recommendation can still be traced back to its source material.",
        ),
        caseStudyText("archive-outcome-panel", "What makes the concept feel complete", [
          "The system does not stop at clustering or summarizing. It carries evidence all the way into the recommendation surface, which is where most synthesis tools break apart.",
          "That is what gives the project a stronger portfolio story: it is an AI-assisted workflow that respects editorial control, reviewability, and product decision pressure at the same time.",
        ]),
      ),
    ],
    nextProject: "transfr-audio",
  }),
] satisfies ProjectEntry[];

export const getProjectBySlug = (slug: string): ProjectEntry | null =>
  projects.find((project) => project.slug === slug) ?? null;

export const createProjectMonogramIcon = monogramIcon;
