import React, { useRef } from "react";
import { OriginSubsceneRuntime } from "../types";

interface OriginSubsceneOverlayProps {
  subscene: OriginSubsceneRuntime | null;
  onAdvance: (delta: number) => void;
  onClose: () => void;
}

const wheelFactor = 0.00075;
const touchFactor = 0.0042;

const OriginSubsceneOverlay: React.FC<OriginSubsceneOverlayProps> = ({ subscene, onAdvance, onClose }) => {
  const lastTouchYRef = useRef<number | null>(null);

  if (!subscene) {
    return null;
  }

  return (
    <div
      className="origin-subscene-overlay"
      onWheel={(event) => {
        event.preventDefault();
        onAdvance(event.deltaY * wheelFactor);
      }}
      onTouchStart={(event) => {
        lastTouchYRef.current = event.touches[0]?.clientY ?? null;
      }}
      onTouchMove={(event) => {
        event.preventDefault();
        const nextY = event.touches[0]?.clientY;
        if (typeof nextY !== "number" || typeof lastTouchYRef.current !== "number") {
          return;
        }

        const delta = lastTouchYRef.current - nextY;
        lastTouchYRef.current = nextY;
        onAdvance(delta * touchFactor);
      }}
      onTouchEnd={() => {
        lastTouchYRef.current = null;
      }}
    >
      <div className="origin-subscene-vignette" />

      <div className="origin-subscene-hud">
        <p className="origin-subscene-kicker">{subscene.definition.progressLabel}</p>
        <div className="origin-subscene-meter">
          <span className="origin-subscene-meter-fill" style={{ transform: `scaleX(${subscene.progress})` }} />
        </div>
        <p className="origin-subscene-hint">Scroll, swipe, or use arrow keys. Reverse at the start to exit.</p>
      </div>

      <button type="button" className="origin-subscene-close" onClick={onClose}>
        Back to chapter
      </button>
    </div>
  );
};

export default OriginSubsceneOverlay;
