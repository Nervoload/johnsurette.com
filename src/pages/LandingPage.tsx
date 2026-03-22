import React, { RefObject, useEffect, useRef } from "react";
import {
  landingHeroIdentityContent,
  landingOriginLabContent,
  pageVisuals,
} from "../content";
import CenterpieceStage from "../components/LandingComponents/CenterpieceStage";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import LandingHeroIdentity from "../components/LandingComponents/LandingHeroIdentity";
import LandingOnboardingOverlay from "../components/LandingComponents/onboarding/LandingOnboardingOverlay";
import {
  centerpieceRegistry,
} from "../components/LandingComponents/centerpieces/centerpieceRegistry";
import LandingStoryboard from "../components/LandingStory/LandingStoryboard";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { useIsTouch } from "../hooks/usePointerDevice";
import PageScaffold from "../components/layout/PageScaffold";
import { ShadowMode } from "../components/theme/shadowMode";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";

export type LandingEntryTarget = "hero" | "conclusion";

export interface LandingPageProps {
  onNavigate: (path: string, opts?: WipeOptions) => boolean | void;
  shadowMode: ShadowMode;
  navInteractionTick?: number;
  onEnterOriginExperience?: () => boolean | void;
  entryTarget?: LandingEntryTarget;
  entryNonce?: number;
}

interface LandingContentProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  onNavigate: (path: string, opts?: WipeOptions) => boolean | void;
  shadowMode: ShadowMode;
  navInteractionTick?: number;
  onEnterOriginExperience?: () => boolean | void;
  entryTarget: LandingEntryTarget;
  entryNonce: number;
}

const LandingContent: React.FC<LandingContentProps> = ({
  scrollContainerRef,
  onNavigate,
  shadowMode,
  navInteractionTick,
  onEnterOriginExperience,
  entryTarget,
  entryNonce,
}) => {
  const landingContentProbe = createCodexProbeAttributes({
    componentName: "LandingContent",
    filePath: "/src/pages/LandingPage.tsx",
    componentPath: ["LandingPage", "LandingContent"],
    role: "page-content",
  });

  const landingVisuals = pageVisuals.landing;
  const activeCenterpieceEntry = centerpieceRegistry[landingVisuals.centerpieceId ?? "waveOrb"];
  const ActiveCenterpiece = activeCenterpieceEntry.component;
  const shadowAssetId = activeCenterpieceEntry.shadowAssetId;
  const isTouch = useIsTouch();
  const heroSectionRef = useRef<HTMLElement>(null);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const lastEntryNonceRef = useRef<number>(-1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (lastEntryNonceRef.current === entryNonce) return;

    lastEntryNonceRef.current = entryNonce;

    const scrollToConclusion = (): void => {
      const target = storySectionRef.current;
      const fallback = Math.max(0, container.clientHeight * 1.52);
      const targetTop = target?.offsetTop ?? fallback;
      const minimumConclusionTop = container.clientHeight * 1.35;
      const nextTop = Math.max(0, targetTop - 24, minimumConclusionTop);
      container.scrollTo({ top: nextTop, behavior: "auto" });
    };

    let frameA = 0;
    let frameB = 0;
    let timeout = 0;

    frameA = window.requestAnimationFrame(() => {
      if (entryTarget === "conclusion") {
        scrollToConclusion();
        frameB = window.requestAnimationFrame(scrollToConclusion);
        timeout = window.setTimeout(scrollToConclusion, 180);
        return;
      }

      container.scrollTo({ top: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
      window.clearTimeout(timeout);
    };
  }, [entryNonce, entryTarget, scrollContainerRef]);

  const handleOpenOriginLab = (): void => {
    if (onEnterOriginExperience) {
      const accepted = onEnterOriginExperience();
      if (accepted !== false) return;
    }

    onNavigate(landingOriginLabContent.ctaPath, {
      color: "#22d3ee",
      direction: "down",
      intensity: "lite",
      duration: 640,
    });
  };

  return (
    <div {...landingContentProbe} className="relative isolate">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="sticky top-0 h-[100dvh]">
          <DepthRainBackdrop
            effectId={landingVisuals.backdropEffectId}
            quality={landingVisuals.backdropQuality}
            interactionMode={landingVisuals.backdropInteractionMode}
            styleSeed={landingVisuals.backdropStyleSeed}
          />
        </div>
      </div>

      <LandingOnboardingOverlay
        scrollContainerRef={scrollContainerRef}
        navInteractionTick={navInteractionTick}
        isTouch={isTouch}
        navInteractionLockMs={2000}
        visitStorageKey="landing-onboarding-hints-seen"
      />

      <LandingHeroIdentity
        scrollContainerRef={scrollContainerRef}
        heroSectionRef={heroSectionRef}
        content={landingHeroIdentityContent}
      />

      <div className="relative z-10">
        <section ref={heroSectionRef} className="relative flex min-h-[100dvh] items-center justify-center">
          <div className="relative z-10 px-4 sm:px-6">
            <CenterpieceStage
              activeSection={null}
              centerpiece={ActiveCenterpiece}
              shadowMode={shadowMode}
              shadowAssetId={shadowAssetId}
            />
          </div>
        </section>

        {landingOriginLabContent.isVisible !== false && (
          <section className="relative flex min-h-[72dvh] items-center justify-center px-5 text-center">
            <div className="theme-surface-elevated max-w-3xl rounded-[2rem] px-8 py-10 backdrop-blur-xl">
              <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{landingOriginLabContent.eyebrow}</p>
              <h2 className="theme-text-primary mt-4 text-2xl font-semibold sm:text-4xl">
                {landingOriginLabContent.title}
              </h2>
              <p className="theme-text-muted mt-4 text-base leading-relaxed">{landingOriginLabContent.summary}</p>
              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={handleOpenOriginLab}
                  className="theme-cta-button rounded-full px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] transition hover:scale-[1.02]"
                >
                  {landingOriginLabContent.ctaLabel}
                </button>
              </div>
            </div>
          </section>
        )}

        <div ref={storySectionRef}>
          <LandingStoryboard onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  shadowMode,
  navInteractionTick,
  onEnterOriginExperience,
  entryTarget = "hero",
  entryNonce = 0,
}) => {
  return (
    <PageScaffold
      backgroundClassName={pageVisuals.landing.backgroundClassName}
      footerBackgroundColor={pageVisuals.landing.footerBackgroundColor}
    >
      {(scrollRef) => (
        <LandingContent
          scrollContainerRef={scrollRef}
          onNavigate={onNavigate}
          shadowMode={shadowMode}
          navInteractionTick={navInteractionTick}
          onEnterOriginExperience={onEnterOriginExperience}
          entryTarget={entryTarget}
          entryNonce={entryNonce}
        />
      )}
    </PageScaffold>
  );
};

export default LandingPage;
