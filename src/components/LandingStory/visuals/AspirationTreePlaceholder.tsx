import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { LandingAspirationEdge, LandingAspirationNode } from "../../../content";
import { useSectionActivity } from "../runtime/LandingStoryRuntime";
import {
  aspirationThreadStyles,
  buildThreadPath,
  computeAspirationLayout,
  LayoutEdge,
  LayoutNode,
  ROOT_POINT,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
} from "./aspiration/aspirationLayout";
import { useLandingStoryRuntime } from "../runtime/LandingStoryRuntime";

interface AspirationTreePlaceholderProps {
  nodes: LandingAspirationNode[];
  edges: LandingAspirationEdge[];
  eyebrow: string;
  summary: string;
}

const ARTBOARD_HEIGHT_MULTIPLIER = 2.08;

const TIMELINE_VIEWPORT_LENGTHS = {
  intro: 0.74,
  stageOne: 1.02,
  stageTwo: 1.18,
  stageThree: 1.04,
  stageFour: 1.16,
  leaf: 1.06,
} as const;

type TimelineKey = keyof typeof TIMELINE_VIEWPORT_LENGTHS;

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
    {} as Record<TimelineKey, TimelineSegment>
  );
})();

const wrapLabel = (label: string) => {
  const words = label.split(" ");
  if (words.length <= 2) {
    return [label];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
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

const GhostEdgeBundle: React.FC<{ edge: LayoutEdge }> = ({ edge }) => {
  const bundleCount = Math.max(
    1,
    aspirationThreadStyles.getBundleCount(edge.weight, edge.faded) - (edge.weight === "trunk" ? 2 : 1)
  );
  const curvature = edge.weight === "trunk" ? 6.2 : edge.weight === "branch" ? 4.4 : 2.8;
  const softWidth = aspirationThreadStyles.getGlowWidth(edge.weight, edge.faded) * 0.62;

  return (
    <g opacity={edge.faded ? 0.48 : 1}>
      <path
        d={buildThreadPath(edge.fromPoint, edge.toPoint, 0, 1, 0)}
        fill="none"
        stroke={edge.faded ? "rgba(125,211,252,0.05)" : "rgba(34,211,238,0.08)"}
        strokeLinecap="round"
        strokeWidth={softWidth}
      />
      {Array.from({ length: bundleCount }, (_, threadIndex) => (
        <path
          d={buildThreadPath(edge.fromPoint, edge.toPoint, threadIndex, bundleCount, curvature)}
          fill="none"
          key={`${edge.id}-ghost-${threadIndex}`}
          stroke="rgba(226,232,240,0.16)"
          strokeLinecap="round"
          strokeWidth={Math.max(0.9, aspirationThreadStyles.getThreadWidth(edge.weight, edge.faded) * 0.78)}
        />
      ))}
    </g>
  );
};

const GhostNodeGlyph: React.FC<{ node: LayoutNode }> = ({ node }) => {
  const haloRadius = node.stage === 3 ? 22 : node.stage === 4 ? 20 : 16;
  const nodeRadius = node.stage === 3 ? 8.5 : node.stage === 4 ? 8 : 7;

  return (
    <g opacity={0.52}>
      <circle cx={node.point.x} cy={node.point.y} fill="rgba(34,211,238,0.08)" r={haloRadius} />
      <circle cx={node.point.x} cy={node.point.y} fill="rgba(226,232,240,0.26)" r={nodeRadius} />
    </g>
  );
};

const EdgeBundle: React.FC<{
  edge: LayoutEdge;
  reveal: MotionValue<number>;
}> = ({ edge, reveal }) => {
  const bundleCount = aspirationThreadStyles.getBundleCount(edge.weight, edge.faded);
  const curvature = edge.weight === "trunk" ? 7.2 : edge.weight === "branch" ? 5.2 : 3.2;
  const dashOffset = useTransform(reveal, (value) => 1 - value);

  return (
    <g>
      <path
        d={buildThreadPath(edge.fromPoint, edge.toPoint, 0, 1, 0)}
        fill="none"
        stroke={edge.faded ? "rgba(125,211,252,0.12)" : "url(#aspiration-thread-glow)"}
        strokeLinecap="round"
        strokeWidth={aspirationThreadStyles.getGlowWidth(edge.weight, edge.faded)}
      />
      {Array.from({ length: bundleCount }, (_, threadIndex) => (
        <motion.path
          d={buildThreadPath(edge.fromPoint, edge.toPoint, threadIndex, bundleCount, curvature)}
          fill="none"
          key={`${edge.id}-thread-${threadIndex}`}
          pathLength={1}
          stroke={edge.faded ? "rgba(226,232,240,0.54)" : "url(#aspiration-thread)"}
          strokeLinecap="round"
          strokeOpacity={aspirationThreadStyles.getBaseOpacity(edge.weight, edge.faded)}
          strokeWidth={aspirationThreadStyles.getThreadWidth(edge.weight, edge.faded)}
          style={{ strokeDasharray: "1", strokeDashoffset: dashOffset }}
        />
      ))}
    </g>
  );
};

const RootAnchor: React.FC<{ opacity: MotionValue<number> }> = ({ opacity }) => {
  return (
    <motion.g style={{ opacity }}>
      <circle cx={ROOT_POINT.x} cy={ROOT_POINT.y} fill="rgba(34,211,238,0.14)" r={34} />
      <circle cx={ROOT_POINT.x} cy={ROOT_POINT.y} fill="rgba(103,232,249,0.18)" r={18} />
      <circle
        cx={ROOT_POINT.x}
        cy={ROOT_POINT.y}
        fill="rgba(241,245,249,0.98)"
        r={8.8}
        stroke="rgba(34,211,238,0.92)"
        strokeWidth="2.4"
      />
      <circle
        cx={ROOT_POINT.x}
        cy={ROOT_POINT.y}
        fill="none"
        opacity="0.36"
        r={52}
        stroke="rgba(103,232,249,0.28)"
        strokeDasharray="8 11"
        strokeWidth="1.4"
      />
    </motion.g>
  );
};

const NodeGlyph: React.FC<{ node: LayoutNode }> = ({ node }) => {
  const haloRadius = node.stage === 3 ? 26 : node.stage === 4 ? 23 : 19;
  const nodeRadius = node.stage === 3 ? 10.5 : node.stage === 4 ? 9.3 : 8.3;

  return (
    <g>
      <circle cx={node.point.x} cy={node.point.y} fill="rgba(34,211,238,0.15)" r={haloRadius} />
      <circle cx={node.point.x} cy={node.point.y} fill="rgba(168,85,247,0.12)" r={haloRadius + 8} />
      <circle
        cx={node.point.x}
        cy={node.point.y}
        fill="rgba(241,245,249,0.98)"
        r={nodeRadius}
        stroke="rgba(103,232,249,0.98)"
        strokeWidth="2.5"
      />
      <circle
        cx={node.point.x}
        cy={node.point.y}
        fill="none"
        opacity="0.34"
        r={haloRadius + 15}
        stroke="rgba(103,232,249,0.38)"
        strokeDasharray="6 10"
        strokeWidth="1.4"
      />
    </g>
  );
};

const NodeLabel: React.FC<{ node: LayoutNode; reveal: MotionValue<number> }> = ({ node, reveal }) => {
  const lines = wrapLabel(node.label);
  const { align, height, left, lineEndX, lineEndY, top, width } = node.labelBox;
  const textAnchor = align === "left" ? "end" : align === "right" ? "start" : "middle";
  const textX = align === "left" ? left + width - 18 : align === "right" ? left + 18 : left + width / 2;

  return (
    <motion.g style={{ opacity: reveal }}>
      <line
        stroke="rgba(125,211,252,0.44)"
        strokeDasharray="4 8"
        strokeLinecap="round"
        strokeWidth="1.6"
        x1={node.point.x}
        x2={lineEndX}
        y1={node.point.y}
        y2={lineEndY}
      />
      <rect
        fill="var(--story-label-bg)"
        height={height}
        rx={20}
        stroke="var(--story-label-border)"
        width={width}
        x={left}
        y={top}
      />
      <rect fill="rgba(34,211,238,0.22)" height="1.6" rx="1.6" width={Math.max(46, width - 36)} x={left + 18} y={top + 12} />
      <text
        fill="var(--story-label-kicker)"
        fontSize="9.2"
        fontWeight="700"
        letterSpacing="2.9"
        textAnchor={textAnchor}
        x={textX}
        y={top + 20}
      >
        ASPIRATION
      </text>
      <text
        fill="var(--story-label-title)"
        fontSize={lines.length > 1 ? "14" : "15.2"}
        fontWeight="700"
        letterSpacing="-0.2"
        textAnchor={textAnchor}
        x={textX}
        y={top + 43}
      >
        {lines.map((line, index) => (
          <tspan dy={index === 0 ? 0 : 16} key={`${node.id}-line-${index}`} x={textX}>
            {line}
          </tspan>
        ))}
      </text>
    </motion.g>
  );
};

const NodeStage: React.FC<{
  edges: LayoutEdge[];
  nodes: LayoutNode[];
  opacity: MotionValue<number> | number;
  reveal: MotionValue<number>;
}> = ({ edges, nodes, opacity, reveal }) => {
  return (
    <motion.g style={{ opacity }}>
      {edges.map((edge) => (
        <EdgeBundle edge={edge} key={edge.id} reveal={reveal} />
      ))}
      {nodes.map((node) => (
        <g key={node.id}>
          <NodeGlyph node={node} />
          <NodeLabel node={node} reveal={reveal} />
        </g>
      ))}
    </motion.g>
  );
};

const AspirationTreePlaceholder: React.FC<AspirationTreePlaceholderProps> = ({
  nodes,
  edges,
  eyebrow,
  summary,
}) => {
  const { sectionRef, qualityTier } = useSectionActivity<HTMLDivElement>({
    nearAmount: 0.08,
    nearMargin: "28% 0px 28% 0px",
    primaryAmount: 0.38,
    primaryMargin: "-14% 0px -14% 0px",
  });
  const { scrollContainerRef } = useLandingStoryRuntime();
  const prefersReducedMotion = Boolean(useReducedMotion()) || qualityTier === "static";
  const stickyViewportRef = useRef<HTMLDivElement>(null);
  const [stickyHeight, setStickyHeight] = useState(0);
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progressUnits = useTransform(scrollYProgress, [0, 1], [0, RUNWAY_VIEWPORTS]);

  const layout = useMemo(() => computeAspirationLayout(nodes, edges), [edges, nodes]);

  const ghostEdges = useMemo(
    () => [
      ...layout.edgesByStage[1],
      ...layout.edgesByStage[2],
      ...layout.edgesByStage[3],
      ...layout.edgesByStage[4],
      ...layout.edgesByStage[5],
    ],
    [layout]
  );

  const ghostNodes = useMemo(
    () => [
      ...layout.nodesByStage[1],
      ...layout.nodesByStage[2],
      ...layout.nodesByStage[3],
      ...layout.nodesByStage[4],
    ],
    [layout]
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
      setStickyHeight((current) => (Math.abs(current - nextHeight) < 1 ? current : nextHeight));
    });

    observer.observe(element);
    setStickyHeight(element.getBoundingClientRect().height);

    return () => observer.disconnect();
  }, []);

  const getCenterTranslate = (bounds: StageBounds) => {
    if (prefersReducedMotion || stickyHeight <= 0) {
      return 0;
    }

    const scale = (stickyHeight * ARTBOARD_HEIGHT_MULTIPLIER) / VIEWBOX_HEIGHT;
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
    [prefersReducedMotion, stageBounds, stickyHeight]
  );

  const shellOpacity = useTransform(progressUnits, [0, 0.22, RUNWAY_VIEWPORTS], [0.74, 1, 1]);
  const shellScale = useTransform(progressUnits, [0, TIMELINE.stageFour.end, RUNWAY_VIEWPORTS], [0.992, 1, 1.012]);
  const focusGlowOpacity = useTransform(progressUnits, [0, TIMELINE.stageTwo.mid, RUNWAY_VIEWPORTS], [0.18, 0.34, 0.24]);
  const focusGlowScale = useTransform(progressUnits, [0, TIMELINE.stageThree.mid, RUNWAY_VIEWPORTS], [0.78, 1.02, 1.1]);
  const focusGlowY = useTransform(progressUnits, [0, RUNWAY_VIEWPORTS], [18, -18]);
  const introOpacity = useTransform(
    progressUnits,
    [0.06, 0.24, TIMELINE.intro.end * 0.76, TIMELINE.stageOne.start + 0.36],
    [0, 1, 1, 0]
  );
  const rootOpacity = useTransform(progressUnits, [0, 0.16, 0.44], [0.3, 1, 1]);
  const stageOneOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageOne.start - 0.18, TIMELINE.stageOne.start + 0.28, TIMELINE.stageOne.end],
    [0, 1, 0.94]
  );
  const stageOneReveal = useTransform(
    progressUnits,
    [TIMELINE.stageOne.start - 0.04, TIMELINE.stageOne.start + TIMELINE.stageOne.length * 0.74],
    [0, 1]
  );
  const stageTwoOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageTwo.start - 0.18, TIMELINE.stageTwo.start + 0.3, TIMELINE.stageTwo.end],
    [0, 1, 0.92]
  );
  const stageTwoReveal = useTransform(
    progressUnits,
    [TIMELINE.stageTwo.start - 0.06, TIMELINE.stageTwo.start + TIMELINE.stageTwo.length * 0.72],
    [0, 1]
  );
  const stageThreeOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageThree.start - 0.16, TIMELINE.stageThree.start + 0.28, TIMELINE.stageThree.end],
    [0, 1, 0.92]
  );
  const stageThreeReveal = useTransform(
    progressUnits,
    [TIMELINE.stageThree.start - 0.04, TIMELINE.stageThree.start + TIMELINE.stageThree.length * 0.74],
    [0, 1]
  );
  const stageFourOpacity = useTransform(
    progressUnits,
    [TIMELINE.stageFour.start - 0.14, TIMELINE.stageFour.start + 0.32, TIMELINE.stageFour.end],
    [0, 1, 0.94]
  );
  const stageFourReveal = useTransform(
    progressUnits,
    [TIMELINE.stageFour.start - 0.04, TIMELINE.stageFour.start + TIMELINE.stageFour.length * 0.76],
    [0, 1]
  );
  const leafOpacity = useTransform(
    progressUnits,
    [TIMELINE.leaf.start - 0.12, TIMELINE.leaf.start + 0.34, TIMELINE.leaf.end],
    [0, 0.88, 0.96]
  );
  const leafReveal = useTransform(
    progressUnits,
    [TIMELINE.leaf.start - 0.02, TIMELINE.leaf.start + TIMELINE.leaf.length * 0.78],
    [0, 1]
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
    ]
  );
  const assetScale = useTransform(progressUnits, [0, TIMELINE.stageThree.mid, RUNWAY_VIEWPORTS], [1.014, 1, 1.022]);
  const assetOpacity = useTransform(progressUnits, [TIMELINE.leaf.start - 0.12, TIMELINE.leaf.end], [1, 0.84]);

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
            <motion.div
              className="theme-story-contrast-panel pointer-events-none absolute left-4 top-5 z-20 max-w-[28rem] rounded-[1.6rem] border px-5 py-4 sm:left-6 sm:px-6 sm:py-5 lg:left-10"
              style={{ opacity: introOpacity }}
            >
              <p className="theme-story-contrast-accent text-[0.7rem] font-semibold uppercase tracking-[0.42em]">{eyebrow}</p>
              <p className="theme-story-contrast-body mt-3 max-w-lg text-[clamp(0.98rem,1.4vw,1.14rem)] leading-relaxed">
                {summary}
              </p>
            </motion.div>

            <div className="relative flex flex-1 items-center justify-center">
              <div className="absolute inset-x-[4%] top-[13%] h-[1px] bg-gradient-to-r from-transparent via-cyan-200/22 to-transparent" />
              <div className="absolute inset-x-[6%] bottom-[18%] h-[1px] bg-gradient-to-r from-transparent via-fuchsia-200/16 to-transparent" />

              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute left-1/2 top-1/2 h-[208%] max-w-none -translate-x-1/2 -translate-y-1/2"
                  style={{ aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}` }}
                >
                  <motion.div className="h-full w-full" style={{ opacity: assetOpacity, scale: assetScale, y: assetTranslateY }}>
                    <svg aria-hidden className="h-full w-full" preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
                      <defs>
                        <linearGradient id="aspiration-thread" gradientUnits="userSpaceOnUse" x1="96" x2="904" y1="84" y2="1410">
                          <stop offset="0%" stopColor="#e0fbff" stopOpacity="0.92" />
                          <stop offset="42%" stopColor="#67e8f9" stopOpacity="0.96" />
                          <stop offset="72%" stopColor="#7dd3fc" stopOpacity="0.92" />
                          <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0.88" />
                        </linearGradient>
                        <linearGradient id="aspiration-thread-glow" gradientUnits="userSpaceOnUse" x1="120" x2="920" y1="90" y2="1418">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                          <stop offset="46%" stopColor="#22d3ee" stopOpacity="0.36" />
                          <stop offset="78%" stopColor="#a855f7" stopOpacity="0.24" />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {ghostEdges.map((edge) => (
                        <GhostEdgeBundle edge={edge} key={`ghost-${edge.id}`} />
                      ))}
                      {ghostNodes.map((node) => (
                        <GhostNodeGlyph key={`ghost-node-${node.id}`} node={node} />
                      ))}

                      <RootAnchor opacity={rootOpacity} />

                      <NodeStage
                        edges={layout.edgesByStage[1]}
                        nodes={layout.nodesByStage[1]}
                        opacity={stageOneOpacity}
                        reveal={stageOneReveal}
                      />
                      <NodeStage
                        edges={layout.edgesByStage[2]}
                        nodes={layout.nodesByStage[2]}
                        opacity={stageTwoOpacity}
                        reveal={stageTwoReveal}
                      />
                      <NodeStage
                        edges={layout.edgesByStage[3]}
                        nodes={layout.nodesByStage[3]}
                        opacity={stageThreeOpacity}
                        reveal={stageThreeReveal}
                      />
                      <NodeStage
                        edges={layout.edgesByStage[4]}
                        nodes={layout.nodesByStage[4]}
                        opacity={stageFourOpacity}
                        reveal={stageFourReveal}
                      />

                      <motion.g style={{ opacity: leafOpacity }}>
                        {layout.edgesByStage[5].map((edge) => (
                          <EdgeBundle edge={edge} key={edge.id} reveal={leafReveal} />
                        ))}
                      </motion.g>

                      <motion.rect
                        fill="url(#aspiration-thread)"
                        height="1.5"
                        opacity="0.1"
                        style={{ transformOrigin: "50% 50%" }}
                        width={VIEWBOX_WIDTH}
                        x="0"
                        y="128"
                      />
                      <motion.rect
                        fill="url(#aspiration-thread-glow)"
                        height="1.5"
                        opacity="0.12"
                        style={{ transformOrigin: "50% 50%" }}
                        width={VIEWBOX_WIDTH}
                        x="0"
                        y="1388"
                      />
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
