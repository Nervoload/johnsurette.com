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
    fromId: "question",
    toId: "atoms",
    style: "cinematic-sweep",
    accent: "#67e8f9",
    secondary: "#c4b5fd",
    flare: true,
  },
  {
    fromId: "atoms",
    toId: "network",
    style: "particle-morph",
    accent: "#a5f3fc",
    secondary: "#93c5fd",
    flare: false,
  },
  {
    fromId: "network",
    toId: "eye",
    style: "focus-shift",
    accent: "#38bdf8",
    secondary: "#67e8f9",
    flare: true,
  },
  {
    fromId: "eye",
    toId: "planet",
    style: "hard-wipe",
    accent: "#22d3ee",
    secondary: "#a78bfa",
    flare: true,
  },
  {
    fromId: "planet",
    toId: "galaxy",
    style: "dust-dissolve",
    accent: "#99f6e4",
    secondary: "#bfdbfe",
    flare: false,
  },
];

const fallbackProfile: OriginTransitionProfile = {
  fromId: "question",
  toId: "atoms",
  style: "cinematic-sweep",
  accent: "#67e8f9",
  secondary: "#a78bfa",
  flare: false,
};

export const getTransitionProfile = (
  fromId: OriginBeatId,
  toId: OriginBeatId,
): OriginTransitionProfile => {
  return profileTable.find((profile) => profile.fromId === fromId && profile.toId === toId) ?? fallbackProfile;
};
