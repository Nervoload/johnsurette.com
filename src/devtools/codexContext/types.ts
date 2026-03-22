export interface Point2D {
  x: number;
  y: number;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface RectSnapshot {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export type PrecisionLayerId =
  | "probe-metadata"
  | "runtime-context"
  | "scene-metadata"
  | "overlay-state"
  | "coarse-shell"
  | "spatial-anchors";

export type PrecisionProfile = "standard" | "scene-rich" | "maximum" | "custom";

export interface CapturePreferences {
  precisionProfile: PrecisionProfile;
  precisionLayers: PrecisionLayerId[];
}

export type SpatialBand = "left" | "center" | "right";
export type VerticalBand = "top" | "center" | "bottom";
export type SelectionContainment = "inside-selection" | "contains-selection" | "intersects-selection";

export interface SpatialDescription {
  horizontal: SpatialBand;
  vertical: VerticalBand;
  anchor: string;
  edgeTouches: string[];
  centerRatioX: number;
  centerRatioY: number;
}

export interface RelativeSelectionDescription {
  containment: SelectionContainment;
  horizontal: SpatialBand;
  vertical: VerticalBand;
  anchor: string;
  overlapRatioWithinSelection: number;
  overlapRatioWithinComponent: number;
}

export interface CodexProbeDescriptor {
  componentName: string;
  filePath: string;
  componentPath?: string[];
  role?: string;
}

export interface ReactOwnerSnapshot {
  componentName: string;
}

export interface RenderSourceSnapshot {
  filePath: string;
  lineNumber?: number;
  columnNumber?: number;
}

export type ContextDiscoverySource = "probe" | "react-fiber" | "probe+react-fiber" | "scene-metadata";
export type FilePathSource = "probe" | "react-host-source" | "runtime-metadata";

export interface RuntimeSceneEntitySnapshot {
  pagePath: string;
  id: string;
  componentName: string;
  componentPath: string[];
  filePath: string;
  role?: string;
  rect: RectSnapshot;
  domTag?: string;
  domIdentifier?: string;
  metadata?: JsonObject;
}

export interface RuntimeContextEntrySnapshot {
  pagePath: string;
  id: string;
  componentName: string;
  componentPath: string[];
  filePath: string;
  role?: string;
  metadata: JsonObject;
}

export interface ScrollContainerSnapshot {
  id: string;
  componentName: string;
  componentPathLabel: string;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  maxScrollTop: number;
  scrollProgress: number;
  viewportRect: RectSnapshot;
}

export interface SelectionComponentSnapshot {
  id: string;
  source: ContextDiscoverySource;
  filePathSource?: FilePathSource;
  componentName: string;
  componentPath: string[];
  componentPathLabel: string;
  filePath?: string;
  role?: string;
  domTag: string;
  domIdentifier: string;
  rect: RectSnapshot;
  intersectionRect: RectSnapshot;
  viewportPosition: SpatialDescription;
  selectionPosition: RelativeSelectionDescription;
  renderSource?: RenderSourceSnapshot;
  ownerChain: ReactOwnerSnapshot[];
  matchedElementCount: number;
  metadata?: JsonObject;
}

export interface SelectionContextReport {
  kind: "codex-selection-context";
  version: 1;
  createdAt: string;
  page: {
    path: string;
    url: string;
  };
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  selection: {
    corners: [Point2D, Point2D];
    rect: RectSnapshot;
    viewportPosition: SpatialDescription;
  };
  capturePreferences?: CapturePreferences;
  pageContext: {
    scrollContainers: ScrollContainerSnapshot[];
    runtimeEntries: RuntimeContextEntrySnapshot[];
  };
  components: SelectionComponentSnapshot[];
}

export interface SelectionContextSavePaths {
  archiveJsonPath: string;
  latestJsonPath: string;
  suggestedMarkdownPath: string;
  indexPath: string;
}
