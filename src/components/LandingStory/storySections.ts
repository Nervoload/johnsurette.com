import { landingStory, landingStoryTransitions } from "../../content";
import type { StorySectionId, StoryTransitionKind } from "../../content";

export type { StorySectionId, StoryTransitionKind };

export interface StorySectionData {
  id: StorySectionId;
  eyebrow: string;
  title: string;
  summary: string;
  focusAreas: string[];
  accent: string;
  glow: string;
  deep: string;
}

export const storySections: StorySectionData[] = landingStory;
export const storyTransitions: StoryTransitionKind[] = landingStoryTransitions;
