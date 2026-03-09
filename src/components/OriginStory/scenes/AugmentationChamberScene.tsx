import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OriginAssetModel from "../components/OriginAssetModel";
import OriginSupportingModels from "../components/OriginSupportingModels";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";
import { createScatterCloud, createSphereShell } from "./sceneGenerators";

const AugmentationChamberScene: React.FC<OriginSceneComponentProps> = ({
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
  const haloRef = useRef<THREE.Group>(null);
  const wearableRef = useRef<THREE.Group>(null);
  const armatureRef = useRef<THREE.Group>(null);

  const chamberParticles = useMemo(
    () => createScatterCloud(Math.max(220, Math.floor(520 * qualityFactor)), 6, 4.6, 4.2),
    [qualityFactor],
  );
  const haloPoints = useMemo(
    () => createSphereShell(Math.max(260, Math.floor(620 * qualityFactor)), 1.2, 2.4),
    [qualityFactor],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const intensity = clamp01(weight);
    const reveal = smoothStep(localProgress);
    const subsceneProgress = activeSubscene?.progress ?? 0;
    const subsceneBlend = activeSubscene?.blend ?? 0;
    const transitionOffset = isAdjacent ? transitionDirection * (1 - sceneMix) * 0.58 : 0;

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.18 * intensity;
      rootRef.current.rotation.x = pointer.y * 0.08 * intensity;
      rootRef.current.position.x = transitionOffset;
      rootRef.current.position.y = Math.sin(elapsed * 0.54) * 0.04 + (phase === "intro" ? (1 - phaseProgress) * 0.18 : 0);
      rootRef.current.position.z = -subsceneBlend * 0.18;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = elapsed * (0.18 + subsceneProgress * 0.08);
      haloRef.current.scale.setScalar(0.98 + reveal * 0.08 + subsceneProgress * 0.06);
    }

    if (wearableRef.current) {
      wearableRef.current.position.x = -0.92 + Math.sin(elapsed * 0.72) * 0.06;
      wearableRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "augmentation-wearables" ? 0.16 : 0) +
          (activeSubscene?.definition.id === "augmentation-wearables-dive" ? subsceneProgress * 0.18 : 0),
      );
    }

    if (armatureRef.current) {
      armatureRef.current.rotation.z = Math.sin(elapsed * 0.88) * 0.08;
      armatureRef.current.position.x = 0.98 + Math.cos(elapsed * 0.66) * 0.04;
      armatureRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "augmentation-bci" ? 0.14 : 0) +
          (activeSubscene?.definition.id === "augmentation-bci-dive" ? subsceneProgress * 0.18 : 0),
      );
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <points position={[0, 0, 0.2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={chamberParticles} itemSize={3} count={chamberParticles.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.secondary}
          transparent
          opacity={0.08 + clamp01(weight) * 0.22}
          size={0.016}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={haloPoints} itemSize={3} count={haloPoints.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.accent}
          transparent
          opacity={0.06 + clamp01(weight) * 0.2}
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
            <group ref={haloRef}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.38, 0.82, 100]} />
                <meshStandardMaterial color="#f8fafc" emissive={beat.palette.accent} emissiveIntensity={0.48} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[Math.PI / 2.6, 0, 0]}>
                <torusGeometry args={[1.12, 0.016, 12, 120]} />
                <meshBasicMaterial color={beat.palette.secondary} transparent opacity={0.44} />
              </mesh>
              <mesh rotation={[Math.PI / 3.2, 0, 0]}>
                <torusGeometry args={[1.42, 0.012, 10, 120]} />
                <meshBasicMaterial color={beat.palette.accent} transparent opacity={0.28 + holdProgress * 0.18} />
              </mesh>
            </group>

            <group ref={wearableRef} position={[-0.92, 0.08, 0.18]}>
              <mesh scale={[0.5, 0.16, 0.34]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#111827" emissive={beat.palette.secondary} emissiveIntensity={0.22} />
              </mesh>
              <mesh position={[0.34, 0, 0.1]}>
                <sphereGeometry args={[0.12, 22, 22]} />
                <meshStandardMaterial color="#f8fafc" emissive={beat.palette.accent} emissiveIntensity={0.56} />
              </mesh>
            </group>

            <group ref={armatureRef} position={[0.98, -0.04, 0.18]}>
              <mesh position={[0, 0.28, 0]} rotation={[0, 0, -0.34]} scale={[0.12, 0.78, 0.12]}>
                <capsuleGeometry args={[1, 1.1, 6, 12]} />
                <meshStandardMaterial color="#cbd5e1" emissive={beat.palette.secondary} emissiveIntensity={0.2} metalness={0.44} roughness={0.3} />
              </mesh>
              <mesh position={[0.18, -0.12, 0.08]} rotation={[0, 0, 0.26]} scale={[0.12, 0.66, 0.12]}>
                <capsuleGeometry args={[1, 1, 6, 12]} />
                <meshStandardMaterial color="#e2e8f0" emissive={beat.palette.accent} emissiveIntensity={0.18} metalness={0.42} roughness={0.26} />
              </mesh>
              <mesh position={[0.28, -0.54, 0.12]}>
                <sphereGeometry args={[0.14, 20, 20]} />
                <meshStandardMaterial color="#f8fafc" emissive={beat.palette.accent} emissiveIntensity={0.52} />
              </mesh>
            </group>

            <Line
              points={[
                [-0.44, 0.18, 0.16],
                [-0.1, 0.08, 0.04],
                [0.18, -0.06, 0.08],
                [0.54, -0.18, 0.14],
              ]}
              color={beat.palette.secondary}
              transparent
              opacity={0.4}
              lineWidth={1.4}
            />
          </group>
        }
      />

      <OriginSupportingModels models={assetConfig.supportingModels} qualityTier={qualityTier} />
    </group>
  );
};

export default AugmentationChamberScene;
