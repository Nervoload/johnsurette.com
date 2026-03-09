import { createProjectMonogramIcon, projects } from "../../content/projects";
import type {
  CardPalette,
  ProjectCardFrontSpec,
  ProjectCardFrontFamily,
  ProjectCardPopoutPreset,
  ProjectCardStatus,
  ProjectEntry,
} from "../../content";

export type ProjectLink = ProjectEntry["links"][number];
export type ProjectItem = ProjectEntry;
export type {
  CardPalette,
  ProjectCardFrontFamily,
  ProjectCardPopoutPreset,
  ProjectCardStatus,
  ProjectCardFrontSpec,
};

export interface ResolvedProjectCardFrontSpec {
  dateLabel: string;
  status: ProjectCardStatus;
  iconSvg: string;
  frontFamily: ProjectCardFrontFamily;
  popoutPreset: ProjectCardPopoutPreset;
  popoutIntensity: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const defaultFrontSpec: Pick<ResolvedProjectCardFrontSpec, "dateLabel" | "status" | "popoutIntensity"> = {
  dateLabel: "TBD",
  status: "Active",
  popoutIntensity: 1,
};

export const resolveProjectCardFront = (item: ProjectItem): ResolvedProjectCardFrontSpec => {
  const front = item.front;
  return {
    dateLabel: front.dateLabel?.trim() || defaultFrontSpec.dateLabel,
    status: front.status ?? defaultFrontSpec.status,
    iconSvg: front.iconSvg?.trim() || createProjectMonogramIcon(item.title, item.accent, item.palette),
    frontFamily: front.frontFamily,
    popoutPreset: front.popoutPreset,
    popoutIntensity: clamp(front.popoutIntensity ?? defaultFrontSpec.popoutIntensity, 0.45, 1.9),
  };
};

export const projectItems: ProjectItem[] = projects;
