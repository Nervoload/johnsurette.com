import React from "react";
import { LandingAspirationSectionContent } from "../../../content";
import { ResolvedThemeMode } from "../../theme/themeMode";
import { StorySectionData } from "../storySections";
import AspirationTreePlaceholder from "../visuals/AspirationTreePlaceholder";

interface AspirationJourneySectionProps {
  section: StorySectionData;
  content: LandingAspirationSectionContent;
  themeMode: ResolvedThemeMode;
}

const AspirationJourneySection: React.FC<AspirationJourneySectionProps> = ({ section, content, themeMode }) => {
  return (
    <div className="relative isolate">
      <section className="relative px-0 py-0">
        <AspirationTreePlaceholder
          nodes={content.nodes}
          edges={content.edges}
          overlayBeats={content.overlayBeats}
          themeMode={themeMode}
        />
      </section>

      <section className="relative flex min-h-[100dvh] items-center justify-center px-6 py-20 xs:px-8 sm:px-10 lg:px-16">
        <div className="relative mx-auto flex w-full max-w-5xl justify-center text-center">
          <div className="max-w-4xl">
            <h2 className="theme-story-contrast-title text-balance text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.92]">
              {content.footerTitle}
            </h2>
            <p className="theme-story-contrast-body mx-auto mt-6 max-w-2xl text-[clamp(1.08rem,1.9vw,1.34rem)] leading-relaxed">
              {content.footerBody}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AspirationJourneySection;
