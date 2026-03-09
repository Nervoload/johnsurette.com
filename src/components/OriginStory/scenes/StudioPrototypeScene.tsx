import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OriginAssetModel from "../components/OriginAssetModel";
import OriginSupportingModels from "../components/OriginSupportingModels";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";
import { createGridNodes, createScatterCloud } from "./sceneGenerators";

const StudioPrototypeScene: React.FC<OriginSceneComponentProps> = ({
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
  const panelWallRef = useRef<THREE.Group>(null);
  const systemsRef = useRef<THREE.Group>(null);
  const prototypeRef = useRef<THREE.Group>(null);
  const deviceStackRef = useRef<THREE.Group>(null);

  const gridNodes = useMemo(() => createGridNodes(7, 3, 0.44, 0.42, 0.12), []);
  const dust = useMemo(
    () => createScatterCloud(Math.max(180, Math.floor(360 * qualityFactor)), 6, 4, 4),
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
      rootRef.current.rotation.y = pointer.x * 0.14 * intensity;
      rootRef.current.rotation.x = pointer.y * 0.06 * intensity;
      rootRef.current.position.x = transitionOffset;
      rootRef.current.position.y = phase === "intro" ? (1 - phaseProgress) * 0.18 : 0;
      rootRef.current.position.z = -subsceneBlend * 0.16;
    }

    if (panelWallRef.current) {
      panelWallRef.current.position.y = 0.12 + Math.sin(elapsed * 0.42) * 0.04 + subsceneProgress * 0.04;
    }

    if (systemsRef.current) {
      systemsRef.current.position.x = -1.1 + Math.sin(elapsed * 0.6) * 0.04;
      systemsRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "build-systems" ? 0.12 : 0) +
          (activeSubscene?.definition.id === "build-systems-dive" ? subsceneProgress * 0.18 : 0),
      );
    }

    if (prototypeRef.current) {
      prototypeRef.current.position.x = 1.02 + Math.cos(elapsed * 0.68) * 0.05;
      prototypeRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "build-prototypes" ? 0.14 : 0) +
          (activeSubscene?.definition.id === "build-prototypes-dive" ? subsceneProgress * 0.18 : 0),
      );
    }

    if (deviceStackRef.current) {
      deviceStackRef.current.rotation.y = elapsed * (reducedMotion ? 0.08 : 0.16) + subsceneProgress * 0.24;
      deviceStackRef.current.position.y = -0.04 + Math.sin(elapsed * 0.84) * 0.04;
      deviceStackRef.current.scale.setScalar(0.96 + reveal * 0.08);
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <points position={[0, 0, 0.6]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={dust} itemSize={3} count={dust.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.secondary}
          transparent
          opacity={0.08 + clamp01(weight) * 0.18}
          size={0.012}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <OriginAssetModel
        config={assetConfig}
        qualityTier={qualityTier}
        fallback={
          <group>
            <group ref={panelWallRef} position={[0, 0.18, -0.48]}>
              {gridNodes.map((node, index) => (
                <mesh key={`panel-${index}`} position={[node[0], node[1], -1.1 + node[2]]}>
                  <planeGeometry args={[0.34, 0.24]} />
                  <meshBasicMaterial
                    color={index % 3 === 0 ? beat.palette.secondary : beat.palette.accent}
                    transparent
                    opacity={0.08 + (index % 4) * 0.03 + holdProgress * 0.08}
                  />
                </mesh>
              ))}
            </group>

            <group ref={systemsRef} position={[-1.1, -0.18, 0.26]}>
              {Array.from({ length: 3 }).map((_, index) => (
                <mesh key={`stack-${index}`} position={[0, index * 0.18, -index * 0.12]} rotation={[-0.16, 0.22, 0]}>
                  <boxGeometry args={[0.72, 0.12, 0.46]} />
                  <meshStandardMaterial color="#111827" emissive={beat.palette.secondary} emissiveIntensity={0.18 + index * 0.12} />
                </mesh>
              ))}
              <Line
                points={[
                  [-0.34, 0.32, 0.2],
                  [-0.06, 0.4, 0.24],
                  [0.12, 0.24, 0.2],
                  [0.34, 0.42, 0.24],
                ]}
                color={beat.palette.secondary}
                transparent
                opacity={0.46}
                lineWidth={1.4}
              />
            </group>

            <group ref={prototypeRef} position={[1.02, 0.02, 0.26]}>
              <mesh rotation={[-0.2, -0.36, 0.06]}>
                <boxGeometry args={[0.56, 0.84, 0.08]} />
                <meshStandardMaterial color="#0f172a" emissive={beat.palette.accent} emissiveIntensity={0.22} />
              </mesh>
              <mesh position={[0, 0, 0.05]} rotation={[-0.2, -0.36, 0.06]}>
                <planeGeometry args={[0.46, 0.72]} />
                <meshBasicMaterial color={beat.palette.secondary} transparent opacity={0.26} />
              </mesh>
            </group>

            <group ref={deviceStackRef} position={[0.18, -0.22, 0.56]}>
              <mesh scale={[0.84, 0.1, 0.58]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#111827" emissive={beat.palette.glow} emissiveIntensity={0.18} />
              </mesh>
              <mesh position={[0.04, 0.16, 0.02]} scale={[0.54, 0.04, 0.36]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#e5e7eb" emissive={beat.palette.accent} emissiveIntensity={0.22} />
              </mesh>
            </group>
          </group>
        }
      />

      <OriginSupportingModels models={assetConfig.supportingModels} qualityTier={qualityTier} />
    </group>
  );
};

export default StudioPrototypeScene;
