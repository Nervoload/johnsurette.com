import React, { useEffect, useMemo, useState } from "react";
import { extractSelectionContext } from "./extractSelectionContext";
import { saveSelectionContextReport } from "./saveSelectionContext";
import {
  CapturePreferences,
  Point2D,
  PrecisionLayerId,
  PrecisionProfile,
  RectSnapshot,
  SelectionContextReport,
  SelectionContextSavePaths,
} from "./types";

interface CodexContextInspectorProps {
  currentPath: string;
}

const HOTKEY_CODE = "KeyB";

const normalizeRect = (cornerA: Point2D, cornerB: Point2D): RectSnapshot => {
  const left = Math.min(cornerA.x, cornerB.x);
  const right = Math.max(cornerA.x, cornerB.x);
  const top = Math.min(cornerA.y, cornerB.y);
  const bottom = Math.max(cornerA.y, cornerB.y);

  return {
    left,
    right,
    top,
    bottom,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  };
};

const formatNumber = (value: number): string => Math.round(value).toString();

const formatPath = (path: string | undefined): string => {
  if (!path) return "unknown";
  return path.replace(`${window.location.origin}/`, "");
};

const buildDownloadFileName = (path: string): string => {
  const routeToken = path === "/" ? "home" : path.replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `codex-context-${routeToken || "route"}-${timestamp}.json`;
};

interface PrecisionLayerOption {
  id: PrecisionLayerId;
  label: string;
  description: string;
}

type InspectorSelectionReport = SelectionContextReport & {
  capturePreferences: CapturePreferences;
};

const PRECISION_LAYER_OPTIONS: PrecisionLayerOption[] = [
  {
    id: "probe-metadata",
    label: "Probe metadata",
    description: "Component-owned roles and file hints from explicit probes.",
  },
  {
    id: "runtime-context",
    label: "Runtime context",
    description: "Route state, scroll phase, and live scene context.",
  },
  {
    id: "scene-metadata",
    label: "Scene metadata",
    description: "Registered scene entities and semantic object labels.",
  },
  {
    id: "overlay-state",
    label: "Overlay state",
    description: "Open panels, modal state, and active indices.",
  },
  {
    id: "coarse-shell",
    label: "Coarse shell",
    description: "Sticky canvas bounds and wrapper-level geometry.",
  },
  {
    id: "spatial-anchors",
    label: "Spatial anchors",
    description: "Selection anchors, edge touches, and viewport relation labels.",
  },
];

const PRECISION_PROFILE_PRESETS: Record<Exclude<PrecisionProfile, "custom">, PrecisionLayerId[]> = {
  standard: ["runtime-context", "overlay-state"],
  "scene-rich": ["runtime-context", "scene-metadata", "overlay-state"],
  maximum: ["probe-metadata", "runtime-context", "scene-metadata", "overlay-state", "coarse-shell", "spatial-anchors"],
};

const DEFAULT_PRECISION_PROFILE: PrecisionProfile = "scene-rich";
const OVERLAY_RUNTIME_ROLES = new Set(["overlay-runtime"]);
const COARSE_SHELL_RUNTIME_ROLES = new Set(["sticky-canvas-shell", "navigation-shell", "footer-shell", "backdrop-effect"]);

const clonePresetLayers = (profile: Exclude<PrecisionProfile, "custom">): PrecisionLayerId[] => [
  ...PRECISION_PROFILE_PRESETS[profile],
];

const dedupeLayers = (layers: PrecisionLayerId[]): PrecisionLayerId[] =>
  PRECISION_LAYER_OPTIONS.map((option) => option.id).filter((id) => layers.includes(id));

const shouldIncludeRuntimeEntry = (
  role: string | undefined,
  selectedLayers: PrecisionLayerId[],
): boolean => {
  if (role && OVERLAY_RUNTIME_ROLES.has(role)) {
    return selectedLayers.includes("overlay-state");
  }

  if (role && COARSE_SHELL_RUNTIME_ROLES.has(role)) {
    return selectedLayers.includes("coarse-shell");
  }

  return selectedLayers.includes("runtime-context");
};

