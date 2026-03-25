import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, clonePalette, createSeededRandom, smoothStep } from "./shared";
import {
  Palette,
  WaveOrbDynamicColors,
  WaveOrbLoadProfile,
} from "./types";

export interface UseWaveOrbColorCycleParams {
  basePalette: Palette;
  loadProfile: WaveOrbLoadProfile;
  hovering: boolean;
  pressed: boolean;
  introProgress: number;
  darkMode: boolean;
}

const TAU = Math.PI * 2;
const GOLDEN_OFFSET = 0.61803398875;
const LIGHT_HIGHLIGHT = new THREE.Color("#fff8ef");
const DARK_HIGHLIGHT = new THREE.Color("#232a36");

interface PaletteFamilyProfile {
  shellHueOffset: number;
  shellHueDrift: number;
  shellSatScale: number;
  shellSatOffset: number;
  shellSatDrift: number;
  shellLightScale: number;
  shellLightOffset: number;
  shellLightDrift: number;
  glowHueOffset: number;
  glowHueDrift: number;
  glowSatScale: number;
  glowSatOffset: number;
  glowLightOffset: number;
  glowLightDrift: number;
  accentHueOffset: number;
  accentHueDrift: number;
  accentSatScale: number;
  accentSatOffset: number;
  accentLightOffset: number;
  accentLightDrift: number;
  deepHueOffset: number;
  deepHueDrift: number;
  deepSatScale: number;
  deepSatOffset: number;
  deepLightOffset: number;
  interactionHueBoost: number;
  interactionLightBoost: number;
}

