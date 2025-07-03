// src/pages/ProjectsPage.tsx
import React, { useRef } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  // This div is now the real, full-screen scroll container
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative w-screen h-screen bg-white overflow-y-auto overflow-x-hidden"
    >
      {/* Fixed Canvas reads from this scroll container */}
      <ProjectStoryboard scrollContainer={scrollRef} />

      {/* 4 scenes → 4× viewport scroll */}
      <div style={{ height: "400vh" }} />

      <Footer />
    </div>
  );
};

export default ProjectsPage;
