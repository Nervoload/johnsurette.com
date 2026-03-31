import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../theme/themeMode";
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
  const captionMap = useMemo(
    () => new Map(project.captions.map((caption) => [caption.assetId, caption])),
    [project.captions],
  );

  const rootGlowStyle = useMemo<React.CSSProperties>(
    () => ({
      background: `
        radial-gradient(circle at 14% 12%, ${hexToRgba(project.accent, themeMode === "dark" ? 0.2 : 0.14)}, transparent 26%),
        radial-gradient(circle at 82% 18%, ${hexToRgba(project.palette.line, themeMode === "dark" ? 0.16 : 0.12)}, transparent 28%),
        linear-gradient(180deg, ${hexToRgba(project.palette.deep, themeMode === "dark" ? 0.16 : 0.04)}, transparent 34%)
      `,
    }),
    [project.accent, project.palette.deep, project.palette.line, themeMode],
  );

  const panelStyle = useMemo<React.CSSProperties>(() => {
    if (themeMode === "dark") {
      return {
        background: `linear-gradient(165deg, rgba(2, 6, 23, 0.86), ${hexToRgba(project.palette.deep, 0.82)})`,
        borderColor: hexToRgba(project.accent, 0.24),
        boxShadow: `0 30px 100px -52px ${hexToRgba(project.palette.deep, 0.94)}`,
      };
    }

    return {
      background: `linear-gradient(165deg, rgba(255, 255, 255, 0.92), ${hexToRgba(project.palette.bright, 0.94)})`,
      borderColor: hexToRgba(project.accent, 0.18),
      boxShadow: `0 30px 100px -52px ${hexToRgba(project.palette.deep, 0.32)}`,
    };
  }, [project.accent, project.palette.bright, project.palette.deep, themeMode]);

  const toneClass = themeMode === "dark" ? "text-white" : "text-slate-950";
  const bodyToneClass = themeMode === "dark" ? "text-slate-300" : "text-slate-600";
  const mutedToneClass = themeMode === "dark" ? "text-slate-400" : "text-slate-500";

  return (
    <section className="relative isolate overflow-hidden pb-28 pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0" style={rootGlowStyle} />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 sm:gap-16">
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

          <div className={`flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] ${mutedToneClass}`}>
            <span>{project.year}</span>
            <span>{project.role}</span>
          </div>
        </motion.div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
          >
            <p className={`text-[0.76rem] font-semibold uppercase tracking-[0.28em] ${mutedToneClass}`}>
              {project.hero.eyebrow}
            </p>
            <h1 className={`mt-5 text-[2.7rem] font-semibold leading-[0.94] tracking-[-0.06em] sm:text-[4.2rem] ${toneClass}`}>
              {project.title}
            </h1>
            <p className={`mt-6 max-w-2xl text-[1.06rem] leading-relaxed sm:text-[1.14rem] ${bodyToneClass}`}>
              {project.hero.thesis}
            </p>
            <p className={`mt-5 max-w-2xl text-[0.98rem] leading-relaxed ${bodyToneClass}`}>
              {project.hero.summary}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div
                  key={`${project.id}-${metric.label}`}
                  className="rounded-[1.45rem] border px-4 py-4"
                  style={{
                    borderColor: hexToRgba(project.accent, 0.16),
                    background: hexToRgba(project.accent, themeMode === "dark" ? 0.08 : 0.05),
                  }}
                >
                  <p className={`text-[0.66rem] font-semibold uppercase tracking-[0.2em] ${mutedToneClass}`}>
                    {metric.label}
                  </p>
                  <p className={`mt-3 text-[1.7rem] font-semibold tracking-[-0.05em] ${toneClass}`}>{metric.value}</p>
                  <p className={`mt-2 text-[0.88rem] leading-relaxed ${bodyToneClass}`}>{metric.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="relative overflow-hidden rounded-[2rem] border p-4 sm:p-5"
            style={panelStyle}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 16% 16%, ${hexToRgba(project.accent, themeMode === "dark" ? 0.22 : 0.14)}, transparent 30%),
                  linear-gradient(160deg, transparent, ${hexToRgba(project.palette.line, themeMode === "dark" ? 0.12 : 0.08)})
                `,
              }}
            />
            <img
              src={project.hero.media}
              alt={`${project.title} hero artifact`}
              className="relative z-10 aspect-[4/5] w-full rounded-[1.55rem] object-cover"
              loading="eager"
            />
            <figcaption className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={`text-[0.66rem] font-semibold uppercase tracking-[0.22em] ${mutedToneClass}`}>
                  {project.hero.artifactLabel}
                </p>
                <p className={`mt-2 text-[1rem] font-semibold tracking-[-0.02em] ${toneClass}`}>
                  {project.hero.surfaceLabel}
                </p>
              </div>
              <div
                className={`rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${mutedToneClass}`}
                style={{ borderColor: hexToRgba(project.accent, 0.18) }}
              >
                {project.front.status}
              </div>
            </figcaption>
          </motion.figure>
        </section>

        <section className="grid gap-6">
          {project.chapters.map((chapter, index) => {
            const asset = project.gallery[index % project.gallery.length];
            const caption = captionMap.get(asset.id);
            const assetFirst = index % 2 === 0;

            return (
              <motion.article
                key={chapter.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:items-start"
              >
                <div className={`${assetFirst ? "lg:order-1" : "lg:order-2"} rounded-[1.9rem] border p-5 sm:p-6`} style={panelStyle}>
                  <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.26em] ${mutedToneClass}`}>
                    {chapter.eyebrow}
                  </p>
                  <h2 className={`mt-4 text-[1.7rem] font-semibold leading-tight tracking-[-0.04em] sm:text-[2.25rem] ${toneClass}`}>
                    {chapter.title}
                  </h2>
                  <div className={`mt-5 space-y-4 text-[0.98rem] leading-relaxed ${bodyToneClass}`}>
                    {chapter.body.map((paragraph) => (
                      <p key={`${chapter.id}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                    ))}
                  </div>
                  {chapter.aside ? (
                    <div
                      className="mt-6 rounded-[1.35rem] border px-4 py-4"
                      style={{
                        borderColor: hexToRgba(project.accent, 0.16),
                        background: hexToRgba(project.accent, themeMode === "dark" ? 0.08 : 0.05),
                      }}
                    >
                      <p className={`text-[0.66rem] font-semibold uppercase tracking-[0.22em] ${mutedToneClass}`}>
                        Design note
                      </p>
                      <p className={`mt-3 text-[0.95rem] leading-relaxed ${bodyToneClass}`}>{chapter.aside}</p>
                    </div>
                  ) : null}
                </div>

                <figure
                  className={`${assetFirst ? "lg:order-2" : "lg:order-1"} overflow-hidden rounded-[1.9rem] border p-4 sm:p-5`}
                  style={panelStyle}
                >
                  <img
                    src={asset.src}
                    alt={asset.alt}
                    className="aspect-[3/2] w-full rounded-[1.45rem] object-cover"
                    loading="lazy"
                  />
                  {caption ? (
                    <figcaption className="mt-4">
                      <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${mutedToneClass}`}>
                        {caption.title}
                      </p>
                      <p className={`mt-3 text-[0.95rem] leading-relaxed ${bodyToneClass}`}>
                        {caption.body}
                      </p>
                    </figcaption>
                  ) : null}
                </figure>
              </motion.article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
          <div className="rounded-[2rem] border p-6 sm:p-7" style={panelStyle}>
            <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.26em] ${mutedToneClass}`}>
              Outcomes
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {project.outcomes.map((outcome) => (
                <div
                  key={`${project.id}-${outcome.label}`}
                  className="rounded-[1.4rem] border px-4 py-4"
                  style={{
                    borderColor: hexToRgba(project.accent, 0.16),
                    background: hexToRgba(project.accent, themeMode === "dark" ? 0.07 : 0.05),
                  }}
                >
                  <p className={`text-[0.66rem] font-semibold uppercase tracking-[0.2em] ${mutedToneClass}`}>
                    {outcome.label}
                  </p>
                  <p className={`mt-3 text-[1.4rem] font-semibold tracking-[-0.04em] ${toneClass}`}>{outcome.value}</p>
                  <p className={`mt-2 text-[0.9rem] leading-relaxed ${bodyToneClass}`}>{outcome.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border p-6 sm:p-7" style={panelStyle}>
            <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.26em] ${mutedToneClass}`}>
              Credits And Links
            </p>
            <div className="mt-6 space-y-4">
              {project.credits.map((credit) => (
                <div key={`${project.id}-${credit.label}`} className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                  <p className={`text-[0.76rem] font-semibold uppercase tracking-[0.2em] ${mutedToneClass}`}>
                    {credit.label}
                  </p>
                  <p className={`max-w-[16rem] text-right text-[0.95rem] leading-relaxed ${bodyToneClass}`}>
                    {credit.value}
                  </p>
                </div>
              ))}
            </div>
            {project.links.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.links.map((link) => {
                  const isInternal = link.href.startsWith("/");
                  return (
                    <button
                      key={`${project.id}-${link.label}`}
                      type="button"
                      className="theme-pill-button rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:translate-y-[-1px]"
                      onClick={() => {
                        if (isInternal) {
                          onNavigate(link.href, {
                            color: project.accent,
                            direction: "right",
                            intensity: "lite",
                            duration: 620,
                          });
                          return;
                        }

                        window.open(link.href, "_blank", "noopener,noreferrer");
                      }}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>

        {nextProject ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[2.3rem] border p-6 sm:p-8"
            style={panelStyle}
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.26em] ${mutedToneClass}`}>
                  Next Case Study
                </p>
                <h2 className={`mt-4 text-[2rem] font-semibold tracking-[-0.05em] sm:text-[2.7rem] ${toneClass}`}>
                  {nextProject.title}
                </h2>
                <p className={`mt-4 max-w-2xl text-[1rem] leading-relaxed ${bodyToneClass}`}>
                  {nextProject.hero.thesis}
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
