import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";
import { CardPalette, ProjectCardPopoutPreset } from "./projectData";

export interface ProjectCardPopoutPresetProps {
  preset: ProjectCardPopoutPreset;
  accent: string;
  palette: CardPalette;
  reveal: number | MotionValue<number>;
  intensity: number;
}

interface ColorSet {
  accent: THREE.Color;
  deep: THREE.Color;
  mid: THREE.Color;
  bright: THREE.Color;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const resolveReveal = (value: number | MotionValue<number>) =>
  typeof value === "number" ? value : value.get();
const nonInteractiveRaycast: THREE.Object3D["raycast"] = () => undefined;
const VISIBILITY_THRESHOLD = 0.08;

const useColorSet = (accent: string, palette: CardPalette): ColorSet =>
  useMemo(
    () => ({
      accent: new THREE.Color(accent),
      deep: new THREE.Color(palette.deep),
      mid: new THREE.Color(palette.mid),
      bright: new THREE.Color(palette.bright),
    }),
    [accent, palette.deep, palette.mid, palette.bright],
  );

const OrbitalCorePreset: React.FC<Omit<ProjectCardPopoutPresetProps, "preset">> = ({
  reveal,
  intensity,
  accent,
  palette,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const satelliteRefs = useRef<Array<THREE.Mesh | null>>([]);
  const colors = useColorSet(accent, palette);

  useFrame(({ clock }) => {
    const root = rootRef.current;
    if (!root) return;

    const r = clamp01(resolveReveal(reveal));
    const visible = r > VISIBILITY_THRESHOLD;
    root.visible = visible;
    if (!visible) return;

    const time = clock.elapsedTime;
    const scale = (0.7 + r * 0.6) * (0.9 + intensity * 0.12);

    root.scale.setScalar(scale);
    root.rotation.y = time * 0.55;
    root.rotation.x = Math.sin(time * 0.7) * 0.12;
    root.position.z = 0.1 + r * 0.5;
    root.position.y = 0.02 + Math.sin(time * 1.2) * 0.04;

    const orbitRadius = 0.44 + r * 0.26;
    satelliteRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = time * (1.8 + i * 0.22) + i * (Math.PI * 0.66);
      mesh.position.set(
        Math.cos(phase) * orbitRadius,
        Math.sin(phase * 1.08) * orbitRadius * 0.58,
        Math.sin(phase * 0.72) * 0.22,
      );
    });
  });

