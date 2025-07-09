import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerspectiveCamera, Environment } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

interface StoryboardSectionProps {
  /** Scene progress provided by ProjectStoryboard */
  progress: MotionValue<number>;
  /** Height in viewport units (default 200) */
  height?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
}

const StoryboardSection: React.FC<StoryboardSectionProps> = ({
  progress,
  height = 200,
  children,
}) => {
  return (
    <section style={{ height: `${height}vh` }}>
      {/*
        Sticky wrapper stays fixed while this section's scroll progress
        is between 0 and 1. Once scrollYProgress reaches 1, the wrapper
        unpins and the next section scrolls in. The z-index ensures the
        current section overlays previous content while they scroll out.
      */}
      <div className="sticky top-0 h-screen z-10">
        <Canvas
          className="w-full h-full pointer-events-none"
          shadows
          gl={{ preserveDrawingBuffer: false }}
          onCreated={({ gl }) => {
            // Use the outputColorSpace property introduced in three.js r156
            (gl as any).outputColorSpace = THREE.SRGBColorSpace;
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
          <group scale={1.4}>{children(progress)}</group>
        </Canvas>
      </div>
    </section>
  );
};

export default StoryboardSection;
