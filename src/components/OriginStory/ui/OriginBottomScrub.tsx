import React, { useCallback, useRef } from "react";
import { OriginBeatDefinition } from "../types";

interface OriginBottomScrubProps {
  beats: OriginBeatDefinition[];
  activeIndex: number;
  progress: number;
  chapterProgressTargets: number[];
  disabled?: boolean;
  onSelect: (index: number) => void;
}

const nearestIndex = (targets: number[], value: number): number => {
  return targets.reduce((bestIndex, target, index) => {
    const bestDistance = Math.abs(targets[bestIndex] - value);
    const nextDistance = Math.abs(target - value);
    return nextDistance < bestDistance ? index : bestIndex;
  }, 0);
};

const OriginBottomScrub: React.FC<OriginBottomScrubProps> = ({
  beats,
  activeIndex,
  progress,
  chapterProgressTargets,
  disabled = false,
  onSelect,
}) => {
  const railRef = useRef<HTMLDivElement>(null);

  const selectByPointer = useCallback(
    (clientX: number): void => {
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const ratio = (clientX - rect.left) / Math.max(1, rect.width);
      const clamped = Math.max(0, Math.min(1, ratio));
      const index = nearestIndex(chapterProgressTargets, clamped);
      onSelect(index);
    },
    [chapterProgressTargets, onSelect],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (disabled) {
      return;
    }

    selectByPointer(event.clientX);

    const move = (moveEvent: PointerEvent): void => {
      selectByPointer(moveEvent.clientX);
    };
    const up = (): void => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className={`pointer-events-auto absolute inset-x-6 bottom-5 z-40 md:inset-x-20 ${disabled ? "opacity-40" : ""}`}>
      <div className={`origin-scrub-shell ${disabled ? "is-disabled" : ""}`}>
        <div
          ref={railRef}
          className="origin-scrub-rail"
          role="slider"
          tabIndex={0}
          aria-valuemin={1}
          aria-valuemax={beats.length}
          aria-valuenow={activeIndex + 1}
          aria-valuetext={beats[activeIndex]?.chapterLabel}
          onPointerDown={handlePointerDown}
          aria-disabled={disabled}
          onKeyDown={(event) => {
            if (disabled) {
              return;
            }

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              event.preventDefault();
              onSelect(Math.min(beats.length - 1, activeIndex + 1));
            }

            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              event.preventDefault();
              onSelect(Math.max(0, activeIndex - 1));
            }
          }}
        >
          <span className="origin-scrub-progress" style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }} />
          {chapterProgressTargets.map((target, index) => (
            <button
              key={beats[index].id}
              type="button"
              className={`origin-scrub-detent ${index === activeIndex ? "is-active" : ""}`}
              style={{ left: `${target * 100}%` }}
              onClick={() => onSelect(index)}
              aria-label={`Jump to ${beats[index].chapterLabel}`}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OriginBottomScrub;
