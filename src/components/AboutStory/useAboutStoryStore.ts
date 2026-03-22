import { create } from "zustand";
import { aboutStoryInitialNodeId } from "../../content/aboutStory";
import type { AboutStoryDirection, AboutStoryQualityMode } from "./types";

interface ScrollMetricInput {
  activeNodeId: string;
  activeTimelineIndex: number;
  scrollProgress: number;
  nodeProgress: number;
  direction: AboutStoryDirection;
}

interface AboutStoryStoreState {
  activeNodeId: string;
  activeTimelineIndex: number;
  scrollProgress: number;
  nodeProgress: number;
  branchPath: string[];
  loadedSceneIds: string[];
  direction: AboutStoryDirection;
  qualityMode: AboutStoryQualityMode;
  debugEnabled: boolean;
  requestedNodeId: string | null;
  setScrollMetrics: (input: ScrollMetricInput) => void;
  setLoadedSceneIds: (ids: string[]) => void;
  setQualityMode: (mode: AboutStoryQualityMode) => void;
  goToNode: (id: string) => void;
  enterBranch: (id: string) => void;
  exitBranch: () => void;
  clearRequestedNode: () => void;
}

export const useAboutStoryStore = create<AboutStoryStoreState>((set) => ({
  activeNodeId: aboutStoryInitialNodeId,
  activeTimelineIndex: 0,
  scrollProgress: 0,
  nodeProgress: 0,
  branchPath: [],
  loadedSceneIds: [aboutStoryInitialNodeId],
  direction: 1,
  qualityMode: "full",
  debugEnabled: import.meta.env.DEV,
  requestedNodeId: null,
  setScrollMetrics: ({ activeNodeId, activeTimelineIndex, scrollProgress, nodeProgress, direction }) =>
    set({
      activeNodeId,
      activeTimelineIndex,
      scrollProgress,
      nodeProgress,
      direction,
    }),
  setLoadedSceneIds: (ids) => set({ loadedSceneIds: ids }),
  setQualityMode: (mode) => set({ qualityMode: mode }),
  goToNode: (id) => set({ requestedNodeId: id }),
  enterBranch: (id) =>
    set((state) => ({
      requestedNodeId: id,
      branchPath: [...state.branchPath, id],
    })),
  exitBranch: () =>
    set((state) => ({
      requestedNodeId: state.branchPath.length > 1 ? state.branchPath[state.branchPath.length - 2] : null,
      branchPath: state.branchPath.slice(0, -1),
    })),
  clearRequestedNode: () => set({ requestedNodeId: null }),
}));
