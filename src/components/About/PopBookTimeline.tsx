import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { TimelineScene, timelineScenes } from "./timelineData";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../theme/themeMode";

interface PopBookTimelineProps {
  scrollContainer: RefObject<HTMLDivElement>;
  onNavigate?: (path: string, opts?: WipeOptions) => void;
  themeMode: ResolvedThemeMode;
}

interface SceneLayer {
  scene: TimelineScene;
  intensity: number;
  shift: number;
}

interface ScenePalette {
  foreground: string;
  midground: string;
  background: string;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const overlayEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace("#", "").trim();
  const safe = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;
  const parsed = Number.parseInt(safe, 16);
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
};

const toHex = (value: number): string => {
  return Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, "0");
};

const mixHex = (a: string, b: string, alpha: number): string => {
  const t = clamp01(alpha);
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return `#${toHex(ar + (br - ar) * t)}${toHex(ag + (bg - ag) * t)}${toHex(ab + (bb - ab) * t)}`;
};

const withAlpha = (hex: string, alpha: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
};

const resolveScenePalette = (scene: TimelineScene, themeMode: ResolvedThemeMode): ScenePalette => {
  if (themeMode === "light") {
    return {
      foreground: scene.foreground,
      midground: scene.midground,
      background: scene.background,
    };
  }

  return {
    foreground: mixHex(scene.foreground, "#dbeafe", 0.35),
    midground: mixHex(scene.midground, "#67e8f9", 0.22),
    background: mixHex(scene.background, "#020617", 0.9),
  };
};

