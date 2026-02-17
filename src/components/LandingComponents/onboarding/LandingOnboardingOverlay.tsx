import React, { RefObject } from "react";
import { useLandingOnboardingHints } from "./useLandingOnboardingHints";

export interface LandingOnboardingOverlayProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  navInteractionTick?: number;
  isTouch: boolean;
}

const cueVisibilityClass = (visible: boolean): string =>
  visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0";

const GuideArrow: React.FC<{ direction: "up" | "down" }> = ({ direction }) => (
  <svg
    viewBox="0 0 28 28"
    className={`onboarding-arrow-asset ${direction === "down" ? "rotate-180" : ""}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 22V8.2" className="onboarding-arrow-core" />
    <path d="M9 9.6L14 4.4L19 9.6" className="onboarding-arrow-core" />
  </svg>
);

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
        <div
          className={`absolute left-1/2 top-8 -translate-x-1/2 transform-gpu transition-all duration-500 ${cueVisibilityClass(
            hints.nav
          )}`}
        >
          <div className="onboarding-guide-stack">
            <GuideArrow direction="up" />
            <p className="onboarding-liquid-chip onboarding-copy text-xs font-medium tracking-[0.02em] sm:text-[13px]">
              {isTouch ? "Tap or drag up" : "Hover for more"}
            </p>
          </div>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transform-gpu transition-all duration-500 ${cueVisibilityClass(
            hints.scroll
          )}`}
        >
          <div className="onboarding-guide-stack">
            <p className="onboarding-liquid-chip onboarding-copy text-xs font-medium tracking-[0.02em] sm:text-[13px]">
              Scroll
            </p>
            <GuideArrow direction="down" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingOnboardingOverlay;
