// src/pages/ProjectsPage.tsx
import React, { useRef } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative w-screen h-screen overflow-y-auto bg-white"
    >
      {/* all 3-D & animation lives in the storyboard */}
      <ProjectStoryboard scrollContainer={scrollRef} />

      {/* you can stack regular HTML content below if desired */}
      <Footer scrollContainerRef={scrollRef} />
    </div>
  );
};

export default ProjectsPage;