const PopBookTimeline: React.FC<PopBookTimelineProps> = ({ scrollContainer, onNavigate, themeMode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prefersReducedMotionRef = useRef(false);

  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const [progress, setProgress] = useState(0);
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--about-tilt-x", "0deg");
    stage.style.setProperty("--about-tilt-y", "0deg");
    stage.style.setProperty("--about-shift-x", "0px");
    stage.style.setProperty("--about-shift-y", "0px");
  }, []);

  const setStageTilt = useCallback((x: number, y: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--about-tilt-x", `${(-y * 5).toFixed(2)}deg`);
    stage.style.setProperty("--about-tilt-y", `${(x * 7).toFixed(2)}deg`);
    stage.style.setProperty("--about-shift-x", `${(x * 14).toFixed(2)}px`);
    stage.style.setProperty("--about-shift-y", `${(y * 10).toFixed(2)}px`);
  }, []);

  const updateStageTiltFromClient = useCallback(
    (clientX: number, clientY: number) => {
      if (prefersReducedMotionRef.current || expandedSceneId) return;

      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const nx = clamp01((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = clamp01((clientY - rect.top) / rect.height) * 2 - 1;
      setStageTilt(nx, ny);
    },
    [expandedSceneId, setStageTilt]
  );

  const handleStagePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      updateStageTiltFromClient(event.clientX, event.clientY);
    },
    [updateStageTiltFromClient]
  );

  const handleStagePointerLeave = useCallback(() => {
    setStageTilt(0, 0);
  }, [setStageTilt]);

  const themedScenes = useMemo(() => {
    return timelineScenes.map((scene) => {
      const palette = resolveScenePalette(scene, themeMode);
      return {
        ...scene,
        foreground: palette.foreground,
        midground: palette.midground,
        background: palette.background,
      };
    });
  }, [themeMode]);

  const count = themedScenes.length;
  const raw = clamp01(progress) * (count - 1);
  const currentIndex = Math.min(count - 1, Math.floor(raw));
  const nextIndex = Math.min(count - 1, currentIndex + 1);
  const blend = clamp01(raw - currentIndex);
  const crossfadeStart = 0.78;
  const crossfadeBlend = clamp01((blend - crossfadeStart) / (1 - crossfadeStart));

  const currentScene = themedScenes[currentIndex];
  const nextScene = themedScenes[nextIndex];
  const primaryScene = crossfadeBlend > 0.5 ? nextScene : currentScene;
  const activeSceneId = crossfadeBlend >= 0.5 ? nextScene.id : currentScene.id;

  const sceneLayers = useMemo<SceneLayer[]>(() => {
    return [
      { scene: currentScene, intensity: 1 - crossfadeBlend, shift: -12 },
      { scene: nextScene, intensity: crossfadeBlend, shift: 18 },
    ];
  }, [crossfadeBlend, currentScene, nextScene]);

  const checkpointProgress = useMemo(() => {
    return themedScenes.map((_, index) => {
      if (index < currentIndex) return 1;
      if (index === currentIndex) return 1 - crossfadeBlend;
      if (index === nextIndex) return crossfadeBlend;
      return 0;
    });
  }, [crossfadeBlend, currentIndex, nextIndex, themedScenes]);

  const expandedScene = useMemo<TimelineScene | null>(() => {
    if (!expandedSceneId) return null;
    return themedScenes.find((scene) => scene.id === expandedSceneId) ?? null;
  }, [expandedSceneId, themedScenes]);

  const expandedSceneFacts = useMemo(() => {
    if (!expandedScene) return [];
    return [
      { label: "Year", value: expandedScene.year },
      { label: "Context", value: expandedScene.detail.kicker },
      { label: "Track", value: expandedScene.detail.assetLabel },
    ];
  }, [expandedScene]);

  const scrollToScene = useCallback(
    (index: number) => {
      const container = scrollContainer.current;
      const anchor = anchorRefs.current[index];
      if (!container || !anchor) return;

      const containerRect = container.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const targetTop = container.scrollTop + (anchorRect.top - containerRect.top) - 20;
      container.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    },
    [scrollContainer]
  );

  const openScene = useCallback(
    (sceneId: string) => {
      setExpandedSceneId(sceneId);
      setStageTilt(0, 0);
    },
    [setStageTilt]
  );

  const closeScene = useCallback(() => {
    setExpandedSceneId(null);
    setStageTilt(0, 0);
  }, [setStageTilt]);

  // Escape key to close expanded modal
  useEffect(() => {
    if (!expandedSceneId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeScene();
        return;
      }

      // Focus trap: cycle focus within the modal
      if (e.key === "Tab") {
        const modal = document.querySelector<HTMLElement>('[role="dialog"]');
        if (!modal) return;

        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedSceneId, closeScene]);

  // Auto-focus modal close button when it opens
  useEffect(() => {
    if (!expandedSceneId) return;
    const timer = window.setTimeout(() => {
      const closeBtn = document.querySelector<HTMLElement>('[aria-label="Minimize scene"]');
      closeBtn?.focus();
    }, 360);
    return () => window.clearTimeout(timer);
  }, [expandedSceneId]);

  const nowScene = useMemo<TimelineScene | null>(() => {
    if (currentScene.nowActions && currentScene.nowActions.length > 0) {
      return currentScene;
    }

    if (
      nextScene.nowActions &&
      nextScene.nowActions.length > 0 &&
      (blend > 0.2 || crossfadeBlend > 0.05)
    ) {
      return nextScene;
    }

    if (primaryScene.nowActions && primaryScene.nowActions.length > 0) {
      return primaryScene;
    }

    return null;
  }, [blend, crossfadeBlend, currentScene, nextScene, primaryScene]);

  const nowActions = nowScene?.nowActions ?? [];
  const showNowPanel = Boolean(nowScene) && !expandedScene;

  return (
    <section ref={sectionRef} className="relative">
      <div
        ref={stageRef}
        className="sticky top-0 z-10 h-[100dvh] overflow-hidden"
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
        onPointerCancel={handleStagePointerLeave}
      >
        <div className="theme-about-stage-bg-a pointer-events-none absolute inset-0" />
        <div className="theme-about-stage-bg-b pointer-events-none absolute inset-0" />

        {!expandedScene && (
          <aside className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
            <div className="theme-about-rail pl-4">
              <ol className="space-y-3">
                {themedScenes.map((scene, index) => {
                  const active = checkpointProgress[index];
                  return (
                    <li key={`rail-${scene.id}`}>
                      <button
                        type="button"
                        onClick={() => scrollToScene(index)}
                        className={`group flex items-center gap-3 text-left transition ${
                          active > 0.55 ? "theme-about-rail-active" : "theme-about-rail-idle"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full transition"
                          style={{
                            background: scene.foreground,
                            opacity: 0.28 + active * 0.72,
                            transform: `scale(${0.9 + active * 0.45})`,
                          }}
                        />
                        <span className="text-xs uppercase tracking-[0.14em]">{scene.year}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        )}

        <div className="absolute inset-0 [perspective:1700px]">
          {sceneLayers.map(({ scene, intensity, shift }) => {
            const layerOpacity = clamp01(intensity);
            if (layerOpacity <= 0.001) return null;

            const deepOffset = (1 - layerOpacity) * shift;
            const interactive = scene.id === activeSceneId && !expandedScene;

            return (
              <div
                key={`layer-${scene.id}`}
                className="absolute inset-0"
                style={{ pointerEvents: interactive ? "auto" : "none" }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: layerOpacity * 0.56,
                    background: `radial-gradient(circle at 50% 30%, ${scene.background}, transparent 72%)`,
                    transform: `translateY(${deepOffset * 0.2}px) scale(${1 + layerOpacity * 0.04})`,
                    transition: "opacity 180ms linear, transform 180ms linear",
                  }}
                />

                <button
                  type="button"
                  onClick={() => openScene(scene.id)}
                  aria-label={`Open ${scene.title} timeline scene`}
                  aria-hidden={!interactive}
                  tabIndex={interactive ? 0 : -1}
                  className="theme-about-stage-card group absolute left-1/2 top-[52%] h-[62vh] w-[92vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 sm:h-[54vh] sm:w-[74vw] sm:rounded-[2.2rem]"
                  style={{
                    opacity: layerOpacity,
                    transform: `translate(-50%, calc(-50% + ${deepOffset * 0.45}px)) scale(${0.93 + layerOpacity * 0.08}) rotateX(var(--about-tilt-x, 0deg)) rotateY(var(--about-tilt-y, 0deg))`,
                    transition: "opacity 180ms linear, transform 180ms linear",
                  }}
                >
                  <div className="theme-about-stage-line absolute inset-x-[5%] top-[12%] h-px" />
                  <div className="theme-about-stage-line absolute inset-x-[5%] bottom-[12%] h-px" />
                  <div className="theme-about-stage-line absolute bottom-[12%] left-[5%] top-[12%] hidden w-px sm:block" />

                  <div
                    className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 sm:p-10"
                    style={{
                      transform: "translate3d(var(--about-shift-x, 0px), var(--about-shift-y, 0px), 0)",
                      transition: "transform 180ms linear",
                    }}
                  >
                    <div>
                      <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{scene.year}</p>
                      <h2 className="theme-text-primary mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{scene.title}</h2>
                      <p className="theme-text-muted mt-3 max-w-2xl text-xs leading-relaxed sm:mt-4 sm:text-sm">{scene.summary}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {[0, 1, 2].map((slot) => (
                        <div
                          key={`${scene.id}-${slot}`}
                          className="theme-about-stage-tile h-24 rounded-xl border"
                          style={{
                            background: `linear-gradient(145deg, ${withAlpha(scene.foreground, themeMode === "dark" ? 0.26 : 0.14)}, ${withAlpha(scene.background, themeMode === "dark" ? 0.2 : 0.08)})`,
                            transform: `translateY(${(2 - slot) * (1 - layerOpacity) * 18}px)`,
                            opacity: 0.38 + layerOpacity * 0.52,
                            transition: "opacity 180ms linear, transform 180ms linear",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {showNowPanel && (
          <div className="theme-about-now-panel absolute bottom-20 right-4 z-30 w-[min(250px,calc(100vw-2rem))] border-t pt-4 sm:bottom-auto sm:right-5 sm:top-8 sm:w-[280px]">
            <p className="theme-text-subtle text-[10px] uppercase tracking-[0.18em]">Now</p>
            <p className="theme-text-primary mt-2 text-lg font-semibold tracking-tight">{nowScene?.title}</p>
            <p className="theme-text-muted mt-2 text-xs leading-relaxed">{nowScene?.detail.studioNote}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {nowActions.map((action) => (
                <button
                  key={`now-action-${action.path}`}
                  type="button"
                  onClick={() => onNavigate?.(action.path)}
                  className="theme-about-action-pill rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!expandedScene && (
          <div className="theme-about-checkpoint-bar absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 px-2 py-2 text-xs">
            {themedScenes.map((scene, index) => {
              const active = checkpointProgress[index];
              return (
                <button
                  key={`checkpoint-${scene.id}`}
                  type="button"
                  onClick={() => scrollToScene(index)}
                  className="theme-about-checkpoint-pill group flex items-center gap-2 rounded-full px-2 py-1 transition"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: scene.foreground,
                      opacity: 0.28 + active * 0.72,
                      transform: `scale(${0.9 + active * 0.5})`,
                      transition: "opacity 180ms linear, transform 180ms linear",
                    }}
                  />
                  <span className="theme-text-muted hidden tracking-wide sm:inline">{scene.year}</span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {expandedScene && (
            <motion.div
              className="absolute inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: overlayEase }}
            >
              <button
                type="button"
                aria-label="Close expanded scene"
                onClick={closeScene}
                className="theme-about-modal-backdrop absolute inset-0 h-full w-full backdrop-blur-[2px]"
              />

              <motion.section
                role="dialog"
                aria-modal="true"
                aria-label={`${expandedScene.title} expanded scene`}
                className="theme-about-modal-panel absolute inset-3 z-10 overflow-hidden rounded-[2rem] border sm:inset-6 lg:inset-8"
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.32, ease: overlayEase }}
              >
                <div className="theme-about-modal-glass-a pointer-events-none absolute inset-0" />
                <div className="theme-about-modal-glass-b pointer-events-none absolute inset-x-[-15%] bottom-[-42%] h-[74%] rounded-[100%] [transform:rotateX(74deg)]" />

                <button
                  type="button"
                  onClick={closeScene}
                  aria-label="Minimize scene"
                  className="theme-about-modal-close absolute left-6 top-6 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border text-lg transition"
                >
                  ←
                </button>

                <div className="relative z-10 grid h-full gap-8 overflow-y-auto p-7 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:p-14">
                  <div className="self-center pt-10 lg:pt-0">
                    <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{expandedScene.detail.kicker}</p>
                    <h3 className="theme-text-primary mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{expandedScene.title}</h3>
                    <p className="theme-text-muted mt-6 max-w-xl text-[15px] leading-relaxed">{expandedScene.detail.body}</p>

                    <div className="theme-border-subtle mt-7 border-t pt-5">
                      <p className="theme-text-subtle text-[11px] uppercase tracking-[0.16em]">Studio Note</p>
                      <p className="theme-text-muted mt-2 text-sm">{expandedScene.detail.studioNote}</p>
                    </div>

                    {expandedScene.nowActions && expandedScene.nowActions.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {expandedScene.nowActions.map((action) => (
                          <button
                            key={`expanded-action-${action.path}`}
                            type="button"
                            onClick={() => {
                              closeScene();
                              onNavigate?.(action.path);
                            }}
                            className="theme-about-action-pill rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="relative h-[50vh] w-full max-w-[560px] [perspective:1400px]">
                      <div className="theme-about-asset-shell pointer-events-none absolute inset-0 rounded-[1.9rem] border [transform:rotateY(-14deg)_rotateX(7deg)]" />
                      <div
                        className="theme-about-asset-frame absolute inset-[6%] rounded-[1.5rem] border [transform:rotateY(-14deg)_rotateX(7deg)]"
                        style={{ background: expandedScene.detail.assetGradient }}
                      >
                        <div className="theme-about-asset-overlay absolute inset-0" />
                        <div className="absolute inset-0 flex flex-col justify-between p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="theme-text-primary text-xs uppercase tracking-[0.2em]">
                                {expandedScene.detail.assetLabel}
                              </p>
                              <p className="theme-text-primary mt-3 text-3xl font-semibold tracking-tight">
                                {expandedScene.year}
                              </p>
                            </div>

                            <div
                              className="theme-border-subtle max-w-[11rem] rounded-[1.15rem] border px-3 py-2 text-right backdrop-blur-sm"
                              style={{
                                background: withAlpha(
                                  expandedScene.background,
                                  themeMode === "dark" ? 0.2 : 0.54,
                                ),
                              }}
                            >
                              <p className="theme-text-subtle text-[10px] uppercase tracking-[0.16em]">Context</p>
                              <p className="theme-text-primary mt-1 text-sm font-medium leading-tight">
                                {expandedScene.detail.kicker}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div
                              className="theme-border-subtle rounded-[1.3rem] border p-4 backdrop-blur-sm"
                              style={{
                                background: `linear-gradient(145deg, ${withAlpha(
                                  expandedScene.foreground,
                                  themeMode === "dark" ? 0.18 : 0.12,
                                )}, ${withAlpha(expandedScene.background, themeMode === "dark" ? 0.2 : 0.66)})`,
                              }}
                            >
                              <p className="theme-text-subtle text-[10px] uppercase tracking-[0.16em]">Scene Summary</p>
                              <p className="theme-text-primary mt-2 text-sm leading-relaxed">
                                {expandedScene.summary}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              {expandedSceneFacts.map((fact) => (
                                <div
                                  key={`${expandedScene.id}-${fact.label}`}
                                  className="theme-border-subtle rounded-[1rem] border p-3 backdrop-blur-sm"
                                  style={{
                                    background: withAlpha(
                                      expandedScene.background,
                                      themeMode === "dark" ? 0.14 : 0.46,
                                    ),
                                  }}
                                >
                                  <p className="theme-text-subtle text-[10px] uppercase tracking-[0.16em]">
                                    {fact.label}
                                  </p>
                                  <p className="theme-text-primary mt-1 text-xs font-medium leading-tight">
                                    {fact.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="theme-about-asset-orb pointer-events-none absolute -left-4 top-[16%] h-16 w-16 rounded-full border"
                        style={{ background: withAlpha(expandedScene.foreground, themeMode === "dark" ? 0.28 : 0.2) }}
                      />
                      <div
                        className="theme-about-asset-orb pointer-events-none absolute -right-3 bottom-[14%] h-20 w-20 rounded-[1.15rem] border"
                        style={{ background: withAlpha(expandedScene.midground, themeMode === "dark" ? 0.28 : 0.2) }}
                      />
                    </div>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-0">
        {themedScenes.map((scene, index) => (
          <div
            key={`anchor-${scene.id}`}
            ref={(node) => {
              anchorRefs.current[index] = node;
            }}
            className="flex h-[112vh] snap-start items-end px-6 pb-16 sm:h-[118vh]"
          >
            <div
              className="theme-about-checkpoint-row theme-text-muted mx-auto w-full max-w-4xl border-t py-5 transition-opacity duration-150"
              style={{ opacity: expandedScene ? 0 : 1 }}
            >
              <p className="theme-text-subtle text-xs uppercase tracking-[0.2em]">Checkpoint</p>
              <p className="mt-2 text-sm tracking-wide">
                {scene.year} · {scene.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopBookTimeline;
