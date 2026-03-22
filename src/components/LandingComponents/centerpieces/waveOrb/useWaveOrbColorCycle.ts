import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, clonePalette, smoothStep } from "./shared";
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

const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
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

  const phaseRef = useRef(wrap01(loadProfile.seed * 0.61803398875));
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

    const baseHsl = { h: 0, s: 0, l: 0 };
    basePalette.baseColor.getHSL(baseHsl);

    const phase = phaseRef.current * TAU;
    const slowWave = Math.sin(phase + loadProfile.seed * 0.003);
    const driftWave = Math.sin(phase * 0.42 + loadProfile.colors.hueShift * TAU * 0.5 + 1.7);
    const glowWave = Math.cos(phase * 0.93 - 0.2);
    const rippleWave = Math.sin(phase * 1.85 + loadProfile.colors.lightnessShift * 7.1);

    const shellHue = wrap01(
      baseHsl.h + loadProfile.colors.hueShift + slowWave * 0.055 + interactionRef.current * 0.022
    );
    const shellSat = clamp01(
      baseHsl.s + loadProfile.colors.saturationShift + driftWave * 0.06 + introBlend * 0.04
    );
    const shellLight = clamp01(
      baseHsl.l + loadProfile.colors.lightnessShift + glowWave * 0.05 + interactionRef.current * 0.03
    );

    applyHsl(
      workingColors.shellBase,
      shellHue,
      shellSat,
      shellLight
    );
    applyHsl(
      workingColors.shellGlow,
      shellHue + 0.08 + rippleWave * 0.02,
      clamp01(shellSat * 0.96 + 0.04),
      clamp01(shellLight + 0.14)
    );
    applyHsl(
      workingColors.shellAccent,
      shellHue + 0.23 + slowWave * 0.03,
      clamp01(shellSat + 0.1),
      clamp01(shellLight + 0.18)
    );
    applyHsl(
      workingColors.shellDeep,
      shellHue + 0.56 + driftWave * 0.02,
      clamp01(shellSat * 0.76),
      clamp01(shellLight - 0.2)
    );
    workingColors.highlight.copy(darkMode ? DARK_HIGHLIGHT : LIGHT_HIGHLIGHT);

    dynamicColors.shellPalette.baseColor.lerp(workingColors.shellBase, 1 - Math.exp(-step * 9));
    dynamicColors.shellPalette.glowColor.lerp(workingColors.shellGlow, 1 - Math.exp(-step * 9));
    dynamicColors.shellPalette.accentColor.lerp(workingColors.shellAccent, 1 - Math.exp(-step * 9));
    dynamicColors.shellPalette.deepColor.lerp(workingColors.shellDeep, 1 - Math.exp(-step * 9));
    dynamicColors.highlightTone.lerp(workingColors.highlight, 1 - Math.exp(-step * 9));
    syncPaletteHex(dynamicColors.shellPalette);

    const contrastSeed = wrap01(loadProfile.seed * 0.00000013);
    const nucleusHue = contrastHueFromShell(shellHue, 0.46 + contrastSeed * 0.12 + slowWave * 0.02);

    applyHsl(
      workingColors.nucleus,
      nucleusHue + interactionRef.current * 0.02,
      clamp01(0.82 + introBlend * 0.08 + interactionRef.current * 0.06),
      clamp01(0.62 + glowWave * 0.04 + interactionRef.current * 0.05)
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
