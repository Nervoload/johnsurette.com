import { ComponentType } from "react";
import { DensityPreset, PalettePreset } from "../biotic/types";

export type BackgroundEffectId =
  | "bioticParticles"
  | "volumetricCausticDrift"
  | "chromaticRibbonLattice"
  | "volumetricBiofield";

export type BackgroundQualityPreset = "mobile" | "balanced" | "ultra";

export type BackgroundInteractionMode = "off" | "subtle" | "medium";

export interface BackgroundEffectProps {
  quality: BackgroundQualityPreset;
  interactionMode: BackgroundInteractionMode;
  styleSeed: number;
  reducedMotion: boolean;
  className?: string;

  // Legacy biotic controls retained for compatibility.
  preset?: DensityPreset;
  palette?: PalettePreset;
  flowStrength?: number;
}

export interface BackgroundEffectEntry {
  id: BackgroundEffectId;
  label: string;
  requiresWebGL: boolean;
  component: ComponentType<BackgroundEffectProps>;
}
