import React, { useMemo, useRef } from "react";
import { motionValue, MotionValue } from "framer-motion";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Card3D, { Card3DProps } from "./Card3D";
import ProjectCardPopoutPresets from "./ProjectCardPopoutPresets";
import { ProjectItem, resolveProjectCardFront } from "./projectData";
import { makeProjectFrontTexture } from "./projectFrontTexture";
import { ResolvedThemeMode } from "../theme/themeMode";

/* ───────────────────────── types ───────────────────────── */

interface ProjectIntroSequenceProps {
  progress: MotionValue<number>;
  items: ProjectItem[];
  onCardSelect?: (item: ProjectItem, screenPos: { x: number; y: number }) => void;
  lowPowerMode?: boolean;
  mobileViewport?: boolean;
  themeMode: ResolvedThemeMode;
}

type ShuffleProfile = { x: number; y: number; lift: number };
type OrientationMode = "landscape" | "portrait";
type LayoutMetrics = {
  width: number;
  height: number;
  cardSpacing: number;
  ringRx: number;
  ringRy: number;
  exitDropMax: number;
  dealEntryY: number;
  browseParallaxX: number;
  browseParallaxY: number;
  dealScaleMax: number;
  dealArcMax: number;
  stackDepthStep: number;
  flipArcZMax: number;
  flipArcYMax: number;
};

/* ───────────────────── texture helpers ─────────────────── */

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
const metricLerp = (from: number, to: number, alpha: number) =>
  THREE.MathUtils.lerp(from, to, alpha);

const getLatePhaseTiming = (count: number, mobileViewport: boolean) => {
  const extraCards = Math.max(0, count - 4);

  return {
    dealStart: 0.64,
    dealEnd: mobileViewport
      ? Math.min(0.91, 0.88 + extraCards * 0.025)
      : Math.min(0.92, 0.84 + extraCards * 0.03),
    flipStart: mobileViewport
      ? Math.max(0.7, 0.72 - extraCards * 0.01)
      : Math.max(0.74, 0.78 - extraCards * 0.01),
    flipEnd: mobileViewport
      ? Math.min(0.94, 0.86 + extraCards * 0.03)
      : 0.98,
    browseStart: mobileViewport
      ? Math.min(0.92, 0.86 + extraCards * 0.025)
      : Math.min(0.97, 0.95 + extraCards * 0.015),
    dealDelaySpan: Math.min(0.5, 0.32 + extraCards * 0.045),
    flipDelaySpan: Math.min(0.52, 0.35 + extraCards * 0.05),
  };
};

const createLayoutMetrics = (
  viewportWidth: number,
  viewportHeight: number,
  mobileViewport: boolean,
): LayoutMetrics => {
  return mobileViewport
    ? {
        width: viewportWidth,
        height: viewportHeight,
        cardSpacing: viewportHeight * 0.44,
        ringRx: viewportWidth * 0.17,
        ringRy: viewportHeight * 0.13,
        exitDropMax: viewportHeight * 0.34,
        dealEntryY: viewportHeight * 0.48,
        browseParallaxX: 0.07,
        browseParallaxY: 0.045,
        dealScaleMax: 2.08,
        dealArcMax: 0.2,
        stackDepthStep: 0.0085,
        flipArcZMax: 0.5,
        flipArcYMax: 0.06,
      }
    : {
        width: viewportWidth,
        height: viewportHeight,
        cardSpacing: viewportHeight * 0.56,
        ringRx: viewportWidth * 0.24,
        ringRy: viewportHeight * 0.18,
        exitDropMax: viewportHeight * 0.48,
        dealEntryY: viewportHeight * 0.6,
        browseParallaxX: 0.16,
        browseParallaxY: 0.08,
        dealScaleMax: 2.2,
        dealArcMax: 0.3,
        stackDepthStep: 0.008,
        flipArcZMax: 0.7,
        flipArcYMax: 0.12,
      };
};

/* ═══════════════════════ component ════════════════════════ */

