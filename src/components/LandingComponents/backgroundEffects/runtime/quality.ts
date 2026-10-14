import { BackgroundQualityPreset } from "../types";
import { getViewportMetrics, isCompactViewport } from "../../../../hooks/useViewport";

export const BACKGROUND_QUALITY_FACTORS: Record<BackgroundQualityPreset, number> = {
  mobile: 0.55,
  balanced: 1,
  ultra: 1.35,
};

export const resolveBackgroundQuality = (requested?: BackgroundQualityPreset): BackgroundQualityPreset => {
  if (requested) {
    return requested;
  }

  if (typeof window === "undefined") {
    return "balanced";
  }

  return isCompactViewport(getViewportMetrics()) ? "mobile" : "balanced";
};

export const qualityFactor = (quality: BackgroundQualityPreset): number => {
  return BACKGROUND_QUALITY_FACTORS[quality] ?? BACKGROUND_QUALITY_FACTORS.balanced;
};

export const scaleCountByQuality = (count: number, quality: BackgroundQualityPreset): number => {
  return Math.max(1, Math.floor(count * qualityFactor(quality)));
};

export const detectWebGLSupport = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // Release the probe context right away; browsers cap how many can exist at once.
    (context as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
};
