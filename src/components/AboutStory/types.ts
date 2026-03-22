import type { AboutStoryNode } from "../../content/aboutStory";

export type AboutStoryDirection = -1 | 1;
export type AboutStoryQualityMode = "full" | "reduced";

export interface AboutStoryPointer {
  x: number;
  y: number;
}

export interface AboutStoryOverlayState {
  timelineDockProgress: number;
  branchHostVisible: boolean;
  branchPath: string[];
}

export interface AboutSceneComponentProps {
  node: AboutStoryNode;
  globalProgress: number;
  nodeProgress: number;
  mix: number;
  direction: AboutStoryDirection;
  isActive: boolean;
  isAdjacent: boolean;
  qualityMode: AboutStoryQualityMode;
  pointer: AboutStoryPointer;
  overlayState: AboutStoryOverlayState;
}

export interface AboutTimelineTransition {
  fromId: string;
  toId: string;
  boundaryIndex: number;
  strength: number;
  progress: number;
  sceneMix: number;
  cameraMix: number;
  direction: AboutStoryDirection;
}

export interface AboutTimelineNodeRuntime {
  node: AboutStoryNode;
  index: number;
  start: number;
  end: number;
  length: number;
  rawProgress: number;
  nodeProgress: number;
  mix: number;
}

export interface AboutTimelineState {
  rawProgress: number;
  smoothedProgress: number;
  activeIndex: number;
  adjacentIndex: number | null;
  transition: AboutTimelineTransition | null;
  nodes: AboutTimelineNodeRuntime[];
  renderedNodeIds: string[];
}
