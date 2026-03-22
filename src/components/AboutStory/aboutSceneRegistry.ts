import type { ComponentType } from "react";
import type { AboutStoryNodeType } from "../../content/aboutStory";
import type { AboutSceneComponentProps } from "./types";
import AbstractPlaceholderScene from "./scenes/AbstractPlaceholderScene";
import DecisionBranchScene from "./scenes/DecisionBranchScene";
import GlobeTravelScene from "./scenes/GlobeTravelScene";
import IntroPortraitScene from "./scenes/IntroPortraitScene";
import LayeredGalleryScene from "./scenes/LayeredGalleryScene";
import StartLandingScene from "./scenes/StartLandingScene";

export const aboutSceneRegistry: Record<AboutStoryNodeType, ComponentType<AboutSceneComponentProps>> = {
  landing: StartLandingScene,
  introPortrait: IntroPortraitScene,
  globeTravel: GlobeTravelScene,
  layeredGallery: LayeredGalleryScene,
  decisionBranch: DecisionBranchScene,
  cityScene: AbstractPlaceholderScene,
  presentSummary: AbstractPlaceholderScene,
  futureVision: AbstractPlaceholderScene,
};