const PALETTE_FAMILIES: PaletteFamilyProfile[] = [
  {
    shellHueOffset: -0.03,
    shellHueDrift: 0.015,
    shellSatScale: 1.04,
    shellSatOffset: 0.04,
    shellSatDrift: 0.035,
    shellLightScale: 0.98,
    shellLightOffset: 0.02,
    shellLightDrift: 0.03,
    glowHueOffset: 0.08,
    glowHueDrift: 0.014,
    glowSatScale: 1.02,
    glowSatOffset: 0.08,
    glowLightOffset: 0.12,
    glowLightDrift: 0.03,
    accentHueOffset: 0.2,
    accentHueDrift: 0.018,
    accentSatScale: 1.08,
    accentSatOffset: 0.14,
    accentLightOffset: 0.16,
    accentLightDrift: 0.03,
    deepHueOffset: 0.56,
    deepHueDrift: 0.014,
    deepSatScale: 0.78,
    deepSatOffset: 0.08,
    deepLightOffset: -0.22,
    interactionHueBoost: 0.016,
    interactionLightBoost: 0.026,
  },
  {
    shellHueOffset: 0.08,
    shellHueDrift: 0.018,
    shellSatScale: 1.06,
    shellSatOffset: 0.08,
    shellSatDrift: 0.04,
    shellLightScale: 1,
    shellLightOffset: 0.01,
    shellLightDrift: 0.028,
    glowHueOffset: 0.18,
    glowHueDrift: 0.018,
    glowSatScale: 1.06,
    glowSatOffset: 0.1,
    glowLightOffset: 0.14,
    glowLightDrift: 0.028,
    accentHueOffset: 0.34,
    accentHueDrift: 0.02,
    accentSatScale: 1.1,
    accentSatOffset: 0.16,
    accentLightOffset: 0.18,
    accentLightDrift: 0.032,
    deepHueOffset: 0.64,
    deepHueDrift: 0.018,
    deepSatScale: 0.72,
    deepSatOffset: 0.06,
    deepLightOffset: -0.24,
    interactionHueBoost: 0.018,
    interactionLightBoost: 0.024,
  },
  {
    shellHueOffset: -0.09,
    shellHueDrift: 0.016,
    shellSatScale: 1,
    shellSatOffset: 0.06,
    shellSatDrift: 0.038,
    shellLightScale: 0.96,
    shellLightOffset: 0.03,
    shellLightDrift: 0.026,
    glowHueOffset: 0.05,
    glowHueDrift: 0.016,
    glowSatScale: 1.04,
    glowSatOffset: 0.1,
    glowLightOffset: 0.13,
    glowLightDrift: 0.03,
    accentHueOffset: 0.42,
    accentHueDrift: 0.024,
    accentSatScale: 1.14,
    accentSatOffset: 0.12,
    accentLightOffset: 0.14,
    accentLightDrift: 0.026,
    deepHueOffset: 0.7,
    deepHueDrift: 0.02,
    deepSatScale: 0.68,
    deepSatOffset: 0.08,
    deepLightOffset: -0.22,
    interactionHueBoost: 0.014,
    interactionLightBoost: 0.03,
  },
  {
    shellHueOffset: 0.14,
    shellHueDrift: 0.017,
    shellSatScale: 1.08,
    shellSatOffset: 0.1,
    shellSatDrift: 0.04,
    shellLightScale: 0.98,
    shellLightOffset: 0.02,
    shellLightDrift: 0.028,
    glowHueOffset: 0.26,
    glowHueDrift: 0.018,
    glowSatScale: 1.08,
    glowSatOffset: 0.08,
    glowLightOffset: 0.12,
    glowLightDrift: 0.028,
    accentHueOffset: 0.4,
    accentHueDrift: 0.022,
    accentSatScale: 1.06,
    accentSatOffset: 0.18,
    accentLightOffset: 0.18,
    accentLightDrift: 0.03,
    deepHueOffset: 0.62,
    deepHueDrift: 0.016,
    deepSatScale: 0.76,
    deepSatOffset: 0.1,
    deepLightOffset: -0.2,
    interactionHueBoost: 0.02,
    interactionLightBoost: 0.024,
  },
  {
    shellHueOffset: -0.14,
    shellHueDrift: 0.015,
    shellSatScale: 1.02,
    shellSatOffset: 0.04,
    shellSatDrift: 0.034,
    shellLightScale: 1,
    shellLightOffset: 0.04,
    shellLightDrift: 0.03,
    glowHueOffset: 0.1,
    glowHueDrift: 0.018,
    glowSatScale: 1.1,
    glowSatOffset: 0.12,
    glowLightOffset: 0.16,
    glowLightDrift: 0.03,
    accentHueOffset: 0.28,
    accentHueDrift: 0.018,
    accentSatScale: 1.14,
    accentSatOffset: 0.2,
    accentLightOffset: 0.2,
    accentLightDrift: 0.03,
    deepHueOffset: 0.58,
    deepHueDrift: 0.014,
    deepSatScale: 0.72,
    deepSatOffset: 0.1,
    deepLightOffset: -0.24,
    interactionHueBoost: 0.016,
    interactionLightBoost: 0.028,
  },
  {
    shellHueOffset: 0.03,
    shellHueDrift: 0.016,
    shellSatScale: 1.04,
    shellSatOffset: 0.06,
    shellSatDrift: 0.038,
    shellLightScale: 0.97,
    shellLightOffset: 0.03,
    shellLightDrift: 0.028,
    glowHueOffset: 0.14,
    glowHueDrift: 0.016,
    glowSatScale: 1.05,
    glowSatOffset: 0.1,
    glowLightOffset: 0.14,
    glowLightDrift: 0.028,
    accentHueOffset: 0.31,
    accentHueDrift: 0.02,
    accentSatScale: 1.12,
    accentSatOffset: 0.16,
    accentLightOffset: 0.17,
    accentLightDrift: 0.03,
    deepHueOffset: 0.67,
    deepHueDrift: 0.018,
    deepSatScale: 0.7,
    deepSatOffset: 0.08,
    deepLightOffset: -0.23,
    interactionHueBoost: 0.018,
    interactionLightBoost: 0.026,
  },
  {
    shellHueOffset: 0.36,
    shellHueDrift: 0.015,
    shellSatScale: 1.08,
    shellSatOffset: 0.1,
    shellSatDrift: 0.036,
    shellLightScale: 0.98,
    shellLightOffset: 0.03,
    shellLightDrift: 0.03,
    glowHueOffset: 0.06,
    glowHueDrift: 0.016,
    glowSatScale: 1.12,
    glowSatOffset: 0.16,
    glowLightOffset: 0.18,
    glowLightDrift: 0.032,
    accentHueOffset: 0.11,
    accentHueDrift: 0.018,
    accentSatScale: 1.14,
    accentSatOffset: 0.2,
    accentLightOffset: 0.2,
    accentLightDrift: 0.032,
    deepHueOffset: 0.52,
    deepHueDrift: 0.016,
    deepSatScale: 0.8,
    deepSatOffset: 0.08,
    deepLightOffset: -0.22,
    interactionHueBoost: 0.014,
    interactionLightBoost: 0.028,
  },
  {
    shellHueOffset: 0.45,
    shellHueDrift: 0.014,
    shellSatScale: 1.04,
    shellSatOffset: 0.12,
    shellSatDrift: 0.034,
    shellLightScale: 1,
    shellLightOffset: 0.05,
    shellLightDrift: 0.028,
    glowHueOffset: 0.04,
    glowHueDrift: 0.015,
    glowSatScale: 1.08,
    glowSatOffset: 0.14,
    glowLightOffset: 0.2,
    glowLightDrift: 0.03,
    accentHueOffset: 0.08,
    accentHueDrift: 0.016,
    accentSatScale: 1.12,
    accentSatOffset: 0.18,
    accentLightOffset: 0.24,
    accentLightDrift: 0.03,
    deepHueOffset: 0.5,
    deepHueDrift: 0.014,
    deepSatScale: 0.76,
    deepSatOffset: 0.08,
    deepLightOffset: -0.2,
    interactionHueBoost: 0.012,
    interactionLightBoost: 0.03,
  },
  {
    shellHueOffset: 0.31,
    shellHueDrift: 0.016,
    shellSatScale: 1.12,
    shellSatOffset: 0.12,
    shellSatDrift: 0.038,
    shellLightScale: 0.98,
    shellLightOffset: 0.03,
    shellLightDrift: 0.028,
    glowHueOffset: 0.09,
    glowHueDrift: 0.016,
    glowSatScale: 1.14,
    glowSatOffset: 0.14,
    glowLightOffset: 0.16,
    glowLightDrift: 0.03,
    accentHueOffset: 0.15,
    accentHueDrift: 0.018,
    accentSatScale: 1.16,
    accentSatOffset: 0.22,
    accentLightOffset: 0.19,
    accentLightDrift: 0.03,
    deepHueOffset: 0.57,
    deepHueDrift: 0.016,
    deepSatScale: 0.82,
    deepSatOffset: 0.08,
    deepLightOffset: -0.24,
    interactionHueBoost: 0.014,
    interactionLightBoost: 0.028,
  },
];

