import React from "react";
import { sections } from "../sections";

type Props = { activeSection: string | null };

const INNER = 54.3;  // inner % radius
const OUTER = 57.15;  // outer % radius

const GradientRing: React.FC<Props> = ({ activeSection }) => {
  /* --------------------------------------------------------------------------
     Build a conic‑gradient so that …

       • Each section’s SOLID colour is centred on exactly the same mid‑axis
         as the hit‑test slice defined in SectionLayer.tsx.
       • Around every border between slices we insert a GRADIENT wedge that
         is transitionRatio × slice width (symmetric about the border).

     Symbols:
       N  = number of sections      (5)
       slicePct = 100 / N           (20 %)
       transitionRatio = 0.40       (40 % of slice ⇒ 8 %)
       halfTrans = transitionPct/2  (4 %)

     For each border i (i = 0…N‑1) at percent P = i·slicePct we push two stops:
         (P‑halfTrans)  ← colour of previous slice
         (P+halfTrans)  ← colour of next    slice
     That produces an 8 % blend centred on the border and a solid plateau
     between successive borders. -------------------------------------------------- */

  const slicePct = 100 / sections.length;
  const transitionRatio = 5;               // 40 % of slice width becomes gradient
  const transitionPct = slicePct * transitionRatio;
  const halfTrans = transitionPct / 10;

  const sliceDeg = 360 / sections.length;
  const angleOffset = -90 - sliceDeg / 2; // centre of first slice at 12 o’clock

  /** Wrap a percentage into 0–100 domain */
  const mod100 = (v: number) => (v + 100) % 100;

  /** Apply dimming unless this is the active section */
  const tint = (secName: string, hex: string) =>
    activeSection && activeSection !== secName ? `${hex}55` : hex;

  type Stop = { pos: number; color: string };
  const stopObjs: Stop[] = [];

  sections.forEach((sec, i) => {
    const borderPct = i * slicePct;                    // left border of slice i
    const prevSec   = sections[(i - 1 + sections.length) % sections.length];

    // Gradient wedge centred on the border
    stopObjs.push(
      { pos: mod100(borderPct - halfTrans), color: tint(prevSec.name, prevSec.color) },
      { pos: mod100(borderPct + halfTrans), color: tint(sec.name,     sec.color) }
    );
  });

  // Sort stops so conic‑gradient input is monotone increasing
  stopObjs.sort((a, b) => a.pos - b.pos);

  // Ensure gradient wraps cleanly at 100 %
  if (stopObjs[0].pos !== 0) {
    stopObjs.unshift({ pos: 0, color: stopObjs[0].color });
  }
  if (stopObjs[stopObjs.length - 1].pos !== 100) {
    stopObjs.push({
      pos: 100,
      color: stopObjs[0].color, // wrap‑around to first colour
    });
  }

  const stops: string[] = stopObjs.map((s) => `${s.color} ${s.pos}%`);

  const mask = `radial-gradient(circle at center,
                 transparent ${INNER}%,
                 black ${INNER + 0.3}%,
                 black ${OUTER}%,
                 transparent ${OUTER + 0.3}%)`;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(from ${angleOffset}deg, ${stops.join(", ")})`,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      />
    </div>
  );
};

export default GradientRing;
