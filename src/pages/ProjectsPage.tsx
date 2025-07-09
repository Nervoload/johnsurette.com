// src/pages/ProjectsPage.tsx
import React, { useRef } from "react";
import ProjectStoryboard, { sceneCount } from "../components/Projects/ProjectStoryboard";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerHeight = `${sceneCount * 100}vh`;

  return (
    <>
      <div
        ref={scrollRef}
        className="relative w-screen overflow-y-auto overflow-x-hidden bg-white"
        style={{ height: containerHeight }}
      >
        <ProjectStoryboard scrollContainer={scrollRef} />
      </div>

      <Footer />
    </>
  );
};

export default ProjectsPage;
