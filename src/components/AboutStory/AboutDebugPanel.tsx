import React from "react";
import type { AboutStoryQualityMode, AboutTimelineState } from "./types";

interface AboutDebugPanelProps {
  timeline: AboutTimelineState;
  loadedSceneIds: string[];
  branchPath: string[];
  qualityMode: AboutStoryQualityMode;
}

const AboutDebugPanel: React.FC<AboutDebugPanelProps> = ({ timeline, loadedSceneIds, branchPath, qualityMode }) => {
  const activeNode = timeline.nodes[timeline.activeIndex];

  return (
    <aside className="theme-about-story-debug pointer-events-none absolute bottom-4 left-4 z-30 hidden rounded-2xl border px-4 py-3 text-[11px] leading-5 xl:block">
      <p className="font-semibold uppercase tracking-[0.18em]">About Debug</p>
      <p>Active node: {activeNode?.node.id ?? "n/a"}</p>
      <p>Timeline index: {timeline.activeIndex}</p>
      <p>Global progress: {timeline.smoothedProgress.toFixed(3)}</p>
      <p>Node progress: {activeNode?.nodeProgress.toFixed(3) ?? "0.000"}</p>
      <p>Direction: {timeline.transition?.direction ?? 1}</p>
      <p>Quality: {qualityMode}</p>
      <p>Loaded: {loadedSceneIds.join(", ")}</p>
      <p>Branch path: {branchPath.length > 0 ? branchPath.join(" > ") : "mainline"}</p>
    </aside>
  );
};

export default AboutDebugPanel;
