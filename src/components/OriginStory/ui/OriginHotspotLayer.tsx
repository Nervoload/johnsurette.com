import React from "react";
import { OriginHotspotDefinition } from "../types";

interface OriginHotspotLayerProps {
  hotspots: OriginHotspotDefinition[];
  activeHotspotId: string | null;
  activeSubsceneId: string | null;
  disabled?: boolean;
  onSelect: (hotspotId: string) => void;
  onExplore: (subsceneId: string) => void;
}

const OriginHotspotLayer: React.FC<OriginHotspotLayerProps> = ({
  hotspots,
  activeHotspotId,
  activeSubsceneId,
  disabled = false,
  onSelect,
  onExplore,
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 z-30 hidden md:block ${disabled ? "opacity-0" : ""}`}>
      {hotspots.map((hotspot) => {
        const isActive = activeHotspotId === hotspot.id;
        const isInSubscene = activeSubsceneId === hotspot.subsceneId;

        return (
          <button
            key={hotspot.id}
            type="button"
            className={`origin-hotspot pointer-events-auto ${isActive ? "is-active" : ""} ${isInSubscene ? "is-subscene" : ""}`}
            style={
              {
                left: `${hotspot.anchor[0] * 100}%`,
                top: `${hotspot.anchor[1] * 100}%`,
                "--origin-hotspot-tint": hotspot.tint,
              } as React.CSSProperties
            }
            aria-pressed={isActive || isInSubscene}
            aria-label={hotspot.title}
            disabled={disabled}
            onClick={() => {
              if (isActive && hotspot.subsceneId) {
                onExplore(hotspot.subsceneId);
                return;
              }

              onSelect(hotspot.id);
            }}
          >
            <span className="origin-hotspot-dot" />
            <span className="origin-hotspot-label">{hotspot.label}</span>
            {hotspot.subsceneId ? <span className="origin-hotspot-mode">{isInSubscene ? "Inside" : "Explore"}</span> : null}
          </button>
        );
      })}
    </div>
  );
};

export default OriginHotspotLayer;
