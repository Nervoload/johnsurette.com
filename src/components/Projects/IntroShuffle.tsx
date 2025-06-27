import React, { useMemo, useRef } from "react";
import { MotionValue, useTransform } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Card3D from "./Card3D";

interface IntroShuffleProps {
  progress: MotionValue<number>;
  cardCount?: number;
}

/**
 * Basic 3D card shuffle animation. Each card is pulled out of the deck and
 * returned at a different position while the whole deck tilts forward.
 *
 * This component is intentionally simple and keeps the shuffle logic separate
 * from the rest of the intro animations.
 */
const IntroShuffle: React.FC<IntroShuffleProps> = ({
  progress,
  cardCount = 6,
}) => {
  const cards = useMemo(() => Array.from({ length: cardCount }, (_, i) => i), [
    cardCount,
  ]);
  const groupRefs = useRef<THREE.Group[]>([]);
  const deckRef = useRef<THREE.Group>(null);

  const shuffleOffsets = useMemo(
    () =>
      cards.map(() => ({
        x: (Math.random() - 0.5) * 0.8,
        y: (Math.random() - 0.5) * 0.2,
      })),
    [cards]
  );

  const shuffleOrder = useMemo(() => {
    const arr = cards.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [cards]);

  const rotateProg = useTransform(progress, [0, 1], [0, 1]);

  const deckSpacing = 0.03;

  useFrame(() => {
    const dr = deckRef.current;
    if (dr) dr.rotation.x = rotateProg.get() * Math.PI * 0.5;

    const t = progress.get();
    const step = 1 / cards.length;

    cards.forEach((idx) => {
      const g = groupRefs.current[idx];
      if (!g) return;

      const off = shuffleOffsets[idx];
      const targetIndex = shuffleOrder[idx];

      const local = THREE.MathUtils.clamp((t - step * idx) / step, 0, 1);
      const out = Math.sin(local * Math.PI);
      const baseZ = -idx * deckSpacing;
      const targetZ = -targetIndex * deckSpacing;

      g.position.x = off.x * out;
      g.position.y = off.y * out;
      g.position.z = THREE.MathUtils.lerp(baseZ, targetZ, local) + out * 0.05;
    });
  });

  /* simple colour variety for front textures */
  const colors = ["red", "blue", "green", "yellow", "purple", "pink"];
  const colorTex = (c: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect width='1' height='1' fill='${encodeURIComponent(
      c
    )}'/></svg>`;

  return (
    <group ref={deckRef}>
      {cards.map((idx) => (
        <group key={idx} ref={(el) => (groupRefs.current[idx] = el!)}>
          <Card3D frontSrc={colorTex(colors[idx % colors.length])} />
        </group>
      ))}
    </group>
  );
};

export default IntroShuffle;
