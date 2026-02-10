import React, { RefObject, useRef } from "react";
import { useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import StoryboardSection from "./StoryboardSection";
import ProjectIntroSequence from "./ProjectIntroSequence";

export interface ProjectStoryboardProps {
  scrollContainer: RefObject<HTMLDivElement>;
  onStackActivationChange?: (active: boolean) => void;
  forceLowPower?: boolean;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const remapProgress = (raw: number): number => {
  const p = clamp01(raw);

  if (p <= 0.22) {
    return (p / 0.22) * 0.12;
  }

  if (p <= 0.58) {
    const local = (p - 0.22) / 0.36;
    return 0.12 + local * (0.38 - 0.12);
  }

  if (p <= 0.86) {
    const local = (p - 0.58) / 0.28;
    return 0.38 + local * (0.64 - 0.38);
  }

  const local = (p - 0.86) / 0.14;
  return 0.64 + local * (1 - 0.64);
};

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({
  scrollContainer,
  onStackActivationChange,
  forceLowPower = false,
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef(0);
  const stackActiveRef = useRef(false);

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

  useAnimationFrame((_, delta) => {
    const mappedTarget = remapProgress(rawRef.current);
    const current = timelineProgress.get();

    const introZone = mappedTarget < 0.9;
    const maxStep = (introZone ? 0.00034 : 0.00092) * delta;
    const diff = mappedTarget - current;

    const step = Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
    const next = clamp01(current + step);

    timelineProgress.set(next);
    const nextStackActive = stackActiveRef.current ? next > 0.84 : next > 0.92;
    if (nextStackActive !== stackActiveRef.current) {
      stackActiveRef.current = nextStackActive;
      onStackActivationChange?.(nextStackActive);
    }
  });

  return (
    <div ref={sceneRef}>
      <StoryboardSection progress={timelineProgress} height={230} forceLowPower={forceLowPower}>
        {(progress) => <ProjectIntroSequence progress={progress} />}
      </StoryboardSection>
    </div>
  );
};

export default ProjectStoryboard;
