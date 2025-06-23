// src/components/Projects/SpreadReveal.tsx
import React from "react";
import { MotionValue, useTransform } from "framer-motion";
import Card3D from "./Card3D";
import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder from "./textures/backtemp.png";

interface SpreadRevealProps {
  progress: MotionValue<number>;
  cards?: {
    front: string;
    back: string;
    elementScale?: number;   // how far element pops out
  }[];
  baseRadius?: number;
}

const defaultCards = [...Array(5)].map((_, i) => ({
  front: frontPlaceholder,
  back:  backPlaceholder,
  elementScale: 1.2 + i * 0.05,
}));

const SpreadReveal: React.FC<SpreadRevealProps> = ({
  progress,
  cards = defaultCards,
  baseRadius = 3,
}) => {
  const popMv = progress; // 0→1 drives pop scale

  return (
    <group>
      {cards.map((c, i) => {
        const angle = (i / cards.length) * Math.PI * 2;
        const xMv   = useTransform(progress, [0, 1], [0, Math.cos(angle) * baseRadius]);
        const yMv   = useTransform(progress, [0, 1], [0, Math.sin(angle) * baseRadius]);

        return (
          <Card3D
            key={i}
            frontSrc={c.front}
            backSrc={c.back}
            pop={popMv}
            popScale={c.elementScale}
            flip={undefined} // stays front-side up (already flipped in Intro)
            position-x={xMv}
            position-y={yMv}
            rotation-z={angle}
          />
        );
      })}
    </group>
  );
};

export default SpreadReveal;