const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

const mixFamilyValue = (from: number, to: number, amount: number) =>
  THREE.MathUtils.lerp(from, to, amount);

const mixPaletteFamily = (
  from: PaletteFamilyProfile,
  to: PaletteFamilyProfile,
  amount: number
): PaletteFamilyProfile => ({
  shellHueOffset: mixFamilyValue(from.shellHueOffset, to.shellHueOffset, amount),
  shellHueDrift: mixFamilyValue(from.shellHueDrift, to.shellHueDrift, amount),
  shellSatScale: mixFamilyValue(from.shellSatScale, to.shellSatScale, amount),
  shellSatOffset: mixFamilyValue(from.shellSatOffset, to.shellSatOffset, amount),
  shellSatDrift: mixFamilyValue(from.shellSatDrift, to.shellSatDrift, amount),
  shellLightScale: mixFamilyValue(from.shellLightScale, to.shellLightScale, amount),
  shellLightOffset: mixFamilyValue(from.shellLightOffset, to.shellLightOffset, amount),
  shellLightDrift: mixFamilyValue(from.shellLightDrift, to.shellLightDrift, amount),
  glowHueOffset: mixFamilyValue(from.glowHueOffset, to.glowHueOffset, amount),
  glowHueDrift: mixFamilyValue(from.glowHueDrift, to.glowHueDrift, amount),
  glowSatScale: mixFamilyValue(from.glowSatScale, to.glowSatScale, amount),
  glowSatOffset: mixFamilyValue(from.glowSatOffset, to.glowSatOffset, amount),
  glowLightOffset: mixFamilyValue(from.glowLightOffset, to.glowLightOffset, amount),
  glowLightDrift: mixFamilyValue(from.glowLightDrift, to.glowLightDrift, amount),
  accentHueOffset: mixFamilyValue(from.accentHueOffset, to.accentHueOffset, amount),
  accentHueDrift: mixFamilyValue(from.accentHueDrift, to.accentHueDrift, amount),
  accentSatScale: mixFamilyValue(from.accentSatScale, to.accentSatScale, amount),
  accentSatOffset: mixFamilyValue(from.accentSatOffset, to.accentSatOffset, amount),
  accentLightOffset: mixFamilyValue(from.accentLightOffset, to.accentLightOffset, amount),
  accentLightDrift: mixFamilyValue(from.accentLightDrift, to.accentLightDrift, amount),
  deepHueOffset: mixFamilyValue(from.deepHueOffset, to.deepHueOffset, amount),
  deepHueDrift: mixFamilyValue(from.deepHueDrift, to.deepHueDrift, amount),
  deepSatScale: mixFamilyValue(from.deepSatScale, to.deepSatScale, amount),
  deepSatOffset: mixFamilyValue(from.deepSatOffset, to.deepSatOffset, amount),
  deepLightOffset: mixFamilyValue(from.deepLightOffset, to.deepLightOffset, amount),
  interactionHueBoost: mixFamilyValue(from.interactionHueBoost, to.interactionHueBoost, amount),
  interactionLightBoost: mixFamilyValue(from.interactionLightBoost, to.interactionLightBoost, amount),
});

