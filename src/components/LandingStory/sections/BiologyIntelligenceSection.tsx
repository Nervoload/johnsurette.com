import React from "react";
import { motion } from "framer-motion";
import { LandingBiologySectionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import { WipeOptions } from "../../Transitions/TransitionWipe";
import BiologySynapsePlaceholder from "../visuals/BiologySynapsePlaceholder";
import { useSectionActivity } from "../runtime/LandingStoryRuntime";

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
  const activity = useSectionActivity<HTMLElement>();

  return (
    <section
      ref={activity.sectionRef as React.Ref<HTMLElement>}
      className="relative isolate min-h-[112dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16 lg:py-28"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(2,6,23,0.84)_18%,rgba(3,18,24,0.92)_54%,rgba(2,6,23,0.99)),radial-gradient(circle_at_50%_36%,rgba(56,189,248,0.2),transparent_22%),radial-gradient(circle_at_16%_70%,rgba(52,211,153,0.14),transparent_22%),radial-gradient(circle_at_84%_26%,rgba(125,211,252,0.14),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[11%] h-[38rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.22),transparent_56%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/92 via-slate-950/62 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950 via-slate-950/76 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[108rem] min-h-[calc(100dvh-8rem)] flex-col justify-center gap-12">
        <div className="flex justify-center lg:justify-start">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/72">{section.eyebrow}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1.46fr)_1fr] lg:items-center xl:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.94, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 lg:pr-2"
          >
            <div className="max-w-xl rounded-[2.25rem] border border-white/10 bg-slate-950/24 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl sm:p-10">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/62">Biological computation</p>
              <p className="mt-5 max-w-lg text-balance text-[1.2rem] leading-[1.95] text-slate-100/92 sm:text-[1.42rem] lg:text-[1.58rem]">
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
            <div className="pointer-events-none absolute inset-x-[10%] top-[10%] h-[64%] rounded-full bg-cyan-300/14 blur-3xl" />
            <BiologySynapsePlaceholder activity={activity} />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.94, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 lg:pl-2"
          >
            <div className="rounded-[2.35rem] border border-cyan-100/12 bg-slate-950/34 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.38)] backdrop-blur-2xl sm:p-10">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/62">Life is intelligent.</p>
              <h2 className="mt-5 max-w-sm text-balance text-[2.9rem] font-semibold leading-[0.96] text-slate-50 sm:text-[3.9rem] xl:text-[5rem]">
                {content.overlayTitle}
              </h2>
              <p className="mt-5 max-w-sm text-pretty text-[1.1rem] leading-[1.9] text-slate-100/90 sm:text-[1.24rem]">
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
