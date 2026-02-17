import React, { useEffect, useMemo, useState } from "react";
import { DensityPreset, PalettePreset } from "../biotic/types";
import { defaultBackgroundEffectId, backgroundEffectRegistry } from "./backgroundEffectRegistry";
import { resolveBackgroundQuality, detectWebGLSupport } from "./runtime/quality";
import {
  BackgroundEffectId,
  BackgroundInteractionMode,
  BackgroundQualityPreset,
} from "./types";

export interface BackgroundEffectHostProps {
  effectId?: BackgroundEffectId;
  quality?: BackgroundQualityPreset;
  interactionMode?: BackgroundInteractionMode;
  styleSeed?: number;
  className?: string;

  // Legacy biotic controls retained for compatibility.
  preset?: DensityPreset;
  palette?: PalettePreset;
  flowStrength?: number;
}

const BackgroundEffectHost: React.FC<BackgroundEffectHostProps> = ({
  effectId,
  quality,
  interactionMode = "medium",
  styleSeed = 17,
  className,
  preset,
  palette,
  flowStrength,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  const supportsWebGL = useMemo(() => detectWebGLSupport(), []);
  const resolvedQuality = useMemo(() => resolveBackgroundQuality(quality), [quality]);

  const requestedId = effectId ?? defaultBackgroundEffectId;
  const requestedEntry = backgroundEffectRegistry[requestedId];
  const activeEntry = requestedEntry.requiresWebGL && !supportsWebGL
    ? backgroundEffectRegistry.bioticParticles
    : requestedEntry;

  const ActiveComponent = activeEntry.component;

  return (
    <ActiveComponent
      quality={resolvedQuality}
      interactionMode={interactionMode}
      styleSeed={styleSeed}
      reducedMotion={reducedMotion}
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
      preset={preset}
      palette={palette}
      flowStrength={flowStrength}
    />
  );
};

export default BackgroundEffectHost;
