import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { StorySceneQualityTier } from "../../runtime/LandingStoryRuntime";

const TAU = Math.PI * 2;
const LOOP_DURATION = 24;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const smoothstep = (start: number, end: number, value: number) => {
  const x = clamp01((value - start) / (end - start));
  return x * x * (3 - 2 * x);
};

const createCurvePoints = (start: THREE.Vector3, end: THREE.Vector3, curvature = 0.22, lift = 0.06) => {
  const midX = (start.x + end.x) / 2;
  const bend = new THREE.Vector3(midX, mix(start.y, end.y, 0.5) + lift, mix(start.z, end.z, 0.5));
  bend.x += (start.y < end.y ? -1 : 1) * curvature;
  return [start, bend, end];
};

const getPhaseWeight = (
  loop: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number
) => smoothstep(fadeInStart, fadeInEnd, loop) * (1 - smoothstep(fadeOutStart, fadeOutEnd, loop));

const applyPhaseOpacity = (group: THREE.Group, weight: number) => {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || child.userData.phaseSurface !== true) {
      return;
    }

    const material = child.material;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((entry) => {
      if ("transparent" in entry) {
        entry.transparent = true;
      }
      if ("opacity" in entry) {
        const baseOpacity =
          ((entry as THREE.Material & { userData?: { baseOpacity?: number } }).userData?.baseOpacity ?? entry.opacity);
        entry.userData = { ...entry.userData, baseOpacity };
        entry.opacity = baseOpacity * weight;
      }
    });
  });
};

interface AnimatedOrbProps {
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: string;
  phaseOffset: number;
  phaseStart: number;
  phaseEnd: number;
  pulseSpeed: number;
  intensity: number;
  visibleWindow: [number, number];
  qualityTier: StorySceneQualityTier;
  wireframe?: boolean;
}

const AnimatedOrb: React.FC<AnimatedOrbProps> = ({
  position,
  radius,
  color,
  emissive,
  phaseOffset,
  phaseStart,
  phaseEnd,
  pulseSpeed,
  intensity,
  visibleWindow,
  qualityTier,
  wireframe = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const loop = (time % LOOP_DURATION) / LOOP_DURATION;
    const windowWeight = smoothstep(visibleWindow[0], visibleWindow[1], loop) *
      (1 - smoothstep(phaseEnd, phaseEnd + 0.08, loop));
    const spawnWeight = smoothstep(phaseStart + phaseOffset, phaseStart + phaseOffset + 0.12, loop);
    const activeWeight = windowWeight * spawnWeight;
    const pulse = 0.72 + 0.28 * Math.sin(time * pulseSpeed + phaseOffset * TAU);

    if (meshRef.current) {
      const scale = radius * (0.34 + activeWeight * 0.72 + pulse * 0.05);
      meshRef.current.scale.setScalar(scale);
      meshRef.current.rotation.y += 0.008 + intensity * 0.002;
      meshRef.current.rotation.x += 0.004;
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.12 + activeWeight * 0.86;
      materialRef.current.emissiveIntensity = 0.35 + activeWeight * 0.74 + pulse * 0.18;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, qualityTier === "high" ? 24 : 14, qualityTier === "high" ? 18 : 12]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={emissive}
        emissiveIntensity={0.48}
        roughness={0.24}
        metalness={0.05}
        transparent
        opacity={0.84}
        depthWrite={false}
        wireframe={wireframe}
      />
    </mesh>
  );
};

interface AnimatedLineProps {
  points: THREE.Vector3[];
  color: string;
  phaseOffset: number;
  phaseStart: number;
  phaseEnd: number;
  pulseSpeed: number;
  opacity: number;
  lineWidth: number;
  visibleWindow: [number, number];
}

const AnimatedLine: React.FC<AnimatedLineProps> = ({
  points,
  color,
  phaseOffset,
  phaseStart,
  phaseEnd,
  pulseSpeed,
  opacity,
  lineWidth,
  visibleWindow,
}) => {
  const lineRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const loop = (time % LOOP_DURATION) / LOOP_DURATION;
    const windowWeight = smoothstep(visibleWindow[0], visibleWindow[1], loop) *
      (1 - smoothstep(phaseEnd, phaseEnd + 0.08, loop));
    const pulse = 0.5 + 0.5 * Math.sin(time * pulseSpeed + phaseOffset * TAU);
    const activeOpacity = windowWeight * (opacity * (0.42 + pulse * 0.58));

    if (lineRef.current?.material) {
      lineRef.current.material.opacity = activeOpacity;
      lineRef.current.material.transparent = true;
      lineRef.current.material.depthWrite = false;
      lineRef.current.material.color = new THREE.Color(color);
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      transparent
      opacity={opacity}
      lineWidth={lineWidth}
    />
  );
};

