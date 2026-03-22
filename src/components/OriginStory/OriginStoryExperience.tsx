import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import CanvasErrorBoundary from "../CanvasErrorBoundary";
import SceneBloom from "../Projects/SceneBloom";
import { originAssetCreditsById } from "./assets/originAssetCredits";
import { originAssetManifest } from "./assets/originAssetManifest";
import OriginCameraRig from "./components/OriginCameraRig";
import OriginEnvironmentController from "./components/OriginEnvironmentController";
import OriginLightRig from "./components/OriginLightRig";
import OriginTransitionOverlay from "./effects/OriginTransitionOverlay";
import { originBeats } from "./originBeats";
import { originSceneRegistry } from "./originSceneRegistry";
import { getChapterTargetProgress } from "./runtime/chapterTimeline";
import { useOriginQualityTier } from "./runtime/useOriginQualityTier";
import { useOriginTimeline } from "./runtime/useOriginTimeline";
import OriginBottomScrub from "./ui/OriginBottomScrub";
import OriginChapterRail from "./ui/OriginChapterRail";
import OriginCreditsPanel from "./ui/OriginCreditsPanel";
import OriginExitControls from "./ui/OriginExitControls";
import OriginHotspotLayer from "./ui/OriginHotspotLayer";
import OriginNarrativeOverlay from "./ui/OriginNarrativeOverlay";
import OriginSubsceneOverlay from "./ui/OriginSubsceneOverlay";
import { removeRuntimeContextEntry, upsertRuntimeContextEntry } from "../../devtools/codexContext/runtimeRegistry";
import {
  OriginAssetCreditEntry,
  OriginBeatDefinition,
  OriginCameraPreset,
  OriginHotspotDefinition,
  OriginLightPreset,
  OriginPalette,
  OriginPointer,
  OriginQualityTier,
  OriginSubsceneDefinition,
  OriginSubsceneRuntime,
} from "./types";
import { clamp01 } from "./scenes/sceneMath";

interface OriginStoryExperienceProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  onRequestExitHero?: () => void;
  onRequestExitConclusion?: () => void;
  controlsEnabled?: boolean;
}

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const dprByTier: Record<OriginQualityTier, [number, number]> = {
  mobile: [1, 1.2],
  balanced: [1, 1.6],
  ultra: [1.2, 2],
};

const ORIGIN_RUNTIME_CONTEXT_ID = "origin:story-runtime";

const mixVector3 = (
  from: [number, number, number],
  to: [number, number, number],
  mix: number,
): [number, number, number] => [
  lerp(from[0], to[0], mix),
  lerp(from[1], to[1], mix),
  lerp(from[2], to[2], mix),
];

const mixColorHex = (from: string, to: string, mix: number): string => {
  const fromColor = new THREE.Color(from);
  const toColor = new THREE.Color(to);
  fromColor.lerp(toColor, mix);
  return `#${fromColor.getHexString()}`;
};

const mixCameraPreset = (
  from: OriginCameraPreset,
  to: OriginCameraPreset,
  mix: number,
): OriginCameraPreset => ({
  position: mixVector3(from.position, to.position, mix),
  target: mixVector3(from.target, to.target, mix),
  fov: lerp(from.fov, to.fov, mix),
  parallax: lerp(from.parallax, to.parallax, mix),
  drift: lerp(from.drift, to.drift, mix),
  roll: lerp(from.roll ?? 0, to.roll ?? 0, mix),
});

const mixLightPreset = (
  from: OriginLightPreset,
  to: OriginLightPreset,
  mix: number,
): OriginLightPreset => ({
  ambientIntensity: lerp(from.ambientIntensity, to.ambientIntensity, mix),
  keyIntensity: lerp(from.keyIntensity, to.keyIntensity, mix),
  keyPosition: mixVector3(from.keyPosition, to.keyPosition, mix),
  fillIntensity: lerp(from.fillIntensity, to.fillIntensity, mix),
  fillPosition: mixVector3(from.fillPosition, to.fillPosition, mix),
  rimIntensity: lerp(from.rimIntensity, to.rimIntensity, mix),
});

