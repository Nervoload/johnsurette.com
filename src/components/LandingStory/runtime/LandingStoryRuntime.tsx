import React, { ReactNode, RefObject, createContext, useContext, useMemo, useRef } from "react";
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

  const qualityTier: StorySceneQualityTier = prefersReducedMotion
    ? "static"
    : pointerDevice === "coarse"
      ? "low"
      : "high";

  return {
    sectionRef,
    isNearViewport,
    isPrimaryActive,
    qualityTier,
  };
}
