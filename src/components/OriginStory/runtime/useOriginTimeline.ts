import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { OriginBeatDefinition, OriginDirection, OriginTimelineState } from "../types";
import {
  OriginChapterBound,
  buildChapterBounds,
  computeOriginTimeline,
  getChapterScrollTop,
} from "./chapterTimeline";

interface UseOriginTimelineOptions {
  beats: OriginBeatDefinition[];
  scrollContainerRef: RefObject<HTMLDivElement>;
  stageRef: RefObject<HTMLElement>;
}

interface UseOriginTimelineResult {
  rawProgress: number;
  smoothedProgress: number;
  timeline: OriginTimelineState;
  chapterBounds: OriginChapterBound[];
  jumpToChapter: (index: number, behavior?: ScrollBehavior) => void;
  jumpToNextChapter: (behavior?: ScrollBehavior) => void;
  jumpToPrevChapter: (behavior?: ScrollBehavior) => void;
}

const clampIndex = (index: number, max: number): number => Math.max(0, Math.min(index, max));

export const useOriginTimeline = ({
  beats,
  scrollContainerRef,
  stageRef,
}: UseOriginTimelineOptions): UseOriginTimelineResult => {
  const [rawProgress, setRawProgress] = useState(0);
  const [smoothedProgress, setSmoothedProgress] = useState(0);
  const directionRef = useRef<OriginDirection>(1);
  const previousRawProgressRef = useRef(0);

  const chapterBounds = useMemo(() => buildChapterBounds(beats), [beats]);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: stageRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const smoothedScrollYProgress = useSpring(scrollYProgress, {
    damping: 34,
    stiffness: 200,
    mass: 0.32,
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
    () => computeOriginTimeline(rawProgress, smoothedProgress, directionRef.current, chapterBounds),
    [chapterBounds, rawProgress, smoothedProgress],
  );

  const jumpToChapter = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth"): void => {
      const container = scrollContainerRef.current;
      const stage = stageRef.current;
      if (!container || !stage) return;
      const nextIndex = clampIndex(index, chapterBounds.length - 1);
      const top = getChapterScrollTop(nextIndex, chapterBounds, stage, container);
      container.scrollTo({ top, behavior });
    },
    [chapterBounds, scrollContainerRef, stageRef],
  );

  const jumpToNextChapter = useCallback(
    (behavior: ScrollBehavior = "smooth"): void => {
      const nextIndex = clampIndex(timeline.activeIndex + 1, chapterBounds.length - 1);
      jumpToChapter(nextIndex, behavior);
    },
    [chapterBounds.length, jumpToChapter, timeline.activeIndex],
  );

  const jumpToPrevChapter = useCallback(
    (behavior: ScrollBehavior = "smooth"): void => {
      const nextIndex = clampIndex(timeline.activeIndex - 1, chapterBounds.length - 1);
      jumpToChapter(nextIndex, behavior);
    },
    [chapterBounds.length, jumpToChapter, timeline.activeIndex],
  );

  return {
    rawProgress,
    smoothedProgress,
    timeline,
    chapterBounds,
    jumpToChapter,
    jumpToNextChapter,
    jumpToPrevChapter,
  };
};