const SmallMlpPhase: React.FC<{ qualityTier: StorySceneQualityTier }> = ({ qualityTier }) => {
  const nodeCounts = qualityTier === "high" ? [1, 3, 5, 4, 1] : [1, 3, 4, 3, 1];
  const xPositions = [-2.72, -1.38, 0, 1.42, 2.82];
  const smallNodeRadius = qualityTier === "high" ? 0.14 : 0.12;
  const layerHeights = [0, 0.96, -0.58, 0.52, 0];

  const nodeData = useMemo(() => {
    return nodeCounts.flatMap((count, layerIndex) => {
      const ySpan = layerIndex === 0 || layerIndex === nodeCounts.length - 1 ? 0 : 1.1;
      return Array.from({ length: count }, (_, nodeIndex) => {
        const y = count === 1 ? 0 : mix(-ySpan, ySpan, nodeIndex / (count - 1));
        const z = layerIndex * -0.34 + (nodeIndex % 2 === 0 ? 0.08 : -0.08);
        return {
          position: new THREE.Vector3(xPositions[layerIndex], y + layerHeights[layerIndex] * 0.08, z),
          phaseOffset: layerIndex * 0.11 + nodeIndex * 0.025,
          layerIndex,
        };
      });
    });
  }, [qualityTier]);

  const edgeData = useMemo(() => {
    const edges: Array<{ points: THREE.Vector3[]; phaseOffset: number; fromLayer: number }> = [];

    for (let layerIndex = 0; layerIndex < nodeCounts.length - 1; layerIndex += 1) {
      const fromCount = nodeCounts[layerIndex];
      const toCount = nodeCounts[layerIndex + 1];

      for (let fromIndex = 0; fromIndex < fromCount; fromIndex += 1) {
        for (let toIndex = 0; toIndex < toCount; toIndex += 1) {
          const fromY = fromCount === 1 ? 0 : mix(-1.06, 1.06, fromIndex / (fromCount - 1));
          const toY = toCount === 1 ? 0 : mix(-1.06, 1.06, toIndex / (toCount - 1));
          const start = new THREE.Vector3(xPositions[layerIndex], fromY + layerHeights[layerIndex] * 0.06, layerIndex * -0.34);
          const end = new THREE.Vector3(xPositions[layerIndex + 1], toY + layerHeights[layerIndex + 1] * 0.06, (layerIndex + 1) * -0.34);
          edges.push({
            points: createCurvePoints(start, end, 0.16 + layerIndex * 0.03, 0.1 + (fromIndex + toIndex) * 0.01),
            phaseOffset: layerIndex * 0.17 + fromIndex * 0.03 + toIndex * 0.02,
            fromLayer: layerIndex,
          });
        }
      }
    }

    return edges;
  }, [qualityTier]);

  return (
    <group position={[0.06, 0.02, 0.05]}>
      <mesh position={[0, 0, -0.72]} scale={[4.2, 2.6, 0.1]} userData={{ phaseSurface: true }}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.16} />
      </mesh>

      {edgeData.map((edge, index) => (
        <AnimatedLine
          key={`mlp-edge-${index}`}
          points={edge.points}
          color={index % 3 === 0 ? "#67e8f9" : index % 3 === 1 ? "#818cf8" : "#a7f3d0"}
          phaseOffset={edge.phaseOffset}
          phaseStart={0.03}
          phaseEnd={0.36}
          pulseSpeed={1.15 + edge.fromLayer * 0.12}
          opacity={0.16}
          lineWidth={qualityTier === "high" ? 1.8 : 1.2}
          visibleWindow={[0.03, 0.34]}
        />
      ))}

      {nodeData.map((node, index) => (
        <AnimatedOrb
          key={`mlp-node-${index}`}
          position={[node.position.x, node.position.y, node.position.z]}
          radius={node.layerIndex === 0 || node.layerIndex === nodeCounts.length - 1 ? smallNodeRadius * 1.18 : smallNodeRadius}
          color={node.layerIndex === 0 || node.layerIndex === nodeCounts.length - 1 ? "#f8fafc" : "#dbeafe"}
          emissive={node.layerIndex % 2 === 0 ? "#22d3ee" : "#818cf8"}
          phaseOffset={node.phaseOffset}
          phaseStart={0.04}
          phaseEnd={0.38}
          pulseSpeed={1.4}
          intensity={1}
          visibleWindow={[0.03, 0.35]}
          qualityTier={qualityTier}
        />
      ))}
    </group>
  );
};

