import React, { useCallback, useEffect, useState } from "react";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import { defaultBackgroundEffectId } from "../components/LandingComponents/backgroundEffects/backgroundEffectRegistry";
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
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <div className="sticky top-0 h-[100svh]">
              <DepthRainBackdrop
                effectId={defaultBackgroundEffectId}
                quality="balanced"
                interactionMode="subtle"
                styleSeed={91}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.62]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(219,234,254,0.38),transparent_48%),radial-gradient(circle_at_76%_18%,rgba(221,214,254,0.28),transparent_46%),linear-gradient(168deg,rgba(255,255,255,0.72),rgba(248,250,252,0.66)_44%,rgba(238,242,247,0.74)_100%)]" />
            </div>
          </div>

          <div className="relative z-10">
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
          </div>
        </div>
      )}
    </PageScaffold>
  );
};

export default ProjectsPage;
