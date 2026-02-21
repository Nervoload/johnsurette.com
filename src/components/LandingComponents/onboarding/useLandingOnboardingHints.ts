import { RefObject, useEffect, useRef, useState } from "react";
import { HintId, HintLifecycleState, HintVisibilityState, OnboardingRuntimeState } from "./types";

export const SCROLL_PROGRESS_THRESHOLD_PX = 72;

const ENTER_MS = 260;
const EXIT_MS = 360;

interface UseLandingOnboardingHintsOptions {
  scrollContainerRef: RefObject<HTMLDivElement>;
  navInteractionTick?: number;
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
}: UseLandingOnboardingHintsOptions): UseLandingOnboardingHintsResult => {
  const [state, setState] = useState<HintVisibilityState>(hiddenState);
  const stateRef = useRef<HintVisibilityState>(hiddenState);

  const runtimeRef = useRef<OnboardingRuntimeState>(createRuntimeState());
  const timersRef = useRef<Record<HintId, number | null>>({
    scroll: null,
    nav: null,
  });
  const navTickRef = useRef<number>(navInteractionTick ?? 0);

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

  useEffect(() => {
    showHint("scroll");
    showHint("nav");

    return () => {
      clearTimer("scroll");
      clearTimer("nav");
      runtimeRef.current = createRuntimeState();
      stateRef.current = hiddenState;
    };
    // Intentionally run once per landing mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const syncScrollState = (): void => {
      const nextScrollTop = container.scrollTop;
      runtimeRef.current.scrollTop = nextScrollTop;

      if (runtimeRef.current.scrollCompleted) return;
      if (nextScrollTop < SCROLL_PROGRESS_THRESHOLD_PX) return;

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

    if (runtimeRef.current.navCompleted) return;
    runtimeRef.current.navCompleted = true;
    hideHint("nav");
  }, [navInteractionTick]);

  return {
    scroll: state.scroll !== "hidden",
    nav: state.nav !== "hidden",
    scrollState: state.scroll,
    navState: state.nav,
  };
};
