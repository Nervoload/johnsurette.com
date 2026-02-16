import { useRef, useCallback, RefObject } from "react";

export interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface SwipeOptions {
  /** Minimum horizontal distance (px) to count as a swipe. Default 40. */
  threshold?: number;
  /** If true, also detect vertical swipes. Default false. */
  vertical?: boolean;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  pointerId: number | null;
}

/**
 * Lightweight pointer-event-based swipe detector.
 *
 * Returns `onPointerDown` / `onPointerMove` / `onPointerUp` / `onPointerCancel`
 * handlers to spread onto the swipeable element.  Works for BOTH mouse and
 * touch (pointer events unify them).  Mouse drag behaviour is preserved;
 * the hook only fires callbacks, it never calls preventDefault or
 * stopPropagation so existing click / mouseover handlers keep working.
 */
export function useTouchSwipe(
  callbacks: SwipeCallbacks,
  options: SwipeOptions = {},
) {
  const { threshold = 40, vertical = false } = options;
  const state = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    pointerId: null,
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only track one pointer at a time
      if (state.current.pointerId !== null) return;
      state.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now(),
        pointerId: e.pointerId,
      };
    },
    [],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerId !== state.current.pointerId) return;

      const dx = e.clientX - state.current.startX;
      const dy = e.clientY - state.current.startY;
      const elapsed = performance.now() - state.current.startTime;

      state.current.pointerId = null;

      // Ignore very slow drags (> 800ms) — those are intentional scrolls
      if (elapsed > 800) return;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Horizontal swipe
      if (absDx >= threshold && absDx > absDy) {
        if (dx < 0) callbacks.onSwipeLeft?.();
        else callbacks.onSwipeRight?.();
        return;
      }

      // Vertical swipe
      if (vertical && absDy >= threshold && absDy > absDx) {
        if (dy < 0) callbacks.onSwipeUp?.();
        else callbacks.onSwipeDown?.();
      }
    },
    [callbacks, threshold, vertical],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerId === state.current.pointerId) {
        state.current.pointerId = null;
      }
    },
    [],
  );

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  };
}
