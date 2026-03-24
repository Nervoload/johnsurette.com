import React, { ReactNode } from "react";
import { Canvas, CanvasProps } from "@react-three/fiber";
import CanvasErrorBoundary from "../../CanvasErrorBoundary";
import { SectionActivityState } from "./LandingStoryRuntime";

interface StorySceneCanvasProps extends Omit<CanvasProps, "children" | "frameloop" | "dpr"> {
  activity: Pick<SectionActivityState, "isNearViewport" | "isPrimaryActive" | "qualityTier">;
  children: ReactNode;
  className?: string;
  idleFallback?: ReactNode;
}

const defaultFallback = (
  <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.92))]" />
);

const StorySceneCanvas: React.FC<StorySceneCanvasProps> = ({
  activity,
  children,
  className,
  idleFallback = defaultFallback,
  camera = { position: [0, 0, 8], fov: 42 },
  gl,
  ...canvasProps
}) => {
  if (!activity.isNearViewport) {
    return <div className={className}>{idleFallback}</div>;
  }

  const dpr: [number, number] =
    activity.qualityTier === "high"
      ? activity.isPrimaryActive
        ? [1, 1.6]
        : [1, 1.25]
      : activity.qualityTier === "low"
        ? [1, 1.1]
        : [1, 1];

  return (
    <CanvasErrorBoundary fallback={<div className={className}>{idleFallback}</div>}>
      <Canvas
        {...canvasProps}
        className={className}
        camera={camera}
        dpr={dpr}
        frameloop={activity.isPrimaryActive && activity.qualityTier !== "static" ? "always" : "never"}
        gl={{
          alpha: true,
          antialias: activity.qualityTier === "high",
          powerPreference: activity.qualityTier === "high" ? "high-performance" : "low-power",
          ...gl,
        }}
      >
        {children}
      </Canvas>
    </CanvasErrorBoundary>
  );
};

export default StorySceneCanvas;
