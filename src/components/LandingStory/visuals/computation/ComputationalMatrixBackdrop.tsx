import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { StorySceneQualityTier } from "../../runtime/LandingStoryRuntime";

const GLYPHS = ["0", "1", "01", "10", "λ", "Σ", "µ", "∴", "ア", "カ", "ツ", "⊕"];

interface ComputationalMatrixBackdropProps {
  active: boolean;
  qualityTier: StorySceneQualityTier;
}

const ComputationalMatrixBackdrop: React.FC<ComputationalMatrixBackdropProps> = ({
  active,
  qualityTier,
}) => {
  const reduceMotion = useReducedMotion();

  const columns = useMemo(() => {
    const columnCount = qualityTier === "high" ? 24 : 16;
    return Array.from({ length: columnCount }, (_, index) => {
      const glyphCount = qualityTier === "high" ? 18 : 14;
      const glyphs = Array.from({ length: glyphCount }, (_, glyphIndex) =>
        GLYPHS[(index * 2 + glyphIndex * 3) % GLYPHS.length]
      ).join("\n");

      return {
        delay: index * -1.45,
        duration: qualityTier === "high" ? 18 + (index % 5) * 2.8 : 20 + (index % 4) * 2.3,
        left: 1.5 + index * (96 / columnCount),
        text: glyphs,
      };
    });
  }, [qualityTier]);

  const motionDisabled = reduceMotion || qualityTier === "static";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] [background-size:36px_36px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_86%_14%,rgba(129,140,248,0.11),transparent_22%),radial-gradient(circle_at_20%_72%,rgba(16,185,129,0.08),transparent_24%)]" />

      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 via-slate-950/66 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 via-slate-950/66 to-transparent" />

      {columns.map((column, index) => (
        <motion.pre
          key={`computational-rain-${index}`}
          className="absolute top-[-12%] select-none whitespace-pre text-[10px] font-semibold leading-[1.6] tracking-[0.36em] text-cyan-100/18 [mask-image:linear-gradient(180deg,transparent,black_18%,black_82%,transparent)]"
          initial={{ opacity: 0, y: "-18%" }}
          animate={
            !active
              ? { opacity: 0, y: 0 }
              : motionDisabled
                ? { opacity: 0.1, y: 0 }
                : { opacity: [0, 0.28, 0], y: ["-18%", "118%"] }
          }
          transition={
            !active
              ? { duration: 0.18 }
              : motionDisabled
                ? { duration: 0.01 }
                : {
                    delay: column.delay,
                    duration: column.duration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }
          }
          style={{ left: `${column.left}%`, opacity: active ? 1 : 0 }}
        >
          {column.text}
        </motion.pre>
      ))}
    </div>
  );
};

export default ComputationalMatrixBackdrop;
