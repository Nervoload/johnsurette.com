import React, { useEffect } from "react";
import { OriginHotspotDefinition } from "../types";
import { removeRuntimeContextEntry, upsertRuntimeContextEntry } from "../../../devtools/codexContext/runtimeRegistry";

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
  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    hotspots.forEach((hotspot) => {
      const isActive = activeHotspotId === hotspot.id;
      const isInSubscene = activeSubsceneId === hotspot.subsceneId;

      upsertRuntimeContextEntry({
        pagePath: "/origin",
        id: `origin:hotspot:${hotspot.id}`,
        componentName: "OriginHotspot",
        componentPath: ["OriginStoryPage", "OriginStoryExperience", "OriginHotspotLayer", hotspot.id],
        filePath: "/src/components/OriginStory/ui/OriginHotspotLayer.tsx",
        role: "hotspot",
        metadata: {
          hotspotId: hotspot.id,
          label: hotspot.label,
          title: hotspot.title,
          subsceneId: hotspot.subsceneId ?? null,
          anchor: hotspot.anchor,
          mobileAnchor: hotspot.mobileAnchor ?? null,
          focusTarget: hotspot.focusTarget,
          cameraOffset: hotspot.cameraOffset,
          isActive,
          isInSubscene,
          disabled,
        },
      });
    });

    return () => {
      hotspots.forEach((hotspot) => {
        removeRuntimeContextEntry("/origin", `origin:hotspot:${hotspot.id}`);
      });
    };
  }, [activeHotspotId, activeSubsceneId, disabled, hotspots]);

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
