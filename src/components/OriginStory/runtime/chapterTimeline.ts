import {
  OriginBeatDefinition,
  OriginChapterRuntime,
  OriginTimelineState,
  OriginTransitionState,
} from "../types";
import { clamp01, smoothStep } from "../scenes/sceneMath";

export interface OriginChapterBound {
  beat: OriginBeatDefinition;
  index: number;
  start: number;
  end: number;
  length: number;
  center: number;
}

const normalizedPhaseTriplet = (
  beat: OriginBeatDefinition,
): { entry: number; hold: number; exit: number } => {
  const entry = Math.max(0.01, beat.entryTransitionPct);
  const hold = Math.max(0.01, beat.holdPct);
  const exit = Math.max(0.01, beat.exitTransitionPct);
  const total = entry + hold + exit;

  return {
    entry: entry / total,
    hold: hold / total,
    exit: exit / total,
  };
};

export const buildChapterBounds = (beats: OriginBeatDefinition[]): OriginChapterBound[] => {
  const safeWeights = beats.map((beat) => Math.max(0.2, beat.scrollWeight));
  const totalWeight = safeWeights.reduce((sum, value) => sum + value, 0) || beats.length || 1;

  let cursor = 0;
  return beats.map((beat, index) => {
    const length = safeWeights[index] / totalWeight;
    const bound: OriginChapterBound = {
      beat,
      index,
      start: cursor,
      end: cursor + length,
      length,
      center: cursor + length * 0.5,
    };
    cursor += length;
    return bound;
  });
};

const computeLocalProgress = (rawProgress: number, beat: OriginBeatDefinition): number => {
  const phases = normalizedPhaseTriplet(beat);
  const entryEnd = phases.entry;
  const holdEnd = phases.entry + phases.hold;

  if (rawProgress <= entryEnd) {
    const t = smoothStep(rawProgress / Math.max(0.001, phases.entry));
    return t * 0.34;
  }

  if (rawProgress <= holdEnd) {
    const t = smoothStep((rawProgress - phases.entry) / Math.max(0.001, phases.hold));
    return 0.34 + t * 0.52;
  }

  const t = smoothStep((rawProgress - holdEnd) / Math.max(0.001, phases.exit));
  return 0.86 + t * 0.14;
};

const computeHoldProgress = (rawProgress: number, beat: OriginBeatDefinition): number => {
  const phases = normalizedPhaseTriplet(beat);
  return clamp01((rawProgress - phases.entry) / Math.max(0.001, phases.hold));
};

const computeWeight = (globalProgress: number, bound: OriginChapterBound): number => {
  const influence = bound.length * 0.82;
  const raw = clamp01(1 - Math.abs(globalProgress - bound.center) / Math.max(0.0001, influence));
  return smoothStep(raw);
};

const computeTransitionState = (
  progress: number,
  bounds: OriginChapterBound[],
): OriginTransitionState | null => {
  let strongest: OriginTransitionState | null = null;

  for (let index = 0; index < bounds.length - 1; index += 1) {
    const from = bounds[index];
    const to = bounds[index + 1];
    const boundary = from.end;
    const range = Math.max(0.01, Math.min(from.length, to.length) * 0.36);
    const distance = Math.abs(progress - boundary);
    if (distance > range) continue;

    const strength = smoothStep(1 - distance / range);
    const transitionProgress = clamp01((progress - (boundary - range)) / (range * 2));

    if (!strongest || strength > strongest.strength) {
      strongest = {
        fromId: from.beat.id,
        toId: to.beat.id,
        boundaryIndex: index,
        strength,
        progress: transitionProgress,
      };
    }
  }

  return strongest;
};

export const computeOriginTimeline = (
  progress: number,
  bounds: OriginChapterBound[],
): OriginTimelineState => {
  const clampedProgress = clamp01(progress);

  const chapters: OriginChapterRuntime[] = bounds.map((bound) => {
    const raw = clamp01((clampedProgress - bound.start) / Math.max(0.0001, bound.length));

    return {
      beat: bound.beat,
      index: bound.index,
      start: bound.start,
      end: bound.end,
      length: bound.length,
      rawProgress: raw,
      localProgress: computeLocalProgress(raw, bound.beat),
      holdProgress: computeHoldProgress(raw, bound.beat),
      weight: computeWeight(clampedProgress, bound),
    };
  });

  const active = chapters.reduce((best, chapter) => (chapter.weight > best.weight ? chapter : best), chapters[0]);
  const transition = computeTransitionState(clampedProgress, bounds);

  return {
    progress: clampedProgress,
    chapters,
    activeIndex: active.index,
    transition,
  };
};

export const getChapterTargetProgress = (bound: OriginChapterBound): number => {
  const phases = normalizedPhaseTriplet(bound.beat);
  return clamp01(bound.start + bound.length * (phases.entry + phases.hold * 0.46));
};

export const getChapterScrollTop = (
  chapterIndex: number,
  bounds: OriginChapterBound[],
  sectionElement: HTMLElement,
  container: HTMLElement,
): number => {
  const index = Math.max(0, Math.min(chapterIndex, bounds.length - 1));
  const chapterTarget = getChapterTargetProgress(bounds[index]);
  const sectionTop = sectionElement.offsetTop;
  const scrollable = Math.max(1, sectionElement.offsetHeight - container.clientHeight);
  return sectionTop + chapterTarget * scrollable;
};
