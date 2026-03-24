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
    <section className="relative isolate px-0 py-0">
      <div className="relative w-full">
        <AspirationTreePlaceholder
          nodes={content.nodes}
          edges={content.edges}
          footerTitle={content.footerTitle}
          footerBody={content.footerBody}
          eyebrow={section.eyebrow}
          summary={section.summary}
        />
      </div>
    </section>
  );
};

export default AspirationJourneySection;
