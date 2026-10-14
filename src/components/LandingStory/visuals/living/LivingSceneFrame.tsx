import React, { RefObject, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import CanvasErrorBoundary from "../../../CanvasErrorBoundary";
import { detectWebGLSupport } from "../../../LandingComponents/backgroundEffects/runtime/quality";
import { createLoopClock } from "./core/loopClock.ts";
import type { LivingThemeMode } from "./core/themeTokens.ts";
import { createSharedUniforms } from "./shaders/livingCommon.ts";
import type { LivingQualityTier, LivingRuntime, LivingSceneDefinition, LivingStage } from "./sceneTypes";
import { createLivingStore, useLivingStore } from "./livingStore";
import { isPointerEngaged, useScenePointer } from "./useScenePointer";
import { useLivingMount } from "./useLivingMount";
import { readLivingQuery, registerLivingDebug } from "./livingDebug";
import LivingSceneControls from "./LivingSceneControls";
import LivingSceneCanvas, { LivingFrameStats } from "./LivingSceneCanvas";

let webglSupportCache: boolean | null = null;
const hasWebGL = () => {
  if (webglSupportCache === null) webglSupportCache = detectWebGLSupport();
  return webglSupportCache;
};

/** Where a stage dot lands: the start of the stage when playing, a representative moment when stepping. */
const STEP_KEYFRAME = 0.62;
const keyframeOffset = (stage: LivingStage) => stage.duration * (stage.keyframe ?? STEP_KEYFRAME);

export interface LivingSceneFrameProps<TContent> {
  definition: LivingSceneDefinition<TContent>;
  content: TContent;
  themeMode: LivingThemeMode;
  qualityTier: LivingQualityTier;
  handheld?: boolean;
  scrollRootRef?: RefObject<HTMLElement>;
  fallback: { src: string; alt: string };
  /** Accessible name, e.g. "Forward pass: a neural network running on photos of John". */
  title: string;
  description: string;
  /** Slot sizing (the area the scene is framed for). */
  className?: string;
  /** Negative insets for the canvas so the scene can spill past the slot. */
  bleedClassName?: string;
  controlsClassName?: string;
  /** Lab only: dashed outline of the canvas bounds. */
  debugOutline?: boolean;
}

function LivingSceneFrame<TContent>({
  definition,
  content,
  themeMode,
  qualityTier,
  handheld = false,
  scrollRootRef,
  fallback,
  title,
  description,
  className = "",
  bleedClassName = "-inset-x-[min(10vw,9rem)] -inset-y-[min(14vh,9rem)]",
  controlsClassName = "absolute inset-x-3 bottom-3 z-30 sm:inset-x-5 sm:bottom-5",
  debugOutline = false,
}: LivingSceneFrameProps<TContent>) {
  const slotRef = useRef<HTMLDivElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef(new Map<string, HTMLElement>());
  const descriptionId = useId();
  const reducedMotion = qualityTier === "static";
  const [webgl] = useState(() => (typeof window === "undefined" ? false : hasWebGL()));
  const [canvasKey, setCanvasKey] = useState(0);
  const losses = useRef(0);

  const query = useMemo(() => readLivingQuery(definition.id), [definition.id]);
  const [frozen, setFrozen] = useState(query.freeze);
  const frozenRef = useRef(frozen);
  frozenRef.current = frozen;

  const store = useMemo(
    () => createLivingStore({ stageIndex: 0, paused: false, ready: false, failed: !webgl }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const failed = useLivingStore(store, (state) => state.failed);
  const ready = useLivingStore(store, (state) => state.ready);
  const stats = useRef<LivingFrameStats>({ frames: 0, waiters: [] }).current;

  const pointerRef = useScenePointer({
    hitRef,
    canvasAreaRef,
    allowOrbit: !handheld && !reducedMotion,
  });

  const runtime = useMemo<LivingRuntime>(() => {
    const clock = createLoopClock(definition.stages);
    if (query.phase !== null) clock.seek(query.phase);
    else if (reducedMotion) {
      const still = definition.stillStage ?? 0;
      clock.seek(clock.stageStart(still) + keyframeOffset(definition.stages[still]));
    }
    const value: LivingRuntime = {
      clock,
      pointer: pointerRef.current,
      shared: createSharedUniforms(themeMode === "dark" ? 1 : 0),
      labels: { get: (id) => labelRefs.current.get(id) ?? null },
      tier: qualityTier,
      handheld,
      reducedMotion,
      density: qualityTier === "high" ? 1 : 0.5,
      themeMode,
      slotAspect: 1,
      invalidate: () => undefined,
      isEngaged: () => isPointerEngaged(pointerRef.current),
    };
    return value;
    // Runtime is created once; live values are synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definition]);

  useEffect(() => {
    runtime.themeMode = themeMode;
    runtime.tier = qualityTier;
    runtime.handheld = handheld;
    runtime.reducedMotion = reducedMotion;
    runtime.density = qualityTier === "high" ? 1 : 0.5;
    runtime.invalidate();
  }, [handheld, qualityTier, reducedMotion, runtime, themeMode]);

  const { mounted, running } = useLivingMount({
    slotRef,
    scrollRootRef,
    allowUnmount: handheld || qualityTier !== "high",
  });

  // Give a lost context two more chances, on the next time the scene comes near.
  useEffect(() => {
    if (!mounted && failed && webgl && losses.current > 0 && losses.current <= 2) {
      store.set({ failed: false, ready: false });
      setCanvasKey((key) => key + 1);
    }
  }, [failed, mounted, store, webgl]);

  const handleContextLost = useCallback(() => {
    losses.current += 1;
    store.set({ failed: true, ready: false });
  }, [store]);

  const selectStage = useCallback(
    (index: number) => {
      const clock = runtime.clock;
      const offset = reducedMotion || frozenRef.current ? keyframeOffset(definition.stages[index]) : 0;
      const base = clock.state.loopIndex * clock.total;
      clock.seek(base + clock.stageStart(index) + offset);
      store.set({ stageIndex: index });
      runtime.invalidate();
    },
    [definition.stages, reducedMotion, runtime, store],
  );

  const togglePause = useCallback(() => {
    store.set({ paused: !store.get().paused });
    runtime.invalidate();
  }, [runtime, store]);

  useEffect(
    () =>
      registerLivingDebug(definition.id, {
        seek: (phase) => {
          runtime.clock.seek(phase);
          store.set({ stageIndex: runtime.clock.state.stageIndex });
          runtime.invalidate();
        },
        freeze: (on) => setFrozen(on),
        frames: () => stats.frames,
        whenRendered: () =>
          new Promise<void>((resolve) => {
            stats.waiters.push(resolve);
            runtime.invalidate();
          }),
        state: () => ({ ...runtime.clock.state, ...store.get(), mounted, running, frozen }),
      }),
    [definition.id, frozen, mounted, running, runtime, stats, store],
  );

  const showCanvas = webgl && mounted && !failed;

  return (
    <div
      ref={slotRef}
      className={`living-frame relative ${className}`}
      onFocus={() => {
        pointerRef.current.focus = true;
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) pointerRef.current.focus = false;
      }}
    >
      <div
        ref={canvasAreaRef}
        aria-hidden="true"
        className={`pointer-events-none absolute transition-opacity duration-700 ${bleedClassName} ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {showCanvas ? (
          <CanvasErrorBoundary key={canvasKey} fallback={null} onError={handleContextLost}>
            <LivingSceneCanvas
              definition={definition}
              content={content}
              runtime={runtime}
              store={store}
              running={running}
              frozenRef={frozenRef}
              frozen={frozen}
              tier={qualityTier}
              slotRef={slotRef}
              canvasAreaRef={canvasAreaRef}
              stats={stats}
              onContextLost={handleContextLost}
            />
          </CanvasErrorBoundary>
        ) : null}
        <div className="living-labels absolute inset-0">
          {definition.labels.map((label) => (
            <span
              key={label.id}
              ref={(element) => {
                if (element) labelRefs.current.set(label.id, element);
                else labelRefs.current.delete(label.id);
              }}
              className="living-label"
              data-tone={label.tone ?? "muted"}
              data-align={label.align ?? "left"}
            >
              {label.text}
            </span>
          ))}
        </div>
        {debugOutline ? <div className="absolute inset-0 rounded-sm outline-dashed outline-1 outline-fuchsia-500/70" /> : null}
      </div>

      {failed ? (
        <img
          src={fallback.src}
          alt={fallback.alt}
          className="absolute inset-0 h-full w-full rounded-[2.4rem] object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <div
        ref={hitRef}
        role="img"
        aria-label={title}
        aria-describedby={descriptionId}
        className="living-hit absolute inset-0 z-20 touch-pan-y rounded-[2rem] outline-none"
      />
      <p id={descriptionId} className="sr-only">
        {description}
      </p>

      <LivingSceneControls
        stages={definition.stages}
        store={store}
        sceneTitle={title.split(":")[0]}
        onSelectStage={selectStage}
        onTogglePause={togglePause}
        className={controlsClassName}
      />
    </div>
  );
}

export default LivingSceneFrame;
