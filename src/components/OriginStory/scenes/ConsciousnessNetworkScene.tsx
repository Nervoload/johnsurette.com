import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";

type NodeDef = {
  position: [number, number, number];
  phase: number;
};

type LinkDef = {
  from: number;
  to: number;
  phase: number;
};

const ConsciousnessNetworkScene: React.FC<OriginSceneComponentProps> = ({
  weight,
  localProgress,
  pointer,
  reducedMotion,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const foregroundRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const signalRefs = useRef<Array<THREE.Mesh | null>>([]);

  const nodes = useMemo<NodeDef[]>(() => {
    return Array.from({ length: 30 }, (_, idx) => ({
      position: [
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 2.4,
        (Math.random() - 0.5) * 1.8,
      ],
      phase: idx * 0.27,
    }));
  }, []);

  const links = useMemo<LinkDef[]>(() => {
    const output: LinkDef[] = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i].position;
        const b = nodes[j].position;
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.12) {
          output.push({ from: i, to: j, phase: output.length * 0.31 });
        }
      }
    }
    return output.slice(0, 62);
  }, [nodes]);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;
    const elapsed = clock.elapsedTime;
    const intensity = clamp01(weight);
    const emergence = smoothStep(localProgress);
    const rotationScale = reducedMotion ? 0.05 : 0.16;

    rootRef.current.rotation.y = pointer.x * 0.18 * intensity + elapsed * rotationScale;
    rootRef.current.rotation.x = pointer.y * 0.1 * intensity;
    rootRef.current.position.y = Math.sin(elapsed * 0.5) * 0.05 * emergence;

    if (foregroundRef.current) {
      foregroundRef.current.position.z = 0.08 + Math.sin(elapsed * 0.9) * 0.04;
    }

    nodeRefs.current.forEach((node, idx) => {
      if (!node) return;
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.2 + nodes[idx].phase);
      const material = node.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = (0.24 + pulse * 0.82) * intensity;
      material.opacity = 0.2 + emergence * 0.78;
    });

    signalRefs.current.forEach((signal, idx) => {
      if (!signal) return;
      const link = links[idx % links.length];
      const from = nodes[link.from].position;
      const to = nodes[link.to].position;
      const travel = (Math.sin(elapsed * (0.8 + (idx % 7) * 0.12) + link.phase) + 1) * 0.5;
      signal.position.set(
        from[0] + (to[0] - from[0]) * travel,
        from[1] + (to[1] - from[1]) * travel,
        from[2] + (to[2] - from[2]) * travel,
      );
      signal.visible = emergence > 0.1;
      const mat = signal.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + intensity * 0.72;
    });
  });

  const lineAlpha = 0.08 + smoothStep((localProgress - 0.08) / 0.5) * 0.64 * clamp01(weight);
  const nodeScale = 0.04 + smoothStep((localProgress - 0.14) / 0.44) * 0.09;

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <group>
        {links.map((link, idx) => (
          <Line
            key={`network-link-${idx}`}
            points={[nodes[link.from].position, nodes[link.to].position]}
            color={idx % 2 === 0 ? "#67e8f9" : "#c4b5fd"}
            lineWidth={1}
            transparent
            opacity={lineAlpha}
          />
        ))}
      </group>

      <group ref={foregroundRef}>
        {nodes.map((node, idx) => (
          <mesh
            key={`network-node-${idx}`}
            ref={(element) => {
              nodeRefs.current[idx] = element;
            }}
            position={node.position}
            scale={nodeScale}
          >
            <sphereGeometry args={[1, 14, 14]} />
            <meshStandardMaterial
              color={idx % 3 === 0 ? "#a5f3fc" : idx % 3 === 1 ? "#d8b4fe" : "#bfdbfe"}
              emissive={idx % 2 === 0 ? "#22d3ee" : "#a78bfa"}
              emissiveIntensity={0.38}
              transparent
              opacity={0.82}
            />
          </mesh>
        ))}

        {links.slice(0, 24).map((link, idx) => (
          <mesh
            key={`signal-${idx}`}
            ref={(element) => {
              signalRefs.current[idx] = element;
            }}
            position={nodes[link.from].position}
            scale={0.024}
          >
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color="#f0f9ff" transparent opacity={0.64} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default ConsciousnessNetworkScene;
