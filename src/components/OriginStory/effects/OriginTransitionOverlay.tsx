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
  if (!transition || transition.strength < 0.05) {
    return null;
  }

  const profile = getTransitionProfile(transition.fromId, transition.toId);
  const strength = transition.strength * (reducedMotion ? 0.5 : 1);
  const sweepX = `${transition.progress * 100}%`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div
        className={`origin-transition-streak style-${profile.style}`}
        style={
          {
            "--origin-accent": profile.accent,
            "--origin-secondary": profile.secondary,
            "--origin-sweep": sweepX,
            opacity: strength * 0.86,
          } as React.CSSProperties
        }
      />
      <div
        className={`origin-transition-glint style-${profile.style}`}
        style={
          {
            "--origin-accent": profile.accent,
            "--origin-secondary": profile.secondary,
            "--origin-sweep": sweepX,
            opacity: strength * (profile.flare ? 0.78 : 0.52),
          } as React.CSSProperties
        }
      />
      <div
        className="origin-transition-dust"
        style={
          {
            "--origin-accent": profile.accent,
            opacity: strength * 0.26,
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default OriginTransitionOverlay;
