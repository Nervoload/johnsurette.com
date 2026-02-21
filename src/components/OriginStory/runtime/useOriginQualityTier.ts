import { useEffect, useMemo, useRef, useState } from "react";
import { OriginQualityTier } from "../types";

interface OriginQualityResult {
  tier: OriginQualityTier;
  factor: number;
}

const factorByTier: Record<OriginQualityTier, number> = {
  mobile: 0.55,
  balanced: 1,
  ultra: 1.25,
};

const downshiftTier = (tier: OriginQualityTier): OriginQualityTier => {
  if (tier === "ultra") return "balanced";
  return "mobile";
};

const pickInitialTier = (reducedMotion: boolean): OriginQualityTier => {
  if (typeof window === "undefined") return "balanced";
  if (reducedMotion) return "mobile";
  if (window.matchMedia("(max-width: 900px)").matches) return "mobile";
  if (window.matchMedia("(min-width: 1560px)").matches) return "ultra";
  return "balanced";
};

export const useOriginQualityTier = (reducedMotion: boolean): OriginQualityResult => {
  const [tier, setTier] = useState<OriginQualityTier>(() => pickInitialTier(reducedMotion));
  const downshiftedRef = useRef(false);

  useEffect(() => {
    const next = pickInitialTier(reducedMotion);
    setTier(next);
    downshiftedRef.current = false;
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const viewportQuery = window.matchMedia("(max-width: 900px)");
    const largeViewportQuery = window.matchMedia("(min-width: 1560px)");

    const syncTier = (): void => {
      if (reducedMotion || viewportQuery.matches) {
        setTier("mobile");
        return;
      }

      if (largeViewportQuery.matches && !downshiftedRef.current) {
        setTier("ultra");
        return;
      }

      setTier((prev) => (prev === "mobile" ? "balanced" : prev === "ultra" ? "ultra" : "balanced"));
    };

    syncTier();
    viewportQuery.addEventListener("change", syncTier);
    largeViewportQuery.addEventListener("change", syncTier);

    return () => {
      viewportQuery.removeEventListener("change", syncTier);
      largeViewportQuery.removeEventListener("change", syncTier);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reducedMotion) return;

    let rafId = 0;
    let frameCount = 0;
    let windowStart = performance.now();
    let lowFpsWindows = 0;

    const tick = (now: number): void => {
      frameCount += 1;

      const elapsed = now - windowStart;
      if (elapsed >= 1500) {
        const fps = (frameCount / elapsed) * 1000;
        frameCount = 0;
        windowStart = now;

        if (fps < 47) {
          lowFpsWindows += 1;
        } else {
          lowFpsWindows = Math.max(0, lowFpsWindows - 1);
        }

        if (lowFpsWindows >= 2 && !downshiftedRef.current) {
          downshiftedRef.current = true;
          setTier((prev) => downshiftTier(prev));
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  return useMemo(
    () => ({
      tier,
      factor: factorByTier[tier],
    }),
    [tier],
  );
};
