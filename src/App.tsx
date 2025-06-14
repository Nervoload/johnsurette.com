import React, { useState } from "react";
import AnimatedDotFieldCanvas from "./components/AnimatedDotFieldCanvas";
import RadialDotFieldCanvas from "./components/RadialDotFieldCanvas";
import GradientRing from "./components/GradientRing";
import SectionLayer from "./components/SectionLayer";
import CenterOrb from "./components/CenterOrb";

function App() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Everything lives in this 60vmin box now */}
      <AnimatedDotFieldCanvas
          activeSection={active}
          spawnRate={30}           // dots/sec
          maxDots={50}             // cap
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
      <div className="relative w-[60vmin] h-[60vmin]">
        

        <GradientRing activeSection={active} />
        <SectionLayer onHover={setActive} onSelect={setActive} />
        <CenterOrb label={active} />
      </div>
    </div>
  );
}

export default App;
