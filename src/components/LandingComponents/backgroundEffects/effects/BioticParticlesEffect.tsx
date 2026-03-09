import React, { useEffect, useMemo, useRef } from "react";
import { drawSimulation } from "../../biotic/draw";
import { createSimulation, resizeSimulation, stepSimulation } from "../../biotic/sim";
import { DensityPreset } from "../../biotic/types";
import { usePointerTracker } from "../runtime/usePointerTracker";
import { BackgroundEffectProps } from "../types";

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const presetFromQuality = (quality: BackgroundEffectProps["quality"]): DensityPreset => {
  if (quality === "mobile") {
    return "low";
  }

  if (quality === "ultra") {
    return "high";
  }

  return "balanced";
};

const BioticParticlesEffect: React.FC<BackgroundEffectProps> = ({
  quality,
  interactionMode,
  reducedMotion,
  className,
  preset,
  palette,
  flowStrength,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = usePointerTracker(interactionMode, reducedMotion);
  const pointerSampleRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  const effectivePreset = useMemo(() => preset ?? presetFromQuality(quality), [preset, quality]);
  const effectivePalette = palette ?? "biotic";
  const effectiveFlow = clamp(flowStrength ?? 1, 0.35, 2.6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let lastTime = performance.now();

    let simulation = createSimulation({
      width: 1,
      height: 1,
      dpr: 1,
      preset: effectivePreset,
      palette: effectivePalette,
      reducedMotion: false,
      flowStrength: effectiveFlow,
    });

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    simulation.reducedMotion = mediaQuery.matches;

    const syncCanvasSize = (): void => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      resizeSimulation(simulation, width, height, dpr);
    };

    const onMotionChange = (event: MediaQueryListEvent): void => {
      simulation.reducedMotion = event.matches;
    };

    const tick = (time: number): void => {
      const delta = Math.min(0.05, Math.max(0.001, (time - lastTime) / 1000));
      lastTime = time;

      simulation.flowStrength = effectiveFlow;
      const pointer = pointerRef.current;
      const nextPointerX = (pointer.targetX + 1) * 0.5;
      const nextPointerY = (1 - pointer.targetY) * 0.5;
      const prevPointer = pointerSampleRef.current;
      const pointerVelocityX = width > 0 ? ((nextPointerX - prevPointer.x) * width) / Math.max(delta, 0.001) : 0;
      const pointerVelocityY = height > 0 ? ((nextPointerY - prevPointer.y) * height) / Math.max(delta, 0.001) : 0;
      const pointerSpeed = Math.hypot(pointerVelocityX, pointerVelocityY);
      const speedBoost = clamp(pointerSpeed / 900, 0, 0.45);

      simulation.pointerField.active = pointer.active && pointer.strength > 0;
      simulation.pointerField.nx = nextPointerX;
      simulation.pointerField.ny = nextPointerY;
      simulation.pointerField.velocityX = pointerVelocityX;
      simulation.pointerField.velocityY = pointerVelocityY;
      simulation.pointerField.strength = simulation.pointerField.active ? Math.min(1.28, pointer.strength * 1.18 + speedBoost) : 0;
      simulation.pointerField.pulse = pointer.clickPulse;

      pointerSampleRef.current = {
        x: nextPointerX,
        y: nextPointerY,
      };

      stepSimulation(simulation, delta);
      drawSimulation(context, simulation);
      raf = window.requestAnimationFrame(tick);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new window.ResizeObserver(syncCanvasSize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", syncCanvasSize);
    }

    mediaQuery.addEventListener("change", onMotionChange);
    syncCanvasSize();
    raf = window.requestAnimationFrame(tick);

    return () => {
      mediaQuery.removeEventListener("change", onMotionChange);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", syncCanvasSize);
      }
      window.cancelAnimationFrame(raf);
    };
  }, [effectiveFlow, effectivePalette, effectivePreset, interactionMode, pointerRef, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
      aria-hidden
    />
  );
};

export default BioticParticlesEffect;