  return (
    <group ref={rootRef} position={[0, 0.04, 0.2]}>
      <mesh raycast={nonInteractiveRaycast}>
        <icosahedronGeometry args={[0.19, 2]} />
        <meshStandardMaterial color={colors.mid} emissive={colors.accent} emissiveIntensity={0.56} metalness={0.1} roughness={0.38} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} raycast={nonInteractiveRaycast}>
        <torusGeometry args={[0.55, 0.03, 18, 84]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.72} transparent opacity={0.88} metalness={0.05} roughness={0.42} toneMapped={false} />
      </mesh>
      {Array.from({ length: 4 }).map((_, index) => (
        <mesh
          raycast={nonInteractiveRaycast}
          key={`orbital-satellite-${index}`}
          ref={(mesh) => {
            satelliteRefs.current[index] = mesh;
          }}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={colors.bright} emissive={colors.accent} emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

const DataSpinesPreset: React.FC<Omit<ProjectCardPopoutPresetProps, "preset">> = ({
  reveal,
  intensity,
  accent,
  palette,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const spineRefs = useRef<Array<THREE.Mesh | null>>([]);
  const colors = useColorSet(accent, palette);

  const xOffsets = useMemo(() => [-0.48, -0.32, -0.16, 0, 0.16, 0.32, 0.48], []);

  useFrame(({ clock }) => {
    const root = rootRef.current;
    if (!root) return;

    const r = clamp01(resolveReveal(reveal));
    const visible = r > VISIBILITY_THRESHOLD;
    root.visible = visible;
    if (!visible) return;

    const time = clock.elapsedTime;

    root.scale.setScalar(0.7 + r * 0.52);
    root.position.z = 0.08 + r * 0.44;
    root.rotation.y = Math.sin(time * 0.82) * 0.09;
    root.rotation.x = -0.12 + Math.sin(time * 0.56) * 0.06;

    spineRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 0.28 + 0.72 * (0.5 + 0.5 * Math.sin(time * 2.8 + i * 0.66));
      const scaleY = 0.54 + pulse * (0.85 + intensity * 0.28);
      mesh.scale.y = scaleY;
      mesh.position.y = -0.08 + scaleY * 0.18;
      mesh.position.z = Math.sin(time * 1.2 + i) * 0.05;
    });
  });

  return (
    <group ref={rootRef} position={[0, -0.04, 0.14]}>
      {xOffsets.map((offset, index) => (
        <mesh
          raycast={nonInteractiveRaycast}
          key={`spine-${index}`}
          ref={(mesh) => {
            spineRefs.current[index] = mesh;
          }}
          position={[offset, 0, 0]}
        >
          <boxGeometry args={[0.09, 0.36, 0.09]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? colors.mid : colors.accent}
            emissive={colors.accent}
            emissiveIntensity={0.64}
            metalness={0.08}
            roughness={0.34}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const NodeConstellationPreset: React.FC<Omit<ProjectCardPopoutPresetProps, "preset">> = ({
  reveal,
  intensity,
  accent,
  palette,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const colors = useColorSet(accent, palette);

  const nodes = useMemo(
    () => [
      new THREE.Vector3(-0.42, 0.08, 0),
      new THREE.Vector3(-0.16, 0.28, 0.14),
      new THREE.Vector3(0.18, 0.2, -0.08),
      new THREE.Vector3(0.44, 0.04, 0.04),
      new THREE.Vector3(-0.08, -0.2, 0.1),
      new THREE.Vector3(0.28, -0.26, -0.03),
    ],
    [],
  );

  const lineGeometry = useMemo(() => {
    const connections: Array<[number, number]> = [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
      [4, 5],
      [2, 5],
      [0, 4],
    ];
    const positions = new Float32Array(connections.length * 6);

    connections.forEach(([a, b], i) => {
      positions[i * 6] = nodes[a].x;
      positions[i * 6 + 1] = nodes[a].y;
      positions[i * 6 + 2] = nodes[a].z;
      positions[i * 6 + 3] = nodes[b].x;
      positions[i * 6 + 4] = nodes[b].y;
      positions[i * 6 + 5] = nodes[b].z;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [nodes]);

  useEffect(() => {
    return () => {
      lineGeometry.dispose();
    };
  }, [lineGeometry]);

  useFrame(({ clock }) => {
    const root = rootRef.current;
    if (!root) return;

    const r = clamp01(resolveReveal(reveal));
    const visible = r > VISIBILITY_THRESHOLD;
    root.visible = visible;
    if (!visible) return;

    const time = clock.elapsedTime;
    root.scale.setScalar((0.7 + r * 0.64) * (0.95 + intensity * 0.1));
    root.rotation.y = time * 0.42;
    root.rotation.x = Math.sin(time * 0.72) * 0.08;
    root.position.z = 0.14 + r * 0.46;
    root.position.y = Math.sin(time * 1.1) * 0.03;
  });

  return (
    <group ref={rootRef} position={[0, 0, 0.2]}>
      <lineSegments geometry={lineGeometry} raycast={nonInteractiveRaycast}>
        <lineBasicMaterial color={colors.accent} transparent opacity={0.72} toneMapped={false} />
      </lineSegments>
      {nodes.map((node, index) => (
        <mesh key={`node-${index}`} position={[node.x, node.y, node.z]} raycast={nonInteractiveRaycast}>
          <sphereGeometry args={[0.06 + (index % 2) * 0.012, 16, 16]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? colors.bright : colors.mid}
            emissive={colors.accent}
            emissiveIntensity={0.74}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const RibbonArcPreset: React.FC<Omit<ProjectCardPopoutPresetProps, "preset">> = ({
  reveal,
  intensity,
  accent,
  palette,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const colors = useColorSet(accent, palette);

  useFrame(({ clock }) => {
    const root = rootRef.current;
    if (!root) return;

    const r = clamp01(resolveReveal(reveal));
    const visible = r > VISIBILITY_THRESHOLD;
    root.visible = visible;
    if (!visible) return;

    const time = clock.elapsedTime;
    root.scale.setScalar((0.72 + r * 0.58) * (0.96 + intensity * 0.08));
    root.rotation.z = Math.sin(time * 0.62) * 0.16;
    root.rotation.y = time * 0.52;
    root.position.z = 0.12 + r * 0.48;
    root.position.y = -0.03 + Math.sin(time * 1.5) * 0.04;
  });

  return (
    <group ref={rootRef} position={[0, -0.02, 0.2]}>
      <mesh raycast={nonInteractiveRaycast}>
        <torusKnotGeometry args={[0.34, 0.07, 140, 18, 2, 3]} />
        <meshStandardMaterial
          color={colors.mid}
          emissive={colors.accent}
          emissiveIntensity={0.82}
          metalness={0.22}
          roughness={0.32}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} raycast={nonInteractiveRaycast}>
        <ringGeometry args={[0.46, 0.56, 64]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.28} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const PillarArrayPreset: React.FC<Omit<ProjectCardPopoutPresetProps, "preset">> = ({
  reveal,
  intensity,
  accent,
  palette,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const pillarRefs = useRef<Array<THREE.Mesh | null>>([]);
  const colors = useColorSet(accent, palette);

  const positions = useMemo(() => {
    const out: Array<[number, number, number]> = [];
    const spacing = 0.22;
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        out.push([(x - 1) * spacing, (y - 1) * spacing * 0.78, 0]);
      }
    }
    return out;
  }, []);

  useFrame(({ clock }) => {
    const root = rootRef.current;
    if (!root) return;

    const r = clamp01(resolveReveal(reveal));
    const visible = r > VISIBILITY_THRESHOLD;
    root.visible = visible;
    if (!visible) return;

    const time = clock.elapsedTime;
    root.scale.setScalar((0.78 + r * 0.55) * (0.93 + intensity * 0.12));
    root.rotation.y = Math.sin(time * 0.72) * 0.2;
    root.position.z = 0.12 + r * 0.45;
    root.position.y = -0.02 + Math.sin(time * 1.24) * 0.03;

    pillarRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 2.4 + i * 0.44));
      const scaleY = 0.44 + pulse * (0.72 + intensity * 0.34);
      mesh.scale.y = scaleY;
      mesh.position.z = Math.sin(time * 1.1 + i * 0.22) * 0.04;
      mesh.position.y = positions[i][1] - 0.12 + scaleY * 0.12;
    });
  });

  return (
    <group ref={rootRef} position={[0, 0.04, 0.2]}>
      {positions.map(([x, y, z], i) => (
        <mesh
          raycast={nonInteractiveRaycast}
          key={`pillar-${i}`}
          ref={(mesh) => {
            pillarRefs.current[i] = mesh;
          }}
          position={[x, y, z]}
        >
          <cylinderGeometry args={[0.045, 0.045, 0.28, 14]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? colors.mid : colors.bright}
            emissive={colors.accent}
            emissiveIntensity={0.66}
            roughness={0.32}
            metalness={0.18}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const ProjectCardPopoutPresets: React.FC<ProjectCardPopoutPresetProps> = (props) => {
  switch (props.preset) {
    case "orbitalCore":
      return <OrbitalCorePreset {...props} />;
    case "dataSpines":
      return <DataSpinesPreset {...props} />;
    case "nodeConstellation":
      return <NodeConstellationPreset {...props} />;
    case "ribbonArc":
      return <RibbonArcPreset {...props} />;
    case "pillarArray":
      return <PillarArrayPreset {...props} />;
    default:
      return null;
  }
};

export default ProjectCardPopoutPresets;
