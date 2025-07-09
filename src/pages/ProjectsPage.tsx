// src/pages/ProjectsPage.tsx
import React, { useRef } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sec0 = useRef<HTMLElement>(null);
  const sec1 = useRef<HTMLElement>(null);
  const sec2 = useRef<HTMLElement>(null);
  const sec3 = useRef<HTMLElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative w-screen min-h-screen bg-white overflow-y-auto overflow-x-hidden"
    >

      <ProjectStoryboard scrollContainer={scrollRef} />

      <Footer />
    </div>
  );
};

export default ProjectsPage;
