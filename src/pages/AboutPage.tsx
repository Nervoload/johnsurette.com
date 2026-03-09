import React from "react";
import { aboutPageContent, pageVisuals } from "../content";
import PopBookTimeline from "../components/About/PopBookTimeline";
import PageScaffold from "../components/layout/PageScaffold";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../components/theme/themeMode";

export interface AboutPageProps {
  onNavigate?: (path: string, opts?: WipeOptions) => void;
  themeMode: ResolvedThemeMode;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, themeMode }) => {
  return (
    <PageScaffold
      backgroundClassName={pageVisuals.about.backgroundClassName}
      footerBackgroundColor={pageVisuals.about.footerBackgroundColor}
    >
      {(scrollRef) => (
        <>
          <section className="relative snap-start pt-24">
            <div className="theme-text-primary mx-auto w-full max-w-6xl px-6 pb-12">
              <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{aboutPageContent.eyebrow}</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight xs:text-4xl sm:text-6xl">{aboutPageContent.title}</h1>
              <p className="theme-text-muted mt-5 max-w-2xl text-[15px] leading-relaxed">{aboutPageContent.summary}</p>
              <div className="theme-border-subtle theme-text-subtle mt-10 grid gap-6 border-t pt-8 text-xs uppercase tracking-[0.15em] sm:grid-cols-3">
                {aboutPageContent.highlights.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </section>

          <PopBookTimeline scrollContainer={scrollRef} onNavigate={onNavigate} themeMode={themeMode} />
        </>
      )}
    </PageScaffold>
  );
};

export default AboutPage;
