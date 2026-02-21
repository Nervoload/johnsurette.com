import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";

const HumanEyeScene: React.FC<OriginSceneComponentProps> = ({
  weight,
  localProgress,
  pointer,
  reducedMotion,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const irisRingRef = useRef<THREE.Mesh>(null);
  const upperLidRef = useRef<THREE.Mesh>(null);
  const lowerLidRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);
  const corneaHighlightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const intensity = clamp01(weight);
    const emergence = smoothStep(localProgress);
    const elapsed = clock.elapsedTime;

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.24 * intensity;
      rootRef.current.rotation.x = pointer.y * 0.16 * intensity;
    }

    if (irisRef.current) {
      irisRef.current.rotation.z = elapsed * (reducedMotion ? 0.06 : 0.18);
      const mat = irisRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + emergence * 0.66;
      mat.opacity = 0.24 + emergence * 0.68;
    }

    if (irisRingRef.current) {
      irisRingRef.current.rotation.z = -elapsed * (reducedMotion ? 0.04 : 0.14);
      const mat = irisRingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + emergence * 0.54;
    }

    const blinkWave = Math.max(0, Math.sin(elapsed * (reducedMotion ? 0.42 : 1.04)));
    const blinkAmount = Math.pow(blinkWave, 2.3) * 0.62 * intensity;
    const lidY = 0.7 - blinkAmount;

    if (upperLidRef.current) {
      upperLidRef.current.position.y = lidY;
      (upperLidRef.current.material as THREE.MeshStandardMaterial).opacity = 0.5 + intensity * 0.4;
    }

    if (lowerLidRef.current) {
      lowerLidRef.current.position.y = -lidY;
      (lowerLidRef.current.material as THREE.MeshStandardMaterial).opacity = 0.5 + intensity * 0.4;
    }

    if (pupilRef.current) {
      const dilation = 0.28 + Math.sin(elapsed * 0.92) * 0.04 + blinkAmount * 0.22;
      pupilRef.current.scale.setScalar(dilation);
    }

    if (corneaHighlightRef.current) {
      corneaHighlightRef.current.position.x = 0.26 + pointer.x * 0.06;
      corneaHighlightRef.current.position.y = 0.24 + pointer.y * 0.04;
      corneaHighlightRef.current.position.z = 1.13;
      const mat = corneaHighlightRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.2 + emergence * 0.5;
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <mesh>
        <sphereGeometry args={[1.2, 72, 72]} />
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#bae6fd"
          emissiveIntensity={0.28}
          roughness={0.22}
          metalness={0.02}
          transparent
          opacity={0.54 + smoothStep(localProgress) * 0.34}
        />
      </mesh>

      <mesh ref={irisRef} position={[0, 0, 1.04]}>
        <ringGeometry args={[0.22, 0.66, 100]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#22d3ee"
          emissiveIntensity={0.7}
          roughness={0.18}
          transparent
          opacity={0.74}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={irisRingRef} position={[0, 0, 1.05]}>
        <ringGeometry args={[0.66, 0.73, 100]} />
        <meshBasicMaterial color="#99f6e4" transparent opacity={0.48} />
      </mesh>

      <mesh ref={pupilRef} position={[0, 0, 1.09]} scale={0.3}>
        <circleGeometry args={[1, 72]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      <mesh ref={corneaHighlightRef} position={[0.24, 0.24, 1.13]}>
        <circleGeometry args={[0.12, 36]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.72} />
      </mesh>

      <mesh ref={upperLidRef} position={[0, 0.7, 0.88]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.64, 1.38]} />
        <meshStandardMaterial color="#0f172a" roughness={0.62} metalness={0.02} transparent opacity={0.82} />
      </mesh>

      <mesh ref={lowerLidRef} position={[0, -0.7, 0.88]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2.64, 1.38]} />
        <meshStandardMaterial color="#0f172a" roughness={0.62} metalness={0.02} transparent opacity={0.82} />
      </mesh>
    </group>
  );
};

export default HumanEyeScene;
