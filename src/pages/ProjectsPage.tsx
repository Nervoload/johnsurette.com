import React, { useState, useRef } from "react";
import IntroShuffle from "../components/Projects/IntroShuffle";
import ProjectScroller from "../components/Projects/ProjectScroller";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-screen h-screen overflow-y-auto bg-white">
      {showIntro && (
        <IntroShuffle />
      )}
      <ProjectScroller />
      <Footer scrollContainerRef={containerRef} />
    </div>
  );
};

export default ProjectsPage;
