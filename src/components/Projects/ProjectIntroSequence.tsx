import React, { useMemo, useRef } from "react";
import { motionValue, MotionValue } from "framer-motion";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Card3D, { Card3DProps } from "./Card3D";
import { ProjectItem } from "./projectData";

/* ───────────────────────── types ───────────────────────── */

interface ProjectIntroSequenceProps {
  progress: MotionValue<number>;
  items: ProjectItem[];
  onCardSelect?: (item: ProjectItem, screenPos: { x: number; y: number }) => void;
}

type ShuffleProfile = { x: number; y: number; lift: number };

/* ───────────────────── texture helpers ─────────────────── */

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const makeProjectFront = (item: ProjectItem, seed: number) => {
  const a = item.accent;
  const p = item.palette;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${p.bright}'/>
      <stop offset='100%' stop-color='#ffffff'/>
    </linearGradient>
    <linearGradient id='trim' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${a}' stop-opacity='0.9'/>
      <stop offset='50%' stop-color='${p.mid}' stop-opacity='0.78'/>
      <stop offset='100%' stop-color='${a}' stop-opacity='0.86'/>
    </linearGradient>
    <radialGradient id='emblemGlow' cx='50%' cy='36%' r='26%'>
      <stop offset='0%' stop-color='${a}' stop-opacity='0.24'/>
      <stop offset='100%' stop-color='${a}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse' patternTransform='rotate(${seed * 12})'>
      <path d='M16 0 V32 M0 16 H32' stroke='${a}' stroke-opacity='0.06' stroke-width='1'/>
    </pattern>
  </defs>
  <rect width='720' height='1024' fill='url(#bg)'/>
  <rect width='720' height='1024' fill='url(#grid)'/>
  <rect x='24' y='24' width='672' height='976' rx='32' fill='none' stroke='${a}' stroke-width='10' stroke-opacity='0.1'/>
  <rect x='24' y='24' width='672' height='976' rx='32' fill='none' stroke='url(#trim)' stroke-width='5.5' stroke-opacity='0.8'/>
  <rect x='48' y='48' width='624' height='928' rx='28' fill='none' stroke='${a}' stroke-width='2.4' stroke-opacity='0.38'/>
  <path d='M84 124 H144 M84 124 V184 M636 124 H576 M636 124 V184 M84 900 H144 M84 900 V840 M636 900 H576 M636 900 V840' stroke='${a}' stroke-width='2.3' stroke-linecap='round' stroke-opacity='0.56' fill='none'/>
  <circle cx='360' cy='370' r='188' fill='url(#emblemGlow)'/>
  <g transform='translate(360 380)'>
    <circle r='150' fill='none' stroke='${a}' stroke-width='14' stroke-opacity='0.18'/>
    <circle r='104' fill='none' stroke='${p.mid}' stroke-width='4.4' stroke-opacity='0.34'/>
    <circle r='60' fill='none' stroke='${a}' stroke-width='2.8' stroke-opacity='0.55'/>
    <path d='M0-90 L16-24 L84 0 L16 24 L0 90 L-16 24 L-84 0 L-16 -24 Z' fill='${a}' fill-opacity='0.26'/>
    <circle r='16' fill='${a}' fill-opacity='0.78'/>
  </g>
  <text x='360' y='600' text-anchor='middle' font-family='system-ui,-apple-system,sans-serif' font-size='44' font-weight='600' fill='${p.deep}' opacity='0.96'>${escapeXml(item.title)}</text>
  <text x='360' y='660' text-anchor='middle' font-family='system-ui,-apple-system,sans-serif' font-size='24' fill='${p.mid}' opacity='0.78'>${escapeXml(item.subtitle)}</text>
  <path d='M152 712 H568' stroke='${a}' stroke-width='2.6' stroke-opacity='0.38'/>
  <g opacity='0.3'>
    <path d='M180 800 C260 770 460 770 540 800' stroke='${a}' stroke-width='2' fill='none'/>
    <path d='M220 830 C300 810 420 810 500 830' stroke='${a}' stroke-width='1.5' fill='none'/>
  </g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const makeProjectBack = (item: ProjectItem, seed: number) => {
  const p = item.palette;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${p.deep}'/>
      <stop offset='100%' stop-color='${p.mid}'/>
    </linearGradient>
    <linearGradient id='backTrim' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${p.line}' stop-opacity='0.9'/>
      <stop offset='50%' stop-color='${p.bright}' stop-opacity='0.82'/>
      <stop offset='100%' stop-color='${p.line}' stop-opacity='0.88'/>
    </linearGradient>
    <radialGradient id='coreGlow' cx='50%' cy='50%' r='40%'>
      <stop offset='0%' stop-color='${p.bright}' stop-opacity='0.28'/>
      <stop offset='100%' stop-color='${p.bright}' stop-opacity='0'/>
    </radialGradient>
    <pattern id='grid' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(${seed * 9})'>
      <path d='M14 0 V28 M0 14 H28' stroke='${p.line}' stroke-opacity='0.13' stroke-width='1'/>
    </pattern>
    <filter id='grain'>
      <feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer><feFuncA type='table' tableValues='0 0.02'/></feComponentTransfer>
    </filter>
  </defs>
  <rect width='720' height='1024' fill='url(#bg)'/>
  <rect width='720' height='1024' fill='url(#grid)'/>
  <circle cx='360' cy='512' r='256' fill='url(#coreGlow)'/>
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='${p.line}' stroke-width='10' stroke-opacity='0.28'/>
  <rect x='28' y='28' width='664' height='968' rx='28' fill='none' stroke='url(#backTrim)' stroke-width='6.5' stroke-opacity='0.8'/>
  <rect x='58' y='58' width='604' height='908' rx='24' fill='none' stroke='${p.bright}' stroke-width='3.1' stroke-opacity='0.54'/>
  <path d='M102 140 H162 M102 140 V200 M618 140 H558 M618 140 V200 M102 884 H162 M102 884 V824 M618 884 H558 M618 884 V824' stroke='${p.bright}' stroke-width='2.4' stroke-linecap='round' stroke-opacity='0.58' fill='none'/>
  <g transform='translate(360 512) rotate(${seed * 14})'>
    <circle r='176' fill='none' stroke='${p.bright}' stroke-width='14' stroke-opacity='0.28'/>
    <circle r='132' fill='none' stroke='${p.line}' stroke-width='5' stroke-opacity='0.62'/>
    <circle r='88' fill='none' stroke='${p.bright}' stroke-width='3.4' stroke-opacity='0.78'/>
    <path d='M0-120 L20-30 L110 0 L20 30 L0 120 L-20 30 L-110 0 L-20 -30 Z' fill='${p.line}' fill-opacity='0.42'/>
    <circle r='20' fill='${p.bright}' fill-opacity='0.82'/>
  </g>
  <g transform='translate(360 512)' opacity='0.38'>
    <path d='M-250 -320 C-180 -220 -140 -120 -110 -20 C-70 120 -120 230 -220 320' stroke='${p.line}' stroke-width='2' fill='none'/>
    <path d='M250 320 C180 220 140 120 110 20 C70 -120 120 -230 220 -320' stroke='${p.line}' stroke-width='2' fill='none'/>
  </g>
  <path d='M114 122 C228 96 492 96 606 122' stroke='${p.bright}' stroke-opacity='0.36' stroke-width='2.3' fill='none'/>
  <path d='M128 902 C246 926 474 926 592 902' stroke='${p.bright}' stroke-opacity='0.34' stroke-width='2.2' fill='none'/>
  <rect width='720' height='1024' filter='url(#grain)'/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/* ─────────────────────── utilities ─────────────────────── */

const buildDepthOrder = (count: number): number[] => {
  if (count <= 0) return [];
  const order = Array.from({ length: count }, (_, i) => i);
  let seed = count * 131 + 17;
  for (let i = order.length - 1; i > 0; i -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
const easeInOut = (v: number) =>
  v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
const phase = (p: number, s: number, e: number) =>
  clamp01((p - s) / (e - s));

/* ═══════════════════════ component ════════════════════════ */

const ProjectIntroSequence: React.FC<ProjectIntroSequenceProps> = ({
  progress,
  items,
  onCardSelect,
}) => {
  const { viewport, pointer, camera, gl } = useThree();
  const cardGroups = useRef<THREE.Group[]>([]);
  const deckRef = useRef<THREE.Group>(null);
  const flipValues = useRef<MotionValue<number>[]>([]);
  const clickableRef = useRef(false);

  const base = Math.min(viewport.width, viewport.height);
  const cardWidth = base * 0.165*1.2;
  const cardHeight = cardWidth * 1.46;
  const count = items.length;

  /* ── Build Card3D descriptors from project items ────── */
  const cards = useMemo<Card3DProps[]>(
    () =>
      items.map((item, i) => ({
        frontSrc: makeProjectFront(item, i + 1),
        backSrc: makeProjectBack(item, i + 1),
        borderColor: "#f8fafc",
        width: cardWidth,
        height: cardHeight,
      })),
    [items, cardHeight, cardWidth],
  );

  const depthOrder = useMemo(() => buildDepthOrder(count), [count]);

  if (flipValues.current.length !== count) {
    flipValues.current = Array.from({ length: count }, () => motionValue(0));
  }

  const shuffleProfiles = useMemo<ShuffleProfile[]>(
    () =>
      items.map((_, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        return {
          x: dir * (0.46 + i * 0.08),
          y: ((i % 3) - 1) * 0.2,
          lift: 0.12 + i * 0.014,
        };
      }),
    [items],
  );

  /* ── Click handler: project 3D → screen coords ─────── */
  const handleCardClick = (index: number) => {
    if (!clickableRef.current) return;
    const item = items[index];
    const group = cardGroups.current[index];
    if (!item || !group) return;

    const worldPos = new THREE.Vector3();
    group.getWorldPosition(worldPos);
    const projected = worldPos.clone().project(camera);
    const rect = gl.domElement.getBoundingClientRect();
    const screenX = rect.left + (projected.x * 0.5 + 0.5) * rect.width;
    const screenY = rect.top + (-projected.y * 0.5 + 0.5) * rect.height;
    onCardSelect?.(item, { x: screenX, y: screenY });
  };

  /* ── Per-frame animation ────────────────────────────── */
  useFrame((state) => {
    const deck = deckRef.current;
    if (!deck) return;
    const time = state.clock.getElapsedTime();
    const t = clamp01(progress.get());

    /*
     * Timeline phases (all driven by single progress 0–1):
     *
     *  0.00 – 0.30   Shuffle
     *  0.20 – 0.48   Spread into orbit ring  (remain face-down)
     *  0.42 – 0.58   Idle orbit
     *  0.54 – 0.68   Exit downward
     *  0.64 – 0.84   Deal into vertical column  (staggered per card)
     *  0.78 – 0.98   Flip reveal  back→front   (staggered per card)
     */

    const shuffleT = easeOut(phase(t, 0.0, 0.3));
    const spreadT = easeOut(phase(t, 0.2, 0.48));
    const orbitIdleT = easeOut(phase(t, 0.42, 0.58));
    const exitT = easeInOut(phase(t, 0.54, 0.68));
    const dealGlobalT = phase(t, 0.64, 0.84);
    const flipGlobalT = phase(t, 0.78, 0.98);
    const browseT = easeInOut(phase(t, 0.95, 1.0));

    const inDealMode = t > 0.64;
    clickableRef.current = t > 0.9;

    /* ── Deck-level mouse tracking ─────────────────────── */
    const tiltAmount = shuffleT * (1 - spreadT);
    const deckMouseFade = 1 - easeOut(phase(t, 0.56, 0.72));
    const mx = pointer.x;
    const my = pointer.y;
    const baseRotX = Math.PI * 0.24 * tiltAmount;
    const baseRotY = -Math.PI * 0.035 * tiltAmount;
    const subtleParallax = inDealMode ? 0.012 : 0;

    deck.rotation.x =
      (baseRotX + my * 0.03) * deckMouseFade + my * subtleParallax;
    deck.rotation.y =
      (baseRotY + mx * 0.05) * deckMouseFade + mx * subtleParallax;
    /* ── Browse pan: scroll through dealt card column ── */
    const cardSpacing = viewport.height * 0.56;
    const maxBrowseShift = (count - 1) * cardSpacing;
    const browseShift = browseT * maxBrowseShift;

    deck.position.x = mx * 0.16 * deckMouseFade;
    deck.position.y = my * 0.08 * deckMouseFade + browseShift;

    /* ── Ring / orbit params ───────────────────────────── */
    const ringRx = viewport.width * 0.24;
    const ringRy = viewport.height * 0.18;
    const orbitRot =
      (orbitIdleT * 0.3 + exitT * 0.48) * Math.PI * 2;

    for (let i = 0; i < count; i++) {
      const group = cardGroups.current[i];
      if (!group) continue;
      const stagger = count > 1 ? i / (count - 1) : 0;

      if (!inDealMode) {
        /* ═══ INTRO: shuffle → spread → orbit → exit ═══ */
        const prof = shuffleProfiles[i];
        const localShuffle = easeOut(
          clamp01((shuffleT - stagger * 0.44) / 0.56),
        );
        const arcLift = Math.sin(localShuffle * Math.PI);

        const baseZ = -i * 0.05;
        const tgtZ = -(depthOrder[i] ?? i) * 0.055;

        const shX = prof.x * arcLift;
        const shY = prof.y * arcLift;
        const shZ =
          THREE.MathUtils.lerp(baseZ, tgtZ, localShuffle) +
          prof.lift * arcLift;

        const baseAngle = (i / count) * Math.PI * 2;
        const angle = baseAngle + orbitRot;

        const rX = Math.sin(angle) * ringRx;
        const rY = Math.cos(angle) * ringRy + 0.05;
        const rZ = -0.06 + Math.sin(angle * 2) * 0.012;

        const spX = THREE.MathUtils.lerp(shX, rX, spreadT);
        const spY = THREE.MathUtils.lerp(shY, rY, spreadT);
        const spZ = THREE.MathUtils.lerp(shZ, rZ, spreadT);

        const exitDrop = viewport.height * 0.48 * exitT;
        const exitDrift = Math.sin(angle * 1.1) * 0.06 * exitT;
        const bobS = 0.01 + spreadT * 0.022;
        const bobY = Math.sin(time * 1.65 + i * 0.82) * bobS;
        const bobZ =
          Math.cos(time * 1.2 + i * 0.58) * bobS * 0.45;

        group.position.x = spX + exitDrift;
        group.position.y = spY - exitDrop + bobY;
        group.position.z = spZ - 0.16 * exitT + bobZ;

        group.rotation.x = 0;
        group.rotation.y = 0;
        group.rotation.z = angle * 0.1 * spreadT;

        // Keep cards face-down (back visible) throughout intro.
        flipValues.current[i].set(1);

        const sc = 1 + 0.1 * spreadT - 0.12 * exitT;
        group.scale.setScalar(sc);
      } else {
        /* ═══ DEAL MODE: deal from above → flip reveal ═══ */

        // Per-card staggered deal progress
        const cardDealDelay = stagger * 0.32;
        const localDealT = easeInOut(
          clamp01(
            (dealGlobalT - cardDealDelay) /
              Math.max(0.01, 1 - cardDealDelay * 0.55),
          ),
        );
        const settleDealT = easeOut(phase(dealGlobalT, 0.82, 1));

        // Entry from above viewport → column position
        // Each card gets its own viewport-height slot for scroll browsing
        const dealEntryY = viewport.height * 0.6;
        const dealTargetY = -i * cardSpacing;

        const curDealY = THREE.MathUtils.lerp(
          dealEntryY,
          dealTargetY,
          localDealT,
        );

        // Slight arc forward during descent
        const dealArc =
          Math.sin(localDealT * Math.PI) * 0.3;

        const stackDepth = -i * 0.008;
        group.position.x = 0;
        group.position.y = THREE.MathUtils.lerp(
          curDealY,
          dealTargetY,
          settleDealT,
        );
        group.position.z = THREE.MathUtils.lerp(
          dealArc,
          stackDepth,
          settleDealT,
        );

        // Rotate to opposite landscape side (+π/2 on Z) during deal flight
        const landscapeRot = Math.PI / 2 * localDealT;
        // Wobble rotation during flight, settles to landscape
        group.rotation.x = 0;
        const dealWobble =
          (1 - localDealT) * ((i % 2 === 0 ? -1 : 1) * 0.08);
        const flightRotZ = landscapeRot + dealWobble;
        group.rotation.z = THREE.MathUtils.lerp(
          flightRotZ,
          Math.PI / 2,
          settleDealT,
        );

        /* ── Flip reveal (hand-flip arc) ── */
        const cardFlipDelay = stagger * 0.35;
        const localFlipT = easeInOut(
          clamp01(
            (flipGlobalT - cardFlipDelay) /
              Math.max(0.01, 1 - cardFlipDelay * 0.45),
          ),
        );

        // Card lifts toward camera + lifts up during flip
        const flipArcZ =
          Math.sin(localFlipT * Math.PI) * 0.7;
        const flipArcY =
          Math.sin(localFlipT * Math.PI) * 0.12;
        group.position.z += flipArcZ;
        group.position.y += flipArcY;

        // flipValue 1→0 (back→front)
        flipValues.current[i].set(1 - localFlipT);

        // Gentle idle bob after fully dealt & flipped
        if (localDealT > 0.98 && localFlipT > 0.98) {
          group.position.y +=
            Math.sin(time * 1.1 + i * 1.3) * 0.01;
          group.position.z +=
            Math.cos(time * 0.9 + i * 0.7) * 0.005;
        }

        group.rotation.y = 0; // Card3D handles Y via flip

        // Scale up cards so they fill the viewport nicely in landscape
        const dealScale = THREE.MathUtils.lerp(1, 2.4, localDealT);
        group.scale.setScalar(dealScale);
      }
    }
  });

  /* ── Render ──────────────────────────────────────────── */
  return (
    <group ref={deckRef}>
      {cards.map((card, index) => (
        <group
          key={items[index]?.id ?? `card-${index}`}
          ref={(el) => {
            if (el) cardGroups.current[index] = el;
          }}
          position={[0, 0, -index * 0.05]}
        >
          <Card3D
            {...card}
            flip={flipValues.current[index]}
            onClick={() => handleCardClick(index)}
          />
        </group>
      ))}
    </group>
  );
};

export default ProjectIntroSequence;
