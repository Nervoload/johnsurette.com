import React, { RefObject, useRef } from "react";
import { MotionValue, useScroll, useTransform, useMotionValueEvent, motionValue } from "framer-motion";
import StoryboardSection from "./StoryboardSection";

import IntroDeck from "./IntroDeck";
import IntroShuffle from "./IntroShuffle";
import SpreadReveal from "./SpreadReveal";
import ProjectDeck from "./ProjectDeck";
import ProjectCardInfo from "./ProjectCardInfo";
import * as THREE from "three";

export const sceneCount = 4;

interface IntroSequenceProps {
  shuffleProgress: MotionValue<number>;
  revealProgress: MotionValue<number>;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({
  shuffleProgress,
  revealProgress,
}) => {
  const deckRef = useRef<THREE.Group>(null);
  const cardRefs = useRef<THREE.Group[]>([]);
  const flipVals = useRef<MotionValue<number>[]>([]);

  const cardCount = 6;
  if (flipVals.current.length !== cardCount) {
    flipVals.current = Array.from({ length: cardCount }, () => motionValue(0));
  }

  return (
    <>
      <IntroDeck deckRef={deckRef} cardRefs={cardRefs} flipVals={flipVals.current} />
      <IntroShuffle
        progress={shuffleProgress}
        deckRef={deckRef}
        cardRefs={cardRefs}
        flipVals={flipVals.current}
      />
      <SpreadReveal
        progress={revealProgress}
        cardRefs={cardRefs}
        flipVals={flipVals.current}
      />
    </>
  );
};

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
  const segments = Array.from({ length: sceneCount }, (_, i) =>
    slice(scrollYProgress, i / sceneCount, (i + 1) / sceneCount)
  );
  const [s0, s1, s2, s3] = segments;
  const introSection = slice(scrollYProgress, 0, 0.5);

  // Optionally prevent scrolling into the next segment until the current one completes
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const el = scrollContainer.current;
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    for (let i = 0; i < segments.length; i++) {
      const start = i / sceneCount;
      const end = (i + 1) / sceneCount;
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
      <StoryboardSection progress={introSection} height={400}>
        {() => (
          <IntroSequence shuffleProgress={s0} revealProgress={s1} />
        )}
      </StoryboardSection>

      <StoryboardSection progress={s2}>{(p) => <ProjectDeck progress={p} />}</StoryboardSection>

      <StoryboardSection progress={s3}>{(p) => <ProjectCardInfo progress={p} />}</StoryboardSection>
    </>
  );
};

export default ProjectStoryboard;
