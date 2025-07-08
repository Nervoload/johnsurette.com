// src/pages/ProjectsPage.tsx
import React, { useRef } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative w-screen h-screen bg-white overflow-y-auto overflow-x-hidden"
    >
      <ProjectStoryboard scrollContainer={scrollRef} />
      <Footer />
    </div>
  );
};

export default ProjectsPage;
