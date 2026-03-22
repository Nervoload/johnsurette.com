import * as THREE from "three";
import { sections } from "../../../sections";
import { Palette } from "./types";

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const smoothStep = (value: number) => value * value * (3 - 2 * value);

export const randomUnitVector = (): THREE.Vector3 => {
  const z = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return new THREE.Vector3(r * Math.cos(t), z, r * Math.sin(t));
};

export const perpendicularTo = (vector: THREE.Vector3): THREE.Vector3 => {
  const basis = Math.abs(vector.y) > 0.8 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  return new THREE.Vector3().crossVectors(vector, basis).normalize();
};

export const createSeededRandom = (seed: number) => {
  let state = (seed >>> 0) || 0x6d2b79f5;

  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const randomUnitVectorFrom = (random: () => number): THREE.Vector3 => {
  const z = random() * 2 - 1;
  const t = random() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return new THREE.Vector3(r * Math.cos(t), z, r * Math.sin(t));
};

export const pickRange = (random: () => number, min: number, max: number) => min + (max - min) * random();

export const buildBasePalette = (activeSection: string | null): Palette => {
  const baseColor = new THREE.Color(
    sections.find((section) => section.name === activeSection)?.color ?? "#06b6d4"
  );

  const hsl = { h: 0, s: 0, l: 0 };
  baseColor.getHSL(hsl);

  const glowColor = new THREE.Color().setHSL(
    (hsl.h + 0.09) % 1,
    clamp01(hsl.s * 0.95 + 0.18),
    clamp01(hsl.l + 0.18)
  );
  const accentColor = new THREE.Color().setHSL(
    (hsl.h + 0.25) % 1,
    clamp01(hsl.s + 0.28),
    clamp01(hsl.l + 0.14)
  );
  const deepColor = new THREE.Color().setHSL(
    (hsl.h + 0.58) % 1,
    clamp01(hsl.s * 0.62 + 0.2),
    0.08
  );

  return {
    baseHex: `#${baseColor.getHexString()}`,
    glowHex: `#${glowColor.getHexString()}`,
    accentHex: `#${accentColor.getHexString()}`,
    deepHex: `#${deepColor.getHexString()}`,
    baseColor,
    glowColor,
    accentColor,
    deepColor,
  };
};

export const clonePalette = (palette: Palette): Palette => ({
  baseHex: `#${palette.baseColor.getHexString()}`,
  glowHex: `#${palette.glowColor.getHexString()}`,
  accentHex: `#${palette.accentColor.getHexString()}`,
  deepHex: `#${palette.deepColor.getHexString()}`,
  baseColor: palette.baseColor.clone(),
  glowColor: palette.glowColor.clone(),
  accentColor: palette.accentColor.clone(),
  deepColor: palette.deepColor.clone(),
});
