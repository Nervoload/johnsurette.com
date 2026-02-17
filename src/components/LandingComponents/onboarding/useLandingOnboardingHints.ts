import { RefObject, useEffect, useRef, useState } from "react";
import { hasLandingOnboardingSeenCookie, markLandingOnboardingSeenCookie } from "./hintCookies";
import { HintId, HintVisibilityState, OnboardingRuntimeState } from "./types";

export const FIRST_VISIT_LOCK_MS = 30000;
export const IDLE_DELAY_MS = 8000;
export const PROMPT_VISIBLE_MS = 6000;
export const PROMPT_COOLDOWN_MS = 18000;
export const TOP_ZONE_THRESHOLD_PX = 96;
export const SCROLL_PROGRESS_THRESHOLD_PX = 72;

interface PromptWindowState {
  visibleUntil: number;
  cooldownUntil: number;
}

interface UseLandingOnboardingHintsOptions {
  scrollContainerRef: RefObject<HTMLDivElement>;
  navInteractionTick?: number;
}

interface UseLandingOnboardingHintsResult extends HintVisibilityState {
  firstVisit: boolean;
  firstVisitLockActive: boolean;
}

const createPromptWindow = (): PromptWindowState => ({ visibleUntil: 0, cooldownUntil: 0 });

const createRuntimeState = (now: number): OnboardingRuntimeState => ({
  firstVisit: false,
  firstVisitLockUntil: 0,
  scrollCompleted: false,
  navCompleted: false,
  lastActivityAt: now,
  scrollTop: 0,
});

export const useLandingOnboardingHints = ({
  scrollContainerRef,
  navInteractionTick,
}: UseLandingOnboardingHintsOptions): UseLandingOnboardingHintsResult => {
  const [firstVisit, setFirstVisit] = useState(false);
  const [firstVisitLockActive, setFirstVisitLockActive] = useState(false);
  const [visible, setVisible] = useState<HintVisibilityState>({ scroll: false, nav: false });

  const runtimeRef = useRef<OnboardingRuntimeState>(createRuntimeState(Date.now()));
  const promptRef = useRef<Record<HintId, PromptWindowState>>({
    scroll: createPromptWindow(),
    nav: createPromptWindow(),
  });
  const navTickRef = useRef<number>(navInteractionTick ?? 0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const now = Date.now();
    const isFirstVisit = !hasLandingOnboardingSeenCookie();

    if (isFirstVisit) {
      markLandingOnboardingSeenCookie();
    }

    runtimeRef.current.firstVisit = isFirstVisit;
    runtimeRef.current.firstVisitLockUntil = isFirstVisit ? now + FIRST_VISIT_LOCK_MS : 0;
    runtimeRef.current.lastActivityAt = now;
    runtimeRef.current.scrollCompleted = false;
    runtimeRef.current.navCompleted = false;

    setFirstVisit(isFirstVisit);
    setFirstVisitLockActive(isFirstVisit);
    setVisible({
      scroll: isFirstVisit,
      nav: isFirstVisit,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentTick = navInteractionTick ?? 0;
    if (currentTick === navTickRef.current) return;

    navTickRef.current = currentTick;
    runtimeRef.current.navCompleted = true;
    runtimeRef.current.lastActivityAt = Date.now();
  }, [navInteractionTick]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const syncScrollState = (): void => {
      const nextScrollTop = container.scrollTop;
      runtimeRef.current.scrollTop = nextScrollTop;
      runtimeRef.current.lastActivityAt = Date.now();

      if (nextScrollTop >= SCROLL_PROGRESS_THRESHOLD_PX) {
        runtimeRef.current.scrollCompleted = true;
      }
    };

    syncScrollState();
    container.addEventListener("scroll", syncScrollState, { passive: true });
    return () => container.removeEventListener("scroll", syncScrollState);
  }, [scrollContainerRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldShowHint = (id: HintId, now: number): boolean => {
      const runtime = runtimeRef.current;
      const prompt = promptRef.current[id];
      const completed = id === "scroll" ? runtime.scrollCompleted : runtime.navCompleted;

      if (completed) return false;
      if (runtime.scrollTop > TOP_ZONE_THRESHOLD_PX) return false;

      if (prompt.visibleUntil > now) return true;

      if (prompt.visibleUntil !== 0 && prompt.visibleUntil <= now) {
        prompt.visibleUntil = 0;
        prompt.cooldownUntil = now + PROMPT_COOLDOWN_MS;
      }

      const eligibleAt = Math.max(runtime.lastActivityAt + IDLE_DELAY_MS, prompt.cooldownUntil);
      if (now >= eligibleAt) {
        prompt.visibleUntil = now + PROMPT_VISIBLE_MS;
        return true;
      }

      return false;
    };

    const interval = window.setInterval(() => {
      const now = Date.now();
      const runtime = runtimeRef.current;
      const lockActive = runtime.firstVisit && now < runtime.firstVisitLockUntil;

      setFirstVisitLockActive((prev) => (prev === lockActive ? prev : lockActive));

      if (runtime.firstVisit) {
        const nextVisible: HintVisibilityState = {
          scroll: !runtime.scrollCompleted,
          nav: !runtime.navCompleted,
        };
        setVisible((prev) =>
          prev.scroll === nextVisible.scroll && prev.nav === nextVisible.nav ? prev : nextVisible
        );
        return;
      }

      const nextVisible: HintVisibilityState = {
        scroll: shouldShowHint("scroll", now),
        nav: shouldShowHint("nav", now),
      };

      setVisible((prev) =>
        prev.scroll === nextVisible.scroll && prev.nav === nextVisible.nav ? prev : nextVisible
      );
    }, 180);

    return () => window.clearInterval(interval);
  }, []);

  return {
    firstVisit,
    firstVisitLockActive,
    scroll: visible.scroll,
    nav: visible.nav,
  };
};
