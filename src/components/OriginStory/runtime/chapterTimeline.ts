import {
  OriginBeatDefinition,
  OriginChapterRuntime,
  OriginDirection,
  OriginScrollPhase,
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

const computePhase = (
  rawProgress: number,
  beat: OriginBeatDefinition,
): { phase: OriginScrollPhase; phaseProgress: number } => {
  const phases = normalizedPhaseTriplet(beat);
  const introEnd = phases.entry;
  const floatEnd = phases.entry + phases.hold;
  const handoffEnd = floatEnd + phases.exit * 0.66;

  if (rawProgress <= introEnd) {
    return {
      phase: "intro",
      phaseProgress: clamp01(rawProgress / Math.max(0.001, introEnd)),
    };
  }

  if (rawProgress <= floatEnd) {
    return {
      phase: "float",
      phaseProgress: clamp01((rawProgress - introEnd) / Math.max(0.001, phases.hold)),
    };
  }

  if (rawProgress <= handoffEnd) {
    return {
      phase: "handoff",
      phaseProgress: clamp01((rawProgress - floatEnd) / Math.max(0.001, phases.exit * 0.66)),
    };
  }

  return {
    phase: "outro",
    phaseProgress: clamp01((rawProgress - handoffEnd) / Math.max(0.001, phases.exit * 0.34)),
  };
};

const getActiveIndex = (progress: number, bounds: OriginChapterBound[]): number => {
  if (!bounds.length) return 0;

  for (let index = 0; index < bounds.length; index += 1) {
    const bound = bounds[index];
    const isLast = index === bounds.length - 1;

    if (progress >= bound.start && (progress < bound.end || isLast)) {
      return index;
    }
  }

  return bounds.length - 1;
};

const computeTransitionState = (
  progress: number,
  bounds: OriginChapterBound[],
  direction: OriginDirection,
): OriginTransitionState | null => {
  let strongest: OriginTransitionState | null = null;

  for (let index = 0; index < bounds.length - 1; index += 1) {
    const from = bounds[index];
    const to = bounds[index + 1];
    const boundary = from.end;
    const range = Math.max(0.014, Math.min(from.length, to.length) * 0.28);
    const distance = Math.abs(progress - boundary);

    if (distance > range) {
      continue;
    }

    const strength = smoothStep(1 - distance / range);
    const transitionProgress = clamp01((progress - (boundary - range)) / (range * 2));
    const sceneMix = smoothStep(transitionProgress);
    const cameraMix = clamp01(smoothStep((transitionProgress - 0.08) / 0.84));

    if (!strongest || strength > strongest.strength) {
      strongest = {
        fromId: from.beat.id,
        toId: to.beat.id,
        boundaryIndex: index,
        strength,
        progress: transitionProgress,
        direction,
        adjacentIndex: null,
        sceneMix,
        cameraMix,
      };
    }
  }

  return strongest;
};

export const computeOriginTimeline = (
  rawProgress: number,
  smoothedProgress: number,
  direction: OriginDirection,
  bounds: OriginChapterBound[],
): OriginTimelineState => {
  const clampedRawProgress = clamp01(rawProgress);
  const clampedSmoothedProgress = clamp01(smoothedProgress);
  const activeIndex = getActiveIndex(clampedSmoothedProgress, bounds);
  const transition = computeTransitionState(clampedSmoothedProgress, bounds, direction);

  let adjacentIndex: number | null = null;
  let renderedChapterIndices = [activeIndex];
  const transitionWeights = new Map<number, number>();

  if (transition) {
    const fromIndex = transition.boundaryIndex;
    const toIndex = transition.boundaryIndex + 1;
    adjacentIndex = activeIndex === fromIndex ? toIndex : fromIndex;
    transition.adjacentIndex = adjacentIndex;

    renderedChapterIndices = Array.from(new Set([activeIndex, adjacentIndex])).sort((left, right) => left - right);
    transitionWeights.set(fromIndex, 1 - transition.sceneMix);
    transitionWeights.set(toIndex, transition.sceneMix);
  }

  const chapters: OriginChapterRuntime[] = bounds.map((bound) => {
    const raw = clamp01((clampedSmoothedProgress - bound.start) / Math.max(0.0001, bound.length));
    const { phase, phaseProgress } = computePhase(raw, bound.beat);
    const weight = transition
      ? transitionWeights.get(bound.index) ?? 0
      : bound.index === activeIndex
        ? 1
        : 0;

    return {
      beat: bound.beat,
      index: bound.index,
      start: bound.start,
      end: bound.end,
      length: bound.length,
      rawProgress: raw,
      localProgress: computeLocalProgress(raw, bound.beat),
      holdProgress: computeHoldProgress(raw, bound.beat),
      phase,
      phaseProgress,
      weight,
    };
  });

  return {
    rawProgress: clampedRawProgress,
    smoothedProgress: clampedSmoothedProgress,
    chapters,
    activeIndex,
    adjacentIndex,
    renderedChapterIndices,
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
