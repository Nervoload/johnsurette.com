import { useEffect, useState } from "react";
import type { AboutStoryQualityMode } from "./types";

export const useAboutQualityMode = () => {
  const [qualityMode, setQualityMode] = useState<AboutStoryQualityMode>("full");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewportQuery = window.matchMedia("(max-width: 920px)");

    const update = () => {
      setQualityMode(reducedMotionQuery.matches || compactViewportQuery.matches ? "reduced" : "full");
    };

    update();

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", update);
      compactViewportQuery.addEventListener("change", update);
    } else {
      reducedMotionQuery.addListener(update);
      compactViewportQuery.addListener(update);
    }

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", update);
        compactViewportQuery.removeEventListener("change", update);
      } else {
        reducedMotionQuery.removeListener(update);
        compactViewportQuery.removeListener(update);
      }
    };
  }, []);

  return qualityMode;
};
