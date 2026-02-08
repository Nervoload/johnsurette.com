import React, { RefObject, useRef } from "react";
import Footer from "../Footer";

export interface PageScaffoldProps {
  children: (scrollRef: RefObject<HTMLDivElement>) => React.ReactNode;
  backgroundClassName?: string;
  footerBackgroundColor?: string;
  scrollSnap?: boolean;
  footerRunwayVh?: number;
}

const PageScaffold: React.FC<PageScaffoldProps> = ({
  children,
  backgroundClassName = "bg-slate-50",
  footerBackgroundColor,
  scrollSnap = false,
  footerRunwayVh = 110,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={scrollRef}
        className={`relative h-screen w-screen overflow-y-auto overflow-x-hidden ${backgroundClassName} ${
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
