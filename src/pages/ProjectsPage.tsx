// src/pages/ProjectsPage.tsx
import React, { useRef } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import Footer from "../components/Footer";

const ProjectsPage: React.FC = () => {
  // This div is now the real, full-screen scroll container
  const scrollRef = useRef<HTMLDivElement>(null);
  const sec0 = useRef<HTMLElement>(null);
  const sec1 = useRef<HTMLElement>(null);
  const sec2 = useRef<HTMLElement>(null);
  const sec3 = useRef<HTMLElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative w-screen h-screen bg-white overflow-y-auto overflow-x-hidden"
    >
      {/* Fixed Canvas reads from this scroll container */}
      <ProjectStoryboard
        scrollContainer={scrollRef}
        sections={[sec0, sec1, sec2, sec3]}
      />

      <section ref={sec0} className="h-screen sticky top-0" />
      <section ref={sec1} className="h-screen sticky top-0" />
      <section ref={sec2} className="h-screen sticky top-0" />
      <section ref={sec3} className="h-screen sticky top-0" />

      <Footer />
    </div>
  );
};

export default ProjectsPage;
