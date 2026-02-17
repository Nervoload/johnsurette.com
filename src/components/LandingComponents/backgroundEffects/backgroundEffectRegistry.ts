import BioticParticlesEffect from "./effects/BioticParticlesEffect";
import ChromaticRibbonLatticeEffect from "./effects/ChromaticRibbonLatticeEffect";
import VolumetricBiofieldEffect from "./effects/VolumetricBiofieldEffect";
import VolumetricCausticDriftEffect from "./effects/VolumetricCausticDriftEffect";
import { BackgroundEffectEntry, BackgroundEffectId } from "./types";

export const backgroundEffectRegistry: Record<BackgroundEffectId, BackgroundEffectEntry> = {
  bioticParticles: {
    id: "bioticParticles",
    label: "Biotic Particles",
    requiresWebGL: false,
    component: BioticParticlesEffect,
  },
  volumetricCausticDrift: {
    id: "volumetricCausticDrift",
    label: "Volumetric Caustic Drift",
    requiresWebGL: true,
    component: VolumetricCausticDriftEffect,
  },
  chromaticRibbonLattice: {
    id: "chromaticRibbonLattice",
    label: "Chromatic Ribbon Lattice",
    requiresWebGL: true,
    component: ChromaticRibbonLatticeEffect,
  },
  volumetricBiofield: {
    id: "volumetricBiofield",
    label: "Volumetric Biofield",
    requiresWebGL: true,
    component: VolumetricBiofieldEffect,
  },
};

export const defaultBackgroundEffectId: BackgroundEffectId = "bioticParticles";
