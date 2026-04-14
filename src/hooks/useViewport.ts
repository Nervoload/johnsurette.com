import { useEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";

export interface ViewportMetrics {
  width: number;
  height: number;
  dpr: number;
}

export const COMPACT_VIEWPORT_MAX_WIDTH = 900;
export const SHORT_VIEWPORT_MAX_HEIGHT = 720;
export const LARGE_VIEWPORT_MIN_WIDTH = 1560;

export const COMPACT_VIEWPORT_MEDIA_QUERY = `(max-width: ${COMPACT_VIEWPORT_MAX_WIDTH}px)`;
export const LARGE_VIEWPORT_MEDIA_QUERY = `(min-width: ${LARGE_VIEWPORT_MIN_WIDTH}px)`;

const DEFAULT_VIEWPORT_METRICS: ViewportMetrics = {
  width: 1280,
  height: 720,
  dpr: 1,
};

export const getViewportMetrics = (): ViewportMetrics => {
  if (typeof window === "undefined") {
    return DEFAULT_VIEWPORT_METRICS;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
  };
};

export const isCompactViewport = (viewport: Pick<ViewportMetrics, "width">): boolean => {
  return viewport.width <= COMPACT_VIEWPORT_MAX_WIDTH;
};

export const isShortViewport = (viewport: Pick<ViewportMetrics, "height">): boolean => {
  return viewport.height <= SHORT_VIEWPORT_MAX_HEIGHT;
};

export const isLargeViewport = (viewport: Pick<ViewportMetrics, "width">): boolean => {
  return viewport.width >= LARGE_VIEWPORT_MIN_WIDTH;
};

export const useCompactViewport = (defaultValue = false): boolean => {
  return useMediaQuery(COMPACT_VIEWPORT_MEDIA_QUERY, defaultValue);
};

export const useLargeViewport = (defaultValue = false): boolean => {
  return useMediaQuery(LARGE_VIEWPORT_MEDIA_QUERY, defaultValue);
};

export const useViewportMetrics = (): ViewportMetrics => {
  const [viewportMetrics, setViewportMetrics] = useState<ViewportMetrics>(() => getViewportMetrics());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateViewportMetrics = () => {
      setViewportMetrics(getViewportMetrics());
    };

    updateViewportMetrics();
    window.addEventListener("resize", updateViewportMetrics);
    window.addEventListener("orientationchange", updateViewportMetrics);
    window.visualViewport?.addEventListener("resize", updateViewportMetrics);

    return () => {
      window.removeEventListener("resize", updateViewportMetrics);
      window.removeEventListener("orientationchange", updateViewportMetrics);
      window.visualViewport?.removeEventListener("resize", updateViewportMetrics);
    };
  }, []);

  return viewportMetrics;
};
