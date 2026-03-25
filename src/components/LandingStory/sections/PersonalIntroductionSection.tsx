import React from "react";
import { motion, type Variants } from "framer-motion";
import { LandingPersonalIntroductionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import PhotoCyclePlaceholder from "../visuals/PhotoCyclePlaceholder";

interface PersonalIntroductionSectionProps {
  section: StorySectionData;
  content: LandingPersonalIntroductionContent;
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: revealEase,
    },
  },
};

const PersonalIntroductionSection: React.FC<PersonalIntroductionSectionProps> = ({ section, content }) => {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(34,211,238,0.14),transparent_26%),radial-gradient(circle_at_82%_20%,rgba(129,140,248,0.16),transparent_24%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="relative max-w-2xl"
        >
          <motion.div variants={reveal} className="flex items-center gap-4">
            <span
              className="block h-px w-12"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-text-primary) 16%, transparent)" }}
            />
            <p className="theme-story-contrast-accent text-[0.68rem] font-semibold uppercase tracking-[0.34em]">
              {section.eyebrow}
            </p>
          </motion.div>

          <motion.h2
            variants={reveal}
            className="theme-text-primary mt-6 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-balance xs:text-5xl sm:text-6xl lg:text-[4.4rem]"
          >
            {content.title}
          </motion.h2>

          <motion.p
            variants={reveal}
            className="theme-story-contrast-body mt-6 max-w-2xl text-[1.08rem] leading-[1.8] tracking-[-0.02em] sm:text-[1.28rem]"
          >
            {content.subtitle}
          </motion.p>

          <motion.div variants={reveal} className="theme-border-subtle mt-10 border-y py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <p className="theme-story-contrast-accent text-[0.68rem] font-semibold uppercase tracking-[0.34em]">
                Focus areas
              </p>

              <div className="grid gap-3 sm:min-w-[18rem]">
                {section.focusAreas.slice(0, 3).map((focusArea) => (
                  <div key={focusArea} className="flex items-center gap-3 sm:justify-end">
                    <span
                      className="block h-px w-7"
                      style={{ backgroundColor: "color-mix(in srgb, var(--theme-text-primary) 14%, transparent)" }}
                    />
                    <span className="theme-story-contrast-muted text-[0.72rem] font-semibold uppercase tracking-[0.28em]">
                      {focusArea}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={reveal} className="mt-10 space-y-5">
            {content.body.map((paragraph) => (
              <p
                key={paragraph}
                className="theme-story-contrast-body max-w-xl text-base leading-8 sm:text-[1.05rem]"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.975 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1.05, ease: revealEase, delay: 0.08 }}
          className="relative"
        >
          <PhotoCyclePlaceholder photos={content.photos} />
        </motion.div>
      </div>
    </section>
  );
};

export default PersonalIntroductionSection;
