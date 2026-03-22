import React from "react";
import { motion } from "framer-motion";
import { LandingBiologySectionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import { WipeOptions } from "../../Transitions/TransitionWipe";
import BiologySynapsePlaceholder from "../visuals/BiologySynapsePlaceholder";

interface BiologyIntelligenceSectionProps {
  section: StorySectionData;
  content: LandingBiologySectionContent;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const BiologyIntelligenceSection: React.FC<BiologyIntelligenceSectionProps> = ({
  section,
  content,
  onNavigate,
}) => {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 py-20 xs:px-6 sm:px-10 lg:px-16 lg:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(2,6,23,0.84)_18%,rgba(3,18,24,0.9)_54%,rgba(2,6,23,0.98)),radial-gradient(circle_at_50%_36%,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_16%_70%,rgba(52,211,153,0.12),transparent_22%),radial-gradient(circle_at_84%_26%,rgba(125,211,252,0.12),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[14%] h-[34rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),transparent_56%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/90 via-slate-950/62 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/76 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[100rem] min-h-[calc(100dvh-10rem)] flex-col justify-center gap-12">
        <div className="flex justify-center lg:justify-start">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/68">{section.eyebrow}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_minmax(0,1.34fr)_0.92fr] lg:items-center xl:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.94, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 lg:pr-2"
          >
            <div className="max-w-xl rounded-[2.25rem] border border-white/10 bg-slate-950/26 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.32)] backdrop-blur-xl sm:p-9">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/60">Biological computation</p>
              <p className="mt-5 max-w-lg text-balance text-[1.12rem] leading-[1.9] text-slate-200/92 sm:text-[1.32rem]">
                {content.body}
              </p>
              <button
                type="button"
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-emerald-300/28 bg-emerald-300/10 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-50 transition duration-300 hover:scale-[1.02] hover:border-emerald-200/44 hover:bg-emerald-300/14 sm:text-[0.95rem]"
                onClick={() => {
                  onNavigate(content.cta.path, {
                    color: "#0f766e",
                  });
                }}
              >
                <span>{content.cta.label}</span>
                <span aria-hidden="true" className="text-base leading-none">
                  →
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-first lg:order-none lg:justify-self-center"
          >
            <div className="pointer-events-none absolute inset-x-[14%] top-[10%] h-[60%] rounded-full bg-cyan-300/12 blur-3xl" />
            <BiologySynapsePlaceholder />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.94, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 lg:pl-2"
          >
            <div className="rounded-[2.35rem] border border-cyan-100/12 bg-slate-950/32 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.38)] backdrop-blur-2xl sm:p-9">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/60">Life is intelligent.</p>
              <h2 className="mt-5 max-w-sm text-balance text-[2.5rem] font-semibold leading-[0.98] text-slate-50 sm:text-[3.3rem] xl:text-[4.4rem]">
                {content.overlayTitle}
              </h2>
              <p className="mt-5 max-w-sm text-pretty text-[1.05rem] leading-[1.85] text-slate-200/90 sm:text-[1.18rem]">
                {content.overlayBody}
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default BiologyIntelligenceSection;
