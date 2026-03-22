import type { AboutStoryNode } from "../../../content/aboutStory";
import type {
  AboutStoryDirection,
  AboutTimelineNodeRuntime,
  AboutTimelineState,
  AboutTimelineTransition,
} from "../types";

export interface AboutTimelineBound {
  node: AboutStoryNode;
  index: number;
  start: number;
  end: number;
  length: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothStep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export const buildAboutTimelineBounds = (nodes: AboutStoryNode[]): AboutTimelineBound[] => {
  const safeWeights = nodes.map((node) => Math.max(0.2, node.scrollWeight));
  const totalWeight = safeWeights.reduce((sum, value) => sum + value, 0) || nodes.length || 1;

  let cursor = 0;
  return nodes.map((node, index) => {
    const length = safeWeights[index] / totalWeight;
    const bound: AboutTimelineBound = {
      node,
      index,
      start: cursor,
      end: cursor + length,
      length,
    };
    cursor += length;
    return bound;
  });
};

const getActiveIndex = (progress: number, bounds: AboutTimelineBound[]) => {
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

const computeNodeProgress = (rawProgress: number, node: AboutStoryNode) => {
  const total = node.entryPct + node.holdPct + node.exitPct;
  const entry = node.entryPct / total;
  const hold = node.holdPct / total;
  const exitStart = entry + hold;

  if (rawProgress <= entry) {
    return smoothStep(rawProgress / Math.max(0.001, entry)) * 0.34;
  }

  if (rawProgress <= exitStart) {
    return 0.34 + smoothStep((rawProgress - entry) / Math.max(0.001, hold)) * 0.48;
  }

  return 0.82 + smoothStep((rawProgress - exitStart) / Math.max(0.001, 1 - exitStart)) * 0.18;
};

const computeTransition = (
  progress: number,
  bounds: AboutTimelineBound[],
  direction: AboutStoryDirection,
): AboutTimelineTransition | null => {
  let strongest: AboutTimelineTransition | null = null;

  for (let index = 0; index < bounds.length - 1; index += 1) {
    const from = bounds[index];
    const to = bounds[index + 1];
    const boundary = from.end;
    const range = Math.max(0.02, Math.min(from.length, to.length) * 0.3);
    const distance = Math.abs(progress - boundary);

    if (distance > range) continue;

    const strength = smoothStep(1 - distance / range);
    const transitionProgress = clamp01((progress - (boundary - range)) / (range * 2));
    const sceneMix = smoothStep(transitionProgress);
    const cameraMix = clamp01(smoothStep((transitionProgress - 0.1) / 0.8));

    if (!strongest || strength > strongest.strength) {
      strongest = {
        fromId: from.node.id,
        toId: to.node.id,
        boundaryIndex: index,
        strength,
        progress: transitionProgress,
        sceneMix,
        cameraMix,
        direction,
      };
    }
  }

  return strongest;
};

export const computeAboutTimeline = (
  rawProgress: number,
  smoothedProgress: number,
  direction: AboutStoryDirection,
  bounds: AboutTimelineBound[],
): AboutTimelineState => {
  const clampedRaw = clamp01(rawProgress);
  const clampedSmoothed = clamp01(smoothedProgress);
  const activeIndex = getActiveIndex(clampedSmoothed, bounds);
  const transition = computeTransition(clampedSmoothed, bounds, direction);
  const mixByIndex = new Map<number, number>();
  let adjacentIndex: number | null = null;
  let renderedNodeIds = bounds[activeIndex] ? [bounds[activeIndex].node.id] : [];

  if (transition) {
    const fromIndex = transition.boundaryIndex;
    const toIndex = transition.boundaryIndex + 1;
    adjacentIndex = activeIndex === fromIndex ? toIndex : fromIndex;
    renderedNodeIds = Array.from(new Set([bounds[fromIndex].node.id, bounds[toIndex].node.id]));
    mixByIndex.set(fromIndex, 1 - transition.sceneMix);
    mixByIndex.set(toIndex, transition.sceneMix);
  } else if (bounds[activeIndex]) {
    mixByIndex.set(activeIndex, 1);
  }

  const nodes: AboutTimelineNodeRuntime[] = bounds.map((bound) => {
    const raw = clamp01((clampedSmoothed - bound.start) / Math.max(0.0001, bound.length));
    return {
      node: bound.node,
      index: bound.index,
      start: bound.start,
      end: bound.end,
      length: bound.length,
      rawProgress: raw,
      nodeProgress: computeNodeProgress(raw, bound.node),
      mix: mixByIndex.get(bound.index) ?? 0,
    };
  });

  return {
    rawProgress: clampedRaw,
    smoothedProgress: clampedSmoothed,
    activeIndex,
    adjacentIndex,
    transition,
    nodes,
    renderedNodeIds,
  };
};

export const getAboutNodeTargetProgress = (bound: AboutTimelineBound) => {
  const total = bound.node.entryPct + bound.node.holdPct + bound.node.exitPct;
  const entry = bound.node.entryPct / total;
  const hold = bound.node.holdPct / total;
  return clamp01(bound.start + bound.length * (entry + hold * 0.45));
};

export const getAboutNodeScrollTop = (
  timelineIndex: number,
  bounds: AboutTimelineBound[],
  sectionElement: HTMLElement,
  container: HTMLElement,
) => {
  const index = Math.max(0, Math.min(timelineIndex, bounds.length - 1));
  const targetProgress = getAboutNodeTargetProgress(bounds[index]);
  const scrollable = Math.max(1, sectionElement.offsetHeight - container.clientHeight);
  return sectionElement.offsetTop + targetProgress * scrollable;
};
