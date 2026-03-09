import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OriginAssetModel from "../components/OriginAssetModel";
import OriginSupportingModels from "../components/OriginSupportingModels";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";
import { createScatterCloud, createSphereShell } from "./sceneGenerators";

const launchArcA: [number, number, number][] = [
  [-1.1, -0.94, -0.32],
  [-0.52, -0.32, 0.16],
  [0.18, 0.42, 0.26],
  [1.02, 0.82, -0.22],
];

const launchArcB: [number, number, number][] = [
  [-0.92, -1.02, 0.12],
  [-0.14, -0.26, 0.36],
  [0.7, 0.46, 0.1],
  [1.28, 0.76, -0.34],
];

const OrbitalTrajectoryScene: React.FC<OriginSceneComponentProps> = ({
  beat,
  assetConfig,
  weight,
  localProgress,
  holdProgress,
  pointer,
  reducedMotion,
  qualityTier,
  qualityFactor,
  phase,
  phaseProgress,
  sceneMix,
  isAdjacent,
  transitionDirection,
  activeHotspotId,
  activeSubscene,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitalRingRef = useRef<THREE.Group>(null);
  const horizonRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);

  const stars = useMemo(
    () => createSphereShell(Math.max(1000, Math.floor(2600 * qualityFactor)), 4.8, 10),
    [qualityFactor],
  );
  const dust = useMemo(
    () => createScatterCloud(Math.max(320, Math.floor(760 * qualityFactor)), 8.2, 4.2, 6.2),
    [qualityFactor],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const intensity = clamp01(weight);
    const reveal = smoothStep(localProgress);
    const subsceneProgress = activeSubscene?.progress ?? 0;
    const subsceneBlend = activeSubscene?.blend ?? 0;
    const transitionOffset = isAdjacent ? transitionDirection * (1 - sceneMix) * 0.72 : 0;

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.14 * intensity + elapsed * (0.02 + subsceneProgress * 0.02);
      rootRef.current.rotation.x = pointer.y * 0.08 * intensity;
      rootRef.current.position.x = transitionOffset;
      rootRef.current.position.y = phase === "intro" ? (1 - phaseProgress) * 0.16 : 0;
      rootRef.current.position.z = -subsceneBlend * 0.12;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += (reducedMotion ? 0.0008 : 0.0018) + subsceneProgress * 0.0009;
      const material = planetRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.22 + holdProgress * 0.52 + subsceneBlend * 0.18;
    }

    if (orbitalRingRef.current) {
      orbitalRingRef.current.rotation.z = elapsed * (0.12 + subsceneProgress * 0.05);
      orbitalRingRef.current.scale.setScalar(0.98 + reveal * 0.08 + subsceneProgress * 0.06);
    }

    if (horizonRef.current) {
      horizonRef.current.position.x = -1.06 + Math.sin(elapsed * 0.44) * 0.06;
      horizonRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "trajectory-horizon" ? 0.14 : 0) +
          (activeSubscene?.definition.id === "trajectory-horizon-dive" ? subsceneProgress * 0.18 : 0),
      );
    }

    if (orbitRef.current) {
      orbitRef.current.position.x = 1.02 + Math.cos(elapsed * 0.54) * 0.05;
      orbitRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "trajectory-collaboration" ? 0.14 : 0) +
          (activeSubscene?.definition.id === "trajectory-collaboration-dive" ? subsceneProgress * 0.18 : 0),
      );
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <points position={[0, 0, -2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={stars} itemSize={3} count={stars.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.text}
          transparent
          opacity={0.14 + clamp01(weight) * 0.48}
          size={0.018}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points position={[0, 0, 0.4]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={dust} itemSize={3} count={dust.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.secondary}
          transparent
          opacity={0.08 + clamp01(weight) * 0.24}
          size={0.014}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <OriginAssetModel
        config={assetConfig}
        qualityTier={qualityTier}
        fallback={
          <group>
            <mesh ref={planetRef} position={[-0.28, -0.16, 0]}>
              <sphereGeometry args={[0.98, 84, 84]} />
              <meshStandardMaterial color="#10253d" emissive={beat.palette.glow} emissiveIntensity={0.42} roughness={0.5} metalness={0.08} />
            </mesh>

            <mesh position={[-0.28, -0.16, 0]}>
              <sphereGeometry args={[1.07, 64, 64]} />
              <meshBasicMaterial color={beat.palette.accent} transparent opacity={0.14} />
            </mesh>

            <group ref={orbitalRingRef} position={[-0.06, 0.08, 0.18]}>
              <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <torusGeometry args={[1.6, 0.018, 12, 160]} />
                <meshBasicMaterial color={beat.palette.secondary} transparent opacity={0.34} />
              </mesh>
              <mesh rotation={[Math.PI / 2.5, 0.24, 0]}>
                <torusGeometry args={[2.04, 0.012, 10, 160]} />
                <meshBasicMaterial color={beat.palette.accent} transparent opacity={0.26} />
              </mesh>
            </group>

            <group ref={horizonRef} position={[-1.06, -0.82, 0.12]}>
              <mesh rotation={[0, -0.36, 0]} scale={[0.86, 0.18, 0.34]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#cbd5e1" emissive={beat.palette.accent} emissiveIntensity={0.24} />
              </mesh>
              <mesh position={[0.48, 0.12, 0.1]} scale={[0.18, 0.42, 0.18]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#94a3b8" emissive={beat.palette.secondary} emissiveIntensity={0.18} />
              </mesh>
            </group>

            <group ref={orbitRef} position={[1.02, 0.28, 0.22]}>
              <mesh>
                <sphereGeometry args={[0.18, 20, 20]} />
                <meshStandardMaterial color="#f8fafc" emissive={beat.palette.secondary} emissiveIntensity={0.48} />
              </mesh>
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.32, 0.01, 8, 64]} />
                <meshBasicMaterial color={beat.palette.accent} transparent opacity={0.34} />
              </mesh>
            </group>

            <Line points={launchArcA} color={beat.palette.secondary} transparent opacity={0.46 + holdProgress * 0.12} lineWidth={1.6} />
            <Line points={launchArcB} color={beat.palette.accent} transparent opacity={0.4 + holdProgress * 0.12} lineWidth={1.6} />
          </group>
        }
      />

      <OriginSupportingModels models={assetConfig.supportingModels} qualityTier={qualityTier} />
    </group>
  );
};

export default OrbitalTrajectoryScene;
