import React from "react";
import BiologySynapseScene from "./biology/BiologySynapseScene";
import StorySceneCanvas from "../runtime/StorySceneCanvas";
import { SectionActivityState } from "../runtime/LandingStoryRuntime";

interface BiologySynapsePlaceholderProps {
  activity: Pick<SectionActivityState, "isNearViewport" | "isPrimaryActive" | "qualityTier">;
}

const BiologySynapsePlaceholder: React.FC<BiologySynapsePlaceholderProps> = ({ activity }) => {
  return (
    <div
      className="relative mx-auto aspect-[1.08] w-[min(92vw,46rem)] max-w-none overflow-visible rounded-[2.5rem] sm:w-[min(88vw,52rem)] lg:w-[min(60vw,56rem)] xl:w-[min(54vw,60rem)]"
      aria-hidden="true"
    >
      <div className="theme-story-contrast-canvas pointer-events-none absolute inset-0 rounded-[2.5rem] blur-[2px]" />
      <StorySceneCanvas
        activity={activity}
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 0.18, 8.15], fov: 36, near: 0.1, far: 40 }}
        gl={{ alpha: true, powerPreference: "high-performance" }}
        idleFallback={<div className="absolute inset-0 rounded-[inherit] bg-transparent" />}
      >
        <BiologySynapseScene active={activity.isPrimaryActive} qualityTier={activity.qualityTier} />
      </StorySceneCanvas>
    </div>
  );
};

export default BiologySynapsePlaceholder;
