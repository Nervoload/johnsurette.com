import React, { useRef, useEffect } from "react";
import { MotionValue, motionValue } from "framer-motion";
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

const colors = ["red", "blue", "green", "yellow", "purple", "pink"];
const colorTex = (c: string) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect width='1' height='1' fill='${encodeURIComponent(
    c
  )}'/></svg>`;

const defaultCards = Array.from({ length: 6 }, (_, i) => ({
  front: colorTex(colors[i % colors.length]),
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
  const cardSpacing = viewport.width * 0.15;
  const refs = useRef<THREE.Group[]>([]);
  const flipVals = useRef<MotionValue<number>[]>([]);

  if (flipVals.current.length !== cards.length) {
    flipVals.current = cards.map(() => motionValue(0));
  }

  useFrame(() => {
    const t = progress.get();
    const rowPhase = Math.min(t / 0.5, 1);
    const circlePhase = t > 0.5 ? (t - 0.5) / 0.5 : 0;
    const step = 1 / cards.length;

    cards.forEach((_, i) => {
      const g = refs.current[i];
      if (!g) return;
      const start = step * i;
      const localRow = THREE.MathUtils.clamp((rowPhase - start) / step, 0, 1);
      const localCircle = THREE.MathUtils.clamp((circlePhase - start) / step, 0, 1);

      const xRow = (i - (cards.length - 1) / 2) * cardSpacing;
      g.position.set(xRow * localRow, 0, 0);

      const angle = (i / cards.length) * Math.PI * 2;
      const xCircle = Math.cos(angle) * ringRadius * localCircle;
      const yCircle = Math.sin(angle) * ringRadius * localCircle;
      g.position.x = THREE.MathUtils.lerp(g.position.x, xCircle, localCircle);
      g.position.y = THREE.MathUtils.lerp(g.position.y, yCircle, localCircle);
      g.rotation.z = angle * localCircle;

      const cardFlip = Math.max(localRow, localCircle);
      flipVals.current[i].set(cardFlip);
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
            flip={flipVals.current[i]}
          />
        </group>
      ))}
    </>
  );
};

export default SpreadReveal;
