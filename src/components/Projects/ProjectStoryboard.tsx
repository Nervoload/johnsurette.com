import React, { RefObject } from "react";
import { MotionValue, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import StoryboardSection from "./StoryboardSection";

import IntroShuffle from "./IntroShuffle";
import SpreadReveal from "./SpreadReveal";
import ProjectDeck from "./ProjectDeck";
import ProjectCardInfo from "./ProjectCardInfo";

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */
export interface ProjectStoryboardProps {
  /** The scrollable element that <StoryboardSection> will observe */
  scrollContainer: RefObject<HTMLElement>;
}

/* ──────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────── */
const slice = (
  mv: MotionValue<number>,
  start: number,
  end: number
) => useTransform(mv, [start, end], [0, 1]);

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({ scrollContainer }) => {
  // Track the scroll progress of the entire storyboard container
  const { scrollYProgress } = useScroll({ container: scrollContainer, layoutEffect: false });

  // Break global progress into equal segments for each scene
  const s0 = slice(scrollYProgress, 0.0, 0.25);
  const s1 = slice(scrollYProgress, 0.25, 0.5);
  const s2 = slice(scrollYProgress, 0.5, 0.75);
  const s3 = slice(scrollYProgress, 0.75, 1.0);
  const segments = [s0, s1, s2, s3];

  // Optionally prevent scrolling into the next segment until the current one completes
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const el = scrollContainer.current;
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    for (let i = 0; i < segments.length; i++) {
      const start = i * 0.25;
      const end = (i + 1) * 0.25;
      const local = segments[i].get();
      if (v > end && local < 1) {
        el.scrollTop = end * total;
        return;
      } else if (v < start && local > 0) {
        el.scrollTop = start * total;
        return;
      }
    }
  });

  return (
    <>
      <StoryboardSection progress={s0}>{(p) => <IntroShuffle progress={p} />}</StoryboardSection>

      <StoryboardSection progress={s1}>{(p) => <SpreadReveal progress={p} />}</StoryboardSection>

      <StoryboardSection progress={s2}>{(p) => <ProjectDeck progress={p} />}</StoryboardSection>

      <StoryboardSection progress={s3}>{(p) => <ProjectCardInfo progress={p} />}</StoryboardSection>
    </>
  );
};

export default ProjectStoryboard;
