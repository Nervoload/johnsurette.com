import type { ComponentType } from "react";
import type { LoopClock, StageSpec } from "./core/loopClock.ts";
import type { LivingThemeMode } from "./core/themeTokens.ts";
import type { LivingSharedUniforms } from "./shaders/livingCommon.ts";

export type LivingQualityTier = "high" | "low" | "static";
export type LivingSceneId = "forwardPass" | "brainScales";

export interface LivingStage extends StageSpec {
  /** Short name for the stage dot (e.g. "Convolve"). */
  readonly label: string;
  /** Mono caption shown under the visual while the stage is active. */
  readonly caption: string;
  /** Representative moment (0..1 of the stage) shown when stepping with reduced motion. Default 0.62. */
  readonly keyframe?: number;
}

export interface LivingClick {
  ndcX: number;
  ndcY: number;
  touch: boolean;
}

/** Mutable, ref-held pointer state. Written by DOM handlers, read inside useFrame. Never React state. */
export interface LivingPointerState {
  /** Pointer position in canvas NDC (-1..1, y up), relative to the full bleed canvas. */
  ndcX: number;
  ndcY: number;
  /** Position relative to the slot (-1..1), for gentle parallax. */
  slotX: number;
  slotY: number;
  hover: boolean;
  pressed: boolean;
  dragging: boolean;
  focus: boolean;
  /** Orbit offset requested by dragging (radians). Scenes ease toward it and back to 0. */
  orbitYaw: number;
  orbitPitch: number;
  /** performance.now() until which a touch tap keeps the scene slowed. */
  engagedUntil: number;
  clicks: LivingClick[];
}

export interface LivingLabelSpec {
  readonly id: string;
  readonly text: string;
  readonly tone?: "ink" | "muted" | "accent" | "warm" | "amber";
  readonly align?: "left" | "center" | "right";
}

export interface LivingLabels {
  get(id: string): HTMLElement | null;
}

export interface LivingRuntime {
  readonly clock: LoopClock;
  readonly pointer: LivingPointerState;
  readonly shared: LivingSharedUniforms;
  readonly labels: LivingLabels;
  tier: LivingQualityTier;
  handheld: boolean;
  reducedMotion: boolean;
  /** Multiplier for element counts: 1 on high, 0.5 on low. */
  density: number;
  themeMode: LivingThemeMode;
  /** Slot width / height. Scenes pick portrait or landscape layouts from it. */
  slotAspect: number;
  /** Ask for one more frame when rendering on demand (reduced motion, frozen, offscreen warm-up). */
  invalidate(): void;
  /** Engaged = hovered, pressed, dragged, focused or recently tapped. */
  isEngaged(): boolean;
}

export interface LivingSceneProps<TContent> {
  runtime: LivingRuntime;
  content: TContent;
}

export interface LivingSceneDefinition<TContent> {
  readonly id: LivingSceneId;
  readonly stages: readonly LivingStage[];
  readonly labels: readonly LivingLabelSpec[];
  /** Framing for the slot (not the bleed canvas); the host widens the fov for the bleed. */
  readonly camera: { position: [number, number, number]; fov: number };
  /** Stage shown first with reduced motion (the most complete single picture). Default 0. */
  readonly stillStage?: number;
  readonly Scene: ComponentType<LivingSceneProps<TContent>>;
}
