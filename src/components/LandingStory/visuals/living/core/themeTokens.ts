// Scene colors per site theme. Dark reads as light emitted on a deep field; light reads as ink on paper.
// Hex values follow the site's existing theme tokens (src/index.css) so scenes sit in both modes.

export type LivingThemeMode = "light" | "dark";

export interface LivingThemeTokens {
  /** Primary strokes and text-like marks. */
  ink: string;
  /** Quiet structure: guides, inactive edges. */
  dim: string;
  /** Main activity color (signals, spikes, winners). */
  signal: string;
  /** Second series (inhibition, metabolites, white matter). */
  signal2: string;
  /** Warm accent (potentiation, long-range projections). */
  warm: string;
  amber: string;
  mint: string;
  /**
   * How much a mark covers what is behind it. Near 0 is additive glow (dark field), 1 is opaque ink.
   * Fed to the premultiplied blend as the alpha written to the canvas.
   */
  coverage: number;
}

export const LIVING_THEME_TOKENS: Record<LivingThemeMode, LivingThemeTokens> = {
  dark: {
    ink: "#e2e8f0",
    dim: "#475569",
    signal: "#22d3ee",
    signal2: "#a78bfa",
    warm: "#f472b6",
    amber: "#fbbf24",
    mint: "#34d399",
    coverage: 0.16,
  },
  light: {
    ink: "#0f172a",
    dim: "#94a3b8",
    signal: "#0e7490",
    signal2: "#6d28d9",
    warm: "#be185d",
    amber: "#b45309",
    mint: "#047857",
    coverage: 1,
  },
};
