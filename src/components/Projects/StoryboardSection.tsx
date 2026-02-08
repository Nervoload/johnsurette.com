import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

interface StoryboardSectionProps {
  progress: MotionValue<number>;
  height?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
}

const StoryboardSection: React.FC<StoryboardSectionProps> = ({ progress, height = 200, children }) => {
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const viewportQuery = window.matchMedia("(max-width: 900px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setLowPowerMode(viewportQuery.matches || motionQuery.matches);
    };

    update();

    if (viewportQuery.addEventListener) {
      viewportQuery.addEventListener("change", update);
      motionQuery.addEventListener("change", update);
    } else {
      viewportQuery.addListener(update);
      motionQuery.addListener(update);
    }

    return () => {
      if (viewportQuery.removeEventListener) {
        viewportQuery.removeEventListener("change", update);
        motionQuery.removeEventListener("change", update);
      } else {
        viewportQuery.removeListener(update);
        motionQuery.removeListener(update);
      }
    };
  }, []);

  const renderHeight = lowPowerMode ? Math.max(190, Math.min(height, 220)) : height;
  const shadowMapSize = lowPowerMode ? 1024 : 2048;

  return (
    <section style={{ height: `${renderHeight}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-slate-50">
        {/* Seamless full-viewport depth backdrop (no finite plane edges). */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(191,219,254,0.52),transparent_46%),radial-gradient(circle_at_78%_20%,rgba(196,181,253,0.34),transparent_42%),linear-gradient(165deg,#ffffff,#f8fafc_58%,#eef2f7)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(148,163,184,0.15),transparent_58%)]" />

        <Canvas
          className="absolute inset-0 h-full w-full"
          dpr={lowPowerMode ? [1, 1.5] : [1, 2]}
          shadows={!lowPowerMode}
          gl={{
            preserveDrawingBuffer: false,
            antialias: !lowPowerMode,
            powerPreference: "high-performance",
            alpha: true,
          }}
          onCreated={({ gl }) => {
            (gl as unknown as { outputColorSpace: THREE.ColorSpace }).outputColorSpace = THREE.SRGBColorSpace;
            THREE.ColorManagement.enabled = true;
            gl.shadowMap.enabled = !lowPowerMode;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.setClearColor(0xffffff, 0);
          }}
        >
          <perspectiveCamera makeDefault position={[0, 0.14, 6.15]} fov={43} />
          <fog attach="fog" args={["#f8fafc", 8, 24]} />

          <ambientLight intensity={0.62} />
          <spotLight
            castShadow={!lowPowerMode}
            position={[0, 5.2, 2.6]}
            angle={0.56}
            penumbra={0.66}
            intensity={lowPowerMode ? 1.32 : 1.55}
            distance={26}
            shadow-mapSize-width={shadowMapSize}
            shadow-mapSize-height={shadowMapSize}
            shadow-bias={-0.00015}
          />
          <directionalLight
            castShadow={!lowPowerMode}
            position={[2.8, 2.6, 2.4]}
            intensity={0.38}
            shadow-bias={-0.00018}
          />
          <directionalLight position={[-3.2, 1.4, -2.8]} intensity={0.14} />

          {/* Large invisible receiver for soft grounding shadows only. */}
          <mesh rotation-x={-Math.PI / 2} position={[0, -1.26, 0]} receiveShadow>
            <planeGeometry args={[160, 160]} />
            <shadowMaterial transparent opacity={lowPowerMode ? 0.09 : 0.14} />
          </mesh>

          <group scale={1.14} position={[0, 0.02, 0]}>
            {children(progress)}
          </group>
        </Canvas>

        {/* Bottom blend to avoid hard section edge into following content. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-slate-50" />
      </div>
    </section>
  );
};

export default StoryboardSection;
