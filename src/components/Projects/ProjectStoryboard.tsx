import React, { RefObject, useRef } from "react";
import { MotionValue, useTransform, motionValue } from "framer-motion";
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
const IntroWrapper: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const shuffleProgress = useTransform(progress, [0, 0.5], [0, 1], { clamp: true });
  const revealProgress = useTransform(progress, [0.5, 1], [0, 1], { clamp: true });
  return <IntroSequence shuffleProgress={shuffleProgress} revealProgress={revealProgress} />;
};

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({ scrollContainer }) => (
  <>
    <StoryboardSection container={scrollContainer}>
      {(p) => <IntroWrapper progress={p} />}
    </StoryboardSection>

    <StoryboardSection container={scrollContainer}>
      {(p) => <ProjectDeck progress={p} />}
    </StoryboardSection>

    <StoryboardSection container={scrollContainer}>
      {(p) => <ProjectCardInfo progress={p} />}
    </StoryboardSection>
  </>
);

export default ProjectStoryboard;
