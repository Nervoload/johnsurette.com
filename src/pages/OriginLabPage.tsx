// DEV-only lab for the landing's living 3D scenes. Not routed in production builds.
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import PageScaffold from "../components/layout/PageScaffold";
import {
  landingBiologySectionContent,
  landingBrainScalesContent,
  landingComputationalSectionContent,
  landingForwardPassContent,
} from "../content";
import type { ResolvedThemeMode } from "../components/theme/themeMode";
import type { LivingQualityTier } from "../components/LandingStory/visuals/living/sceneTypes";

const ForwardPassStage = lazy(() => import("../components/LandingStory/visuals/living/forwardPass/ForwardPassStage"));
const BrainScalesStage = lazy(() => import("../components/LandingStory/visuals/living/brainScales/BrainScalesStage"));

interface LivingDebugWindow extends Window {
  __living?: {
    list(): string[];
    frames(id: string): number;
    seek(id: string, phase: number): void;
    freeze(id: string, on: boolean): void;
  };
}

const useFps = (id: string) => {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let last = -1;
    const timer = window.setInterval(() => {
      const frames = (window as LivingDebugWindow).__living?.frames(id) ?? -1;
      if (last >= 0 && frames >= 0) setFps(frames - last);
      last = frames;
    }, 1000);
    return () => window.clearInterval(timer);
  }, [id]);
  return fps;
};

const LabToolbar: React.FC<{
  tier: LivingQualityTier;
  setTier: (tier: LivingQualityTier) => void;
  handheld: boolean;
  setHandheld: (value: boolean) => void;
  outline: boolean;
  setOutline: (value: boolean) => void;
}> = ({ tier, setTier, handheld, setHandheld, outline, setOutline }) => {
  const fps = useFps("forwardPass");
  const brainFps = useFps("brainScales");
  const [frozen, setFrozen] = useState(false);
  const [phase, setPhase] = useState(0);
  const debug = () => (window as LivingDebugWindow).__living;

  return (
    <div className="theme-text-muted flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs">
      <label className="flex items-center gap-2">
        tier
        <select
          className="rounded border bg-transparent px-2 py-1"
          value={tier}
          onChange={(event) => setTier(event.target.value as LivingQualityTier)}
        >
          <option value="high">high</option>
          <option value="low">low</option>
          <option value="static">static (reduced motion)</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={handheld} onChange={(event) => setHandheld(event.target.checked)} />
        handheld
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={outline} onChange={(event) => setOutline(event.target.checked)} />
        canvas bounds
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={frozen}
          onChange={(event) => {
            setFrozen(event.target.checked);
            debug()?.freeze("forwardPass", event.target.checked);
            debug()?.freeze("brainScales", event.target.checked);
          }}
        />
        freeze
      </label>
      <label className="flex items-center gap-2">
        seek
        <input
          type="range"
          min={0}
          max={25}
          step={0.05}
          value={phase}
          onChange={(event) => {
            const value = Number(event.target.value);
            setPhase(value);
            debug()?.seek("forwardPass", value);
            debug()?.seek("brainScales", value);
          }}
        />
        <span className="w-10 tabular-nums">{phase.toFixed(2)}s</span>
      </label>
      <span className="tabular-nums">forwardPass {fps} fps</span>
      <span className="tabular-nums">brainScales {brainFps} fps</span>
    </div>
  );
};

const OriginLabPage: React.FC<{ themeMode: ResolvedThemeMode }> = ({ themeMode }) => {
  const [tier, setTier] = useState<LivingQualityTier>(() => {
    const requested = new URLSearchParams(window.location.search).get("tier");
    return requested === "low" || requested === "static" ? requested : "high";
  });
  const [handheld, setHandheld] = useState(false);
  const [outline, setOutline] = useState(false);
  const stageKey = `${tier}-${handheld}`;

  return (
    <PageScaffold footerRunwayVh={20}>
      {(scrollRef) => (
        <div className="theme-text-primary">
          <header className="mx-auto flex max-w-[100rem] flex-col gap-4 px-6 pb-8 pt-28 lg:px-16">
            <p className="theme-text-subtle font-mono text-xs">/origin · dev lab</p>
            <h1 className="text-4xl font-semibold tracking-tight">Living scenes</h1>
            <LabToolbar
              tier={tier}
              setTier={setTier}
              handheld={handheld}
              setHandheld={setHandheld}
              outline={outline}
              setOutline={setOutline}
            />
          </header>

          <section className="relative isolate overflow-x-clip px-4 py-20 xs:px-6 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
            <div className="relative mx-auto grid w-full max-w-[100rem] gap-12 lg:grid-cols-[1.24fr_0.76fr] lg:items-start lg:gap-16 xl:gap-20">
              <Suspense fallback={<div className="h-[76vh] min-h-[34rem] sm:h-[80vh] lg:h-[86vh]" />}>
                <ForwardPassStage
                  key={stageKey}
                  content={landingForwardPassContent}
                  themeMode={themeMode}
                  qualityTier={tier}
                  handheld={handheld}
                  scrollRootRef={scrollRef}
                  fallback={landingComputationalSectionContent.poster}
                  className="h-[76vh] min-h-[34rem] sm:h-[80vh] lg:h-[86vh]"
                  debugOutline={outline}
                />
              </Suspense>
              <div className="relative z-20 max-w-3xl lg:pt-10">
                <h2 className="theme-story-contrast-title text-6xl font-black leading-[0.9] tracking-[-0.08em] lg:text-[6.9rem]">
                  {landingComputationalSectionContent.title}
                </h2>
                <p className="theme-text-muted mt-8 max-w-xl text-lg leading-relaxed">{landingComputationalSectionContent.body}</p>
              </div>
            </div>
          </section>
          <section className="relative isolate overflow-x-clip px-4 py-20 xs:px-6 sm:px-10 lg:px-16 lg:py-24">
            <div className="relative mx-auto grid w-full max-w-[108rem] gap-10 lg:grid-cols-[1fr_minmax(0,1.46fr)_1fr] lg:items-center xl:gap-14">
              <div className="relative z-20 lg:pr-2">
                <div className="theme-story-contrast-panel rounded-[2rem] p-6 sm:min-w-[24rem] lg:min-w-[26rem]">
                  <p className="theme-text-muted text-sm leading-relaxed">{landingBiologySectionContent.body}</p>
                </div>
              </div>
              <div className="relative order-first lg:order-none lg:justify-self-center">
                <Suspense fallback={<div className="aspect-[1.08] w-[min(92vw,46rem)]" />}>
                  <BrainScalesStage
                    key={`brain-${stageKey}`}
                    content={landingBrainScalesContent}
                    themeMode={themeMode}
                    qualityTier={tier}
                    handheld={handheld}
                    scrollRootRef={scrollRef}
                    fallback={landingBiologySectionContent.poster}
                    className="mx-auto aspect-[1.08] w-[min(92vw,46rem)] sm:w-[min(88vw,52rem)] lg:w-[min(60vw,56rem)] xl:w-[min(54vw,60rem)]"
                    debugOutline={outline}
                  />
                </Suspense>
              </div>
              <aside className="relative z-20">
                <h2 className="theme-story-contrast-title text-5xl font-semibold tracking-tight">{landingBiologySectionContent.overlayTitle}</h2>
                <p className="theme-text-muted mt-4 text-sm leading-relaxed">{landingBiologySectionContent.overlayBody}</p>
              </aside>
            </div>
          </section>
          <div className="h-[60vh]" />
        </div>
      )}
    </PageScaffold>
  );
};

export default OriginLabPage;
