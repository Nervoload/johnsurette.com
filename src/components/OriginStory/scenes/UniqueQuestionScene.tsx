import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OriginSceneComponentProps } from "../types";
import { clamp01 } from "./sceneMath";

const createSphereShell = (count: number, radiusMin: number, radiusMax: number): Float32Array => {
  const output = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
    output[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    output[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    output[i * 3 + 2] = Math.cos(phi) * radius;
  }
  return output;
};

const UniqueQuestionScene: React.FC<OriginSceneComponentProps> = ({
  weight,
  globalProgress,
  pointer,
  reducedMotion,
  qualityFactor,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerCloudRef = useRef<THREE.Points>(null);
  const outerCloudRef = useRef<THREE.Points>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const innerCloud = useMemo(
    () => createSphereShell(Math.max(420, Math.floor(1300 * qualityFactor)), 0.75, 1.9),
    [qualityFactor],
  );
  const outerCloud = useMemo(
    () => createSphereShell(Math.max(260, Math.floor(900 * qualityFactor)), 1.8, 3.8),
    [qualityFactor],
  );

  useFrame(({ clock }) => {
    const intensity = clamp01(weight);
    if (!groupRef.current) return;

    const elapsed = clock.elapsedTime;
    const rotationScale = reducedMotion ? 0.06 : 0.19;
    const wobble = reducedMotion ? 0.04 : 0.11;

    groupRef.current.rotation.y = elapsed * rotationScale;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.32) * wobble + pointer.y * 0.16 * intensity;
    groupRef.current.position.x = pointer.x * 0.28 * intensity;
    groupRef.current.position.y = pointer.y * 0.2 * intensity;

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.18 + intensity * 0.58;
      material.emissiveIntensity = 0.3 + intensity * 0.75;
      coreRef.current.scale.setScalar(0.94 + intensity * 0.2);
    }

    if (innerCloudRef.current?.material instanceof THREE.PointsMaterial) {
      innerCloudRef.current.rotation.y = elapsed * 0.22;
      innerCloudRef.current.rotation.x = elapsed * 0.09;
      innerCloudRef.current.material.opacity = 0.12 + intensity * 0.64;
      innerCloudRef.current.material.size = 0.014 + intensity * 0.02;
    }

    if (outerCloudRef.current?.material instanceof THREE.PointsMaterial) {
      outerCloudRef.current.rotation.y = -elapsed * 0.14;
      outerCloudRef.current.rotation.x = elapsed * 0.06;
      outerCloudRef.current.material.opacity = 0.08 + intensity * 0.48;
      outerCloudRef.current.material.size = 0.008 + intensity * 0.012;
    }

    if (ringARef.current) {
      ringARef.current.rotation.z = elapsed * (reducedMotion ? 0.08 : 0.24);
      (ringARef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + intensity * 0.43;
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.y = elapsed * (reducedMotion ? 0.05 : 0.16);
      ringBRef.current.rotation.x = elapsed * 0.07;
      (ringBRef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + intensity * 0.38;
    }
  });

  return (
    <group ref={groupRef} visible={weight > 0.004}>
      <mesh ref={coreRef} scale={1.08}>
        <sphereGeometry args={[0.72, 64, 64]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          roughness={0.24}
          metalness={0.08}
          transparent
          opacity={0.52}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.74, 1.2, 160]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.18 + weight * 0.26} />
      </mesh>

      <mesh ref={ringARef} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.42, 0.016, 20, 180]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.36} />
      </mesh>

      <mesh ref={ringBRef} rotation={[Math.PI / 3.2, 0, Math.PI / 4]}>
        <torusGeometry args={[2.2, 0.008, 14, 180]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.24} />
      </mesh>

      <points ref={innerCloudRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={innerCloud} itemSize={3} count={innerCloud.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color="#dbeafe"
          size={0.02}
          transparent
          opacity={0.58}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={outerCloudRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={outerCloud} itemSize={3} count={outerCloud.length / 3} />
        </bufferGeometry>
        <pointsMaterial
          color="#99f6e4"
          size={0.012}
          transparent
          opacity={0.38}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <pointLight
        color="#67e8f9"
        intensity={0.64 + weight * 1.2}
        distance={7.6}
        position={[0.2, 0.24, 1.34]}
      />

      <mesh position={[0, 0, -2.8]}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial
          transparent
          opacity={0.16 * clamp01(weight)}
          color={new THREE.Color().setHSL(0.58 + globalProgress * 0.05, 0.52, 0.42)}
        />
      </mesh>
    </group>
  );
};

export default UniqueQuestionScene;
