import React, { useCallback, useState } from "react";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import ProjectCardStack from "../components/Projects/ProjectCardStack";
import { projectItems } from "../components/Projects/projectData";
import PageScaffold from "../components/layout/PageScaffold";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const ProjectsPage: React.FC = () => {
  const [introProgress, setIntroProgress] = useState(0);

  const handleIntroProgress = useCallback((progress: number) => {
    setIntroProgress(progress);
  }, []);

  const stackHandoff = clamp01((introProgress - 0.68) / 0.24);
  const stackActive = stackHandoff > 0.25;

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

          <div
            className="relative mt-8"
            style={{
              opacity: stackActive ? 0 : clamp01((0.98 - introProgress) / 0.22),
              transition: "opacity 180ms linear",
              pointerEvents: stackActive || introProgress > 0.94 ? "none" : "auto",
            }}
          >
            <ProjectStoryboard scrollContainer={scrollRef} onProgressChange={handleIntroProgress} />
          </div>

          <ProjectCardStack
            items={projectItems}
            active={stackActive}
            scrollContainer={scrollRef}
            handoffProgress={stackHandoff}
          />
        </>
      )}
    </PageScaffold>
  );
};

export default ProjectsPage;
