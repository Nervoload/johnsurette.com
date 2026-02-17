import { BioticClass, DensityPreset, PalettePreset } from "./types";

export interface DensityConfig {
  areaDivisor: number;
  minParticles: number;
  maxParticles: number;
  maxAmoebaChecks: number;
  emissionCapPerVirus: number;
  bacteriaSubCellCap: number;
}

export interface ClassMotionRange {
  slideDurationMin: number;
  slideDurationMax: number;
  pauseDurationMin: number;
  pauseDurationMax: number;
  impulseMin: number;
  impulseMax: number;
  dampingMin: number;
  dampingMax: number;
  flowScaleMin: number;
  flowScaleMax: number;
  driftJitterMin: number;
  driftJitterMax: number;
}

export interface ClassShapeRange {
  sizeMin: number;
  sizeMax: number;
  trailLengthMin: number;
  trailLengthMax: number;
  trailWidthMin: number;
  trailWidthMax: number;

  lengthMin?: number;
  lengthMax?: number;
  thicknessMin?: number;
  thicknessMax?: number;
  maxSubCellsMin?: number;
  maxSubCellsMax?: number;
  fissionIntervalMin?: number;
  fissionIntervalMax?: number;
  localJitterMin?: number;
  localJitterMax?: number;

  headRadiusMin?: number;
  headRadiusMax?: number;
  tailLengthMin?: number;
  tailLengthMax?: number;
  tailLegsMin?: number;
  tailLegsMax?: number;

  protrusionsMin?: number;
  protrusionsMax?: number;
  protrusionLengthMin?: number;
  protrusionLengthMax?: number;
  emissionIntervalMin?: number;
  emissionIntervalMax?: number;
  emissionSpeedMin?: number;
  emissionSpeedMax?: number;
  emissionTTLMin?: number;
  emissionTTLMax?: number;

  lobeCountMin?: number;
  lobeCountMax?: number;
  roughnessMin?: number;
  roughnessMax?: number;
  pulseSpeedMin?: number;
  pulseSpeedMax?: number;
  senseRadiusMin?: number;
  senseRadiusMax?: number;
  chaseStrengthMin?: number;
  chaseStrengthMax?: number;
  bumpStrengthMin?: number;
  bumpStrengthMax?: number;
}

export interface ClassColorRange {
  hueMin: number;
  hueMax: number;
  saturationMin: number;
  saturationMax: number;
  lightnessMin: number;
  lightnessMax: number;
  alphaMin: number;
  alphaMax: number;
}

export const FLOW_PX_PER_SEC_MIN = 18;
export const FLOW_PX_PER_SEC_MAX = 42;

export const DENSITY_PRESETS: Record<DensityPreset, DensityConfig> = {
  low: {
    areaDivisor: 15000,
    minParticles: 80,
    maxParticles: 130,
    maxAmoebaChecks: 4,
    emissionCapPerVirus: 4,
    bacteriaSubCellCap: 3,
  },
  balanced: {
    areaDivisor: 9800,
    minParticles: 110,
    maxParticles: 190,
    maxAmoebaChecks: 8,
    emissionCapPerVirus: 6,
    bacteriaSubCellCap: 4,
  },
  high: {
    areaDivisor: 7200,
    minParticles: 150,
    maxParticles: 260,
    maxAmoebaChecks: 12,
    emissionCapPerVirus: 10,
    bacteriaSubCellCap: 5,
  },
};

export const CLASS_DISTRIBUTION: Array<{ classType: BioticClass; weight: number }> = [
  { classType: "bacteria", weight: 0.45 },
  { classType: "viralEnvelope", weight: 0.22 },
  { classType: "amoeba", weight: 0.18 },
  { classType: "bacteriophage", weight: 0.15 },
];

export const SHAPE_PROFILE_COUNT = 14;

export const CLASS_MOTION_RANGES: Record<BioticClass, ClassMotionRange> = {
  bacteria: {
    slideDurationMin: 0.35,
    slideDurationMax: 1.2,
    pauseDurationMin: 0.18,
    pauseDurationMax: 0.95,
    impulseMin: 26,
    impulseMax: 92,
    dampingMin: 0.915,
    dampingMax: 0.965,
    flowScaleMin: 0.95,
    flowScaleMax: 1.3,
    driftJitterMin: 5,
    driftJitterMax: 14,
  },
  bacteriophage: {
    slideDurationMin: 0.32,
    slideDurationMax: 1,
    pauseDurationMin: 0.24,
    pauseDurationMax: 0.85,
    impulseMin: 22,
    impulseMax: 68,
    dampingMin: 0.92,
    dampingMax: 0.968,
    flowScaleMin: 0.9,
    flowScaleMax: 1.22,
    driftJitterMin: 4,
    driftJitterMax: 11,
  },
  viralEnvelope: {
    slideDurationMin: 0.38,
    slideDurationMax: 1.1,
    pauseDurationMin: 0.2,
    pauseDurationMax: 0.9,
    impulseMin: 20,
    impulseMax: 58,
    dampingMin: 0.92,
    dampingMax: 0.966,
    flowScaleMin: 0.88,
    flowScaleMax: 1.2,
    driftJitterMin: 4,
    driftJitterMax: 12,
  },
  amoeba: {
    slideDurationMin: 0.42,
    slideDurationMax: 1.2,
    pauseDurationMin: 0.22,
    pauseDurationMax: 0.92,
    impulseMin: 16,
    impulseMax: 52,
    dampingMin: 0.93,
    dampingMax: 0.97,
    flowScaleMin: 0.86,
    flowScaleMax: 1.1,
    driftJitterMin: 3,
    driftJitterMax: 9,
  },
};