const selectPaletteLoop = (seed: number): PaletteFamilyProfile[] => {
  const random = createSeededRandom(seed ^ 0x5a17c9e3);
  const familyCount = random() > 0.52 ? 3 : 2;
  const indices = Array.from({ length: PALETTE_FAMILIES.length }, (_, index) => index);

  for (let i = indices.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(random() * (i + 1));
    [indices[i], indices[swapIndex]] = [indices[swapIndex], indices[i]];
  }

  return indices.slice(0, familyCount).map((index) => PALETTE_FAMILIES[index]);
};

const syncPaletteHex = (palette: WaveOrbDynamicColors["shellPalette"]) => {
  palette.baseHex = `#${palette.baseColor.getHexString()}`;
  palette.glowHex = `#${palette.glowColor.getHexString()}`;
  palette.accentHex = `#${palette.accentColor.getHexString()}`;
  palette.deepHex = `#${palette.deepColor.getHexString()}`;
};

const createOrganelleColors = (
  basePalette: Palette,
  mitochondriaCount: number,
  vesicleCount: number
): WaveOrbDynamicColors["organelles"] => ({
  nucleus: basePalette.accentColor.clone(),
  mitochondria: Array.from({ length: mitochondriaCount }, () => basePalette.glowColor.clone()),
  vesicles: Array.from({ length: vesicleCount }, () => basePalette.baseColor.clone()),
});

const clampHsl = (h: number, s: number, l: number) => ({
  h: wrap01(h),
  s: clamp01(s),
  l: clamp01(l),
});

