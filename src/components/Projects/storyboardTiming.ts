const STORYBOARD_BASE_HEIGHT_VH = 720;
const STORYBOARD_BASE_HEIGHT_COMPACT_VH = 900;
const STORYBOARD_EXTRA_CARD_VH = 350;
const STORYBOARD_EXTRA_CARD_COMPACT_VH = 700;
const DEAL_TIMING_TRIM = 0.9;

export interface ProjectLatePhaseTiming {
  dealStart: number;
  dealEnd: number;
  flipStart: number;
  flipEnd: number;
  browseStart: number;
  dealDelaySpan: number;
  flipDelaySpan: number;
}

export interface ProjectRawLatePhaseBoundaries {
  dealStart: number;
  dealEnd: number;
  flipEnd: number;
  stackPreviewEnd: number;
}

export const getProjectStoryboardHeight = (count: number, compactViewport: boolean) => {
  const extraCards = Math.max(0, count - 4);
  return compactViewport
    ? STORYBOARD_BASE_HEIGHT_COMPACT_VH + extraCards * STORYBOARD_EXTRA_CARD_COMPACT_VH
    : STORYBOARD_BASE_HEIGHT_VH + extraCards * STORYBOARD_EXTRA_CARD_VH;
};

export const getProjectLatePhaseTiming = (
  count: number,
  mobileViewport: boolean,
): ProjectLatePhaseTiming => {
  const extraCards = Math.max(0, count - 4);
  const dealStart = 0.64;
  const dealDuration =
    (
      mobileViewport
        ? Math.min(0.24, 0.2 + extraCards * 0.012)
        : Math.min(0.24, 0.2 + extraCards * 0.014)
    ) * DEAL_TIMING_TRIM;
  const flipStart = mobileViewport
    ? Math.min(0.86, 0.82 + extraCards * 0.008)
    : Math.min(0.85, 0.82 + extraCards * 0.006);
  const flipDuration = mobileViewport
    ? Math.min(0.17, 0.11 + extraCards * 0.018)
    : Math.min(0.16, 0.11 + extraCards * 0.016);
  const flipEnd = Math.min(0.96, flipStart + flipDuration);
  const stackPreviewGap = mobileViewport
    ? Math.min(0.11, 0.05 + extraCards * 0.012)
    : Math.min(0.085, 0.04 + extraCards * 0.01);

  return {
    dealStart,
    dealEnd: dealStart + dealDuration,
    flipStart,
    flipEnd,
    browseStart: Math.min(0.965, flipEnd + stackPreviewGap),
    dealDelaySpan: Math.min(0.62, 0.34 + extraCards * 0.065) * DEAL_TIMING_TRIM,
    flipDelaySpan: Math.min(0.72, 0.22 + extraCards * 0.075)*0.8,
  };
};

export const getProjectRawLatePhaseBoundaries = (
  count: number,
  compactViewport: boolean,
): ProjectRawLatePhaseBoundaries => {
  const extraCards = Math.max(0, count - 4);
  const dealStart = 0.34;
  const dealWindow =
    (
      compactViewport
        ? Math.min(0.2, 0.16 + extraCards * 0.012)
        : Math.min(0.19, 0.15 + extraCards * 0.01)
    ) * DEAL_TIMING_TRIM;
  const flipWindow = compactViewport
    ? Math.min(0.18, 0.13 + extraCards * 0.014)
    : Math.min(0.17, 0.12 + extraCards * 0.012);
  const stackPreviewWindow = compactViewport
    ? Math.min(0.12, 0.06 + extraCards * 0.01)
    : Math.min(0.095, 0.05 + extraCards * 0.008);

  const dealEnd = Math.min(0.72, dealStart + dealWindow);
  const flipEnd = Math.min(0.76, dealEnd + flipWindow);
  const stackPreviewEnd = Math.min(0.94, flipEnd + stackPreviewWindow);

  return { dealStart, dealEnd, flipEnd, stackPreviewEnd };
};
