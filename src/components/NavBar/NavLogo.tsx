// src/components/NavBar/NavLogo.tsx
import React, { useState, useRef } from "react";

export interface NavLogoProps {
  /** Total diameter in CSS pixels. */
  size?: number;
  /** Thickness of the surrounding gradient ring (pixels). */
  ringThickness?: number;
  /** Colours for the conic gradient ring (any length ≥ 2). */
  ringColors?: string[];
}

/**
 * 📀 3‑D Glass Orb Logo
 * ──────────────────────────────────────────────────────────────────────────
 * • Conic‑gradient ring masked into a perfect halo – fully scalable.
 * • Glass sphere reacts to cursor: the highlight follows the mouse to mimic
 *   a light source.
 * • Subtle inner haze for a crystal‑ball vibe.
 * • Pure CSS + React (no Three.js), so it weighs almost nothing yet feels
 *   dimensional. Works right down to 24 px.
 */
const NavLogo: React.FC<NavLogoProps> = ({
  size = 48,
  ringThickness = 4,
  ringColors = [
    "#3b82f6", // blue‑500
    "#9333ea", // violet‑600
    "#14b8a6", // teal‑500
    "#f59e0b", // amber‑500
    "#ef4444", // red‑500
    "#3b82f6", // loop back to first for smooth wrap
  ],
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shine, setShine] = useState({ x: 50, y: 50 }); // percent

  const handleMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setShine({ x, y });
  };

  const inner = size - ringThickness * 2;
  const conic = `conic-gradient(${ringColors.join(", ")})`;
  const mask = `radial-gradient(circle at center, transparent ${inner / 2}px, black ${
    inner / 2 + 0.5
  }px)`; // thin mask edge ensures crisp ring

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      style={{ width: size, height: size, position: "relative" }}
      className="select-none"
    >
      {/* ── Gradient halo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: conic,
          WebkitMask: mask,
          mask: mask,
        }}
      />

      {/* ── Glass sphere */}
      <div
        style={{
          position: "absolute",
          left: ringThickness,
          top: ringThickness,
          width: inner,
          height: inner,
          borderRadius: "50%",
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.25) 18%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.15) 100%)`,
          boxShadow:
            "inset 0 0 12px rgba(255,255,255,0.45), inset 0 0 30px rgba(255,255,255,0.25), 0 0 6px rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)", // glass‑like refraction
        }}
      >
        {/* Inner haze */}
        <div
          style={{
            position: "absolute",
            inset: "18%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 65%, transparent 100%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </div>
  );
};

export default NavLogo;
