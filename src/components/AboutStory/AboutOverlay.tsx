import React from "react";
import type { AboutStoryNode } from "../../content/aboutStory";
import type { AboutTimelineState } from "./types";

interface AboutOverlayProps {
  activeNode: AboutStoryNode;
  primaryNodes: AboutStoryNode[];
  timeline: AboutTimelineState;
  timelineDockProgress: number;
  branchPath: string[];
  onJumpToNode: (nodeId: string) => void;
  onBranchSelect: (nodeId: string) => void;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const resolveCheckpointIntensity = (timeline: AboutTimelineState, index: number) => {
  if (!timeline.transition) {
    if (index < timeline.activeIndex) return 1;
    if (index === timeline.activeIndex) return 1;
    return 0;
  }

  if (index < timeline.transition.boundaryIndex) return 1;
  if (index === timeline.transition.boundaryIndex) return 1 - timeline.transition.sceneMix;
  if (index === timeline.transition.boundaryIndex + 1) return timeline.transition.sceneMix;
  return 0;
};

const AboutOverlay: React.FC<AboutOverlayProps> = ({
  activeNode,
  primaryNodes,
  timeline,
  timelineDockProgress,
  branchPath,
  onJumpToNode,
  onBranchSelect,
}) => {
  const prominentOpacity = 1 - clamp01(timelineDockProgress * 1.05);
  const dockedOpacity = clamp01((timelineDockProgress - 0.08) / 0.92);
  const hasBranches = Boolean(activeNode.branchOptions && activeNode.branchOptions.length > 0);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute left-6 top-24 max-w-[min(34rem,calc(100vw-3rem))]">
        <div className="theme-about-story-panel rounded-[1.6rem] border px-6 py-6 sm:px-8 sm:py-7">
          <p className="theme-text-subtle text-[11px] uppercase tracking-[0.24em]">
            {activeNode.eyebrow}
            {activeNode.yearLabel ? ` · ${activeNode.yearLabel}` : ""}
          </p>
          <h1 className="theme-text-primary mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{activeNode.title}</h1>
          <p className="theme-text-muted mt-4 max-w-2xl text-sm leading-relaxed sm:text-[15px]">{activeNode.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {activeNode.highlights.map((item) => (
              <span key={item} className="theme-about-story-chip rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2"
        style={{
          opacity: prominentOpacity,
          transform: `translate3d(${timelineDockProgress * 34}vw, ${-timelineDockProgress * 20}vh, 0) scale(${1 - timelineDockProgress * 0.14})`,
        }}
      >
        <div className="theme-about-story-timeline theme-about-story-timeline-prominent pointer-events-auto rounded-[999px] border px-4 py-3">
          <div className="flex items-center justify-between gap-3 overflow-x-auto">
            {primaryNodes.map((node, index) => {
              const intensity = resolveCheckpointIntensity(timeline, index);
              return (
                <button
                  key={`prominent-${node.id}`}
                  type="button"
                  onClick={() => onJumpToNode(node.id)}
                  className="theme-about-story-timeline-button flex min-w-fit items-center gap-3 rounded-full px-3 py-2 text-left transition"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: intensity > 0.5 ? "var(--theme-accent)" : "var(--theme-text-subtle)",
                      opacity: 0.28 + intensity * 0.72,
                      transform: `scale(${0.92 + intensity * 0.44})`,
                    }}
                  />
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em]">{node.timelineLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside
        className="absolute right-6 top-1/2 -translate-y-1/2"
        style={{
          opacity: dockedOpacity,
          transform: `translate3d(${(1 - dockedOpacity) * 48}px, -50%, 0)`,
        }}
      >
        <div className="theme-about-story-timeline pointer-events-auto rounded-[1.5rem] border px-3 py-4">
          <ol className="space-y-3">
            {primaryNodes.map((node, index) => {
              const intensity = resolveCheckpointIntensity(timeline, index);
              return (
                <li key={`docked-${node.id}`}>
                  <button
                    type="button"
                    onClick={() => onJumpToNode(node.id)}
                    className="theme-about-story-rail-button flex items-center gap-3 rounded-full px-3 py-2 text-left transition"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: intensity > 0.5 ? "var(--theme-accent)" : "var(--theme-text-subtle)",
                        opacity: 0.25 + intensity * 0.75,
                        transform: `scale(${0.9 + intensity * 0.42})`,
                      }}
                    />
                    <span className="text-[11px] uppercase tracking-[0.18em]">{node.timelineLabel}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      <div className="absolute bottom-8 right-6 max-w-[min(24rem,calc(100vw-3rem))]">
        {hasBranches ? (
          <div className="theme-about-story-panel pointer-events-auto rounded-[1.35rem] border px-4 py-4">
            <p className="theme-text-subtle text-[10px] uppercase tracking-[0.18em]">{activeNode.branchLabel ?? "Branches"}</p>
            <div className="mt-3 grid gap-2">
              {activeNode.branchOptions?.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onBranchSelect(option.targetNodeId)}
                  className="theme-about-story-branch-button rounded-2xl border px-4 py-3 text-left"
                >
                  <p className="theme-text-primary text-sm font-medium">{option.label}</p>
                  <p className="theme-text-muted mt-1 text-xs leading-relaxed">{option.previewSummary}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="theme-about-story-branch-host rounded-[1.2rem] border px-4 py-3 text-right">
            <p className="theme-text-subtle text-[10px] uppercase tracking-[0.18em]">Route</p>
            <p className="theme-text-muted mt-2 text-xs">
              {branchPath.length > 0 ? branchPath.join(" / ") : "Mainline story active"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutOverlay;