const applyHsl = (color: THREE.Color, h: number, s: number, l: number) => {
  const next = clampHsl(h, s, l);
  color.setHSL(next.h, next.s, next.l);
};

const contrastHueFromShell = (shellHue: number, offset: number) => {
  const direct = wrap01(shellHue + offset);
  const distance = Math.min(Math.abs(direct - shellHue), 1 - Math.abs(direct - shellHue));
  return distance < 0.2 ? wrap01(direct + 0.24) : direct;
};

export const useWaveOrbColorCycle = ({
  basePalette,
  loadProfile,
  hovering,
  pressed,
  introProgress,
  darkMode,
}: UseWaveOrbColorCycleParams): WaveOrbDynamicColors => {
  const mitochondriaCount = Math.max(1, Math.floor(loadProfile.interior.mitochondriaCount));
  const vesicleCount = Math.max(1, Math.floor(loadProfile.interior.vesicleCount));

  const dynamicColors = useMemo<WaveOrbDynamicColors>(
    () => ({
      shellPalette: clonePalette(basePalette),
      organelles: createOrganelleColors(basePalette, mitochondriaCount, vesicleCount),
      highlightTone: new THREE.Color("#fff8ef"),
      shellOpacity: loadProfile.shell.opacity,
      haloOpacity: loadProfile.shell.haloOpacity,
      cyclePhase: 0,
      interactionAmount: 0,
      clickBurst: 0,
    }),
    [
      basePalette.accentHex,
      basePalette.baseHex,
      basePalette.deepHex,
      basePalette.glowHex,
      loadProfile.shell.haloOpacity,
      loadProfile.shell.opacity,
      mitochondriaCount,
      vesicleCount,
    ]
  );

  const workingColors = useMemo(
    () => ({
      shellBase: new THREE.Color(),
      shellGlow: new THREE.Color(),
      shellAccent: new THREE.Color(),
      shellDeep: new THREE.Color(),
      highlight: new THREE.Color(),
      nucleus: new THREE.Color(),
      mitochondria: Array.from({ length: mitochondriaCount }, () => new THREE.Color()),
      vesicles: Array.from({ length: vesicleCount }, () => new THREE.Color()),
    }),
    [mitochondriaCount, vesicleCount]
  );

  const paletteLoop = useMemo(
    () => selectPaletteLoop(loadProfile.seed >>> 0),
    [loadProfile.seed]
  );

  const phaseRef = useRef(wrap01(loadProfile.seed * 0.61803398875));
  const palettePhaseRef = useRef(wrap01(loadProfile.seed * 0.00000037 + 0.3183099));
  const hoverRef = useRef(0);
  const pressBurstRef = useRef(0);
  const interactionRef = useRef(0);
  const previousPressedRef = useRef(pressed);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const introBlend = smoothStep(clamp01(introProgress));

    hoverRef.current = THREE.MathUtils.lerp(hoverRef.current, hovering ? 1 : 0, 1 - Math.exp(-step * 6));

    if (pressed) {
      pressBurstRef.current = 1;
    } else {
      pressBurstRef.current = Math.max(
        0,
        pressBurstRef.current - step / Math.max(0.001, loadProfile.colors.clickBoostDuration)
      );
    }

    if (pressed && !previousPressedRef.current) {
      pressBurstRef.current = 1;
    }
    previousPressedRef.current = pressed;

    const interactionTarget = clamp01(
      hoverRef.current * 0.3 + pressBurstRef.current * 0.68 + introBlend * 0.14
    );
    interactionRef.current = THREE.MathUtils.lerp(
      interactionRef.current,
      interactionTarget,
      1 - Math.exp(-step * 7)
    );

    const phaseSpeed =
      Math.max(0.018, loadProfile.colors.cycleSpeed) *
      (1 + pressBurstRef.current * Math.max(0, loadProfile.colors.clickCycleBoost) * 0.42);
    phaseRef.current = wrap01(phaseRef.current + step * phaseSpeed);
    const palettePhaseSpeed =
      Math.max(0.0045, loadProfile.colors.cycleSpeed * 0.18) *
      (1 + pressBurstRef.current * Math.max(0, loadProfile.colors.clickCycleBoost) * 0.08);
    palettePhaseRef.current = wrap01(palettePhaseRef.current + step * palettePhaseSpeed);

    const baseHsl = { h: 0, s: 0, l: 0 };
    basePalette.baseColor.getHSL(baseHsl);

    const phase = phaseRef.current * TAU;
    const paletteCyclePosition = palettePhaseRef.current * paletteLoop.length;
    const paletteIndex = Math.floor(paletteCyclePosition) % paletteLoop.length;
    const nextPaletteIndex = (paletteIndex + 1) % paletteLoop.length;
    const paletteBlend = smoothStep(paletteCyclePosition - Math.floor(paletteCyclePosition));
    const paletteFamily = mixPaletteFamily(
      paletteLoop[paletteIndex],
      paletteLoop[nextPaletteIndex],
      paletteBlend
    );
    const slowWave = Math.sin(phase + loadProfile.seed * 0.003);
    const driftWave = Math.sin(phase * 0.42 + loadProfile.colors.hueShift * TAU * 0.5 + 1.7);
    const glowWave = Math.cos(phase * 0.93 - 0.2);
    const rippleWave = Math.sin(phase * 1.85 + loadProfile.colors.lightnessShift * 7.1);

    const shellHue = wrap01(
      baseHsl.h +
        loadProfile.colors.hueShift +
        paletteFamily.shellHueOffset +
        slowWave * paletteFamily.shellHueDrift +
        interactionRef.current * paletteFamily.interactionHueBoost
    );
    const shellSat = clamp01(
      baseHsl.s * paletteFamily.shellSatScale +
        loadProfile.colors.saturationShift +
        paletteFamily.shellSatOffset +
        driftWave * paletteFamily.shellSatDrift +
        introBlend * 0.04
    );
    const shellLight = clamp01(
      baseHsl.l * paletteFamily.shellLightScale +
        loadProfile.colors.lightnessShift +
        paletteFamily.shellLightOffset +
        glowWave * paletteFamily.shellLightDrift +
        interactionRef.current * paletteFamily.interactionLightBoost
    );

    applyHsl(
      workingColors.shellBase,
      shellHue,
      shellSat,
      shellLight
    );
    applyHsl(
      workingColors.shellGlow,
      shellHue + paletteFamily.glowHueOffset + rippleWave * paletteFamily.glowHueDrift,
      clamp01(shellSat * paletteFamily.glowSatScale + paletteFamily.glowSatOffset),
      clamp01(shellLight + paletteFamily.glowLightOffset + glowWave * paletteFamily.glowLightDrift)
    );
    applyHsl(
      workingColors.shellAccent,
      shellHue + paletteFamily.accentHueOffset + slowWave * paletteFamily.accentHueDrift,
      clamp01(shellSat * paletteFamily.accentSatScale + paletteFamily.accentSatOffset),
      clamp01(shellLight + paletteFamily.accentLightOffset + rippleWave * paletteFamily.accentLightDrift)
    );
    applyHsl(
      workingColors.shellDeep,
      shellHue + paletteFamily.deepHueOffset + driftWave * paletteFamily.deepHueDrift,
      clamp01(shellSat * paletteFamily.deepSatScale + paletteFamily.deepSatOffset),
      clamp01(shellLight + paletteFamily.deepLightOffset)
    );
    workingColors.highlight.copy(darkMode ? DARK_HIGHLIGHT : LIGHT_HIGHLIGHT);

    dynamicColors.shellPalette.baseColor.lerp(workingColors.shellBase, 1 - Math.exp(-step * 9));
    dynamicColors.shellPalette.glowColor.lerp(workingColors.shellGlow, 1 - Math.exp(-step * 9));
    dynamicColors.shellPalette.accentColor.lerp(workingColors.shellAccent, 1 - Math.exp(-step * 9));
    dynamicColors.shellPalette.deepColor.lerp(workingColors.shellDeep, 1 - Math.exp(-step * 9));
    dynamicColors.highlightTone.lerp(workingColors.highlight, 1 - Math.exp(-step * 9));
    syncPaletteHex(dynamicColors.shellPalette);

    const contrastSeed = wrap01(loadProfile.seed * 0.00000013);
    const nucleusHue = contrastHueFromShell(
      shellHue,
      paletteFamily.accentHueOffset * 0.82 + 0.04 + contrastSeed * 0.08 + slowWave * 0.018
    );

    applyHsl(
      workingColors.nucleus,
      nucleusHue + interactionRef.current * 0.02,
      clamp01(shellSat * 1.04 + 0.14 + introBlend * 0.06 + interactionRef.current * 0.06),
      clamp01(shellLight + 0.18 + glowWave * 0.04 + interactionRef.current * 0.05)
    );
    dynamicColors.organelles.nucleus.lerp(workingColors.nucleus, 1 - Math.exp(-step * 9));

    for (let i = 0; i < dynamicColors.organelles.mitochondria.length; i++) {
      const spread = dynamicColors.organelles.mitochondria.length > 1
        ? i / (dynamicColors.organelles.mitochondria.length - 1)
        : 0;
      const hue = contrastHueFromShell(
        shellHue,
        0.16 + contrastSeed * 0.08 + spread * 0.72 + (i % 2 === 0 ? 0.07 : -0.04) + slowWave * 0.03
      );
      applyHsl(
        workingColors.mitochondria[i],
        hue,
        clamp01(0.78 + (i % 3) * 0.08 + interactionRef.current * 0.05),
        clamp01(0.54 + spread * 0.18 + (i % 2) * 0.04)
      );
      dynamicColors.organelles.mitochondria[i].lerp(
        workingColors.mitochondria[i],
        1 - Math.exp(-step * 9)
      );
    }

    for (let i = 0; i < dynamicColors.organelles.vesicles.length; i++) {
      const spread = dynamicColors.organelles.vesicles.length > 1
        ? i / (dynamicColors.organelles.vesicles.length - 1)
        : 0;
      const hue = contrastHueFromShell(
        shellHue,
        0.34 +
          contrastSeed * 0.14 +
          spread * 0.86 +
          ((i * GOLDEN_OFFSET) % 1) * 0.16 -
          driftWave * 0.025
      );
      applyHsl(
        workingColors.vesicles[i],
        hue,
        clamp01(0.72 + (i % 4) * 0.06 + introBlend * 0.05),
        clamp01(0.58 + spread * 0.16 + (i % 3) * 0.04)
      );
      dynamicColors.organelles.vesicles[i].lerp(
        workingColors.vesicles[i],
        1 - Math.exp(-step * 9)
      );
    }

    dynamicColors.shellOpacity = THREE.MathUtils.lerp(
      dynamicColors.shellOpacity,
      clamp01(
        loadProfile.shell.opacity * (0.86 + introBlend * 0.14) -
          pressBurstRef.current * 0.04 +
          hoverRef.current * 0.02
      ),
      1 - Math.exp(-step * 6)
    );
    dynamicColors.haloOpacity = THREE.MathUtils.lerp(
      dynamicColors.haloOpacity,
      clamp01(
        loadProfile.shell.haloOpacity * (0.9 + introBlend * 0.1) +
          pressBurstRef.current * 0.05 +
          hoverRef.current * 0.03
      ),
      1 - Math.exp(-step * 6)
    );

    dynamicColors.cyclePhase = phaseRef.current;
    dynamicColors.interactionAmount = interactionRef.current;
    dynamicColors.clickBurst = pressBurstRef.current;
  });

  return dynamicColors;
};

export default useWaveOrbColorCycle;
