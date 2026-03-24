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
export const VIEWBOX_HEIGHT = 1500;

export const ROOT_POINT: Point = { x: 500, y: 120 };

const STAGE_Y: Record<number, number> = {
  0: 120,
  1: 330,
  2: 560,
  3: 820,
  4: 1075,
  5: 1380,
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
  const width = clamp(label.length * 8.4 + 56, 192, 286);
  const height = lines.length > 1 ? 78 : 58;

  if (align === "center") {
    const top =
      verticalPlacement === "above"
        ? point.y - height - 42
        : verticalPlacement === "below"
          ? point.y + 42
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
    const left = clamp(point.x - width - 44, 20, VIEWBOX_WIDTH - width - 20);
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

  const left = clamp(point.x + 44, 20, VIEWBOX_WIDTH - width - 20);
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

export const getNodePoint = (node: LandingAspirationNode): Point => {
  if (node.stage === 1) {
    return node.lane === "left" ? { x: 286, y: STAGE_Y[1] } : { x: 714, y: STAGE_Y[1] };
  }

  if (node.stage === 2) {
    if (node.id === "science-student-association") return { x: 210, y: STAGE_Y[2] };
    if (node.id === "computational-neuroscience") return { x: 392, y: STAGE_Y[2] - 24 };
    if (node.id === "ai-research") return { x: 608, y: STAGE_Y[2] - 24 };
    return { x: 790, y: STAGE_Y[2] };
  }

  if (node.stage === 3) {
    return { x: 500, y: STAGE_Y[3] };
  }

  if (node.stage === 4) {
    if (node.lane === "left") return { x: 258, y: STAGE_Y[4] };
    if (node.lane === "center") return { x: 500, y: STAGE_Y[4] - 10 };
    return { x: 742, y: STAGE_Y[4] };
  }

  return ROOT_POINT;
};

export const getNodeLabel = (node: LandingAspirationNode, point: Point): LabelGeometry => {
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
): AspirationLayout => {
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
    const spread =
      node.lane === "center"
        ? [-88, 0, 88]
        : node.lane === "left"
          ? [-100, -24, 56]
          : [-56, 24, 100];

    return spread.map((offset, index) => ({
      faded: true,
      from: node.id,
      fromPoint: node.point,
      id: `${node.id}-leaf-${index}`,
      stage: 5,
      to: `${node.id}-leaf-end-${index}`,
      toPoint: {
        x: node.point.x + offset,
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
