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
      {/* scroll track provides enough space for storyboard scenes */}
      <div className="relative h-[400vh]">
        <ProjectStoryboard scrollContainer={scrollRef} />
      </div>

      {/* you can stack regular HTML content below if desired */}
      <Footer scrollContainerRef={scrollRef} />
    </div>
  );
};

export default ProjectsPage;
