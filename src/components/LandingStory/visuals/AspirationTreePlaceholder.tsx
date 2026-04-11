import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, MotionValue, useAnimationFrame, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  LandingAspirationEdge,
  LandingAspirationNode,
  LandingAspirationOverlayBeat,
  LandingAspirationOverlayBeatId,
} from "../../../content";
import { ResolvedThemeMode } from "../../theme/themeMode";
import { useLandingStoryRuntime, useSectionActivity } from "../runtime/LandingStoryRuntime";
import {
  aspirationThreadStyles,
  buildThreadPath,
  computeAspirationLayout,
  LayoutEdge,
  LayoutNode,
  Point,
  ROOT_POINT,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
} from "./aspiration/aspirationLayout";

interface AspirationTreePlaceholderProps {
  nodes: LandingAspirationNode[];
  edges: LandingAspirationEdge[];
  overlayBeats: LandingAspirationOverlayBeat[];
  themeMode: ResolvedThemeMode;
}

const ARTBOARD_HEIGHT_MULTIPLIER = 2.08;
const TIMELINE_SCALE = 1.3;

const TIMELINE_VIEWPORT_LENGTHS = {
  intro: 0.74 * TIMELINE_SCALE,
  stageOne: 1.02 * TIMELINE_SCALE,
  stageTwo: 1.18 * TIMELINE_SCALE,
  stageThree: 1.04 * TIMELINE_SCALE,
  stageFour: 1.16 * TIMELINE_SCALE,
  leaf: 1.06 * TIMELINE_SCALE,
} as const;

type TimelineKey = keyof typeof TIMELINE_VIEWPORT_LENGTHS;
type SceneNodeId = LandingAspirationNode["id"] | "aspiration-root";

interface TimelineSegment {
  end: number;
  length: number;
  mid: number;
  start: number;
}

interface StageBounds {
  centerY: number;
  maxY: number;
  minY: number;
}

interface StickyViewportMetrics {
  height: number;
  width: number;
}

interface LocalLabelGeometry {
  height: number;
  left: number;
  lineEndX: number;
  lineEndY: number;
  top: number;
  width: number;
}

interface RuntimeNodeState {
  damping: number;
  floatAmpX: number;
  floatAmpY: number;
  floatFreqX: number;
  floatFreqY: number;
  hoverEnergy: number;
  hoverRadius: number;
  offsetX: number;
  offsetY: number;
  phase: number;
  spring: number;
  velocityX: number;
  velocityY: number;
}

interface RuntimeEdgeState {
  bundleSpread: number;
  phase: number;
  pointerEnergy: number;
  pluckDecay: number;
  pluckDirection: number;
  pluckEnergy: number;
  pluckFrequency: number;
  pluckTime: number;
  speed: number;
  waveAmpPrimary: number;
  waveAmpSecondary: number;
}

interface RuntimeLeafState {
  phase: number;
  swayAmpX: number;
  swayAmpY: number;
  swayFreqX: number;
  swayFreqY: number;
}

interface RuntimeThreadState {
  drift: number;
  normalBias: number;
  phase: number;
  pointerInfluence: number;
  speed: number;
  waveAmpPrimary: number;
  waveAmpSecondary: number;
}

interface PointerState {
  active: boolean;
  inside: boolean;
  lastSvgX: number;
  lastSvgY: number;
  pointerType: string | null;
  targetNodeId: SceneNodeId | null;
  velocityX: number;
  velocityY: number;
  svgX: number;
  svgY: number;
}

interface OverlaySpec {
  id: LandingAspirationOverlayBeatId;
  maxWidth: number;
  opacity: MotionValue<number>;
  text: string;
  x: number;
  y: number;
}

interface DynamicCurve {
  c1: Point;
  c2: Point;
  d: string;
}

const timelineEntries = Object.entries(TIMELINE_VIEWPORT_LENGTHS) as Array<[TimelineKey, number]>;

const RUNWAY_VIEWPORTS = timelineEntries.reduce((sum, [, length]) => sum + length, 0);
const SECTION_VIEWPORTS = RUNWAY_VIEWPORTS + 1;

const TIMELINE = (() => {
  let cursor = 0;
  return timelineEntries.reduce(
    (segments, [key, length]) => {
      const start = cursor;
      const end = start + length;
      segments[key] = {
        end,
        length,
        mid: start + length / 2,
        start,
      };
      cursor = end;
      return segments;
    },
    {} as Record<TimelineKey, TimelineSegment>,
  );
})();

const NODE_COLORS: Record<SceneNodeId, string> = {
  "aging-biology": "#f472b6",
  "ai-research": "#c084fc",
  "aspiration-root": "#7dd3fc",
  "brain-computer-interface": "#38bdf8",
  "computational-neuroscience": "#34d399",
  "computer-science-major": "#818cf8",
  "entrepreneurship": "#fb7185",
  "graduation-2027": "#fbbf24",
  "life-science-major": "#67e8f9",
  "longevity": "#4ade80",
  "science-student-association": "#2dd4bf",
};

const NODE_GLOW_FILTER_ID = "aspiration-node-glow";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const averagePoint = (points: Point[]): Point => {
  if (points.length === 0) {
    return { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 };
  }

  const totals = points.reduce(
    (sum, point) => ({
      x: sum.x + point.x,
      y: sum.y + point.y,
    }),
    { x: 0, y: 0 },
  );

  return {
    x: totals.x / points.length,
    y: totals.y / points.length,
  };
};

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33 + value.charCodeAt(index)) >>> 0;
  }
  return hash >>> 0;
};

