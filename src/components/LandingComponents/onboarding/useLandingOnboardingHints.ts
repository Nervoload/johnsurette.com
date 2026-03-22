import { RefObject, useEffect, useRef, useState } from "react";
import { HintId, HintLifecycleState, HintVisibilityState, OnboardingRuntimeState } from "./types";

export const SCROLL_PROGRESS_THRESHOLD_PX = 72;

const ENTER_MS = 260;
const EXIT_MS = 360;
const DEFAULT_NAV_INTERACTION_LOCK_MS = 0;
const seenVisitHintKeys = new Set<string>();

interface UseLandingOnboardingHintsOptions {
  scrollContainerRef: RefObject<HTMLDivElement>;
  navInteractionTick?: number;
  scrollCompletionThresholdPx?: number;
  dismissAllThresholdPx?: number;
  navInteractionLockMs?: number;
  visitStorageKey?: string;
}

interface UseLandingOnboardingHintsResult {
  scroll: boolean;
  nav: boolean;
  scrollState: HintLifecycleState;
  navState: HintLifecycleState;
}

const hiddenState: HintVisibilityState = {
  scroll: "hidden",
  nav: "hidden",
};

const createRuntimeState = (): OnboardingRuntimeState => ({
  scrollCompleted: false,
  navCompleted: false,
  scrollTop: 0,
});

export const useLandingOnboardingHints = ({
  scrollContainerRef,
  navInteractionTick,
  scrollCompletionThresholdPx = SCROLL_PROGRESS_THRESHOLD_PX,
  dismissAllThresholdPx,
  navInteractionLockMs = DEFAULT_NAV_INTERACTION_LOCK_MS,
  visitStorageKey,
}: UseLandingOnboardingHintsOptions): UseLandingOnboardingHintsResult => {
  const [state, setState] = useState<HintVisibilityState>(hiddenState);
  const stateRef = useRef<HintVisibilityState>(hiddenState);

  const runtimeRef = useRef<OnboardingRuntimeState>(createRuntimeState());
  const timersRef = useRef<Record<HintId, number | null>>({
    scroll: null,
    nav: null,
  });
  const navTickRef = useRef<number>(navInteractionTick ?? 0);
  const navLockUntilRef = useRef(0);
  const deferredNavHideTimerRef = useRef<number | null>(null);
  const visitSeenCommitTimerRef = useRef<number | null>(null);

  const patchState = (id: HintId, next: HintLifecycleState): void => {
    if (stateRef.current[id] === next) return;
    const updated: HintVisibilityState = {
      ...stateRef.current,
      [id]: next,
    };
    stateRef.current = updated;
    setState(updated);
  };

  const clearTimer = (id: HintId): void => {
    const timer = timersRef.current[id];
    if (timer === null) return;
    window.clearTimeout(timer);
    timersRef.current[id] = null;
  };

  const showHint = (id: HintId): void => {
    clearTimer(id);
    const current = stateRef.current[id];
    if (current === "visible" || current === "entering") return;
    patchState(id, "entering");
    timersRef.current[id] = window.setTimeout(() => {
      timersRef.current[id] = null;
      patchState(id, "visible");
    }, ENTER_MS);
  };

  const hideHint = (id: HintId): void => {
    clearTimer(id);
    const current = stateRef.current[id];
    if (current === "hidden" || current === "exiting") return;
    patchState(id, "exiting");
    timersRef.current[id] = window.setTimeout(() => {
      timersRef.current[id] = null;
      patchState(id, "hidden");
    }, EXIT_MS);
  };

  const clearDeferredNavHideTimer = (): void => {
    if (deferredNavHideTimerRef.current === null) return;
    window.clearTimeout(deferredNavHideTimerRef.current);
    deferredNavHideTimerRef.current = null;
  };

  const clearVisitSeenCommitTimer = (): void => {
    if (visitSeenCommitTimerRef.current === null) return;
    window.clearTimeout(visitSeenCommitTimerRef.current);
    visitSeenCommitTimerRef.current = null;
  };

  const completeNavHint = (forceImmediate = false): void => {
    if (forceImmediate) {
      runtimeRef.current.navCompleted = true;
      clearDeferredNavHideTimer();
      hideHint("nav");
      return;
    }

    if (runtimeRef.current.navCompleted) return;
    runtimeRef.current.navCompleted = true;

    const remainingLockMs = Math.max(0, navLockUntilRef.current - Date.now());
    if (remainingLockMs === 0) {
      hideHint("nav");
      return;
    }

    clearDeferredNavHideTimer();
    deferredNavHideTimerRef.current = window.setTimeout(() => {
      deferredNavHideTimerRef.current = null;
      hideHint("nav");
    }, remainingLockMs);
  };

  useEffect(() => {
    navLockUntilRef.current = Date.now() + navInteractionLockMs;

    if (visitStorageKey) {
      const hasSeenHints = seenVisitHintKeys.has(visitStorageKey);
      if (hasSeenHints) return undefined;
      // Defer the visit mark so React dev double-mount doesn't suppress the real first render.
      visitSeenCommitTimerRef.current = window.setTimeout(() => {
        visitSeenCommitTimerRef.current = null;
        seenVisitHintKeys.add(visitStorageKey);
      }, 0);
    }

    showHint("scroll");
    showHint("nav");

    return () => {
      clearTimer("scroll");
      clearTimer("nav");
      clearDeferredNavHideTimer();
      clearVisitSeenCommitTimer();
      runtimeRef.current = createRuntimeState();
      stateRef.current = hiddenState;
    };
    // Intentionally run once per page overlay mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const syncScrollState = (): void => {
      const nextScrollTop = container.scrollTop;
      runtimeRef.current.scrollTop = nextScrollTop;

      if (typeof dismissAllThresholdPx === "number" && nextScrollTop >= dismissAllThresholdPx) {
        if (!runtimeRef.current.scrollCompleted) {
          runtimeRef.current.scrollCompleted = true;
          hideHint("scroll");
        }
        completeNavHint(true);
        return;
      }

      if (runtimeRef.current.scrollCompleted) return;
      if (nextScrollTop < scrollCompletionThresholdPx) return;

      runtimeRef.current.scrollCompleted = true;
      hideHint("scroll");
    };

    syncScrollState();
    container.addEventListener("scroll", syncScrollState, { passive: true });
    return () => container.removeEventListener("scroll", syncScrollState);
  }, [scrollContainerRef]);

  useEffect(() => {
    if (typeof navInteractionTick !== "number") return;
    const currentTick = navInteractionTick;
    if (currentTick === navTickRef.current) return;
    navTickRef.current = currentTick;

    completeNavHint();
  }, [navInteractionTick]);

  return {
    scroll: state.scroll !== "hidden",
    nav: state.nav !== "hidden",
    scrollState: state.scroll,
    navState: state.nav,
  };
};