const resolvePrecisionProfile = (layers: PrecisionLayerId[]): PrecisionProfile => {
  const normalized = dedupeLayers(layers);

  for (const [profile, presetLayers] of Object.entries(PRECISION_PROFILE_PRESETS)) {
    const normalizedPreset = dedupeLayers(presetLayers);
    if (
      normalized.length === normalizedPreset.length &&
      normalized.every((layerId, index) => layerId === normalizedPreset[index])
    ) {
      return profile as Exclude<PrecisionProfile, "custom">;
    }
  }

  return "custom";
};

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
};

const CodexContextInspector: React.FC<CodexContextInspectorProps> = ({ currentPath }) => {
  const [open, setOpen] = useState(false);
  const [captureMode, setCaptureMode] = useState<"menu" | "drawing" | "review">("menu");
  const [origin, setOrigin] = useState<Point2D | null>(null);
  const [cursor, setCursor] = useState<Point2D | null>(null);
  const [report, setReport] = useState<InspectorSelectionReport | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedPaths, setSavedPaths] = useState<SelectionContextSavePaths | null>(null);
  const [precisionProfile, setPrecisionProfile] = useState<PrecisionProfile>(DEFAULT_PRECISION_PROFILE);
  const [precisionLayers, setPrecisionLayers] = useState<PrecisionLayerId[]>(
    clonePresetLayers(DEFAULT_PRECISION_PROFILE),
  );

  useEffect(() => {
    if (!open) {
      setOrigin(null);
      setCursor(null);
      setReport(null);
      setCaptureMode("menu");
      setCopyState("idle");
      setSaveState("idle");
      setSavedPaths(null);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const isToggleHotkey =
        event.code === HOTKEY_CODE && event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey;

      if (isToggleHotkey) {
        if (isEditableTarget(event.target)) return;
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (event.key === "Escape") {
        if (captureMode !== "menu") {
          event.preventDefault();
          setOrigin(null);
          setCursor(null);
          setReport(null);
          setCopyState("idle");
          setSaveState("idle");
          setSavedPaths(null);
          setCaptureMode("menu");
          return;
        }

        if (report) {
          event.preventDefault();
          setOrigin(null);
          setCursor(null);
          setReport(null);
          setCopyState("idle");
          setSaveState("idle");
          setSavedPaths(null);
          return;
        }

        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [captureMode, report]);

  useEffect(() => {
    if (copyState === "idle") return;
    const timeout = window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const persistReport = async (nextReport: InspectorSelectionReport): Promise<void> => {
    setSaveState("saving");
    setSavedPaths(null);

    try {
      const nextSavedPaths = await saveSelectionContextReport(nextReport);
      setSavedPaths(nextSavedPaths);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const selectionRect = useMemo(() => {
    if (!origin || !cursor) return null;
    return normalizeRect(origin, cursor);
  }, [cursor, origin]);

  const dedupedPrecisionLayers = useMemo(() => dedupeLayers(precisionLayers), [precisionLayers]);

  const buildInspectorReport = (baseReport: SelectionContextReport): InspectorSelectionReport => {
    const capturePreferences: CapturePreferences = {
      precisionProfile,
      precisionLayers: dedupedPrecisionLayers,
    };

    return {
      ...baseReport,
      capturePreferences,
      pageContext: {
        ...baseReport.pageContext,
        runtimeEntries: baseReport.pageContext.runtimeEntries.filter((entry) =>
          shouldIncludeRuntimeEntry(entry.role, capturePreferences.precisionLayers),
        ),
      },
      components: baseReport.components.filter((component) => {
        if (component.source === "scene-metadata") {
          return capturePreferences.precisionLayers.includes("scene-metadata");
        }

        return true;
      }),
    };
  };

  const applyPrecisionProfile = (profile: Exclude<PrecisionProfile, "custom">): void => {
    setPrecisionProfile(profile);
    setPrecisionLayers(clonePresetLayers(profile));
  };

  const togglePrecisionLayer = (layerId: PrecisionLayerId): void => {
    setPrecisionLayers((currentLayers) => {
      const nextLayers = currentLayers.includes(layerId)
        ? currentLayers.filter((candidate) => candidate !== layerId)
        : [...currentLayers, layerId];
      setPrecisionProfile(resolvePrecisionProfile(nextLayers));
      return dedupeLayers(nextLayers);
    });
  };

  const startNextClip = (): void => {
    setOrigin(null);
    setCursor(null);
    setReport(null);
    setCopyState("idle");
    setSaveState("idle");
    setSavedPaths(null);
    setCaptureMode("drawing");
  };

  const cancelDrawing = (): void => {
    setOrigin(null);
    setCursor(null);
    setReport(null);
    setCopyState("idle");
    setSaveState("idle");
    setSavedPaths(null);
    setCaptureMode("menu");
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if ((event.target as HTMLElement).closest("[data-codex-context-panel='true']")) {
      return;
    }

    if (captureMode !== "drawing") {
      return;
    }

    const point = { x: event.clientX, y: event.clientY };

    if (!origin) {
      setOrigin(point);
      setCursor(point);
      setReport(null);
      setSaveState("idle");
      setSavedPaths(null);
      return;
    }

    const nextReport = buildInspectorReport(extractSelectionContext(currentPath, origin, point));
    setCursor(point);
    setReport(nextReport);
    setOrigin(null);
    setCaptureMode("review");
    void persistReport(nextReport);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (captureMode !== "drawing" || !origin) return;
    setCursor({ x: event.clientX, y: event.clientY });
  };

  const handleCopyJson = async (): Promise<void> => {
    if (!report) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  const handleDownloadJson = (): void => {
    if (!report) return;

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = buildDownloadFileName(currentPath);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const beginNewSelection = (): void => {
    startNextClip();
  };

  if (!import.meta.env.DEV || !open) {
    return null;
  }

  const activeRect = report?.selection.rect ?? selectionRect;
  const componentCount = report?.components.length ?? 0;

  return (
    <div
      className={`fixed inset-0 z-[200] ${captureMode === "drawing" ? "cursor-crosshair" : "cursor-default"} theme-overlay-backdrop`}
      data-codex-context-overlay="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <div className="pointer-events-none absolute inset-0">
        {captureMode === "drawing" && activeRect ? (
          <>
            <div
              className="absolute border-2 border-cyan-400 bg-cyan-300/10 shadow-[0_0_0_9999px_rgba(2,6,23,0.38)]"
              style={{
                left: activeRect.left,
                top: activeRect.top,
                width: activeRect.width,
                height: activeRect.height,
              }}
            />
            <div className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200" style={{ left: activeRect.left, top: activeRect.top }} />
            <div className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200" style={{ left: activeRect.right, top: activeRect.bottom }} />
          </>
        ) : null}
      </div>

      <aside
        className="theme-overlay-panel theme-text-primary absolute bottom-4 right-4 z-[201] w-[min(38rem,calc(100vw-2rem))] rounded-3xl border p-4 text-sm backdrop-blur-xl"
        data-codex-context-panel="true"
      >
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-700/90 dark:text-cyan-200/85">Codex Context Inspector</p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">Menu first, then draw the frame</h2>
        <p className="mt-2 leading-relaxed theme-text-muted">
          Press <span className="font-medium theme-text-primary">Option+Shift+B</span> to open the menu. Choose the precision layers you want, then start the next clip from there.
        </p>

        {captureMode === "menu" ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-700/80 dark:text-cyan-200/70">Capture profile</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["standard", "scene-rich", "maximum"] as const).map((profile) => (
                  <button
                    key={profile}
                    type="button"
                    onClick={() => applyPrecisionProfile(profile)}
                    className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                      precisionProfile === profile
                        ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-900 dark:text-cyan-50"
                        : "theme-pill-button"
                    }`}
                  >
                    {profile.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.18em] theme-text-subtle">Precision layers</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {PRECISION_LAYER_OPTIONS.map((option) => {
                  const checked = precisionLayers.includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-transparent bg-black/3 px-3 py-2 transition hover:border-cyan-500/20 hover:bg-cyan-500/5 dark:bg-white/[0.04]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePrecisionLayer(option.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-400 text-cyan-600 focus:ring-cyan-500/60"
                      />
                      <span>
                        <span className="block text-sm font-medium theme-text-primary">{option.label}</span>
                        <span className="block text-xs leading-snug theme-text-muted">{option.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 text-xs theme-text-subtle">
                Selected layers: {dedupedPrecisionLayers.length ? dedupedPrecisionLayers.join(", ") : "none"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.18em] theme-text-subtle">Current context</p>
              <p className="mt-2 text-sm theme-text-primary">
                Page <span className="font-medium">{currentPath}</span>
              </p>
              <p className="mt-1 text-xs theme-text-muted">The frame will be captured on the next two corner clicks.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={startNextClip}
                className="rounded-full border border-cyan-500/40 bg-cyan-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_-18px_rgba(8,145,178,0.95)] transition hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
              >
                Start drawing the next clip
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="theme-overlay-close rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : report ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.18em] theme-text-subtle">Selection</p>
              <p className="mt-2 text-sm theme-text-primary">
                Page <span className="font-medium">{currentPath}</span>, {componentCount} components found.
              </p>
              <p className="mt-1 text-xs theme-text-muted">
                ({formatNumber(report.selection.rect.left)}, {formatNumber(report.selection.rect.top)}) to ({formatNumber(report.selection.rect.right)}, {formatNumber(report.selection.rect.bottom)})
              </p>
              <p className="mt-2 text-xs theme-text-subtle">
                Precision profile: <span className="font-medium theme-text-primary">{report.capturePreferences.precisionProfile}</span>
              </p>
              <p className="mt-1 text-xs theme-text-subtle">
                Precision layers: {report.capturePreferences.precisionLayers.length ? report.capturePreferences.precisionLayers.join(", ") : "none"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.18em] theme-text-subtle">Workspace Save</p>
              {saveState === "saving" ? <p className="mt-2 text-sm theme-text-primary">Saving frame to `dev/codex-context`...</p> : null}
              {saveState === "saved" && savedPaths ? (
                <>
                  <p className="mt-2 text-sm theme-text-primary">Saved to workspace for later Codex review.</p>
                  <p className="mt-1 text-xs theme-text-muted">Latest JSON: {savedPaths.latestJsonPath}</p>
                  <p className="mt-1 text-xs theme-text-muted">Archive JSON: {savedPaths.archiveJsonPath}</p>
                  <p className="mt-1 text-xs theme-text-muted">Suggested markdown pair: {savedPaths.suggestedMarkdownPath}</p>
                </>
              ) : null}
              {saveState === "error" ? (
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-200">
                  Auto-save failed. The frame is still available in this panel, and you can still download the JSON manually.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="theme-pill-button rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition"
              >
                {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy Failed" : "Copy JSON"}
              </button>
              <button
                type="button"
                onClick={handleDownloadJson}
                className="theme-pill-button rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition"
              >
                Download JSON
              </button>
              {saveState === "error" ? (
                <button
                  type="button"
                  onClick={() => void persistReport(report)}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-amber-800 transition hover:bg-amber-500/15 dark:text-amber-100"
                >
                  Retry Save
                </button>
              ) : null}
              <button
                type="button"
                onClick={beginNewSelection}
                className="theme-overlay-close rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition"
              >
                Select Again
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="theme-overlay-close rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition"
              >
                Close
              </button>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {report.components.map((component) => (
                <div key={component.id} className="rounded-2xl border border-white/10 bg-white/50 p-3 dark:bg-white/5">
                  <p className="text-sm font-medium theme-text-primary">{component.componentPathLabel}</p>
                  <p className="mt-1 text-xs theme-text-muted">
                    {formatPath(component.filePath)} • {component.selectionPosition.anchor} of selection • {component.viewportPosition.anchor} in viewport
                  </p>
                  <p className="mt-1 text-xs theme-text-subtle">
                    {component.domIdentifier} • {component.source} • matched nodes {component.matchedElementCount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/50 p-3 text-sm dark:bg-white/5">
            {captureMode === "drawing" ? (
              <>
                <p className="font-medium theme-text-primary">Drawing mode armed</p>
                <p className="mt-1 text-xs theme-text-muted">Click one corner, then click the opposite corner to capture the next frame.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={cancelDrawing}
                    className="theme-overlay-close rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition"
                  >
                    Back to menu
                  </button>
                </div>
                {origin && cursor ? (
                  <p className="mt-3 text-xs theme-text-subtle">
                    Current frame: ({formatNumber(selectionRect?.left ?? 0)}, {formatNumber(selectionRect?.top ?? 0)}) to ({formatNumber(selectionRect?.right ?? 0)}, {formatNumber(selectionRect?.bottom ?? 0)})
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="font-medium theme-text-primary">Menu open</p>
                <p className="mt-1 text-xs theme-text-muted">
                  Choose the capture tiers you want, then press <span className="font-medium theme-text-primary">Start drawing the next clip</span>.
                </p>
              </>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};

export default CodexContextInspector;
