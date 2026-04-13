import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import StoryboardSection from "./StoryboardSection";
import ProjectIntroSequence from "./ProjectIntroSequence";
import { ProjectItem } from "./projectData";
import { ResolvedThemeMode } from "../theme/themeMode";
import { createCodexProbeAttributes } from "../../devtools/codexContext/probe";
import { upsertRuntimeContextEntry, removeRuntimeContextEntry } from "../../devtools/codexContext/runtimeRegistry";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getProjectStoryboardPhaseLabel } from "./storyboardPhase";
import { getProjectLatePhaseTiming, getProjectRawLatePhaseBoundaries, getProjectStoryboardHeight } from "./storyboardTiming";

export interface ProjectStoryboardProps {
  scrollContainer: RefObject<HTMLDivElement>;
  items: ProjectItem[];
  onCardSelect?: (item: ProjectItem, screenPos: { x: number; y: number }) => void;
  onActiveProjectChange?: (item: ProjectItem | null) => void;
  forceLowPower?: boolean;
  themeMode: ResolvedThemeMode;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Remap raw scroll 0–1 into animation-timeline 0–1.
 *
 * Scroll region →  Animation phase
 * 0.00–0.12     →  0.00–0.12   Shuffle build-up
 * 0.12–0.30     →  0.12–0.42   Shuffle + early spread
 * 0.30–0.44     →  0.42–dealStart   Orbit + exit
 * 0.44–X        →  dealStart–dealEnd   Deal into column
 * X–Y           →  dealEnd–flipEnd   Flip reveal into stack
 * Y–Z           →  flipEnd–browseStart   Stacked preview settle
 * Z–1.00        →  browseStart–1.00   Browse through cards
 */
const remapProgress = (raw: number, count: number, compactViewport: boolean): number => {
  const p = clamp01(raw);
  const timeline = getProjectLatePhaseTiming(count, compactViewport);
  const rawPhase = getProjectRawLatePhaseBoundaries(count, compactViewport);
  const browseDenominator = Math.max(0.08, 1 - rawPhase.stackPreviewEnd);

  if (p <= 0.12) return p;
  if (p <= 0.3) return 0.12 + ((p - 0.12) / 0.18) * 0.3;
  if (p <= rawPhase.dealStart) {
    return 0.42 + ((p - 0.3) / (rawPhase.dealStart - 0.3)) * (timeline.dealStart - 0.42);
  }
  if (p <= rawPhase.dealEnd) {
    return (
      timeline.dealStart +
      ((p - rawPhase.dealStart) / (rawPhase.dealEnd - rawPhase.dealStart)) *
        (timeline.dealEnd - timeline.dealStart)
    );
  }
  if (p <= rawPhase.flipEnd) {
    return (
      timeline.dealEnd +
      ((p - rawPhase.dealEnd) / (rawPhase.flipEnd - rawPhase.dealEnd)) *
        (timeline.flipEnd - timeline.dealEnd)
    );
  }
  if (p <= rawPhase.stackPreviewEnd) {
    return (
      timeline.flipEnd +
      ((p - rawPhase.flipEnd) / (rawPhase.stackPreviewEnd - rawPhase.flipEnd)) *
        (timeline.browseStart - timeline.flipEnd)
    );
  }
  return (
    timeline.browseStart +
    ((p - rawPhase.stackPreviewEnd) / browseDenominator) * (1 - timeline.browseStart)
  );
};

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({
  scrollContainer,
  items,
  onCardSelect,
  onActiveProjectChange,
  forceLowPower = false,
  themeMode,
}) => {
  const storyboardProbe = createCodexProbeAttributes({
    componentName: "ProjectStoryboard",
    filePath: "/src/components/Projects/ProjectStoryboard.tsx",
    componentPath: ["ProjectsPage", "ProjectStoryboard"],
    role: "storyboard",
  });

  const sceneRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef(0);
  const snapFramesRef = useRef(0);
  const compactViewport = useMediaQuery("(max-width: 900px)");
  const storyboardHeight = getProjectStoryboardHeight(items.length, compactViewport);
  const runtimeContextId = "projects:storyboard-scroll";

  const timelineProgress = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: sceneRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    rawRef.current = value;
    if (!import.meta.env.DEV) return;

    const raw = clamp01(value);
    const mapped = remapProgress(raw, items.length, compactViewport);
    const container = scrollContainer.current;
    const maxScrollTop = Math.max(0, (container?.scrollHeight ?? 0) - (container?.clientHeight ?? 0));

    upsertRuntimeContextEntry({
      pagePath: "/projects",
      id: runtimeContextId,
      componentName: "ProjectStoryboard",
      componentPath: ["ProjectsPage", "ProjectStoryboard"],
      filePath: "/src/components/Projects/ProjectStoryboard.tsx",
      role: "storyboard-scroll",
      metadata: {
        rawScrollProgress: Number(raw.toFixed(4)),
        timelineProgress: Number(mapped.toFixed(4)),
        phase: getProjectStoryboardPhaseLabel(mapped),
        storyboardHeightVh: storyboardHeight,
        itemCount: items.length,
        forceLowPower,
        scrollTop: Math.round(container?.scrollTop ?? 0),
        maxScrollTop: Math.round(maxScrollTop),
        containerScrollProgress: maxScrollTop > 0 ? Number(clamp01((container?.scrollTop ?? 0) / maxScrollTop).toFixed(4)) : 0,
      },
    });
  });

  const syncTimelineToScroll = useCallback(() => {
    const raw = clamp01(scrollYProgress.get());
    rawRef.current = raw;
    timelineProgress.set(remapProgress(raw, items.length, compactViewport));
    // Skip smoothing briefly so timeline instantly matches new viewport geometry.
    snapFramesRef.current = 3;
  }, [compactViewport, items.length, scrollYProgress, timelineProgress]);

  useEffect(() => {
    syncTimelineToScroll();
  }, [syncTimelineToScroll]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const raw = clamp01(scrollYProgress.get());
    const mapped = remapProgress(raw, items.length, compactViewport);
    const container = scrollContainer.current;
    const maxScrollTop = Math.max(0, (container?.scrollHeight ?? 0) - (container?.clientHeight ?? 0));

    upsertRuntimeContextEntry({
      pagePath: "/projects",
      id: runtimeContextId,
      componentName: "ProjectStoryboard",
      componentPath: ["ProjectsPage", "ProjectStoryboard"],
      filePath: "/src/components/Projects/ProjectStoryboard.tsx",
      role: "storyboard-scroll",
      metadata: {
        rawScrollProgress: Number(raw.toFixed(4)),
        timelineProgress: Number(mapped.toFixed(4)),
        phase: getProjectStoryboardPhaseLabel(mapped),
        storyboardHeightVh: storyboardHeight,
        itemCount: items.length,
        forceLowPower,
        scrollTop: Math.round(container?.scrollTop ?? 0),
        maxScrollTop: Math.round(maxScrollTop),
        containerScrollProgress: maxScrollTop > 0 ? Number(clamp01((container?.scrollTop ?? 0) / maxScrollTop).toFixed(4)) : 0,
      },
    });

    return () => {
      removeRuntimeContextEntry("/projects", runtimeContextId);
    };
  }, [compactViewport, forceLowPower, items.length, runtimeContextId, scrollContainer, scrollYProgress, storyboardHeight]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResizeSync = () => {
      syncTimelineToScroll();
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            handleResizeSync();
          })
        : null;

    const sceneEl = sceneRef.current;
    const scrollEl = scrollContainer.current;
    if (resizeObserver) {
      if (sceneEl) resizeObserver.observe(sceneEl);
      if (scrollEl) resizeObserver.observe(scrollEl);
    }

    window.addEventListener("resize", handleResizeSync);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", handleResizeSync);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResizeSync);
      visualViewport?.removeEventListener("resize", handleResizeSync);
    };
  }, [scrollContainer, syncTimelineToScroll]);

  useAnimationFrame((_, delta) => {
    const mappedTarget = remapProgress(rawRef.current, items.length, compactViewport);
    const current = timelineProgress.get();

    if (snapFramesRef.current > 0) {
      timelineProgress.set(mappedTarget);
      snapFramesRef.current -= 1;
      return;
    }

    // Keep progression deliberately slower through deal/flip so cards don't snap through.
    const introZone = mappedTarget < 0.68;
    const dealFlipZone = mappedTarget < 0.96;
    const maxStep = (introZone ? (compactViewport ? 0.00042 : 0.0003) : dealFlipZone ? (compactViewport ? 0.00058 : 0.00044) : 0.00078) * delta;
    const diff = mappedTarget - current;

    const step = Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
    const next = clamp01(current + step);

    timelineProgress.set(next);
  });

  return (
    <div ref={sceneRef} {...storyboardProbe}>
      <StoryboardSection
        progress={timelineProgress}
        height={storyboardHeight}
        forceLowPower={forceLowPower}
        scrollContainer={scrollContainer}
        themeMode={themeMode}
      >
        {(progress, context) => (
          <ProjectIntroSequence
            progress={progress}
            items={items}
            onCardSelect={onCardSelect}
            onActiveProjectChange={onActiveProjectChange}
            lowPowerMode={context.lowPowerMode}
            mobileViewport={context.mobileViewport}
            sceneActive={context.sceneActive}
            themeMode={themeMode}
          />
        )}
      </StoryboardSection>
    </div>
  );
};

export default ProjectStoryboard;
