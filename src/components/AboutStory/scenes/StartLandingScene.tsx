import React, { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AboutLandingSceneProps } from "../../../content/aboutStory";
import type { AboutSceneComponentProps } from "../types";

const StartLandingScene: React.FC<AboutSceneComponentProps> = ({ node, mix, nodeProgress, pointer, qualityMode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sceneProps = node.sceneProps as AboutLandingSceneProps;
  const tokens = useMemo(
    () =>
      sceneProps.orbitTokens.map((token, index) => ({
        ...token,
        phase: index * 1.9,
      })),
    [sceneProps.orbitTokens],
  );

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const drift = qualityMode === "reduced" ? 0.12 : 0.24;
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, pointer.x * drift, 4.2, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, pointer.y * drift * 0.4, 4.2, delta);
    group.position.y = Math.sin(clock.elapsedTime * 0.38) * 0.06;
  });

  const easedMix = THREE.MathUtils.smoothstep(mix, 0, 1);
  const panelLift = nodeProgress * 0.52;

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.34, -2.8]} scale={[13, 7.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.12 * easedMix} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <ringGeometry args={[1.48, 2.56, 96]} />
        <meshBasicMaterial color={sceneProps.accentColors[0]} transparent opacity={0.15 * easedMix} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.38, 0]}>
        <ringGeometry args={[2.72, 3.54, 120]} />
        <meshBasicMaterial color={sceneProps.accentColors[1]} transparent opacity={0.08 * easedMix} />
      </mesh>

      <RoundedBox args={[2.46, 1.44, 0.14]} radius={0.12} smoothness={4} position={[-1.22, 0.14 + panelLift * 0.16, -0.24]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.72 * easedMix}
          roughness={0.22}
          metalness={0.04}
        />
      </RoundedBox>
      <RoundedBox args={[1.42, 1.84, 0.12]} radius={0.12} smoothness={4} position={[1.52, -0.18 + panelLift * 0.08, 0.3]}>
        <meshStandardMaterial
          color="#e0f2fe"
          transparent
          opacity={0.8 * easedMix}
          roughness={0.24}
          metalness={0.05}
        />
      </RoundedBox>
      <RoundedBox args={[1.18, 0.84, 0.1]} radius={0.12} smoothness={4} position={[0.1, 1.08 + panelLift * 0.22, -0.4]}>
        <meshStandardMaterial
          color="#ede9fe"
          transparent
          opacity={0.7 * easedMix}
          roughness={0.28}
          metalness={0.05}
        />
      </RoundedBox>

      {tokens.map((token, index) => {
        const angle = index * 1.2;
        const offset = qualityMode === "reduced" ? 0.16 : 0.28;
        return (
          <group key={token.id} position={[Math.cos(angle) * token.radius, token.polar, Math.sin(angle) * 0.42]}>
            <mesh scale={token.size * (1 + nodeProgress * 0.2)}>
              <sphereGeometry args={[1, 28, 28]} />
              <meshStandardMaterial color={token.color} emissive={token.color} emissiveIntensity={0.5} transparent opacity={0.86 * mix} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={1 + nodeProgress * 0.15}>
              <torusGeometry args={[token.size + 0.1 + offset * 0.12, 0.012, 14, 44]} />
              <meshBasicMaterial color={token.color} transparent opacity={0.34 * mix} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export default StartLandingScene;
