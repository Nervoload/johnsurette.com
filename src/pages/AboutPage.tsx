import React, { useRef } from "react";
import Footer from "../components/Footer";
import AboutExperience from "../components/AboutStory/AboutExperience";
import { pageVisuals } from "../content";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../components/theme/themeMode";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";

export interface AboutPageProps {
  onNavigate?: (path: string, opts?: WipeOptions) => void;
  themeMode: ResolvedThemeMode;
}

const AboutPage: React.FC<AboutPageProps> = () => {
  const aboutPageProbe = createCodexProbeAttributes({
    componentName: "AboutPage",
    filePath: "/src/pages/AboutPage.tsx",
    componentPath: ["AboutPage"],
    role: "page",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const footerRunwayVh = pageVisuals.about.footerRunwayVh ?? 112;

  return (
    <>
      <div
        ref={scrollRef}
        {...aboutPageProbe}
        data-codex-scroll-container="about-page"
        className={`theme-page-bg relative h-[100svh] w-screen overflow-y-auto overflow-x-hidden ${pageVisuals.about.backgroundClassName ?? ""}`}
      >
        <AboutExperience scrollContainerRef={scrollRef} />
        <div aria-hidden style={{ height: `${footerRunwayVh}vh`, pointerEvents: "none" }} />
      </div>

      <Footer
        scrollContainerRef={scrollRef as React.RefObject<HTMLElement>}
        backgroundColor={pageVisuals.about.footerBackgroundColor}
        runwayVh={footerRunwayVh}
      />
    </>
  );
};

export default AboutPage;
