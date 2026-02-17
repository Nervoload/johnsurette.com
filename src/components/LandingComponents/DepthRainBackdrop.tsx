import React from "react";
import BackgroundEffectHost from "./backgroundEffects/BackgroundEffectHost";
import { DensityPreset, PalettePreset } from "./biotic/types";
import {
  BackgroundEffectId,
  BackgroundInteractionMode,
  BackgroundQualityPreset,
} from "./backgroundEffects/types";

export interface DepthRainBackdropProps {
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

const DepthRainBackdrop: React.FC<DepthRainBackdropProps> = ({
  effectId,
  quality,
  interactionMode = "medium",
  styleSeed = 17,
  className,
  preset,
  palette,
  flowStrength,
}) => {
  const resolvedEffectId =
    effectId ??
    (preset !== undefined || palette !== undefined || flowStrength !== undefined
      ? "bioticParticles"
      : undefined);

  return (
    <BackgroundEffectHost
      effectId={resolvedEffectId}
      quality={quality}
      interactionMode={interactionMode}
      styleSeed={styleSeed}
      className={className}
      preset={preset}
      palette={palette}
      flowStrength={flowStrength}
    />
  );
};

export default DepthRainBackdrop;

