import React, { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { LandingAspirationEdge, LandingAspirationNode } from "../../../content";

interface AspirationTreePlaceholderProps {
  nodes: LandingAspirationNode[];
  edges: LandingAspirationEdge[];
  footerTitle: string;
  footerBody: string;
}

interface Point {
  x: number;
  y: number;
}

interface LabelGeometry {
  align: "left" | "right" | "center";
  height: number;
  left: number;
  lineEndX: number;
  lineEndY: number;
  top: number;
  width: number;
}

interface LayoutNode extends LandingAspirationNode {
  labelBox: LabelGeometry;
  point: Point;
}

interface LayoutEdge extends Omit<LandingAspirationEdge, "weight"> {
  fromPoint: Point;
  id: string;
  stage: number;
  toPoint: Point;
  weight: LandingAspirationEdge["weight"] | "leaf";
}

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 1480;
const ROOT_POINT: Point = { x: 500, y: 122 };

const STAGE_Y: Record<number, number> = {
  0: 122,
  1: 332,
  2: 590,
  3: 830,
  4: 1090,
  5: 1364,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const wrapLabel = (label: string) => {
  const words = label.split(" ");
  if (words.length <= 2) {
    return [label];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
};

const createLabel = (
  point: Point,
  label: string,
  align: "left" | "right" | "center",
  verticalPlacement: "middle" | "above" | "below" = "middle",
): LabelGeometry => {
  const lines = wrapLabel(label);
  const width = clamp(label.length * 8.2 + 56, 188, 280);
  const height = lines.length > 1 ? 76 : 58;

  if (align === "center") {
    const top =
      verticalPlacement === "above"
        ? point.y - height - 40
        : verticalPlacement === "below"
          ? point.y + 40
          : point.y - height / 2;

    return {
      align,
      height,
      left: clamp(point.x - width / 2, 20, VIEWBOX_WIDTH - width - 20),
      lineEndX: point.x,
      lineEndY: verticalPlacement === "below" ? top : top + height,
      top,
      width,
    };
  }

  if (align === "left") {
    const left = clamp(point.x - width - 42, 20, VIEWBOX_WIDTH - width - 20);
    return {
      align,
      height,
      left,
      lineEndX: left + width,
      lineEndY: point.y,
      top: point.y - height / 2,
      width,
    };
  }

  const left = clamp(point.x + 42, 20, VIEWBOX_WIDTH - width - 20);
  return {
    align,
    height,
    left,
    lineEndX: left,
    lineEndY: point.y,
    top: point.y - height / 2,
    width,
  };
};

const getNodePoint = (node: LandingAspirationNode): Point => {
  if (node.stage === 1) {
    return node.lane === "left" ? { x: 282, y: STAGE_Y[1] } : { x: 718, y: STAGE_Y[1] };
  }

  if (node.stage === 2) {
    if (node.id === "science-student-association") return { x: 214, y: 568 };
    if (node.id === "computational-neuroscience") return { x: 394, y: 544 };
    if (node.id === "ai-research") return { x: 606, y: 544 };
    return { x: 786, y: 568 };
  }

  if (node.stage === 3) {
    return { x: 500, y: STAGE_Y[3] };
  }

  if (node.stage === 4) {
    if (node.lane === "left") return { x: 266, y: STAGE_Y[4] };
    if (node.lane === "center") return { x: 500, y: STAGE_Y[4] - 8 };
    return { x: 734, y: STAGE_Y[4] };
  }

  return ROOT_POINT;
};

const getNodeLabel = (node: LandingAspirationNode, point: Point): LabelGeometry => {
  if (node.stage === 1) {
    return node.lane === "left"
      ? createLabel(point, node.label, "left")
      : createLabel(point, node.label, "right");
  }

  if (node.stage === 2) {
    if (node.id === "science-student-association") return createLabel(point, node.label, "left");
    if (node.id === "computational-neuroscience") return createLabel(point, node.label, "center", "below");
    if (node.id === "ai-research") return createLabel(point, node.label, "center", "below");
    return createLabel(point, node.label, "right");
  }

  if (node.stage === 3) {
    return createLabel(point, node.label, "center", "above");
  }

  if (node.stage === 4) {
    if (node.lane === "left") return createLabel(point, node.label, "left");
    if (node.lane === "center") return createLabel(point, node.label, "center", "below");
    return createLabel(point, node.label, "right");
  }

  return createLabel(point, node.label, "center");
};

const buildThreadPath = (
  from: Point,
  to: Point,
  threadIndex: number,
  bundleCount: number,
  curvature: number,
) => {
  const centerOffset = threadIndex - (bundleCount - 1) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const offsetDistance = centerOffset * curvature;
  const wave = centerOffset * 6;
  const c1x = from.x + dx * 0.22 + normalX * offsetDistance;
  const c1y = from.y + dy * 0.28 + normalY * (offsetDistance * 0.6 + wave);
  const c2x = from.x + dx * 0.78 + normalX * offsetDistance;
  const c2y = from.y + dy * 0.72 - normalY * (offsetDistance * 0.6 - wave);

  return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
};

const getBundleCount = (weight: LayoutEdge["weight"], faded?: boolean) => {
  if (faded) return 1;
  if (weight === "trunk") return 5;
  if (weight === "branch") return 3;
  return 1;
};

const getBaseOpacity = (weight: LayoutEdge["weight"], faded?: boolean) => {
  if (faded) return 0.14;
  if (weight === "trunk") return 0.48;
  if (weight === "branch") return 0.34;
  return 0.22;
};

const getThreadWidth = (weight: LayoutEdge["weight"], faded?: boolean) => {
  if (faded) return 1.2;
  if (weight === "trunk") return 2.1;
  if (weight === "branch") return 1.6;
  return 1.2;
};

const getGlowWidth = (weight: LayoutEdge["weight"], faded?: boolean) => {
  if (faded) return 4.5;
  if (weight === "trunk") return 12;
  if (weight === "branch") return 8;
  return 5;
};

const EdgeBundle: React.FC<{ edge: LayoutEdge }> = ({ edge }) => {
  const bundleCount = getBundleCount(edge.weight, edge.faded);
  const curvature = edge.weight === "trunk" ? 6.6 : edge.weight === "branch" ? 4.8 : 3.2;

  return (
    <g>
      <path
        d={buildThreadPath(edge.fromPoint, edge.toPoint, 0, 1, 0)}
        fill="none"
        stroke={edge.faded ? "rgba(125,211,252,0.12)" : "rgba(34,211,238,0.18)"}
        strokeLinecap="round"
        strokeWidth={getGlowWidth(edge.weight, edge.faded)}
      />
      {Array.from({ length: bundleCount }, (_, threadIndex) => (
        <path
          key={`${edge.id}-thread-${threadIndex}`}
          d={buildThreadPath(edge.fromPoint, edge.toPoint, threadIndex, bundleCount, curvature)}
          fill="none"
          stroke={edge.faded ? "rgba(224,242,254,0.42)" : "rgba(224,242,254,0.86)"}
          strokeLinecap="round"
          strokeOpacity={getBaseOpacity(edge.weight, edge.faded)}
          strokeWidth={getThreadWidth(edge.weight, edge.faded)}
        />
      ))}
    </g>
  );
};

const NodeGlyph: React.FC<{ node: LayoutNode }> = ({ node }) => {
  const haloRadius = node.stage === 3 ? 24 : 18;
  const nodeRadius = node.stage === 3 ? 10 : 8;

  return (
    <g>
      <circle cx={node.point.x} cy={node.point.y} fill="rgba(34,211,238,0.18)" r={haloRadius} />
      <circle
        cx={node.point.x}
        cy={node.point.y}
        fill="rgba(241,245,249,0.98)"
        r={nodeRadius}
        stroke="rgba(103,232,249,0.98)"
        strokeWidth="2.4"
      />
    </g>
  );
};

const NodeLabel: React.FC<{ node: LayoutNode }> = ({ node }) => {
  const lines = wrapLabel(node.label);
  const { align, height, left, lineEndX, lineEndY, top, width } = node.labelBox;
  const textAnchor = align === "left" ? "end" : align === "right" ? "start" : "middle";
  const textX = align === "left" ? left + width - 18 : align === "right" ? left + 18 : left + width / 2;

  return (
    <g>
      <line
        stroke="rgba(125,211,252,0.46)"
        strokeDasharray="4 8"
        strokeLinecap="round"
        strokeWidth="1.6"
        x1={node.point.x}
        x2={lineEndX}
        y1={node.point.y}
        y2={lineEndY}
      />
      <rect
        fill="rgba(2,6,23,0.76)"
        height={height}
        rx={18}
        stroke="rgba(186,230,253,0.12)"
        width={width}
        x={left}
        y={top}
      />
      <text
        fill="rgba(186,230,253,0.48)"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="3.2"
        textAnchor={textAnchor}
        x={textX}
        y={top + 18}
      >
        ASPIRATION
      </text>
      <text
        fill="rgba(241,245,249,0.96)"
        fontSize={lines.length > 1 ? "14" : "15"}
        fontWeight="700"
        letterSpacing="-0.2"
        textAnchor={textAnchor}
        x={textX}
        y={top + 40}
      >
        {lines.map((line, index) => (
          <tspan dy={index === 0 ? 0 : 16} key={`${node.id}-line-${index}`} x={textX}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

const AspirationTreePlaceholder: React.FC<AspirationTreePlaceholderProps> = ({
  nodes,
  edges,
  footerTitle,
  footerBody,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 60 : 90,
    damping: reduceMotion ? 28 : 22,
    mass: 1,
  });

  const stageOneOpacity = useTransform(progress, [0.02, 0.12, 0.24], [0.16, 1, 1]);
  const stageTwoOpacity = useTransform(progress, [0.18, 0.34, 0.52], [0.12, 1, 1]);
  const stageThreeOpacity = useTransform(progress, [0.42, 0.56, 0.7], [0.1, 1, 1]);
  const stageFourOpacity = useTransform(progress, [0.58, 0.74, 0.9], [0.08, 1, 1]);
  const leafOpacity = useTransform(progress, [0.78, 0.92, 1], [0, 0.68, 0.84]);
  const shellOpacity = useTransform(progress, [0, 0.04, 1], [0.55, 1, 1]);
  const shellScale = useTransform(progress, [0, 0.72, 1], [0.985, 1, 1.01]);
  const footerOpacity = useTransform(progress, [0.82, 0.94, 1], [0, 1, 1]);
  const footerTranslate = useTransform(progress, [0.82, 1], [30, 0]);

  const layout = useMemo(() => {
    const layoutNodes = nodes.map((node) => {
      const point = getNodePoint(node);
      return {
        ...node,
        labelBox: getNodeLabel(node, point),
        point,
      };
    });

    const nodeMap = new Map(layoutNodes.map((node) => [node.id, node]));
    const stageOneNodes = layoutNodes.filter((node) => node.stage === 1);
    const stageFourNodes = layoutNodes.filter((node) => node.stage === 4);

    const rootEdges: LayoutEdge[] = stageOneNodes.map((node) => ({
      from: "aspiration-root",
      fromPoint: ROOT_POINT,
      id: `root-${node.id}`,
      stage: 1,
      to: node.id,
      toPoint: node.point,
      weight: "trunk",
    }));

    const contentEdges: LayoutEdge[] = edges.flatMap((edge) => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);

      if (!fromNode || !toNode) {
        return [];
      }

      return [
        {
          ...edge,
          fromPoint: fromNode.point,
          id: `${edge.from}-${edge.to}`,
          stage: Math.max(fromNode.stage, toNode.stage),
          toPoint: toNode.point,
        },
      ];
    });

    const leafEdges: LayoutEdge[] = stageFourNodes.flatMap((node) => {
      const spread = node.lane === "center" ? [-78, 0, 78] : node.lane === "left" ? [-88, 0, 62] : [-62, 0, 88];

      return spread.map((offset, index) => ({
        faded: true,
        from: node.id,
        fromPoint: node.point,
        id: `${node.id}-leaf-${index}`,
        stage: 5,
        to: `${node.id}-leaf-end-${index}`,
        toPoint: {
          x: node.point.x + offset,
          y: STAGE_Y[5] + Math.abs(offset) * 0.12 + index * 10,
        },
        weight: "leaf" as const,
      }));
    });

    return {
      edgesByStage: {
        1: rootEdges,
        2: contentEdges.filter((edge) => edge.stage === 2),
        3: contentEdges.filter((edge) => edge.stage === 3),
        4: contentEdges.filter((edge) => edge.stage === 4),
        5: leafEdges,
      },
      nodesByStage: {
        1: layoutNodes.filter((node) => node.stage === 1),
        2: layoutNodes.filter((node) => node.stage === 2),
        3: layoutNodes.filter((node) => node.stage === 3),
        4: layoutNodes.filter((node) => node.stage === 4),
      },
    };
  }, [edges, nodes]);

  return (
    <div ref={sectionRef} className="relative min-h-[300dvh]">
      <div className="sticky top-[7vh] flex h-[86vh] items-center justify-center">
        <motion.div
          className="relative mx-auto h-full w-full max-w-6xl overflow-hidden rounded-[2.8rem] border border-cyan-200/8 bg-[linear-gradient(180deg,rgba(2,6,23,0.9),rgba(2,6,23,0.72)),radial-gradient(circle_at_50%_16%,rgba(34,211,238,0.13),transparent_28%),radial-gradient(circle_at_20%_76%,rgba(168,85,247,0.12),transparent_28%),radial-gradient(circle_at_80%_74%,rgba(56,189,248,0.12),transparent_28%)] px-4 py-4 shadow-[0_0_90px_rgba(8,145,178,0.12)] backdrop-blur-sm sm:px-6 sm:py-6"
          style={{ opacity: shellOpacity, scale: shellScale }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="absolute left-1/2 top-[8%] h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-[14%] left-[18%] h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute bottom-[18%] right-[18%] h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />
          </div>

          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          >
            <motion.g style={{ opacity: stageOneOpacity }}>
              <circle cx={ROOT_POINT.x} cy={ROOT_POINT.y} fill="rgba(34,211,238,0.2)" r="18" />
              <circle cx={ROOT_POINT.x} cy={ROOT_POINT.y} fill="rgba(241,245,249,0.98)" r="8" stroke="rgba(103,232,249,0.98)" strokeWidth="2.4" />
              {layout.edgesByStage[1].map((edge) => (
                <EdgeBundle edge={edge} key={edge.id} />
              ))}
              {layout.nodesByStage[1].map((node) => (
                <g key={node.id}>
                  <NodeGlyph node={node} />
                  <NodeLabel node={node} />
                </g>
              ))}
            </motion.g>

            <motion.g style={{ opacity: stageTwoOpacity }}>
              {layout.edgesByStage[2].map((edge) => (
                <EdgeBundle edge={edge} key={edge.id} />
              ))}
              {layout.nodesByStage[2].map((node) => (
                <g key={node.id}>
                  <NodeGlyph node={node} />
                  <NodeLabel node={node} />
                </g>
              ))}
            </motion.g>

            <motion.g style={{ opacity: stageThreeOpacity }}>
              {layout.edgesByStage[3].map((edge) => (
                <EdgeBundle edge={edge} key={edge.id} />
              ))}
              {layout.nodesByStage[3].map((node) => (
                <g key={node.id}>
                  <NodeGlyph node={node} />
                  <NodeLabel node={node} />
                </g>
              ))}
            </motion.g>

            <motion.g style={{ opacity: stageFourOpacity }}>
              {layout.edgesByStage[4].map((edge) => (
                <EdgeBundle edge={edge} key={edge.id} />
              ))}
              {layout.nodesByStage[4].map((node) => (
                <g key={node.id}>
                  <NodeGlyph node={node} />
                  <NodeLabel node={node} />
                </g>
              ))}
            </motion.g>

            <motion.g style={{ opacity: leafOpacity }}>
              {layout.edgesByStage[5].map((edge) => (
                <EdgeBundle edge={edge} key={edge.id} />
              ))}
            </motion.g>
          </svg>

          <motion.div
            className="absolute inset-x-0 bottom-7 z-20 mx-auto max-w-3xl px-4 text-center sm:bottom-10"
            style={{ opacity: footerOpacity, y: footerTranslate }}
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.42em] text-cyan-100/54">
              Beyond Graduation
            </p>
            <h3 className="mt-5 text-4xl font-semibold leading-tight text-slate-100 xs:text-[2.85rem] sm:text-[3.5rem]">
              {footerTitle}
            </h3>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-[1.18rem]">
              {footerBody}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AspirationTreePlaceholder;
