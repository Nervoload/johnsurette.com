import React from "react";
import type { LivingStage } from "./sceneTypes";
import { LivingStore, useLivingStore } from "./livingStore";

interface LivingSceneControlsProps {
  stages: readonly LivingStage[];
  store: LivingStore;
  sceneTitle: string;
  onSelectStage: (index: number) => void;
  onTogglePause: () => void;
  className?: string;
}

const PauseGlyph: React.FC<{ paused: boolean }> = ({ paused }) =>
  paused ? (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 1.8v8.4L10 6 3 1.8Z" fill="currentColor" />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2.4" y="1.8" width="2.4" height="8.4" rx="0.6" fill="currentColor" />
      <rect x="7.2" y="1.8" width="2.4" height="8.4" rx="0.6" fill="currentColor" />
    </svg>
  );

/** Pause / stage dots / caption. Real buttons; caption is not a live region (stages auto-advance). */
const LivingSceneControls: React.FC<LivingSceneControlsProps> = ({
  stages,
  store,
  sceneTitle,
  onSelectStage,
  onTogglePause,
  className = "",
}) => {
  const stageIndex = useLivingStore(store, (state) => state.stageIndex);
  const paused = useLivingStore(store, (state) => state.paused);
  const ready = useLivingStore(store, (state) => state.ready);
  const failed = useLivingStore(store, (state) => state.failed);
  const stage = stages[stageIndex] ?? stages[0];

  if (failed) return null;

  return (
    <div
      className={`living-controls pointer-events-none flex flex-wrap items-center gap-x-3 gap-y-1 transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <div className="pointer-events-auto flex items-center gap-1" role="group" aria-label={`${sceneTitle} controls`}>
        <button
          type="button"
          className="living-control-button"
          onClick={onTogglePause}
          aria-label={paused ? `Play ${sceneTitle}` : `Pause ${sceneTitle}`}
        >
          <PauseGlyph paused={paused} />
        </button>
        {stages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="living-stage-dot"
            data-active={index === stageIndex ? "true" : "false"}
            aria-label={`Stage ${index + 1} of ${stages.length}: ${item.label}`}
            aria-current={index === stageIndex ? "step" : undefined}
            onClick={() => onSelectStage(index)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="living-caption m-0 min-w-0" aria-hidden="true">
        <span className="living-caption-label">{stage.label}</span>
        <span className="living-caption-text">{stage.caption}</span>
      </p>
    </div>
  );
};

export default LivingSceneControls;
