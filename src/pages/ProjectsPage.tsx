import React, { useCallback, useState } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import ProjectCardStack from "../components/Projects/ProjectCardStack";
import { projectItems } from "../components/Projects/projectData";
import PageScaffold from "../components/layout/PageScaffold";

const ProjectsPage: React.FC = () => {
  const [stackActive, setStackActive] = useState(false);

  const handleIntroProgress = useCallback((progress: number) => {
    setStackActive((prev) => {
      if (prev) {
        return progress > 0.84;
      }
      return progress > 0.92;
    });
  }, []);

  return (
    <PageScaffold backgroundClassName="bg-slate-50" footerBackgroundColor="#ffffff" footerRunwayVh={120}>
      {(scrollRef) => (
        <>
          <header className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24 text-slate-900">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Projects</p>
            <h1 className="text-4xl font-medium sm:text-5xl">Interactive Project Narrative</h1>
            <p className="max-w-2xl text-slate-600">
              Intro cards shuffle, spread into orbit, then exit downward before the project stack takes over.
            </p>
          </header>

          <div className="relative mt-8">
            <ProjectStoryboard scrollContainer={scrollRef} onProgressChange={handleIntroProgress} />
          </div>

          <ProjectCardStack items={projectItems} active={stackActive} scrollContainer={scrollRef} />
        </>
      )}
    </PageScaffold>
  );
};

export default ProjectsPage;
