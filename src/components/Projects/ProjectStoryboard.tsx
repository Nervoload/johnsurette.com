// src/components/Projects/ProjectStoryboard.tsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { AdaptiveDpr, PerspectiveCamera, Environment } from "@react-three/drei";
import { useScroll, useTransform, MotionValue } from "framer-motion";

import IntroShuffle from "./IntroShuffle";
import SpreadReveal from "./SpreadReveal";
import ProjectDeck from "./ProjectDeck";
import ProjectCardInfo from "./ProjectCardInfo";

interface ProjectStoryboardProps {
  scrollContainer: React.RefObject<HTMLElement>;
  sections: React.RefObject<HTMLElement>[];
}

const slice = (mv: MotionValue<number>, range: [number, number]) =>
  useTransform(mv, range, [0, 1], { clamp: true });

const ProjectStoryboard: React.FC<ProjectStoryboardProps> = ({
  scrollContainer,
  sections,
}) => {
  const { scrollYProgress: s0 } = useScroll({
    container: scrollContainer,
    target: sections[0],
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const { scrollYProgress: s1 } = useScroll({
    container: scrollContainer,
    target: sections[1],
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const { scrollYProgress: s2 } = useScroll({
    container: scrollContainer,
    target: sections[2],
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const { scrollYProgress: s3 } = useScroll({
    container: scrollContainer,
    target: sections[3],
    offset: ["start end", "end start"],
    layoutEffect: false,
  });


  return (
    <>
    <Canvas
      className="fixed inset-0 z-10 pointer-events-none"
      shadows
      gl={{ preserveDrawingBuffer: false }}
      onCreated={({ gl }) => {
        gl.colorSpace = THREE.SRGBColorSpace;
        THREE.ColorManagement.enabled = true;
      }}
    >
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
        <IntroShuffle progress={s0} />
        <SpreadReveal progress={s1} cards={undefined} />
        <ProjectDeck progress={s2} />
        <ProjectCardInfo progress={s3} />
      </group>
    </Canvas>
    </>
  );
};

export default ProjectStoryboard;
