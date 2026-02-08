import React, { useMemo, useRef } from "react";
import { motionValue, MotionValue } from "framer-motion";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Card3D, { Card3DProps } from "./Card3D";

interface ProjectIntroSequenceProps {
  progress: MotionValue<number>;
}

type ShuffleProfile = {
  x: number;
  y: number;
  lift: number;
};

type TexturePalette = {
  deep: string;
  mid: string;
  bright: string;
  line: string;
};

const ORDER = [2, 5, 1, 4, 0, 3];

const PALETTES: TexturePalette[] = [
  { deep: "#103a8a", mid: "#1f5fd8", bright: "#e6f1ff", line: "#f8fbff" },
  { deep: "#3b2f8e", mid: "#6e53db", bright: "#f2ecff", line: "#ffffff" },
  { deep: "#0f6f67", mid: "#0ea390", bright: "#ebfffa", line: "#f8fffe" },
  { deep: "#7b2e4b", mid: "#c13f73", bright: "#fff0f7", line: "#fffafe" },
  { deep: "#8a4b1a", mid: "#d4792e", bright: "#fff5ea", line: "#fffdf9" },
  { deep: "#334155", mid: "#516174", bright: "#f8fafc", line: "#ffffff" },
];

const makeCardTexture = (palette: TexturePalette, seed: number, side: "front" | "back") => {
  const bgA = side === "front" ? palette.bright : palette.deep;
  const bgB = side === "front" ? "#ffffff" : palette.mid;
  const line = side === "front" ? palette.mid : palette.line;
  const emblem = side === "front" ? palette.deep : palette.bright;

  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${bgA}'/>
      <stop offset='100%' stop-color='${bgB}'/>
    </linearGradient>
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${seed * 9})'>
      <path d='M14 0 V28 M0 14 H28' stroke='${line}' stroke-opacity='0.13' stroke-width='1'/>
    </pattern>
    <filter id='grain'>
      <feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer>
        <feFuncA type='table' tableValues='0 0.05'/>
      </feComponentTransfer>
    </filter>
  </defs>

  <rect width='720' height='1024' fill='url(#bg)'/>
  <rect width='720' height='1024' fill='url(#grid)'/>

  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='${line}' stroke-width='8' stroke-opacity='0.75'/>
  <rect x='58' y='58' width='604' height='908' rx='24' fill='none' stroke='${line}' stroke-width='3' stroke-opacity='0.45'/>

  <g transform='translate(360 512) rotate(${seed * 14})'>
    <circle r='172' fill='none' stroke='${emblem}' stroke-width='20' stroke-opacity='0.22'/>
    <circle r='126' fill='none' stroke='${line}' stroke-width='5' stroke-opacity='0.52'/>
    <circle r='82' fill='none' stroke='${emblem}' stroke-width='3' stroke-opacity='0.65'/>
    <path d='M0-120 L20-30 L110 0 L20 30 L0 120 L-20 30 L-110 0 L-20 -30 Z' fill='${line}' fill-opacity='0.34'/>
    <circle r='18' fill='${emblem}' fill-opacity='0.74'/>
  </g>

  <g transform='translate(360 512)' opacity='0.34'>
    <path d='M-250 -320 C-180 -220 -140 -120 -110 -20 C-70 120 -120 230 -220 320' stroke='${line}' stroke-width='2' fill='none'/>
    <path d='M250 320 C180 220 140 120 110 20 C70 -120 120 -230 220 -320' stroke='${line}' stroke-width='2' fill='none'/>
  </g>

  <rect width='720' height='1024' filter='url(#grain)'/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
const phase = (progress: number, start: number, end: number) => clamp01((progress - start) / (end - start));

