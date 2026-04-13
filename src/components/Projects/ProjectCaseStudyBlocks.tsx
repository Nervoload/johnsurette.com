import React from "react";
import { motion } from "framer-motion";
import {
  ProjectCaseStudyBlock,
  ProjectCaseStudyMedia,
  ProjectCaseStudyMediaBlock,
  ProjectCaseStudyRow,
} from "../../content";
import { ResolvedThemeMode } from "../theme/themeMode";
import { ProjectItem } from "./projectData";

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

const buildTextPanelStyle = (accent: string, themeMode: ResolvedThemeMode): React.CSSProperties =>
  themeMode === "dark"
    ? {
        background: `linear-gradient(160deg, rgba(8, 15, 30, 0.76), rgba(8, 15, 30, 0.42) 52%, ${hexToRgba(accent, 0.12)})`,
        boxShadow: `0 34px 96px -64px rgba(2, 6, 23, 0.98), 0 14px 36px -26px ${hexToRgba(accent, 0.34)}`,
        backdropFilter: "blur(22px) saturate(150%)",
      }
    : {
        background: `linear-gradient(160deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.3) 52%, ${hexToRgba(accent, 0.1)})`,
        boxShadow: `0 28px 84px -60px rgba(15, 23, 42, 0.24), 0 14px 34px -28px ${hexToRgba(accent, 0.18)}`,
        backdropFilter: "blur(22px) saturate(145%)",
      };

const buildTextHaloStyle = (accent: string, themeMode: ResolvedThemeMode): React.CSSProperties => ({
  background: `
    radial-gradient(circle at 18% 16%, ${hexToRgba(accent, themeMode === "dark" ? 0.2 : 0.12)}, transparent 34%),
    radial-gradient(circle at 82% 18%, rgba(255, 255, 255, ${themeMode === "dark" ? 0.08 : 0.28}), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, ${themeMode === "dark" ? 0.03 : 0.22}), transparent 48%)
  `,
});

const buildMediaShellStyle = (accent: string, themeMode: ResolvedThemeMode): React.CSSProperties =>
  themeMode === "dark"
    ? {
        background: `linear-gradient(160deg, rgba(2, 6, 23, 0.84), rgba(15, 23, 42, 0.58) 56%, ${hexToRgba(accent, 0.08)})`,
        boxShadow: `0 34px 96px -64px rgba(2, 6, 23, 1), 0 18px 44px -30px ${hexToRgba(accent, 0.24)}`,
      }
    : {
        background: `linear-gradient(160deg, rgba(255, 255, 255, 0.82), rgba(241, 245, 249, 0.56) 56%, ${hexToRgba(accent, 0.08)})`,
        boxShadow: `0 32px 88px -60px rgba(15, 23, 42, 0.2), 0 18px 44px -34px ${hexToRgba(accent, 0.14)}`,
      };

const buildMediaGlowStyle = (accent: string, themeMode: ResolvedThemeMode): React.CSSProperties => ({
  background: `
    radial-gradient(circle at 18% 18%, ${hexToRgba(accent, themeMode === "dark" ? 0.18 : 0.12)}, transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, ${themeMode === "dark" ? 0.06 : 0.2}), transparent 24%)
  `,
});

const renderMedia = (media: ProjectCaseStudyMedia, eager = false) => {
  const objectFit = media.fit ?? "cover";

  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        className="h-full w-full"
        style={{ objectFit }}
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? "auto" : "metadata"}
      />
    );
  }

  return (
    <img
      src={media.src}
      alt={media.alt}
      className="h-full w-full"
      style={{ objectFit }}
      loading={eager ? "eager" : "lazy"}
    />
  );
};

interface ProjectCaseStudyHeroProps {
  project: ProjectItem;
  themeMode: ResolvedThemeMode;
  onLinkActivate: (href: string) => void;
}

export const ProjectCaseStudyHero: React.FC<ProjectCaseStudyHeroProps> = ({
  project,
  themeMode,
  onLinkActivate,
}) => {
  return (
    <section className="flex w-full items-center py-4 sm:py-6 lg:min-h-[clamp(24rem,60svh,42rem)] lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.52, ease: REVEAL_EASE, delay: 0.04 }}
        className="w-full max-w-[min(78rem,100%)]"
      >
        <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] theme-text-subtle">
          <span>{project.hero.eyebrow}</span>
          <span className="opacity-50">/</span>
          <span>{project.year}</span>
          <span className="opacity-50">/</span>
          <span>{project.role}</span>
        </div>

        <h1 className="theme-text-primary mt-5 max-w-[11ch] text-balance text-[clamp(3.9rem,8.4vw,7.6rem)] font-semibold leading-[0.86] tracking-[-0.09em] sm:mt-6">
          {project.title}
        </h1>
        <p className="theme-text-muted mt-6 max-w-[44rem] text-[1.08rem] leading-relaxed sm:text-[1.24rem] lg:text-[1.32rem]">
          {project.subtitle}
        </p>
        <p className="theme-text-muted mt-7 max-w-[52rem] text-[1rem] leading-relaxed sm:text-[1.08rem] lg:text-[1.14rem]">
          {project.summary}
        </p>

        {project.links.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-3 gap-y-4">
            {project.links.map((link) => (
              <button
                key={`${project.id}-${link.label}`}
                type="button"
                className="theme-pill-button rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:translate-y-[-1px]"
                onClick={() => onLinkActivate(link.href)}
              >
                {link.label}
              </button>
            ))}
          </div>
        ) : null}
      </motion.div>
    </section>
  );
};

