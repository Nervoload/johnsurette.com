import {
  CodexProbeDescriptor,
  ContextDiscoverySource,
  FilePathSource,
  Point2D,
  ReactOwnerSnapshot,
  RectSnapshot,
  RelativeSelectionDescription,
  RenderSourceSnapshot,
  RuntimeSceneEntitySnapshot,
  RuntimeContextEntrySnapshot,
  SelectionComponentSnapshot,
  SelectionContextReport,
  ScrollContainerSnapshot,
  SpatialBand,
  SpatialDescription,
  VerticalBand,
} from "./types";
import { readRuntimeRegistrySnapshot } from "./runtimeRegistry";

interface SelectionBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface ReactFiberLike {
  return?: ReactFiberLike | null;
  type?: unknown;
  elementType?: unknown;
  _debugSource?: {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
}

interface ReactElementContext {
  componentName: string;
  componentPath: string[];
  ownerChain: ReactOwnerSnapshot[];
  renderSource?: RenderSourceSnapshot;
}

interface AccumulatedComponent {
  id: string;
  source: ContextDiscoverySource;
  filePathSource?: FilePathSource;
  componentName: string;
  componentPath: string[];
  filePath?: string;
  role?: string;
  domTag: string;
  domIdentifier: string;
  renderSource?: RenderSourceSnapshot;
  ownerChain: ReactOwnerSnapshot[];
  rect: RectSnapshot;
  matchedElementCount: number;
}

const EDGE_THRESHOLD_PX = 32;
const SELECTION_MIN_SIZE = 2;
const TOOL_SELECTOR = "[data-codex-context-overlay='true']";
const SKIPPED_COMPONENT_NAMES = new Set([
  "AnimatePresence",
  "MotionComponent",
  "PresenceChild",
  "PopChild",
  "Suspense",
]);

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const toRectSnapshot = (bounds: SelectionBounds): RectSnapshot => ({
  left: bounds.left,
  top: bounds.top,
  right: bounds.right,
  bottom: bounds.bottom,
  width: Math.max(0, bounds.right - bounds.left),
  height: Math.max(0, bounds.bottom - bounds.top),
  centerX: (bounds.left + bounds.right) / 2,
  centerY: (bounds.top + bounds.bottom) / 2,
});

const normalizeSelectionBounds = (cornerA: Point2D, cornerB: Point2D): SelectionBounds => {
  const left = Math.min(cornerA.x, cornerB.x);
  const right = Math.max(cornerA.x, cornerB.x);
  const top = Math.min(cornerA.y, cornerB.y);
  const bottom = Math.max(cornerA.y, cornerB.y);

  return {
    left,
    top,
    right,
    bottom,
  };
};

const fromDomRect = (rect: DOMRect): RectSnapshot =>
  toRectSnapshot({
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  });

const unionRects = (a: RectSnapshot, b: RectSnapshot): RectSnapshot =>
  toRectSnapshot({
    left: Math.min(a.left, b.left),
    top: Math.min(a.top, b.top),
    right: Math.max(a.right, b.right),
    bottom: Math.max(a.bottom, b.bottom),
  });

const intersectRects = (a: RectSnapshot, b: RectSnapshot): RectSnapshot | null => {
  const left = Math.max(a.left, b.left);
  const right = Math.min(a.right, b.right);
  const top = Math.max(a.top, b.top);
  const bottom = Math.min(a.bottom, b.bottom);

  if (right - left < SELECTION_MIN_SIZE || bottom - top < SELECTION_MIN_SIZE) {
    return null;
  }

  return toRectSnapshot({ left, top, right, bottom });
};

const getBand = (ratio: number): SpatialBand => {
  if (ratio < 1 / 3) return "left";
  if (ratio > 2 / 3) return "right";
  return "center";
};

const getVerticalBand = (ratio: number): VerticalBand => {
  if (ratio < 1 / 3) return "top";
  if (ratio > 2 / 3) return "bottom";
  return "center";
};

const buildAnchor = (vertical: VerticalBand, horizontal: SpatialBand): string => {
  if (vertical === "center" && horizontal === "center") {
    return "center";
  }

  if (vertical === "center") {
    return horizontal;
  }

  if (horizontal === "center") {
    return vertical;
  }

  return `${vertical}-${horizontal}`;
};

const describeRectWithinBounds = (
  rect: RectSnapshot,
  bounds: SelectionBounds,
  includeEdges: boolean,
): SpatialDescription => {
  const width = Math.max(1, bounds.right - bounds.left);
  const height = Math.max(1, bounds.bottom - bounds.top);
  const centerRatioX = clamp01((rect.centerX - bounds.left) / width);
  const centerRatioY = clamp01((rect.centerY - bounds.top) / height);
  const horizontal = getBand(centerRatioX);
  const vertical = getVerticalBand(centerRatioY);
  const edgeTouches: string[] = [];

  if (includeEdges) {
    if (rect.top <= bounds.top + EDGE_THRESHOLD_PX) edgeTouches.push("top");
    if (rect.bottom >= bounds.bottom - EDGE_THRESHOLD_PX) edgeTouches.push("bottom");
    if (rect.left <= bounds.left + EDGE_THRESHOLD_PX) edgeTouches.push("left");
    if (rect.right >= bounds.right - EDGE_THRESHOLD_PX) edgeTouches.push("right");
  }

  return {
    horizontal,
    vertical,
    anchor: buildAnchor(vertical, horizontal),
    edgeTouches,
    centerRatioX,
    centerRatioY,
  };
};

const describeRelativeToSelection = (rect: RectSnapshot, selectionRect: RectSnapshot): RelativeSelectionDescription => {
  const overlapRect = intersectRects(rect, selectionRect);
  const overlapArea = overlapRect ? overlapRect.width * overlapRect.height : 0;
  const selectionArea = Math.max(1, selectionRect.width * selectionRect.height);
  const componentArea = Math.max(1, rect.width * rect.height);
  const fullyInsideSelection =
    rect.left >= selectionRect.left &&
    rect.right <= selectionRect.right &&
    rect.top >= selectionRect.top &&
    rect.bottom <= selectionRect.bottom;
  const selectionInsideComponent =
    selectionRect.left >= rect.left &&
    selectionRect.right <= rect.right &&
    selectionRect.top >= rect.top &&
    selectionRect.bottom <= rect.bottom;
  const spatial = describeRectWithinBounds(
    rect,
    {
      left: selectionRect.left,
      right: selectionRect.right,
      top: selectionRect.top,
      bottom: selectionRect.bottom,
    },
    false,
  );

  return {
    containment: fullyInsideSelection
      ? "inside-selection"
      : selectionInsideComponent
        ? "contains-selection"
        : "intersects-selection",
    horizontal: spatial.horizontal,
    vertical: spatial.vertical,
    anchor: spatial.anchor,
    overlapRatioWithinSelection: clamp01(overlapArea / selectionArea),
    overlapRatioWithinComponent: clamp01(overlapArea / componentArea),
  };
};

const getFiberNode = (element: HTMLElement): ReactFiberLike | null => {
  const fiberKey = Object.keys(element).find(
    (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"),
  );

  if (!fiberKey) {
    return null;
  }

  const fiber = (element as HTMLElement & Record<string, unknown>)[fiberKey];
  return fiber && typeof fiber === "object" ? (fiber as ReactFiberLike) : null;
};

const getComponentNameFromType = (type: unknown): string | null => {
  if (!type || typeof type === "string") return null;

  if (typeof type === "function") {
    const maybeFunction = type as Function & { displayName?: string };
    return maybeFunction.displayName || maybeFunction.name || null;
  }

  if (typeof type === "object") {
    const maybeObject = type as {
      displayName?: string;
      name?: string;
      render?: { displayName?: string; name?: string };
      type?: unknown;
    };

    if (maybeObject.displayName) return maybeObject.displayName;
    if (maybeObject.render?.displayName) return maybeObject.render.displayName;
    if (maybeObject.render?.name) return maybeObject.render.name;
    if (maybeObject.name) return maybeObject.name;

    if (maybeObject.type) {
      return getComponentNameFromType(maybeObject.type);
    }
  }

  return null;
};

const toRenderSourceSnapshot = (fiber: ReactFiberLike | null | undefined): RenderSourceSnapshot | undefined => {
  const fileName = fiber?._debugSource?.fileName;
  if (!fileName) return undefined;

  return {
    filePath: fileName,
    lineNumber: fiber?._debugSource?.lineNumber,
    columnNumber: fiber?._debugSource?.columnNumber,
  };
};

const extractReactContext = (element: HTMLElement): ReactElementContext | null => {
  const hostFiber = getFiberNode(element);
  if (!hostFiber) return null;

  const renderSource = toRenderSourceSnapshot(hostFiber);
  const componentNames: string[] = [];
  let current: ReactFiberLike | null | undefined = hostFiber.return;

  while (current) {
    const name = getComponentNameFromType(current.type ?? current.elementType);
    if (name && !SKIPPED_COMPONENT_NAMES.has(name)) {
      const previousName = componentNames[componentNames.length - 1];
      if (previousName !== name) {
        componentNames.push(name);
      }
    }
    current = current.return;
  }

  if (componentNames.length === 0) {
    return null;
  }

  const componentPath = [...componentNames].reverse();
  const componentName = componentPath[componentPath.length - 1];

  return {
    componentName,
    componentPath,
    ownerChain: componentPath.map((entry) => ({ componentName: entry })),
    renderSource,
  };
};

const parseCodexProbeDescriptor = (element: HTMLElement): CodexProbeDescriptor | null => {
  if (element.dataset.codexProbe !== "true") return null;

  const componentName = element.dataset.codexComponent;
  const filePath = element.dataset.codexFile;

  if (!componentName || !filePath) return null;

  const componentPath = element.dataset.codexPath
    ?.split(">")
    .map((segment) => segment.trim())
    .filter(Boolean);

  return {
    componentName,
    filePath,
    componentPath,
    role: element.dataset.codexRole,
  };
};

const describeDomIdentifier = (element: HTMLElement): string => {
  const idPart = element.id ? `#${element.id}` : "";
  const classPart = element.classList.length > 0 ? `.${Array.from(element.classList).slice(0, 3).join(".")}` : "";
  return `${element.tagName.toLowerCase()}${idPart}${classPart}`;
};

const shouldSkipElement = (element: HTMLElement, rect: RectSnapshot): boolean => {
  if (element.closest(TOOL_SELECTOR)) return true;
  if (rect.width < SELECTION_MIN_SIZE || rect.height < SELECTION_MIN_SIZE) return true;

  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return true;
  if (style.pointerEvents === "none" && element.children.length === 0 && element.dataset.codexProbe !== "true") return true;

  return false;
};

const buildComponentId = (
  source: ContextDiscoverySource,
  componentName: string,
  componentPath: string[],
  filePath?: string,
  role?: string,
): string => {
  return [source, filePath ?? "unknown-file", componentName, componentPath.join(">"), role ?? ""].join("::");
};

const accumulateComponent = (
  collection: Map<string, AccumulatedComponent>,
  element: HTMLElement,
  rect: RectSnapshot,
  probe: CodexProbeDescriptor | null,
  reactContext: ReactElementContext | null,
): void => {
  if (!probe && !reactContext) return;

  const source: ContextDiscoverySource = probe && reactContext ? "probe+react-fiber" : probe ? "probe" : "react-fiber";
  const componentName = probe?.componentName ?? reactContext?.componentName;
  const componentPath = probe?.componentPath ?? reactContext?.componentPath ?? (componentName ? [componentName] : []);
  const filePath = probe?.filePath ?? reactContext?.renderSource?.filePath;
  const filePathSource: FilePathSource | undefined = probe?.filePath
    ? "probe"
    : reactContext?.renderSource?.filePath
      ? "react-host-source"
      : undefined;

  if (!componentName || componentPath.length === 0) return;

  const id = buildComponentId(source, componentName, componentPath, filePath, probe?.role);
  const existing = collection.get(id);

  if (existing) {
    existing.rect = unionRects(existing.rect, rect);
    existing.matchedElementCount += 1;
    return;
  }

  collection.set(id, {
    id,
    source,
    filePathSource,
    componentName,
    componentPath,
    filePath,
    role: probe?.role,
    domTag: element.tagName.toLowerCase(),
    domIdentifier: describeDomIdentifier(element),
    renderSource: reactContext?.renderSource,
    ownerChain: reactContext?.ownerChain ?? componentPath.map((entry) => ({ componentName: entry })),
    rect,
    matchedElementCount: 1,
  });
};

const finalizeComponentSnapshot = (
  component: AccumulatedComponent,
  selectionRect: RectSnapshot,
  viewportBounds: SelectionBounds,
): SelectionComponentSnapshot | null => {
  const intersectionRect = intersectRects(component.rect, selectionRect);
  if (!intersectionRect) return null;

  return {
    id: component.id,
    source: component.source,
    filePathSource: component.filePathSource,
    componentName: component.componentName,
    componentPath: component.componentPath,
    componentPathLabel: component.componentPath.join(" > "),
    filePath: component.filePath,
    role: component.role,
    domTag: component.domTag,
    domIdentifier: component.domIdentifier,
    rect: component.rect,
    intersectionRect,
    viewportPosition: describeRectWithinBounds(component.rect, viewportBounds, true),
    selectionPosition: describeRelativeToSelection(component.rect, selectionRect),
    renderSource: component.renderSource,
    ownerChain: component.ownerChain,
    matchedElementCount: component.matchedElementCount,
  };
};

const buildSceneComponentSnapshot = (
  entity: RuntimeSceneEntitySnapshot,
  selectionRect: RectSnapshot,
  viewportBounds: SelectionBounds,
): SelectionComponentSnapshot | null => {
  const intersectionRect = intersectRects(entity.rect, selectionRect);
  if (!intersectionRect) return null;

  return {
    id: entity.id,
    source: "scene-metadata",
    filePathSource: "runtime-metadata",
    componentName: entity.componentName,
    componentPath: entity.componentPath,
    componentPathLabel: entity.componentPath.join(" > "),
    filePath: entity.filePath,
    role: entity.role,
    domTag: entity.domTag ?? "scene-entity",
    domIdentifier: entity.domIdentifier ?? entity.id,
    rect: entity.rect,
    intersectionRect,
    viewportPosition: describeRectWithinBounds(entity.rect, viewportBounds, true),
    selectionPosition: describeRelativeToSelection(entity.rect, selectionRect),
    ownerChain: entity.componentPath.map((entry) => ({ componentName: entry })),
    matchedElementCount: 1,
    metadata: entity.metadata,
  };
};

const readScrollContainerSnapshots = (): ScrollContainerSnapshot[] => {
  const containers = Array.from(document.querySelectorAll<HTMLElement>("[data-codex-scroll-container]"));

  return containers
    .map((container, index) => {
      const rect = fromDomRect(container.getBoundingClientRect());
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      if (!isVisible) return null;

      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const componentName = container.dataset.codexComponent ?? "ScrollContainer";
      const componentPathLabel = container.dataset.codexPath ?? componentName;
      const id = container.dataset.codexScrollContainer ?? `${componentName}-${index}`;

      return {
        id,
        componentName,
        componentPathLabel,
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
        maxScrollTop,
        scrollProgress: maxScrollTop > 0 ? clamp01(container.scrollTop / maxScrollTop) : 0,
        viewportRect: rect,
      };
    })
    .filter((entry): entry is ScrollContainerSnapshot => Boolean(entry));
};

export const extractSelectionContext = (
  currentPath: string,
  cornerA: Point2D,
  cornerB: Point2D,
): SelectionContextReport => {
  const viewportBounds: SelectionBounds = {
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
  const selectionBounds = normalizeSelectionBounds(cornerA, cornerB);
  const selectionRect = toRectSnapshot(selectionBounds);
  const componentMap = new Map<string, AccumulatedComponent>();
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>("*"));
  const runtimeRegistry = readRuntimeRegistrySnapshot(currentPath);
  const scrollContainers = readScrollContainerSnapshots();

  for (const element of elements) {
    const rect = fromDomRect(element.getBoundingClientRect());
    if (shouldSkipElement(element, rect)) continue;
    if (!intersectRects(rect, selectionRect)) continue;

    const probe = parseCodexProbeDescriptor(element);
    const reactContext = extractReactContext(element);
    accumulateComponent(componentMap, element, rect, probe, reactContext);
  }

  const domComponents = Array.from(componentMap.values())
    .map((component) => finalizeComponentSnapshot(component, selectionRect, viewportBounds))
    .filter((component): component is SelectionComponentSnapshot => Boolean(component))
  const sceneComponents = runtimeRegistry.sceneEntities
    .map((entity) => buildSceneComponentSnapshot(entity, selectionRect, viewportBounds))
    .filter((component): component is SelectionComponentSnapshot => Boolean(component));
  const sourcePriority: Record<ContextDiscoverySource, number> = {
    "scene-metadata": 0,
    "probe+react-fiber": 1,
    probe: 2,
    "react-fiber": 3,
  };

  const components = [...sceneComponents, ...domComponents]
    .sort((a, b) => {
      const sourceDelta = sourcePriority[a.source] - sourcePriority[b.source];
      if (sourceDelta !== 0) return sourceDelta;
      const areaA = a.intersectionRect.width * a.intersectionRect.height;
      const areaB = b.intersectionRect.width * b.intersectionRect.height;
      return areaB - areaA;
    });

  return {
    kind: "codex-selection-context",
    version: 1,
    createdAt: new Date().toISOString(),
    page: {
      path: currentPath,
      url: window.location.href,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    },
    selection: {
      corners: [cornerA, cornerB],
      rect: selectionRect,
      viewportPosition: describeRectWithinBounds(selectionRect, viewportBounds, true),
    },
    pageContext: {
      scrollContainers,
      runtimeEntries: runtimeRegistry.runtimeEntries as RuntimeContextEntrySnapshot[],
    },
    components,
  };
};
