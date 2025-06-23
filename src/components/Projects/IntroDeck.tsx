// src/components/Projects/IntroDeck.tsx
import React, { useMemo } from "react";
import { MotionValue, useTransform } from "framer-motion";
import Card3D from "./Card3D";
import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder from "./textures/backtemp.png";

interface IntroDeckProps {
  progress: MotionValue<number>; // local 0‒1
  cardCount?: number;
  shuffleCount?: number;
  radius?: number;               // fan-out radius
}

const IntroDeck: React.FC<IntroDeckProps> = ({
  progress,
  cardCount = 6,
  shuffleCount = 3,
  radius = 2,
}) => {
  /* Phase slicing ------------------------------------------------------ */
  const shuffleProg = useTransform(progress, [0, 0.3], [0, 1], { clamp: true });
  const fanProg     = useTransform(progress, [0.3, 0.7], [0, 1], { clamp: true });
  const flipProg    = useTransform(progress, [0.7, 1], [0, 1], { clamp: true });

  /* Pre-compute card indices array */
  const cards = useMemo(() => [...Array(cardCount).keys()], [cardCount]);

  /* Render ------------------------------------------------------------- */
  return (
    <group>
      {cards.map((idx) => {
        /* ——— SHUFFLE ——— */
        const shuffleOffset = useTransform(
          shuffleProg,
          (t) => {
            // create 'shuffleCount' sine bumps in z
            const freq = shuffleCount * Math.PI * 2;
            return Math.sin(t * freq + idx * 0.5) * 0.3; // 0.3 world units
          }
        );

        /* ——— FAN-OUT ——— */
        const fanAngle   = (idx / cardCount) * Math.PI * 2;
        const fanX = useTransform(fanProg, [0, 1], [0, Math.cos(fanAngle) * radius]);
        const fanY = useTransform(fanProg, [0, 1], [0, Math.sin(fanAngle) * radius]);
        const fanRotZ = useTransform(fanProg, [0, 1], [0, fanAngle]);

        /* ——— FLIP ——— */
        const flipMv = flipProg; // reuse directly (0→1)

        return (
          <Card3D
            key={idx}
            flip={flipMv}
            pop={fanProg}        // small scale-up while fanning
            onClick={() => null}
            frontSrc={frontPlaceholder}
            backSrc={backPlaceholder}
            /* Three-JS style prop spread */
            position-x={fanX}
            position-y={fanY}
            position-z={shuffleOffset}
            rotation-z={fanRotZ}
          />
        );
      })}
    </group>
  );
};

export default IntroDeck;
