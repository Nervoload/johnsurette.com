// src/components/Projects/ProjectStoryboard.tsx
import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerspectiveCamera, Environment } from "@react-three/drei";
import { useScroll, useTransform, MotionValue } from "framer-motion";

import IntroDeck from "./IntroDeck";
import SpreadReveal from "./SpreadReveal";
import ProjectDeck from "./ProjectDeck";
import ProjectCardInfo from "./ProjectCardInfo";

interface ProjectStoryboardProps {
  scrollContainer: React.RefObject<HTMLElement>;
  sectionBreaks?: [number, number, number, number];
  autoScrollDelay?: number;
}

const slice = (mv: MotionValue<number>, range: [number, number]) =>
  useTransform(mv, range, [0, 1], { clamp: true });

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({
  scrollContainer,
  sectionBreaks = [0.15, 0.30, 0.60, 1.0],
  autoScrollDelay = 500,
}) => {
  // Listen to the wrapper’s actual scroll
  const { scrollYProgress } = useScroll({
    target: scrollContainer,
    offset: ["start start", "end end"],
  });

  // Break the scroll into four scene progresses
  const s0 = slice(scrollYProgress, [0, sectionBreaks[0]]);
  const s1 = slice(scrollYProgress, [sectionBreaks[0], sectionBreaks[1]]);
  const s2 = slice(scrollYProgress, [sectionBreaks[1], sectionBreaks[2]]);
  const s3 = slice(scrollYProgress, [sectionBreaks[2], sectionBreaks[3]]);

  // Optional intro auto-scroll
  useEffect(() => {
    const el = scrollContainer.current;
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    if (total < 1) return;

    const start = el.scrollTop;
    const goal = total * sectionBreaks[0];
    const dur = 2000;
    const ease = (t: number) =>
      t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const t0 = performance.now();

    const step = (now: number) => {
      const u = Math.min((now - t0) / dur, 1);
      el.scrollTop = start + (goal - start) * ease(u);
      if (u < 1) requestAnimationFrame(step);
    };

    const id = window.setTimeout(() => requestAnimationFrame(step), autoScrollDelay);
    return () => window.clearTimeout(id);
  }, [scrollContainer, sectionBreaks, autoScrollDelay]);

  return (
    <Canvas className="fixed inset-0 z-10 pointer-events-none" shadows>
      {/* Full-viewport Canvas */}
      <AdaptiveDpr pixelated />
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />

      {/* Lighting & HDRI */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[1, 2, 3]} intensity={1} castShadow />
      <directionalLight position={[-3, -1, -2]} intensity={0.45} />
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>

      {/* No manual Y-offset; group is centered at [0,0,0] */}
      <group scale={1.4}>
        <IntroDeck progress={s0} />
        <SpreadReveal progress={s1} />
        <ProjectDeck progress={s2} />
        <ProjectCardInfo progress={s3} />
      </group>
    </Canvas>
  );
};

export default ProjectStoryboard;
