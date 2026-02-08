import React, { RefObject, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { timelineScenes } from "./timelineData";

interface PopBookTimelineProps {
  scrollContainer: RefObject<HTMLDivElement>;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const PopBookTimeline: React.FC<PopBookTimelineProps> = ({ scrollContainer }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  const count = timelineScenes.length;
  const raw = clamp01(progress) * (count - 1);
  const currentIndex = Math.min(count - 1, Math.floor(raw));
  const nextIndex = Math.min(count - 1, currentIndex + 1);
  const blend = clamp01(raw - currentIndex);

  const currentScene = timelineScenes[currentIndex];
  const nextScene = timelineScenes[nextIndex];

  const checkpointProgress = useMemo(() => {
    return timelineScenes.map((_, index) => {
      if (index < currentIndex) return 1;
      if (index === currentIndex) return 1 - blend;
      if (index === nextIndex) return blend;
      return 0;
    });
  }, [blend, currentIndex, nextIndex]);

  return (
    <section ref={sectionRef} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_42%),radial-gradient(circle_at_82%_14%,rgba(99,102,241,0.14),transparent_40%),linear-gradient(145deg,#f8fafc,#e2e8f0)]" />

        {[{ scene: currentScene, intensity: 1 - blend, shift: -22 }, { scene: nextScene, intensity: blend, shift: 26 }].map(
          ({ scene, intensity, shift }) => {
            if (!scene || intensity <= 0.001) return null;

            const layerOpacity = clamp01(intensity);
            const deepOffset = (1 - intensity) * shift;

            return (
              <div key={`layer-${scene.id}`} className="pointer-events-none absolute inset-0">
                <div
                  className="absolute inset-0"
                  style={{
                    opacity: layerOpacity * 0.62,
                    background: `radial-gradient(circle at 50% 30%, ${scene.background}, transparent 72%)`,
                    transform: `translateY(${deepOffset * 0.2}px) scale(${1 + intensity * 0.04})`,
                    transition: "opacity 180ms linear, transform 180ms linear",
                  }}
                />

                <div
                  className="absolute left-1/2 top-[52%] h-[54vh] w-[74vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-[2.35rem] border border-slate-200/90 bg-white/80 backdrop-blur-lg"
                  style={{
                    opacity: layerOpacity,
                    transform: `translate(-50%, calc(-50% + ${deepOffset * 0.48}px)) scale(${0.9 + intensity * 0.13})`,
                    boxShadow: `0 24px 64px -44px ${scene.midground}`,
                    transition: "opacity 180ms linear, transform 180ms linear",
                  }}
                >
                  <div
                    className="absolute inset-[8%] rounded-[1.85rem] border border-slate-200/80"
                    style={{
                      background: `linear-gradient(150deg, ${scene.midground}2f, rgba(255,255,255,0.5))`,
                    }}
                  />

                  <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{scene.year}</p>
                      <h2 className="mt-3 text-3xl font-medium text-slate-900 sm:text-4xl">{scene.title}</h2>
                      <p className="mt-4 max-w-2xl text-slate-600">{scene.summary}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {[0, 1, 2].map((slot) => (
                        <div
                          key={`${scene.id}-${slot}`}
                          className="h-24 rounded-2xl border border-slate-200/80"
                          style={{
                            background: `linear-gradient(145deg, ${scene.foreground}4f, rgba(255,255,255,0.55))`,
                            transform: `translateY(${(2 - slot) * (1 - intensity) * 18}px)`,
                            opacity: 0.45 + intensity * 0.5,
                            transition: "opacity 180ms linear, transform 180ms linear",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-xs text-slate-700 shadow-sm backdrop-blur-xl">
          {timelineScenes.map((scene, index) => {
            const active = checkpointProgress[index];
            return (
              <div key={`checkpoint-${scene.id}`} className="flex items-center gap-2">
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
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {timelineScenes.map((scene) => (
          <div key={`anchor-${scene.id}`} className="flex h-[130vh] snap-start items-end px-6 pb-16">
            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Checkpoint</p>
              <p className="mt-2 text-sm">
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
