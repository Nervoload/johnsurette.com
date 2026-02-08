import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StoryTransitionKind } from "./storySections";

interface StoryTransitionProps {
  kind: StoryTransitionKind;
}

const StoryTransition: React.FC<StoryTransitionProps> = ({ kind }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  const fade = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.4, 1, 0.4, 0]);
  const fadeSoft = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.25, 0.55, 0.25, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [34, -34]);
  const twist = useTransform(scrollYProgress, [0, 1], [-16, 16]);
  const stretch = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.55]);

  const splitLeftX = useTransform(scrollYProgress, [0, 1], [-220, -62]);
  const splitRightX = useTransform(scrollYProgress, [0, 1], [220, 62]);
  const meshRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const lineSweep = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const ascend = useTransform(scrollYProgress, [0, 1], [58, -72]);

  if (kind === "cell-split") {
    return (
      <div ref={containerRef} className="relative h-56 overflow-visible">
        <motion.div
          className="absolute inset-x-[12%] top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-cyan-200/0 via-cyan-300/70 to-cyan-200/0"
          style={{ opacity: fade, scaleX: stretch }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-44 w-44 rounded-full border border-cyan-300/45 bg-cyan-300/12 blur-[1px]"
          style={{ x: splitLeftX, y: lift, opacity: fade, rotate: twist }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-44 w-44 rounded-full border border-violet-300/45 bg-violet-300/12 blur-[1px]"
          style={{ x: splitRightX, y: lift, opacity: fade, rotate: meshRotate }}
        />
      </div>
    );
  }

  if (kind === "ring-mesh") {
    return (
      <div ref={containerRef} className="relative h-56 overflow-visible">
        <motion.div
          className="absolute left-1/2 top-1/2 h-36 w-[78vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/38"
          style={{ opacity: fade, rotate: twist, scaleX: stretch }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-24 w-[58vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/28"
          style={{ opacity: fade, rotate: meshRotate }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[2px] w-56 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-200/0 via-cyan-200/80 to-cyan-200/0"
          style={{ opacity: fade, x: lineSweep }}
        />
      </div>
    );
  }

  if (kind === "synapse-grid") {
    return (
      <div ref={containerRef} className="relative h-56 overflow-visible">
        <motion.div className="absolute inset-0 story-transition-grid" style={{ opacity: fadeSoft, rotate: twist }} />
        {Array.from({ length: 8 }).map((_, idx) => (
          <motion.div
            key={`path-${idx}`}
            className="absolute h-[2px] w-28 bg-gradient-to-r from-cyan-300/0 via-cyan-300/80 to-violet-300/10"
            style={{
              top: `${12 + idx * 9}%`,
              left: `${8 + (idx % 4) * 22}%`,
              opacity: fade,
              scaleX: stretch,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-56 overflow-visible">
      {Array.from({ length: 18 }).map((_, idx) => (
        <motion.div
          key={`ascend-${idx}`}
          className="absolute bottom-[-26px] w-[2px] rounded-full bg-gradient-to-t from-cyan-300/0 via-cyan-300/75 to-cyan-100/0"
          style={{
            left: `${4 + idx * 5.2}%`,
            height: `${42 + (idx % 4) * 21}px`,
            opacity: fade,
            y: ascend,
          }}
        />
      ))}
    </div>
  );
};

export default StoryTransition;
