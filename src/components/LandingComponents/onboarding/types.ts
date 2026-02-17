export type HintId = "scroll" | "nav";

export interface HintVisibilityState {
  scroll: boolean;
  nav: boolean;
}

export interface OnboardingRuntimeState {
  firstVisit: boolean;
  firstVisitLockUntil: number;
  scrollCompleted: boolean;
  navCompleted: boolean;
  lastActivityAt: number;
  scrollTop: number;
}

