import React from "react";
import { motion } from "framer-motion";
import { LandingAspirationSectionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import AspirationTreePlaceholder from "../visuals/AspirationTreePlaceholder";

interface AspirationJourneySectionProps {
  section: StorySectionData;
  content: LandingAspirationSectionContent;
}

const AspirationJourneySection: React.FC<AspirationJourneySectionProps> = ({ section, content }) => {
  return (
    <section className="relative isolate overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(34,211,238,0.14),transparent_18%),radial-gradient(circle_at_50%_52%,rgba(168,85,247,0.12),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(2,6,23,0.94)_34%,rgba(15,23,42,0.98)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950 via-slate-950/60 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-4 rounded-full border border-cyan-200/12 bg-slate-950/24 px-5 py-3 backdrop-blur-sm">
            <span className="block h-px w-10 bg-cyan-200/24" />
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/68">
              {section.eyebrow}
            </p>
            <span className="block h-px w-10 bg-cyan-200/24" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300/86 sm:text-lg">
            {section.summary}
          </p>
        </motion.div>

        <AspirationTreePlaceholder
          nodes={content.nodes}
          edges={content.edges}
          footerTitle={content.footerTitle}
          footerBody={content.footerBody}
        />
      </div>
    </section>
  );
};

export default AspirationJourneySection;
