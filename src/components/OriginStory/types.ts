import { ComponentType } from "react";

export type OriginBeatId = "spark" | "biology" | "mind" | "build" | "augmentation" | "trajectory";

export type OriginOverlayMode = "editorial" | "field" | "signal";
export type OriginQualityTier = "mobile" | "balanced" | "ultra";
export type OriginScrollPhase = "intro" | "float" | "handoff" | "outro";
export type OriginDirection = -1 | 1;

export type OriginSceneSlot =
  | "observatory-workbench"
  | "longevity-bio-lab"
  | "neural-atlas-lab"
  | "studio-prototype-bench"
  | "augmentation-chamber"
  | "orbital-future-bridge";

export interface OriginPalette {
  backdrop: string;
  accent: string;
  secondary: string;
  glow: string;
  fog: string;
  panel: string;
  text: string;
}

export interface OriginCameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  parallax: number;
  drift: number;
  roll?: number;
}

export interface OriginLightPreset {
  ambientIntensity: number;
  keyIntensity: number;
  keyPosition: [number, number, number];
  fillIntensity: number;
  fillPosition: [number, number, number];
  rimIntensity: number;
}

export interface OriginHotspotDefinition {
  id: string;
  label: string;
  title: string;
  body: string;
  tint: string;
  anchor: [number, number];
  mobileAnchor?: [number, number];
  focusTarget: [number, number, number];
  cameraOffset: [number, number, number];
  subsceneId?: string;
}

export interface OriginSubsceneDefinition {
  id: string;
  hotspotId: string;
  kicker: string;
  label: string;
  title: string;
  body: string;
  progressLabel: string;
  accent: string;
  camera: OriginCameraPreset;
  focusTarget: [number, number, number];
  cameraOffset: [number, number, number];
}

export interface OriginSceneLayerBudget {
  backgroundDensity: number;
  foregroundDensity: number;
  detailBoost: number;
  bloomStrength: number;
}

export interface OriginBeatDefinition {
  id: OriginBeatId;
  chapterLabel: string;
  kicker: string;
  title: string;
  line: string;
  detail: string;
  overlayMode: OriginOverlayMode;
  tags: string[];
  scrollWeight: number;
  entryTransitionPct: number;
  holdPct: number;
  exitTransitionPct: number;
  assetSlot: OriginSceneSlot;
  palette: OriginPalette;
  camera: OriginCameraPreset;
  lighting: OriginLightPreset;
  layerBudget: OriginSceneLayerBudget;
  hotspots: OriginHotspotDefinition[];
  subscenes: OriginSubsceneDefinition[];
}

export interface OriginPointer {
  x: number;
  y: number;
}

export interface OriginSubsceneRuntime {
  beatId: OriginBeatId;
  definition: OriginSubsceneDefinition;
  progress: number;
  blend: number;
  mode: "entering" | "active" | "exiting";
  lockedScrollTop: number;
}

export interface OriginSceneComponentProps {
  beat: OriginBeatDefinition;
  assetConfig: OriginAssetSlotConfig;
  weight: number;
  localProgress: number;
  holdProgress: number;
  globalProgress: number;
  pointer: OriginPointer;
  reducedMotion: boolean;
  qualityTier: OriginQualityTier;
  qualityFactor: number;
  phase: OriginScrollPhase;
  phaseProgress: number;
  sceneMix: number;
  isActive: boolean;
  isAdjacent: boolean;
  transitionDirection: OriginDirection;
  activeHotspotId: string | null;
  activeSubscene: OriginSubsceneRuntime | null;
}

export interface OriginSceneEntry {
  id: OriginBeatId;
  component: ComponentType<OriginSceneComponentProps>;
  assetSlot: OriginSceneSlot;
}

export interface OriginChapterRuntime {
  beat: OriginBeatDefinition;
  index: number;
  start: number;
  end: number;
  length: number;
  rawProgress: number;
  localProgress: number;
  holdProgress: number;
  phase: OriginScrollPhase;
  phaseProgress: number;
  weight: number;
}

export interface OriginTransitionState {
  fromId: OriginBeatId;
  toId: OriginBeatId;
  boundaryIndex: number;
  strength: number;
  progress: number;
  direction: OriginDirection;
  adjacentIndex: number | null;
  sceneMix: number;
  cameraMix: number;
}

export interface OriginTimelineState {
  rawProgress: number;
  smoothedProgress: number;
  chapters: OriginChapterRuntime[];
  activeIndex: number;
  adjacentIndex: number | null;
  renderedChapterIndices: number[];
  transition: OriginTransitionState | null;
}

export type OriginAssetMaterialPreset =
  | "obsidian-brass"
  | "bioluminescent-gel"
  | "cortical-glass"
  | "studio-carbon"
  | "surgical-titanium"
  | "orbital-composite";

export type OriginAssetLodPolicy = "auto" | "high-desktop" | "balanced" | "mobile-lite";
export type OriginAssetAnchor = "center" | "bottom";
export type OriginAssetFallbackKind =
  | "observatory"
  | "biology"
  | "mind"
  | "build"
  | "augmentation"
  | "trajectory";

export interface OriginAssetTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface OriginAssetQualityProfile {
  particleMultiplier: number;
  allowBloom: boolean;
  secondaryProps: boolean;
  assetScaleByTier: Partial<Record<OriginQualityTier, number>>;
}

export interface OriginSupportingModel {
  id: string;
  label: string;
  url: string;
  transform: OriginAssetTransform;
  fitHeight?: number;
  anchor?: OriginAssetAnchor;
  qualityTiers?: OriginQualityTier[];
}

export interface OriginAssetSlotConfig {
  slotId: OriginSceneSlot;
  glbUrl?: string;
  environmentUrl?: string;
  supportingModels: OriginSupportingModel[];
  fallbackSceneId: OriginBeatId;
  fallbackKind: OriginAssetFallbackKind;
  materialPreset: OriginAssetMaterialPreset;
  lodPolicy: OriginAssetLodPolicy;
  transform: OriginAssetTransform;
  quality: OriginAssetQualityProfile;
  creditIds: string[];
}

export type OriginAssetManifest = Record<OriginSceneSlot, OriginAssetSlotConfig>;

export interface OriginAssetCreditEntry {
  id: string;
  kind: "model" | "hdri" | "texture";
  title: string;
  author: string;
  license: string;
  sourceUrl: string;
  attribution: string;
  usage: OriginBeatId[];
}
