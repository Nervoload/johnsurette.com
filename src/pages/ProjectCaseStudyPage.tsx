import React from "react";
import { getProjectBySlug, getProjectPath, pageVisuals } from "../content";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import ProjectCaseStudyView from "../components/Projects/ProjectCaseStudyView";
import PageScaffold from "../components/layout/PageScaffold";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../components/theme/themeMode";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";

interface ProjectCaseStudyPageProps {
  slug: string;
  onNavigate: (path: string, opts?: WipeOptions) => void;
  themeMode: ResolvedThemeMode;
}

const ProjectCaseStudyPage: React.FC<ProjectCaseStudyPageProps> = ({ slug, onNavigate, themeMode }) => {
  const project = getProjectBySlug(slug);
  const projectVisuals = pageVisuals.projects;
  const pageProbe = createCodexProbeAttributes({
    componentName: "ProjectCaseStudyPage",
    filePath: "/src/pages/ProjectCaseStudyPage.tsx",
    componentPath: ["ProjectCaseStudyPage"],
    role: "page",
  });

  return (
    <PageScaffold
      backgroundClassName={projectVisuals.backgroundClassName}
      footerBackgroundColor={projectVisuals.footerBackgroundColor}
      footerRunwayVh={92}
    >
      {() => (
        <div {...pageProbe} className="relative isolate">
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

          <div className="relative z-10">
            {project ? (
              <ProjectCaseStudyView
                project={project}
                themeMode={themeMode}
                onNavigate={onNavigate}
                getProjectPath={getProjectPath}
              />
            ) : (
              <section className="relative mx-auto w-full max-w-4xl px-6 pb-28 pt-28">
                <div className="rounded-[2rem] border px-6 py-10 sm:px-8 sm:py-12" style={{ background: themeMode === "dark" ? "rgba(2, 6, 23, 0.78)" : "rgba(255, 255, 255, 0.84)", borderColor: themeMode === "dark" ? "rgba(148, 163, 184, 0.24)" : "rgba(148, 163, 184, 0.18)" }}>
                  <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">Case Study Not Found</p>
                  <h1 className="theme-text-primary mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                    This project route exists, but there is no case study wired to <span className="font-medium text-inherit">{slug}</span>.
                  </h1>
                  <p className="theme-text-muted mt-5 max-w-2xl text-base leading-relaxed">
                    The routing layer is ready. The missing step is connecting content for this project slug.
                  </p>
                  <button
                    type="button"
                    className="theme-pill-button mt-8 rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition"
                    onClick={() =>
                      onNavigate("/projects", {
                        color: "#ffd608",
                        direction: "up",
                        intensity: "lite",
                        duration: 620,
                      })
                    }
                  >
                    Back To Projects
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </PageScaffold>
  );
};

export default ProjectCaseStudyPage;
