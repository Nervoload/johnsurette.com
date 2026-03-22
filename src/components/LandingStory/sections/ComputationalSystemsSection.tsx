import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { LandingComputationalSectionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import { WipeOptions } from "../../Transitions/TransitionWipe";
import ComputationalCanvasPlaceholder from "../visuals/ComputationalCanvasPlaceholder";

interface ComputationalSystemsSectionProps {
  section: StorySectionData;
  content: LandingComputationalSectionContent;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const BACKDROP_GLYPHS = ["0", "1", "01", "10", "λ", "Σ", "µ", "ア", "カ", "ツ"];

const backgroundColumns = Array.from({ length: 18 }, (_, index) => ({
  delay: index * -1.7,
  duration: 18 + (index % 4) * 3.2,
  left: 2 + index * 5.7,
  text: Array.from({ length: 18 }, (_, rowIndex) => BACKDROP_GLYPHS[(index * 3 + rowIndex * 2) % BACKDROP_GLYPHS.length]).join("\n"),
}));

const ComputationalSystemsSection: React.FC<ComputationalSystemsSectionProps> = ({
  section,
  content,
  onNavigate,
}) => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const sectionInView = useInView(sectionRef, {
    amount: 0.08,
    margin: "20% 0px 20% 0px",
  });
  const canvasStageRef = useRef<HTMLDivElement | null>(null);
  const canvasStageInView = useInView(canvasStageRef, {
    amount: 0.22,
    margin: "-10% 0px -10% 0px",
  });

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[148dvh] overflow-hidden px-4 py-28 xs:px-6 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_74%_80%,rgba(20,184,166,0.1),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(2,6,23,0.92)_30%,rgba(3,7,18,0.97)_72%,rgba(2,6,23,0.99))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(100,116,139,0.06)_1px,transparent_1px),linear-gradient(rgba(100,116,139,0.045)_1px,transparent_1px)] [background-size:34px_34px] opacity-30" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {backgroundColumns.map((column, index) => (
          <motion.pre
            key={`computational-rain-${index}`}
            className="absolute top-[-12%] select-none whitespace-pre text-[10px] font-semibold leading-[1.55] tracking-[0.36em] text-cyan-100/18 [mask-image:linear-gradient(180deg,transparent,black_18%,black_80%,transparent)]"
            initial={{ opacity: 0, y: "-18%" }}
            animate={
              !sectionInView
                ? { opacity: 0, y: 0 }
                : (
              reduceMotion
                ? { opacity: 0.12, y: 0 }
                : { opacity: [0, 0.28, 0], y: ["-18%", "118%"] }
                  )
            }
            transition={
              !sectionInView
                ? { duration: 0.22 }
                : (
              reduceMotion
                ? { duration: 0.01 }
                : {
                    delay: column.delay,
                    duration: column.duration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }
                  )
            }
            style={{ left: `${column.left}%` }}
          >
            {column.text}
          </motion.pre>
        ))}

        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 via-slate-950/68 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 via-slate-950/68 to-transparent" />
      </div>

      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 via-slate-950/72 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/72 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-[96rem] gap-14 lg:grid-cols-[1.22fr_0.78fr] lg:items-center lg:gap-16 xl:gap-20">
        <motion.div
          ref={canvasStageRef}
          className="relative lg:sticky lg:top-[10vh] lg:self-start"
          initial={{ opacity: 0, y: 36, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <ComputationalCanvasPlaceholder active={sectionInView && canvasStageInView} />
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-3xl lg:mx-0 lg:pt-6"
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -left-4 top-10 hidden h-44 w-px bg-gradient-to-b from-transparent via-cyan-200/34 to-transparent lg:block" />

          <motion.p
            className="text-[0.72rem] font-semibold uppercase tracking-[0.42em] text-cyan-100/62 sm:text-[0.8rem]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.65, delay: 0.05 }}
          >
            {section.eyebrow}
          </motion.p>

          <motion.h2
            className="mt-6 max-w-2xl text-6xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:text-[6.8rem] xl:text-[7.4rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.82, delay: 0.08 }}
          >
            {content.title}
          </motion.h2>

          <motion.p
            className="mt-7 max-w-2xl text-[1.2rem] italic leading-relaxed text-cyan-100/78 sm:text-[1.45rem] lg:text-[1.55rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.82, delay: 0.16 }}
          >
            {content.quote}
          </motion.p>

          <motion.p
            className="mt-8 max-w-2xl text-[1.15rem] leading-relaxed text-slate-300 sm:text-[1.35rem] lg:text-[1.5rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.82, delay: 0.24 }}
          >
            {content.body}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.82, delay: 0.32 }}
          >
            <button
              type="button"
              className="group inline-flex items-center gap-3 rounded-full bg-cyan-100 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition duration-300 hover:translate-x-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              onClick={() =>
                onNavigate(content.cta.path, {
                  color: "#ffd608",
                })
              }
            >
              <span>{content.cta.label}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </button>

            <span className="max-w-[20rem] text-xs uppercase tracking-[0.26em] text-slate-400 sm:max-w-none">
              signal processing • inference • emergent structure
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComputationalSystemsSection;
