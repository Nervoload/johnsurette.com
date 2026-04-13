import React, { Suspense, lazy } from "react";
import { LandingAspirationSectionContent } from "../../../content";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { ResolvedThemeMode } from "../../theme/themeMode";
import { StorySectionData } from "../storySections";

const AspirationTreePlaceholder = lazy(() => import("../visuals/AspirationTreePlaceholder"));

interface AspirationJourneySectionProps {
  section: StorySectionData;
  content: LandingAspirationSectionContent;
  themeMode: ResolvedThemeMode;
}

const AspirationJourneySection: React.FC<AspirationJourneySectionProps> = ({ section, content, themeMode }) => {
  const compactViewport = useMediaQuery("(max-width: 900px)");

  return (
    <div className="relative isolate">
      <section className="relative px-0 py-0">
        <Suspense
          fallback={
            <div
              className="theme-story-contrast-label relative overflow-hidden"
              style={{ height: compactViewport ? "718dvh" : "906dvh" }}
            >
              <div className="theme-story-contrast-backdrop absolute inset-0" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,0.16),transparent_18%),radial-gradient(circle_at_50%_56%,rgba(168,85,247,0.12),transparent_26%)]" />
            </div>
          }
        >
          <AspirationTreePlaceholder
            nodes={content.nodes}
            edges={content.edges}
            overlayBeats={content.overlayBeats}
            themeMode={themeMode}
          />
        </Suspense>
      </section>

      <section className="relative flex min-h-[100dvh] items-center justify-center px-6 py-20 xs:px-8 sm:px-10 lg:px-16">
        <div className="relative mx-auto flex w-full max-w-5xl justify-center text-center">
          <div className="max-w-4xl">
            <h2 className="theme-story-contrast-title text-balance text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.92]">
              {content.footerTitle}
            </h2>
            <p className="theme-story-contrast-body mx-auto mt-6 max-w-2xl text-[clamp(1.08rem,1.9vw,1.34rem)] leading-relaxed">
              {content.footerBody}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AspirationJourneySection;
