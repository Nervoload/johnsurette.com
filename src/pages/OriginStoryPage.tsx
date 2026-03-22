import React, { useCallback, useEffect, useRef } from "react";
import OriginStoryExperience from "../components/OriginStory/OriginStoryExperience";
import { useEdgeScrollHandoff } from "../components/OriginStory/useEdgeScrollHandoff";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";

interface OriginStoryPageProps {
  onExitToLandingHero: () => void;
  onExitToLandingConclusion: () => void;
}

const OriginStoryPage: React.FC<OriginStoryPageProps> = ({
  onExitToLandingHero,
  onExitToLandingConclusion,
}) => {
  const originPageProbe = createCodexProbeAttributes({
    componentName: "OriginStoryPage",
    filePath: "/src/pages/OriginStoryPage.tsx",
    componentPath: ["OriginStoryPage"],
    role: "page",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const maxScrollRef = useRef(0);
  const exitLockRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const runExit = useCallback((action: () => void): void => {
    if (exitLockRef.current) return;
    exitLockRef.current = true;
    action();

    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
    }
    exitTimerRef.current = window.setTimeout(() => {
      exitLockRef.current = false;
      exitTimerRef.current = null;
    }, 900);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    maxScrollRef.current = 0;

    const handleScroll = (): void => {
      maxScrollRef.current = Math.max(maxScrollRef.current, container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const handleTopExit = useCallback(() => {
    const container = scrollRef.current;
    const explorationThreshold = container ? container.clientHeight * 1.4 : 1200;

    if (maxScrollRef.current >= explorationThreshold) {
      runExit(onExitToLandingConclusion);
      return;
    }

    runExit(onExitToLandingHero);
  }, [onExitToLandingConclusion, onExitToLandingHero, runExit]);

  useEdgeScrollHandoff({
    scrollContainerRef: scrollRef,
    onTopExit: handleTopExit,
    onBottomExit: () => runExit(onExitToLandingConclusion),
  });

  return (
    <div
      ref={scrollRef}
      {...originPageProbe}
      data-codex-scroll-container="origin-story"
      className="relative h-[100dvh] w-screen overflow-y-auto overflow-x-hidden bg-[#020617] text-slate-100"
    >
      <OriginStoryExperience
        scrollContainerRef={scrollRef}
        onRequestExitHero={() => runExit(onExitToLandingHero)}
        onRequestExitConclusion={() => runExit(onExitToLandingConclusion)}
      />
    </div>
  );
};

export default OriginStoryPage;
