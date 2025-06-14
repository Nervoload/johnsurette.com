// src/pages/LandingPage.tsx
import React, { useState } from "react";
import AnimatedDotFieldCanvas from "../components/LandingComponents/AnimatedDotFieldCanvas";
import RadialDotFieldCanvas   from "../components/LandingComponents/RadialDotFieldCanvas";
import GradientRing           from "../components/LandingComponents/GradientRing";
import SectionLayer           from "../components/LandingComponents/SectionLayer";
import CenterOrb              from "../components/LandingComponents/CenterOrb";

/** Callback fires when the user clicks a section */
export interface LandingPageProps {
  onNavigate: (sectionName: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* --- background dot layers --- */}
      <AnimatedDotFieldCanvas
        activeSection={active}
        spawnRate={30}
        maxDots={50}
        randomness={1.5}
        waveformAmplitude={10}
        initialDotSize={8}
        shrinkRate={6}
        fadeRate={0.5}
        orbitSpeed={0.35}
      />
      <RadialDotFieldCanvas
        activeSection={active}
        spawnRate={10}
        randomness={1.5}
        initialDotSize={8}
        shrinkRate={2}
        fadeRate={0.3}
        baseSpeed={110}
        maxRadiusMultiplier={0.8}
      />

      {/* --- foreground 60 vmin stack --- */}
      <div className="relative w-[60vmin] h-[60vmin]">
        <GradientRing    activeSection={active} />
        <SectionLayer
          onHover={setActive}
          onSelect={(name) => {
            setActive(name);     // keep glow in sync
            onNavigate(name);    // bubble up to App
          }}
        />
        <CenterOrb label={active} />
      </div>
    </div>
  );
};

export default LandingPage;
