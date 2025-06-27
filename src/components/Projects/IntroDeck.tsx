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
  const fanRadius = radius ?? viewport.width * 0.85; // 45 % of screen width
  const shuffleProg = useTransform(progress, [0, 0.3], [0, 1], { clamp: true });
  const rotateProg = useTransform(progress, [0.05, 0.35], [0, 1], { clamp: true });
  const fanProg = useTransform(progress, [0.35, 0.7], [0, 1], { clamp: true });
  const flipProg = useTransform(progress, [0.7, 1], [0, 1], { clamp: true });

  const cards = useMemo(() => Array.from({ length: cardCount }, (_, i) => i), [cardCount]);
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

  const deckSpacing = 0.03;

  useFrame(() => {
    const dr = deckRef.current;
    if (dr) {
      dr.rotation.x = rotateProg.get() * Math.PI * 0.5;
    }

    const step = 1 / cards.length;
    const tShuffle = shuffleProg.get();
    const tFan = fanProg.get();
    const tFlip = flipProg.get();

    cards.forEach((idx) => {
      const g = groupRefs.current[idx];
      if (!g) return;

      const off = shuffleOffsets[idx];
      const targetIndex = shuffleOrder[idx];

      const localS = THREE.MathUtils.clamp((tShuffle - step * idx) / step, 0, 1);
      const out = Math.sin(localS * Math.PI);
      const baseZ = -idx * deckSpacing;
      const targetZ = -targetIndex * deckSpacing;

      g.position.x = off.x * out;
      g.position.y = off.y * out;
      g.position.z = THREE.MathUtils.lerp(baseZ, targetZ, localS) + out * 0.05;

      const angle = (idx / cardCount) * Math.PI * 2;
      g.position.x += Math.cos(angle) * fanRadius * tFan;
      g.position.y += Math.sin(angle) * fanRadius * tFan;
      g.rotation.z = angle * tFan;

      g.rotation.y = tFlip * Math.PI;

      const scaleFactor = 1 + (1.15 - 1) * tFan;
      g.scale.setScalar(scaleFactor);
    });
  });

  const colors = ["red", "blue", "green", "yellow", "purple", "pink"];
  const colorTex = (c: string) =>
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect width='1' height='1' fill='${encodeURIComponent(
      c
    )}'/></svg>`;

  return (
    <group ref={deckRef}>
      {cards.map((idx) => (
        <group key={idx} ref={(el) => (groupRefs.current[idx] = el!)}>
          <Card3D
            frontSrc={colorTex(colors[idx % colors.length])}
            backSrc={undefined}
          />
        </group>
      ))}
    </group>
  );
};

export default IntroDeck;
