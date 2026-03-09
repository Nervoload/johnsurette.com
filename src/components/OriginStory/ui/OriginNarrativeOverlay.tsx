import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  OriginBeatDefinition,
  OriginHotspotDefinition,
  OriginSubsceneRuntime,
  OriginTransitionState,
} from "../types";

interface OriginNarrativeOverlayProps {
  beat: OriginBeatDefinition;
  transition: OriginTransitionState | null;
  activeHotspotId: string | null;
  activeHotspot: OriginHotspotDefinition | null;
  activeSubscene: OriginSubsceneRuntime | null;
  creditCount: number;
  creditsOpen: boolean;
  onSelectHotspot: (hotspotId: string) => void;
  onExploreHotspot: (subsceneId: string) => void;
  onCloseSubscene: () => void;
  onToggleCredits: () => void;
}

const OriginNarrativeOverlay: React.FC<OriginNarrativeOverlayProps> = ({
  beat,
  transition,
  activeHotspotId,
  activeHotspot,
  activeSubscene,
  creditsOpen,
  creditCount,
  onSelectHotspot,
  onExploreHotspot,
  onCloseSubscene,
  onToggleCredits,
}) => {
  const transitionDim = activeSubscene ? 1 : transition ? Math.max(0.44, 1 - transition.strength * 0.42) : 1;
  const activeSubsceneDefinition = activeSubscene?.definition ?? null;
  const subsceneProgress = activeSubscene?.progress ?? 0;
  const showCredits = creditCount > 0;

  return (
    <div className="absolute inset-x-0 bottom-24 z-30 px-4 md:bottom-10 md:left-0 md:right-auto md:top-24 md:flex md:w-full md:items-start md:px-6">
      <AnimatePresence mode="wait">
        <motion.article
          key={activeSubsceneDefinition ? `${beat.id}-${activeSubsceneDefinition.id}` : beat.id}
          className={`origin-narrative-shell mode-${beat.overlayMode} ${activeSubsceneDefinition ? "is-subscene" : ""}`}
          initial={{ opacity: 0, x: -24, y: 20, filter: "blur(12px)" }}
          animate={{ opacity: transitionDim, x: 0, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -14, y: 12, filter: "blur(10px)" }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeSubsceneDefinition ? (
            <>
              <p className="origin-narrative-kicker">
                {activeSubsceneDefinition.kicker} · {beat.chapterLabel}
              </p>
              <h2 className="origin-narrative-title">{activeSubsceneDefinition.title}</h2>
              <p className="origin-narrative-line">{activeSubsceneDefinition.label}</p>
              <p className="origin-narrative-detail">{activeSubsceneDefinition.body}</p>

                <div className="origin-subscene-metrics">
                <div className="origin-subscene-meter">
                  <span className="origin-subscene-meter-fill" style={{ transform: `scaleX(${subsceneProgress})` }} />
                </div>
                <div className="origin-subscene-meta">
                  <span>{activeSubsceneDefinition.progressLabel}</span>
                  <span>{Math.round(subsceneProgress * 100)}%</span>
                </div>
              </div>

              <div className="origin-narrative-actions">
                <button type="button" className="origin-overlay-button is-strong" onClick={onCloseSubscene}>
                  Back to chapter
                </button>
                {showCredits ? (
                  <button
                    type="button"
                    className={`origin-overlay-button ${creditsOpen ? "is-active" : ""}`}
                    onClick={onToggleCredits}
                  >
                    Credits ({creditCount})
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <p className="origin-narrative-kicker">
                {beat.kicker} · {beat.chapterLabel}
              </p>
              <h2 className="origin-narrative-title">{beat.title}</h2>
              <p className="origin-narrative-line">{beat.line}</p>
              <p className="origin-narrative-detail">{beat.detail}</p>

              <div className="origin-narrative-tags" aria-label="Topic tags">
                {beat.tags.map((tag) => (
                  <span key={tag} className="origin-narrative-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="origin-hotspot-card">
                <p className="origin-hotspot-card-kicker">{activeHotspot ? activeHotspot.label : "Interactive focus"}</p>
                <p className="origin-hotspot-card-title">
                  {activeHotspot
                    ? activeHotspot.title
                    : "Tap or click a scene marker to pull the camera into a detail, then dive deeper."}
                </p>
                <p className="origin-hotspot-card-body">
                  {activeHotspot
                    ? activeHotspot.body
                    : "Each chapter exposes local anchors that can either reframe the camera or open a focused micro-scene."}
                </p>

                <div className="origin-narrative-actions">
                  {activeHotspot?.subsceneId ? (
                    <button
                      type="button"
                      className="origin-overlay-button is-strong"
                      onClick={() => onExploreHotspot(activeHotspot.subsceneId!)}
                    >
                      Explore detail
                    </button>
                  ) : null}
                  {showCredits ? (
                    <button
                      type="button"
                      className={`origin-overlay-button ${creditsOpen ? "is-active" : ""}`}
                      onClick={onToggleCredits}
                    >
                      Credits ({creditCount})
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="origin-mobile-hotspots md:hidden">
                {beat.hotspots.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    type="button"
                    className={`origin-mobile-hotspot ${activeHotspotId === hotspot.id ? "is-active" : ""}`}
                    onClick={() => onSelectHotspot(hotspot.id)}
                  >
                    {hotspot.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.article>
      </AnimatePresence>
    </div>
  );
};

export default OriginNarrativeOverlay;
