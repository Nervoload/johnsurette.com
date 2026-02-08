import React from "react";
import PopBookTimeline from "../components/About/PopBookTimeline";
import PageScaffold from "../components/layout/PageScaffold";

const AboutPage: React.FC = () => {
  return (
    <PageScaffold
      backgroundClassName="bg-[radial-gradient(circle_at_14%_8%,rgba(186,230,253,0.52),rgba(224,231,255,0.32)_36%,rgba(248,250,252,1)_72%)]"
      footerBackgroundColor="#ffffff"
      scrollSnap
    >
      {(scrollRef) => (
        <>
          <section className="relative snap-start pt-24">
            <div className="mx-auto w-full max-w-6xl px-6 pb-12 text-slate-900">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">About</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Narrative Timeline</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                Scroll through checkpoint years to move a layered timeline stage. Each moment keeps depth and motion without overwhelming the page.
              </p>
              <div className="mt-10 grid gap-6 border-t border-slate-300/60 pt-8 text-xs uppercase tracking-[0.15em] text-slate-500 sm:grid-cols-3">
                <p>Layered Stage</p>
                <p>Scroll Driven</p>
                <p>Pop-up Book Direction</p>
              </div>
            </div>
          </section>

          <PopBookTimeline scrollContainer={scrollRef} />
        </>
      )}
    </PageScaffold>
  );
};

export default AboutPage;
