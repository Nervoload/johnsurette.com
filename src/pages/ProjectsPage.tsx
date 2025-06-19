import React, { useState } from "react";
import IntroShuffle from "../components/Projects/IntroShuffle";
import ProjectScroller from "../components/Projects/ProjectScroller";

const ProjectsPage: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative w-screen h-screen overflow-y-auto bg-white">
      {showIntro && (
        <IntroShuffle />
      )}
      <ProjectScroller />
    </div>
  );
};

export default ProjectsPage;
