import React, { RefObject } from "react";
import { motion } from "framer-motion";
import { HintLifecycleState } from "./types";
import { useLandingOnboardingHints } from "./useLandingOnboardingHints";

export interface LandingOnboardingOverlayProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  navInteractionTick?: number;
  isTouch: boolean;
  dismissAllThresholdPx?: number;
  navInteractionLockMs?: number;
  visitStorageKey?: string;
  scrollLabel?: string;
  navLabel?: string;
}

const cueMotion = {
  hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exiting: {
    opacity: 0,
    y: 8,
    filter: "blur(6px)",
    transition: { duration: 0.36, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

const ArrowShape: React.FC<{ direction: "up" | "down" }> = ({ direction }) => {
  return (
    <svg
      viewBox="0 0 36 36"
      className={`onboarding-shape ${direction === "down" ? "rotate-180" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="onboarding-shape-line" d="M10 21L18 13L26 21" />
    </svg>
  );
};

interface CueProps {
  state: HintLifecycleState;
  anchorClassName: string;
  label: string;
  direction: "up" | "down";
}

const Cue: React.FC<CueProps> = ({ state, anchorClassName, label, direction }) => {
  if (state === "hidden") return null;

  const animateState = state === "exiting" ? "exiting" : "visible";
  const edgeClassName = direction === "up" ? "onboarding-cue-shell is-top" : "onboarding-cue-shell is-bottom";
  const content =
    direction === "up" ? (
      <>
        <ArrowShape direction={direction} />
        <p className="onboarding-cue-text">{label}</p>
      </>
    ) : (
      <>
        <p className="onboarding-cue-text">{label}</p>
        <ArrowShape direction={direction} />
      </>
    );

  return (
    <div className={anchorClassName}>
      <motion.div
        className={edgeClassName}
        initial="hidden"
        animate={animateState}
        variants={cueMotion}
      >
        <span className="onboarding-cue-glow" aria-hidden />
        {content}
      </motion.div>
    </div>
  );
};

const LandingOnboardingOverlay: React.FC<LandingOnboardingOverlayProps> = ({
  scrollContainerRef,
  navInteractionTick,
  isTouch,
  dismissAllThresholdPx,
  navInteractionLockMs,
  visitStorageKey,
  scrollLabel = "Scroll",
  navLabel,
}) => {
  const hints = useLandingOnboardingHints({
    scrollContainerRef,
    navInteractionTick,
    dismissAllThresholdPx,
    navInteractionLockMs,
    visitStorageKey,
  });

  if (!hints.scroll && !hints.nav) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[60]" aria-hidden>
      <div className="sticky top-0 h-[100dvh] w-full">
        <Cue
          state={!isTouch ? hints.navState : "hidden"}
          anchorClassName="absolute inset-x-0 top-0 hidden sm:flex justify-center pt-[max(0.85rem,env(safe-area-inset-top))]"
          label={navLabel ?? "Hover for more"}
          direction="up"
        />

        <Cue
          state={hints.scrollState}
          anchorClassName="absolute inset-x-0 bottom-0 flex justify-center pb-[max(0.85rem,env(safe-area-inset-bottom))]"
          label={scrollLabel}
          direction="down"
        />
      </div>
    </div>
  );
};

export default LandingOnboardingOverlay;