interface ProjectCaseStudyRowProps {
  row: ProjectCaseStudyRow;
  accent: string;
  themeMode: ResolvedThemeMode;
  rowIndex: number;
}

const ProjectCaseStudyTextPanel: React.FC<{
  block: Extract<ProjectCaseStudyBlock, { type: "text" }>;
  accent: string;
  themeMode: ResolvedThemeMode;
  delay: number;
}> = ({ block, accent, themeMode, delay }) => {
  const panelStyle = buildTextPanelStyle(accent, themeMode);
  const haloStyle = buildTextHaloStyle(accent, themeMode);

  return (
    <motion.article
      initial={{ opacity: 0, y: 34, scale: 0.985, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.56, ease: REVEAL_EASE, delay }}
      className="relative isolate flex min-h-[20rem] w-full min-w-0 overflow-hidden rounded-[2.15rem] p-7 sm:min-h-[22rem] sm:p-9 xl:min-h-[30rem] xl:p-10 2xl:p-11"
      style={panelStyle}
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={haloStyle} />
      <div className="relative z-10 flex h-full w-full flex-col justify-center">
        <div
          className="h-[2px] w-14 rounded-full"
          style={{ background: `linear-gradient(90deg, ${hexToRgba(accent, 0.8)}, transparent)` }}
        />
        <h2 className="theme-text-primary mt-7 max-w-[22ch] text-balance text-[1.45rem] font-semibold leading-tight tracking-[-0.055em] sm:text-[1.8rem] xl:text-[2.1rem] 2xl:text-[2.35rem]">
          {block.header}
        </h2>
        <div className="theme-text-muted mt-6 max-w-none space-y-4 text-[0.98rem] leading-relaxed sm:text-[1.04rem] xl:text-[1.1rem]">
          {block.body.map((paragraph) => (
            <p key={`${block.id}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

const ProjectCaseStudyMediaPanel: React.FC<{
  block: ProjectCaseStudyMediaBlock;
  accent: string;
  themeMode: ResolvedThemeMode;
  delay: number;
}> = ({ block, accent, themeMode, delay }) => {
  const shellStyle = buildMediaShellStyle(accent, themeMode);
  const glowStyle = buildMediaGlowStyle(accent, themeMode);
  const hasCaption = Boolean(block.captionTitle || block.caption);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 34, scale: 0.985, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.56, ease: REVEAL_EASE, delay }}
      className="group relative isolate min-h-[20rem] w-full min-w-0 self-start overflow-hidden rounded-[2rem] sm:min-h-[24rem] xl:min-h-[30rem]"
      style={{
        ...shellStyle,
        aspectRatio: block.media.aspectRatio ?? "16 / 10",
        width: "100%",
        maxWidth: "100%",
      }}
      tabIndex={hasCaption ? 0 : -1}
    >
      <div className="pointer-events-none absolute inset-0 z-10" style={glowStyle} />
      {renderMedia(block.media)}
      {hasCaption ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/16 to-transparent opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100" />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-5 text-white">
            <div className="translate-y-0 opacity-100 transition duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
              {block.captionTitle ? (
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/70">
                  {block.captionTitle}
                </p>
              ) : null}
              {block.caption ? (
                <p className="mt-2 max-w-xl text-[0.92rem] leading-relaxed text-white/92">
                  {block.caption}
                </p>
              ) : null}
            </div>
          </figcaption>
        </>
      ) : null}
    </motion.figure>
  );
};

export const ProjectCaseStudyRowView: React.FC<ProjectCaseStudyRowProps> = ({
  row,
  accent,
  themeMode,
  rowIndex,
}) => {
  const singleBlockClassName = row.blocks.length === 1 ? "xl:max-w-[48rem]" : "";

  return (
    <section
      className={`grid w-full items-start gap-7 xl:gap-8 2xl:gap-10 ${row.blocks.length > 1 ? "xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]" : ""} ${singleBlockClassName}`}
    >
      {row.blocks.map((block, blockIndex) => {
        const delay = Math.min(0.16 + rowIndex * 0.03 + blockIndex * 0.05, 0.34);

        if (block.type === "text") {
          return (
            <ProjectCaseStudyTextPanel
              key={block.id}
              block={block}
              accent={accent}
              themeMode={themeMode}
              delay={delay}
            />
          );
        }

        return (
          <ProjectCaseStudyMediaPanel
            key={block.id}
            block={block}
            accent={accent}
            themeMode={themeMode}
            delay={delay}
          />
        );
      })}
    </section>
  );
};