export const CLASS_SHAPE_RANGES: Record<BioticClass, ClassShapeRange> = {
  bacteria: {
    sizeMin: 7,
    sizeMax: 15,
    trailLengthMin: 8,
    trailLengthMax: 14,
    trailWidthMin: 1.3,
    trailWidthMax: 2.6,
    lengthMin: 14,
    lengthMax: 34,
    thicknessMin: 4,
    thicknessMax: 10,
    maxSubCellsMin: 2,
    maxSubCellsMax: 4,
    fissionIntervalMin: 1.8,
    fissionIntervalMax: 4.2,
    localJitterMin: 4,
    localJitterMax: 16,
  },
  bacteriophage: {
    sizeMin: 7,
    sizeMax: 13,
    trailLengthMin: 5,
    trailLengthMax: 9,
    trailWidthMin: 1,
    trailWidthMax: 1.9,
    headRadiusMin: 4,
    headRadiusMax: 8,
    tailLengthMin: 10,
    tailLengthMax: 18,
    tailLegsMin: 3,
    tailLegsMax: 6,
  },
  viralEnvelope: {
    sizeMin: 7,
    sizeMax: 14,
    trailLengthMin: 6,
    trailLengthMax: 10,
    trailWidthMin: 1,
    trailWidthMax: 2.2,
    protrusionsMin: 8,
    protrusionsMax: 14,
    protrusionLengthMin: 1.5,
    protrusionLengthMax: 4,
    emissionIntervalMin: 0.7,
    emissionIntervalMax: 2,
    emissionSpeedMin: 28,
    emissionSpeedMax: 80,
    emissionTTLMin: 0.4,
    emissionTTLMax: 1,
  },
  amoeba: {
    sizeMin: 9,
    sizeMax: 18,
    trailLengthMin: 5,
    trailLengthMax: 8,
    trailWidthMin: 1.4,
    trailWidthMax: 2.8,
    lobeCountMin: 8,
    lobeCountMax: 14,
    roughnessMin: 0.08,
    roughnessMax: 0.24,
    pulseSpeedMin: 0.8,
    pulseSpeedMax: 1.9,
    senseRadiusMin: 58,
    senseRadiusMax: 126,
    chaseStrengthMin: 18,
    chaseStrengthMax: 56,
    bumpStrengthMin: 40,
    bumpStrengthMax: 88,
  },
};

export const PALETTE_RANGES: Record<PalettePreset, Record<BioticClass, ClassColorRange>> = {
  biotic: {
    bacteria: {
      hueMin: 26,
      hueMax: 182,
      saturationMin: 52,
      saturationMax: 90,
      lightnessMin: 48,
      lightnessMax: 74,
      alphaMin: 0.24,
      alphaMax: 0.5,
    },
    bacteriophage: {
      hueMin: 176,
      hueMax: 340,
      saturationMin: 60,
      saturationMax: 92,
      lightnessMin: 52,
      lightnessMax: 76,
      alphaMin: 0.26,
      alphaMax: 0.48,
    },
    viralEnvelope: {
      hueMin: 0,
      hueMax: 360,
      saturationMin: 58,
      saturationMax: 94,
      lightnessMin: 50,
      lightnessMax: 76,
      alphaMin: 0.24,
      alphaMax: 0.48,
    },
    amoeba: {
      hueMin: 72,
      hueMax: 252,
      saturationMin: 42,
      saturationMax: 84,
      lightnessMin: 42,
      lightnessMax: 70,
      alphaMin: 0.22,
      alphaMax: 0.44,
    },
  },
  labBlue: {
    bacteria: {
      hueMin: 188,
      hueMax: 210,
      saturationMin: 42,
      saturationMax: 76,
      lightnessMin: 50,
      lightnessMax: 74,
      alphaMin: 0.22,
      alphaMax: 0.44,
    },
    bacteriophage: {
      hueMin: 196,
      hueMax: 230,
      saturationMin: 52,
      saturationMax: 84,
      lightnessMin: 52,
      lightnessMax: 74,
      alphaMin: 0.24,
      alphaMax: 0.46,
    },
    viralEnvelope: {
      hueMin: 184,
      hueMax: 220,
      saturationMin: 50,
      saturationMax: 86,
      lightnessMin: 52,
      lightnessMax: 75,
      alphaMin: 0.24,
      alphaMax: 0.46,
    },
    amoeba: {
      hueMin: 176,
      hueMax: 206,
      saturationMin: 34,
      saturationMax: 70,
      lightnessMin: 46,
      lightnessMax: 66,
      alphaMin: 0.22,
      alphaMax: 0.42,
    },
  },
  neon: {
    bacteria: {
      hueMin: 40,
      hueMax: 320,
      saturationMin: 62,
      saturationMax: 96,
      lightnessMin: 54,
      lightnessMax: 78,
      alphaMin: 0.26,
      alphaMax: 0.54,
    },
    bacteriophage: {
      hueMin: 180,
      hueMax: 310,
      saturationMin: 68,
      saturationMax: 98,
      lightnessMin: 56,
      lightnessMax: 80,
      alphaMin: 0.28,
      alphaMax: 0.56,
    },
    viralEnvelope: {
      hueMin: 8,
      hueMax: 300,
      saturationMin: 64,
      saturationMax: 98,
      lightnessMin: 56,
      lightnessMax: 80,
      alphaMin: 0.28,
      alphaMax: 0.56,
    },
    amoeba: {
      hueMin: 130,
      hueMax: 280,
      saturationMin: 52,
      saturationMax: 94,
      lightnessMin: 48,
      lightnessMax: 76,
      alphaMin: 0.24,
      alphaMax: 0.5,
    },
  },
};
