import React, { useMemo, useRef } from "react";
import { Text, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OriginSceneComponentProps } from "../types";
import { clamp01, lerp, smoothStep } from "./sceneMath";

const moleculeNodes: [number, number, number][] = [
  [-0.72, 0.24, 0],
  [-0.3, 0.56, 0.08],
  [0.2, 0.42, -0.14],
  [0.7, 0.08, 0.12],
  [0.42, -0.38, -0.08],
  [-0.16, -0.54, 0.14],
  [-0.72, -0.18, -0.05],
];

const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 0],
  [1, 4],
  [2, 5],
];

const AtomicEmergenceScene: React.FC<OriginSceneComponentProps> = ({
  weight,
  localProgress,
  pointer,
  reducedMotion,
  qualityFactor,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const collisionGroupRef = useRef<THREE.Group>(null);
  const moleculeGroupRef = useRef<THREE.Group>(null);
  const cellRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);

  const atomDust = useMemo(() => {
    const count = Math.max(160, Math.floor(420 * qualityFactor));
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 3.2,
      y: (Math.random() - 0.5) * 2.2,
      z: (Math.random() - 0.5) * 1.1,
      r: 0.006 + Math.random() * 0.014,
      hue: Math.random() > 0.5 ? "#67e8f9" : "#c4b5fd",
    }));
  }, [qualityFactor]);

  useFrame(({ clock }) => {
    const intensity = clamp01(weight);
    const elapsed = clock.elapsedTime;
    const t = smoothStep(localProgress);

    const collisionPhase = smoothStep((t - 0.05) / 0.22);
    const moleculePhase = smoothStep((t - 0.26) / 0.3);
    const cellPhase = smoothStep((t - 0.52) / 0.36);
    const zoomOut = smoothStep((t - 0.58) / 0.38);

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.2 * intensity + elapsed * 0.06;
      rootRef.current.rotation.x = pointer.y * 0.14 * intensity;
      const scale = lerp(1.48, 0.88, zoomOut);
      rootRef.current.scale.setScalar(scale);
    }

    if (collisionGroupRef.current) {
      collisionGroupRef.current.visible = collisionPhase < 0.98;
    }

    if (leftRef.current) {
      leftRef.current.position.x = lerp(-1.9, -0.18, collisionPhase);
      leftRef.current.position.y = Math.sin(elapsed * 1.5) * 0.06;
      const mat = leftRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.28 + intensity * (1 - moleculePhase) * 0.68;
      mat.emissiveIntensity = 0.4 + collisionPhase * 0.44;
    }

    if (rightRef.current) {
      rightRef.current.position.x = lerp(1.9, 0.18, collisionPhase);
      rightRef.current.position.y = Math.cos(elapsed * 1.42) * 0.06;
      const mat = rightRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.28 + intensity * (1 - moleculePhase) * 0.68;
      mat.emissiveIntensity = 0.4 + collisionPhase * 0.44;
    }

    if (moleculeGroupRef.current) {
      moleculeGroupRef.current.visible = moleculePhase > 0.06;
      moleculeGroupRef.current.rotation.z = elapsed * 0.14;
      moleculeGroupRef.current.position.y = Math.sin(elapsed * 0.8) * 0.04;
      moleculeGroupRef.current.scale.setScalar(0.8 + moleculePhase * 0.5 - cellPhase * 0.28);
    }

    if (cellRef.current) {
      const jitter = reducedMotion ? 0.01 : 0.04;
      cellRef.current.scale.setScalar(0.45 + cellPhase * 1.04);
      cellRef.current.rotation.y = elapsed * 0.22;
      cellRef.current.position.y = Math.sin(elapsed * 1.9) * jitter;
      const mat = cellRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.12 + cellPhase * 0.56;
      mat.emissiveIntensity = 0.2 + cellPhase * 0.64;
    }

    if (shellRef.current) {
      shellRef.current.scale.setScalar(0.72 + cellPhase * 1.06);
      const mat = shellRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + cellPhase * 0.25;
    }
  });

  const lineAlpha = 0.08 + smoothStep((localProgress - 0.25) / 0.32) * 0.74 * clamp01(weight);
  const nodeScale = 0.05 + smoothStep((localProgress - 0.26) / 0.28) * 0.08;

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <group ref={collisionGroupRef}>
        <mesh ref={leftRef} position={[-1.35, 0, 0.16]}>
          <sphereGeometry args={[0.24, 26, 26]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#22d3ee"
            emissiveIntensity={0.58}
            roughness={0.28}
            metalness={0.02}
            transparent
            opacity={0.84}
          />
        </mesh>

        <mesh ref={rightRef} position={[1.35, 0, -0.16]}>
          <sphereGeometry args={[0.24, 26, 26]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#c4b5fd"
            emissiveIntensity={0.58}
            roughness={0.28}
            metalness={0.02}
            transparent
            opacity={0.84}
          />
        </mesh>
      </group>

      <group ref={moleculeGroupRef}>
        {links.map(([a, b], idx) => (
          <Line
            key={`molecule-link-${idx}`}
            points={[moleculeNodes[a], moleculeNodes[b]]}
            color="#67e8f9"
            lineWidth={1}
            transparent
            opacity={lineAlpha}
          />
        ))}

        {moleculeNodes.map((node, idx) => (
          <mesh key={`molecule-node-${idx}`} position={node} scale={nodeScale}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#bae6fd" : "#d8b4fe"}
              emissive={idx % 2 === 0 ? "#67e8f9" : "#a78bfa"}
              emissiveIntensity={0.34}
              transparent
              opacity={lineAlpha}
            />
          </mesh>
        ))}
      </group>

      <mesh ref={cellRef} position={[0, -0.02, -0.22]} scale={0.45}>
        <sphereGeometry args={[0.62, 56, 56]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#06b6d4"
          emissiveIntensity={0.34}
          roughness={0.3}
          metalness={0.06}
          transparent
          opacity={0.44}
        />
      </mesh>

      <mesh ref={shellRef} position={[0, -0.02, -0.2]}>
        <sphereGeometry args={[0.88, 44, 44]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.2} wireframe />
      </mesh>

      {atomDust.map((atom, idx) => (
        <mesh key={`atom-dust-${idx}`} position={[atom.x, atom.y, atom.z]}>
          <sphereGeometry args={[atom.r, 8, 8]} />
          <meshBasicMaterial color={atom.hue} transparent opacity={0.24 + weight * 0.44} />
        </mesh>
      ))}

      <Text
        position={[0, -1.26, 0]}
        fontSize={0.14}
        anchorX="center"
        anchorY="middle"
        color="#a5f3fc"
        fillOpacity={0.2 + smoothStep((localProgress - 0.18) / 0.5) * 0.72 * clamp01(weight)}
      >
        Molecules · Physics · Chemistry · Energy
      </Text>
    </group>
  );
};

export default AtomicEmergenceScene;
