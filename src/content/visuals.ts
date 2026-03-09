import { definePageVisual } from "./define";
import { PageVisuals } from "./types";

// EDIT HERE: page-level background and visual effect choices.
export const pageVisuals: PageVisuals = {
  landing: definePageVisual({
    backgroundClassName: "theme-bg-landing",
    footerBackgroundColor: "var(--theme-footer-panel-bg)",
    backdropEffectId: "bioticParticles",
    backdropQuality: "balanced",
    backdropInteractionMode: "medium",
    backdropStyleSeed: 37,
    centerpieceId: "waveOrb",
  }),
  projects: definePageVisual({
    backgroundClassName: "theme-bg-projects",
    footerBackgroundColor: "var(--theme-footer-panel-bg)",
    footerRunwayVh: 84,
    backdropEffectId: "bioticParticles",
    backdropQuality: "balanced",
    backdropInteractionMode: "subtle",
    backdropStyleSeed: 91,
    backdropClassName: "pointer-events-none absolute inset-0 h-full w-full opacity-[0.62]",
    backdropOverlayClassName: "theme-projects-backdrop-overlay absolute inset-0",
  }),
  about: definePageVisual({
    backgroundClassName: "theme-bg-about",
    footerBackgroundColor: "var(--theme-footer-panel-bg)",
  }),
  blog: definePageVisual({
    backgroundClassName: "theme-bg-blog",
    footerBackgroundColor: "var(--theme-footer-panel-bg)",
  }),
  contact: definePageVisual({
    backgroundClassName: "theme-bg-contact",
    footerBackgroundColor: "var(--theme-footer-panel-bg)",
    footerRunwayVh: 84,
    dotFieldPointCount: 240,
  }),
};
