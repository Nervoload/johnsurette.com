import {
  LandingAspirationEdge,
  LandingAspirationNode,
} from "../../../../content";

export interface Point {
  x: number;
  y: number;
}

export interface LabelGeometry {
  align: "left" | "right" | "center";
  height: number;
  left: number;
  lineEndX: number;
  lineEndY: number;
  top: number;
  width: number;
}

export interface LayoutNode extends LandingAspirationNode {
  labelBox: LabelGeometry;
  point: Point;
}

export interface LayoutEdge extends Omit<LandingAspirationEdge, "weight"> {
  fromPoint: Point;
  id: string;
  stage: number;
  toPoint: Point;
  weight: LandingAspirationEdge["weight"] | "thread";
}

export interface AspirationLayout {
  edgesByStage: Record<1 | 2 | 3 | 4 | 5, LayoutEdge[]>;
  nodesByStage: Record<1 | 2 | 3 | 4, LayoutNode[]>;
}

export const VIEWBOX_WIDTH = 1000;
const LAYOUT_SPREAD = 1.3;
const ROOT_Y = 120;

export const VIEWBOX_HEIGHT = 1920;

export const ROOT_POINT: Point = { x: VIEWBOX_WIDTH / 2, y: ROOT_Y };

const scaleFromCenterX = (value: number, horizontalScale = 1) =>
  VIEWBOX_WIDTH / 2 + (value - VIEWBOX_WIDTH / 2) * LAYOUT_SPREAD * horizontalScale;

const scaleFromRootY = (value: number) => ROOT_POINT.y + (value - ROOT_POINT.y) * LAYOUT_SPREAD;

const STAGE_Y: Record<number, number> = {
  0: ROOT_POINT.y,
  1: scaleFromRootY(330),
  2: scaleFromRootY(560),
  3: scaleFromRootY(820),
  4: scaleFromRootY(1075),
  5: scaleFromRootY(1380),
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

const resolveLabelFrame = (label: string) => {
  const lines = wrapLabel(label);
  const longestLineLength = Math.max(...lines.map((line) => line.length));

  return {
    height: lines.length > 1 ? 96 : 70,
    lines,
    width: clamp(longestLineLength * 15.8 + 68, 208, 328),
  };
};

const createLabel = (
  point: Point,
  label: string,
  offsetX: number,
  offsetY: number,
): LabelGeometry => {
  const { height, width } = resolveLabelFrame(label);
  const left = clamp(point.x + offsetX - width / 2, 24, VIEWBOX_WIDTH - width - 24);
  const top = clamp(point.y + offsetY - height / 2, 24, VIEWBOX_HEIGHT - height - 24);
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  let align: LabelGeometry["align"] = "center";
  let lineEndX = point.x;
  let lineEndY = centerY >= point.y ? top : top + height;

  if (centerX < point.x - 48) {
    align = "left";
    lineEndX = left + width;
    lineEndY = clamp(point.y, top + 16, top + height - 16);
  } else if (centerX > point.x + 48) {
    align = "right";
    lineEndX = left;
    lineEndY = clamp(point.y, top + 16, top + height - 16);
  }

  return {
    align,
    height,
    left,
    lineEndX,
    lineEndY,
    top,
    width,
  };
};

export const getNodePoint = (node: LandingAspirationNode, horizontalScale = 1): Point => {
  if (node.stage === 1) {
    return node.lane === "left"
      ? { x: scaleFromCenterX(286, horizontalScale), y: STAGE_Y[1] }
      : { x: scaleFromCenterX(714, horizontalScale), y: STAGE_Y[1] };
  }

  if (node.stage === 2) {
    if (node.id === "science-student-association") return { x: scaleFromCenterX(210, horizontalScale), y: STAGE_Y[2] };
    if (node.id === "computational-neuroscience") return { x: scaleFromCenterX(368, horizontalScale), y: STAGE_Y[2] - 24 };
    if (node.id === "ai-research") return { x: scaleFromCenterX(632, horizontalScale), y: STAGE_Y[2] - 24 };
    return { x: scaleFromCenterX(790, horizontalScale), y: STAGE_Y[2] };
  }

  if (node.stage === 3) {
    return { x: ROOT_POINT.x, y: STAGE_Y[3] };
  }

  if (node.stage === 4) {
    if (node.lane === "left") return { x: scaleFromCenterX(258, horizontalScale), y: STAGE_Y[4] };
    if (node.lane === "center") return { x: ROOT_POINT.x, y: STAGE_Y[4] - 10 };
    return { x: scaleFromCenterX(742, horizontalScale), y: STAGE_Y[4] };
  }

  return ROOT_POINT;
};

export const getNodeLabel = (node: LandingAspirationNode, point: Point, horizontalScale = 1): LabelGeometry => {
  const labelOffsets: Record<string, { x: number; y: number }> = {
    "aging-biology": { x: 178, y: 12 },
    "ai-research": { x: 128, y: 112 },
    "brain-computer-interface": { x: -184, y: 16 },
    "computational-neuroscience": { x: -128, y: 112 },
    "computer-science-major": { x: 180, y: -18 },
    "entrepreneurship": { x: 178, y: -14 },
    "graduation-2027": { x: 0, y: -132 },
    "life-science-major": { x: -180, y: -18 },
    "longevity": { x: 0, y: 104 },
    "science-student-association": { x: -184, y: -14 },
  };

  const offset = labelOffsets[node.id] ?? { x: 0, y: -108 };
  return createLabel(point, node.label, offset.x * horizontalScale, offset.y);
};

export const buildThreadPath = (
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
  const wave = centerOffset * 7;
  const c1x = from.x + dx * 0.22 + normalX * offsetDistance;
  const c1y = from.y + dy * 0.28 + normalY * (offsetDistance * 0.55 + wave);
  const c2x = from.x + dx * 0.78 + normalX * offsetDistance;
  const c2y = from.y + dy * 0.72 - normalY * (offsetDistance * 0.55 - wave);

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
  if (weight === "trunk") return 0.44;
  if (weight === "branch") return 0.34;
  return 0.22;
};

const getThreadWidth = (weight: LayoutEdge["weight"], faded?: boolean) => {
  if (faded) return 1.1;
  if (weight === "trunk") return 2.2;
  if (weight === "branch") return 1.6;
  return 1.2;
};

const getGlowWidth = (weight: LayoutEdge["weight"], faded?: boolean) => {
  if (faded) return 4.5;
  if (weight === "trunk") return 12;
  if (weight === "branch") return 8;
  return 5;
};

export const computeAspirationLayout = (
  nodes: LandingAspirationNode[],
  edges: LandingAspirationEdge[],
  horizontalScale = 1,
): AspirationLayout => {
  const layoutNodes = nodes.map((node) => {
    const point = getNodePoint(node, horizontalScale);
    return {
      ...node,
      labelBox: getNodeLabel(node, point, horizontalScale),
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
    const spread =
      node.lane === "center"
        ? [-114, 0, 114]
        : node.lane === "left"
          ? [-130, -32, 72]
          : [-72, 32, 130];

    return spread.map((offset, index) => ({
      faded: true,
      from: node.id,
      fromPoint: node.point,
      id: `${node.id}-leaf-${index}`,
      stage: 5,
      to: `${node.id}-leaf-end-${index}`,
      toPoint: {
        x: node.point.x + offset * horizontalScale,
        y: STAGE_Y[5] + Math.abs(offset) * 0.09 + index * 8,
      },
      weight: "thread" as const,
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
};

export const aspirationThreadStyles = {
  getBundleCount,
  getBaseOpacity,
  getThreadWidth,
  getGlowWidth,
};
