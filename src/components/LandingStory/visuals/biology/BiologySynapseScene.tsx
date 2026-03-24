import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type BiologyQualityTier = "high" | "low" | "static";

interface BiologySynapseSceneProps {
  active: boolean;
  qualityTier: BiologyQualityTier;
}

interface VesicleSeed {
  phase: number;
  angle: number;
  radius: number;
  depth: number;
  drift: number;
  scale: number;
}

interface ReceptorSeed {
  x: number;
  y: number;
  z: number;
  phase: number;
}

interface ParticleSeed {
  phase: number;
  speed: number;
  target: number;
  arc: number;
}

const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const smoothstep = (start: number, end: number, value: number) => {
  if (start === end) return value >= end ? 1 : 0;
  const amount = clamp((value - start) / (end - start), 0, 1);
  return amount * amount * (3 - 2 * amount);
};

const fract = (value: number) => value - Math.floor(value);

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

const pseudoRandom = (seed: number) => fract(Math.sin(seed * 12.9898 + 78.233) * 43758.5453);

const bezierPoint = (start: THREE.Vector3, c1: THREE.Vector3, c2: THREE.Vector3, end: THREE.Vector3, amount: number) => {
  const inv = 1 - amount;
  return new THREE.Vector3(
    inv * inv * inv * start.x + 3 * inv * inv * amount * c1.x + 3 * inv * amount * amount * c2.x + amount * amount * amount * end.x,
    inv * inv * inv * start.y + 3 * inv * inv * amount * c1.y + 3 * inv * amount * amount * c2.y + amount * amount * amount * end.y,
    inv * inv * inv * start.z + 3 * inv * inv * amount * c1.z + 3 * inv * amount * amount * c2.z + amount * amount * amount * end.z,
  );
};

const buildTerminalProfile = (variant: "pre" | "post") => {
  if (variant === "pre") {
    return [
      new THREE.Vector2(0.14, 1.02),
      new THREE.Vector2(0.28, 0.9),
      new THREE.Vector2(0.48, 0.62),
      new THREE.Vector2(0.62, 0.24),
      new THREE.Vector2(0.73, -0.2),
      new THREE.Vector2(0.84, -0.58),
      new THREE.Vector2(0.72, -0.92),
      new THREE.Vector2(0.48, -1.08),
      new THREE.Vector2(0.22, -1.14),
      new THREE.Vector2(0.06, -1.18),
    ];
  }

  return [
    new THREE.Vector2(0.12, 1.0),
    new THREE.Vector2(0.34, 0.9),
    new THREE.Vector2(0.62, 0.62),
    new THREE.Vector2(0.8, 0.24),
    new THREE.Vector2(0.88, -0.1),
    new THREE.Vector2(0.82, -0.4),
    new THREE.Vector2(0.66, -0.72),
    new THREE.Vector2(0.4, -0.96),
    new THREE.Vector2(0.18, -1.08),
  ];
};

const makeVesicleSeeds = (count: number): VesicleSeed[] =>
  Array.from({ length: count }, (_, index) => {
    const a = pseudoRandom(index + 11);
    const b = pseudoRandom(index + 23);
    const c = pseudoRandom(index + 41);
    const d = pseudoRandom(index + 59);

    return {
      phase: pseudoRandom(index + 7),
      angle: a * TAU,
      radius: 0.2 + b * 0.45,
      depth: -0.2 + c * 0.55,
      drift: 0.62 + d * 0.6,
      scale: 0.14 + pseudoRandom(index + 83) * 0.08,
    };
  });

const makeReceptorSeeds = (count: number): ReceptorSeed[] =>
  Array.from({ length: count }, (_, index) => {
    const ratio = count > 1 ? index / (count - 1) : 0.5;
    const arch = Math.sin(ratio * Math.PI);
    const twist = pseudoRandom(index + 19) - 0.5;

    return {
      x: lerp(-1.34, 1.34, ratio),
      y: -0.58 + arch * 0.16,
      z: twist * 0.48,
      phase: pseudoRandom(index + 29),
    };
  });

