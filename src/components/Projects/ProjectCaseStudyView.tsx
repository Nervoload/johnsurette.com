import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../theme/themeMode";
import { ProjectCaseStudyHero, ProjectCaseStudyRowView } from "./ProjectCaseStudyBlocks";
import { getProjectItemBySlug, ProjectItem } from "./projectData";

interface ProjectCaseStudyViewProps {
  project: ProjectItem;
  themeMode: ResolvedThemeMode;
  onNavigate: (path: string, opts?: WipeOptions) => void;
  getProjectPath: (slug: string) => string;
}

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;

  const channel = (index: number) => Number.parseInt(value.slice(index, index + 2), 16);
  return `rgba(${channel(0)}, ${channel(2)}, ${channel(4)}, ${alpha})`;
};

const ProjectCaseStudyView: React.FC<ProjectCaseStudyViewProps> = ({
  project,
  themeMode,
  onNavigate,
  getProjectPath,
}) => {
  const nextProject = project.nextProject ? getProjectItemBySlug(project.nextProject) : null;

  const rootGlowStyle = useMemo<React.CSSProperties>(
    () => ({
      background: `
        radial-gradient(circle at 14% 12%, ${hexToRgba(project.accent, themeMode === "dark" ? 0.22 : 0.12)}, transparent 28%),
        radial-gradient(circle at 82% 18%, ${hexToRgba(project.palette.line, themeMode === "dark" ? 0.14 : 0.1)}, transparent 30%),
        linear-gradient(180deg, ${hexToRgba(project.palette.deep, themeMode === "dark" ? 0.2 : 0.05)}, transparent 34%)
      `,
    }),
    [project.accent, project.palette.deep, project.palette.line, themeMode],
  );

  const nextProjectPanelStyle = useMemo<React.CSSProperties>(
    () =>
      themeMode === "dark"
        ? {
            background: `linear-gradient(160deg, rgba(8, 15, 30, 0.82), rgba(8, 15, 30, 0.54) 58%, ${hexToRgba(project.accent, 0.1)})`,
            boxShadow: `0 30px 90px -62px rgba(2, 6, 23, 1), 0 14px 40px -26px ${hexToRgba(project.accent, 0.3)}`,
            backdropFilter: "blur(22px) saturate(150%)",
          }
        : {
            background: `linear-gradient(160deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.38) 58%, ${hexToRgba(project.accent, 0.08)})`,
            boxShadow: `0 28px 84px -60px rgba(15, 23, 42, 0.2), 0 14px 34px -26px ${hexToRgba(project.accent, 0.16)}`,
            backdropFilter: "blur(22px) saturate(145%)",
          },
    [project.accent, themeMode],
  );

  const handleLinkActivate = (href: string) => {
    if (href.startsWith("/")) {
      onNavigate(href, {
        color: project.accent,
        direction: "right",
        intensity: "lite",
        duration: 620,
      });
      return;
    }

    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative isolate overflow-hidden pb-28 pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0" style={rootGlowStyle} />
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col gap-12 px-6 sm:gap-14 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <button
            type="button"
            className="theme-pill-button rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:translate-y-[-1px]"
            onClick={() =>
              onNavigate("/projects", {
                color: project.accent,
                direction: "up",
                intensity: "lite",
                duration: 620,
              })
            }
          >
            Back To Projects
          </button>

          <div className="theme-text-subtle flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={`${project.id}-${tag}`}>{tag}</span>
            ))}
          </div>
        </motion.div>

        <ProjectCaseStudyHero
          project={project}
          themeMode={themeMode}
          onLinkActivate={handleLinkActivate}
        />

        <div className="space-y-6">
          {project.caseStudyRows.map((row, rowIndex) => (
            <ProjectCaseStudyRowView
              key={row.id}
              row={row}
              accent={project.accent}
              themeMode={themeMode}
              rowIndex={rowIndex}
            />
          ))}
        </div>

        {nextProject ? (
          <motion.section
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[2.25rem] p-6 sm:p-8"
            style={nextProjectPanelStyle}
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="theme-text-subtle text-[0.72rem] font-semibold uppercase tracking-[0.26em]">
                  Next Case Study
                </p>
                <h2 className="theme-text-primary mt-4 text-[2rem] font-semibold tracking-[-0.05em] sm:text-[2.7rem]">
                  {nextProject.title}
                </h2>
                <p className="theme-text-muted mt-4 max-w-2xl text-[1rem] leading-relaxed">
                  {nextProject.summary}
                </p>
              </div>
              <button
                type="button"
                className="theme-pill-button rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:translate-y-[-1px]"
                onClick={() =>
                  onNavigate(getProjectPath(nextProject.slug), {
                    color: nextProject.accent,
                    direction: "right",
                    intensity: "lite",
                    duration: 620,
                  })
                }
              >
                Open {nextProject.title}
              </button>
            </div>
          </motion.section>
        ) : null}
      </div>
    </section>
  );
};

export default ProjectCaseStudyView;
