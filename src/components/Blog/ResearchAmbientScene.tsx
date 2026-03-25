import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { BlogPostEntry } from "../../content";

interface ResearchAmbientSceneProps {
  post: BlogPostEntry;
  reducedMotion?: boolean;
}

interface BlobSpec {
  position: [number, number, number];
  scale: number;
  color: string;
  emissive: string;
}

const blobSets: Record<string, BlobSpec[]> = {
  orbitalField: [
    { position: [-1.8, 0.85, -0.2], scale: 1.25, color: "#ffffff", emissive: "#ffffff" },
    { position: [1.7, -0.55, -0.8], scale: 1.55, color: "#9bdcf7", emissive: "#c4b5fd" },
    { position: [0.2, 1.65, -1.3], scale: 0.72, color: "#d8f3ff", emissive: "#ffffff" },
  ],
  signalGrid: [
    { position: [-1.35, 1.1, -0.4], scale: 0.98, color: "#7dd3fc", emissive: "#7dd3fc" },
    { position: [1.85, 0.08, -0.7], scale: 1.32, color: "#e879f9", emissive: "#f0abfc" },
    { position: [-0.22, -1.35, -1.2], scale: 1.08, color: "#bae6fd", emissive: "#c084fc" },
  ],
  neuralBloom: [
    { position: [-1.55, 0.32, -0.5], scale: 1.2, color: "#f8fafc", emissive: "#f8fafc" },
    { position: [1.15, 1.22, -1], scale: 0.94, color: "#fde68a", emissive: "#facc15" },
    { position: [0.78, -1.12, -0.6], scale: 1.42, color: "#a7f3d0", emissive: "#5eead4" },
  ],
};

const AmbientShapes: React.FC<ResearchAmbientSceneProps> = ({ post, reducedMotion = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sceneId = post.visualIdentity.sceneId ?? "orbitalField";
  const shapes = useMemo(
    () => blobSets[sceneId] ?? blobSets.orbitalField,
    [sceneId],
  );

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.12) * 0.1;
    groupRef.current.rotation.y = Math.cos(t * 0.1) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.75} />
      <pointLight position={[2.4, 2.1, 4.6]} intensity={3.2} color={post.visualIdentity.palette.highlight} />
      <pointLight position={[-2.8, -1.7, 3.8]} intensity={2.6} color={post.visualIdentity.palette.accent} />
      {shapes.map((shape, index) => (
        <Float
          key={`${sceneId}-${index}`}
          speed={reducedMotion ? 0 : 1.1 + index * 0.25}
          rotationIntensity={reducedMotion ? 0 : 0.38}
          floatIntensity={reducedMotion ? 0 : 0.8}
        >
          <mesh position={shape.position} scale={shape.scale}>
            <icosahedronGeometry args={[0.9, 4]} />
            <meshPhysicalMaterial
              color={shape.color}
              emissive={shape.emissive}
              emissiveIntensity={0.6}
              transmission={0.74}
              roughness={0.24}
              metalness={0.08}
              transparent
              opacity={0.9}
              clearcoat={0.8}
            />
          </mesh>
        </Float>
      ))}
      <Sparkles
        count={sceneId === "signalGrid" ? 18 : 12}
        size={sceneId === "neuralBloom" ? 3.2 : 2.4}
        scale={[8, 5, 4]}
        speed={reducedMotion ? 0 : 0.18}
        opacity={0.34}
        color={post.visualIdentity.palette.highlight}
      />
    </group>
  );
};

const ResearchAmbientScene: React.FC<ResearchAmbientSceneProps> = ({ post, reducedMotion = false }) => {
  return (
    <div className="research-ambient-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 34 }}
      >
        <AmbientShapes post={post} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default ResearchAmbientScene;
