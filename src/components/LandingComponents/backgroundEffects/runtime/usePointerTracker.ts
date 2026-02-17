import { MutableRefObject, useEffect, useRef } from "react";
import { BackgroundInteractionMode } from "../types";

export interface PointerTrackerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  clickPulse: number;
  active: boolean;
  strength: number;
}

const interactionStrength = (mode: BackgroundInteractionMode, reducedMotion: boolean): number => {
  if (mode === "off") {
    return 0;
  }

  const base = mode === "subtle" ? 0.36 : 0.72;
  return reducedMotion ? base * 0.55 : base;
};

export const usePointerTracker = (
  interactionMode: BackgroundInteractionMode,
  reducedMotion: boolean
): MutableRefObject<PointerTrackerState> => {
  const pointerRef = useRef<PointerTrackerState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    clickPulse: 0,
    active: false,
    strength: interactionStrength(interactionMode, reducedMotion),
  });

  useEffect(() => {
    pointerRef.current.strength = interactionStrength(interactionMode, reducedMotion);
  }, [interactionMode, reducedMotion]);

  useEffect(() => {
    const onMove = (event: PointerEvent): void => {
      if (typeof window === "undefined") {
        return;
      }

      const nx = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = 1 - (event.clientY / Math.max(1, window.innerHeight)) * 2;
      pointerRef.current.targetX = Math.max(-1, Math.min(1, nx));
      pointerRef.current.targetY = Math.max(-1, Math.min(1, ny));
      pointerRef.current.active = true;
    };

    const onLeave = (): void => {
      pointerRef.current.active = false;
    };

    const onDown = (): void => {
      if (reducedMotion || interactionMode === "off") {
        return;
      }
      pointerRef.current.clickPulse = Math.min(1, pointerRef.current.clickPulse + 0.85);
    };

    let raf = 0;

    const tick = (): void => {
      const state = pointerRef.current;
      const settleX = state.active ? state.targetX : 0;
      const settleY = state.active ? state.targetY : 0;
      const lerp = state.active ? 0.12 : 0.06;

      state.x += (settleX - state.x) * lerp;
      state.y += (settleY - state.y) * lerp;
      state.clickPulse *= reducedMotion ? 0.88 : 0.92;

      if (state.clickPulse < 0.001) {
        state.clickPulse = 0;
      }

      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.cancelAnimationFrame(raf);
    };
  }, [interactionMode, reducedMotion]);

  return pointerRef;
};
