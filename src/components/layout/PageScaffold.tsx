import React, { RefObject, useRef } from "react";
import Footer from "../Footer";
import { createCodexProbeAttributes } from "../../devtools/codexContext/probe";

export interface PageScaffoldProps {
  children: (scrollRef: RefObject<HTMLDivElement>) => React.ReactNode;
  backgroundClassName?: string;
  footerBackgroundColor?: string;
  scrollSnap?: boolean;
  footerRunwayVh?: number;
}

const PageScaffold: React.FC<PageScaffoldProps> = ({
  children,
  backgroundClassName = "theme-page-bg",
  footerBackgroundColor,
  scrollSnap = false,
  footerRunwayVh = 72,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scaffoldProbe = createCodexProbeAttributes({
    componentName: "PageScaffold",
    filePath: "/src/components/layout/PageScaffold.tsx",
    componentPath: ["PageScaffold"],
    role: "scroll-container",
  });

  return (
    <>
      <div
        ref={scrollRef}
        {...scaffoldProbe}
        data-codex-scroll-container="page-scaffold"
        className={`theme-page-bg relative h-[100svh] w-screen overflow-y-auto overflow-x-hidden ${backgroundClassName} ${
          scrollSnap ? "snap-y snap-mandatory" : ""
        }`}
      >
        {children(scrollRef)}
        <div aria-hidden style={{ height: `${footerRunwayVh}vh`, pointerEvents: "none" }} />
      </div>
      <Footer
        scrollContainerRef={scrollRef as React.RefObject<HTMLElement>}
        backgroundColor={footerBackgroundColor}
        runwayVh={footerRunwayVh}
      />
    </>
  );
};

export default PageScaffold;
