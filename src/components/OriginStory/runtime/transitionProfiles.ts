import { OriginBeatId } from "../types";

export type OriginTransitionStyle =
  | "cinematic-sweep"
  | "particle-morph"
  | "focus-shift"
  | "hard-wipe"
  | "dust-dissolve";

export interface OriginTransitionProfile {
  fromId: OriginBeatId;
  toId: OriginBeatId;
  style: OriginTransitionStyle;
  accent: string;
  secondary: string;
  flare: boolean;
}

const profileTable: OriginTransitionProfile[] = [
  {
    fromId: "spark",
    toId: "biology",
    style: "cinematic-sweep",
    accent: "#7dd3fc",
    secondary: "#34d399",
    flare: true,
  },
  {
    fromId: "biology",
    toId: "mind",
    style: "particle-morph",
    accent: "#34d399",
    secondary: "#a78bfa",
    flare: false,
  },
  {
    fromId: "mind",
    toId: "build",
    style: "focus-shift",
    accent: "#a78bfa",
    secondary: "#fb7185",
    flare: true,
  },
  {
    fromId: "build",
    toId: "augmentation",
    style: "hard-wipe",
    accent: "#fb7185",
    secondary: "#22d3ee",
    flare: true,
  },
  {
    fromId: "augmentation",
    toId: "trajectory",
    style: "dust-dissolve",
    accent: "#22d3ee",
    secondary: "#93c5fd",
    flare: false,
  },
];

const fallbackProfile: OriginTransitionProfile = {
  fromId: "spark",
  toId: "biology",
  style: "cinematic-sweep",
  accent: "#7dd3fc",
  secondary: "#c084fc",
  flare: false,
};

export const getTransitionProfile = (
  fromId: OriginBeatId,
  toId: OriginBeatId,
): OriginTransitionProfile => {
  return profileTable.find((profile) => profile.fromId === fromId && profile.toId === toId) ?? fallbackProfile;
};
