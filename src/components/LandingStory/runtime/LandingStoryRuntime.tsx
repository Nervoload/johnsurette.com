import React, { ReactNode, RefObject, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { usePointerDevice } from "../../../hooks/usePointerDevice";

type InViewOptions = NonNullable<Parameters<typeof useInView>[1]>;
type InViewMargin = NonNullable<InViewOptions["margin"]>;

export type StorySceneQualityTier = "high" | "low" | "static";

interface LandingStoryRuntimeContextValue {
  scrollContainerRef: RefObject<HTMLDivElement>;
}

interface LandingStoryRuntimeProviderProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}

export interface SectionActivityOptions {
  nearAmount?: number | "some" | "all";
  nearMargin?: InViewMargin;
  primaryAmount?: number | "some" | "all";
  primaryMargin?: InViewMargin;
}

export interface SectionActivityState<T extends HTMLElement = HTMLElement> {
  sectionRef: RefObject<T | null>;
  isNearViewport: boolean;
  isPrimaryActive: boolean;
  qualityTier: StorySceneQualityTier;
}

const LandingStoryRuntimeContext = createContext<LandingStoryRuntimeContextValue | null>(null);

const DEFAULT_ACTIVITY_OPTIONS: Required<SectionActivityOptions> = {
  nearAmount: 0.1,
  nearMargin: "28% 0px 28% 0px",
  primaryAmount: 0.45,
  primaryMargin: "-12% 0px -12% 0px",
};

interface StoryViewportMetrics {
  width: number;
  height: number;
  dpr: number;
}

const getViewportMetrics = (): StoryViewportMetrics => {
  if (typeof window === "undefined") {
    return {
      width: 1280,
      height: 720,
      dpr: 1,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
  };
};

const getAdaptiveQualityTier = (
  prefersReducedMotion: boolean,
  pointerDevice: ReturnType<typeof usePointerDevice>,
  viewport: StoryViewportMetrics,
): StorySceneQualityTier => {
  if (prefersReducedMotion) {
    return "static";
  }

  const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { deviceMemory?: number }) : null;
  const deviceMemory = nav?.deviceMemory ?? 4;
  const hardwareConcurrency = nav?.hardwareConcurrency ?? 4;
  const viewportArea = viewport.width * viewport.height;
  const compactViewport = viewport.width < 960 || viewport.height < 720;

  let capabilityScore = 0;

  capabilityScore += pointerDevice === "fine" ? 1 : 0;
  capabilityScore += viewportArea >= 900_000 && !compactViewport ? 1 : 0;
  capabilityScore += viewport.dpr <= 2.2 ? 1 : 0;
  capabilityScore += hardwareConcurrency >= 8 ? 1 : hardwareConcurrency <= 4 ? -1 : 0;
  capabilityScore += deviceMemory >= 8 ? 1 : deviceMemory <= 4 ? -1 : 0;

  return capabilityScore >= 2 ? "high" : "low";
};

export function LandingStoryRuntimeProvider({
  scrollContainerRef,
  children,
}: LandingStoryRuntimeProviderProps): React.ReactElement {
  const value = useMemo(() => ({ scrollContainerRef }), [scrollContainerRef]);
  return <LandingStoryRuntimeContext.Provider value={value}>{children}</LandingStoryRuntimeContext.Provider>;
}

export function useLandingStoryRuntime(): LandingStoryRuntimeContextValue {
  const value = useContext(LandingStoryRuntimeContext);

  if (!value) {
    throw new Error("Landing story runtime is unavailable outside LandingStoryRuntimeProvider.");
  }

  return value;
}

export function useSectionActivity<T extends HTMLElement = HTMLElement>(
  options: SectionActivityOptions = {}
): SectionActivityState<T> {
  const sectionRef = useRef<T | null>(null);
  const { scrollContainerRef } = useLandingStoryRuntime();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const pointerDevice = usePointerDevice();
  const [viewportMetrics, setViewportMetrics] = useState<StoryViewportMetrics>(() => getViewportMetrics());

  const {
    nearAmount = DEFAULT_ACTIVITY_OPTIONS.nearAmount,
    nearMargin = DEFAULT_ACTIVITY_OPTIONS.nearMargin,
    primaryAmount = DEFAULT_ACTIVITY_OPTIONS.primaryAmount,
    primaryMargin = DEFAULT_ACTIVITY_OPTIONS.primaryMargin,
  } = options;

  const isNearViewport = useInView(sectionRef, {
    root: scrollContainerRef,
    amount: nearAmount,
    margin: nearMargin,
  });

  const isPrimaryActive = useInView(sectionRef, {
    root: scrollContainerRef,
    amount: primaryAmount,
    margin: primaryMargin,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateViewportMetrics = () => {
      setViewportMetrics(getViewportMetrics());
    };

    updateViewportMetrics();
    window.addEventListener("resize", updateViewportMetrics);
    window.addEventListener("orientationchange", updateViewportMetrics);

    return () => {
      window.removeEventListener("resize", updateViewportMetrics);
      window.removeEventListener("orientationchange", updateViewportMetrics);
    };
  }, []);

  const qualityTier = useMemo(
    () => getAdaptiveQualityTier(prefersReducedMotion, pointerDevice, viewportMetrics),
    [pointerDevice, prefersReducedMotion, viewportMetrics],
  );

  return {
    sectionRef,
    isNearViewport,
    isPrimaryActive,
    qualityTier,
  };
}
