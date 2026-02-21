import { RefObject, useEffect, useRef } from "react";

export type EdgeHandoffDirection = "top" | "bottom";

interface UseEdgeScrollHandoffOptions {
  scrollContainerRef: RefObject<HTMLDivElement>;
  enabled?: boolean;
  onTopExit: () => void;
  onBottomExit: () => void;
}

const TOP_OVERSCROLL_TRIGGER = 120;
const TOUCH_PULL_TRIGGER = 70;
const BOTTOM_EPSILON = 16;

export const useEdgeScrollHandoff = ({
  scrollContainerRef,
  enabled = true,
  onTopExit,
  onBottomExit,
}: UseEdgeScrollHandoffOptions): void => {
  const topAccumRef = useRef(0);
  const topHandledRef = useRef(false);
  const bottomHandledRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleBottomBoundary = (): void => {
      if (bottomHandledRef.current) return;
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - BOTTOM_EPSILON;
      if (!atBottom) return;
      bottomHandledRef.current = true;
      topHandledRef.current = true;
      onBottomExit();
    };

    const handleWheel = (event: WheelEvent): void => {
      if (topHandledRef.current) return;
      if (container.scrollTop > BOTTOM_EPSILON) {
        topAccumRef.current = 0;
        return;
      }

      if (event.deltaY < 0) {
        topAccumRef.current += Math.abs(event.deltaY);
      } else {
        topAccumRef.current = Math.max(0, topAccumRef.current - event.deltaY * 0.7);
      }

      if (topAccumRef.current < TOP_OVERSCROLL_TRIGGER) return;
      topHandledRef.current = true;
      bottomHandledRef.current = true;
      onTopExit();
    };

    const handleTouchStart = (event: TouchEvent): void => {
      if (!event.touches[0]) return;
      touchStartYRef.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent): void => {
      if (topHandledRef.current) return;
      if (container.scrollTop > BOTTOM_EPSILON) return;
      const touch = event.touches[0];
      if (!touch || touchStartYRef.current === null) return;
      const pullDistance = touch.clientY - touchStartYRef.current;
      if (pullDistance < TOUCH_PULL_TRIGGER) return;
      topHandledRef.current = true;
      bottomHandledRef.current = true;
      onTopExit();
    };

    const handleTouchEnd = (): void => {
      touchStartYRef.current = null;
    };

    container.addEventListener("scroll", handleBottomBoundary, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    handleBottomBoundary();

    return () => {
      container.removeEventListener("scroll", handleBottomBoundary);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, onBottomExit, onTopExit, scrollContainerRef]);
};
