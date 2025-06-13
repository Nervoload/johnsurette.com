import React, { useState } from "react";
import AnimatedDotFieldCanvas from "./components/AnimatedDotFieldCanvas";
import GradientRing from "./components/GradientRing";
import CenterOrb from "./components/CenterOrb";
import SectionLayer from "./components/SectionLayer";

function App() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-white overflow-hidden">
      <AnimatedDotFieldCanvas />

      {/* responsive container: 60vmin keeps square that scales */}
      <div className="relative w-[60vmin] h-[60vmin]">
        <GradientRing activeSection={active} />
        <SectionLayer onHover={setActive} onSelect={setActive} />
        <CenterOrb label={active} />
      </div>
    </div>
  );
}

export default App;
