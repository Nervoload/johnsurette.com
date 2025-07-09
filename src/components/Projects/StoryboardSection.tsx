import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerspectiveCamera, Environment } from "@react-three/drei";
import { MotionValue, useScroll } from "framer-motion";
import * as THREE from "three";

interface StoryboardSectionProps {
  container: React.RefObject<HTMLElement>;
  children: (progress: MotionValue<number>) => React.ReactNode;
}

const StoryboardSection: React.FC<StoryboardSectionProps> = ({
  container,
  children,
}) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container,
    target: ref,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  return (
    <section ref={ref} className="h-[200vh]">
      <div className="sticky top-0 h-screen">
        <Canvas
          className="w-full h-full pointer-events-none"
          shadows
          gl={{ preserveDrawingBuffer: false }}
          onCreated={({ gl }) => {
            gl.colorSpace = THREE.SRGBColorSpace;
            THREE.ColorManagement.enabled = true;
          }}
        >
          <AdaptiveDpr pixelated />
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[1, 2, 3]} intensity={1} castShadow />
          <directionalLight position={[-3, -1, -2]} intensity={0.45} />
          <Suspense fallback={null}>
            <Environment preset="sunset" />
          </Suspense>
          <group scale={1.4}>{children(scrollYProgress)}</group>
        </Canvas>
      </div>
    </section>
  );
};

export default StoryboardSection;