const makeParticleSeeds = (count: number, receptorCount: number): ParticleSeed[] =>
  Array.from({ length: count }, (_, index) => ({
    phase: pseudoRandom(index + 101),
    speed: 0.16 + pseudoRandom(index + 131) * 0.2,
    target: index % receptorCount,
    arc: 0.12 + pseudoRandom(index + 151) * 0.22,
  }));

const BiologySynapseScene: React.FC<BiologySynapseSceneProps> = ({ active, qualityTier }) => {
  const invalidate = useThree((state) => state.invalidate);
  const rootRef = useRef<THREE.Group>(null);
  const preRef = useRef<THREE.Mesh>(null);
  const postRef = useRef<THREE.Mesh>(null);
  const cleftRef = useRef<THREE.Mesh>(null);
  const stemRef = useRef<THREE.Mesh>(null);
  const supportVesiclesRef = useRef<THREE.InstancedMesh>(null);
  const receptorsRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const heroVesicleRef = useRef<THREE.Mesh>(null);
  const heroLightRef = useRef<THREE.PointLight>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const config = useMemo(() => {
    if (qualityTier === "static") {
      return { supportVesicles: 6, receptors: 20, particles: 0, receptorPulse: 0.7 };
    }

    if (qualityTier === "low") {
      return { supportVesicles: 8, receptors: 28, particles: 42, receptorPulse: 0.85 };
    }

    return { supportVesicles: 12, receptors: 40, particles: 72, receptorPulse: 1 };
  }, [qualityTier]);

  const supportVesicleSeeds = useMemo(() => makeVesicleSeeds(config.supportVesicles), [config.supportVesicles]);
  const receptorSeeds = useMemo(() => makeReceptorSeeds(config.receptors), [config.receptors]);
  const particleSeeds = useMemo(() => makeParticleSeeds(config.particles, Math.max(config.receptors, 1)), [config.particles, config.receptors]);

  const preGeometry = useMemo(() => {
    const geometry = new THREE.LatheGeometry(buildTerminalProfile("pre"), qualityTier === "high" ? 52 : 38);
    geometry.scale(1.18, 1.12, 1.18);
    return geometry;
  }, [qualityTier]);

  const postGeometry = useMemo(() => {
    const geometry = new THREE.LatheGeometry(buildTerminalProfile("post"), qualityTier === "high" ? 48 : 34);
    geometry.scale(1.2, 1.05, 1.2);
    return geometry;
  }, [qualityTier]);

  const vesicleGeometry = useMemo(() => new THREE.SphereGeometry(0.16, qualityTier === "high" ? 22 : 14, qualityTier === "high" ? 18 : 12), [qualityTier]);
  const receptorGeometry = useMemo(() => new THREE.CylinderGeometry(0.05, 0.08, 0.34, qualityTier === "high" ? 10 : 8), [qualityTier]);
  const particleGeometry = useMemo(() => new THREE.SphereGeometry(0.045, 8, 8), []);
  const cleftGeometry = useMemo(() => new THREE.TorusGeometry(1.28, 0.12, qualityTier === "high" ? 12 : 8, qualityTier === "high" ? 48 : 28), [qualityTier]);
  const stemGeometry = useMemo(() => new THREE.CylinderGeometry(0.26, 0.18, 1.05, qualityTier === "high" ? 14 : 10), [qualityTier]);

  useEffect(() => {
    return () => {
      preGeometry.dispose();
      postGeometry.dispose();
      vesicleGeometry.dispose();
      receptorGeometry.dispose();
      particleGeometry.dispose();
      cleftGeometry.dispose();
      stemGeometry.dispose();
    };
  }, [cleftGeometry, particleGeometry, postGeometry, preGeometry, receptorGeometry, stemGeometry, vesicleGeometry]);

  useEffect(() => {
    const target = rootRef.current;
    if (!target) return undefined;

    const originalRotation = target.rotation.clone();
    return () => {
      target.rotation.copy(originalRotation);
    };
  }, []);

  const releasePoint = useMemo(() => new THREE.Vector3(0.03, 0.48, 0.0), []);
  const particleStart = useMemo(() => new THREE.Vector3(), []);
  const particleC1 = useMemo(() => new THREE.Vector3(), []);
  const particleC2 = useMemo(() => new THREE.Vector3(), []);
  const particleEnd = useMemo(() => new THREE.Vector3(), []);

  const syncSceneFrame = (time: number) => {
    const root = rootRef.current;
    const pre = preRef.current;
    const post = postRef.current;
    const cleft = cleftRef.current;
    const stem = stemRef.current;
    const supportVesicles = supportVesiclesRef.current;
    const receptors = receptorsRef.current;
    const particles = particlesRef.current;
    const heroVesicle = heroVesicleRef.current;
    const heroLight = heroLightRef.current;

    const cycle = fract(time * 0.11);
    const drift = 0.5 + Math.sin(time * 0.52) * 0.5;
    const approach = smoothstep(0.08, 0.38, cycle);
    const docking = smoothstep(0.34, 0.6, cycle);
    const fusion = smoothstep(0.54, 0.74, cycle);
    const release = smoothstep(0.58, 0.9, cycle);

    if (root) {
      root.rotation.y = -0.42 + Math.sin(time * 0.18) * 0.12;
      root.rotation.x = -0.18 + Math.sin(time * 0.12) * 0.035;
      root.position.y = Math.sin(time * 0.32) * 0.04;
    }

    if (pre) {
      pre.rotation.z = -0.04 + Math.sin(time * 0.08) * 0.02;
      pre.scale.setScalar(1 + Math.sin(time * 0.16) * 0.008);
    }

    if (post) {
      post.rotation.z = 0.04 - Math.sin(time * 0.09) * 0.02;
      post.scale.setScalar(1 + Math.cos(time * 0.14) * 0.008);
    }

    if (cleft) {
      cleft.rotation.x = Math.PI / 2;
      const cleftMaterial = cleft.material as THREE.MeshBasicMaterial;
      cleftMaterial.opacity = 0.12 + fusion * 0.08;
    }

    if (stem) {
      stem.rotation.z = 0.08 + Math.sin(time * 0.1) * 0.05;
    }

    if (supportVesicles) {
      supportVesicles.count = supportVesicleSeeds.length;
      supportVesicleSeeds.forEach((seed, index) => {
        const orbit = time * (0.34 + seed.drift * 0.32) + seed.phase * TAU;
        const radial = seed.radius * (0.82 + Math.sin(time * 0.7 + seed.phase * 5.1) * 0.18);
        const x = Math.cos(seed.angle + orbit * 0.28) * radial;
        const z = Math.sin(seed.angle + orbit * 0.34) * radial * 0.82;
        const y = 0.72 + seed.depth * 0.7 + Math.sin(time * 0.64 + seed.phase * 9.2) * 0.1;
        const scale = seed.scale * (0.88 + Math.sin(time * 0.92 + seed.phase * 8.4) * 0.12);
        tempObject.position.set(x, y, z);
        tempObject.rotation.set(time * 0.2 + seed.phase * 3, orbit, time * 0.15 + index * 0.04);
        tempObject.scale.setScalar(scale);
        tempObject.updateMatrix();
        supportVesicles.setMatrixAt(index, tempObject.matrix);
      });
      supportVesicles.instanceMatrix.needsUpdate = true;
    }

    if (heroVesicle) {
      const anchor = new THREE.Vector3(-0.02, 0.9, 0.08);
      const dockingTarget = new THREE.Vector3(0.03, 0.47 + Math.sin(time * 0.32) * 0.02, 0.02);
      const fusedTarget = new THREE.Vector3(0.08, 0.38, 0.0);
      const risingArc = lerp(0, 1, easeInOutCubic(approach));
      const dockArc = lerp(0, 1, easeInOutCubic(docking));
      const fusionArc = lerp(0, 1, easeInOutCubic(fusion));
      const resetArc = lerp(0, 1, easeInOutCubic(smoothstep(0.74, 0.98, cycle)));

      const travelTarget = new THREE.Vector3().lerpVectors(anchor, dockingTarget, risingArc);
      const fusedPosition = new THREE.Vector3().lerpVectors(travelTarget, fusedTarget, dockArc);
      const resetPosition = new THREE.Vector3().lerpVectors(fusedPosition, anchor, resetArc);
      const pathPosition = new THREE.Vector3().lerpVectors(fusedPosition, resetPosition, smoothstep(0.82, 1, cycle));

      heroVesicle.position.copy(pathPosition);
      heroVesicle.position.x += Math.sin(time * 1.6 + drift * TAU) * 0.03 * (1 - fusionArc);
      heroVesicle.position.y += Math.sin(time * 1.4 + 1.4) * 0.02 * (1 - fusionArc);
      heroVesicle.position.z += Math.cos(time * 1.2 + 0.8) * 0.03 * (1 - fusionArc);

      const heroScale = lerp(0.22, 0.1, fusionArc);
      heroVesicle.scale.setScalar(heroScale * (1 + Math.sin(time * 1.1) * 0.03));
      heroVesicle.rotation.x = Math.sin(time * 0.6) * 0.15;
      heroVesicle.rotation.y = time * 1.05;
      heroVesicle.rotation.z = Math.sin(time * 0.7) * 0.16;

      if (heroLight) {
        heroLight.position.copy(heroVesicle.position);
        heroLight.position.y += 0.08;
        heroLight.intensity = 1.8 + release * 1.6;
      }
    }

    if (receptors) {
      receptors.count = receptorSeeds.length;
      receptorSeeds.forEach((seed, index) => {
        const pulse = (0.16 + fusion * 1.2 + release * 1.1) * config.receptorPulse;
        tempObject.position.set(seed.x, seed.y + Math.sin(time * 0.7 + seed.phase * TAU) * 0.02, seed.z);
        tempObject.rotation.set(Math.PI / 2 + Math.sin(time * 0.24 + seed.phase * 9) * 0.08, 0, Math.sin(time * 0.38 + seed.phase * 4.2) * 0.12);
        tempObject.scale.setScalar(0.8 + pulse * 0.24 + Math.sin(time * 1.1 + index * 0.37) * 0.04);
        tempObject.updateMatrix();
        receptors.setMatrixAt(index, tempObject.matrix);
      });
      receptors.instanceMatrix.needsUpdate = true;
    }

    if (particles) {
      particles.count = particleSeeds.length;
      particleSeeds.forEach((seed, index) => {
        const receptor = receptorSeeds[seed.target % receptorSeeds.length] ?? receptorSeeds[0];
        const progress = fract(time * seed.speed + seed.phase);
        const launch = smoothstep(0.46, 0.62, cycle) * smoothstep(0.1, 0.86, progress);
        const fadeIn = smoothstep(0.0, 0.14, progress);
        const fadeOut = 1 - smoothstep(0.82, 0.98, progress);
        const visible = launch * fadeIn * fadeOut;

        particleStart.set(heroVesicle?.position.x ?? releasePoint.x, heroVesicle?.position.y ?? releasePoint.y, heroVesicle?.position.z ?? releasePoint.z);
        particleEnd.set(receptor.x, receptor.y, receptor.z);
        particleC1.set(
          lerp(particleStart.x, particleEnd.x, 0.32) + Math.sin(seed.phase * TAU + time * 0.5) * 0.22,
          lerp(particleStart.y, particleEnd.y, 0.32) + seed.arc * 0.7,
          lerp(particleStart.z, particleEnd.z, 0.32) + Math.cos(seed.phase * TAU + time * 0.42) * 0.18,
        );
        particleC2.set(
          lerp(particleStart.x, particleEnd.x, 0.76) + Math.cos(seed.phase * TAU + time * 0.58) * 0.18,
          lerp(particleStart.y, particleEnd.y, 0.76) - seed.arc * 0.42,
          lerp(particleStart.z, particleEnd.z, 0.76) + Math.sin(seed.phase * TAU + time * 0.48) * 0.14,
        );

        const eased = easeInOutCubic(progress);
        const position = bezierPoint(particleStart, particleC1, particleC2, particleEnd, eased);
        position.x += Math.sin(time * 2.2 + seed.phase * TAU) * 0.01;
        position.y += Math.cos(time * 1.9 + seed.phase * TAU) * 0.012;
        position.z += Math.sin(time * 1.7 + seed.phase * TAU) * 0.02;

        tempObject.position.copy(position);
        tempObject.scale.setScalar((0.5 + seed.arc * 0.7) * visible * (qualityTier === "high" ? 1 : 0.9));
        tempObject.rotation.set(time * 1.1 + seed.phase * TAU, time * 0.7, time * 0.5);
        tempObject.updateMatrix();
        particles.setMatrixAt(index, tempObject.matrix);
      });
      particles.instanceMatrix.needsUpdate = true;
    }
  };

  useEffect(() => {
    syncSceneFrame(0);
    invalidate();
    // The runtime may pause animation on this scene; we still want a coherent first frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qualityTier, invalidate]);

  useFrame(({ clock }) => {
    if (!active || qualityTier === "static") return;
    syncSceneFrame(clock.getElapsedTime());
  });

  return (
    <group ref={rootRef}>
      <ambientLight intensity={1.4} />
      <hemisphereLight color="#8bdcff" groundColor="#04111f" intensity={1.1} />
      <directionalLight position={[3.8, 5.4, 6.2]} intensity={2.5} color="#d9f5ff" />
      <directionalLight position={[-4.4, -2.4, 4.6]} intensity={0.8} color="#5eead4" />
      <pointLight ref={heroLightRef} position={[0, 0.9, 0.3]} intensity={1.8} color="#7dd3fc" distance={7} decay={2} />

      <group position={[0, 1.38, 0]} rotation={[0.02, 0.06, -0.04]}>
        <mesh ref={preRef} geometry={preGeometry}>
          <meshPhysicalMaterial
            color="#073344"
            emissive="#0ea5e9"
            emissiveIntensity={0.6}
            roughness={0.28}
            metalness={0.08}
            transparent
            opacity={0.92}
            clearcoat={0.45}
            clearcoatRoughness={0.2}
          />
        </mesh>
        <mesh position={[0, 1.15, 0]} scale={[0.28, 1.1, 0.28]} geometry={stemGeometry}>
          <meshStandardMaterial color="#083344" emissive="#0f766e" emissiveIntensity={0.4} roughness={0.4} metalness={0.1} transparent opacity={0.95} />
        </mesh>
      </group>

      <group position={[0, -1.38, 0]} rotation={[0, -0.05, 0.04]}>
        <mesh ref={postRef} geometry={postGeometry}>
          <meshPhysicalMaterial
            color="#082f49"
            emissive="#0891b2"
            emissiveIntensity={0.35}
            roughness={0.34}
            metalness={0.06}
            transparent
            opacity={0.88}
            clearcoat={0.3}
            clearcoatRoughness={0.28}
          />
        </mesh>
        <mesh position={[0, -1.02, 0]} scale={[1.02, 0.22, 1.02]}>
          <sphereGeometry args={[1, qualityTier === "high" ? 36 : 24, qualityTier === "high" ? 20 : 14]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.42} roughness={0.8} metalness={0.04} />
        </mesh>
      </group>

      <mesh ref={cleftRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={cleftGeometry}>
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.14} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={stemRef} position={[0.04, 2.48, 0.02]} rotation={[0.08, 0.02, 0.12]}>
        <primitive object={stemGeometry} attach="geometry" />
        <meshPhysicalMaterial
          color="#0f766e"
          emissive="#14b8a6"
          emissiveIntensity={0.36}
          roughness={0.4}
          metalness={0.08}
          transparent
          opacity={0.84}
        />
      </mesh>

      <instancedMesh ref={supportVesiclesRef} args={[vesicleGeometry, undefined, supportVesicleSeeds.length]}>
        <meshPhysicalMaterial
          color="#e0f2fe"
          emissive="#38bdf8"
          emissiveIntensity={0.88}
          roughness={0.12}
          metalness={0.05}
          transparent
          opacity={0.96}
        />
      </instancedMesh>

      <mesh ref={heroVesicleRef} geometry={vesicleGeometry}>
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#67e8f9"
          emissiveIntensity={1.2}
          roughness={0.08}
          metalness={0.08}
          transparent
          opacity={0.98}
        />
      </mesh>

      <instancedMesh ref={receptorsRef} args={[receptorGeometry, undefined, receptorSeeds.length]}>
        <meshStandardMaterial color="#86efac" emissive="#10b981" emissiveIntensity={0.64} roughness={0.3} metalness={0.08} />
      </instancedMesh>

      <instancedMesh ref={particlesRef} args={[particleGeometry, undefined, particleSeeds.length]}>
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.94} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  );
};

export default BiologySynapseScene;
