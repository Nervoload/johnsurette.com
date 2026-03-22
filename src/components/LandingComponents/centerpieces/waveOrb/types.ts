import * as THREE from "three";

export interface Palette {
  baseHex: string;
  glowHex: string;
  accentHex: string;
  deepHex: string;
  baseColor: THREE.Color;
  glowColor: THREE.Color;
  accentColor: THREE.Color;
  deepColor: THREE.Color;
}

export interface WaveOrbShellProfile {
  radius: number;
  opacity: number;
  haloOpacity: number;
  haloScale: number;
  displacementScale: number;
  rippleStrength: number;
  pulseStrength: number;
  fresnelPower: number;
}

export interface WaveOrbParticleProfile {
  formationCount: number;
  coronaCount: number;
  streamCount: number;
  streamTrailLength: number;
  sparkleCount: number;
  sparkleScale: number;
}

export interface WaveOrbInteriorProfile {
  nucleusRadius: number;
  nucleusPulseStrength: number;
  mitochondriaCount: number;
  mitochondriaRadius: number;
  vesicleCount: number;
  vesicleRadiusMin: number;
  vesicleRadiusMax: number;
  vesicleEscapeProbability: number;
  driftStrength: number;
  glowOpacity: number;
}

export interface WaveOrbColorProfile {
  hueShift: number;
  saturationShift: number;
  lightnessShift: number;
  cycleSpeed: number;
  clickCycleBoost: number;
  clickBoostDuration: number;
}

export interface WaveOrbLoadProfile {
  seed: number;
  shell: WaveOrbShellProfile;
  particles: WaveOrbParticleProfile;
  interior: WaveOrbInteriorProfile;
  colors: WaveOrbColorProfile;
}

export interface WaveOrbOrganelleColors {
  nucleus: THREE.Color;
  mitochondria: THREE.Color[];
  vesicles: THREE.Color[];
}

export interface WaveOrbDynamicColors {
  shellPalette: Palette;
  organelles: WaveOrbOrganelleColors;
  highlightTone: THREE.Color;
  shellOpacity: number;
  haloOpacity: number;
  cyclePhase: number;
  interactionAmount: number;
  clickBurst: number;
}
