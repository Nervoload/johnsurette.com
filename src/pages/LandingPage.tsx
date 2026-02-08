import React from "react";
import CenterpieceStage from "../components/LandingComponents/CenterpieceStage";
import DepthRainBackdrop from "../components/LandingComponents/DepthRainBackdrop";
import {
  centerpieceRegistry,
  defaultCenterpieceId,
} from "../components/LandingComponents/centerpieces/centerpieceRegistry";
import { sections } from "../components/sections";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import PageScaffold from "../components/layout/PageScaffold";

export interface LandingPageProps {
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const ActiveCenterpiece = centerpieceRegistry[defaultCenterpieceId].component;

  return (
    <PageScaffold
      backgroundClassName="bg-[radial-gradient(circle_at_20%_0%,rgba(186,230,253,0.55),rgba(224,231,255,0.42)_34%,rgba(248,250,252,1)_78%)]"
      footerBackgroundColor="#ffffff"
    >
      {() => (
        <>
          <section className="relative flex min-h-screen items-center justify-center">
            <DepthRainBackdrop />
            <div className="relative z-10 px-4 sm:px-6">
              <CenterpieceStage activeSection={null} centerpiece={ActiveCenterpiece} />
            </div>
          </section>

          <section className="relative z-10 mx-auto grid min-h-[140vh] w-full max-w-6xl gap-5 px-6 pb-20 pt-14 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Landing Storyboard Foundation</p>
              <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-slate-900 sm:text-5xl">
                Scroll-driven narrative stage for your intro, links, and depth scenes.
              </h1>
            </div>

            {sections.map((section) => (
              <article key={section.path} className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
                <h2 className="text-xl font-semibold" style={{ color: section.color }}>
                  {section.name}
                </h2>
                <p className="mt-3 text-slate-600">{section.description}</p>
                <button
                  type="button"
                  className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  onClick={() =>
                    onNavigate(section.path, {
                      direction: "right",
                      color: section.color,
                      duration: 430,
                    })
                  }
                >
                  Open Section
                </button>
              </article>
            ))}
          </section>
        </>
      )}
    </PageScaffold>
  );
};

export default LandingPage;
