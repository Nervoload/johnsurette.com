import React from "react";
import { OriginTransitionState } from "../types";
import { getTransitionProfile } from "../runtime/transitionProfiles";

interface OriginTransitionOverlayProps {
  transition: OriginTransitionState | null;
  reducedMotion: boolean;
}

const OriginTransitionOverlay: React.FC<OriginTransitionOverlayProps> = ({
  transition,
  reducedMotion,
}) => {
  if (!transition || transition.strength < 0.03) return null;

  const profile = getTransitionProfile(transition.fromId, transition.toId);
  const strength = transition.strength * (reducedMotion ? 0.58 : 1);
  const sweepX = `${(transition.progress - 0.5) * 140}%`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div
        className={`origin-transition-layer style-${profile.style}`}
        style={
          {
            "--origin-accent": profile.accent,
            "--origin-secondary": profile.secondary,
            opacity: strength,
            transform: `translateX(${sweepX})`,
          } as React.CSSProperties
        }
      />
      <div
        className={`origin-transition-noise style-${profile.style}`}
        style={
          {
            "--origin-accent": profile.accent,
            "--origin-secondary": profile.secondary,
            opacity: strength * (profile.flare ? 0.72 : 0.52),
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default OriginTransitionOverlay;
