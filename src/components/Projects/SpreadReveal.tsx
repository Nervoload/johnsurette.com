import React, { useRef } from "react";
import { MotionValue } from "framer-motion";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Card3D from "./Card3D";
import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder  from "./textures/backtemp.png";

interface SpreadRevealProps {
  progress: MotionValue<number>;
  cards?: { front: string; back: string; elementScale?: number }[];
  baseRadius?: number;
}

const defaultCards = Array.from({ length: 5 }, (_, i) => ({
  front: frontPlaceholder,
  back: backPlaceholder,
  elementScale: 1.2 + i * 0.05,
}));

const SpreadReveal: React.FC<SpreadRevealProps> = ({
  progress,
  cards = defaultCards,
  baseRadius,
}) => {
  const { viewport } = useThree();
  const ringRadius = baseRadius ?? viewport.width * 0.75;
  const refs = useRef<THREE.Group[]>([]);

  useFrame(() => {
    const t = progress.get();
    cards.forEach((_, i) => {
      const g = refs.current[i];
      if (!g) return;
      const angle = (i / cards.length) * Math.PI * 2;
      const r = ringRadius * t;
      g.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      g.rotation.z = angle;
    });
  });

  return (
    <>
      {cards.map((c, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el!)}>
          <Card3D
            frontSrc={c.front}
            backSrc={c.back}
            pop={progress}
            popScale={c.elementScale}
          />
        </group>
      ))}
    </>
  );
};

export default SpreadReveal;