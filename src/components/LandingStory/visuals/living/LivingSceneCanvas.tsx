import React, { MutableRefObject, RefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { damp, fovForBleed } from "./core/math.ts";
import { applyThemeMix } from "./shaders/livingCommon.ts";
import type { LivingQualityTier, LivingRuntime, LivingSceneDefinition } from "./sceneTypes";
import type { LivingStore } from "./livingStore";

export interface LivingFrameStats {
  frames: number;
  waiters: Array<() => void>;
}

interface LivingDriverProps {
  runtime: LivingRuntime;
  store: LivingStore;
  slotRef: RefObject<HTMLElement>;
  canvasAreaRef: RefObject<HTMLElement>;
  slotFov: number;
  frozenRef: MutableRefObject<boolean>;
  running: boolean;
  lowFps: boolean;
  stats: LivingFrameStats;
}

const FADE_CSS_PX = 72;

/** Per-frame bookkeeping that runs before the scene: shared uniforms, theme blend, loop clock, stats. */
const LivingDriver: React.FC<LivingDriverProps> = ({
  runtime,
  store,
  slotRef,
  canvasAreaRef,
  slotFov,
  frozenRef,
  running,
  lowFps,
  stats,
}) => {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const advance = useThree((state) => state.advance);
  const buffer = useMemo(() => new THREE.Vector2(), []);
  const themeMix = useRef(runtime.themeMode === "dark" ? 1 : 0);
  const framesThisMount = useRef(0);

  runtime.invalidate = invalidate;

  // Keep the slot framed exactly as designed; the bleed only reveals more around it.
  useEffect(() => {
    const slot = slotRef.current;
    const area = canvasAreaRef.current;
    if (!slot || !area) return;
    const slotH = Math.max(slot.offsetHeight, 1);
    runtime.slotAspect = slot.offsetWidth / slotH;
    camera.fov = fovForBleed(slotFov, slotH, Math.max(area.offsetHeight, 1));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, canvasAreaRef, invalidate, runtime, size.height, size.width, slotFov, slotRef]);

  // Compile shaders and upload buffers once while still offscreen, so scrolling in doesn't hitch.
  useEffect(() => {
    if (running) return;
    const id = requestAnimationFrame(() => advance(performance.now()));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Low tier: 30 fps by invalidating every other animation frame.
  useEffect(() => {
    if (!running || !lowFps) return;
    let frame = 0;
    let id = 0;
    const loop = () => {
      frame += 1;
      if (frame % 2 === 0) invalidate();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [invalidate, lowFps, running]);

  useFrame((state, delta) => {
    const shared = runtime.shared;
    gl.getDrawingBufferSize(buffer);
    shared.uCanvasPx.value.copy(buffer);
    const dpr = state.viewport.dpr;
    shared.uDpr.value = dpr;
    shared.uFadePx.value = FADE_CSS_PX * dpr;
    shared.uPxScale.value = buffer.y / (2 * Math.tan((camera.fov * Math.PI) / 360));
    shared.uMaxPointPx.value = runtime.tier === "high" ? 18 : 12;

    const themeTarget = runtime.themeMode === "dark" ? 1 : 0;
    if (themeMix.current !== themeTarget) {
      themeMix.current = runtime.reducedMotion ? themeTarget : damp(themeMix.current, themeTarget, 9, Math.min(delta, 0.05));
      if (Math.abs(themeMix.current - themeTarget) < 0.002) themeMix.current = themeTarget;
      else invalidate();
    }
    applyThemeMix(shared, themeMix.current);

    const ui = store.get();
    const clock = runtime.clock;
    clock.tick(delta, {
      engaged: runtime.isEngaged(),
      paused: ui.paused,
      autoAdvance: !frozenRef.current && !runtime.reducedMotion,
    });
    shared.uTime.value = clock.state.phase;
    if (clock.state.stageIndex !== ui.stageIndex) store.set({ stageIndex: clock.state.stageIndex });

    stats.frames += 1;
    framesThisMount.current += 1;
    if (framesThisMount.current === 2) store.set({ ready: true });
    if (stats.waiters.length > 0) {
      const waiters = stats.waiters.splice(0);
      requestAnimationFrame(() => waiters.forEach((resolve) => resolve()));
    }
  }, -10);

  return null;
};

interface LivingSceneCanvasProps<TContent> {
  definition: LivingSceneDefinition<TContent>;
  content: TContent;
  runtime: LivingRuntime;
  store: LivingStore;
  running: boolean;
  frozenRef: MutableRefObject<boolean>;
  frozen: boolean;
  tier: LivingQualityTier;
  slotRef: RefObject<HTMLElement>;
  canvasAreaRef: RefObject<HTMLElement>;
  stats: LivingFrameStats;
  onContextLost: () => void;
}

function LivingSceneCanvas<TContent>({
  definition,
  content,
  runtime,
  store,
  running,
  frozenRef,
  frozen,
  tier,
  slotRef,
  canvasAreaRef,
  stats,
  onContextLost,
}: LivingSceneCanvasProps<TContent>) {
  const Scene = definition.Scene;
  const continuous = tier === "high" && !frozen && !runtime.reducedMotion;
  const frameloop = !running ? "never" : continuous ? "always" : "demand";
  const lowFps = tier === "low" && !frozen && !runtime.reducedMotion;

  return (
    <Canvas
      className="h-full w-full"
      style={{ pointerEvents: "none" }}
      dpr={tier === "low" ? [0.85, 1] : [1, 1.5]}
      frameloop={frameloop}
      resize={{ scroll: false, offsetSize: true }}
      camera={{ position: definition.camera.position, fov: definition.camera.fov, near: 0.05, far: 400 }}
      gl={{
        alpha: true,
        antialias: tier === "high",
        powerPreference: "default",
        preserveDrawingBuffer: false,
        premultipliedAlpha: true,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onContextLost();
          },
          { once: true },
        );
      }}
    >
      <LivingDriver
        runtime={runtime}
        store={store}
        slotRef={slotRef}
        canvasAreaRef={canvasAreaRef}
        slotFov={definition.camera.fov}
        frozenRef={frozenRef}
        running={running}
        lowFps={lowFps}
        stats={stats}
      />
      <Scene runtime={runtime} content={content} />
    </Canvas>
  );
}

export default LivingSceneCanvas;