const mixPalette = (from: OriginPalette, to: OriginPalette, mix: number): OriginPalette => ({
  backdrop: mixColorHex(from.backdrop, to.backdrop, mix),
  accent: mixColorHex(from.accent, to.accent, mix),
  secondary: mixColorHex(from.secondary, to.secondary, mix),
  glow: mixColorHex(from.glow, to.glow, mix),
  fog: mixColorHex(from.fog, to.fog, mix),
  panel: mix < 0.5 ? from.panel : to.panel,
  text: mixColorHex(from.text, to.text, mix),
});

const toRgba = (color: THREE.Color, alpha: number): string =>
  `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;

const getSubsceneById = (
  beat: OriginBeatDefinition,
  subsceneId: string,
): OriginSubsceneDefinition | null => {
  return beat.subscenes.find((subscene) => subscene.id === subsceneId) ?? null;
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
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [activeSubscene, setActiveSubscene] = useState<OriginSubsceneRuntime | null>(null);
  const [creditsOpen, setCreditsOpen] = useState(false);

  const { tier, factor: qualityFactor } = useOriginQualityTier(reducedMotion);
  const { smoothedProgress, timeline, chapterBounds, jumpToChapter, jumpToNextChapter, jumpToPrevChapter } =
    useOriginTimeline({
      beats: originBeats,
      scrollContainerRef,
      stageRef,
    });

  const activeChapter = timeline.chapters[timeline.activeIndex];
  const stageTransition = activeSubscene ? null : timeline.transition;
  const renderedChapterIndices = activeSubscene ? [timeline.activeIndex] : timeline.renderedChapterIndices;
  const adjacentIndex = activeSubscene ? null : timeline.adjacentIndex;
  const activeAssetConfig = originAssetManifest[activeChapter.beat.assetSlot];

  useEffect(() => {
    setActiveHotspotId(null);
    setActiveSubscene(null);
    setCreditsOpen(false);
  }, [activeChapter.beat.id]);

  useEffect(() => {
    if (!activeSubscene) {
      return;
    }

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number): void => {
      const delta = Math.max(0.001, (now - lastTime) / 1000);
      lastTime = now;

      let shouldContinue = false;

      setActiveSubscene((previous) => {
        if (!previous) {
          return previous;
        }

        const targetBlend = previous.mode === "exiting" ? 0 : 1;
        const nextBlend = THREE.MathUtils.damp(previous.blend, targetBlend, 7.2, delta);
        let nextMode = previous.mode;

        if (previous.mode === "entering" && nextBlend >= 0.985) {
          nextMode = "active";
        }

        if (previous.mode === "exiting" && nextBlend <= 0.015) {
          return null;
        }

        shouldContinue = Math.abs(nextBlend - targetBlend) > 0.006 || nextMode !== "active";

        return {
          ...previous,
          blend: nextBlend,
          mode: nextMode,
        };
      });

      if (shouldContinue) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [activeSubscene?.mode]);

  useEffect(() => {
    if (!activeSubscene) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const lockedScrollTop = activeSubscene.lockedScrollTop;
    const previousOverscrollBehavior = container.style.overscrollBehavior;
    const previousTouchAction = container.style.touchAction;

    const keepScrollLocked = (): void => {
      if (Math.abs(container.scrollTop - lockedScrollTop) > 1) {
        container.scrollTop = lockedScrollTop;
      }
    };

    container.style.overscrollBehavior = "contain";
    container.style.touchAction = "none";
    keepScrollLocked();
    container.addEventListener("scroll", keepScrollLocked, { passive: true });

    return () => {
      container.removeEventListener("scroll", keepScrollLocked);
      container.style.overscrollBehavior = previousOverscrollBehavior;
      container.style.touchAction = previousTouchAction;
    };
  }, [activeSubscene?.beatId, activeSubscene?.lockedScrollTop, scrollContainerRef]);

  const resolvedActiveHotspotId = activeSubscene?.definition.hotspotId ?? activeHotspotId;

  const activeHotspot = useMemo<OriginHotspotDefinition | null>(() => {
    return activeChapter.beat.hotspots.find((hotspot) => hotspot.id === resolvedActiveHotspotId) ?? null;
  }, [activeChapter.beat.hotspots, resolvedActiveHotspotId]);

  const blendFromChapter = stageTransition ? timeline.chapters[stageTransition.boundaryIndex] : activeChapter;
  const blendToChapter = stageTransition ? timeline.chapters[stageTransition.boundaryIndex + 1] : null;

  const chapterTargets = useMemo(
    () => chapterBounds.map((bound) => getChapterTargetProgress(bound)),
    [chapterBounds],
  );

  const timelineHeightVh = useMemo(() => {
    const totalWeight = originBeats.reduce((sum, beat) => sum + beat.scrollWeight, 0);
    return Math.max(720, Math.min(960, Math.round(totalWeight * 118)));
  }, []);

  const blendedPalette = useMemo<OriginPalette>(() => {
    if (activeSubscene) {
      return {
        ...activeChapter.beat.palette,
        accent: mixColorHex(activeChapter.beat.palette.accent, activeSubscene.definition.accent, activeSubscene.blend),
        secondary: mixColorHex(activeChapter.beat.palette.secondary, activeSubscene.definition.accent, activeSubscene.blend * 0.28),
        glow: mixColorHex(activeChapter.beat.palette.glow, activeSubscene.definition.accent, activeSubscene.blend * 0.42),
      };
    }

    if (blendToChapter && stageTransition) {
      return mixPalette(blendFromChapter.beat.palette, blendToChapter.beat.palette, stageTransition.sceneMix);
    }

    return activeChapter.beat.palette;
  }, [activeChapter.beat.palette, activeSubscene, blendFromChapter.beat.palette, blendToChapter, stageTransition]);

  const blendedCamera = useMemo<OriginCameraPreset>(() => {
    if (activeSubscene) {
      return mixCameraPreset(activeChapter.beat.camera, activeSubscene.definition.camera, activeSubscene.blend);
    }

    if (blendToChapter && stageTransition) {
      return mixCameraPreset(blendFromChapter.beat.camera, blendToChapter.beat.camera, stageTransition.cameraMix);
    }

    return activeChapter.beat.camera;
  }, [activeChapter.beat.camera, activeSubscene, blendFromChapter.beat.camera, blendToChapter, stageTransition]);

  const blendedLighting = useMemo<OriginLightPreset>(() => {
    if (blendToChapter && stageTransition) {
      return mixLightPreset(blendFromChapter.beat.lighting, blendToChapter.beat.lighting, stageTransition.sceneMix);
    }

    return activeChapter.beat.lighting;
  }, [activeChapter.beat.lighting, blendFromChapter.beat.lighting, blendToChapter, stageTransition]);

  const bloomStrength = useMemo(() => {
    if (blendToChapter && stageTransition) {
      return lerp(blendFromChapter.beat.layerBudget.bloomStrength, blendToChapter.beat.layerBudget.bloomStrength, stageTransition.sceneMix);
    }

    return activeChapter.beat.layerBudget.bloomStrength;
  }, [activeChapter.beat.layerBudget.bloomStrength, blendFromChapter.beat.layerBudget.bloomStrength, blendToChapter, stageTransition]);

  const activeCredits = useMemo<OriginAssetCreditEntry[]>(() => {
    const creditIds = new Set<string>();
    const primaryConfig = originAssetManifest[activeChapter.beat.assetSlot];
    primaryConfig.creditIds.forEach((id) => creditIds.add(id));

    if (stageTransition && blendToChapter) {
      originAssetManifest[blendToChapter.beat.assetSlot].creditIds.forEach((id) => creditIds.add(id));
    }

    return Array.from(creditIds)
      .map((id) => originAssetCreditsById[id])
      .filter(Boolean);
  }, [activeChapter.beat.assetSlot, blendToChapter, stageTransition]);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    upsertRuntimeContextEntry({
      pagePath: "/origin",
      id: ORIGIN_RUNTIME_CONTEXT_ID,
      componentName: "OriginStoryExperience",
      componentPath: ["OriginStoryPage", "OriginStoryExperience"],
      filePath: "/src/components/OriginStory/OriginStoryExperience.tsx",
      role: "story-runtime",
      metadata: {
        activeBeatId: activeChapter.beat.id,
        chapterLabel: activeChapter.beat.chapterLabel,
        chapterIndex: timeline.activeIndex,
        chapterProgress: Number(activeChapter.localProgress.toFixed(4)),
        holdProgress: Number(activeChapter.holdProgress.toFixed(4)),
        timelineProgress: Number(timeline.smoothedProgress.toFixed(4)),
        phase: activeChapter.phase,
        phaseProgress: Number(activeChapter.phaseProgress.toFixed(4)),
        renderedChapterIndices,
        transition: stageTransition
          ? {
              fromId: stageTransition.fromId,
              toId: stageTransition.toId,
              boundaryIndex: stageTransition.boundaryIndex,
              progress: Number(stageTransition.progress.toFixed(4)),
              sceneMix: Number(stageTransition.sceneMix.toFixed(4)),
              cameraMix: Number(stageTransition.cameraMix.toFixed(4)),
              direction: stageTransition.direction,
              adjacentIndex: stageTransition.adjacentIndex,
            }
          : null,
        hotspotState: {
          activeHotspotId,
          activeSubsceneId: activeSubscene?.definition.id ?? null,
          subsceneBeatId: activeSubscene?.beatId ?? null,
          subsceneMode: activeSubscene?.mode ?? null,
          subsceneProgress: activeSubscene ? Number(activeSubscene.progress.toFixed(4)) : null,
        },
        creditsOpen,
        creditCount: activeCredits.length,
        assetSlot: activeChapter.beat.assetSlot,
        qualityTier: tier,
        qualityFactor: Number(qualityFactor.toFixed(4)),
      },
    });

    return () => {
      removeRuntimeContextEntry("/origin", ORIGIN_RUNTIME_CONTEXT_ID);
    };
  }, [
    activeChapter.beat.assetSlot,
    activeChapter.beat.chapterLabel,
    activeChapter.beat.id,
    activeChapter.holdProgress,
    activeChapter.localProgress,
    activeChapter.phase,
    activeChapter.phaseProgress,
    activeCredits.length,
    activeHotspotId,
    activeSubscene,
    creditsOpen,
    qualityFactor,
    renderedChapterIndices,
    stageTransition,
    tier,
    timeline.activeIndex,
    timeline.smoothedProgress,
  ]);

  const environmentUrl = useMemo(() => {
    if (!stageTransition || !blendToChapter) {
      return activeAssetConfig.environmentUrl;
    }

    const fromEnvironment = originAssetManifest[blendFromChapter.beat.assetSlot].environmentUrl;
    const toEnvironment = originAssetManifest[blendToChapter.beat.assetSlot].environmentUrl;
    return stageTransition.progress < 0.58 ? fromEnvironment : toEnvironment;
  }, [activeAssetConfig.environmentUrl, blendFromChapter.beat.assetSlot, blendToChapter, stageTransition]);

  const pointerScale = reducedMotion ? 0.32 : 1;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const target = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - target.left) / target.width) * 2 - 1;
    const y = ((event.clientY - target.top) / target.height) * 2 - 1;
    setPointer((previous) => ({
      x: lerp(previous.x, clamp01((x + 1) / 2) * 2 - 1, 0.36 * pointerScale),
      y: lerp(previous.y, clamp01((y + 1) / 2) * 2 - 1, 0.36 * pointerScale),
    }));
  };

  const handleSelectHotspot = useCallback(
    (hotspotId: string): void => {
      if (activeSubscene) {
        return;
      }

      setActiveHotspotId((previous) => (previous === hotspotId ? null : hotspotId));
    },
    [activeSubscene],
  );

  const handleExploreSubscene = useCallback(
    (subsceneId: string): void => {
      if (activeSubscene) {
        return;
      }

      const definition = getSubsceneById(activeChapter.beat, subsceneId);
      if (!definition) {
        return;
      }

      const lockedScrollTop = scrollContainerRef.current?.scrollTop ?? 0;
      setCreditsOpen(false);
      setActiveHotspotId(definition.hotspotId);
      setActiveSubscene({
        beatId: activeChapter.beat.id,
        definition,
        progress: 0,
        blend: 0,
        mode: "entering",
        lockedScrollTop,
      });
    },
    [activeChapter.beat, activeSubscene, scrollContainerRef],
  );

  const handleCloseSubscene = useCallback((): void => {
    setActiveSubscene((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        mode: "exiting",
      };
    });
  }, []);

  const handleAdvanceSubscene = useCallback((delta: number): void => {
    setActiveSubscene((previous) => {
      if (!previous || previous.mode === "exiting") {
        return previous;
      }

      const nextProgress = clamp01(previous.progress + delta);
      if (previous.mode === "active" && delta < 0 && previous.progress <= 0.02 && nextProgress <= 0.02) {
        return {
          ...previous,
          progress: 0,
          mode: "exiting",
        };
      }

      return {
        ...previous,
        progress: nextProgress,
      };
    });
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent): void => {
      if (activeSubscene) {
        if (event.key === "Escape") {
          event.preventDefault();
          handleCloseSubscene();
          return;
        }

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          handleAdvanceSubscene(0.08);
          return;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          handleAdvanceSubscene(-0.08);
        }

        return;
      }

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
  }, [Boolean(activeSubscene), handleAdvanceSubscene, handleCloseSubscene, jumpToNextChapter, jumpToPrevChapter]);

  const accentColor = new THREE.Color(blendedPalette.accent);
  const secondaryColor = new THREE.Color(blendedPalette.secondary);
  const backdropColor = new THREE.Color(blendedPalette.backdrop);

  const stageStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundImage: `
        radial-gradient(circle at 14% 18%, ${toRgba(accentColor, 0.22)}, transparent 34%),
        radial-gradient(circle at 78% 16%, ${toRgba(secondaryColor, 0.18)}, transparent 38%),
        linear-gradient(180deg, ${toRgba(backdropColor, 0.98)} 0%, ${blendedPalette.fog} 48%, #02050b 100%)
      `,
      ["--origin-accent" as string]: blendedPalette.accent,
      ["--origin-secondary" as string]: blendedPalette.secondary,
      ["--origin-panel" as string]: blendedPalette.panel,
      ["--origin-text" as string]: blendedPalette.text,
      ["--origin-glow" as string]: blendedPalette.glow,
      ["--origin-subscene-accent" as string]: activeSubscene?.definition.accent ?? blendedPalette.accent,
    }),
    [accentColor, activeSubscene, backdropColor, blendedPalette, secondaryColor],
  );

  return (
    <section ref={stageRef} className="relative" style={{ minHeight: `${timelineHeightVh}vh` }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden origin-stage-shell"
        style={stageStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      >
        <CanvasErrorBoundary>
          <Canvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: originBeats[0].camera.position, fov: originBeats[0].camera.fov }}
            dpr={dprByTier[tier]}
            shadows={tier !== "mobile"}
            gl={{
              antialias: !reducedMotion,
              alpha: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              (gl as unknown as { outputColorSpace: THREE.ColorSpace }).outputColorSpace = THREE.SRGBColorSpace;
              THREE.ColorManagement.enabled = true;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.08;
              gl.shadowMap.enabled = tier !== "mobile";
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              gl.setClearColor(0x000000, 0);
            }}
          >
            <OriginEnvironmentController url={environmentUrl} />
            <fog attach="fog" args={[blendedPalette.fog, 5.8, 18]} />
            <OriginCameraRig
              preset={blendedCamera}
              pointer={pointer}
              hotspot={activeSubscene ? null : activeHotspot}
              reducedMotion={reducedMotion}
            />
            <OriginLightRig
              lighting={blendedLighting}
              palette={blendedPalette}
              pointer={pointer}
              reducedMotion={reducedMotion}
            />

            <group position={[0, 0.02, 0]}>
              {renderedChapterIndices.map((chapterIndex) => {
                const chapterState = timeline.chapters[chapterIndex];
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
                      beat={chapterState.beat}
                      assetConfig={assetConfig}
                      weight={chapterState.weight}
                      localProgress={chapterState.localProgress}
                      holdProgress={chapterState.holdProgress}
                      globalProgress={smoothedProgress}
                      pointer={pointer}
                      reducedMotion={reducedMotion}
                      qualityTier={tier}
                      qualityFactor={qualityFactor}
                      phase={chapterState.phase}
                      phaseProgress={chapterState.phaseProgress}
                      sceneMix={stageTransition?.sceneMix ?? 0}
                      isActive={timeline.activeIndex === chapterState.index}
                      isAdjacent={adjacentIndex === chapterState.index}
                      transitionDirection={stageTransition?.direction ?? 1}
                      activeHotspotId={activeChapter.beat.id === chapterState.beat.id ? activeHotspotId : null}
                      activeSubscene={activeSubscene && activeSubscene.beatId === chapterState.beat.id ? activeSubscene : null}
                    />
                  </group>
                );
              })}
            </group>

            <SceneBloom
              enabled={!reducedMotion && tier !== "mobile" && bloomStrength > 0.1}
              strength={bloomStrength}
              radius={0.6}
              threshold={0.84}
            />
          </Canvas>
        </CanvasErrorBoundary>

        <OriginTransitionOverlay transition={stageTransition} reducedMotion={reducedMotion} />

        <OriginSubsceneOverlay
          subscene={activeSubscene}
          onAdvance={handleAdvanceSubscene}
          onClose={handleCloseSubscene}
        />

        <div className="pointer-events-none absolute inset-x-0 top-8 z-30 flex justify-center px-5">
          <div className="origin-stage-kicker">
            Origin Lab · {activeChapter.beat.chapterLabel} · {timeline.activeIndex + 1}/{originBeats.length}
          </div>
        </div>

        <OriginHotspotLayer
          hotspots={activeChapter.beat.hotspots}
          activeHotspotId={activeHotspotId}
          activeSubsceneId={activeSubscene?.definition.id ?? null}
          disabled={Boolean(activeSubscene)}
          onSelect={handleSelectHotspot}
          onExplore={handleExploreSubscene}
        />

        <OriginNarrativeOverlay
          beat={activeChapter.beat}
          transition={stageTransition}
          activeHotspotId={activeHotspotId}
          activeHotspot={activeHotspot}
          activeSubscene={activeSubscene}
          creditsOpen={creditsOpen}
          creditCount={activeCredits.length}
          onSelectHotspot={handleSelectHotspot}
          onExploreHotspot={handleExploreSubscene}
          onCloseSubscene={handleCloseSubscene}
          onToggleCredits={() => setCreditsOpen((previous) => !previous)}
        />

        {activeCredits.length ? (
          <OriginCreditsPanel
            open={creditsOpen}
            chapterLabel={activeChapter.beat.chapterLabel}
            entries={activeCredits}
            onClose={() => setCreditsOpen(false)}
          />
        ) : null}

        {controlsEnabled ? (
          <>
            <OriginChapterRail
              beats={originBeats}
              activeIndex={timeline.activeIndex}
              disabled={Boolean(activeSubscene)}
              onSelect={(index) => jumpToChapter(index, "smooth")}
            />
            <OriginBottomScrub
              beats={originBeats}
              activeIndex={timeline.activeIndex}
              progress={smoothedProgress}
              chapterProgressTargets={chapterTargets}
              disabled={Boolean(activeSubscene)}
              onSelect={(index) => jumpToChapter(index, "smooth")}
            />
            <OriginExitControls
              onRequestExitHero={onRequestExitHero}
              onRequestExitConclusion={onRequestExitConclusion}
            />
          </>
        ) : null}

        {import.meta.env.DEV ? (
          <div className="pointer-events-none absolute bottom-28 right-4 z-30 rounded-full bg-slate-950/60 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-50/85">
            slot: {activeChapter.beat.assetSlot} · tier: {tier}
            {activeSubscene ? ` · subscene: ${activeSubscene.definition.id}` : ""}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default OriginStoryExperience;