const seededUnit = (seed: number, salt: number) => {
  const value = Math.sin((seed + salt) * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const hexToRgb = (value: string) => {
  const normalized = value.replace("#", "");
  const safe = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;

  const parsed = Number.parseInt(safe, 16);
  return {
    b: parsed & 255,
    g: (parsed >> 8) & 255,
    r: (parsed >> 16) & 255,
  };
};

const rgba = (value: string, alpha: number) => {
  const { r, g, b } = hexToRgb(value);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const lerp = (from: number, to: number, alpha: number) => from + (to - from) * alpha;

const cubicPointAt = (from: Point, c1: Point, c2: Point, to: Point, progress: number): Point => {
  const inverse = 1 - progress;
  const x =
    inverse ** 3 * from.x +
    3 * inverse * inverse * progress * c1.x +
    3 * inverse * progress * progress * c2.x +
    progress ** 3 * to.x;
  const y =
    inverse ** 3 * from.y +
    3 * inverse * inverse * progress * c1.y +
    3 * inverse * progress * progress * c2.y +
    progress ** 3 * to.y;

  return { x, y };
};

const distanceToCurve = (pointer: Point, curve: DynamicCurve, from: Point, to: Point) => {
  let minimum = Number.POSITIVE_INFINITY;

  for (let sampleIndex = 0; sampleIndex <= 16; sampleIndex += 1) {
    const point = cubicPointAt(from, curve.c1, curve.c2, to, sampleIndex / 16);
    minimum = Math.min(minimum, Math.hypot(pointer.x - point.x, pointer.y - point.y));
  }

  return minimum;
};

const wrapLabel = (label: string) => {
  const words = label.split(" ").filter(Boolean);
  if (words.length <= 2) {
    return [label];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
};

const wrapOverlayText = (text: string, maxCharsPerLine: number) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

const createBounds = (values: number[], padTop = 0, padBottom = 0): StageBounds => {
  const safeValues = values.length > 0 ? values : [VIEWBOX_HEIGHT / 2];
  const minY = Math.min(...safeValues) - padTop;
  const maxY = Math.max(...safeValues) + padBottom;

  return {
    centerY: (minY + maxY) / 2,
    maxY,
    minY,
  };
};

const edgeYValues = (edge: LayoutEdge) => [edge.fromPoint.y, edge.toPoint.y];

const nodeYValues = (node: LayoutNode) => [
  node.point.y,
  node.labelBox.top - 18,
  node.labelBox.top + node.labelBox.height + 18,
];

const getNodeColor = (id: SceneNodeId) => NODE_COLORS[id] ?? "#7dd3fc";

const getEdgeColor = (edge: LayoutEdge): string => {
  if (edge.to in NODE_COLORS) {
    return getNodeColor(edge.to as SceneNodeId);
  }

  if (edge.from in NODE_COLORS) {
    return getNodeColor(edge.from as SceneNodeId);
  }

  return "#7dd3fc";
};

const toLocalLabelGeometry = (node: LayoutNode): LocalLabelGeometry => ({
  height: node.labelBox.height,
  left: node.labelBox.left - node.point.x,
  lineEndX: node.labelBox.lineEndX - node.point.x,
  lineEndY: node.labelBox.lineEndY - node.point.y,
  top: node.labelBox.top - node.point.y,
  width: node.labelBox.width,
});

const getNodeRadii = (stage: number) => ({
  core: stage === 3 ? 12.6 : stage === 4 ? 10.8 : stage === 0 ? 11.4 : 9.6,
  glow: stage === 3 ? 17.5 : stage === 4 ? 15.5 : stage === 0 ? 16.5 : 14.2,
});

const createNodeRuntimeState = (id: string, stage: number): RuntimeNodeState => {
  const seed = hashString(id);
  return {
    damping: lerp(9.4, 11.8, seededUnit(seed, 2)),
    floatAmpX: stage === 0 ? 4.5 : stage === 3 ? 8.5 : stage === 4 ? 7.4 : 6.2,
    floatAmpY: stage === 0 ? 6.2 : stage === 3 ? 11.5 : stage === 4 ? 9.4 : 8.3,
    floatFreqX: lerp(0.45, 0.72, seededUnit(seed, 3)),
    floatFreqY: lerp(0.54, 0.84, seededUnit(seed, 4)),
    hoverEnergy: 0,
    hoverRadius: stage === 3 ? 170 : stage === 4 ? 150 : 132,
    offsetX: 0,
    offsetY: 0,
    phase: seededUnit(seed, 5) * Math.PI * 2,
    spring: lerp(18, 24, seededUnit(seed, 6)),
    velocityX: 0,
    velocityY: 0,
  };
};

const createEdgeRuntimeState = (id: string, weight: LayoutEdge["weight"]): RuntimeEdgeState => {
  const seed = hashString(id);
  const baseAmplitude = weight === "trunk" ? 15 : weight === "branch" ? 11 : 7.5;

  return {
    bundleSpread: lerp(1.2, 2.6, seededUnit(seed, 12)),
    phase: seededUnit(seed, 8) * Math.PI * 2,
    pointerEnergy: 0,
    pluckDecay: lerp(2.8, 4.4, seededUnit(seed, 13)),
    pluckDirection: seededUnit(seed, 14) > 0.5 ? 1 : -1,
    pluckEnergy: 0,
    pluckFrequency: lerp(1.9, 3.2, seededUnit(seed, 15)),
    pluckTime: 0,
    speed: lerp(0.34, 0.62, seededUnit(seed, 9)),
    waveAmpPrimary: baseAmplitude * lerp(0.72, 1.08, seededUnit(seed, 10)),
    waveAmpSecondary: baseAmplitude * lerp(0.38, 0.78, seededUnit(seed, 11)),
  };
};

const createLeafRuntimeState = (id: string): RuntimeLeafState => {
  const seed = hashString(id);
  return {
    phase: seededUnit(seed, 20) * Math.PI * 2,
    swayAmpX: lerp(10, 18, seededUnit(seed, 21)),
    swayAmpY: lerp(16, 28, seededUnit(seed, 22)),
    swayFreqX: lerp(0.26, 0.42, seededUnit(seed, 23)),
    swayFreqY: lerp(0.36, 0.58, seededUnit(seed, 24)),
  };
};

const createThreadRuntimeState = (
  edgeId: string,
  threadIndex: number,
  weight: LayoutEdge["weight"],
): RuntimeThreadState => {
  const seed = hashString(`${edgeId}:${threadIndex}`);
  const baseAmplitude = weight === "trunk" ? 9.2 : weight === "branch" ? 7.1 : 4.9;

  return {
    drift: lerp(-3.6, 3.6, seededUnit(seed, 30)),
    normalBias: lerp(-2.8, 2.8, seededUnit(seed, 31)),
    phase: seededUnit(seed, 32) * Math.PI * 2,
    pointerInfluence: lerp(0.9, 1.45, seededUnit(seed, 33)),
    speed: lerp(0.34, 0.92, seededUnit(seed, 34)),
    waveAmpPrimary: baseAmplitude * lerp(0.88, 1.36, seededUnit(seed, 35)),
    waveAmpSecondary: baseAmplitude * lerp(0.54, 1.04, seededUnit(seed, 36)),
  };
};

const buildDynamicCurve = (
  from: Point,
  to: Point,
  edge: LayoutEdge,
  state: RuntimeEdgeState,
  timeSeconds: number,
  pointer: PointerState,
): DynamicCurve => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const tangentX = dx / distance;
  const tangentY = dy / distance;
  const normalX = -tangentY;
  const normalY = tangentX;
  const wavePrimary = Math.sin(timeSeconds * state.speed + state.phase);
  const waveSecondary = Math.cos(timeSeconds * (state.speed * 0.82) + state.phase * 1.2);
  const wavePrimaryOffset = wavePrimary * state.waveAmpPrimary;
  const waveSecondaryOffset = waveSecondary * state.waveAmpSecondary;
  const pluckAge = Math.max(0, timeSeconds - state.pluckTime);
  const pluckOscillation = Math.sin(pluckAge * state.pluckFrequency * Math.PI * 2) * state.pluckDirection;
  const pluckOffset =
    pluckOscillation *
    state.pluckEnergy *
    (edge.weight === "trunk" ? 42 : edge.weight === "branch" ? 30 : 20);
  const pointerPull = state.pointerEnergy * (edge.weight === "trunk" ? 18 : edge.weight === "branch" ? 14 : 10);
  const midX = from.x + dx * 0.5;
  const midY = from.y + dy * 0.5;
  const pointerPullX = pointer.inside ? (pointer.svgX - midX) * 0.18 * state.pointerEnergy : 0;
  const pointerPullY = pointer.inside ? (pointer.svgY - midY) * 0.12 * state.pointerEnergy : 0;
  const c1: Point = {
    x: from.x + dx * 0.24 + normalX * (wavePrimaryOffset + pluckOffset * 0.7 + pointerPull * 0.45) + pointerPullX * 0.42,
    y: from.y + dy * 0.22 + normalY * (waveSecondaryOffset + pluckOffset * 0.42 + pointerPull * 0.2) + pointerPullY * 0.35,
  };
  const c2: Point = {
    x: from.x + dx * 0.76 - normalX * (waveSecondaryOffset - pluckOffset * 0.62 + pointerPull * 0.3) + pointerPullX * 0.58,
    y: from.y + dy * 0.78 - normalY * (wavePrimaryOffset - pluckOffset * 0.34 + pointerPull * 0.12) + pointerPullY * 0.65,
  };

  return {
    c1,
    c2,
    d: `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`,
  };
};

const buildThreadCurve = (
  from: Point,
  to: Point,
  base: DynamicCurve,
  edge: LayoutEdge,
  edgeState: RuntimeEdgeState,
  threadState: RuntimeThreadState,
  timeSeconds: number,
  pointer: PointerState,
  threadIndex: number,
  bundleCount: number,
): DynamicCurve => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const tangentX = dx / distance;
  const tangentY = dy / distance;
  const normalX = -tangentY;
  const normalY = tangentX;
  const centerOffset = threadIndex - (bundleCount - 1) / 2;
  const curvature = edge.weight === "trunk" ? 13.2 : edge.weight === "branch" ? 9.4 : 5.8;
  const spread = centerOffset * (curvature + edgeState.bundleSpread) + threadState.normalBias;
  const threadWave =
    Math.sin(timeSeconds * threadState.speed + threadState.phase + centerOffset * 0.42) *
    (threadState.waveAmpPrimary + edgeState.pointerEnergy * 3.4);
  const fineWave =
    Math.cos(timeSeconds * (threadState.speed * 1.34) + threadState.phase * 1.18 + threadIndex * 0.64) *
    (threadState.waveAmpSecondary + edgeState.pointerEnergy * 1.9);
  const midX = from.x + dx * 0.5;
  const midY = from.y + dy * 0.5;
  const pointerShiftX = pointer.inside ? (pointer.svgX - midX) * 0.024 * edgeState.pointerEnergy * threadState.pointerInfluence : 0;
  const pointerShiftY = pointer.inside ? (pointer.svgY - midY) * 0.018 * edgeState.pointerEnergy * threadState.pointerInfluence : 0;
  const pluckAge = Math.max(0, timeSeconds - edgeState.pluckTime);
  const pluckWave =
    Math.sin(pluckAge * (edgeState.pluckFrequency + threadState.speed * 0.32) * Math.PI * 2 + threadState.phase) *
    edgeState.pluckEnergy *
    threadState.pointerInfluence *
    (edge.weight === "trunk" ? 22 : edge.weight === "branch" ? 16 : 10);
  const shimmerWave =
    Math.cos(pluckAge * (edgeState.pluckFrequency * 1.38) * Math.PI * 2 + threadIndex * 0.8) *
    edgeState.pluckEnergy *
    (3.2 + Math.abs(centerOffset) * 1.4);

  const c1: Point = {
    x:
      base.c1.x +
      normalX * (spread + threadWave + pluckWave * 0.82) +
      tangentX * (fineWave * 0.65 + shimmerWave * 0.48 + threadState.drift) +
      pointerShiftX,
    y:
      base.c1.y +
      normalY * (spread * 0.46 + fineWave * 1.42 + pluckWave * 0.36) +
      tangentY * (threadWave * 0.18 + shimmerWave * 0.08) +
      pointerShiftY * 0.28,
  };
  const c2: Point = {
    x:
      base.c2.x +
      normalX * (spread - fineWave - pluckWave * 0.7) -
      tangentX * (threadWave * 0.52 - shimmerWave * 0.42 - threadState.drift) +
      pointerShiftX * 0.72,
    y:
      base.c2.y +
      normalY * (spread * 0.58 - threadWave * 1.02 - pluckWave * 0.3) -
      tangentY * (fineWave * 0.16 - shimmerWave * 0.06) +
      pointerShiftY * 0.38,
  };

  return {
    c1,
    c2,
    d: `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`,
  };
};

const RootAnchor: React.FC<{
  color: string;
  groupRef: (element: SVGGElement | null) => void;
  opacity: MotionValue<number>;
}> = ({ color, groupRef, opacity }) => {
  const radii = getNodeRadii(0);

  return (
    <motion.g style={{ opacity }} transform={`translate(${ROOT_POINT.x} ${ROOT_POINT.y})`}>
      <g ref={groupRef}>
        <circle cx="0" cy="0" fill={rgba(color, 0.4)} filter={`url(#${NODE_GLOW_FILTER_ID})`} r={radii.core + radii.glow} />
        <circle cx="0" cy="0" fill={color} r={radii.core} stroke={rgba(color, 0.9)} strokeWidth="1.8" />
      </g>
    </motion.g>
  );
};

const NodeGlyph: React.FC<{
  color: string;
  groupRef: (element: SVGGElement | null) => void;
  node: LayoutNode;
  reveal: MotionValue<number>;
}> = ({ color, groupRef, node, reveal }) => {
  const radii = getNodeRadii(node.stage);

  return (
    <motion.g style={{ opacity: reveal }} transform={`translate(${node.point.x} ${node.point.y})`}>
      <g ref={groupRef}>
        <circle cx="0" cy="0" fill={rgba(color, 0.38)} filter={`url(#${NODE_GLOW_FILTER_ID})`} r={radii.core + radii.glow} />
        <circle cx="0" cy="0" fill={color} r={radii.core} stroke={rgba(color, 0.88)} strokeWidth="1.7" />
      </g>
    </motion.g>
  );
};

const NodeLabel: React.FC<{
  color: string;
  groupRef: (element: SVGGElement | null) => void;
  isDark: boolean;
  node: LayoutNode;
  reveal: MotionValue<number>;
}> = ({ color, groupRef, isDark, node, reveal }) => {
  const localLabel = toLocalLabelGeometry(node);
  const lines = wrapLabel(node.label);
  const labelAnchorX = localLabel.left + localLabel.width / 2;
  const textCenterY = localLabel.top + localLabel.height / 2;
  const lineGap = 22.4;
  const firstLineY = textCenterY - ((lines.length - 1) * lineGap) / 2;
  const labelFill = isDark ? "rgba(255,255,255,0.98)" : "rgba(0,0,0,0.94)";
  const labelFilter = isDark
    ? `drop-shadow(0 0 12px ${rgba(color, 0.5)}) drop-shadow(0 0 24px ${rgba(color, 0.28)})`
    : "drop-shadow(0 4px 12px rgba(15,23,42,0.24))";

  return (
    <motion.g style={{ opacity: reveal }} transform={`translate(${node.point.x} ${node.point.y})`}>
      <g ref={groupRef}>
        <line
          stroke={rgba(color, 0.5)}
          strokeLinecap="round"
          strokeWidth="1.5"
          x1="0"
          x2={labelAnchorX}
          y1="0"
          y2={textCenterY}
        />
        <text
          fill={labelFill}
          fontSize={lines.length > 1 ? "20.4" : "21.6"}
          fontWeight="650"
          letterSpacing="-0.24"
          style={{ filter: labelFilter }}
          textAnchor="middle"
          x={labelAnchorX}
          y={firstLineY}
        >
          {lines.map((line, index) => (
            <tspan dy={index === 0 ? 0 : lineGap} key={`${node.id}-line-${index}`} x={labelAnchorX}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    </motion.g>
  );
};

const EdgeBundle: React.FC<{
  color: string;
  edge: LayoutEdge;
  reveal: MotionValue<number>;
  threadRef: (threadIndex: number, element: SVGPathElement | null) => void;
}> = ({ color, edge, reveal, threadRef }) => {
  const bundleCount = aspirationThreadStyles.getBundleCount(edge.weight, edge.faded);

  return (
    <g>
      {Array.from({ length: bundleCount }, (_, threadIndex) => (
        <motion.path
          d={buildThreadPath(edge.fromPoint, edge.toPoint, threadIndex, bundleCount, 0)}
          fill="none"
          key={`${edge.id}-thread-${threadIndex}`}
          pathLength={1}
          ref={(element) => threadRef(threadIndex, element)}
          stroke={rgba(color, edge.faded ? 0.44 : 0.94)}
          strokeLinecap="round"
          strokeWidth={aspirationThreadStyles.getThreadWidth(edge.weight, edge.faded)}
          style={{ pathLength: reveal }}
        />
      ))}
    </g>
  );
};

const OverlayBeatText: React.FC<OverlaySpec & { isDark: boolean }> = ({ id, maxWidth, opacity, text, x, y, isDark }) => {
  const maxChars = id === "between-root-and-majors" ? 38 : id === "stage-two-experiences" ? 34 : 28;
  const lines = wrapOverlayText(text, maxChars);
  const fontSize = id === "root" ? 44 : id === "graduation" ? 36 : 31;
  const lineHeight = id === "root" ? 47 : 39;
  const firstLineY = y - ((lines.length - 1) * lineHeight) / 2;
  const fill = isDark ? "rgba(248,250,252,0.96)" : "rgba(0,0,0,0.96)";
  const filter = isDark
    ? "drop-shadow(0 0 18px rgba(34,211,238,0.16))"
    : "drop-shadow(0 10px 22px rgba(148,163,184,0.22))";

  return (
    <motion.g style={{ opacity }}>
      <text
        fill={fill}
        fontSize={fontSize}
        fontWeight={id === "root" ? "700" : "560"}
        letterSpacing={id === "root" ? "-0.8" : "-0.45"}
        style={{ filter }}
        textAnchor="middle"
        x={x}
        y={firstLineY}
      >
        {lines.map((line, index) => (
          <tspan dy={index === 0 ? 0 : lineHeight} key={`${id}-line-${index}`} x={x}>
            {line}
          </tspan>
        ))}
      </text>
      <rect
        fill="none"
        height={Math.max(52, lines.length * lineHeight + 18)}
        opacity="0"
        rx="20"
        width={maxWidth}
        x={x - maxWidth / 2}
        y={y - Math.max(52, lines.length * lineHeight + 18) / 2}
      />
    </motion.g>
  );
};

const AspirationTreePlaceholder: React.FC<AspirationTreePlaceholderProps> = ({
  nodes,
  edges,
  overlayBeats,
  themeMode,
}) => {
  const { sectionRef, qualityTier } = useSectionActivity<HTMLDivElement>({
    nearAmount: 0.08,
    nearMargin: "28% 0px 28% 0px",
    primaryAmount: 0.38,
    primaryMargin: "-14% 0px -14% 0px",
  });
  const { scrollContainerRef } = useLandingStoryRuntime();
  const prefersReducedMotion = Boolean(useReducedMotion()) || qualityTier === "static";
  const isDarkTheme = themeMode === "dark";
  const stickyViewportRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [stickyViewport, setStickyViewport] = useState<StickyViewportMetrics>({ height: 0, width: 0 });
  const rootGroupRef = useRef<SVGGElement | null>(null);
  const labelRefs = useRef<Record<string, SVGGElement | null>>({});
  const nodeRefs = useRef<Record<string, SVGGElement | null>>({});
  const edgeThreadRefs = useRef<Record<string, Array<SVGPathElement | null>>>({});
  const pointerStateRef = useRef<PointerState>({
    active: false,
    inside: false,
    lastSvgX: ROOT_POINT.x,
    lastSvgY: ROOT_POINT.y,
    pointerType: null,
    targetNodeId: null,
    velocityX: 0,
    velocityY: 0,
    svgX: ROOT_POINT.x,
    svgY: ROOT_POINT.y,
  });
  const currentNodePointsRef = useRef<Record<SceneNodeId, Point>>({
    "aspiration-root": ROOT_POINT,
  });
  const nodeRuntimeRef = useRef<Record<SceneNodeId, RuntimeNodeState>>({
    "aspiration-root": createNodeRuntimeState("aspiration-root", 0),
  });
  const edgeRuntimeRef = useRef<Record<string, RuntimeEdgeState>>({});
  const leafRuntimeRef = useRef<Record<string, RuntimeLeafState>>({});
  const threadRuntimeRef = useRef<Record<string, RuntimeThreadState[]>>({});

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progressUnits = useTransform(scrollYProgress, [0, 1], [0, RUNWAY_VIEWPORTS]);

  const baseLayout = useMemo(() => computeAspirationLayout(nodes, edges, 1), [edges, nodes]);

  const horizontalLayoutScale = useMemo(() => {
    if (stickyViewport.width <= 0 || stickyViewport.height <= 0) {
      return 1;
    }

    const artboardWidth = stickyViewport.height * ARTBOARD_HEIGHT_MULTIPLIER * (VIEWBOX_WIDTH / VIEWBOX_HEIGHT);
    if (artboardWidth <= 0) {
      return 1;
    }

    const visiblePixelWidth = Math.max(stickyViewport.width - 32, 0);
    const visibleViewboxWidth = VIEWBOX_WIDTH * Math.min(1, visiblePixelWidth / artboardWidth);
    const baseNodes = [
      ...baseLayout.nodesByStage[1],
      ...baseLayout.nodesByStage[2],
      ...baseLayout.nodesByStage[3],
      ...baseLayout.nodesByStage[4],
    ];
    const leafEdges = baseLayout.edgesByStage[5];
    const minX = Math.min(
      ROOT_POINT.x,
      ...baseNodes.flatMap((node) => [node.point.x, node.labelBox.left]),
      ...leafEdges.map((edge) => edge.toPoint.x),
    );
    const maxX = Math.max(
      ROOT_POINT.x,
      ...baseNodes.flatMap((node) => [node.point.x, node.labelBox.left + node.labelBox.width]),
      ...leafEdges.map((edge) => edge.toPoint.x),
    );
    const designHalfSpan = Math.max(ROOT_POINT.x - minX, maxX - ROOT_POINT.x);
    if (designHalfSpan <= 0) {
      return 1;
    }

    const availableHalfSpan = Math.max(visibleViewboxWidth / 2 - 28, 0);
    return clamp(availableHalfSpan / designHalfSpan, 0.24, 1);
  }, [baseLayout, stickyViewport]);

  // Keep the aspirations tree centered while compressing its horizontal spread on narrow viewports.
  const layout = useMemo(
    () => computeAspirationLayout(nodes, edges, horizontalLayoutScale),
    [edges, horizontalLayoutScale, nodes],
  );

  const allLayoutNodes = useMemo(
    () => [
      ...layout.nodesByStage[1],
      ...layout.nodesByStage[2],
      ...layout.nodesByStage[3],
      ...layout.nodesByStage[4],
    ],
    [layout],
  );

  const animatedEdges = useMemo(
    () => [
      ...layout.edgesByStage[1],
      ...layout.edgesByStage[2],
      ...layout.edgesByStage[3],
      ...layout.edgesByStage[4],
      ...layout.edgesByStage[5],
    ],
    [layout],
  );

  const stageBounds = useMemo(() => {
    const stageOneValues = [
      ROOT_POINT.y,
      ...layout.edgesByStage[1].flatMap(edgeYValues),
      ...layout.nodesByStage[1].flatMap(nodeYValues),
    ];
    const stageTwoValues = [
      ...layout.edgesByStage[2].flatMap(edgeYValues),
      ...layout.nodesByStage[2].flatMap(nodeYValues),
    ];
    const stageThreeValues = [
      ...layout.edgesByStage[3].flatMap(edgeYValues),
      ...layout.nodesByStage[3].flatMap(nodeYValues),
    ];
    const stageFourValues = [
      ...layout.edgesByStage[4].flatMap(edgeYValues),
      ...layout.nodesByStage[4].flatMap(nodeYValues),
    ];
    const leafValues = [
      ...layout.edgesByStage[5].flatMap(edgeYValues),
      ...layout.nodesByStage[4].flatMap(nodeYValues),
    ];

    return {
      intro: createBounds([ROOT_POINT.y - 84, ...stageOneValues], 36, 92),
      leaf: createBounds(leafValues, 62, 104),
      stageFour: createBounds(stageFourValues, 56, 96),
      stageOne: createBounds(stageOneValues, 44, 88),
      stageThree: createBounds(stageThreeValues, 58, 92),
      stageTwo: createBounds(stageTwoValues, 58, 94),
    };
  }, [layout]);

  useEffect(() => {
    const element = stickyViewportRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const nextHeight = entries[0]?.contentRect.height ?? 0;
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setStickyViewport((current) => (
        Math.abs(current.height - nextHeight) < 1 && Math.abs(current.width - nextWidth) < 1
          ? current
          : { height: nextHeight, width: nextWidth }
      ));
    });

    observer.observe(element);
    const rect = element.getBoundingClientRect();
    setStickyViewport({ height: rect.height, width: rect.width });

    return () => observer.disconnect();
  }, []);

  const getCenterTranslate = (bounds: StageBounds) => {
    if (prefersReducedMotion || stickyViewport.height <= 0) {
      return 0;
    }

    const scale = (stickyViewport.height * ARTBOARD_HEIGHT_MULTIPLIER) / VIEWBOX_HEIGHT;
    return scale * (VIEWBOX_HEIGHT / 2 - bounds.centerY);
  };

  const cameraTranslations = useMemo(
    () => ({
      intro: getCenterTranslate(stageBounds.intro),
      leaf: getCenterTranslate(stageBounds.leaf),
      stageFour: getCenterTranslate(stageBounds.stageFour),
      stageOne: getCenterTranslate(stageBounds.stageOne),
      stageThree: getCenterTranslate(stageBounds.stageThree),
      stageTwo: getCenterTranslate(stageBounds.stageTwo),
    }),
    [prefersReducedMotion, stageBounds, stickyViewport.height],
  );

  useEffect(() => {
    const nextNodeStates = { ...nodeRuntimeRef.current };
    nextNodeStates["aspiration-root"] = nextNodeStates["aspiration-root"] ?? createNodeRuntimeState("aspiration-root", 0);
    currentNodePointsRef.current["aspiration-root"] = ROOT_POINT;

    allLayoutNodes.forEach((node) => {
      const id = node.id as SceneNodeId;
      nextNodeStates[id] = nextNodeStates[id] ?? createNodeRuntimeState(node.id, node.stage);
      currentNodePointsRef.current[id] = node.point;
    });

    nodeRuntimeRef.current = nextNodeStates;

    const trackedEdges = new Map<string, LayoutEdge>();
    animatedEdges.forEach((edge) => {
      trackedEdges.set(edge.id, edge);
    });

    const nextEdgeStates: Record<string, RuntimeEdgeState> = {};
    const nextThreadStates: Record<string, RuntimeThreadState[]> = {};
    trackedEdges.forEach((edge, id) => {
      nextEdgeStates[id] = edgeRuntimeRef.current[id] ?? createEdgeRuntimeState(id, edge.weight);
      const bundleCount = aspirationThreadStyles.getBundleCount(edge.weight, edge.faded);
      const existingThreadStates = threadRuntimeRef.current[id] ?? [];
      nextThreadStates[id] = Array.from({ length: bundleCount }, (_, threadIndex) => (
        existingThreadStates[threadIndex] ?? createThreadRuntimeState(id, threadIndex, edge.weight)
      ));
    });
    edgeRuntimeRef.current = nextEdgeStates;
    threadRuntimeRef.current = nextThreadStates;

    const nextLeafStates: Record<string, RuntimeLeafState> = {};
    layout.edgesByStage[5].forEach((edge) => {
      nextLeafStates[edge.id] = leafRuntimeRef.current[edge.id] ?? createLeafRuntimeState(edge.id);
    });
    leafRuntimeRef.current = nextLeafStates;
  }, [allLayoutNodes, animatedEdges, layout.edgesByStage]);

  const shellOpacity = useTransform(progressUnits, [0, 0.22, RUNWAY_VIEWPORTS], [0.74, 1, 1]);
  const shellScale = useTransform(progressUnits, [0, TIMELINE.stageFour.end, RUNWAY_VIEWPORTS], [0.992, 1, 1.012]);
  const focusGlowOpacity = useTransform(progressUnits, [0, TIMELINE.stageTwo.mid, RUNWAY_VIEWPORTS], [0.18, 0.34, 0.24]);
  const focusGlowScale = useTransform(progressUnits, [0, TIMELINE.stageThree.mid, RUNWAY_VIEWPORTS], [0.78, 1.02, 1.1]);
  const focusGlowY = useTransform(progressUnits, [0, RUNWAY_VIEWPORTS], [18, -18]);
  const rootOpacity = useTransform(progressUnits, [0, 0.16, 0.44], [0.3, 1, 1]);
  const stageOneOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageOne.start - 0.18, TIMELINE.stageOne.start + 0.28, TIMELINE.stageOne.end],
    [0, 1, 0.94],
  );
  const stageOneReveal = useTransform(
    progressUnits,
    [TIMELINE.stageOne.start - 0.04, TIMELINE.stageOne.start + TIMELINE.stageOne.length * 0.74],
    [0, 1],
  );
  const stageTwoOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageTwo.start - 0.18, TIMELINE.stageTwo.start + 0.3, TIMELINE.stageTwo.end],
    [0, 1, 0.92],
  );
  const stageTwoReveal = useTransform(
    progressUnits,
    [TIMELINE.stageTwo.start - 0.06, TIMELINE.stageTwo.start + TIMELINE.stageTwo.length * 0.72],
    [0, 1],
  );
  const stageThreeOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageThree.start - 0.16, TIMELINE.stageThree.start + 0.28, TIMELINE.stageThree.end],
    [0, 1, 0.92],
  );
  const stageThreeReveal = useTransform(
    progressUnits,
    [TIMELINE.stageThree.start - 0.04, TIMELINE.stageThree.start + TIMELINE.stageThree.length * 0.74],
    [0, 1],
  );
  const stageFourOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageFour.start - 0.14, TIMELINE.stageFour.start + 0.32, TIMELINE.stageFour.end],
    [0, 1, 0.94],
  );
  const stageFourReveal = useTransform(
    progressUnits,
    [TIMELINE.stageFour.start - 0.04, TIMELINE.stageFour.start + TIMELINE.stageFour.length * 0.76],
    [0, 1],
  );
  const leafOpacity = useTransform(
    progressUnits,
    [TIMELINE.leaf.start - 0.12, TIMELINE.leaf.start + 0.34, TIMELINE.leaf.end],
    [0, 0.88, 0.96],
  );
  const leafReveal = useTransform(
    progressUnits,
    [TIMELINE.leaf.start - 0.02, TIMELINE.leaf.start + TIMELINE.leaf.length * 0.78],
    [0, 1],
  );
  const assetTranslateY = useTransform(
    progressUnits,
    [
      0,
      TIMELINE.intro.mid,
      TIMELINE.stageOne.mid,
      TIMELINE.stageTwo.mid,
      TIMELINE.stageThree.mid,
      TIMELINE.stageFour.mid,
      TIMELINE.leaf.mid,
      RUNWAY_VIEWPORTS,
    ],
    [
      cameraTranslations.intro,
      cameraTranslations.intro,
      cameraTranslations.stageOne,
      cameraTranslations.stageTwo,
      cameraTranslations.stageThree,
      cameraTranslations.stageFour,
      cameraTranslations.leaf,
      cameraTranslations.leaf,
    ],
  );
  const assetScale = useTransform(progressUnits, [0, TIMELINE.stageThree.mid, RUNWAY_VIEWPORTS], [1.014, 1, 1.022]);
  const assetOpacity = useTransform(progressUnits, [TIMELINE.leaf.start - 0.12, TIMELINE.leaf.end], [1, 0.84]);
  const overlayRootOpacity = useTransform(
    progressUnits,
    [
      TIMELINE.intro.start + TIMELINE.intro.length * 0.12,
      TIMELINE.intro.start + TIMELINE.intro.length * 0.3,
      TIMELINE.intro.start + TIMELINE.intro.length * 0.82,
      TIMELINE.stageOne.start + TIMELINE.stageOne.length * 0.08,
    ],
    [0, 1, 1, 0],
  );
  const overlayMajorsOpacity = useTransform(
    progressUnits,
    [
      TIMELINE.intro.start + TIMELINE.intro.length * 0.72,
      TIMELINE.stageOne.start + TIMELINE.stageOne.length * 0.16,
      TIMELINE.stageOne.start + TIMELINE.stageOne.length * 0.78,
      TIMELINE.stageTwo.start + TIMELINE.stageTwo.length * 0.04,
    ],
    [0, 1, 1, 0],
  );
  const overlayExperiencesOpacity = useTransform(
    progressUnits,
    [
      TIMELINE.stageTwo.start + TIMELINE.stageTwo.length * 0.08,
      TIMELINE.stageTwo.start + TIMELINE.stageTwo.length * 0.28,
      TIMELINE.stageTwo.end - TIMELINE.stageTwo.length * 0.22,
      TIMELINE.stageThree.start + TIMELINE.stageThree.length * 0.08,
    ],
    [0, 1, 1, 0],
  );
  const overlayGraduationOpacity = useTransform(
    progressUnits,
    [
      TIMELINE.stageThree.start + TIMELINE.stageThree.length * 0.14,
      TIMELINE.stageThree.start + TIMELINE.stageThree.length * 0.34,
      TIMELINE.stageFour.start + TIMELINE.stageFour.length * 0.22,
      TIMELINE.stageFour.start + TIMELINE.stageFour.length * 0.78,
    ],
    [0, 1, 1, 0],
  );

  const stageOneCenter = useMemo(
    () => averagePoint(layout.nodesByStage[1].map((node) => node.point)),
    [layout.nodesByStage],
  );
  const stageTwoCenter = useMemo(
    () => averagePoint(layout.nodesByStage[2].map((node) => node.point)),
    [layout.nodesByStage],
  );
  const graduationNode = layout.nodesByStage[3][0];

  const overlayBeatMap = useMemo(() => {
    return overlayBeats.reduce(
      (beats, beat) => {
        beats[beat.id] = beat.text;
        return beats;
      },
      {} as Record<LandingAspirationOverlayBeatId, string>,
    );
  }, [overlayBeats]);

  const overlaySpecs = useMemo<OverlaySpec[]>(
    () => [
      {
        id: "root",
        maxWidth: 320,
        opacity: overlayRootOpacity,
        text: overlayBeatMap.root ?? "",
        x: ROOT_POINT.x,
        y: ROOT_POINT.y + 64,
      },
      {
        id: "between-root-and-majors",
        maxWidth: 460,
        opacity: overlayMajorsOpacity,
        text: overlayBeatMap["between-root-and-majors"] ?? "",
        x: (ROOT_POINT.x + stageOneCenter.x) / 2,
        y: (ROOT_POINT.y + stageOneCenter.y) / 2 - 24,
      },
      {
        id: "stage-two-experiences",
        maxWidth: 420,
        opacity: overlayExperiencesOpacity,
        text: overlayBeatMap["stage-two-experiences"] ?? "",
        x: stageTwoCenter.x,
        y: stageTwoCenter.y - 118,
      },
      {
        id: "graduation",
        maxWidth: 420,
        opacity: overlayGraduationOpacity,
        text: overlayBeatMap.graduation ?? "",
        x: graduationNode?.point.x ?? VIEWBOX_WIDTH / 2,
        y: (graduationNode?.point.y ?? 820) + 122,
      },
    ],
    [
      graduationNode,
      overlayBeatMap,
      overlayExperiencesOpacity,
      overlayGraduationOpacity,
      overlayMajorsOpacity,
      overlayRootOpacity,
      stageOneCenter,
      stageTwoCenter,
    ],
  );

  const setPointerFromClient = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return null;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
      y: ((clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
    };
  };

  const findNearestNode = (pointer: Point) => {
    const candidates: Array<{ id: SceneNodeId; point: Point; radius: number }> = [
      {
        id: "aspiration-root",
        point: currentNodePointsRef.current["aspiration-root"] ?? ROOT_POINT,
        radius: 68,
      },
      ...allLayoutNodes.map((node) => ({
        id: node.id as SceneNodeId,
        point: currentNodePointsRef.current[node.id as SceneNodeId] ?? node.point,
        radius: node.stage === 3 ? 78 : node.stage === 4 ? 72 : 66,
      })),
    ];

    let best: { distance: number; id: SceneNodeId } | null = null;

    candidates.forEach((candidate) => {
      const distance = Math.hypot(pointer.x - candidate.point.x, pointer.y - candidate.point.y);
      if (distance > candidate.radius) {
        return;
      }

      if (!best || distance < best.distance) {
        best = { distance, id: candidate.id };
      }
    });

    return best?.id ?? null;
  };

  const updatePointer = (clientX: number, clientY: number, pointerType: string | null) => {
    const nextPoint = setPointerFromClient(clientX, clientY);
    if (!nextPoint) return;

    const pointer = pointerStateRef.current;
    pointer.velocityX = nextPoint.x - pointer.lastSvgX;
    pointer.velocityY = nextPoint.y - pointer.lastSvgY;
    pointer.lastSvgX = pointer.svgX;
    pointer.lastSvgY = pointer.svgY;
    pointer.svgX = nextPoint.x;
    pointer.svgY = nextPoint.y;
    pointer.pointerType = pointerType;
    pointer.inside = true;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updatePointer(event.clientX, event.clientY, event.pointerType);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    updatePointer(event.clientX, event.clientY, event.pointerType);
    const pointer = pointerStateRef.current;
    const nearestNodeId = findNearestNode({ x: pointer.svgX, y: pointer.svgY });
    pointer.active = Boolean(nearestNodeId);
    pointer.targetNodeId = nearestNodeId;

    if (!nearestNodeId) {
      return;
    }

    const nodeState = nodeRuntimeRef.current[nearestNodeId];
    if (!nodeState) {
      return;
    }

    if (event.pointerType === "touch") {
      nodeState.velocityX += pointer.velocityX * 0.34;
      nodeState.velocityY += pointer.velocityY * 0.34 - 12;
      pointer.active = false;
      pointer.targetNodeId = null;
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = () => {
    const pointer = pointerStateRef.current;
    const targetNodeId = pointer.targetNodeId;

    if (targetNodeId) {
      const state = nodeRuntimeRef.current[targetNodeId];
      if (state) {
        state.velocityX += pointer.velocityX * 0.34;
        state.velocityY += pointer.velocityY * 0.34;
      }
    }

    pointer.active = false;
    pointer.targetNodeId = null;
  };

  const handlePointerLeave = () => {
    const pointer = pointerStateRef.current;
    pointer.inside = false;
    pointer.active = false;
    pointer.targetNodeId = null;
  };

  useAnimationFrame((timeMs, deltaMs) => {
    if (prefersReducedMotion) {
      return;
    }

    const dt = Math.min(deltaMs / 1000, 0.033);
    const timeSeconds = timeMs / 1000;
    const pointer = pointerStateRef.current;

    const rootState = nodeRuntimeRef.current["aspiration-root"];
    if (rootState && rootGroupRef.current) {
      const rootDistance = pointer.inside ? Math.hypot(pointer.svgX - ROOT_POINT.x, pointer.svgY - ROOT_POINT.y) : Number.POSITIVE_INFINITY;
      const rootHover = clamp01(1 - rootDistance / rootState.hoverRadius);
      rootState.hoverEnergy = lerp(rootState.hoverEnergy, rootHover, Math.min(dt * 8.5, 1));

      if (!pointer.active || pointer.targetNodeId !== "aspiration-root") {
        const pushStrength = rootState.hoverEnergy * 42;
        if (Number.isFinite(rootDistance) && rootDistance > 0.001) {
          rootState.velocityX += ((ROOT_POINT.x - pointer.svgX) / rootDistance) * pushStrength * dt;
          rootState.velocityY += ((ROOT_POINT.y - pointer.svgY) / rootDistance) * pushStrength * dt;
        }
      } else {
        rootState.velocityX += ((pointer.svgX - ROOT_POINT.x) * 0.86 - rootState.offsetX) * dt * 22;
        rootState.velocityY += ((pointer.svgY - ROOT_POINT.y) * 0.86 - rootState.offsetY) * dt * 22;
      }

      rootState.velocityX += (-rootState.offsetX * rootState.spring - rootState.velocityX * rootState.damping) * dt;
      rootState.velocityY += (-rootState.offsetY * rootState.spring - rootState.velocityY * rootState.damping) * dt;
      rootState.offsetX += rootState.velocityX * dt;
      rootState.offsetY += rootState.velocityY * dt;

      const rootPoint = {
        x: ROOT_POINT.x + Math.sin(timeSeconds * rootState.floatFreqX + rootState.phase) * rootState.floatAmpX + rootState.offsetX,
        y: ROOT_POINT.y + Math.cos(timeSeconds * rootState.floatFreqY + rootState.phase * 1.2) * rootState.floatAmpY + rootState.offsetY,
      };

      currentNodePointsRef.current["aspiration-root"] = rootPoint;
      rootGroupRef.current.setAttribute("transform", `translate(${rootPoint.x - ROOT_POINT.x} ${rootPoint.y - ROOT_POINT.y})`);
    }

    allLayoutNodes.forEach((node) => {
      const id = node.id as SceneNodeId;
      const state = nodeRuntimeRef.current[id];
      if (!state) {
        return;
      }

      const currentPoint = currentNodePointsRef.current[id] ?? node.point;
      const distance = pointer.inside
        ? Math.hypot(pointer.svgX - currentPoint.x, pointer.svgY - currentPoint.y)
        : Number.POSITIVE_INFINITY;
      const hoverStrength = clamp01(1 - distance / state.hoverRadius);
      state.hoverEnergy = lerp(state.hoverEnergy, hoverStrength, Math.min(dt * 8.4, 1));

      if (!pointer.active || pointer.targetNodeId !== id) {
        const pushStrength = state.hoverEnergy * (node.stage === 3 ? 46 : 40);
        if (Number.isFinite(distance) && distance > 0.001) {
          state.velocityX += ((currentPoint.x - pointer.svgX) / distance) * pushStrength * dt;
          state.velocityY += ((currentPoint.y - pointer.svgY) / distance) * pushStrength * dt;
        }
      } else {
        state.velocityX += ((pointer.svgX - node.point.x) * 0.82 - state.offsetX) * dt * 20;
        state.velocityY += ((pointer.svgY - node.point.y) * 0.82 - state.offsetY) * dt * 20;
      }

      state.velocityX += (-state.offsetX * state.spring - state.velocityX * state.damping) * dt;
      state.velocityY += (-state.offsetY * state.spring - state.velocityY * state.damping) * dt;
      state.offsetX += state.velocityX * dt;
      state.offsetY += state.velocityY * dt;

      const floatX = Math.sin(timeSeconds * state.floatFreqX + state.phase) * state.floatAmpX;
      const floatY = Math.cos(timeSeconds * state.floatFreqY + state.phase * 1.18) * state.floatAmpY;
      const nextPoint = {
        x: node.point.x + floatX + state.offsetX,
        y: node.point.y + floatY + state.offsetY,
      };

      currentNodePointsRef.current[id] = nextPoint;

      const groupTransform = `translate(${nextPoint.x - node.point.x} ${nextPoint.y - node.point.y})`;
      labelRefs.current[id]?.setAttribute("transform", groupTransform);
      nodeRefs.current[id]?.setAttribute("transform", groupTransform);
    });

    animatedEdges.forEach((edge) => {
      const edgeState = edgeRuntimeRef.current[edge.id];
      if (!edgeState) {
        return;
      }

      const fromPoint =
        edge.from === "aspiration-root"
          ? currentNodePointsRef.current["aspiration-root"] ?? ROOT_POINT
          : currentNodePointsRef.current[edge.from as SceneNodeId] ?? edge.fromPoint;

      let toPoint: Point;
      if (edge.stage === 5) {
        const leafState = leafRuntimeRef.current[edge.id];
        if (!leafState) {
          toPoint = edge.toPoint;
        } else {
          toPoint = {
            x: edge.toPoint.x + Math.sin(timeSeconds * leafState.swayFreqX + leafState.phase) * leafState.swayAmpX,
            y: edge.toPoint.y + Math.cos(timeSeconds * leafState.swayFreqY + leafState.phase * 1.22) * leafState.swayAmpY,
          };
        }
      } else {
        toPoint = currentNodePointsRef.current[edge.to as SceneNodeId] ?? edge.toPoint;
      }

      const baseCurve = buildDynamicCurve(fromPoint, toPoint, edge, edgeState, timeSeconds, pointer);
      const edgeDistance = pointer.inside ? distanceToCurve({ x: pointer.svgX, y: pointer.svgY }, baseCurve, fromPoint, toPoint) : Number.POSITIVE_INFINITY;
      const proximityRadius = edge.weight === "trunk" ? 92 : edge.weight === "branch" ? 72 : 58;
      const pointerSpeed = Math.hypot(pointer.velocityX, pointer.velocityY);
      const targetEdgeEnergy = clamp01(1 - edgeDistance / proximityRadius) * (pointer.active ? 1.38 : 1.02);
      edgeState.pointerEnergy = lerp(edgeState.pointerEnergy, targetEdgeEnergy, Math.min(dt * 6.8, 1));
      edgeState.pluckEnergy = Math.max(0, edgeState.pluckEnergy - edgeState.pluckDecay * dt);

      if (pointer.inside) {
        const pluckRadius = edge.weight === "trunk" ? 74 : edge.weight === "branch" ? 58 : 44;
        const pluckProximity = clamp01(1 - edgeDistance / pluckRadius);
        const motionImpact = clamp01((pointerSpeed - 4) / (edge.weight === "trunk" ? 18 : edge.weight === "branch" ? 16 : 13));

        if (pluckProximity > 0 && motionImpact > 0) {
          const dx = toPoint.x - fromPoint.x;
          const dy = toPoint.y - fromPoint.y;
          const distance = Math.hypot(dx, dy) || 1;
          const normalX = -dy / distance;
          const normalY = dx / distance;
          const projectedVelocity = pointer.velocityX * normalX + pointer.velocityY * normalY;
          const impulseStrength = pluckProximity * motionImpact * (pointer.active ? 1.34 : 1.08);

          edgeState.pluckDirection = projectedVelocity >= 0 ? 1 : -1;
          edgeState.pluckTime = timeSeconds;
          edgeState.pluckEnergy = Math.max(edgeState.pluckEnergy, impulseStrength);
        }
      }

      const animatedBaseCurve = buildDynamicCurve(fromPoint, toPoint, edge, edgeState, timeSeconds, pointer);
      const edgeColor = getEdgeColor(edge);
      const threadRefs = edgeThreadRefs.current[edge.id] ?? [];
      const bundleCount = aspirationThreadStyles.getBundleCount(edge.weight, edge.faded);
      const threadStates = threadRuntimeRef.current[edge.id] ?? [];

      for (let threadIndex = 0; threadIndex < bundleCount; threadIndex += 1) {
        const pathRef = threadRefs[threadIndex];
        if (!pathRef) continue;
        const threadState =
          threadStates[threadIndex] ?? createThreadRuntimeState(edge.id, threadIndex, edge.weight);
        threadStates[threadIndex] = threadState;

        const threadCurve = buildThreadCurve(
          fromPoint,
          toPoint,
          animatedBaseCurve,
          edge,
          edgeState,
          threadState,
          timeSeconds,
          pointer,
          threadIndex,
          bundleCount,
        );

        pathRef.setAttribute("d", threadCurve.d);
        pathRef.setAttribute("stroke", rgba(edgeColor, edge.faded ? 0.4 : 0.88 + edgeState.pointerEnergy * 0.08));
        pathRef.setAttribute(
          "stroke-width",
          `${aspirationThreadStyles.getThreadWidth(edge.weight, edge.faded) + edgeState.pointerEnergy * 0.78 + edgeState.pluckEnergy * 0.42}`,
        );
      }
    });
  });

  return (
    <div
      className="theme-story-contrast-label relative"
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      style={{ height: `${SECTION_VIEWPORTS * 100}dvh` }}
    >
      <div className="theme-story-contrast-backdrop absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,0.16),transparent_18%),radial-gradient(circle_at_50%_56%,rgba(168,85,247,0.12),transparent_26%)]" />
      <div className="theme-story-contrast-top-fade pointer-events-none absolute inset-x-0 top-0 h-28" />
      <div className="theme-story-contrast-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-28" />

      <div ref={stickyViewportRef} className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        <motion.div
          className="relative h-full w-full overflow-hidden px-4 sm:px-6 lg:px-10"
          style={{ opacity: shellOpacity, scale: shellScale }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-[10%] h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-[16%] left-[16%] h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute bottom-[20%] right-[16%] h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
            <motion.div
              className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.26),rgba(34,211,238,0.08)_44%,transparent_72%)] blur-3xl"
              style={{ opacity: focusGlowOpacity, scale: focusGlowScale, y: focusGlowY }}
            />
          </div>

          <div className="relative z-10 flex h-full flex-col">
            <div className="relative flex flex-1 items-center justify-center">
              <div className="absolute inset-x-[4%] top-[13%] h-[1px] bg-gradient-to-r from-transparent via-cyan-200/22 to-transparent" />
              <div className="absolute inset-x-[6%] bottom-[18%] h-[1px] bg-gradient-to-r from-transparent via-fuchsia-200/16 to-transparent" />

              <div
                className="absolute inset-0 overflow-hidden"
                onPointerDown={handlePointerDown}
                onPointerLeave={handlePointerLeave}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ touchAction: "pan-y" }}
              >
                <div
                  className="absolute left-1/2 top-1/2 h-[208%] max-w-none -translate-x-1/2 -translate-y-1/2"
                  style={{ aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}` }}
                >
                  <motion.div className="h-full w-full" style={{ opacity: assetOpacity, scale: assetScale, y: assetTranslateY }}>
                    <svg
                      aria-hidden
                      className="pointer-events-none h-full w-full"
                      preserveAspectRatio="xMidYMin meet"
                      ref={svgRef}
                      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                    >
                      <defs>
                        <filter id={NODE_GLOW_FILTER_ID} x="-200%" y="-200%" width="400%" height="400%">
                          <feGaussianBlur stdDeviation="7.5" />
                        </filter>
                      </defs>

                      <RootAnchor
                        color={getNodeColor("aspiration-root")}
                        groupRef={(element) => {
                          rootGroupRef.current = element;
                        }}
                        opacity={rootOpacity}
                      />

                      <motion.g style={{ opacity: stageOneOpacity }}>
                        {layout.edgesByStage[1].map((edge) => (
                          <EdgeBundle
                            color={getEdgeColor(edge)}
                            edge={edge}
                            key={edge.id}
                            reveal={stageOneReveal}
                            threadRef={(threadIndex, element) => {
                              edgeThreadRefs.current[edge.id] = edgeThreadRefs.current[edge.id] ?? [];
                              edgeThreadRefs.current[edge.id][threadIndex] = element;
                            }}
                          />
                        ))}
                        {layout.nodesByStage[1].map((node) => (
                          <NodeGlyph
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              nodeRefs.current[node.id] = element;
                            }}
                            key={node.id}
                            node={node}
                            reveal={stageOneReveal}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: stageTwoOpacity }}>
                        {layout.edgesByStage[2].map((edge) => (
                          <EdgeBundle
                            color={getEdgeColor(edge)}
                            edge={edge}
                            key={edge.id}
                            reveal={stageTwoReveal}
                            threadRef={(threadIndex, element) => {
                              edgeThreadRefs.current[edge.id] = edgeThreadRefs.current[edge.id] ?? [];
                              edgeThreadRefs.current[edge.id][threadIndex] = element;
                            }}
                          />
                        ))}
                        {layout.nodesByStage[2].map((node) => (
                          <NodeGlyph
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              nodeRefs.current[node.id] = element;
                            }}
                            key={node.id}
                            node={node}
                            reveal={stageTwoReveal}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: stageThreeOpacity }}>
                        {layout.edgesByStage[3].map((edge) => (
                          <EdgeBundle
                            color={getEdgeColor(edge)}
                            edge={edge}
                            key={edge.id}
                            reveal={stageThreeReveal}
                            threadRef={(threadIndex, element) => {
                              edgeThreadRefs.current[edge.id] = edgeThreadRefs.current[edge.id] ?? [];
                              edgeThreadRefs.current[edge.id][threadIndex] = element;
                            }}
                          />
                        ))}
                        {layout.nodesByStage[3].map((node) => (
                          <NodeGlyph
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              nodeRefs.current[node.id] = element;
                            }}
                            key={node.id}
                            node={node}
                            reveal={stageThreeReveal}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: stageFourOpacity }}>
                        {layout.edgesByStage[4].map((edge) => (
                          <EdgeBundle
                            color={getEdgeColor(edge)}
                            edge={edge}
                            key={edge.id}
                            reveal={stageFourReveal}
                            threadRef={(threadIndex, element) => {
                              edgeThreadRefs.current[edge.id] = edgeThreadRefs.current[edge.id] ?? [];
                              edgeThreadRefs.current[edge.id][threadIndex] = element;
                            }}
                          />
                        ))}
                        {layout.nodesByStage[4].map((node) => (
                          <NodeGlyph
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              nodeRefs.current[node.id] = element;
                            }}
                            key={node.id}
                            node={node}
                            reveal={stageFourReveal}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: leafOpacity }}>
                        {layout.edgesByStage[5].map((edge) => (
                          <EdgeBundle
                            color={getEdgeColor(edge)}
                            edge={edge}
                            key={edge.id}
                            reveal={leafReveal}
                            threadRef={(threadIndex, element) => {
                              edgeThreadRefs.current[edge.id] = edgeThreadRefs.current[edge.id] ?? [];
                              edgeThreadRefs.current[edge.id][threadIndex] = element;
                            }}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: stageOneOpacity }}>
                        {layout.nodesByStage[1].map((node) => (
                          <NodeLabel
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              labelRefs.current[node.id] = element;
                            }}
                            isDark={isDarkTheme}
                            key={`label-${node.id}`}
                            node={node}
                            reveal={stageOneReveal}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: stageTwoOpacity }}>
                        {layout.nodesByStage[2].map((node) => (
                          <NodeLabel
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              labelRefs.current[node.id] = element;
                            }}
                            isDark={isDarkTheme}
                            key={`label-${node.id}`}
                            node={node}
                            reveal={stageTwoReveal}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: stageThreeOpacity }}>
                        {layout.nodesByStage[3].map((node) => (
                          <NodeLabel
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              labelRefs.current[node.id] = element;
                            }}
                            isDark={isDarkTheme}
                            key={`label-${node.id}`}
                            node={node}
                            reveal={stageThreeReveal}
                          />
                        ))}
                      </motion.g>

                      <motion.g style={{ opacity: stageFourOpacity }}>
                        {layout.nodesByStage[4].map((node) => (
                          <NodeLabel
                            color={getNodeColor(node.id as SceneNodeId)}
                            groupRef={(element) => {
                              labelRefs.current[node.id] = element;
                            }}
                            isDark={isDarkTheme}
                            key={`label-${node.id}`}
                            node={node}
                            reveal={stageFourReveal}
                          />
                        ))}
                      </motion.g>

                      {overlaySpecs.map((overlay) => (
                        <OverlayBeatText {...overlay} isDark={isDarkTheme} key={overlay.id} />
                      ))}
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AspirationTreePlaceholder;
