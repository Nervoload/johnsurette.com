import React from "react";
import { LandingOriginLabContent } from "../../content";
import { StorySectionData, StoryTransitionKind } from "./storySections";

const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "").trim();

  if (normalized.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const clampIndex = (index: number): string => `${index + 1}`.padStart(2, "0");

const transitionTitleByKind: Record<StoryTransitionKind, string> = {
  "cell-split": "Signal split",
  "ring-mesh": "Pattern mesh",
  "synapse-grid": "Synapse grid",
  "grid-ascend": "Grid ascend",
};

const transitionOverlayStyle = (
  transition: StoryTransitionKind | undefined,
  fromSection: StorySectionData | null,
  toSection: StorySectionData,
): React.CSSProperties => {
  const fromAccent = fromSection?.accent ?? toSection.accent;
  const fromGlow = fromSection?.glow ?? toSection.glow;
  const baseColor = fromSection?.deep ?? "#020617";

  if (transition === "cell-split") {
    return {
      background: `
        radial-gradient(circle at 30% 44%, ${hexToRgba(fromAccent, 0.18)} 0%, transparent 34%),
        radial-gradient(circle at 72% 58%, ${hexToRgba(toSection.glow, 0.18)} 0%, transparent 32%),
        linear-gradient(90deg, transparent 0%, ${hexToRgba("#ffffff", 0.18)} 49.3%, ${hexToRgba("#ffffff", 0.05)} 50.7%, transparent 100%),
        linear-gradient(180deg, ${hexToRgba(baseColor, 0)} 0%, ${hexToRgba(baseColor, 0.7)} 100%)
      `,
    };
  }

  if (transition === "ring-mesh") {
    return {
      background: `
        radial-gradient(circle at 50% 48%, transparent 0 18%, ${hexToRgba(toSection.accent, 0.22)} 18.6%, transparent 20.8%),
        radial-gradient(circle at 50% 48%, transparent 0 30%, ${hexToRgba(fromGlow, 0.15)} 30.8%, transparent 33%),
        linear-gradient(90deg, transparent 0%, ${hexToRgba("#ffffff", 0.08)} 50%, transparent 100%),
        linear-gradient(180deg, ${hexToRgba(baseColor, 0)} 0%, ${hexToRgba(baseColor, 0.7)} 100%)
      `,
    };
  }

  return {
    background: `
      radial-gradient(circle at 50% 42%, ${hexToRgba(toSection.accent, 0.18)} 0%, transparent 28%),
      linear-gradient(90deg, transparent 0%, transparent 16%, ${hexToRgba(fromAccent, 0.16)} 16.4%, transparent 17.2%, transparent 50%, ${hexToRgba(toSection.glow, 0.16)} 50.4%, transparent 51.2%, transparent 84%, ${hexToRgba(fromGlow, 0.12)} 84.4%, transparent 85.2%, transparent 100%),
      linear-gradient(180deg, ${hexToRgba(baseColor, 0)} 0%, ${hexToRgba(baseColor, 0.76)} 100%)
    `,
  };
};

export interface LandingHeroStoryBridgeProps {
  storySections: StorySectionData[];
  originLabContent: LandingOriginLabContent;
  onOpenOriginLab: () => void;
}

export const LandingHeroStoryBridge: React.FC<LandingHeroStoryBridgeProps> = ({
  storySections,
  originLabContent,
  onOpenOriginLab,
}) => {
  const chapterCount = storySections.length;
  const firstSection = storySections[0];
  const chapterSummary = storySections
    .map((section) => section.title.split(",")[0].replace(/\.$/, ""))
    .slice(0, 4)
    .join(" • ");

  return (
    <section className="relative px-4 py-[10dvh] xs:px-6 sm:px-10 lg:px-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem]"
        style={{
          background: `
            linear-gradient(180deg, rgba(2, 6, 23, 0) 0%, rgba(2, 6, 23, 0.74) 42%, rgba(2, 6, 23, 0.95) 100%),
            radial-gradient(circle at 50% 0%, ${hexToRgba(firstSection?.accent ?? "#22d3ee", 0.22)} 0%, transparent 42%)
          `,
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-[4rem] flex justify-center">
        <div
          className="h-[22rem] w-px"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(firstSection?.glow ?? "#818cf8", 0)} 0%, ${hexToRgba(firstSection?.glow ?? "#818cf8", 0.5)} 34%, ${hexToRgba(firstSection?.accent ?? "#22d3ee", 0.1)} 100%)`,
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-[112rem] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)] lg:items-end lg:gap-16">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.36em] text-cyan-100/64">
            Narrative sequence · {chapterCount} chapters
          </p>
          <h2 className="mt-5 max-w-4xl text-balance text-[clamp(2.4rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-white">
            Scroll from the hero into a continuous story about systems, computation, biology, and future work.
          </h2>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-slate-300/84 sm:text-[1.12rem]">
            {chapterSummary}
          </p>
          {originLabContent.isVisible !== false && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenOriginLab}
                className="rounded-full border border-cyan-200/18 bg-cyan-200/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-50 transition duration-300 hover:border-cyan-100/28 hover:bg-cyan-100/14"
              >
                {originLabContent.ctaLabel}
              </button>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-400/88">
                Dedicated cinematic route
              </span>
            </div>
          )}
        </div>

        <ol className="relative grid gap-5 pb-2">
          {storySections.map((section, index) => (
            <li
              key={section.id}
              className="group relative border-l border-white/10 pl-5 transition duration-300 hover:border-white/20"
            >
              <span
                aria-hidden
                className="absolute -left-[5px] top-[0.85rem] h-[9px] w-[9px] rounded-full"
                style={{
                  backgroundColor: section.accent,
                  boxShadow: `0 0 0 8px ${hexToRgba(section.accent, 0.08)}`,
                }}
              />
              <div className="flex items-baseline gap-3">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500/88">
                  {clampIndex(index)}
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400/88">{section.eyebrow}</span>
              </div>
              <p className="mt-2 text-[1.05rem] font-medium leading-relaxed text-slate-100/92 sm:text-[1.12rem]">
                {section.summary}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export interface LandingStoryTransitionBandProps {
  fromSection: StorySectionData | null;
  toSection: StorySectionData;
  transition?: StoryTransitionKind;
}

export const LandingStoryTransitionBand: React.FC<LandingStoryTransitionBandProps> = ({
  fromSection,
  toSection,
  transition,
}) => {
  const transitionTitle = transition ? transitionTitleByKind[transition] : "Story bridge";

  return (
    <div className="pointer-events-none relative -mb-[12dvh] h-[26dvh] min-h-[10rem] overflow-hidden sm:h-[30dvh]">
      <div className="absolute inset-0" style={transitionOverlayStyle(transition, fromSection, toSection)} />
      <div className="absolute inset-x-0 bottom-[28%] flex justify-center">
        <div
          className="h-px w-[min(76vw,38rem)]"
          style={{
            background: `linear-gradient(90deg, ${hexToRgba(fromSection?.accent ?? toSection.accent, 0)} 0%, ${hexToRgba(toSection.glow, 0.4)} 50%, ${hexToRgba(toSection.accent, 0)} 100%)`,
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-[18%] flex justify-center px-6">
        <div className="rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 backdrop-blur-lg">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-slate-300/76">
            {transitionTitle} · {toSection.eyebrow}
          </p>
        </div>
      </div>
    </div>
  );
};
