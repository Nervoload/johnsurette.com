import React from "react";
import { LandingAspirationSectionContent } from "../../../content";
import { StorySectionData } from "../storySections";
import AspirationTreePlaceholder from "../visuals/AspirationTreePlaceholder";

interface AspirationJourneySectionProps {
  section: StorySectionData;
  content: LandingAspirationSectionContent;
}

const AspirationJourneySection: React.FC<AspirationJourneySectionProps> = ({ section, content }) => {
  return (
    <div className="relative isolate">
      <section className="relative px-0 py-0">
        <AspirationTreePlaceholder
          nodes={content.nodes}
          edges={content.edges}
          eyebrow={section.eyebrow}
          summary={section.summary}
        />
      </section>

      <section className="relative px-4 pb-28 pt-24 xs:px-6 sm:px-10 lg:px-16 lg:pb-36 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_28%)]" />
        <div className="relative mx-auto flex w-full max-w-5xl justify-center text-center">
          <div className="theme-story-contrast-panel max-w-4xl rounded-[2.4rem] border px-8 py-10 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
            <p className="theme-story-contrast-accent text-[0.72rem] font-semibold uppercase tracking-[0.42em]">
              Beyond Graduation
            </p>
            <h2 className="theme-story-contrast-title mt-5 text-balance text-[clamp(2.5rem,5vw,4.8rem)] font-semibold leading-[0.94]">
              {content.footerTitle}
            </h2>
            <p className="theme-story-contrast-body mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.7vw,1.22rem)] leading-relaxed">
              {content.footerBody}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AspirationJourneySection;
