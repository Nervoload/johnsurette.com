import React, { useCallback, useEffect, useState } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import ProjectExpandOverlay from "../components/Projects/ProjectExpandOverlay";
import { ProjectItem, projectItems } from "../components/Projects/projectData";
import PageScaffold from "../components/layout/PageScaffold";

const ProjectsPage: React.FC = () => {
  const [bootLowPower, setBootLowPower] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [originPos, setOriginPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setBootLowPower(false);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleCardSelect = useCallback(
    (item: ProjectItem, screenPos: { x: number; y: number }) => {
      setSelectedProject(item);
      setOriginPos(screenPos);
    },
    [],
  );

  const handleOverlayClose = useCallback(() => {
    setSelectedProject(null);
    setOriginPos(null);
  }, []);

  return (
    <PageScaffold backgroundClassName="bg-slate-50" footerBackgroundColor="#ffffff" footerRunwayVh={120}>
      {(scrollRef) => (
        <>
          <header className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24 text-slate-900">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Projects</p>
            <h1 className="text-3xl font-medium xs:text-4xl sm:text-5xl">Ideas Realized.</h1>
            <p className="max-w-2xl text-slate-600">
              A collection of my favorite projects, experiments, and prototypes.
            </p>
          </header>

          <div className="relative mt-8">
            <ProjectStoryboard
              scrollContainer={scrollRef}
              items={projectItems}
              onCardSelect={handleCardSelect}
              forceLowPower={bootLowPower}
            />
          </div>

          <ProjectExpandOverlay
            item={selectedProject}
            originPos={originPos}
            onClose={handleOverlayClose}
          />
        </>
      )}
    </PageScaffold>
  );
};

export default ProjectsPage;
