import React, { useState, useRef } from "react";
import AnimatedDotFieldCanvas from "../components/LandingComponents/AnimatedDotFieldCanvas";
import RadialDotFieldCanvas   from "../components/LandingComponents/RadialDotFieldCanvas";
import GradientRing           from "../components/LandingComponents/GradientRing";
import SectionLayer           from "../components/LandingComponents/SectionLayer";
import CenterOrb              from "../components/LandingComponents/CenterOrb";
import { sections }           from "../components/sections";
import { WipeOptions }        from "../components/Transitions/TransitionWipe";
import Footer from "../components/Footer";

/** now accepts opts: WipeOptions */
export interface LandingPageProps {
  onNavigate: (sectionName: string, opts?: WipeOptions) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [active, setActive] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-screen min-h-screen flex items-center justify-center bg-white overflow-auto">
      {/* background dots */}
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

      {/* foreground */}
      <div className="relative w-[60vmin] h-[60vmin]">
        <GradientRing activeSection={active} />

        <SectionLayer
          onHover={setActive}
          onSelect={(name) => {
            setActive(name);
            const sec = sections.find((s) => s.name === name)!;
            onNavigate(name, {
              color: sec.color,
              direction: "right",
              duration: 500,
            });
          }}
        />

        <CenterOrb label={active} />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
