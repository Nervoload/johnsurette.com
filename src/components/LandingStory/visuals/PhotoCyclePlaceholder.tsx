import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LandingPhotoPlaceholder } from "../../../content";

interface PhotoCyclePlaceholderProps {
  photos: LandingPhotoPlaceholder[];
}

const fallbackPalette = ["#0f172a", "#334155", "#e2e8f0"];

const PhotoCyclePlaceholder: React.FC<PhotoCyclePlaceholderProps> = ({ photos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (photos.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % photos.length);
    }, prefersReducedMotion ? 5200 : 4600);

    return () => window.clearInterval(timer);
  }, [photos.length, prefersReducedMotion]);

  const activePhoto = photos[Math.min(activeIndex, Math.max(photos.length - 1, 0))];
  const palette = activePhoto?.palette ?? fallbackPalette;
  const gradientStops = useMemo(
    () => [
      { offset: "0%", color: palette[0] },
      { offset: "54%", color: palette[1] },
      { offset: "100%", color: palette[2] },
    ],
    [palette],
  );

  return (
    <div className="relative mx-auto aspect-[0.92] w-full max-w-[38rem] overflow-hidden">
      <div className="absolute inset-x-[12%] top-[10%] h-[72%] rounded-full bg-cyan-300/16 blur-3xl" />
      <div className="absolute inset-y-[18%] right-[2%] w-[22%] rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative h-full">
        <div className="theme-story-contrast-panel-soft absolute inset-x-[8%] top-[5%] bottom-[14%] rounded-[44%_56%_48%_52%/46%_44%_56%_54%]" />
        <div className="absolute inset-x-[13%] top-[10%] bottom-[19%] rounded-[42%_58%_52%_48%/52%_40%_60%_48%] bg-slate-950/88 shadow-[0_24px_80px_rgba(2,6,23,0.48)]" />

        <div className="absolute left-[8%] top-[12%] z-10 flex flex-col gap-3">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Show ${photo.caption}`}
              aria-pressed={index === activeIndex}
              className="group flex items-center gap-3 text-left"
              onClick={() => setActiveIndex(index)}
            >
              <span
                className={`block h-px transition-all duration-500 ${index === activeIndex ? "w-12" : "w-6 group-hover:w-10"}`}
                style={{
                  backgroundColor:
                    index === activeIndex
                      ? "color-mix(in srgb, var(--theme-text-primary) 82%, transparent)"
                      : "color-mix(in srgb, var(--theme-text-primary) 22%, transparent)",
                }}
              />
              <span
                className="text-[0.65rem] uppercase tracking-[0.3em] transition-colors duration-500"
                style={{
                  color:
                    index === activeIndex
                      ? "color-mix(in srgb, var(--theme-text-primary) 82%, transparent)"
                      : "color-mix(in srgb, var(--theme-text-primary) 40%, transparent)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePhoto?.id ?? "empty"}
            className="absolute inset-[12%]"
            initial={{ opacity: 0, scale: 1.03, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.985, filter: "blur(16px)" }}
            transition={{
              duration: prefersReducedMotion ? 0.45 : 1.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[40%_60%_46%_54%/46%_42%_58%_54%]">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`portrait-gradient-${activePhoto?.id ?? "empty"}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    {gradientStops.map((stop) => (
                      <stop key={`${stop.offset}-${stop.color}`} offset={stop.offset} stopColor={stop.color} />
                    ))}
                  </linearGradient>
                  <radialGradient id={`portrait-glow-${activePhoto?.id ?? "empty"}`} cx="68%" cy="24%" r="52%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.72)" />
                    <stop offset="46%" stopColor="rgba(255,255,255,0.16)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <rect width="100" height="100" fill={`url(#portrait-gradient-${activePhoto?.id ?? "empty"})`} />
                <rect width="100" height="100" fill={`url(#portrait-glow-${activePhoto?.id ?? "empty"})`} />
                <g opacity="0.22" stroke="rgba(255,255,255,0.45)" strokeWidth="0.45" fill="none">
                  <path d="M16 18C27 24 39 18 48 24C58 31 69 30 82 22" />
                  <path d="M10 38C26 44 39 40 53 48C66 55 77 55 90 48" />
                  <path d="M14 62C30 68 45 64 56 70C67 76 79 75 90 70" />
                  <path d="M20 84C36 89 52 86 66 90C76 93 84 92 91 88" />
                </g>
              </svg>

              <motion.div
                className="absolute left-[50%] top-[18%] h-[66%] w-[39%] -translate-x-1/2 rounded-[46%_54%_44%_56%/34%_34%_66%_66%] bg-slate-950/70"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: [0, -8, 0],
                        rotate: [-1.2, 0.8, -1.2],
                      }
                }
                transition={{ duration: 8.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-[49.5%] top-[33%] h-[41%] w-[58%] -translate-x-1/2 rounded-[48%_52%_60%_40%/42%_42%_58%_58%] bg-slate-950/82"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: [0, 6, 0],
                        scaleX: [1, 1.02, 1],
                      }
                }
                transition={{ duration: 9.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.28),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(15,23,42,0.02)_34%,rgba(15,23,42,0.64)_100%)]" />
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="theme-story-contrast-panel absolute bottom-[11%] right-[6%] z-10 max-w-[18rem] rounded-[1.75rem] border px-5 py-4 backdrop-blur-xl"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          <p className="theme-story-contrast-accent text-[0.65rem] uppercase tracking-[0.34em]">Portrait Studies</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${activePhoto?.id ?? "empty"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
            >
              <p className="theme-story-contrast-title mt-2 text-xl font-semibold tracking-[-0.03em]">
                {activePhoto?.caption ?? "Add portrait asset"}
              </p>
              <p className="theme-story-contrast-body mt-2 text-sm leading-relaxed">
                Placeholder portrait composition ready to swap for photography.
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="absolute bottom-[14%] left-[12%] z-10 flex gap-2">
          {photos.map((photo, index) => (
            <motion.span
              key={photo.id}
              className="h-1.5 rounded-full"
              animate={{
                width: index === activeIndex ? 40 : 12,
                opacity: index === activeIndex ? 0.95 : 0.28,
              }}
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text-primary) 78%, transparent)" }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoCyclePlaceholder;
