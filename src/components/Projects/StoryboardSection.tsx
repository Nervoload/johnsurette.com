import React, { RefObject, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { MotionValue, useInView, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import CanvasErrorBoundary from "../CanvasErrorBoundary";
import SceneBloom from "./SceneBloom";
import { ResolvedThemeMode } from "../theme/themeMode";
import { useCompactViewport } from "../../hooks/useViewport";
import {
  removeRuntimeContextEntry,
  upsertRuntimeContextEntry,
} from "../../devtools/codexContext/runtimeRegistry";

interface StoryboardSectionProps {
  progress: MotionValue<number>;
  height?: number;
  forceLowPower?: boolean;
  scrollContainer?: RefObject<HTMLDivElement>;
  themeMode: ResolvedThemeMode;
  children: (
    progress: MotionValue<number>,
    context: {
      lowPowerMode: boolean;
      mobileViewport: boolean;
      sceneActive: boolean;
    },
  ) => React.ReactNode;
}

const StoryboardSection: React.FC<StoryboardSectionProps> = ({
  progress,
  height = 200,
  forceLowPower = false,
  scrollContainer,
  themeMode,
  children,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mobileViewport = useCompactViewport();
  const reducedMotionMode = Boolean(useReducedMotion());
  const sceneActive = useInView(sectionRef, {
    root: scrollContainer,
    amount: "some",
    margin: "24% 0px 24% 0px",
  });
  const effectiveLowPowerMode = reducedMotionMode || forceLowPower;
  const compactRenderMode = effectiveLowPowerMode || mobileViewport;
  const reducedCanvasQuality = effectiveLowPowerMode;
  const renderHeight = height;
  const fogColor = useMemo(() => {
    return themeMode === "dark" ? "#0b1326" : "#eef4fb";
  }, [themeMode]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const pagePath = window.location.pathname || "/";
    const contextId = "projects:storyboard-shell";

    upsertRuntimeContextEntry({
      pagePath,
      id: contextId,
      componentName: "StoryboardSection",
      componentPath: ["ProjectsPage", "ProjectStoryboard", "StoryboardSection"],
      filePath: "/src/components/Projects/StoryboardSection.tsx",
      role: "sticky-canvas-shell",
      metadata: {
        renderHeightVh: renderHeight,
        lowPowerMode: effectiveLowPowerMode,
        mobileViewport,
        sceneActive,
        themeMode,
        hasHazeLayers: !compactRenderMode,
        canvasMode: sceneActive ? "sticky-fullscreen" : "paused-offscreen",
      },
    });

    return () => {
      removeRuntimeContextEntry(pagePath, contextId);
    };
  }, [compactRenderMode, effectiveLowPowerMode, mobileViewport, renderHeight, sceneActive, themeMode]);

  return (
    <section ref={sectionRef} style={{ height: `${renderHeight}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="theme-project-scene-haze-a pointer-events-none absolute inset-0" />
        {!compactRenderMode ? (
          <div className="theme-project-scene-haze-b pointer-events-none absolute inset-0" />
        ) : null}

        <CanvasErrorBoundary>
          <Canvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: [0, 0.14, 6.15], fov: 43 }}
            dpr={reducedCanvasQuality ? [0.85, 1.15] : [1, 2]}
            frameloop={sceneActive ? "always" : "never"}
            shadows={false}
            gl={{
              preserveDrawingBuffer: false,
              antialias: !reducedCanvasQuality,
              powerPreference: reducedCanvasQuality ? "low-power" : "high-performance",
              alpha: true,
            }}
            onCreated={({ gl }) => {
              (gl as unknown as { outputColorSpace: THREE.ColorSpace }).outputColorSpace = THREE.SRGBColorSpace;
              THREE.ColorManagement.enabled = true;
              gl.shadowMap.enabled = false;
              gl.setClearColor(0xffffff, 0);
            }}
          >
            <fog attach="fog" args={[fogColor, 8, 24]} />

            <ambientLight intensity={0.72} />
            <spotLight
              position={[0, 5.2, 2.6]}
              angle={0.56}
              penumbra={0.66}
              intensity={compactRenderMode ? 1.36 : 1.68}
              distance={26}
            />
            <directionalLight
              position={[2.8, 2.6, 2.4]}
              intensity={compactRenderMode ? 0.34 : 0.45}
            />
            {!compactRenderMode ? (
              <directionalLight position={[-3.2, 1.4, -2.8]} intensity={0.18} />
            ) : null}

            <SceneBloom enabled={!compactRenderMode} />

            <group scale={compactRenderMode ? 1.08 : 1.14} position={[0, compactRenderMode ? 0 : 0.02, 0]}>
              {children(progress, { lowPowerMode: effectiveLowPowerMode, mobileViewport, sceneActive })}
            </group>
          </Canvas>
        </CanvasErrorBoundary>

        <div className="theme-project-scene-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-36" />
      </div>
    </section>
  );
};

export default StoryboardSection;
