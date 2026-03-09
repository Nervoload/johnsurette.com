import { ShadowMode } from "./shadowMode";

export type ShadowAssetId = "heroCenterpiece" | "heroTerminalText";

export interface ShadowAssetConfig {
  lightShadowColor: string;
  lightShadowOpacity: number;
  lightShadowBlurPx: number;
  darkGlowColor: string;
  darkGlowOpacity: number;
  darkGlowBlurPx: number;
}

export interface ShadowStyleTokens {
  color: string;
  opacity: number;
  blurPx: number;
  rgba: string;
}

export const shadowAssetRegistry: Record<ShadowAssetId, ShadowAssetConfig> = {
  heroCenterpiece: {
    lightShadowColor: "#020617",
    lightShadowOpacity: 0.4,
    lightShadowBlurPx: 44,
    darkGlowColor: "#22d3ee",
    darkGlowOpacity: 0.58,
    darkGlowBlurPx: 50,
  },
  heroTerminalText: {
    lightShadowColor: "#020617",
    lightShadowOpacity: 0.62,
    lightShadowBlurPx: 24,
    darkGlowColor: "#67e8f9",
    darkGlowOpacity: 0.64,
    darkGlowBlurPx: 30,
  },
};

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;

  const parsed = Number.parseInt(safe, 16);
  const red = (parsed >> 16) & 255;
  const green = (parsed >> 8) & 255;
  const blue = parsed & 255;
  return [red, green, blue];
};

export const getShadowAssetConfig = (assetId: ShadowAssetId): ShadowAssetConfig => {
  return shadowAssetRegistry[assetId];
};

export const resolveShadowGlowColor = (assetId: ShadowAssetId, mode: ShadowMode): string => {
  const config = getShadowAssetConfig(assetId);
  return mode === "dark" ? config.darkGlowColor : config.lightShadowColor;
};

export const resolveShadowStyleTokens = (
  assetId: ShadowAssetId,
  mode: ShadowMode,
): ShadowStyleTokens => {
  const config = getShadowAssetConfig(assetId);
  const color = mode === "dark" ? config.darkGlowColor : config.lightShadowColor;
  const opacity = mode === "dark" ? config.darkGlowOpacity : config.lightShadowOpacity;
  const blurPx = mode === "dark" ? config.darkGlowBlurPx : config.lightShadowBlurPx;
  const [red, green, blue] = hexToRgb(color);

  return {
    color,
    opacity,
    blurPx,
    rgba: `rgba(${red}, ${green}, ${blue}, ${opacity})`,
  };
};
