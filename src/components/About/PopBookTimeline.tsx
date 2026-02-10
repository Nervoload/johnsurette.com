import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { TimelineScene, timelineScenes } from "./timelineData";

interface PopBookTimelineProps {
  scrollContainer: RefObject<HTMLDivElement>;
}

interface SceneLayer {
  scene: TimelineScene;
  intensity: number;
  shift: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const overlayEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PopBookTimeline: React.FC<PopBookTimelineProps> = ({ scrollContainer }) => {
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

  const count = timelineScenes.length;
  const raw = clamp01(progress) * (count - 1);
  const currentIndex = Math.min(count - 1, Math.floor(raw));
  const nextIndex = Math.min(count - 1, currentIndex + 1);
  const blend = clamp01(raw - currentIndex);
  const crossfadeStart = 0.78;
  const crossfadeBlend = clamp01((blend - crossfadeStart) / (1 - crossfadeStart));

  const currentScene = timelineScenes[currentIndex];
  const nextScene = timelineScenes[nextIndex];
  const primaryScene = crossfadeBlend > 0.5 ? nextScene : currentScene;
  const activeSceneId = crossfadeBlend >= 0.5 ? nextScene.id : currentScene.id;

  const sceneLayers = useMemo<SceneLayer[]>(() => {
    return [
      { scene: currentScene, intensity: 1 - crossfadeBlend, shift: -12 },
      { scene: nextScene, intensity: crossfadeBlend, shift: 18 },
    ];
  }, [crossfadeBlend, currentScene, nextScene]);

  const checkpointProgress = useMemo(() => {
    return timelineScenes.map((_, index) => {
      if (index < currentIndex) return 1;
      if (index === currentIndex) return 1 - crossfadeBlend;
      if (index === nextIndex) return crossfadeBlend;
      return 0;
    });
  }, [crossfadeBlend, currentIndex, nextIndex]);

  const expandedScene = useMemo<TimelineScene | null>(() => {
    if (!expandedSceneId) return null;
    return timelineScenes.find((scene) => scene.id === expandedSceneId) ?? null;
  }, [expandedSceneId]);

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
        className="sticky top-0 z-10 h-screen overflow-hidden"
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
        onPointerCancel={handleStagePointerLeave}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.14),transparent_42%),radial-gradient(circle_at_82%_14%,rgba(99,102,241,0.1),transparent_40%),linear-gradient(145deg,#f8fafc,#e2e8f0)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(248,250,252,0.04),rgba(248,250,252,0.72)_42%,rgba(248,250,252,0.94)_72%)]" />

        {!expandedScene && (
          <aside className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
            <div className="border-l border-slate-300/60 pl-4">
              <ol className="space-y-3">
                {timelineScenes.map((scene, index) => {
                  const active = checkpointProgress[index];
                  return (
                    <li key={`rail-${scene.id}`}>
                      <button
                        type="button"
                        onClick={() => scrollToScene(index)}
                        className={`group flex items-center gap-3 text-left transition ${
                          active > 0.55 ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
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
                  className="group absolute left-1/2 top-[52%] h-[54vh] w-[74vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] border border-slate-300/65 bg-[rgba(248,250,252,0.98)] text-left shadow-[0_28px_80px_-62px_rgba(15,23,42,0.55)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                  style={{
                    opacity: layerOpacity,
                    transform: `translate(-50%, calc(-50% + ${deepOffset * 0.45}px)) scale(${0.93 + layerOpacity * 0.08}) rotateX(var(--about-tilt-x, 0deg)) rotateY(var(--about-tilt-y, 0deg))`,
                    transition: "opacity 180ms linear, transform 180ms linear",
                  }}
                >
                  <div className="absolute inset-x-[5%] top-[12%] h-px bg-slate-300/55" />
                  <div className="absolute inset-x-[5%] bottom-[12%] h-px bg-slate-300/55" />
                  <div className="absolute bottom-[12%] left-[5%] top-[12%] hidden w-px bg-slate-300/45 sm:block" />

                  <div
                    className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10"
                    style={{
                      transform: "translate3d(var(--about-shift-x, 0px), var(--about-shift-y, 0px), 0)",
                      transition: "transform 180ms linear",
                    }}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{scene.year}</p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{scene.title}</h2>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">{scene.summary}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {[0, 1, 2].map((slot) => (
                        <div
                          key={`${scene.id}-${slot}`}
                          className="h-24 rounded-xl border border-slate-300/55"
                          style={{
                            background: `linear-gradient(145deg, ${scene.foreground}22, rgba(255,255,255,0.08))`,
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
          <div className="absolute right-4 top-6 z-30 w-[min(280px,calc(100vw-2rem))] border-t border-slate-300/65 pt-4 sm:right-5 sm:top-8 sm:w-[280px]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Now</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-slate-900">{nowScene?.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{nowScene?.detail.studioNote}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {nowActions.map((action) => (
                <a
                  key={`now-action-${action.path}`}
                  href={action.path}
                  className="rounded-full border border-slate-300/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-500"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {!expandedScene && (
          <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 px-2 py-2 text-xs text-slate-700">
            {timelineScenes.map((scene, index) => {
              const active = checkpointProgress[index];
              return (
                <button
                  key={`checkpoint-${scene.id}`}
                  type="button"
                  onClick={() => scrollToScene(index)}
                  className="group flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-white/55"
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
                  <span className="hidden tracking-wide text-slate-600 sm:inline">{scene.year}</span>
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
                className="absolute inset-0 h-full w-full bg-slate-950/52 backdrop-blur-[2px]"
              />

              <motion.section
                role="dialog"
                aria-modal="true"
                aria-label={`${expandedScene.title} expanded scene`}
                className="absolute inset-3 z-10 overflow-hidden rounded-[2rem] border border-slate-300/65 bg-slate-50 shadow-[0_46px_120px_-74px_rgba(15,23,42,0.78)] sm:inset-6 lg:inset-8"
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.32, ease: overlayEase }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.28),rgba(248,250,252,0.9)_38%,rgba(248,250,252,1)_72%)]" />
                <div className="pointer-events-none absolute inset-x-[-15%] bottom-[-42%] h-[74%] rounded-[100%] bg-[radial-gradient(circle_at_50%_45%,rgba(148,163,184,0.24),rgba(248,250,252,0.02)_68%)] [transform:rotateX(74deg)]" />

                <button
                  type="button"
                  onClick={closeScene}
                  aria-label="Minimize scene"
                  className="absolute left-6 top-6 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/86 text-lg text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                >
                  ←
                </button>

                <div className="relative z-10 grid h-full gap-8 overflow-y-auto p-7 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:p-14">
                  <div className="self-center pt-10 lg:pt-0">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{expandedScene.detail.kicker}</p>
                    <h3 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{expandedScene.title}</h3>
                    <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-700">{expandedScene.detail.body}</p>

                    <div className="mt-7 border-t border-slate-300/65 pt-5">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Studio Note</p>
                      <p className="mt-2 text-sm text-slate-600">{expandedScene.detail.studioNote}</p>
                    </div>

                    {expandedScene.nowActions && expandedScene.nowActions.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {expandedScene.nowActions.map((action) => (
                          <a
                            key={`expanded-action-${action.path}`}
                            href={action.path}
                            className="rounded-full border border-slate-300/70 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-500"
                          >
                            {action.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="relative h-[50vh] w-full max-w-[560px] [perspective:1400px]">
                      <div className="pointer-events-none absolute inset-0 rounded-[1.9rem] border border-slate-300/45 bg-white/66 shadow-[0_56px_120px_-82px_rgba(15,23,42,0.78)] [transform:rotateY(-14deg)_rotateX(7deg)]" />
                      <div
                        className="absolute inset-[6%] rounded-[1.5rem] border border-slate-300/45 [transform:rotateY(-14deg)_rotateX(7deg)]"
                        style={{ background: expandedScene.detail.assetGradient }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.44),rgba(255,255,255,0.06))]" />
                        <div className="absolute inset-0 flex flex-col justify-between p-6">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-700">{expandedScene.detail.assetLabel}</p>
                          <p className="max-w-[14rem] text-xs uppercase tracking-[0.14em] text-slate-600">
                            TODO: replace with scene image or cutout asset.
                          </p>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute -left-4 top-[16%] h-16 w-16 rounded-full border border-slate-300/45" style={{ background: `${expandedScene.foreground}33` }} />
                      <div className="pointer-events-none absolute -right-3 bottom-[14%] h-20 w-20 rounded-[1.15rem] border border-slate-300/45" style={{ background: `${expandedScene.midground}33` }} />
                    </div>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-0">
        {timelineScenes.map((scene, index) => (
          <div
            key={`anchor-${scene.id}`}
            ref={(node) => {
              anchorRefs.current[index] = node;
            }}
            className="flex h-[130vh] snap-start items-end px-6 pb-16"
          >
            <div
              className="mx-auto w-full max-w-4xl border-t border-slate-300/60 py-5 text-slate-600 transition-opacity duration-150"
              style={{ opacity: expandedScene ? 0 : 1 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Checkpoint</p>
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
