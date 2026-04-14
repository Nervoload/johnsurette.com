import React from "react";
import { motion } from "framer-motion";
import { LandingComputationalSectionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import { WipeOptions } from "../../Transitions/TransitionWipe";
import { useSectionActivity } from "../runtime/LandingStoryRuntime";
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
      className="relative isolate min-h-[108dvh] overflow-hidden px-4 py-20 xs:px-6 sm:px-10 sm:py-24 lg:min-h-[116dvh] lg:px-16 lg:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_84%_20%,rgba(99,102,241,0.16),transparent_22%),radial-gradient(circle_at_74%_80%,rgba(20,184,166,0.12),transparent_28%)]" />
      <ComputationalMatrixBackdrop active={activity.isNearViewport} qualityTier={activity.qualityTier} />

      <div className="relative mx-auto grid w-full max-w-[100rem] gap-12 lg:grid-cols-[1.24fr_0.76fr] lg:items-start lg:gap-16 xl:gap-20">
        <motion.div
          className="relative lg:sticky lg:top-[10vh] lg:self-start"
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.96, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-[76vh] min-h-[34rem] overflow-hidden rounded-[2.4rem] shadow-[0_0_120px_rgba(15,23,42,0.18)] sm:h-[80vh] lg:h-[86vh]">
            <div className="theme-story-contrast-canvas absolute inset-0" />
            <img
              src={content.poster.src}
              alt={content.poster.alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.02)_30%,rgba(2,6,23,0.16))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] [background-size:36px_36px] opacity-20" />
            <div className="theme-story-contrast-top-fade absolute inset-x-0 top-0 h-24" />
            <div className="theme-story-contrast-bottom-fade absolute inset-x-0 bottom-0 h-24" />
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-3xl lg:mx-0 lg:pt-10"
          initial={{ opacity: 0, x: 34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -left-5 top-10 hidden h-52 w-px bg-gradient-to-b from-transparent via-cyan-300/28 to-transparent lg:block" />

          <motion.p
            className="theme-story-contrast-accent text-[0.74rem] font-semibold uppercase tracking-[0.42em] sm:text-[0.82rem]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.62, delay: 0.04 }}
          >
            {section.eyebrow}
          </motion.p>

          <motion.h2
            className="theme-story-contrast-title mt-6 max-w-2xl text-balance text-6xl font-black leading-[0.9] tracking-[-0.08em] sm:text-7xl lg:text-[6.9rem] xl:text-[7.8rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.42 }}
            transition={{ duration: 0.84, delay: 0.06 }}
          >
            {content.title}
          </motion.h2>

          <motion.p
            className="theme-story-contrast-quote mt-7 max-w-2xl text-[1.18rem] italic leading-relaxed sm:text-[1.38rem] lg:text-[1.58rem]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.82, delay: 0.14 }}
          >
            {content.quote}
          </motion.p>

          <motion.p
            className="theme-story-contrast-body mt-8 max-w-2xl text-[1.18rem] leading-relaxed sm:text-[1.34rem] lg:text-[1.52rem]"
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
              className="theme-story-contrast-button group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.18em] transition duration-300 hover:translate-x-1 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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

            <span className="theme-story-contrast-muted max-w-[20rem] text-xs uppercase tracking-[0.26em] sm:max-w-none">
              modelling • product development • system simulation
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComputationalSystemsSection;
