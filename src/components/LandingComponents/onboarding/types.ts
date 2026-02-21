export type HintId = "scroll" | "nav";

export type HintLifecycleState = "hidden" | "entering" | "visible" | "exiting";

export type HintVisibilityState = Record<HintId, HintLifecycleState>;

export interface OnboardingRuntimeState {
  scrollCompleted: boolean;
  navCompleted: boolean;
  scrollTop: number;
}
