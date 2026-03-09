import { timelineEntries } from "../../content";
import type { TimelineAction, TimelineDetail, TimelineEntry } from "../../content";

export type { TimelineAction, TimelineDetail };
export interface TimelineScene extends TimelineEntry {}

export const timelineScenes: TimelineScene[] = timelineEntries;
