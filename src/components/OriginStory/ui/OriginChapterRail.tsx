import React from "react";
import { OriginBeatDefinition } from "../types";

interface OriginChapterRailProps {
  beats: OriginBeatDefinition[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const OriginChapterRail: React.FC<OriginChapterRailProps> = ({ beats, activeIndex, onSelect }) => {
  return (
    <aside className="pointer-events-auto absolute right-4 top-1/2 z-40 -translate-y-1/2">
      <ol className="origin-chapter-rail">
        {beats.map((beat, index) => {
          const active = index === activeIndex;
          return (
            <li key={beat.id}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                className={`origin-rail-node ${active ? "is-active" : ""}`}
                aria-label={`Jump to chapter ${index + 1}: ${beat.chapterLabel}`}
                aria-current={active ? "step" : undefined}
              >
                <span className="origin-rail-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="origin-rail-label">{beat.chapterLabel}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};

export default OriginChapterRail;
