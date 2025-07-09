// src/pages/ProjectsPage.tsx
import React, { useRef } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={scrollRef}
        className="relative w-screen min-h-screen overflow-y-auto overflow-x-hidden bg-white"
      >
        <ProjectStoryboard scrollContainer={scrollRef} />
      </div>

      <Footer />
    </>
  );
};

export default ProjectsPage;
