import React, { useMemo, useRef } from "react";
import { MotionValue, useTransform } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { Card3DProps } from "./Card3D";

export interface IntroShuffleProps {
  progress: MotionValue<number>;
  /** Optional custom cards */
  cards?: Card3DProps[];
  deckRef: React.RefObject<THREE.Group>;
  cardRefs: React.MutableRefObject<THREE.Group[]>;
  flipVals: MotionValue<number>[];
}

/**
 * Animates the IntroDeck with a shuffle, fan and flip sequence.
 */
const IntroShuffle: React.FC<IntroShuffleProps> = ({
  progress,
  cards,
  deckRef,
  cardRefs,
  flipVals,
}) => {
  const cardCount = cards?.length ?? (cardRefs.current.length || 6);
  const indices = useMemo(() => Array.from({ length: cardCount }, (_, i) => i), [cardCount]);

  const shuffleOffsets = useMemo(
    () =>
      indices.map(() => ({
        x: (Math.random() - 0.5) * 0.8,
        y: (Math.random() - 0.5) * 0.2,
      })),
    [indices]
  );

  const shuffleOrder = useMemo(() => {
    const arr = indices.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [indices]);

  const shuffleProg = useTransform(progress, [0, 0.3], [0, 1], { clamp: true });
  const rotateProg = useTransform(progress, [0.05, 0.35], [0, 1], { clamp: true });
  const fanProg = useTransform(progress, [0.35, 0.7], [0, 1], { clamp: true });
  const flipProg = useTransform(progress, [0.7, 1], [0, 1], { clamp: true });

  const deckSpacing = 0.03;

  useFrame(() => {
    const dr = deckRef.current;
    if (dr) dr.rotation.x = rotateProg.get() * Math.PI * 0.5;

    const step = 1 / cardCount;
    const tShuffle = shuffleProg.get();
    const tFan = fanProg.get();
    const tFlip = flipProg.get();

    indices.forEach((idx) => {
      const g = cardRefs.current[idx];
      if (!g) return;

      const angle = (idx / cardCount) * Math.PI * 2;
      const off = shuffleOffsets[idx];
      const targetIndex = shuffleOrder[idx];

      const localS = THREE.MathUtils.clamp((tShuffle - step * idx) / step, 0, 1);
      const out = Math.sin(localS * Math.PI);
      const baseZ = -idx * deckSpacing;
      const targetZ = -targetIndex * deckSpacing;

      g.position.x = off.x * out;
      g.position.y = off.y * out;
      g.position.z = THREE.MathUtils.lerp(baseZ, targetZ, localS) + out * 0.05;
      g.rotation.z = angle * tFan;

      flipVals[idx]?.set(tFlip);
      g.rotation.y = tFlip * Math.PI * 2;

      const scaleFactor = 1 + (1.15 - 1) * tFan;
      g.scale.setScalar(scaleFactor);
    });
  });

  return null;
};

export default IntroShuffle;
