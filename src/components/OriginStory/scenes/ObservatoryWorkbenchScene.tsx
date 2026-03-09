import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OriginAssetModel from "../components/OriginAssetModel";
import OriginSupportingModels from "../components/OriginSupportingModels";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";
import { createScatterCloud, createSphereShell } from "./sceneGenerators";

const ObservatoryWorkbenchScene: React.FC<OriginSceneComponentProps> = ({
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
  const orreryRef = useRef<THREE.Group>(null);
  const notesRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Group>(null);
  const deskGlowRef = useRef<THREE.Mesh>(null);

  const starCloud = useMemo(
    () => createSphereShell(Math.max(620, Math.floor(1600 * qualityFactor)), 4.8, 8.2),
    [qualityFactor],
  );
  const dustCloud = useMemo(
    () => createScatterCloud(Math.max(220, Math.floor(540 * qualityFactor)), 8, 4.5, 5),
    [qualityFactor],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const intensity = clamp01(weight);
    const reveal = smoothStep(localProgress);
    const subsceneProgress = activeSubscene?.progress ?? 0;
    const subsceneBlend = activeSubscene?.blend ?? 0;
    const transitionOffset = isAdjacent ? transitionDirection * (1 - sceneMix) * 0.68 : 0;
    const introLift = phase === "intro" ? (1 - phaseProgress) * 0.22 : 0;
    const handoffDrift = phase === "handoff" ? phaseProgress * 0.28 : 0;

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.12 * intensity;
      rootRef.current.rotation.x = pointer.y * 0.06 * intensity;
      rootRef.current.position.x = transitionOffset;
      rootRef.current.position.y = Math.sin(elapsed * 0.36) * 0.04 * (reducedMotion ? 0.35 : 1) + introLift;
      rootRef.current.position.z = handoffDrift - subsceneBlend * 0.18;
    }

    if (orreryRef.current) {
      orreryRef.current.rotation.y += (reducedMotion ? 0.0024 : 0.0048) + subsceneProgress * 0.0025;
      orreryRef.current.rotation.x = Math.sin(elapsed * 0.6) * 0.08;
      orreryRef.current.scale.setScalar(
        0.92 +
          reveal * 0.1 +
          (activeHotspotId === "spark-orrery" ? 0.1 : 0) +
          (activeSubscene?.definition.id === "spark-orrery-dive" ? subsceneProgress * 0.18 : 0),
      );
    }

    if (notesRef.current) {
      notesRef.current.position.x = -1.18 + Math.sin(elapsed * 0.8) * 0.05;
      notesRef.current.position.y = -0.36 + Math.cos(elapsed * 1.1) * 0.04;
      notesRef.current.rotation.z = -0.18 + Math.sin(elapsed * 0.52) * 0.02;
      notesRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "spark-notes" ? 0.12 : 0) +
          (activeSubscene?.definition.id === "spark-notes-dive" ? subsceneProgress * 0.18 : 0),
      );
    }

    if (lensRef.current) {
      lensRef.current.rotation.z = elapsed * (0.18 + subsceneProgress * 0.08);
      lensRef.current.position.x = 1.24 + Math.cos(elapsed * 0.7) * 0.08;
      lensRef.current.position.y = -0.2 + subsceneBlend * 0.04;
    }

    if (deskGlowRef.current) {
      const material = deskGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.12 + intensity * 0.16 + holdProgress * 0.08;
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <points position={[0, 0, -1.8]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={starCloud} itemSize={3} count={starCloud.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.text}
          transparent
          opacity={0.14 + clamp01(weight) * 0.4}
          size={0.02}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points position={[0, 0, 1.8]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={dustCloud} itemSize={3} count={dustCloud.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.accent}
          transparent
          opacity={0.08 + clamp01(weight) * 0.2}
          size={0.018}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <OriginAssetModel
        config={assetConfig}
        qualityTier={qualityTier}
        fallback={
          <group>
            <mesh ref={deskGlowRef} position={[0, -0.88, -0.26]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.5, 64]} />
              <meshBasicMaterial color={beat.palette.accent} transparent opacity={0.2} />
            </mesh>

            <mesh position={[0, -0.72, 0]}>
              <cylinderGeometry args={[2.2, 2.34, 0.24, 64]} />
              <meshStandardMaterial color="#1b2434" roughness={0.62} metalness={0.14} />
            </mesh>

            <group ref={orreryRef} position={[0.66, 0.08, 0.18]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.46, 0.72, 72]} />
                <meshBasicMaterial color={beat.palette.secondary} transparent opacity={0.42} />
              </mesh>
              <mesh rotation={[Math.PI / 2.4, 0, 0]}>
                <torusGeometry args={[0.94, 0.018, 12, 120]} />
                <meshStandardMaterial color="#d6a65c" emissive={beat.palette.secondary} emissiveIntensity={0.36} />
              </mesh>
              <mesh rotation={[Math.PI / 3.1, 0, 0]}>
                <torusGeometry args={[1.28, 0.018, 12, 120]} />
                <meshStandardMaterial color="#8a6131" emissive={beat.palette.secondary} emissiveIntensity={0.24} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.24, 32, 32]} />
                <meshStandardMaterial color="#f6ead1" emissive={beat.palette.glow} emissiveIntensity={0.42} />
              </mesh>
            </group>

            <group ref={notesRef} position={[-1.18, -0.36, 0.2]}>
              {Array.from({ length: 3 }).map((_, index) => (
                <mesh key={`note-${index}`} position={[index * 0.1, index * 0.03, -index * 0.08]} rotation={[-0.3, 0.18, -0.1]}>
                  <boxGeometry args={[0.78, 0.04, 0.56]} />
                  <meshStandardMaterial
                    color={index === 0 ? "#e2e8f0" : "#cbd5e1"}
                    emissive={activeHotspotId === "spark-notes" ? beat.palette.accent : "#000000"}
                    emissiveIntensity={activeHotspotId === "spark-notes" ? 0.36 : 0}
                    roughness={0.88}
                  />
                </mesh>
              ))}
              <Line
                points={[
                  [-0.24, 0.06, 0.28],
                  [-0.06, 0.08, 0.32],
                  [0.12, 0.02, 0.28],
                  [0.24, 0.07, 0.32],
                ]}
                color={beat.palette.accent}
                transparent
                opacity={0.46}
                lineWidth={1}
              />
            </group>

            <group ref={lensRef} position={[1.24, -0.24, 0.46]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.26, 0.06, 14, 48]} />
                <meshStandardMaterial color="#0f172a" emissive={beat.palette.glow} emissiveIntensity={0.28} metalness={0.34} />
              </mesh>
              <mesh position={[0, 0, 0.05]}>
                <cylinderGeometry args={[0.18, 0.18, 0.12, 32]} />
                <meshPhysicalMaterial color="#7dd3fc" transparent opacity={0.26} roughness={0.08} transmission={0.2} />
              </mesh>
            </group>

            <mesh position={[0, 0.64, -0.72]}>
              <planeGeometry args={[2.9, 0.9]} />
              <meshBasicMaterial color={beat.palette.glow} transparent opacity={0.08 + holdProgress * 0.1} />
            </mesh>
          </group>
        }
      />

      <OriginSupportingModels models={assetConfig.supportingModels} qualityTier={qualityTier} />
    </group>
  );
};

export default ObservatoryWorkbenchScene;
