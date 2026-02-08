import React from "react";
import { WipeOptions } from "../Transitions/TransitionWipe";
import StoryTransition from "./StoryTransition";
import { StorySectionData, storySections, storyTransitions } from "./storySections";
import CellularDawnSection from "./sections/CellularDawnSection";
import RepairStackSection from "./sections/RepairStackSection";
import NeuralAtlasSection from "./sections/NeuralAtlasSection";
import HumanMachineSection from "./sections/HumanMachineSection";
import FutureProtocolSection from "./sections/FutureProtocolSection";

export interface LandingStoryboardProps {
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

interface StorySectionRendererProps {
  section: StorySectionData;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const StorySectionRenderer: React.FC<StorySectionRendererProps> = ({ section, onNavigate }) => {
  if (section.id === "cellular-dawn") {
    return <CellularDawnSection section={section} />;
  }

  if (section.id === "repair-stack") {
    return <RepairStackSection section={section} />;
  }

  if (section.id === "neural-atlas") {
    return <NeuralAtlasSection section={section} />;
  }

  if (section.id === "human-machine") {
    return <HumanMachineSection section={section} />;
  }

  return <FutureProtocolSection section={section} onNavigate={onNavigate} />;
};

const LandingStoryboard: React.FC<LandingStoryboardProps> = ({ onNavigate }) => {
  return (
    <section className="relative z-10">
      {storySections.map((section, index) => (
        <div key={section.id} className={`relative ${index === 0 ? "" : "-mt-24"}`}>
          {index > 0 ? (
            <div className="pointer-events-none absolute inset-x-0 top-[-7rem] z-30">
              <StoryTransition kind={storyTransitions[index - 1]} />
            </div>
          ) : null}
          <StorySectionRenderer section={section} onNavigate={onNavigate} />
        </div>
      ))}
    </section>
  );
};

export default LandingStoryboard;
