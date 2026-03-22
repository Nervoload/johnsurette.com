export const getProjectStoryboardPhaseLabel = (timelineProgress: number): string => {
  if (timelineProgress < 0.18) return "shuffle-build";
  if (timelineProgress < 0.36) return "spread-to-orbit";
  if (timelineProgress < 0.58) return "orbit-exit";
  if (timelineProgress < 0.78) return "deal-into-column";
  if (timelineProgress < 0.96) return "flip-reveal";
  return "browse-column";
};
