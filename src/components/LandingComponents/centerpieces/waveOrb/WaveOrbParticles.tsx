import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { clamp01, createSeededRandom, perpendicularTo, randomUnitVectorFrom, smoothStep } from "./shared";
import { WaveOrbDynamicColors, WaveOrbLoadProfile } from "./types";

interface PlasmaStream {
  anchor: THREE.Vector3;
  tangent: THREE.Vector3;
  bitangent: THREE.Vector3;
  span: number;
  height: number;
  phase: number;
  speed: number;
}

interface OrbitalGlowMote {
  anchor: THREE.Vector3;
  tangent: THREE.Vector3;
  bitangent: THREE.Vector3;
  radius: number;
  size: number;
  speed: number;
  phase: number;
}

interface WaveOrbParticlesProps {
  introProgress: number;
  hovering: boolean;
  loadProfile: WaveOrbLoadProfile;
  dynamicColors: WaveOrbDynamicColors;
}

const FormationSwarm: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const data = useMemo(() => {
    const count = loadProfile.particles.formationCount;
    const random = createSeededRandom(loadProfile.seed ^ 0x51f15e);
    const starts = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const shellRadius = loadProfile.shell.radius;

    for (let i = 0; i < count; i++) {
      const startDirection = randomUnitVectorFrom(random);
      const targetDirection = randomUnitVectorFrom(random);

      const startRadius = shellRadius * 3.4 + random() * shellRadius * 4.3;
      const targetRadius = shellRadius * 0.72 + Math.pow(random(), 1.25) * shellRadius * 0.96;

      starts[i * 3] = startDirection.x * startRadius;
      starts[i * 3 + 1] = startDirection.y * startRadius;
      starts[i * 3 + 2] = startDirection.z * startRadius;

      targets[i * 3] = targetDirection.x * targetRadius;
      targets[i * 3 + 1] = targetDirection.y * targetRadius;
      targets[i * 3 + 2] = targetDirection.z * targetRadius;

      seeds[i] = random() * Math.PI * 2;
    }

    return {
      starts,
      targets,
      seeds,
      initial: starts.slice(),
      count,
    };
  }, [loadProfile]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const t = smoothStep(clamp01(introProgress));
    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const time = clock.elapsedTime;

    for (let i = 0; i < data.count; i++) {
      const ix = i * 3;
      const seed = data.seeds[i];
      const swirl = (1 - t) * (0.38 + 0.18 * Math.sin(time * 1.8 + seed));

      array[ix] = THREE.MathUtils.lerp(data.starts[ix], data.targets[ix], t) + Math.cos(time * 2.1 + seed) * swirl;
      array[ix + 1] =
        THREE.MathUtils.lerp(data.starts[ix + 1], data.targets[ix + 1], t) +
        Math.sin(time * 1.7 + seed * 1.3) * swirl;
      array[ix + 2] =
        THREE.MathUtils.lerp(data.starts[ix + 2], data.targets[ix + 2], t) +
        Math.cos(time * 2.3 + seed * 0.7) * swirl;
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0, 0.9 - t * 1.18);
      materialRef.current.size = 0.028 + (1 - t) * 0.028;
      materialRef.current.color.copy(t < 0.55 ? dynamicColors.shellPalette.accentColor : dynamicColors.shellPalette.glowColor);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={dynamicColors.shellPalette.accentHex}
        size={0.048}
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const OrbitalGlowMotes: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  hovering,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const data = useMemo(() => {
    const count = Math.max(28, Math.round(loadProfile.particles.sparkleCount * 0.34));
    const random = createSeededRandom(loadProfile.seed ^ 0x12ac8e);
    const shellRadius = loadProfile.shell.radius;
    const motes: OrbitalGlowMote[] = [];
    const initial = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const anchor = randomUnitVectorFrom(random);
      const tangent = perpendicularTo(anchor);
      const bitangent = new THREE.Vector3().crossVectors(anchor, tangent).normalize();
      const radius = shellRadius * (1.02 + random() * 0.22);
      const size = 0.75 + random() * 1.2;
      const speed = 0.24 + random() * 0.42;
      const phase = random() * Math.PI * 2;

      motes.push({ anchor, tangent, bitangent, radius, size, speed, phase });
      initial[i * 3] = anchor.x * radius;
      initial[i * 3 + 1] = anchor.y * radius;
      initial[i * 3 + 2] = anchor.z * radius;
    }

    return { motes, count, initial };
  }, [loadProfile]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const time = clock.elapsedTime;
    const intro = smoothStep(clamp01(introProgress));
    const interaction = dynamicColors.interactionAmount;

    for (let i = 0; i < data.count; i++) {
      const mote = data.motes[i];
      const orbit = time * mote.speed + mote.phase;
      const swayA = Math.sin(orbit) * mote.size * 0.08;
      const swayB = Math.cos(orbit * 1.4) * mote.size * 0.06;
      const radius = mote.radius + Math.sin(orbit * 1.7) * 0.03 + interaction * 0.03;
      const base = mote.anchor.clone().multiplyScalar(radius);
      base
        .addScaledVector(mote.tangent, swayA)
        .addScaledVector(mote.bitangent, swayB);

      array[i * 3] = base.x;
      array[i * 3 + 1] = base.y;
      array[i * 3 + 2] = base.z;
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = (0.22 + intro * 0.42) * (hovering ? 1.15 : 1) * (0.9 + interaction * 0.18);
      materialRef.current.size = 0.034 + interaction * 0.006;
      materialRef.current.color.copy(dynamicColors.highlightTone).lerp(dynamicColors.shellPalette.glowColor, 0.42);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={6}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={dynamicColors.shellPalette.glowHex}
        size={0.034}
        transparent
        opacity={0.42}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const CoronaDust: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  hovering,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const data = useMemo(() => {
    const count = loadProfile.particles.coronaCount;
    const random = createSeededRandom(loadProfile.seed ^ 0x26bf13);
    const directions = new Float32Array(count * 3);
    const bases = new Float32Array(count);
    const seeds = new Float32Array(count);
    const initial = new Float32Array(count * 3);
    const shellRadius = loadProfile.shell.radius;

    for (let i = 0; i < count; i++) {
      const direction = randomUnitVectorFrom(random);
      const radius = shellRadius * (1.02 + Math.pow(random(), 1.5) * 0.72);

      directions[i * 3] = direction.x;
      directions[i * 3 + 1] = direction.y;
      directions[i * 3 + 2] = direction.z;

      bases[i] = radius;
      seeds[i] = random() * Math.PI * 2;

      initial[i * 3] = direction.x * radius;
      initial[i * 3 + 1] = direction.y * radius;
      initial[i * 3 + 2] = direction.z * radius;
    }

    return { directions, bases, seeds, initial, count };
  }, [loadProfile]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const time = clock.elapsedTime;
    const interactionBoost = dynamicColors.interactionAmount * 0.06;

    for (let i = 0; i < data.count; i++) {
      const ix = i * 3;
      const seed = data.seeds[i];
      const pulse = 0.06 * Math.sin(time * 2.3 + seed) + 0.04 * Math.sin(time * 4.9 + seed * 0.6);
      const introLift = (1 - introProgress) * 0.36;
      const radius = data.bases[i] + pulse + introLift + interactionBoost;

      array[ix] = data.directions[ix] * radius;
      array[ix + 1] = data.directions[ix + 1] * radius;
      array[ix + 2] = data.directions[ix + 2] * radius;
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = (hovering ? 0.7 : 0.56) * (0.5 + introProgress * 0.5);
      materialRef.current.size = hovering ? 0.03 : 0.024;
      materialRef.current.color.copy(dynamicColors.shellPalette.glowColor);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={3}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={dynamicColors.shellPalette.glowHex}
        size={0.024}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const PlasmaStreams: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  hovering,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const data = useMemo(() => {
    const streamCount = loadProfile.particles.streamCount;
    const trailLength = loadProfile.particles.streamTrailLength;
    const random = createSeededRandom(loadProfile.seed ^ 0x79a6c4);
    const streams: PlasmaStream[] = [];
    const initial = new Float32Array(streamCount * trailLength * 3);

    for (let i = 0; i < streamCount; i++) {
      const anchor = randomUnitVectorFrom(random);
      const tangent = perpendicularTo(anchor);
      const bitangent = new THREE.Vector3().crossVectors(anchor, tangent).normalize();

      streams.push({
        anchor,
        tangent,
        bitangent,
        span: 0.68 + random() * 0.84,
        height: 0.14 + random() * 0.64,
        phase: random() * Math.PI * 2,
        speed: 0.14 + random() * 0.44,
      });
    }

    return {
      streams,
      streamCount,
      trailLength,
      initial,
      count: streamCount * trailLength,
    };
  }, [loadProfile]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const time = clock.elapsedTime;
    const shellRadius = loadProfile.shell.radius;

    let cursor = 0;
    for (let i = 0; i < data.streamCount; i++) {
      const stream = data.streams[i];
      const head = (time * stream.speed + stream.phase / (Math.PI * 2)) % 1;

      for (let j = 0; j < data.trailLength; j++) {
        let u = head - (j / data.trailLength) * 0.18;
        if (u < 0) u += 1;

        const along = (u - 0.5) * stream.span;
        const lift = 4 * u * (1 - u) * stream.height;
        const sway = Math.sin(u * Math.PI * 2 + time * 2.2 + stream.phase) * 0.07;

        const x = stream.anchor.x * (shellRadius * 0.98 + lift) + stream.tangent.x * along + stream.bitangent.x * sway;
        const y = stream.anchor.y * (shellRadius * 0.98 + lift) + stream.tangent.y * along + stream.bitangent.y * sway;
        const z = stream.anchor.z * (shellRadius * 0.98 + lift) + stream.tangent.z * along + stream.bitangent.z * sway;

        array[cursor] = x;
        array[cursor + 1] = y;
        array[cursor + 2] = z;
        cursor += 3;
      }
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = (hovering ? 0.92 : 0.72) * Math.max(0.2, introProgress);
      materialRef.current.size = hovering ? 0.04 : 0.032;
      materialRef.current.color.copy(hovering ? dynamicColors.shellPalette.accentColor : dynamicColors.shellPalette.baseColor);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={dynamicColors.shellPalette.baseHex}
        size={0.032}
        transparent
        opacity={0.74}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const WaveOrbParticles: React.FC<WaveOrbParticlesProps> = (props) => {
  const { loadProfile, dynamicColors } = props;

  return (
    <>
      <CoronaDust {...props} />
      <PlasmaStreams {...props} />
      <FormationSwarm {...props} />
      <OrbitalGlowMotes {...props} />
      <Sparkles
        count={loadProfile.particles.sparkleCount}
        size={2.4}
        speed={0.5 + dynamicColors.interactionAmount * 0.08}
        scale={loadProfile.particles.sparkleScale}
        color={dynamicColors.shellPalette.accentHex}
        opacity={0.45}
        noise={1.0}
      />
    </>
  );
};

export default WaveOrbParticles;
