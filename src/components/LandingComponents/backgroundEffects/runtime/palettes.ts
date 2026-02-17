export interface CinematicPalette {
  id: string;
  deep: string;
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  dust: string;
}

export const PALETTE_ROTATION_SECONDS = 24;

export const CINEMATIC_PALETTES: CinematicPalette[] = [
  {
    id: "bioelectricAmber",
    deep: "#0a1020",
    primary: "#3cd8ff",
    secondary: "#7dffd1",
    accent: "#ffb25e",
    highlight: "#fff2d1",
    dust: "#9bddff",
  },
  {
    id: "cytochromeAurora",
    deep: "#08181b",
    primary: "#35e3c8",
    secondary: "#68a9ff",
    accent: "#ff76b2",
    highlight: "#ffefd3",
    dust: "#b8d8ff",
  },
  {
    id: "aetherCopper",
    deep: "#08131e",
    primary: "#4fc3ff",
    secondary: "#89ffe1",
    accent: "#f1a15f",
    highlight: "#ffe7bf",
    dust: "#8ecaff",
  },
  {
    id: "ionNocturne",
    deep: "#0b0f1f",
    primary: "#7b6bff",
    secondary: "#5ed8ff",
    accent: "#f26d9d",
    highlight: "#c8efff",
    dust: "#8aa9ff",
  },
  {
    id: "tealMagma",
    deep: "#07161a",
    primary: "#29d4bc",
    secondary: "#66f0ff",
    accent: "#ff9f6e",
    highlight: "#f7ffe9",
    dust: "#8fe4d2",
  },
];

export interface PaletteFrame {
  current: CinematicPalette;
  next: CinematicPalette;
  mix: number;
}

export const getPaletteFrame = (timeSeconds: number, seed: number): PaletteFrame => {
  const safeSeed = Number.isFinite(seed) ? seed : 0;
  const seedOffset = ((Math.abs(safeSeed) % 997) / 997) * PALETTE_ROTATION_SECONDS;
  const shifted = Math.max(0, timeSeconds + seedOffset);
  const cycle = shifted / PALETTE_ROTATION_SECONDS;
  const index = Math.floor(cycle) % CINEMATIC_PALETTES.length;
  const nextIndex = (index + 1) % CINEMATIC_PALETTES.length;

  return {
    current: CINEMATIC_PALETTES[index],
    next: CINEMATIC_PALETTES[nextIndex],
    mix: cycle - Math.floor(cycle),
  };
};
