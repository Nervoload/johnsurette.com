import React from "react";
import { MotionValue } from "framer-motion";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SpreadRevealProps {
  progress: MotionValue<number>;
  cardRefs: React.MutableRefObject<THREE.Group[]>;
  flipVals: MotionValue<number>[];
  baseRadius?: number;
}



const SpreadReveal: React.FC<SpreadRevealProps> = ({
  progress,
  cardRefs,
  flipVals,
  baseRadius,
}) => {
  const { viewport } = useThree();
  const ringRadius = baseRadius ?? viewport.width * 0.75;
  const cardSpacing = viewport.width * 0.15;
  const cardCount = cardRefs.current.length;

  useFrame(() => {
    const t = progress.get();
    const rowPhase = Math.min(t / 0.5, 1);
    const circlePhase = t > 0.5 ? (t - 0.5) / 0.5 : 0;
    const step = 1 / cardCount;

    for (let i = 0; i < cardCount; i++) {
      const g = cardRefs.current[i];
      if (!g) continue;
      const start = step * i;
      const localRow = THREE.MathUtils.clamp((rowPhase - start) / step, 0, 1);
      const localCircle = THREE.MathUtils.clamp((circlePhase - start) / step, 0, 1);

      const xRow = (i - (cardCount - 1) / 2) * cardSpacing;
      g.position.set(xRow * localRow, 0, g.position.z);

      const angle = (i / cardCount) * Math.PI * 2;
      const xCircle = Math.cos(angle) * ringRadius * localCircle;
      const yCircle = Math.sin(angle) * ringRadius * localCircle;
      g.position.x = THREE.MathUtils.lerp(g.position.x, xCircle, localCircle);
      g.position.y = THREE.MathUtils.lerp(g.position.y, yCircle, localCircle);
      g.rotation.z = angle * localCircle;

      const cardFlip = Math.max(localRow, localCircle);
      flipVals[i]?.set(cardFlip);
    }
  });

  return null;
};

export default SpreadReveal;
