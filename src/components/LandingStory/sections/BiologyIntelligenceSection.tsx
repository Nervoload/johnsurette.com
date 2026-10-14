import React, { Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { LandingBiologySectionContent, LandingBrainScalesContent } from "../../../content";
import { StorySectionData } from "../storySections";
import { WipeOptions } from "../../Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../../theme/themeMode";
import { useHandheldDevice } from "../../../hooks/useHandheldDevice";
import { useLandingStoryRuntime, useSectionActivity } from "../runtime/LandingStoryRuntime";
import { BrainScalesStage, loadBrainScalesStage, useDeferredLivingStage } from "../visuals/living/livingStages";

interface BiologyIntelligenceSectionProps {
  section: StorySectionData;
  content: LandingBiologySectionContent;
  brainScalesContent: LandingBrainScalesContent;
  themeMode: ResolvedThemeMode;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const BiologyIntelligenceSection: React.FC<BiologyIntelligenceSectionProps> = ({
  section,
  content,
  brainScalesContent,
  themeMode,
  onNavigate,
}) => {
  const activity = useSectionActivity<HTMLElement>();
  const { scrollContainerRef } = useLandingStoryRuntime();
  const handheld = useHandheldDevice();
  const slotRef = useRef<HTMLDivElement>(null);
  const showScene = useDeferredLivingStage(slotRef, scrollContainerRef, loadBrainScalesStage);

  return (
    <section
      ref={activity.sectionRef as React.Ref<HTMLElement>}
      className="relative isolate overflow-x-clip px-4 py-20 xs:px-6 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(56,189,248,0.2),transparent_22%),radial-gradient(circle_at_16%_70%,rgba(52,211,153,0.14),transparent_22%),radial-gradient(circle_at_84%_26%,rgba(125,211,252,0.14),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[11%] h-[38rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.22),transparent_56%)] blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[108rem] flex-col gap-12 lg:gap-14">
        <div className="flex justify-center lg:justify-start">
          <p className="theme-story-contrast-accent text-xs uppercase tracking-[0.34em]">{section.eyebrow}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1.46fr)_1fr] lg:items-center xl:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.94, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 lg:pr-2"
          >
            <div className="theme-story-contrast-panel w-full max-w-[41rem] rounded-[2.25rem] border p-8 sm:min-w-[24rem] sm:p-10 lg:min-w-[26rem]">
              <p className="theme-story-contrast-accent text-xs uppercase tracking-[0.32em]">Biological computation</p>
              <p className="theme-story-contrast-body mt-5 max-w-[36rem] text-balance text-[1.2rem] leading-[1.95] sm:text-[1.42rem] lg:text-[1.58rem]">
                {content.body}
              </p>
              <button
                type="button"
                className="theme-story-contrast-button mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition duration-300 hover:scale-[1.02] hover:brightness-105 sm:text-[0.95rem]"
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
            {/* The live "Scales of mind" zoom; it spills past this slot. Controls sit just under it. */}
            <div
              ref={slotRef}
              className="relative mx-auto aspect-[1.08] w-[min(92vw,46rem)] max-w-none sm:w-[min(88vw,52rem)] lg:w-[min(60vw,56rem)] xl:w-[min(54vw,60rem)]"
            >
              {showScene ? (
                <Suspense fallback={null}>
                  <BrainScalesStage
                    content={brainScalesContent}
                    themeMode={themeMode}
                    qualityTier={activity.qualityTier}
                    handheld={handheld}
                    scrollRootRef={scrollContainerRef}
                    fallback={content.poster}
                    className="h-full w-full"
                    controlsClassName="absolute inset-x-1 top-[calc(100%+0.75rem)] z-30 sm:inset-x-4"
                  />
                </Suspense>
              ) : null}
            </div>
            <p className="living-credit relative z-20 mx-auto mt-32 w-[min(92vw,46rem)] px-1 sm:mt-16 sm:w-[min(88vw,52rem)] sm:px-4 lg:w-[min(60vw,56rem)] xl:w-[min(54vw,60rem)]">
              {brainScalesContent.attribution}
            </p>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.94, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 lg:pl-2"
          >
            <div className="theme-story-contrast-panel rounded-[2.35rem] border p-8 sm:p-10">
              
              <h2 className="theme-story-contrast-title mt-5 max-w-sm text-balance text-[2.9rem] font-semibold leading-[0.96] sm:text-[3.9rem] xl:text-[5rem]">
                {content.overlayTitle}
              </h2>
              <p className="theme-story-contrast-body mt-5 max-w-sm text-pretty text-[1.1rem] leading-[1.9] sm:text-[1.24rem]">
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