const ProjectIntroSequence: React.FC<ProjectIntroSequenceProps> = ({
  progress,
  items,
  onCardSelect,
  lowPowerMode = false,
  mobileViewport = false,
  themeMode,
}) => {
  const { viewport, pointer, camera, gl } = useThree();
  const cardGroups = useRef<THREE.Group[]>([]);
  const deckRef = useRef<THREE.Group>(null);
  const flipValues = useRef<MotionValue<number>[]>([]);
  const edgeGlowValues = useRef<MotionValue<number>[]>([]);
  const popoutRevealValues = useRef<MotionValue<number>[]>([]);
  const layoutMetricsRef = useRef<LayoutMetrics>(
    createLayoutMetrics(viewport.width, viewport.height, mobileViewport),
  );
  const clickableRef = useRef(false);

  const frontSpecs = useMemo(
    () => items.map((item) => resolveProjectCardFront(item)),
    [items],
  );

  const base = Math.min(viewport.width, viewport.height);
  const cardWidth = base * (mobileViewport ? 0.228 : 0.198);
  const cardHeight = cardWidth * 1.46;
  const frontOrientation: OrientationMode = mobileViewport ? "portrait" : "landscape";
  const popoutAttachmentScale = THREE.MathUtils.clamp(
    cardWidth * 0.58,
    mobileViewport ? 0.34 : 0.42,
    mobileViewport ? 0.56 : 0.72,
  );
  const popoutWrapperRotationZ = mobileViewport ? 0 : -Math.PI / 2;
  const count = items.length;

  /* ── Build Card3D descriptors from project items ────── */
  const cards = useMemo<Card3DProps[]>(
    () =>
      items.map((item, i) => ({
        frontSrc: makeProjectFrontTexture(item, i + 1, frontOrientation, themeMode),
        backSrc: makeProjectBack(item, i + 1),
        borderColor: themeMode === "dark" ? "#172036" : "#f8fafc",
        edgeColor: item.accent,
        themeMode,
        width: cardWidth,
        height: cardHeight,
      })),
    [items, cardHeight, cardWidth, frontOrientation, themeMode],
  );

  const depthOrder = useMemo(() => buildDepthOrder(count), [count]);

  if (flipValues.current.length !== count) {
    flipValues.current = Array.from({ length: count }, () => motionValue(0));
  }
  if (edgeGlowValues.current.length !== count) {
    edgeGlowValues.current = Array.from({ length: count }, () => motionValue(0));
  }
  if (popoutRevealValues.current.length !== count) {
    popoutRevealValues.current = Array.from({ length: count }, () => motionValue(0));
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
  useFrame((state, delta) => {
    const deck = deckRef.current;
    if (!deck) return;
    const time = state.clock.getElapsedTime();
    const t = clamp01(progress.get());
    const targetMetrics = createLayoutMetrics(viewport.width, viewport.height, mobileViewport);
    const metrics = layoutMetricsRef.current;
    const metricAlpha = 1 - Math.exp(-Math.min(delta, 0.2) * 10);
    const latePhaseTiming = getLatePhaseTiming(count, mobileViewport);

    metrics.width = metricLerp(metrics.width, targetMetrics.width, metricAlpha);
    metrics.height = metricLerp(metrics.height, targetMetrics.height, metricAlpha);
    metrics.cardSpacing = metricLerp(metrics.cardSpacing, targetMetrics.cardSpacing, metricAlpha);
    metrics.ringRx = metricLerp(metrics.ringRx, targetMetrics.ringRx, metricAlpha);
    metrics.ringRy = metricLerp(metrics.ringRy, targetMetrics.ringRy, metricAlpha);
    metrics.exitDropMax = metricLerp(metrics.exitDropMax, targetMetrics.exitDropMax, metricAlpha);
    metrics.dealEntryY = metricLerp(metrics.dealEntryY, targetMetrics.dealEntryY, metricAlpha);
    metrics.browseParallaxX = metricLerp(metrics.browseParallaxX, targetMetrics.browseParallaxX, metricAlpha);
    metrics.browseParallaxY = metricLerp(metrics.browseParallaxY, targetMetrics.browseParallaxY, metricAlpha);
    metrics.dealScaleMax = metricLerp(metrics.dealScaleMax, targetMetrics.dealScaleMax, metricAlpha);
    metrics.dealArcMax = metricLerp(metrics.dealArcMax, targetMetrics.dealArcMax, metricAlpha);
    metrics.stackDepthStep = metricLerp(metrics.stackDepthStep, targetMetrics.stackDepthStep, metricAlpha);
    metrics.flipArcZMax = metricLerp(metrics.flipArcZMax, targetMetrics.flipArcZMax, metricAlpha);
    metrics.flipArcYMax = metricLerp(metrics.flipArcYMax, targetMetrics.flipArcYMax, metricAlpha);

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

    const shuffleT = easeOut(phase(t, 0.0, mobileViewport ? 0.3 : 0.26));
    const spreadT = easeOut(phase(t, 0.18, 0.36));
    const orbitIdleT = easeOut(phase(t, 0.32, 0.48));
    const exitT = easeInOut(phase(t, 0.44, 0.58));
    const dealGlobalT = phase(t, latePhaseTiming.dealStart, latePhaseTiming.dealEnd);
    const flipGlobalT = phase(t, latePhaseTiming.flipStart, latePhaseTiming.flipEnd);
    const browseT = easeInOut(phase(t, latePhaseTiming.browseStart, 1.0));
    const dealGlowIn = easeInOut(phase(t, 0.62, 0.78));
    const browseGlowFloor = 0.56 * easeInOut(phase(t, 0.88, 1.0));
    const dealGlowWindow = clamp01(Math.max(dealGlowIn, browseGlowFloor));

    const inDealMode = t > 0.64;
    clickableRef.current = t > (mobileViewport ? 0.95 : 0.9);

    /* ── Deck-level mouse tracking ─────────────────────── */
    const tiltAmount = shuffleT * (1 - spreadT);
    const deckMouseFade = 1 - easeOut(phase(t, 0.56, 0.72));
    const mx = pointer.x;
    const my = pointer.y;
    const baseRotX = Math.PI * 0.24 * tiltAmount;
    const baseRotY = -Math.PI * 0.035 * tiltAmount;
    const subtleParallax = inDealMode ? (mobileViewport ? 0.008 : 0.012) : 0;

    deck.rotation.x =
      (baseRotX + my * 0.03) * deckMouseFade + my * subtleParallax;
    deck.rotation.y =
      (baseRotY + mx * 0.05) * deckMouseFade + mx * subtleParallax;
    /* ── Browse pan: scroll through dealt card column ── */
    const cardSpacing = metrics.cardSpacing;
    const maxBrowseShift = (count - 1) * cardSpacing;
    const browseShift = browseT * maxBrowseShift;

    deck.position.x = mx * metrics.browseParallaxX * deckMouseFade;
    deck.position.y = my * metrics.browseParallaxY * deckMouseFade + browseShift;

    /* ── Ring / orbit params ───────────────────────────── */
    const ringRx = metrics.ringRx;
    const ringRy = metrics.ringRy;
    const orbitRot =
      (orbitIdleT * 0.3 + exitT * 0.48) * Math.PI * 2;

    for (let i = 0; i < count; i++) {
      const group = cardGroups.current[i];
      if (!group) continue;
      const stagger = count > 1 ? i / (count - 1) : 0;
      edgeGlowValues.current[i].set(dealGlowWindow);

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

        const exitDrop = metrics.exitDropMax * exitT;
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
        group.rotation.z = angle * (mobileViewport ? 0.08 : 0.1) * spreadT;

        // Keep cards face-down (back visible) throughout intro.
        flipValues.current[i].set(1);
        popoutRevealValues.current[i].set(0);

        const sc = 1 + 0.1 * spreadT - 0.12 * exitT;
        group.scale.setScalar(sc);
      } else {
        /* ═══ DEAL MODE: deal from above → flip reveal ═══ */

        // Per-card staggered deal progress
        const cardDealDelay = stagger * latePhaseTiming.dealDelaySpan;
        const localDealT = easeInOut(
          clamp01(
            (dealGlobalT - cardDealDelay) /
              Math.max(0.01, 1 - cardDealDelay * 0.55),
          ),
        );
        const settleDealT = easeOut(phase(dealGlobalT, 0.82, 1));

        // Entry from above viewport → column position
        // Each card gets its own viewport-height slot for scroll browsing
        const dealEntryY = metrics.dealEntryY;
        const dealTargetY = -i * cardSpacing;

        const curDealY = THREE.MathUtils.lerp(
          dealEntryY,
          dealTargetY,
          localDealT,
        );

        // Slight arc forward during descent
        const dealArc =
          Math.sin(localDealT * Math.PI) * metrics.dealArcMax;

        const stackDepth = -i * metrics.stackDepthStep;
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

        const dealTargetRotation = mobileViewport ? 0 : Math.PI / 2;
        const landscapeRot = dealTargetRotation * localDealT;
        // Wobble rotation during flight, settles to target orientation.
        group.rotation.x = 0;
        const dealWobble =
          (1 - localDealT) * ((i % 2 === 0 ? -1 : 1) * 0.08);
        const flightRotZ = landscapeRot + dealWobble;
        group.rotation.z = THREE.MathUtils.lerp(
          flightRotZ,
          dealTargetRotation,
          settleDealT,
        );

        /* ── Flip reveal (hand-flip arc) ── */
        const cardFlipDelay = stagger * latePhaseTiming.flipDelaySpan;
        const localFlipT = easeInOut(
          clamp01(
            (flipGlobalT - cardFlipDelay) /
              Math.max(0.01, 1 - cardFlipDelay * 0.45),
          ),
        );

        // Card lifts toward camera + lifts up during flip
        const flipArcZ =
          Math.sin(localFlipT * Math.PI) * metrics.flipArcZMax;
        const flipArcY =
          Math.sin(localFlipT * Math.PI) * metrics.flipArcYMax;
        group.position.z += flipArcZ;
        group.position.y += flipArcY;

        // flipValue 1→0 (back→front)
        flipValues.current[i].set(1 - localFlipT);
        const popoutReveal = clamp01((localFlipT - 0.08) / 0.92);
        popoutRevealValues.current[i].set(popoutReveal);

        // Gentle idle bob after fully dealt & flipped
        if (localDealT > 0.98 && localFlipT > 0.98) {
          group.position.y +=
            Math.sin(time * 1.1 + i * 1.3) * 0.01;
          group.position.z +=
            Math.cos(time * 0.9 + i * 0.7) * 0.005;
        }

        group.rotation.y = 0; // Card3D handles Y via flip

        // Scale up cards so they fill the viewport in the active orientation.
        const dealScale = THREE.MathUtils.lerp(1, metrics.dealScaleMax, localDealT);
        group.scale.setScalar(dealScale);
      }
    }
  });

  /* ── Render ──────────────────────────────────────────── */
  return (
    <group ref={deckRef}>
      {cards.map((card, index) => {
        const item = items[index];
        const frontSpec = frontSpecs[index];
        return (
          <group
            key={item?.id ?? `card-${index}`}
            ref={(el) => {
              if (el) cardGroups.current[index] = el;
            }}
            position={[0, 0, -index * 0.05]}
          >
            <Card3D
              {...card}
              flip={flipValues.current[index]}
              edgeGlow={edgeGlowValues.current[index]}
              frontAttachment={
                !lowPowerMode && item && frontSpec ? (
                  <group rotation={[0, 0, popoutWrapperRotationZ]} scale={popoutAttachmentScale}>
                    <ProjectCardPopoutPresets
                      preset={frontSpec.popoutPreset}
                      accent={item.accent}
                      palette={item.palette}
                      reveal={popoutRevealValues.current[index]}
                      intensity={frontSpec.popoutIntensity * 0.84}
                    />
                  </group>
                ) : undefined
              }
              isClickable={() => clickableRef.current}
              onClick={() => handleCardClick(index)}
            />
          </group>
        );
      })}
    </group>
  );
};

export default ProjectIntroSequence;
