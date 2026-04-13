import React from "react";
import { ProjectItem } from "./projectData";
import { ResolvedThemeMode } from "../theme/themeMode";

interface ProjectsCaseStudyIndexProps {
  projects: ProjectItem[];
  themeMode: ResolvedThemeMode;
  onOpenCaseStudy: (project: ProjectItem) => void;
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

const ProjectsCaseStudyIndex: React.FC<ProjectsCaseStudyIndexProps> = ({
  projects,
  themeMode,
  onOpenCaseStudy,
}) => {
  const isDark = themeMode === "dark";

  const routeIndexStyle: React.CSSProperties = isDark
    ? {
        background: "rgba(2, 6, 23, 0.62)",
        borderColor: "rgba(148, 163, 184, 0.16)",
        boxShadow: "0 24px 64px -48px rgba(2, 6, 23, 0.94)",
      }
    : {
        background: "rgba(255, 255, 255, 0.74)",
        borderColor: "rgba(148, 163, 184, 0.18)",
        boxShadow: "0 24px 64px -54px rgba(15, 23, 42, 0.26)",
      };

  return (
    <section className="relative z-20 mx-auto w-full max-w-6xl px-6 pb-28 pt-8 sm:pt-14">
      <div className="mx-auto max-w-4xl">
        <p className="theme-text-subtle text-[0.76rem] uppercase tracking-[0.28em]">Case Study Directory</p>
        <h2 className="theme-text-primary mt-4 text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[2.5rem]">
          Open a route when you want the editorial version.
        </h2>

        <div className="mt-8 overflow-hidden rounded-[1.8rem] border p-2 sm:p-3" style={routeIndexStyle}>
          <div className="space-y-2">
            {projects.map((project, index) => {
              return (
                <button
                  key={project.id}
                  type="button"
                  className="group w-full rounded-[1.35rem] border px-4 py-4 text-left transition duration-200 hover:translate-y-[-1px] sm:px-5"
                  style={{
                    borderColor: hexToRgba(project.accent, 0.14),
                    background: isDark
                      ? "rgba(15, 23, 42, 0.34)"
                      : "rgba(255, 255, 255, 0.56)",
                  }}
                  onClick={() => onOpenCaseStudy(project)}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold uppercase tracking-[0.18em] theme-text-subtle"
                        style={{
                          borderColor: hexToRgba(project.accent, 0.2),
                          background: hexToRgba(project.accent, isDark ? 0.08 : 0.05),
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <p className="theme-text-subtle text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
                          {project.hero.eyebrow}
                        </p>
                        <h3 className="theme-text-primary mt-2 text-[1.12rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.2rem]">
                          {project.title}
                        </h3>
                        <p className="theme-text-muted mt-2 max-w-2xl text-[0.92rem] leading-relaxed">
                          {project.hero.thesis}
                        </p>
                      </div>
                    </div>

                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCaseStudyIndex;
