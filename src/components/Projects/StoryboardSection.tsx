import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";
import CanvasErrorBoundary from "../CanvasErrorBoundary";
import SceneBloom from "./SceneBloom";
import { ResolvedThemeMode } from "../theme/themeMode";
import {
  removeRuntimeContextEntry,
  upsertRuntimeContextEntry,
} from "../../devtools/codexContext/runtimeRegistry";

interface StoryboardSectionProps {
  progress: MotionValue<number>;
  height?: number;
  forceLowPower?: boolean;
  themeMode: ResolvedThemeMode;
  children: (
    progress: MotionValue<number>,
    context: {
      lowPowerMode: boolean;
      mobileViewport: boolean;
    },
  ) => React.ReactNode;
}

const StoryboardSection: React.FC<StoryboardSectionProps> = ({
  progress,
  height = 200,
  forceLowPower = false,
  themeMode,
  children,
}) => {
  const [mobileViewport, setMobileViewport] = useState(false);
  const [reducedMotionMode, setReducedMotionMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const viewportQuery = window.matchMedia("(max-width: 900px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMobileViewport(viewportQuery.matches);
      setReducedMotionMode(motionQuery.matches);
    };

    update();

    if (viewportQuery.addEventListener) {
      viewportQuery.addEventListener("change", update);
      motionQuery.addEventListener("change", update);
    } else {
      viewportQuery.addListener(update);
      motionQuery.addListener(update);
    }

    return () => {
      if (viewportQuery.removeEventListener) {
        viewportQuery.removeEventListener("change", update);
        motionQuery.removeEventListener("change", update);
      } else {
        viewportQuery.removeListener(update);
        motionQuery.removeListener(update);
      }
    };
  }, []);

  const effectiveLowPowerMode = reducedMotionMode || forceLowPower;
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
        themeMode,
        hasHazeLayers: true,
        canvasMode: "sticky-fullscreen",
      },
    });

    return () => {
      removeRuntimeContextEntry(pagePath, contextId);
    };
  }, [effectiveLowPowerMode, mobileViewport, renderHeight, themeMode]);

  return (
    <section style={{ height: `${renderHeight}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="theme-project-scene-haze-a pointer-events-none absolute inset-0" />
        <div className="theme-project-scene-haze-b pointer-events-none absolute inset-0" />

        <CanvasErrorBoundary>
          <Canvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: [0, 0.14, 6.15], fov: 43 }}
            dpr={effectiveLowPowerMode ? [1, 1.5] : [1, 2]}
            shadows={false}
            gl={{
              preserveDrawingBuffer: false,
              antialias: !effectiveLowPowerMode,
              powerPreference: "high-performance",
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
              intensity={effectiveLowPowerMode ? 1.45 : 1.68}
              distance={26}
            />
            <directionalLight
              position={[2.8, 2.6, 2.4]}
              intensity={0.45}
            />
            <directionalLight position={[-3.2, 1.4, -2.8]} intensity={0.18} />

            <SceneBloom enabled={!effectiveLowPowerMode} />

            <group scale={1.14} position={[0, 0.02, 0]}>
              {children(progress, { lowPowerMode: effectiveLowPowerMode, mobileViewport })}
            </group>
          </Canvas>
        </CanvasErrorBoundary>

        <div className="theme-project-scene-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-36" />
      </div>
    </section>
  );
};

export default StoryboardSection;
