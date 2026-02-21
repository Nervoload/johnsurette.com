import React, { RefObject, useEffect, useRef } from "react";
import CenterpieceStage from "../components/LandingComponents/CenterpieceStage";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import { defaultBackgroundEffectId } from "../components/LandingComponents/backgroundEffects/backgroundEffectRegistry";
import LandingOnboardingOverlay from "../components/LandingComponents/onboarding/LandingOnboardingOverlay";
import {
  centerpieceRegistry,
  defaultCenterpieceId,
} from "../components/LandingComponents/centerpieces/centerpieceRegistry";
import LandingConclusionSection from "../components/LandingStory/LandingConclusionSection";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { useIsTouch } from "../hooks/usePointerDevice";
import PageScaffold from "../components/layout/PageScaffold";

export type LandingEntryTarget = "hero" | "conclusion";

export interface LandingPageProps {
  onNavigate: (path: string, opts?: WipeOptions) => boolean | void;
  navInteractionTick?: number;
  onEnterOriginExperience?: () => boolean | void;
  entryTarget?: LandingEntryTarget;
  entryNonce?: number;
}

interface LandingContentProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  onNavigate: (path: string, opts?: WipeOptions) => boolean | void;
  navInteractionTick?: number;
  onEnterOriginExperience?: () => boolean | void;
  entryTarget: LandingEntryTarget;
  entryNonce: number;
}

const LandingContent: React.FC<LandingContentProps> = ({
  scrollContainerRef,
  onNavigate,
  navInteractionTick,
  onEnterOriginExperience,
  entryTarget,
  entryNonce,
}) => {
  const ActiveCenterpiece = centerpieceRegistry[defaultCenterpieceId].component;
  const isTouch = useIsTouch();
  const conclusionSectionRef = useRef<HTMLElement>(null);
  const lastEntryNonceRef = useRef<number>(-1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (lastEntryNonceRef.current === entryNonce) return;

    lastEntryNonceRef.current = entryNonce;

    const scrollToConclusion = (): void => {
      const target = conclusionSectionRef.current;
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

    onNavigate("/origin", {
      color: "#22d3ee",
      direction: "down",
      intensity: "lite",
      duration: 640,
    });
  };

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="sticky top-0 h-[100dvh]">
          <DepthRainBackdrop
            effectId={defaultBackgroundEffectId}
            quality="balanced"
            interactionMode="medium"
            styleSeed={37}
          />
        </div>
      </div>

      <LandingOnboardingOverlay
        scrollContainerRef={scrollContainerRef}
        navInteractionTick={navInteractionTick}
        isTouch={isTouch}
      />

      <div className="relative z-10">
        <section className="relative flex min-h-[100dvh] items-center justify-center">
          <div className="relative z-10 px-4 sm:px-6">
            <CenterpieceStage activeSection={null} centerpiece={ActiveCenterpiece} />
          </div>
        </section>

        <section className="relative flex min-h-[72dvh] items-center justify-center px-5 text-center">
          <div className="max-w-3xl rounded-[2rem] bg-white/42 px-8 py-10 shadow-[0_40px_90px_-70px_rgba(2,6,23,0.88)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">02 · Origin Sequence</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-4xl">
              Enter the cinematic origin sequence.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              From particles to galaxies, this is a dedicated immersive stage rendered on a separate route.
            </p>
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={handleOpenOriginLab}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-cyan-100 transition hover:scale-[1.02]"
              >
                Open Origin Lab
              </button>
            </div>
          </div>
        </section>

        <div ref={conclusionSectionRef}>
          <LandingConclusionSection onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  navInteractionTick,
  onEnterOriginExperience,
  entryTarget = "hero",
  entryNonce = 0,
}) => {
  return (
    <PageScaffold
      backgroundClassName="bg-[radial-gradient(circle_at_20%_0%,rgba(186,230,253,0.55),rgba(224,231,255,0.42)_34%,rgba(248,250,252,1)_78%)]"
      footerBackgroundColor="#ffffff"
    >
      {(scrollRef) => (
        <LandingContent
          scrollContainerRef={scrollRef}
          onNavigate={onNavigate}
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
