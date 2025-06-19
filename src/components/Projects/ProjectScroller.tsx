import React from "react";
import ProjectCard from "./ProjectCard";

const sampleProjects = ["First Project", "Second Project", "Third Project"];

const ProjectScroller: React.FC = () => {
  return (
    <div className="w-screen h-auto overflow-y-auto">
      {sampleProjects.map((title, idx) => (
        <ProjectCard key={idx} index={idx} title={title} />
      ))}
    </div>
  );
};

export default ProjectScroller;
