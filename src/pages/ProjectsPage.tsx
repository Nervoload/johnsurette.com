import React, { useCallback, useEffect, useState } from "react";
import { pageVisuals, projectsPageContent } from "../content";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import LandingOnboardingOverlay from "../components/LandingComponents/onboarding/LandingOnboardingOverlay";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import ProjectExpandOverlay from "../components/Projects/ProjectExpandOverlay";
import { ProjectItem, projectItems } from "../components/Projects/projectData";
import PageScaffold from "../components/layout/PageScaffold";
import { ResolvedThemeMode } from "../components/theme/themeMode";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";
import { useIsTouch } from "../hooks/usePointerDevice";

export interface ProjectsPageProps {
  themeMode: ResolvedThemeMode;
  navInteractionTick?: number;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ themeMode, navInteractionTick }) => {
  const projectsPageProbe = createCodexProbeAttributes({
    componentName: "ProjectsPage",
    filePath: "/src/pages/ProjectsPage.tsx",
    componentPath: ["ProjectsPage"],
    role: "page",
  });

  const [bootLowPower, setBootLowPower] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [originPos, setOriginPos] = useState<{ x: number; y: number } | null>(null);
  const projectVisuals = pageVisuals.projects;
  const isTouch = useIsTouch();

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
    <PageScaffold
      backgroundClassName={projectVisuals.backgroundClassName}
      footerBackgroundColor={projectVisuals.footerBackgroundColor}
      footerRunwayVh={projectVisuals.footerRunwayVh}
    >
      {(scrollRef) => (
        <div {...projectsPageProbe} className="relative isolate">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <div className="sticky top-0 h-[100svh]">
              <DepthRainBackdrop
                effectId={projectVisuals.backdropEffectId}
                quality={projectVisuals.backdropQuality}
                interactionMode={projectVisuals.backdropInteractionMode}
                styleSeed={projectVisuals.backdropStyleSeed}
                className={projectVisuals.backdropClassName}
              />
              {projectVisuals.backdropOverlayClassName ? (
                <div className={projectVisuals.backdropOverlayClassName} />
              ) : null}
            </div>
          </div>

          <LandingOnboardingOverlay
            scrollContainerRef={scrollRef}
            navInteractionTick={navInteractionTick}
            isTouch={isTouch}
            navInteractionLockMs={2000}
            dismissAllThresholdPx={typeof window === "undefined" ? undefined : window.innerHeight}
            visitStorageKey="projects-onboarding-hints-seen"
          />

          <div className="relative z-10">
            <header className="theme-text-primary relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 pt-24">
              <p className="theme-text-subtle text-sm uppercase tracking-[0.22em]">{projectsPageContent.eyebrow}</p>
              <h1 className="text-3xl font-medium xs:text-4xl sm:text-5xl">{projectsPageContent.title}</h1>
              <p className="theme-text-muted max-w-2xl">{projectsPageContent.summary}</p>
            </header>

            <div className="relative mt-8">
              <ProjectStoryboard
                scrollContainer={scrollRef}
                items={projectItems}
                onCardSelect={handleCardSelect}
                forceLowPower={bootLowPower}
                themeMode={themeMode}
              />
            </div>

            <ProjectExpandOverlay
              item={selectedProject}
              originPos={originPos}
              onClose={handleOverlayClose}
              themeMode={themeMode}
            />
          </div>
        </div>
      )}
    </PageScaffold>
  );
};

export default ProjectsPage;
