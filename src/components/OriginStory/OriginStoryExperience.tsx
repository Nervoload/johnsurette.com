import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import CanvasErrorBoundary from "../CanvasErrorBoundary";
import { originAssetManifest } from "./assets/originAssetManifest";
import OriginTransitionOverlay from "./effects/OriginTransitionOverlay";
import { originBeats } from "./originBeats";
import { originSceneRegistry } from "./originSceneRegistry";
import {
  getChapterTargetProgress,
} from "./runtime/chapterTimeline";
import { useOriginQualityTier } from "./runtime/useOriginQualityTier";
import { useOriginTimeline } from "./runtime/useOriginTimeline";
import OriginBottomScrub from "./ui/OriginBottomScrub";
import OriginChapterRail from "./ui/OriginChapterRail";
import OriginExitControls from "./ui/OriginExitControls";
import OriginNarrativeOverlay from "./ui/OriginNarrativeOverlay";
import { OriginPointer, OriginQualityTier } from "./types";
import { clamp01 } from "./scenes/sceneMath";

interface OriginStoryExperienceProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  onRequestExitHero?: () => void;
  onRequestExitConclusion?: () => void;
  controlsEnabled?: boolean;
}

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const dprByTier: Record<OriginQualityTier, [number, number]> = {
  mobile: [1, 1.25],
  balanced: [1, 1.75],
  ultra: [1.2, 2],
};

const OriginStoryExperience: React.FC<OriginStoryExperienceProps> = ({
  scrollContainerRef,
  onRequestExitHero,
  onRequestExitConclusion,
  controlsEnabled = true,
}) => {
  const reducedMotion = Boolean(useReducedMotion());
  const stageRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState<OriginPointer>({ x: 0, y: 0 });

  const { tier, factor: qualityFactor } = useOriginQualityTier(reducedMotion);
  const { progress, timeline, chapterBounds, jumpToChapter, jumpToNextChapter, jumpToPrevChapter } =
    useOriginTimeline({
      beats: originBeats,
      scrollContainerRef,
      stageRef,
    });

  const activeChapter = timeline.chapters[timeline.activeIndex];

  const chapterTargets = useMemo(
    () => chapterBounds.map((bound) => getChapterTargetProgress(bound)),
    [chapterBounds],
  );

  const timelineHeightVh = useMemo(() => {
    const totalWeight = originBeats.reduce((sum, beat) => sum + beat.scrollWeight, 0);
    return Math.max(620, Math.min(860, Math.round(totalWeight * 110)));
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        jumpToNextChapter("smooth");
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        jumpToPrevChapter("smooth");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [jumpToNextChapter, jumpToPrevChapter]);

  const pointerScale = reducedMotion ? 0.38 : 1;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const target = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - target.left) / target.width) * 2 - 1;
    const y = ((event.clientY - target.top) / target.height) * 2 - 1;
    setPointer((prev) => ({
      x: lerp(prev.x, clamp01((x + 1) / 2) * 2 - 1, 0.42 * pointerScale),
      y: lerp(prev.y, clamp01((y + 1) / 2) * 2 - 1, 0.42 * pointerScale),
    }));
  };

  return (
    <section ref={stageRef} className="relative" style={{ minHeight: `${timelineHeightVh}vh` }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.18),rgba(2,6,23,0)_38%),radial-gradient(circle_at_78%_16%,rgba(167,139,250,0.2),rgba(2,6,23,0)_42%),linear-gradient(180deg,#020617,#03081a_40%,#02050f)]"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      >
        <CanvasErrorBoundary>
          <Canvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: [0, 0.02, 5.6], fov: 39 }}
            dpr={dprByTier[tier]}
            gl={{
              antialias: !reducedMotion,
              alpha: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              (gl as unknown as { outputColorSpace: THREE.ColorSpace }).outputColorSpace = THREE.SRGBColorSpace;
              THREE.ColorManagement.enabled = true;
              gl.setClearColor(0x000000, 0);
            }}
          >
            <fog attach="fog" args={["#02050f", 6.5, 18]} />
            <ambientLight intensity={0.52} />
            <directionalLight intensity={0.92} position={[2.2, 3.6, 2.7]} />
            <pointLight intensity={0.68} color="#22d3ee" position={[-2.4, 1.2, 2.2]} />
            <pointLight intensity={0.64} color="#a78bfa" position={[2.6, -1, 2.4]} />

            <group position={[0, 0.05, 0]}>
              {timeline.chapters.map((chapterState) => {
                const SceneComponent = originSceneRegistry[chapterState.beat.id].component;
                const assetConfig = originAssetManifest[chapterState.beat.assetSlot];

                return (
                  <group
                    key={chapterState.beat.id}
                    position={assetConfig.transform.position}
                    rotation={assetConfig.transform.rotation}
                    scale={assetConfig.transform.scale}
                  >
                    <SceneComponent
                      weight={chapterState.weight}
                      localProgress={chapterState.localProgress}
                      globalProgress={progress}
                      pointer={pointer}
                      reducedMotion={reducedMotion}
                      qualityTier={tier}
                      qualityFactor={qualityFactor}
                    />
                  </group>
                );
              })}
            </group>
          </Canvas>
        </CanvasErrorBoundary>

        <OriginTransitionOverlay transition={timeline.transition} reducedMotion={reducedMotion} />

        <div className="pointer-events-none absolute inset-x-0 top-8 z-30 flex justify-center px-5">
          <div className="origin-stage-kicker">
            {activeChapter.beat.chapterLabel} · {timeline.activeIndex + 1}/{originBeats.length}
          </div>
        </div>

        <OriginNarrativeOverlay beat={activeChapter.beat} transition={timeline.transition} />

        {controlsEnabled ? (
          <>
            <OriginChapterRail
              beats={originBeats}
              activeIndex={timeline.activeIndex}
              onSelect={(index) => jumpToChapter(index, "smooth")}
            />
            <OriginBottomScrub
              beats={originBeats}
              activeIndex={timeline.activeIndex}
              progress={progress}
              chapterProgressTargets={chapterTargets}
              onSelect={(index) => jumpToChapter(index, "smooth")}
            />
            <OriginExitControls
              onRequestExitHero={onRequestExitHero}
              onRequestExitConclusion={onRequestExitConclusion}
            />
          </>
        ) : null}

        {import.meta.env.DEV ? (
          <div className="pointer-events-none absolute right-4 top-16 z-30 rounded-full bg-slate-900/60 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-100/85">
            slot: {activeChapter.beat.assetSlot} · tier: {tier}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default OriginStoryExperience;
