import React from "react";
import { motion } from "framer-motion";
import { LandingComputationalSectionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import { WipeOptions } from "../../Transitions/TransitionWipe";
import { useSectionActivity } from "../runtime/LandingStoryRuntime";
import ComputationalCanvasPlaceholder from "../visuals/ComputationalCanvasPlaceholder";
import ComputationalMatrixBackdrop from "../visuals/computation/ComputationalMatrixBackdrop";

interface ComputationalSystemsSectionProps {
  section: StorySectionData;
  content: LandingComputationalSectionContent;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const ComputationalSystemsSection: React.FC<ComputationalSystemsSectionProps> = ({
  section,
  content,
  onNavigate,
}) => {
  const activity = useSectionActivity<HTMLElement>({
    nearAmount: 0.08,
    nearMargin: "24% 0px 24% 0px",
    primaryAmount: 0.38,
    primaryMargin: "-14% 0px -14% 0px",
  });

  return (
    <section
      ref={activity.sectionRef as React.RefObject<HTMLElement>}
      className="relative isolate min-h-[168dvh] overflow-hidden px-4 py-20 xs:px-6 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_84%_20%,rgba(99,102,241,0.16),transparent_22%),radial-gradient(circle_at_74%_80%,rgba(20,184,166,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.99),rgba(2,6,23,0.94)_28%,rgba(2,6,23,0.97)_72%,rgba(2,6,23,0.99))]" />
      <ComputationalMatrixBackdrop active={activity.isNearViewport} qualityTier={activity.qualityTier} />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/82 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/82 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-[100rem] gap-12 lg:grid-cols-[1.24fr_0.76fr] lg:items-start lg:gap-16 xl:gap-20">
        <motion.div
          className="relative lg:sticky lg:top-[10vh] lg:self-start"
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.96, ease: [0.22, 1, 0.36, 1] }}
        >
          <ComputationalCanvasPlaceholder
            activity={{
              isNearViewport: activity.isNearViewport,
              isPrimaryActive: activity.isPrimaryActive,
              qualityTier: activity.qualityTier,
            }}
          />
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-3xl lg:mx-0 lg:pt-10"
          initial={{ opacity: 0, x: 34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -left-5 top-10 hidden h-52 w-px bg-gradient-to-b from-transparent via-cyan-200/34 to-transparent lg:block" />

          <motion.p
            className="text-[0.74rem] font-semibold uppercase tracking-[0.42em] text-cyan-100/62 sm:text-[0.82rem]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.62, delay: 0.04 }}
          >
            {section.eyebrow}
          </motion.p>

          <motion.h2
            className="mt-6 max-w-2xl text-balance text-6xl font-black leading-[0.9] tracking-[-0.08em] text-white sm:text-7xl lg:text-[6.9rem] xl:text-[7.8rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.42 }}
            transition={{ duration: 0.84, delay: 0.06 }}
          >
            {content.title}
          </motion.h2>

          <motion.p
            className="mt-7 max-w-2xl text-[1.18rem] italic leading-relaxed text-cyan-100/82 sm:text-[1.38rem] lg:text-[1.58rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.82, delay: 0.14 }}
          >
            {content.quote}
          </motion.p>

          <motion.p
            className="mt-8 max-w-2xl text-[1.18rem] leading-relaxed text-slate-300/92 sm:text-[1.34rem] lg:text-[1.52rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.82, delay: 0.22 }}
          >
            {content.body}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.82, delay: 0.3 }}
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
