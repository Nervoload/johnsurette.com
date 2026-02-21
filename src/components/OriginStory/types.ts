import { ComponentType } from "react";

export type OriginBeatId = "question" | "atoms" | "network" | "eye" | "planet" | "galaxy";

export type OriginTextMode = "overlay" | "emissive" | "starfield";
export type OriginQualityTier = "mobile" | "balanced" | "ultra";

export type OriginSceneSlot =
  | "quantum-question-field"
  | "atomic-emergence"
  | "neural-emergence-network"
  | "human-eye-macro"
  | "planetary-civilization"
  | "galaxy-future-field";

export interface OriginBeatDefinition {
  id: OriginBeatId;
  chapterLabel: string;
  title: string;
  line: string;
  textMode: OriginTextMode;
  scrollWeight: number;
  entryTransitionPct: number;
  holdPct: number;
  exitTransitionPct: number;
  assetSlot: OriginSceneSlot;
}

export interface OriginPointer {
  x: number;
  y: number;
}

export interface OriginSceneComponentProps {
  weight: number;
  localProgress: number;
  globalProgress: number;
  pointer: OriginPointer;
  reducedMotion: boolean;
  qualityTier: OriginQualityTier;
  qualityFactor: number;
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
  weight: number;
}

export interface OriginTransitionState {
  fromId: OriginBeatId;
  toId: OriginBeatId;
  boundaryIndex: number;
  strength: number;
  progress: number;
}

export interface OriginTimelineState {
  progress: number;
  chapters: OriginChapterRuntime[];
  activeIndex: number;
  transition: OriginTransitionState | null;
}

export type OriginAssetMaterialPreset =
  | "crystalline-cyan"
  | "bio-lattice"
  | "neural-ember"
  | "ocular-wet"
  | "orbital-steel"
  | "stellar-dust";

export type OriginAssetLodPolicy = "auto" | "high-desktop" | "balanced" | "mobile-lite";

export interface OriginAssetTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface OriginAssetSlotConfig {
  slotId: OriginSceneSlot;
  glbUrl?: string;
  fallbackSceneId: OriginBeatId;
  materialPreset: OriginAssetMaterialPreset;
  lodPolicy: OriginAssetLodPolicy;
  transform: OriginAssetTransform;
}

export type OriginAssetManifest = Record<OriginSceneSlot, OriginAssetSlotConfig>;
