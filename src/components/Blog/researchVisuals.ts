import type { CSSProperties } from "react";
import type { BlogPostEntry } from "../../content";
import { ResolvedThemeMode } from "../theme/themeMode";

export const getResearchLayoutIds = (postId: string) => ({
  shell: `research-shell-${postId}`,
  media: `research-media-${postId}`,
  meta: `research-meta-${postId}`,
  title: `research-title-${postId}`,
  hook: `research-hook-${postId}`,
});

const parseHex = (value: string): { r: number; g: number; b: number } | null => {
  if (!value.startsWith("#")) return null;
  const trimmed = value.slice(1);
  const normalized =
    trimmed.length === 3
      ? trimmed
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : trimmed;

  if (normalized.length !== 6) return null;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
};

const toHex = (rgb: { r: number; g: number; b: number }): string =>
  `#${[rgb.r, rgb.g, rgb.b]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"))
    .join("")}`;

const mixHex = (a: string, b: string, bWeight: number): string => {
  const rgbA = parseHex(a);
  const rgbB = parseHex(b);
  if (!rgbA || !rgbB) return a;

  const alpha = Math.max(0, Math.min(1, bWeight));
  const inv = 1 - alpha;

  return toHex({
    r: rgbA.r * inv + rgbB.r * alpha,
    g: rgbA.g * inv + rgbB.g * alpha,
    b: rgbA.b * inv + rgbB.b * alpha,
  });
};

export const getResearchThemeStyle = (post: BlogPostEntry, themeMode: ResolvedThemeMode): CSSProperties => {
  const { palette, accentLight } = post.visualIdentity;
  const isDark = themeMode === "dark";
  const darkCellBase = "#11213d";
  const lightPaperBase = "#f6f4ec";

  const themedPalette = isDark
    ? {
        background: darkCellBase,
        surface: mixHex(palette.surface, darkCellBase, 0.52),
        accent: mixHex(palette.accent, "#0f172a", 0.36),
        highlight: mixHex(palette.highlight, "#cbd5e1", 0.48),
        text: "#f8fafc",
        lightColor: mixHex(accentLight.color, "#60a5fa", 0.24),
        lightOpacity: Math.min(0.34, accentLight.opacity * 0.72),
      }
    : {
        background: lightPaperBase,
        surface: mixHex(palette.surface, lightPaperBase, 0.58),
        accent: mixHex(palette.accent, "#1f2937", 0.2),
        highlight: mixHex(palette.highlight, "#0f172a", 0.58),
        text: "#0f172a",
        lightColor: mixHex(accentLight.color, "#0ea5e9", 0.14),
        lightOpacity: Math.min(0.24, accentLight.opacity * 0.52),
      };

  return {
    "--research-bg": themedPalette.background,
    "--research-surface": themedPalette.surface,
    "--research-accent": themedPalette.accent,
    "--research-highlight": themedPalette.highlight,
    "--research-text": themedPalette.text,
    "--research-light-color": themedPalette.lightColor,
    "--research-light-x": `${accentLight.x}%`,
    "--research-light-y": `${accentLight.y}%`,
    "--research-light-blur": `${accentLight.blur}px`,
    "--research-light-opacity": themedPalette.lightOpacity,
  } as CSSProperties;
};
