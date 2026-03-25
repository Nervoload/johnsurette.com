import React, { RefObject } from "react";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { StorySectionData, storySections } from "./storySections";
import {
  landingAspirationSectionContent,
  landingBiologySectionContent,
  landingComputationalSectionContent,
  landingPersonalIntroductionContent,
} from "../../content";
import PersonalIntroductionSection from "./sections/PersonalIntroductionSection";
import ComputationalSystemsSection from "./sections/ComputationalSystemsSection";
import BiologyIntelligenceSection from "./sections/BiologyIntelligenceSection";
import AspirationJourneySection from "./sections/AspirationJourneySection";
import { LandingStoryRuntimeProvider } from "./runtime/LandingStoryRuntime";

export interface LandingStoryboardProps {
  onNavigate: (path: string, opts?: WipeOptions) => void;
  scrollContainerRef: RefObject<HTMLDivElement>;
}

interface StorySectionRendererProps {
  section: StorySectionData;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const StorySectionRenderer: React.FC<StorySectionRendererProps> = ({ section, onNavigate }) => {
  if (section.id === "personal-introduction") {
    return <PersonalIntroductionSection section={section} content={landingPersonalIntroductionContent} />;
  }

  if (section.id === "computational-systems") {
    return (
      <ComputationalSystemsSection
        section={section}
        content={landingComputationalSectionContent}
        onNavigate={onNavigate}
      />
    );
  }

  if (section.id === "biology-intelligence") {
    return (
      <BiologyIntelligenceSection
        section={section}
        content={landingBiologySectionContent}
        onNavigate={onNavigate}
      />
    );
  }

  return <AspirationJourneySection section={section} content={landingAspirationSectionContent} />;
};

const LandingStoryboard: React.FC<LandingStoryboardProps> = ({ onNavigate, scrollContainerRef }) => {
  return (
    <LandingStoryRuntimeProvider scrollContainerRef={scrollContainerRef}>
      <section className="relative z-10 overflow-x-clip">
        <div className="theme-story-contrast-backdrop absolute inset-0" />
        <div className="theme-story-contrast-top-fade pointer-events-none absolute inset-x-0 top-0 h-40" />
        <div className="theme-story-contrast-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-40" />
        <div className="pointer-events-none absolute inset-y-0 left-[max(1rem,4vw)] hidden w-px bg-gradient-to-b from-transparent via-cyan-200/16 to-transparent lg:block" />
        {storySections.map((section) => (
          <div key={section.id} className="relative">
            <StorySectionRenderer section={section} onNavigate={onNavigate} />
          </div>
        ))}
      </section>
    </LandingStoryRuntimeProvider>
  );
};

export default LandingStoryboard;
