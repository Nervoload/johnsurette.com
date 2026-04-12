const TIMELINE_SCALE = 1.3;
const TIMELINE_VIEWPORT_LENGTHS = {
  intro: 0.74 * TIMELINE_SCALE,
  stageOne: 1.02 * TIMELINE_SCALE,
  stageTwo: 1.18 * TIMELINE_SCALE,
  stageThree: 1.04 * TIMELINE_SCALE,
  stageFour: 1.16 * TIMELINE_SCALE,
  leaf: 1.06 * TIMELINE_SCALE,
} as const;

const timelineEntries = Object.entries(TIMELINE_VIEWPORT_LENGTHS);
const RUNWAY_VIEWPORTS = timelineEntries.reduce((sum, [, length]) => sum + length, 0);
const SECTION_VIEWPORTS = RUNWAY_VIEWPORTS + 1;
console.log(SECTION_VIEWPORTS);
