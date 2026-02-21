import { OriginBeatId, OriginSceneEntry } from "./types";
import UniqueQuestionScene from "./scenes/UniqueQuestionScene";
import AtomicEmergenceScene from "./scenes/AtomicEmergenceScene";
import ConsciousnessNetworkScene from "./scenes/ConsciousnessNetworkScene";
import HumanEyeScene from "./scenes/HumanEyeScene";
import PlanetaryExpansionScene from "./scenes/PlanetaryExpansionScene";
import GalaxyFutureScene from "./scenes/GalaxyFutureScene";

export const originSceneRegistry: Record<OriginBeatId, OriginSceneEntry> = {
  question: {
    id: "question",
    component: UniqueQuestionScene,
    assetSlot: "quantum-question-field",
  },
  atoms: {
    id: "atoms",
    component: AtomicEmergenceScene,
    assetSlot: "atomic-emergence",
  },
  network: {
    id: "network",
    component: ConsciousnessNetworkScene,
    assetSlot: "neural-emergence-network",
  },
  eye: {
    id: "eye",
    component: HumanEyeScene,
    assetSlot: "human-eye-macro",
  },
  planet: {
    id: "planet",
    component: PlanetaryExpansionScene,
    assetSlot: "planetary-civilization",
  },
  galaxy: {
    id: "galaxy",
    component: GalaxyFutureScene,
    assetSlot: "galaxy-future-field",
  },
};
