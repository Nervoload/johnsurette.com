import { OriginBeatId, OriginSceneEntry } from "./types";
import AugmentationChamberScene from "./scenes/AugmentationChamberScene";
import BiologyLabScene from "./scenes/BiologyLabScene";
import NeuralAtlasScene from "./scenes/NeuralAtlasScene";
import OrbitalTrajectoryScene from "./scenes/OrbitalTrajectoryScene";
import ObservatoryWorkbenchScene from "./scenes/ObservatoryWorkbenchScene";
import StudioPrototypeScene from "./scenes/StudioPrototypeScene";

export const originSceneRegistry: Record<OriginBeatId, OriginSceneEntry> = {
  spark: {
    id: "spark",
    component: ObservatoryWorkbenchScene,
    assetSlot: "observatory-workbench",
  },
  biology: {
    id: "biology",
    component: BiologyLabScene,
    assetSlot: "longevity-bio-lab",
  },
  mind: {
    id: "mind",
    component: NeuralAtlasScene,
    assetSlot: "neural-atlas-lab",
  },
  build: {
    id: "build",
    component: StudioPrototypeScene,
    assetSlot: "studio-prototype-bench",
  },
  augmentation: {
    id: "augmentation",
    component: AugmentationChamberScene,
    assetSlot: "augmentation-chamber",
  },
  trajectory: {
    id: "trajectory",
    component: OrbitalTrajectoryScene,
    assetSlot: "orbital-future-bridge",
  },
};
