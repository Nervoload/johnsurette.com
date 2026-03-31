import React, { useCallback, useEffect, useState } from "react";
import { getProjectPath, pageVisuals, projectsPageContent } from "../content";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import LandingOnboardingOverlay from "../components/LandingComponents/onboarding/LandingOnboardingOverlay";
import ProjectStoryboard from "../components/Projects/ProjectStoryboard";
import ProjectsCaseStudyIndex from "../components/Projects/ProjectsCaseStudyIndex";
import { ProjectItem, projectItems } from "../components/Projects/projectData";
import PageScaffold from "../components/layout/PageScaffold";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../components/theme/themeMode";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";
import { useIsTouch } from "../hooks/usePointerDevice";

export interface ProjectsPageProps {
  themeMode: ResolvedThemeMode;
  navInteractionTick?: number;
  onNavigate: (path: string, opts?: WipeOptions) => boolean | void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ themeMode, navInteractionTick, onNavigate }) => {
  const projectsPageProbe = createCodexProbeAttributes({
    componentName: "ProjectsPage",
    filePath: "/src/pages/ProjectsPage.tsx",
    componentPath: ["ProjectsPage"],
    role: "page",
  });

  const [bootLowPower, setBootLowPower] = useState(true);
  const projectVisuals = pageVisuals.projects;
  const isTouch = useIsTouch();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setBootLowPower(false);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleCardSelect = useCallback(
    (item: ProjectItem) => {
      onNavigate(getProjectPath(item.slug), {
        color: item.accent,
        direction: "down",
        intensity: "lite",
        duration: 620,
      });
    },
    [onNavigate],
  );

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
            <header className="theme-text-primary relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 pt-24">
              <p className="theme-text-subtle text-[0.78rem] uppercase tracking-[0.3em]">{projectsPageContent.eyebrow}</p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.94] tracking-[-0.05em] xs:text-5xl sm:text-6xl">
                {projectsPageContent.title}
              </h1>
              <p className="theme-text-muted max-w-3xl text-[1rem] leading-relaxed sm:text-[1.06rem]">
                {projectsPageContent.summary}
              </p>
            </header>

            <div className="relative mt-10">
              <ProjectStoryboard
                scrollContainer={scrollRef}
                items={projectItems}
                onCardSelect={handleCardSelect}
                forceLowPower={bootLowPower}
                themeMode={themeMode}
              />
            </div>

            <ProjectsCaseStudyIndex
              projects={projectItems}
              themeMode={themeMode}
              onOpenCaseStudy={handleCardSelect}
            />
          </div>
        </div>
      )}
    </PageScaffold>
  );
};

export default ProjectsPage;
