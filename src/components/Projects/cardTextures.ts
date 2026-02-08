export type CardTextureSide = "front" | "back";

type CardTexturePalette = {
  deep: string;
  mid: string;
  bright: string;
  line: string;
};

const PALETTES: CardTexturePalette[] = [
  { deep: "#103a8a", mid: "#1f5fd8", bright: "#e6f1ff", line: "#f8fbff" },
  { deep: "#3b2f8e", mid: "#6e53db", bright: "#f2ecff", line: "#ffffff" },
  { deep: "#0f6f67", mid: "#0ea390", bright: "#ebfffa", line: "#f8fffe" },
  { deep: "#7b2e4b", mid: "#c13f73", bright: "#fff0f7", line: "#fffafe" },
  { deep: "#8a4b1a", mid: "#d4792e", bright: "#fff5ea", line: "#fffdf9" },
  { deep: "#334155", mid: "#516174", bright: "#f8fafc", line: "#ffffff" },
];

const makeCardTexture = (palette: CardTexturePalette, seed: number, side: CardTextureSide) => {
  const bgA = side === "front" ? palette.bright : palette.deep;
  const bgB = side === "front" ? "#ffffff" : palette.mid;
  const line = side === "front" ? palette.mid : palette.line;
  const emblem = side === "front" ? palette.deep : palette.bright;

  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='720' height='1024' viewBox='0 0 720 1024' preserveAspectRatio='none'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${bgA}'/>
      <stop offset='100%' stop-color='${bgB}'/>
    </linearGradient>
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${seed * 9})'>
      <path d='M14 0 V28 M0 14 H28' stroke='${line}' stroke-opacity='0.13' stroke-width='1'/>
    </pattern>
    <filter id='grain'>
      <feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer>
        <feFuncA type='table' tableValues='0 0.05'/>
      </feComponentTransfer>
    </filter>
  </defs>

  <rect width='720' height='1024' fill='url(#bg)'/>
  <rect width='720' height='1024' fill='url(#grid)'/>

  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='${line}' stroke-width='8' stroke-opacity='0.75'/>
  <rect x='58' y='58' width='604' height='908' rx='24' fill='none' stroke='${line}' stroke-width='3' stroke-opacity='0.45'/>

  <g transform='translate(360 512) rotate(${seed * 14})'>
    <circle r='172' fill='none' stroke='${emblem}' stroke-width='20' stroke-opacity='0.22'/>
    <circle r='126' fill='none' stroke='${line}' stroke-width='5' stroke-opacity='0.52'/>
    <circle r='82' fill='none' stroke='${emblem}' stroke-width='3' stroke-opacity='0.65'/>
    <path d='M0-120 L20-30 L110 0 L20 30 L0 120 L-20 30 L-110 0 L-20 -30 Z' fill='${line}' fill-opacity='0.34'/>
    <circle r='18' fill='${emblem}' fill-opacity='0.74'/>
  </g>

  <g transform='translate(360 512)' opacity='0.34'>
    <path d='M-250 -320 C-180 -220 -140 -120 -110 -20 C-70 120 -120 230 -220 320' stroke='${line}' stroke-width='2' fill='none'/>
    <path d='M250 320 C180 220 140 120 110 20 C70 -120 120 -230 220 -320' stroke='${line}' stroke-width='2' fill='none'/>
  </g>

  <rect width='720' height='1024' filter='url(#grain)'/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const FRONT_TEXTURES = PALETTES.map((palette, index) => makeCardTexture(palette, index + 1, "front"));
const BACK_TEXTURES = PALETTES.map((palette, index) => makeCardTexture(palette, index + 1, "back"));

export const CARD_FRONT_TEXTURES = FRONT_TEXTURES;
export const CARD_BACK_TEXTURES = BACK_TEXTURES;

export const cardTextureForIndex = (index: number, side: CardTextureSide) => {
  const normalized = ((index % PALETTES.length) + PALETTES.length) % PALETTES.length;
  return side === "front" ? FRONT_TEXTURES[normalized] : BACK_TEXTURES[normalized];
};
