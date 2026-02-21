import React, { useMemo, useRef } from "react";
import { Line, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";

interface Orbiter {
  radius: number;
  speed: number;
  phase: number;
  y: number;
}

const PlanetaryExpansionScene: React.FC<OriginSceneComponentProps> = ({
  weight,
  localProgress,
  pointer,
  reducedMotion,
  qualityFactor,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const orbitRefs = useRef<Array<THREE.Mesh | null>>([]);
  const satellitesRef = useRef<Array<THREE.Group | null>>([]);
  const rocketsRef = useRef<Array<THREE.Group | null>>([]);

  const orbiters = useMemo<Orbiter[]>(
    () =>
      Array.from({ length: 6 }, (_, idx) => ({
        radius: 1.08 + idx * 0.26,
        speed: 0.14 + idx * 0.04,
        phase: idx * (Math.PI / 3.4),
        y: (idx - 2.5) * 0.1,
      })),
    [],
  );

  const dust = useMemo(() => {
    const count = Math.max(120, Math.floor(280 * qualityFactor));
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 8.4,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 3.4,
      size: 0.005 + Math.random() * 0.01,
    }));
  }, [qualityFactor]);

  useFrame(({ clock }) => {
    const intensity = clamp01(weight);
    const emergence = smoothStep(localProgress);
    const elapsed = clock.elapsedTime;

    if (rootRef.current) {
      rootRef.current.rotation.y = pointer.x * 0.18 * intensity + elapsed * 0.018;
      rootRef.current.rotation.x = pointer.y * 0.08 * intensity;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += reducedMotion ? 0.0008 : 0.0018;
      const mat = planetRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.24 + emergence * 0.74;
      mat.opacity = 0.42 + emergence * 0.52;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(1.08 + Math.sin(elapsed * 0.5) * 0.02);
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 + emergence * 0.24;
    }

    orbiters.forEach((orbiter, idx) => {
      const satellite = satellitesRef.current[idx];
      if (!satellite) return;
      const angle = elapsed * orbiter.speed + orbiter.phase;
      satellite.position.x = Math.cos(angle) * orbiter.radius;
      satellite.position.z = Math.sin(angle) * orbiter.radius;
      satellite.position.y = orbiter.y + Math.sin(elapsed * 0.9 + idx) * 0.03;
      satellite.rotation.y = angle + Math.PI / 2;
      satellite.visible = intensity > 0.02;

      const ring = orbitRefs.current[idx];
      if (ring) {
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.08 + intensity * 0.26;
      }
    });

    rocketsRef.current.forEach((rocket, idx) => {
      if (!rocket) return;
      const launchPhase = (elapsed * (0.48 + idx * 0.16) + idx) % (Math.PI * 2);
      rocket.position.x = -1.5 + idx * 1.0;
      rocket.position.y = -1 + Math.abs(Math.sin(launchPhase)) * 1.64;
      rocket.position.z = -0.9 + idx * 0.42;
      rocket.visible = emergence > 0.2;
    });
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[0.88, 84, 84]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#0891b2"
          roughness={0.32}
          metalness={0.08}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[0.97, 64, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.32} />
      </mesh>

      {orbiters.map((orbiter, idx) => (
        <mesh
          key={`orbit-${idx}`}
          ref={(element) => {
            orbitRefs.current[idx] = element;
          }}
          rotation={[Math.PI / 2 + idx * 0.08, idx * 0.2, 0]}
        >
          <torusGeometry args={[orbiter.radius, 0.007, 12, 180]} />
          <meshBasicMaterial color={idx % 2 === 0 ? "#67e8f9" : "#a78bfa"} transparent opacity={0.2} />
        </mesh>
      ))}

      {orbiters.map((_, idx) => (
        <group
          key={`satellite-${idx}`}
          ref={(element) => {
            satellitesRef.current[idx] = element;
          }}
        >
          <mesh scale={[0.14, 0.06, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#bae6fd" emissive="#67e8f9" emissiveIntensity={0.48} />
          </mesh>
          <mesh scale={[0.04, 0.3, 0.03]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#a5b4fc" emissive="#818cf8" emissiveIntensity={0.42} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 3 }).map((_, idx) => (
        <group
          key={`rocket-${idx}`}
          ref={(element) => {
            rocketsRef.current[idx] = element;
          }}
        >
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.075, 0.24, 16]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f0abfc" emissiveIntensity={0.28} />
          </mesh>
          <Line
            points={[
              [0, -0.1, 0],
              [0, -0.62, 0],
            ]}
            color="#fef08a"
            lineWidth={1}
            transparent
            opacity={0.4}
          />
        </group>
      ))}

      {dust.map((particle, idx) => (
        <mesh key={`planet-dust-${idx}`} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={idx % 2 === 0 ? "#bae6fd" : "#d8b4fe"} transparent opacity={0.2 + weight * 0.42} />
        </mesh>
      ))}

      <Text
        position={[0, -1.4, 0]}
        fontSize={0.16}
        anchorX="center"
        anchorY="middle"
        color="#a5f3fc"
        fillOpacity={0.2 + smoothStep(localProgress) * 0.78 * clamp01(weight)}
      >
        Satellites · Stations · Launches
      </Text>
    </group>
  );
};

export default PlanetaryExpansionScene;
