import React from "react";
import { motion } from "framer-motion";
import StorySceneCanvas from "../runtime/StorySceneCanvas";
import type { SectionActivityState } from "../runtime/LandingStoryRuntime";
import ComputationalScene from "./computation/ComputationalScene";

export interface ComputationalCanvasPlaceholderProps {
  activity: Pick<SectionActivityState, "isNearViewport" | "isPrimaryActive" | "qualityTier">;
}

const IdlePoster = () => (
  <div className="theme-story-contrast-canvas absolute inset-0 overflow-hidden rounded-[2.4rem]">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
    <div className="theme-story-contrast-top-fade absolute inset-x-0 top-0 h-24" />
    <div className="theme-story-contrast-bottom-fade absolute inset-x-0 bottom-0 h-24" />
    <div className="pointer-events-none absolute left-[7%] top-[12%] h-[24%] w-[42%] rounded-full bg-cyan-300/8 blur-3xl" />
    <div className="pointer-events-none absolute right-[10%] top-[20%] h-[22%] w-[28%] rounded-full bg-indigo-400/10 blur-3xl" />
    <div className="pointer-events-none absolute bottom-[10%] left-[18%] h-[16%] w-[36%] rounded-full bg-emerald-300/8 blur-3xl" />

    <div className="absolute inset-x-6 bottom-6 flex flex-wrap gap-2 sm:inset-x-8 sm:bottom-8">
      {["small network", "large model", "brain-like dynamics"].map((label) => (
        <span
          key={label}
          className="theme-story-contrast-chip rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur-sm"
        >
          {label}
        </span>
      ))}
    </div>
  </div>
);

const ComputationalCanvasPlaceholder: React.FC<ComputationalCanvasPlaceholderProps> = ({ activity }) => {
  return (
    <motion.div
      className="relative h-[76vh] min-h-[34rem] overflow-hidden rounded-[2.4rem] bg-transparent shadow-[0_0_120px_rgba(15,23,42,0.18)] sm:h-[80vh] lg:h-[86vh]"
      initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <StorySceneCanvas
        activity={activity}
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 0.1, 8.4], fov: 38 }}
        gl={{ alpha: true, antialias: activity.qualityTier === "high", preserveDrawingBuffer: false }}
        idleFallback={<IdlePoster />}
      >
        <ComputationalScene qualityTier={activity.qualityTier} />
      </StorySceneCanvas>
    </motion.div>
  );
};

export default ComputationalCanvasPlaceholder;
