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
  const crossfadeStart = 0.78;
  const crossfadeBlend = clamp01((blend - crossfadeStart) / (1 - crossfadeStart));
  const sceneLayers = [
    { scene: currentScene, intensity: 1 - crossfadeBlend, shift: -12 },
    { scene: nextScene, intensity: crossfadeBlend, shift: 18 },
  ];

  const checkpointProgress = useMemo(() => {
    return timelineScenes.map((_, index) => {
      if (index < currentIndex) return 1;
      if (index === currentIndex) return 1 - crossfadeBlend;
      if (index === nextIndex) return crossfadeBlend;
      return 0;
    });
  }, [crossfadeBlend, currentIndex, nextIndex]);

  return (
    <section ref={sectionRef} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.14),transparent_42%),radial-gradient(circle_at_82%_14%,rgba(99,102,241,0.1),transparent_40%),linear-gradient(145deg,#f8fafc,#e2e8f0)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(248,250,252,0.04),rgba(248,250,252,0.72)_42%,rgba(248,250,252,0.94)_72%)]" />

        {sceneLayers.map(({ scene, intensity, shift }) => {
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
                  className="absolute left-1/2 top-[52%] h-[54vh] w-[74vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] border border-slate-300/65 bg-[rgba(248,250,252,0.98)]"
                  style={{
                    opacity: layerOpacity,
                    transform: `translate(-50%, calc(-50% + ${deepOffset * 0.48}px)) scale(${0.93 + intensity * 0.08})`,
                    transition: "opacity 180ms linear, transform 180ms linear",
                  }}
                >
                  <div className="absolute inset-x-[5%] top-[12%] h-px bg-slate-300/55" />
                  <div className="absolute inset-x-[5%] bottom-[12%] h-px bg-slate-300/55" />
                  <div className="absolute bottom-[12%] left-[5%] top-[12%] hidden w-px bg-slate-300/45 sm:block" />

                  <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10">
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
                            transform: `translateY(${(2 - slot) * (1 - intensity) * 18}px)`,
                            opacity: 0.38 + intensity * 0.52,
                            transition: "opacity 180ms linear, transform 180ms linear",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 px-2 py-2 text-xs text-slate-700">
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
            <div className="mx-auto w-full max-w-4xl border-t border-slate-300/60 py-5 text-slate-600">
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
