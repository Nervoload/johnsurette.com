import { RefObject, useCallback, useMemo, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { OriginBeatDefinition, OriginTimelineState } from "../types";
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
  progress: number;
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
  const [progress, setProgress] = useState(0);

  const chapterBounds = useMemo(() => buildChapterBounds(beats), [beats]);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: stageRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  const timeline = useMemo(() => computeOriginTimeline(progress, chapterBounds), [chapterBounds, progress]);

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
    progress,
    timeline,
    chapterBounds,
    jumpToChapter,
    jumpToNextChapter,
    jumpToPrevChapter,
  };
};
