import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import OriginAssetModel from "../components/OriginAssetModel";
import OriginSupportingModels from "../components/OriginSupportingModels";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";
import { createHelixLine, createScatterCloud, createSphereShell } from "./sceneGenerators";

const BiologyLabScene: React.FC<OriginSceneComponentProps> = ({
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
  const cellRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const loopRingRef = useRef<THREE.Mesh>(null);
  const signalColumnRef = useRef<THREE.Group>(null);

  const helixA = useMemo(() => createHelixLine(40, 0.42, 2.4, 3.8, -0.1), []);
  const helixB = useMemo(() => createHelixLine(40, 0.42, 2.4, 3.8, 0.1), []);
  const spores = useMemo(
    () => createScatterCloud(Math.max(320, Math.floor(760 * qualityFactor)), 5.4, 3.6, 3.8),
    [qualityFactor],
  );
  const halo = useMemo(
    () => createSphereShell(Math.max(240, Math.floor(520 * qualityFactor)), 1.2, 2.2),
    [qualityFactor],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const intensity = clamp01(weight);
    const reveal = smoothStep(localProgress);
    const subsceneProgress = activeSubscene?.progress ?? 0;
    const subsceneBlend = activeSubscene?.blend ?? 0;
    const transitionOffset = isAdjacent ? transitionDirection * (1 - sceneMix) * 0.56 : 0;
    const introLift = phase === "intro" ? (1 - phaseProgress) * 0.18 : 0;

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.14 * intensity + elapsed * (0.06 + subsceneProgress * 0.02);
      rootRef.current.rotation.x = pointer.y * 0.08 * intensity;
      rootRef.current.position.x = transitionOffset;
      rootRef.current.position.y = Math.sin(elapsed * 0.5) * 0.04 + introLift;
      rootRef.current.position.z = -subsceneBlend * 0.14;
    }

    if (cellRef.current) {
      cellRef.current.scale.setScalar(
        0.9 +
          reveal * 0.18 +
          (activeHotspotId === "biology-repair" ? 0.12 : 0) +
          (activeSubscene?.definition.id === "biology-repair-dive" ? subsceneProgress * 0.2 : 0),
      );
      cellRef.current.rotation.y = elapsed * (reducedMotion ? 0.08 : 0.18);
      const material = cellRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.24 + holdProgress * 0.56 + subsceneBlend * 0.22;
      material.opacity = 0.34 + reveal * 0.36;
    }

    if (shellRef.current) {
      shellRef.current.scale.setScalar(1.18 + Math.sin(elapsed * 0.8) * 0.03);
      const material = shellRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.08 + holdProgress * 0.18;
    }

    if (loopRingRef.current) {
      loopRingRef.current.rotation.z = elapsed * 0.22;
      const material = loopRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.12 + (activeHotspotId === "biology-repair" ? 0.34 : 0.14);
    }

    if (signalColumnRef.current) {
      signalColumnRef.current.position.x = 1.08 + Math.sin(elapsed * 0.6) * 0.06;
      signalColumnRef.current.scale.setScalar(
        1 +
          (activeHotspotId === "biology-signals" ? 0.14 : 0) +
          (activeSubscene?.definition.id === "biology-signals-dive" ? subsceneProgress * 0.18 : 0),
      );
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <points position={[0, 0, -0.2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={spores} itemSize={3} count={spores.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.secondary}
          transparent
          opacity={0.1 + clamp01(weight) * 0.34}
          size={0.022}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={halo} itemSize={3} count={halo.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color={beat.palette.accent}
          transparent
          opacity={0.08 + clamp01(weight) * 0.24}
          size={0.016}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <OriginAssetModel
        config={assetConfig}
        qualityTier={qualityTier}
        fallback={
          <group>
            <mesh ref={cellRef} position={[-0.12, -0.02, 0]}>
              <sphereGeometry args={[0.76, 64, 64]} />
              <meshStandardMaterial
                color="#0b1e1b"
                emissive={beat.palette.glow}
                emissiveIntensity={0.52}
                roughness={0.22}
                metalness={0.02}
                transparent
                opacity={0.64}
              />
            </mesh>

            <mesh ref={shellRef} position={[-0.12, -0.02, 0]}>
              <sphereGeometry args={[0.96, 48, 48]} />
              <meshBasicMaterial color={beat.palette.secondary} transparent opacity={0.2} wireframe />
            </mesh>

            <mesh ref={loopRingRef} position={[-0.04, 0.1, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
              <torusGeometry args={[1.28, 0.02, 12, 120]} />
              <meshBasicMaterial color={beat.palette.accent} transparent opacity={0.26} />
            </mesh>

            <Line points={helixA} color={beat.palette.secondary} transparent opacity={0.58} lineWidth={1.4} />
            <Line points={helixB} color={beat.palette.accent} transparent opacity={0.58} lineWidth={1.4} />

            {helixA.filter((_, index) => index % 5 === 0).map((point, index) => (
              <Line
                key={`dna-bridge-${index}`}
                points={[point, helixB[index * 5]]}
                color="#d1fae5"
                transparent
                opacity={0.26}
                lineWidth={1}
              />
            ))}

            <group ref={signalColumnRef} position={[1.08, -0.1, 0.2]}>
              {Array.from({ length: 4 }).map((_, index) => (
                <mesh key={`signal-${index}`} position={[0, index * 0.34 - 0.48, 0]} scale={[0.14, 0.22 + index * 0.04, 0.14]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial
                    color={index % 2 === 0 ? beat.palette.accent : beat.palette.secondary}
                    emissive={index % 2 === 0 ? beat.palette.glow : beat.palette.secondary}
                    emissiveIntensity={0.28 + index * 0.08}
                  />
                </mesh>
              ))}
              <mesh position={[0, 0.72, 0]}>
                <sphereGeometry args={[0.16, 24, 24]} />
                <meshStandardMaterial color="#ecfeff" emissive={beat.palette.secondary} emissiveIntensity={0.5} />
              </mesh>
            </group>
          </group>
        }
      />

      <OriginSupportingModels models={assetConfig.supportingModels} qualityTier={qualityTier} />
    </group>
  );
};

export default BiologyLabScene;
