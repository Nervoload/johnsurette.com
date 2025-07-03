import React, { useMemo, useRef } from "react";
import { MotionValue, useTransform } from "framer-motion";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Card3D from "./Card3D";

interface IntroDeckProps {
  progress: MotionValue<number>;
  cardCount?: number;
  shuffleCount?: number;
  radius?: number;
}

const IntroDeck: React.FC<IntroDeckProps> = ({
  progress,
  cardCount = 6,
  shuffleCount = 3,
  radius,
}) => {
  const { viewport } = useThree();
  const fanRadius = radius ?? viewport.width * 0.85;   // 45 % of screen width
  const shuffleProg = useTransform(progress, [0, 0.3], [0, 1], { clamp: true });
  const fanProg = useTransform(progress, [0.3, 0.7], [0, 1], { clamp: true });
  const flipProg = useTransform(progress, [0.7, 1], [0, 1], { clamp: true });

  const cards = useMemo(() => Array.from({ length: cardCount }, (_, i) => i), [cardCount]);
  const groupRefs = useRef<THREE.Group[]>([]);

  useFrame(() => {
    cards.forEach((idx) => {
      const g = groupRefs.current[idx];
      if (!g) return;

      // Shuffle jitter + spin/scale
      const tS = shuffleProg.get();
      g.position.z = Math.sin(tS * shuffleCount * Math.PI * 2 + idx * 0.5) * 0.3;
      const p = Math.min(Math.max(tS - idx * 0.1, 0), 1);
      g.rotation.x = p * Math.PI * 2;

      // Fan-out on XY + rotation
      const tF = fanProg.get();
      const angle = (idx / cardCount) * Math.PI * 2;
      g.position.x = Math.cos(angle) * fanRadius * tF;
      g.position.y = Math.sin(angle) * fanRadius * tF;
      g.rotation.z = angle * tF;

      // Flip Y-axis
      g.rotation.y = flipProg.get() * Math.PI;

      // Pop-scale
      const baseScale = 0.5 + 0.5 * p;
      const scaleFactor = baseScale * (1 + (1.15 - 1) * tF);
      g.scale.setScalar(scaleFactor);
    });
  });

  return (
    <>
      {cards.map((idx) => (
        <group key={idx} ref={(el) => (groupRefs.current[idx] = el!)}>
          <Card3D />
        </group>
      ))}
    </>
  );
};

export default IntroDeck;