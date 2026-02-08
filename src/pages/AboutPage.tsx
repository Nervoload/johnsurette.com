import React from "react";
import PopBookTimeline from "../components/About/PopBookTimeline";
import PageScaffold from "../components/layout/PageScaffold";

const AboutPage: React.FC = () => {
  return (
    <PageScaffold backgroundClassName="bg-slate-50" footerBackgroundColor="#ffffff" scrollSnap>
      {(scrollRef) => (
        <>
          <section className="relative z-10 mx-auto w-full max-w-6xl snap-start px-6 pb-10 pt-24 text-slate-900">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">About</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-medium sm:text-5xl">Layered Pop-up Timeline</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Scroll checkpoints move through staged moments. Each scene transitions with layered depth rather than overlapping all scenes at once.
            </p>
          </section>

          <PopBookTimeline scrollContainer={scrollRef} />
        </>
      )}
    </PageScaffold>
  );
};

export default AboutPage;
