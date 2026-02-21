import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OriginBeatDefinition, OriginTransitionState } from "../types";

interface OriginNarrativeOverlayProps {
  beat: OriginBeatDefinition;
  transition: OriginTransitionState | null;
}

const OriginNarrativeOverlay: React.FC<OriginNarrativeOverlayProps> = ({ beat, transition }) => {
  const transitionDim = transition ? Math.max(0.35, 1 - transition.strength * 0.52) : 1;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-30 px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={beat.id}
          className={`mx-auto max-w-4xl text-center origin-narrative-shell mode-${beat.textMode}`}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: transitionDim, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(10px)" }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="origin-narrative-kicker">{beat.title}</p>
          <p className="origin-narrative-line">{beat.line}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OriginNarrativeOverlay;
