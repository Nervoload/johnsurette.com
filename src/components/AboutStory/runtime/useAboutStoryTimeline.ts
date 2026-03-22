import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import type { AboutStoryNode } from "../../../content/aboutStory";
import { buildAboutTimelineBounds, computeAboutTimeline, getAboutNodeScrollTop } from "./aboutStoryTimeline";
import type { AboutStoryDirection } from "../types";

interface UseAboutStoryTimelineOptions {
  primaryNodes: AboutStoryNode[];
  scrollContainerRef: RefObject<HTMLDivElement>;
  sectionRef: RefObject<HTMLElement>;
}

export const useAboutStoryTimeline = ({
  primaryNodes,
  scrollContainerRef,
  sectionRef,
}: UseAboutStoryTimelineOptions) => {
  const [rawProgress, setRawProgress] = useState(0);
  const [smoothedProgress, setSmoothedProgress] = useState(0);
  const directionRef = useRef<AboutStoryDirection>(1);
  const previousRawProgressRef = useRef(0);
  const bounds = useMemo(() => buildAboutTimelineBounds(primaryNodes), [primaryNodes]);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const smoothedScrollYProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 180,
    mass: 0.34,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const delta = value - previousRawProgressRef.current;
    if (Math.abs(delta) > 0.0008) {
      directionRef.current = delta >= 0 ? 1 : -1;
    }
    previousRawProgressRef.current = value;
    setRawProgress(value);
  });

  useMotionValueEvent(smoothedScrollYProgress, "change", (value) => {
    setSmoothedProgress(value);
  });

  const timeline = useMemo(
    () => computeAboutTimeline(rawProgress, smoothedProgress, directionRef.current, bounds),
    [bounds, rawProgress, smoothedProgress],
  );

  const jumpToTimelineIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      const section = sectionRef.current;
      if (!container || !section || bounds.length === 0) return;

      const top = getAboutNodeScrollTop(index, bounds, section, container);
      container.scrollTo({ top, behavior });
    },
    [bounds, scrollContainerRef, sectionRef],
  );

  const jumpToNodeId = useCallback(
    (nodeId: string, behavior: ScrollBehavior = "smooth") => {
      const index = primaryNodes.findIndex((node) => node.id === nodeId);
      if (index < 0) return;
      jumpToTimelineIndex(index, behavior);
    },
    [jumpToTimelineIndex, primaryNodes],
  );

  return {
    rawProgress,
    smoothedProgress,
    direction: directionRef.current,
    bounds,
    timeline,
    jumpToTimelineIndex,
    jumpToNodeId,
  };
};
