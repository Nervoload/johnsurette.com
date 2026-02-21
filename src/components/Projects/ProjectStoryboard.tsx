import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import StoryboardSection from "./StoryboardSection";
import ProjectIntroSequence from "./ProjectIntroSequence";
import { ProjectItem } from "./projectData";

export interface ProjectStoryboardProps {
  scrollContainer: RefObject<HTMLDivElement>;
  items: ProjectItem[];
  onCardSelect?: (item: ProjectItem, screenPos: { x: number; y: number }) => void;
  forceLowPower?: boolean;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

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
const remapProgress = (raw: number): number => {
  const p = clamp01(raw);

  if (p <= 0.12) return p;
  if (p <= 0.3) return 0.12 + ((p - 0.12) / 0.18) * 0.3;
  if (p <= 0.46) return 0.42 + ((p - 0.3) / 0.16) * 0.26;
  if (p <= 0.62) return 0.68 + ((p - 0.46) / 0.16) * 0.16;
  if (p <= 0.76) return 0.84 + ((p - 0.62) / 0.14) * 0.12;
  return 0.96 + ((p - 0.76) / 0.24) * 0.04;
};

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({
  scrollContainer,
  items,
  onCardSelect,
  forceLowPower = false,
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef(0);
  const snapFramesRef = useRef(0);

  const timelineProgress = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: sceneRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    rawRef.current = value;
  });

  const syncTimelineToScroll = useCallback(() => {
    const raw = clamp01(scrollYProgress.get());
    rawRef.current = raw;
    timelineProgress.set(remapProgress(raw));
    // Skip smoothing briefly so timeline instantly matches new viewport geometry.
    snapFramesRef.current = 3;
  }, [scrollYProgress, timelineProgress]);

  useEffect(() => {
    syncTimelineToScroll();
  }, [syncTimelineToScroll]);

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
    const mappedTarget = remapProgress(rawRef.current);
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
    <div ref={sceneRef}>
      <StoryboardSection progress={timelineProgress} height={560} forceLowPower={forceLowPower}>
        {(progress, context) => (
          <ProjectIntroSequence
            progress={progress}
            items={items}
            onCardSelect={onCardSelect}
            lowPowerMode={context.lowPowerMode}
            mobileViewport={context.mobileViewport}
          />
        )}
      </StoryboardSection>
    </div>
  );
};

export default ProjectStoryboard;
