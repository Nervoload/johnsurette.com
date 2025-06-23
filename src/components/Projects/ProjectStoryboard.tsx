// src/components/Projects/ProjectStoryboard.tsx
import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { MotionValue, useScroll, useTransform } from "framer-motion";
import IntroDeck from "./IntroDeck";
import SpreadReveal from "./SpreadReveal";
import ProjectDeck from "./ProjectDeck";
import ProjectCardInfo from "./ProjectCardInfo";

/* ───────────────────────────── Helpers */
function slice(mv: MotionValue<number>, [a, b]: [number, number]) {
  // clamp = true so value sticks at 0 or 1 when outside range
  return useTransform(mv, [a, b], [0, 1], { clamp: true });
}

export interface ProjectStoryboardProps {
  /** scroll container ref (usually the page div).  If omitted, defaults to window. */
  scrollContainer?: React.RefObject<HTMLElement>;
  /** section cut-points (must end with 1.0) */
  sectionBreaks?: [number, number, number, number];
  /** easing curve used when auto-scrolling */
  easing?: (t: number) => number;
  /** ms to wait before auto-scroll kicks in */
  autoScrollDelay?: number;
}

/* ───────────────────────────── Component */
const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({
  scrollContainer,
  sectionBreaks = [0.15, 0.30, 0.60, 1.0],
  autoScrollDelay = 500,
}) => {
  /* global scroll */
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    offset: ["start start", "end end"],
  });

  /* create local motion values for each scene */
  const [s0, s1, s2, s3] = [
    slice(scrollYProgress, [0.0, sectionBreaks[0]]),
    slice(scrollYProgress, [sectionBreaks[0], sectionBreaks[1]]),
    slice(scrollYProgress, [sectionBreaks[1], sectionBreaks[2]]),
    slice(scrollYProgress, [sectionBreaks[2], sectionBreaks[3]]),
  ];

  /* Kick off intro animation by scrolling to first section */
  useEffect(() => {
    const el = scrollContainer?.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const target = el.scrollHeight * sectionBreaks[0];
      el.scrollTo({ top: target, behavior: "smooth" });
    }, autoScrollDelay);
    return () => clearTimeout(timer);
  }, [scrollContainer, sectionBreaks, autoScrollDelay]);

  /* ───────────────────────────── Render */
  return (
    <Canvas
      className="fixed inset-0 z-10 pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      {/* Scene 0 */}
      <IntroDeck progress={s0} />

      {/* Scene 1 */}
      <SpreadReveal progress={s1} />

      {/* Scene 2 */}
      <ProjectDeck progress={s2} />

      {/* Scene 3 */}
      <ProjectCardInfo progress={s3} />
    </Canvas>
  );
};

export default ProjectStoryboard;