const ProjectIntroSequence: React.FC<ProjectIntroSequenceProps> = ({ progress }) => {
  const { viewport, pointer } = useThree();
  const cardGroups = useRef<THREE.Group[]>([]);
  const deckRef = useRef<THREE.Group>(null);
  const flipValues = useRef<MotionValue<number>[]>([]);

  const base = Math.min(viewport.width, viewport.height);
  const cardWidth = base * 0.165;
  const cardHeight = cardWidth * 1.42;

  const cards = useMemo<Card3DProps[]>(() => {
    return PALETTES.map((palette, index) => ({
      frontSrc: makeCardTexture(palette, index + 1, "front"),
      backSrc: makeCardTexture(palette, index + 1, "back"),
      borderColor: "#f8fafc",
      width: cardWidth,
      height: cardHeight,
    }));
  }, [cardHeight, cardWidth]);

  if (flipValues.current.length !== cards.length) {
    flipValues.current = Array.from({ length: cards.length }, () => motionValue(0));
  }

  const shuffleProfiles = useMemo<ShuffleProfile[]>(() => {
    return cards.map((_, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      return {
        x: direction * (0.46 + index * 0.08),
        y: ((index % 3) - 1) * 0.2,
        lift: 0.12 + index * 0.014,
      };
    });
  }, [cards]);

  useFrame((state) => {
    const deck = deckRef.current;
    if (!deck) return;
    const time = state.clock.getElapsedTime();

    const t = clamp01(progress.get());
    const count = cards.length;

    const shuffleT = easeOut(phase(t, 0.0, 0.5));
    const spreadT = easeOut(phase(t, 0.36, 0.7));
    const idleOrbitT = easeOut(phase(t, 0.68, 0.84));
    const exitT = easeOut(phase(t, 0.84, 1));

    const tiltAmount = shuffleT * (1 - spreadT);
    const mouseX = pointer.x;
    const mouseY = pointer.y;
    const baseRotX = THREE.MathUtils.lerp(0, Math.PI * 0.24, tiltAmount);
    const baseRotY = THREE.MathUtils.lerp(0, -Math.PI * 0.035, tiltAmount);

    deck.rotation.x = baseRotX + mouseY * 0.03;
    deck.rotation.y = baseRotY + mouseX * 0.05;
    deck.position.x = mouseX * 0.16;
    deck.position.y = mouseY * 0.08;

    const ringRadiusX = viewport.width * 0.24;
    const ringRadiusY = viewport.height * 0.18;
    const orbitRotation = (idleOrbitT * 0.68 + exitT * 1.4) * Math.PI * 2;

    for (let index = 0; index < count; index += 1) {
      const group = cardGroups.current[index];
      if (!group) continue;

      const profile = shuffleProfiles[index];
      const stagger = index / Math.max(1, count - 1);
      const localShuffle = easeOut(clamp01((shuffleT - stagger * 0.44) / 0.56));

      const arcLift = Math.sin(localShuffle * Math.PI);
      const baseZ = -index * 0.05;
      const targetZ = -ORDER[index] * 0.055;

      const shuffleX = profile.x * arcLift;
      const shuffleY = profile.y * arcLift;
      const shuffleZ = THREE.MathUtils.lerp(baseZ, targetZ, localShuffle) + profile.lift * arcLift;

      const baseAngle = (index / count) * Math.PI * 2;
      const angle = baseAngle + orbitRotation;

      const ringX = Math.sin(angle) * ringRadiusX;
      const ringY = Math.cos(angle) * ringRadiusY + 0.05;
      const ringZ = -0.06 + Math.sin(angle * 2) * 0.012;

      const spreadX = THREE.MathUtils.lerp(shuffleX, ringX, spreadT);
      const spreadY = THREE.MathUtils.lerp(shuffleY, ringY, spreadT);
      const spreadZ = THREE.MathUtils.lerp(shuffleZ, ringZ, spreadT);

      const exitDrop = viewport.height * 0.78 * exitT;
      const exitDrift = Math.sin(angle * 1.2) * 0.12 * exitT;
      const bobStrength = 0.01 + spreadT * 0.022;
      const bobY = Math.sin(time * 1.65 + index * 0.82) * bobStrength;
      const bobZ = Math.cos(time * 1.2 + index * 0.58) * bobStrength * 0.45;

      group.position.x = spreadX + exitDrift;
      group.position.y = spreadY - exitDrop + bobY;
      group.position.z = spreadZ - 0.16 * exitT + bobZ;

      group.rotation.x = 0;
      group.rotation.y = 0;
      group.rotation.z = angle * 0.1 * spreadT;

      const flipValue = easeOut(phase(spreadT, 0.08, 0.62));
      flipValues.current[index].set(flipValue);

      const scale = 1 + 0.1 * spreadT - 0.12 * exitT;
      group.scale.setScalar(scale);
    }
  });

  return (
    <group ref={deckRef}>
      {cards.map((card, index) => (
        <group
          key={`intro-card-${index}`}
          ref={(element) => {
            if (element) {
              cardGroups.current[index] = element;
            }
          }}
          position={[0, 0, -index * 0.05]}
        >
          <Card3D {...card} flip={flipValues.current[index]} />
        </group>
      ))}
    </group>
  );
};

export default ProjectIntroSequence;
