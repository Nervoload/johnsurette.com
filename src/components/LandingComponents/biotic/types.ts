export type BioticClass = "bacteria" | "bacteriophage" | "viralEnvelope" | "amoeba";

export type DensityPreset = "low" | "balanced" | "high";

export type PalettePreset = "biotic" | "labBlue" | "neon";

export type MotionPhase = "slide" | "pause";

export interface TrailPoint {
  nx: number;
  ny: number;
}

export interface MotionProfile {
  slideDuration: number;
  pauseDuration: number;
  impulse: number;
  damping: number;
  flowScale: number;
  driftJitter: number;
}

export interface ShapeProfile {
  classType: BioticClass;
  size: number;
  trailLength: number;
  trailWidth: number;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;

  length?: number;
  thickness?: number;
  maxSubCells?: number;
  fissionInterval?: number;
  localJitter?: number;

  headRadius?: number;
  tailLength?: number;
  tailLegs?: number;

  protrusions?: number;
  protrusionLength?: number;
  protrusionStyle?: "spike" | "club";
  emissionInterval?: number;
  emissionSpeed?: number;
  emissionTTL?: number;

  lobeCount?: number;
  roughness?: number;
  pulseSpeed?: number;
  senseRadius?: number;
  chaseStrength?: number;
  bumpStrength?: number;
}

export interface BehaviorProfile {
  id: number;
  classType: BioticClass;
  motion: MotionProfile;
  shape: ShapeProfile;
}

export interface BacteriaSubCell {
  offsetX: number;
  offsetY: number;
  vx: number;
  vy: number;
  scale: number;
}

export interface EmissionParticle {
  nx: number;
  ny: number;
  vx: number;
  vy: number;
  ttl: number;
  life: number;
  size: number;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

export interface BioticParticle {
  id: number;
  classType: BioticClass;
  profileIndex: number;
  rngState: number;
  respawnCount: number;
  hueOffset: number;
  saturationOffset: number;
  lightnessOffset: number;

  nx: number;
  ny: number;
  vx: number;
  vy: number;
  z: number;

  phase: MotionPhase;
  phaseTime: number;
  phaseDuration: number;
  slideAx: number;
  slideAy: number;

  rotation: number;
  rotationSpeed: number;

  trail: TrailPoint[];

  bacteria?: {
    subCells: BacteriaSubCell[];
    fissionTimer: number;
    fissionInterval: number;
    maxSubCells: number;
    localJitter: number;
    hasFlagella: boolean;
    flagellaCount: number;
    flagellaLength: number;
    flagellaPhase: number;
    flagellaSpeed: number;
  };

  viralEnvelope?: {
    emitTimer: number;
    emitInterval: number;
    emissions: EmissionParticle[];
    protrusionWobble: number;
  };

  amoeba?: {
    pulsePhase: number;
    senseRadius: number;
    chaseStrength: number;
    bumpStrength: number;
  };

  bacteriophage?: {
    flutterPhase: number;
    tailJitter: number;
  };
}

export type ProfilesByClass = Record<BioticClass, BehaviorProfile[]>;

export interface BioticSimulation {
  width: number;
  height: number;
  dpr: number;
  time: number;
  preset: DensityPreset;
  palette: PalettePreset;
  reducedMotion: boolean;
  flowStrength: number;
  maxAmoebaChecks: number;
  emissionCapPerVirus: number;
  particles: BioticParticle[];
  profiles: ProfilesByClass;
}

export interface CreateSimulationOptions {
  width: number;
  height: number;
  dpr: number;
  preset: DensityPreset;
  palette: PalettePreset;
  reducedMotion: boolean;
  flowStrength: number;
}
