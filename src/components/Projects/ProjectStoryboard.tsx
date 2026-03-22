import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import StoryboardSection from "./StoryboardSection";
import ProjectIntroSequence from "./ProjectIntroSequence";
import { ProjectItem } from "./projectData";
import { ResolvedThemeMode } from "../theme/themeMode";
import { createCodexProbeAttributes } from "../../devtools/codexContext/probe";
import { upsertRuntimeContextEntry, removeRuntimeContextEntry } from "../../devtools/codexContext/runtimeRegistry";
import { getProjectStoryboardPhaseLabel } from "./storyboardPhase";

export interface ProjectStoryboardProps {
  scrollContainer: RefObject<HTMLDivElement>;
  items: ProjectItem[];
  onCardSelect?: (item: ProjectItem, screenPos: { x: number; y: number }) => void;
  forceLowPower?: boolean;
  themeMode: ResolvedThemeMode;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const getStoryboardHeight = (count: number) => {
  const extraCards = Math.max(0, count - 4);
  return 560 + extraCards * 110;
};

/**
 * Remap raw scroll 0–1 into animation-timeline 0–1.
 *
 * Scroll region →  Animation phase
 * 0.00–0.12     →  0.00–0.12   Shuffle build-up
 * 0.12–0.30     →  0.12–0.42   Shuffle + early spread
 * 0.30–0.46     →  0.42–0.68   Orbit + exit
 * 0.46–0.62     →  0.68–0.84   Deal into column (slower)
 * 0.62–0.76     →  0.84–0.96   Flip reveal (slower)
 * 0.76–1.00     →  0.96–1.00   Browse through cards
 */
const remapProgress = (raw: number, count: number): number => {
  const p = clamp01(raw);
  const extraCards = Math.max(0, count - 4);
  const dealEnd = Math.min(0.67, 0.62 + extraCards * 0.03);
  const flipEnd = Math.min(0.84, 0.76 + extraCards * 0.04);
  const browseStart = Math.min(0.9, 0.76 + extraCards * 0.05);
  const browseDenominator = Math.max(0.08, 1 - browseStart);

  if (p <= 0.12) return p;
  if (p <= 0.3) return 0.12 + ((p - 0.12) / 0.18) * 0.3;
  if (p <= 0.46) return 0.42 + ((p - 0.3) / 0.16) * 0.26;
  if (p <= dealEnd) return 0.68 + ((p - 0.46) / (dealEnd - 0.46)) * 0.16;
  if (p <= flipEnd) return 0.84 + ((p - dealEnd) / (flipEnd - dealEnd)) * 0.12;
  if (p <= browseStart) return 0.96;
  return 0.96 + ((p - browseStart) / browseDenominator) * 0.04;
};

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({
  scrollContainer,
  items,
  onCardSelect,
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
  const storyboardHeight = getStoryboardHeight(items.length);
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
    const mapped = remapProgress(raw, items.length);
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
    timelineProgress.set(remapProgress(raw, items.length));
    // Skip smoothing briefly so timeline instantly matches new viewport geometry.
    snapFramesRef.current = 3;
  }, [items.length, scrollYProgress, timelineProgress]);

  useEffect(() => {
    syncTimelineToScroll();
  }, [syncTimelineToScroll]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const raw = clamp01(scrollYProgress.get());
    const mapped = remapProgress(raw, items.length);
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
  }, [forceLowPower, items.length, runtimeContextId, scrollContainer, scrollYProgress, storyboardHeight]);

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
    const mappedTarget = remapProgress(rawRef.current, items.length);
    const current = timelineProgress.get();

    if (snapFramesRef.current > 0) {
      timelineProgress.set(mappedTarget);
      snapFramesRef.current -= 1;
      return;
    }

    // Keep progression deliberately slower through deal/flip so cards don't snap through.
    const introZone = mappedTarget < 0.68;
    const dealFlipZone = mappedTarget < 0.96;
    const maxStep = (introZone ? 0.00034 : dealFlipZone ? 0.0005 : 0.0009) * delta;
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
        themeMode={themeMode}
      >
        {(progress, context) => (
          <ProjectIntroSequence
            progress={progress}
            items={items}
            onCardSelect={onCardSelect}
            lowPowerMode={context.lowPowerMode}
            mobileViewport={context.mobileViewport}
            themeMode={themeMode}
          />
        )}
      </StoryboardSection>
    </div>
  );
};

export default ProjectStoryboard;
