import React, { RefObject, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { LandingHeroIdentityContent } from "../../content/types";

export interface LandingHeroIdentityProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  heroSectionRef: RefObject<HTMLElement>;
  content: LandingHeroIdentityContent;
}

const LandingHeroIdentity: React.FC<LandingHeroIdentityProps> = ({
  scrollContainerRef,
  heroSectionRef,
  content,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === "undefined" ? 960 : window.innerHeight,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });

  const easedProgress = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 420 : 72,
    damping: prefersReducedMotion ? 54 : 26,
    mass: prefersReducedMotion ? 0.36 : 1.48,
  });

  const initialLift = Math.max(340, viewportHeight - 520);
  const heroY = useTransform(easedProgress, [0, 0.72], [initialLift, 0]);
  const heroOpacity = useTransform(easedProgress, [0, 0.6, 0.65, 0.88], [1, 0.9, 0.3, 0]);
  const compactOpacity = useTransform(easedProgress, [0.9, 1], [0, 1]);
  const compactY = useTransform(easedProgress, [0.92, 1], [12, 0]);
  const compactClipPath = useTransform(
    easedProgress,
    [0.92, 1],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );

  return (
    <>
      <div className="sr-only">
        <p>{content.kicker}</p>
        <h1>
          {content.firstName} {content.lastName}
        </h1>
        <p>{content.domainSuffix}</p>
      </div>

      <motion.div
        className="pointer-events-none fixed left-3 top-[5.5rem] z-[32] max-w-[calc(100vw-1.5rem)] sm:left-6 sm:top-[6.5rem] sm:max-w-[calc(100vw-3rem)]"
        initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(18px)" }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
      >
        <motion.div className="relative overflow-visible" style={{ y: heroY, opacity: heroOpacity }} aria-hidden>
          <p className="theme-text-subtle whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.34em]">
            {content.kicker}
          </p>

          <div className="mt-3 flex flex-col items-start gap-1">
            <p className="theme-text-primary whitespace-nowrap text-[clamp(3.6rem,9vw,6.9rem)] font-black leading-[0.88] tracking-[-0.065em]">
              {content.firstName}
            </p>
            <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
              <p className="theme-text-primary whitespace-nowrap text-[clamp(3.6rem,9vw,6.9rem)] font-black leading-[0.88] tracking-[-0.065em]">
                {content.lastName}
              </p>
              <p className="theme-text-subtle whitespace-nowrap text-[0.82rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.92rem]">
                <span style={{ position: "relative", top: "3px" }}>{content.domainSuffix}</span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute left-0 top-0 overflow-hidden"
          style={{ opacity: compactOpacity, y: compactY, clipPath: compactClipPath }}
          aria-hidden
        >
          <p className="theme-text-primary whitespace-nowrap text-[clamp(1.9rem,2.6vw,2.5rem)] font-black leading-none tracking-[-0.055em]">
            {content.firstName} {content.lastName}
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default LandingHeroIdentity;