const TransformerPhase: React.FC<{ qualityTier: StorySceneQualityTier }> = ({ qualityTier }) => {
  const shellRef = useRef<THREE.Group>(null);
  const layerCount = qualityTier === "high" ? 8 : 6;
  const layerX = useMemo(
    () => Array.from({ length: layerCount }, (_, index) => mix(-3.08, 3.08, index / (layerCount - 1))),
    [layerCount]
  );

  const connections = useMemo(() => {
    const perLink = qualityTier === "high" ? 5 : 3;
    const routes: Array<{ points: THREE.Vector3[]; phaseOffset: number; opacity: number; lineWidth: number }> = [];

    for (let index = 0; index < layerCount - 1; index += 1) {
      for (let routeIndex = 0; routeIndex < perLink; routeIndex += 1) {
        const yStart = mix(-1.18, 1.18, routeIndex / Math.max(1, perLink - 1));
        const yEnd = mix(1.08, -1.08, (routeIndex + 0.35) / perLink);
        const start = new THREE.Vector3(layerX[index], yStart, -0.24 + index * -0.05);
        const end = new THREE.Vector3(layerX[index + 1], yEnd, -0.24 + (index + 1) * -0.05);
        routes.push({
          points: createCurvePoints(start, end, 0.62 + index * 0.03, 0.18 + routeIndex * 0.022),
          phaseOffset: index * 0.13 + routeIndex * 0.041,
          opacity: 0.1 + routeIndex * 0.03,
          lineWidth: qualityTier === "high" ? 2.1 : 1.45,
        });
      }
    }

    return routes;
  }, [layerCount, layerX, qualityTier]);

  useFrame(({ clock }) => {
    const loop = (clock.elapsedTime % LOOP_DURATION) / LOOP_DURATION;
    const weight = getPhaseWeight(loop, 0.25, 0.36, 0.63, 0.73);

    if (shellRef.current) {
      shellRef.current.visible = weight > 0.01;
      const scale = 0.9 + weight * 0.14;
      shellRef.current.scale.setScalar(scale);
      shellRef.current.position.z = -0.18 + (1 - weight) * 0.46;

      applyPhaseOpacity(shellRef.current, weight);
    }
  });

  return (
    <group ref={shellRef} position={[0, 0.04, 0]}>
      <group position={[0, -0.02, -0.2]} scale={[1.02, 1.12, 1]}>
        {layerX.map((x, index) => (
          <mesh
            key={`sheet-${index}`}
            position={[x, 0, 0]}
            scale={[0.46, 2.1 - Math.sin(index * 0.7) * 0.18, 0.16]}
            userData={{ phaseSurface: true }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#0f172a" : "#111827"}
              emissive={index % 2 === 0 ? "#38bdf8" : "#818cf8"}
              emissiveIntensity={0.56}
              roughness={0.2}
              metalness={0.12}
              transparent
              opacity={0.78}
            />
          </mesh>
        ))}
      </group>

      {connections.map((connection, index) => (
        <AnimatedLine
          key={`transformer-connection-${index}`}
          points={connection.points}
          color={index % 2 === 0 ? "#67e8f9" : "#a78bfa"}
          phaseOffset={connection.phaseOffset}
          phaseStart={0.28}
          phaseEnd={0.66}
          pulseSpeed={1.22 + (index % 3) * 0.14}
          opacity={connection.opacity}
          lineWidth={connection.lineWidth}
          visibleWindow={[0.26, 0.68]}
        />
      ))}

      <group position={[0, 0, 0.56]} scale={1.08}>
        {layerX.map((x, index) => (
          <mesh key={`transformer-node-${index}`} position={[x, 0.02 * Math.sin(index), 0]} userData={{ phaseSurface: true }}>
            <sphereGeometry args={[0.08, qualityTier === "high" ? 18 : 12, qualityTier === "high" ? 18 : 12]} />
            <meshStandardMaterial
              color="#ecfeff"
              emissive={index % 2 === 0 ? "#22d3ee" : "#818cf8"}
              emissiveIntensity={0.26}
              transparent
              opacity={0.22}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const createBrainShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-2.8, -0.62);
  shape.bezierCurveTo(-3.3, -1.56, -2.08, -2.34, -0.72, -2.18);
  shape.bezierCurveTo(0.08, -2.06, 0.72, -2.48, 1.46, -2.12);
  shape.bezierCurveTo(2.3, -1.72, 2.94, -0.94, 2.98, -0.06);
  shape.bezierCurveTo(3.02, 0.92, 2.48, 1.78, 1.48, 2.08);
  shape.bezierCurveTo(0.58, 2.36, -0.14, 2.14, -0.88, 2.22);
  shape.bezierCurveTo(-2.28, 2.4, -3.42, 1.62, -3.24, 0.54);
  shape.bezierCurveTo(-3.14, -0.02, -3.02, -0.18, -2.8, -0.62);
  shape.closePath();
  return shape;
};

const BrainSlicePhase: React.FC<{ qualityTier: StorySceneQualityTier }> = ({ qualityTier }) => {
  const shellRef = useRef<THREE.Group>(null);
  const lanes = useMemo(() => {
    const count = qualityTier === "high" ? 16 : 11;
    return Array.from({ length: count }, (_, index) => ({
      x: mix(-1.94, 2.02, index / Math.max(1, count - 1)),
      phaseOffset: index * 0.08,
      width: index % 4 === 0 ? 0.032 : 0.022,
    }));
  }, [qualityTier]);

  const lanePoints = useMemo(() => {
    return lanes.map((lane, index) => {
      const points = [] as THREE.Vector3[];
      for (let step = 0; step <= 18; step += 1) {
        const y = mix(1.92, -1.92, step / 18);
        const sway = Math.sin(step * 0.54 + index * 0.7) * (0.08 + (index % 3) * 0.016);
        points.push(new THREE.Vector3(lane.x + sway, y, -0.1 + index * 0.01));
      }
      return points;
    });
  }, [lanes]);

  const pulseMarkers = useMemo(() => {
    return lanes.flatMap((lane, index) =>
      Array.from({ length: qualityTier === "high" ? 5 : 3 }, (_, pulseIndex) => ({
        x: lane.x,
        z: -0.02 + index * 0.01,
        phaseOffset: lane.phaseOffset + pulseIndex * 0.13,
        drift: pulseIndex * 0.19,
      }))
    );
  }, [lanes, qualityTier]);

  useFrame(({ clock }) => {
    const loop = (clock.elapsedTime % LOOP_DURATION) / LOOP_DURATION;
    const weight = getPhaseWeight(loop, 0.56, 0.68, 0.96, 1);

    if (shellRef.current) {
      shellRef.current.visible = weight > 0.01;
      const scale = 0.92 + weight * 0.12;
      shellRef.current.scale.setScalar(scale);
      shellRef.current.position.z = -0.28 + (1 - weight) * 0.3;

      applyPhaseOpacity(shellRef.current, weight);
    }
  });

  return (
    <group ref={shellRef} position={[0.2, -0.04, -0.02]}>
      <mesh position={[0, 0, -0.36]} scale={[1.18, 0.98, 0.46]} rotation={[0.08, 0.12, -0.04]} userData={{ phaseSurface: true }}>
        <extrudeGeometry
          args={[
            createBrainShape(),
            {
              depth: 0.26,
              bevelEnabled: false,
              curveSegments: qualityTier === "high" ? 28 : 18,
              steps: 1,
            },
          ]}
        />
        <meshStandardMaterial
          color="#081326"
          emissive="#0ea5e9"
          emissiveIntensity={0.28}
          roughness={0.26}
          metalness={0.06}
          transparent
          opacity={0.86}
        />
      </mesh>

      <mesh position={[0, 0.06, -0.16]} scale={[1.08, 0.86, 0.34]} rotation={[0.1, 0.12, -0.04]} userData={{ phaseSurface: true }}>
        <extrudeGeometry
          args={[
            createBrainShape(),
            {
              depth: 0.22,
              bevelEnabled: false,
              curveSegments: qualityTier === "high" ? 22 : 16,
              steps: 1,
            },
          ]}
        />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#22d3ee"
          emissiveIntensity={0.16}
          roughness={0.2}
          metalness={0.08}
          transparent
          opacity={0.42}
        />
      </mesh>

      {lanePoints.map((points, index) => (
        <AnimatedLine
          key={`brain-lane-${index}`}
          points={points}
          color={index % 3 === 0 ? "#67e8f9" : index % 3 === 1 ? "#86efac" : "#a78bfa"}
          phaseOffset={lanes[index].phaseOffset}
          phaseStart={0.58}
          phaseEnd={1}
          pulseSpeed={1.06 + (index % 3) * 0.11}
          opacity={0.18}
          lineWidth={lanes[index].width}
          visibleWindow={[0.55, 1]}
        />
      ))}

      {pulseMarkers.map((marker, index) => (
        <AnimatedOrb
          key={`brain-pulse-${index}`}
          position={[marker.x, 1.76 - marker.drift * 2.5, marker.z]}
          radius={qualityTier === "high" ? 0.06 : 0.05}
          color={index % 2 === 0 ? "#ecfeff" : "#dbeafe"}
          emissive={index % 2 === 0 ? "#67e8f9" : "#a78bfa"}
          phaseOffset={marker.phaseOffset}
          phaseStart={0.6}
          phaseEnd={1}
          pulseSpeed={1.8}
          intensity={0.8}
          visibleWindow={[0.58, 1]}
          qualityTier={qualityTier}
        />
      ))}
    </group>
  );
};

const ComputationalScene: React.FC<{ qualityTier: StorySceneQualityTier }> = ({ qualityTier }) => {
  const rootRef = useRef<THREE.Group>(null);
  const mlpShellRef = useRef<THREE.Group>(null);
  const ambientRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const loop = (time % LOOP_DURATION) / LOOP_DURATION;
    const mlpWeight = getPhaseWeight(loop, 0.02, 0.1, 0.32, 0.42);

    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(time * 0.1) * 0.09;
      rootRef.current.rotation.x = Math.sin(time * 0.07) * 0.045;
      rootRef.current.position.y = Math.sin(time * 0.17) * 0.05;
    }

    if (mlpShellRef.current) {
      mlpShellRef.current.visible = mlpWeight > 0.01;
      const scale = 0.94 + mlpWeight * 0.12;
      mlpShellRef.current.scale.setScalar(scale);
      mlpShellRef.current.position.z = 0.18 + (1 - mlpWeight) * 0.28;

      applyPhaseOpacity(mlpShellRef.current, mlpWeight);
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = 1.2 + Math.sin(time * 0.35) * 0.08;
    }
    if (fillRef.current) {
      fillRef.current.intensity = 1.8 + Math.sin(time * 0.5) * 0.16;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 2.2 + Math.sin(time * 0.42) * 0.24;
    }

    if (qualityTier !== "static" && rootRef.current) {
      rootRef.current.rotation.z += delta * 0.015;
    }
  });

  return (
    <>
      <color attach="background" args={["#050816"]} />
      <fog attach="fog" args={["#050816", 6, 16]} />
      <ambientLight intensity={1.08} />
      <directionalLight ref={ambientRef} position={[2.4, 4.8, 5]} intensity={1.35} color="#d9f8ff" />
      <pointLight ref={fillRef} position={[-3.2, 1.8, 2.6]} intensity={1.8} color="#67e8f9" />
      <pointLight ref={glowRef} position={[3.1, -0.8, 3.2]} intensity={2.2} color="#a78bfa" />

      <group ref={rootRef} position={[0, 0, 0]}>
        <group ref={mlpShellRef} position={[-0.05, 0, 0.18]}>
          <SmallMlpPhase qualityTier={qualityTier} />
        </group>

        <group position={[0, 0.02, -0.05]}>
          <TransformerPhase qualityTier={qualityTier} />
        </group>

        <group position={[0, 0.04, -0.22]}>
          <BrainSlicePhase qualityTier={qualityTier} />
        </group>
      </group>
    </>
  );
};

export default ComputationalScene;
