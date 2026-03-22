import type {
  AboutAbstractSceneProps,
  AboutCameraPose,
  AboutDecisionBranchSceneProps,
  AboutGlobeTravelSceneProps,
  AboutIntroPortraitSceneProps,
  AboutLandingSceneProps,
  AboutLayeredGallerySceneProps,
  AboutStoryNode,
} from "../../content/aboutStory";
import type { AboutStoryPointer, AboutStoryQualityMode } from "./types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothStep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const mixCameraPoses = (from: AboutCameraPose, to: AboutCameraPose, mix: number): AboutCameraPose => ({
  position: [
    lerp(from.position[0], to.position[0], mix),
    lerp(from.position[1], to.position[1], mix),
    lerp(from.position[2], to.position[2], mix),
  ],
  target: [
    lerp(from.target[0], to.target[0], mix),
    lerp(from.target[1], to.target[1], mix),
    lerp(from.target[2], to.target[2], mix),
  ],
  fov: lerp(from.fov, to.fov, mix),
});

const withPointerParallax = (
  pose: AboutCameraPose,
  pointer: AboutStoryPointer,
  qualityMode: AboutStoryQualityMode,
): AboutCameraPose => {
  const parallax = qualityMode === "reduced" ? 0.04 : 0.12;
  return {
    ...pose,
    position: [
      pose.position[0] + pointer.x * parallax,
      pose.position[1] + pointer.y * parallax * 0.6,
      pose.position[2],
    ],
    target: [
      pose.target[0] + pointer.x * parallax * 0.26,
      pose.target[1] + pointer.y * parallax * 0.16,
      pose.target[2],
    ],
  };
};

const sampleRail = (
  sceneProps:
    | AboutLandingSceneProps
    | AboutLayeredGallerySceneProps
    | AboutIntroPortraitSceneProps
    | AboutDecisionBranchSceneProps
    | AboutAbstractSceneProps,
  nodeProgress: number,
) => mixCameraPoses(sceneProps.camera.start, sceneProps.camera.end, smoothStep(nodeProgress));

const sampleGlobeRail = (sceneProps: AboutGlobeTravelSceneProps, nodeProgress: number) => {
  if (nodeProgress <= 0.46) {
    return mixCameraPoses(sceneProps.camera.start, sceneProps.camera.focus, smoothStep(nodeProgress / 0.46));
  }

  return mixCameraPoses(
    sceneProps.camera.focus,
    sceneProps.camera.arrival,
    smoothStep((nodeProgress - 0.46) / 0.54),
  );
};

export const sampleNodeCameraPose = (
  node: AboutStoryNode,
  nodeProgress: number,
  pointer: AboutStoryPointer,
  qualityMode: AboutStoryQualityMode,
) => {
  const localProgress = clamp01(nodeProgress);

  let pose: AboutCameraPose;
  switch (node.type) {
    case "landing":
      pose = sampleRail(node.sceneProps, localProgress);
      break;
    case "globeTravel":
      pose = sampleGlobeRail(node.sceneProps, localProgress);
      break;
    case "layeredGallery":
      pose = sampleRail(node.sceneProps, localProgress);
      break;
    case "introPortrait":
      pose = sampleRail(node.sceneProps, localProgress);
      break;
    case "decisionBranch":
      pose = sampleRail(node.sceneProps, localProgress);
      break;
    case "cityScene":
    case "presentSummary":
    case "futureVision":
      pose = sampleRail(node.sceneProps, localProgress);
      break;
    default:
      pose = {
        position: [0, 0.1, 6],
        target: [0, 0, 0],
        fov: 36,
      };
  }

  return withPointerParallax(pose, pointer, qualityMode);
};
