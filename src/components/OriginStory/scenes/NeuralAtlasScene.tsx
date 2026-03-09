import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OriginAssetModel from "../components/OriginAssetModel";
import OriginSupportingModels from "../components/OriginSupportingModels";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";
import { createGridNodes, createScatterCloud, createSphereShell } from "./sceneGenerators";

const NeuralAtlasScene: React.FC<OriginSceneComponentProps> = ({
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
  const atlasRef = useRef<THREE.Group>(null);
  const predictionRef = useRef<THREE.Group>(null);
  const memoryRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => createGridNodes(5, 4, 0.58, 0.46, 0.9), []);
  const dust = useMemo(
    () => createScatterCloud(Math.max(260, Math.floor(620 * qualityFactor)), 7.2, 4.2, 4.8),
    [qualityFactor],
  );
  const halo = useMemo(
    () => createSphereShell(Math.max(420, Math.floor(1100 * qualityFactor)), 2.2, 4.8),
    [qualityFactor],
  );

  const links = useMemo(() => {
    const output: Array<[[number, number, number], [number, number, number]]> = [];
    nodes.forEach((node, index) => {
      if (index % 5 !== 4) {
        output.push([node, nodes[index + 1]]);
      }
      if (index < nodes.length - 5) {
        output.push([node, nodes[index + 5]]);
      }
    });
    return output;
  }, [nodes]);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const intensity = clamp01(weight);
    const reveal = smoothStep(localProgress);
    const subsceneProgress = activeSubscene?.progress ?? 0;
    const transitionOffset = isAdjacent ? transitionDirection * (1 - sceneMix) * 0.52 : 0;
    const introLift = phase === "intro" ? (1 - phaseProgress) * 0.14 : 0;

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.16 * intensity + elapsed * (0.04 + subsceneProgress * 0.03);
      rootRef.current.rotation.x = pointer.y * 0.1 * intensity;
      rootRef.current.position.x = transitionOffset;
      rootRef.current.position.y = Math.sin(elapsed * 0.4) * 0.06 + introLift;
      rootRef.current.position.z = -(activeSubscene?.blend ?? 0) * 0.12;
    }

    if (atlasRef.current) {
      atlasRef.current.rotation.z = Math.sin(elapsed * 0.3) * 0.04;
      atlasRef.current.scale.setScalar(0.98 + reveal * 0.06 + subsceneProgress * 0.08);
    }

    if (predictionRef.current) {
      predictionRef.current.position.x = -1.02 + Math.sin(elapsed * 0.7) * 0.05;
      predictionRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "mind-prediction" ? 0.12 : 0) +
          (activeSubscene?.definition.id === "mind-prediction-dive" ? subsceneProgress * 0.2 : 0),
      );
    }

    if (memoryRef.current) {
      memoryRef.current.position.x = 1.02 + Math.cos(elapsed * 0.68) * 0.05;
      memoryRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "mind-memory" ? 0.12 : 0) +
          (activeSubscene?.definition.id === "mind-memory-dive" ? subsceneProgress * 0.2 : 0),
      );
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <points position={[0, 0, -0.2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={halo} itemSize={3} count={halo.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.accent}
          transparent
          opacity={0.08 + clamp01(weight) * 0.28}
          size={0.014}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={dust} itemSize={3} count={dust.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.secondary}
          transparent
          opacity={0.06 + clamp01(weight) * 0.24}
          size={0.018}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <OriginAssetModel
        config={assetConfig}
        qualityTier={qualityTier}
        fallback={
          <group ref={atlasRef}>
            {links.map(([from, to], index) => (
              <Line
                key={`atlas-link-${index}`}
                points={[from, to]}
                color={index % 2 === 0 ? beat.palette.secondary : beat.palette.accent}
                transparent
                opacity={0.2 + holdProgress * 0.42}
                lineWidth={1}
              />
            ))}

            {nodes.map((node, index) => (
              <mesh key={`atlas-node-${index}`} position={node} scale={0.08 + (index % 3) * 0.01}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  color={index % 2 === 0 ? "#ede9fe" : "#dbeafe"}
                  emissive={index % 2 === 0 ? beat.palette.accent : beat.palette.secondary}
                  emissiveIntensity={0.26 + (index % 4) * 0.08}
                />
              </mesh>
            ))}

            <group ref={predictionRef} position={[-1.02, 0.18, 0.42]}>
              {Array.from({ length: 3 }).map((_, index) => (
                <mesh key={`prediction-${index}`} position={[0, index * 0.28 - 0.28, 0]} rotation={[0, 0.2, 0]}>
                  <planeGeometry args={[0.66, 0.16]} />
                  <meshBasicMaterial color={beat.palette.accent} transparent opacity={0.16 + index * 0.08} />
                </mesh>
              ))}
            </group>

            <group ref={memoryRef} position={[1.02, -0.12, 0.4]}>
              {Array.from({ length: 4 }).map((_, index) => (
                <mesh key={`memory-${index}`} position={[0, index * 0.18 - 0.24, -index * 0.08]} rotation={[0, -0.24, 0]}>
                  <boxGeometry args={[0.46, 0.12, 0.08]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    emissive={beat.palette.secondary}
                    emissiveIntensity={0.24 + index * 0.08}
                    roughness={0.28}
                  />
                </mesh>
              ))}
            </group>
          </group>
        }
      />

      <OriginSupportingModels models={assetConfig.supportingModels} qualityTier={qualityTier} />
    </group>
  );
};

export default NeuralAtlasScene;
