import React, { RefObject } from "react";
import { motion } from "framer-motion";
import { HintLifecycleState } from "./types";
import { useLandingOnboardingHints } from "./useLandingOnboardingHints";

export interface LandingOnboardingOverlayProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  navInteractionTick?: number;
  isTouch: boolean;
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
      <path className="onboarding-shape-line" d="M18 28V10" />
      <path className="onboarding-shape-line" d="M11 16L18 9L25 16" />
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
  return (
    <div className={anchorClassName}>
      <motion.div
        initial="hidden"
        animate={animateState}
        variants={cueMotion}
      >
        <div className="onboarding-cue-shell">
          <ArrowShape direction={direction} />
          <p className="onboarding-cue-text">{label}</p>
        </div>
      </motion.div>
    </div>
  );
};

const LandingOnboardingOverlay: React.FC<LandingOnboardingOverlayProps> = ({
  scrollContainerRef,
  navInteractionTick,
  isTouch,
}) => {
  const hints = useLandingOnboardingHints({
    scrollContainerRef,
    navInteractionTick,
  });

  if (!hints.scroll && !hints.nav) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[60]" aria-hidden>
      <div className="sticky top-0 h-[100dvh] w-full">
        <Cue
          state={hints.navState}
          anchorClassName="absolute left-1/2 top-8 -translate-x-1/2"
          label={isTouch ? "Tap or drag up" : "Hover for more"}
          direction="up"
        />

        <Cue
          state={hints.scrollState}
          anchorClassName="absolute bottom-8 left-1/2 -translate-x-1/2"
          label="Scroll"
          direction="down"
        />
      </div>
    </div>
  );
};

export default LandingOnboardingOverlay;
