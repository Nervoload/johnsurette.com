import React, { useEffect, useMemo, useRef } from "react";
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
  darkMode: boolean;
  loadProfile: WaveOrbLoadProfile;
  dynamicColors: WaveOrbDynamicColors;
}

interface ParticleTextureOptions {
  size?: number;
  coreScale?: number;
  haloScale?: number;
  coreAlpha?: number;
  haloAlpha?: number;
}

interface ParticleToneOptions {
  accentMixDark: number;
  accentMixLight: number;
  deepMixLight: number;
  hueShiftDark: number;
  hueShiftLight: number;
  saturationBoostDark: number;
  saturationBoostLight: number;
  lightnessShiftDark: number;
  lightnessShiftLight: number;
}

const createSquareGlowTexture = ({
  size = 128,
  coreScale = 0.16,
  haloScale = 0.48,
  coreAlpha = 1,
  haloAlpha = 0.92,
}: ParticleTextureOptions = {}): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.needsUpdate = true;
    return fallback;
  }

  const center = size / 2;
  const haloRadius = size * haloScale;
  const coreSize = size * coreScale;

  ctx.clearRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(center, center, 0, center, center, haloRadius);
  glow.addColorStop(0, `rgba(255, 255, 255, ${haloAlpha})`);
  glow.addColorStop(0.36, `rgba(255, 255, 255, ${haloAlpha * 0.72})`);
  glow.addColorStop(0.78, `rgba(255, 255, 255, ${haloAlpha * 0.2})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = `rgba(255, 255, 255, ${coreAlpha})`;
  ctx.fillRect(center - coreSize / 2, center - coreSize / 2, coreSize, coreSize);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

const createRoundGlowTexture = ({
  size = 128,
  coreScale = 0.16,
  haloScale = 0.5,
  coreAlpha = 1,
  haloAlpha = 0.9,
}: ParticleTextureOptions = {}): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.needsUpdate = true;
    return fallback;
  }

  const center = size / 2;
  const haloRadius = size * haloScale;
  const coreRadius = size * coreScale;

  ctx.clearRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(center, center, 0, center, center, haloRadius);
  glow.addColorStop(0, `rgba(255, 255, 255, ${haloAlpha})`);
  glow.addColorStop(0.42, `rgba(255, 255, 255, ${haloAlpha * 0.7})`);
  glow.addColorStop(0.82, `rgba(255, 255, 255, ${haloAlpha * 0.16})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = `rgba(255, 255, 255, ${coreAlpha})`;
  ctx.beginPath();
  ctx.arc(center, center, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

const resolveParticleBlending = (darkMode: boolean) =>
  darkMode ? THREE.AdditiveBlending : THREE.NormalBlending;

const tintParticleForTheme = (
  target: THREE.Color,
  seedColor: THREE.Color,
  dynamicColors: WaveOrbDynamicColors,
  darkMode: boolean,
  options: ParticleToneOptions
) => {
  target.copy(seedColor);
  target.lerp(
    dynamicColors.shellPalette.accentColor,
    darkMode ? options.accentMixDark : options.accentMixLight
  );

  if (!darkMode && options.deepMixLight > 0) {
    target.lerp(dynamicColors.shellPalette.deepColor, options.deepMixLight);
  }

  const hsl = { h: 0, s: 0, l: 0 };
  target.getHSL(hsl);
  target.setHSL(
    (hsl.h + (darkMode ? options.hueShiftDark : options.hueShiftLight) + 1) % 1,
    clamp01(hsl.s + (darkMode ? options.saturationBoostDark : options.saturationBoostLight)),
    clamp01(hsl.l + (darkMode ? options.lightnessShiftDark : options.lightnessShiftLight))
  );
};

const writeColorAt = (array: Float32Array, index: number, color: THREE.Color) => {
  const offset = index * 3;
  array[offset] = color.r;
  array[offset + 1] = color.g;
  array[offset + 2] = color.b;
};

const FormationSwarm: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  darkMode,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const layerColorRef = useRef(new THREE.Color());
  const particleColorRef = useRef(new THREE.Color());
  const texture = useMemo(
    () =>
      createSquareGlowTexture({
        size: 164,
        coreScale: 0.18,
        haloScale: 0.66,
        coreAlpha: 1,
        haloAlpha: 1,
      }),
    []
  );

  const data = useMemo(() => {
    const count = loadProfile.particles.formationCount;
    const random = createSeededRandom(loadProfile.seed ^ 0x51f15e);
    const starts = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const toneSeeds = new Float32Array(count);
    const highlightSeeds = new Float32Array(count);
    const baseMixes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
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
      toneSeeds[i] = random();
      highlightSeeds[i] = random();
      baseMixes[i] = random();

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    return {
      starts,
      targets,
      seeds,
      toneSeeds,
      highlightSeeds,
      baseMixes,
      colors,
      initial: starts.slice(),
      count,
    };
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const t = smoothStep(clamp01(introProgress));
    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colorAttribute = points.geometry.getAttribute("color") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const colorArray = colorAttribute.array as Float32Array;
    const time = clock.elapsedTime;

    tintParticleForTheme(
      layerColorRef.current,
      t < 0.55 ? dynamicColors.shellPalette.accentColor : dynamicColors.shellPalette.glowColor,
      dynamicColors,
      darkMode,
      {
        accentMixDark: 0.08,
        accentMixLight: 0.18,
        deepMixLight: 0.14,
        hueShiftDark: 0.035,
        hueShiftLight: 0.05,
        saturationBoostDark: 0.08,
        saturationBoostLight: 0.2,
        lightnessShiftDark: 0.08,
        lightnessShiftLight: -0.05,
      }
    );

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

      const toneWave = 0.5 + 0.5 * Math.sin(time * 1.3 + seed * 1.17);
      particleColorRef.current
        .copy(layerColorRef.current)
        .lerp(dynamicColors.shellPalette.glowColor, data.toneSeeds[i] * (0.12 + toneWave * 0.18))
        .lerp(dynamicColors.highlightTone, data.highlightSeeds[i] * (darkMode ? 0.08 : 0.18))
        .lerp(dynamicColors.shellPalette.baseColor, data.baseMixes[i] * 0.12);

      if (!darkMode) {
        particleColorRef.current.lerp(dynamicColors.highlightTone, 0.04 + toneWave * 0.04);
      }

      writeColorAt(colorArray, i, particleColorRef.current);
    }

    positions.needsUpdate = true;
    colorAttribute.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0, 1.08 - t * 1.24) * (darkMode ? 1 : 0.96);
      materialRef.current.size = 0.104 + (1 - t) * 0.068;
      materialRef.current.blending = resolveParticleBlending(darkMode);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
        <bufferAttribute attach="attributes-color" array={data.colors} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff"
        map={texture}
        alphaMap={texture}
        size={0.112}
        transparent
        opacity={1}
        sizeAttenuation
        blending={resolveParticleBlending(darkMode)}
        depthWrite={false}
        toneMapped={false}
        vertexColors
      />
    </points>
  );
};

const OrbitalGlowMotes: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  hovering,
  darkMode,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const particleColorRef = useRef(new THREE.Color());
  const redBiasRef = useRef(new THREE.Color("#ff6b70"));
  const texture = useMemo(
    () =>
      createRoundGlowTexture({
        size: 176,
        coreScale: 0.11,
        haloScale: 0.58,
        coreAlpha: 0.96,
        haloAlpha: 0.98,
      }),
    []
  );

  const data = useMemo(() => {
    const count = Math.max(28, Math.round(loadProfile.particles.sparkleCount * 0.34));
    const random = createSeededRandom(loadProfile.seed ^ 0x12ac8e);
    const shellRadius = loadProfile.shell.radius;
    const motes: OrbitalGlowMote[] = [];
    const initial = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorSeeds = new Float32Array(count);
    const glowSeeds = new Float32Array(count);
    const highlightSeeds = new Float32Array(count);

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
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      colorSeeds[i] = random();
      glowSeeds[i] = random();
      highlightSeeds[i] = random();
    }

    return { motes, count, initial, colors, colorSeeds, glowSeeds, highlightSeeds };
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colorAttribute = points.geometry.getAttribute("color") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const colorArray = colorAttribute.array as Float32Array;
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

      const glowWave = 0.5 + 0.5 * Math.sin(orbit * 0.92 + data.colorSeeds[i] * Math.PI * 2);
      particleColorRef.current
        .copy(dynamicColors.shellPalette.accentColor)
        .lerp(redBiasRef.current, (darkMode ? 0.16 : 0.1) * (0.45 + data.colorSeeds[i] * 0.55))
        .lerp(dynamicColors.shellPalette.glowColor, 0.16 + data.glowSeeds[i] * 0.26)
        .lerp(
          dynamicColors.highlightTone,
          (darkMode ? 0.05 : 0.16) * (0.4 + data.highlightSeeds[i] * 0.6) * (0.72 + glowWave * 0.28)
        )
        .lerp(dynamicColors.shellPalette.baseColor, data.colorSeeds[i] * 0.06);

      if (!darkMode) {
        particleColorRef.current.lerp(dynamicColors.highlightTone, 0.05);
      }

      writeColorAt(colorArray, i, particleColorRef.current);
    }

    positions.needsUpdate = true;
    colorAttribute.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = Math.min(
        0.98,
        (0.32 + intro * 0.58) * (hovering ? 1.22 : 1.08) * (0.98 + interaction * 0.22)
      );
      materialRef.current.size = 0.172 + interaction * 0.03;
      materialRef.current.blending = resolveParticleBlending(darkMode);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={6}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
        <bufferAttribute attach="attributes-color" array={data.colors} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff"
        map={texture}
        alphaMap={texture}
        size={0.172}
        transparent
        opacity={0.82}
        sizeAttenuation
        alphaTest={0.02}
        blending={resolveParticleBlending(darkMode)}
        depthWrite={false}
        toneMapped={false}
        vertexColors
      />
    </points>
  );
};

const OrbitingSparkles: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  hovering,
  darkMode,
  loadProfile,
  dynamicColors,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const sparklesRef = useRef<THREE.Points>(null);
  const colorRef = useRef(new THREE.Color());
  const sparkleCount = useMemo(
    () => Math.max(24, Math.round(loadProfile.particles.sparkleCount * 0.58)),
    [loadProfile.particles.sparkleCount]
  );
  const intro = smoothStep(clamp01(introProgress));
  const sparkleSeeds = useMemo(() => {
    const random = createSeededRandom(loadProfile.seed ^ 0x73ab4d);
    return Float32Array.from({ length: sparkleCount }, () => random());
  }, [loadProfile.seed, sparkleCount]);

  const scale = useMemo<[number, number, number]>(() => {
    const shellRadius = loadProfile.shell.radius;
    const spread = loadProfile.particles.sparkleScale * 0.82;
    return [shellRadius * spread, shellRadius * spread * 0.92, shellRadius * spread];
  }, [loadProfile]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const interaction = dynamicColors.interactionAmount;
    const sparkleExcitement = clamp01((interaction - 0.14) / 0.82);

    if (groupRef.current) {
      const orbitRadius = loadProfile.shell.radius * (0.06 + sparkleExcitement * 0.16);
      groupRef.current.rotation.y = time * (0.08 + sparkleExcitement * 0.34);
      groupRef.current.rotation.x = Math.sin(time * 0.2) * (0.3 + sparkleExcitement * 0.2);
      groupRef.current.rotation.z = Math.cos(time * 0.16) * (0.08 + sparkleExcitement * 0.1);
      groupRef.current.position.x = Math.cos(time * 0.72) * orbitRadius;
      groupRef.current.position.y = Math.sin(time * 0.58) * orbitRadius * 0.42;
      groupRef.current.position.z = Math.sin(time * 0.46) * orbitRadius * 0.2;
      groupRef.current.scale.setScalar(1 + sparkleExcitement * 0.3 + (hovering ? 0.04 : 0));
    }

    if (sparklesRef.current) {
      const colorAttribute = sparklesRef.current.geometry.getAttribute("color") as THREE.BufferAttribute | undefined;
      if (colorAttribute) {
        const colorArray = colorAttribute.array as Float32Array;
        const pointCount = colorArray.length / 3;

        for (let i = 0; i < pointCount; i++) {
          const seed = sparkleSeeds[i % sparkleSeeds.length];
          const colorWave = 0.5 + 0.5 * Math.sin(time * (1.04 + seed * 0.44) + seed * Math.PI * 3);
          colorRef.current
            .copy(dynamicColors.shellPalette.accentColor)
            .lerp(dynamicColors.shellPalette.glowColor, colorWave)
            .lerp(dynamicColors.shellPalette.baseColor, 0.1 + seed * 0.14)
            .lerp(dynamicColors.highlightTone, (darkMode ? 0.04 : 0.1) * (0.35 + seed * 0.65));

          writeColorAt(colorArray, i, colorRef.current);
        }
        colorAttribute.needsUpdate = true;
      }

      const material = sparklesRef.current.material as THREE.ShaderMaterial | undefined;
      if (material) {
        material.transparent = true;
        material.depthWrite = false;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Sparkles
        ref={sparklesRef}
        count={sparkleCount}
        size={3.8 + clamp01((dynamicColors.interactionAmount - 0.14) / 0.86) * 1.8}
        speed={0.7 + clamp01((dynamicColors.interactionAmount - 0.14) / 0.86) * 1.2}
        scale={scale}
        color={dynamicColors.shellPalette.accentHex}
        opacity={(hovering ? 0.78 : 0.58) * (0.64 + intro * 0.36)}
        noise={0.32 + clamp01((dynamicColors.interactionAmount - 0.14) / 0.86) * 1.08}
        renderOrder={7}
      />
    </group>
  );
};

const CoronaDust: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  hovering,
  darkMode,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const layerColorRef = useRef(new THREE.Color());
  const particleColorRef = useRef(new THREE.Color());
  const texture = useMemo(
    () =>
      createRoundGlowTexture({
        size: 168,
        coreScale: 0.12,
        haloScale: 0.6,
        coreAlpha: 0.98,
        haloAlpha: 1,
      }),
    []
  );

  const data = useMemo(() => {
    const count = Math.max(1, Math.round(loadProfile.particles.coronaCount * 0.37));
    const random = createSeededRandom(loadProfile.seed ^ 0x26bf13);
    const directions = new Float32Array(count * 3);
    const bases = new Float32Array(count);
    const seeds = new Float32Array(count);
    const initial = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const accentSeeds = new Float32Array(count);
    const highlightSeeds = new Float32Array(count);
    const baseSeeds = new Float32Array(count);
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
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      accentSeeds[i] = random();
      highlightSeeds[i] = random();
      baseSeeds[i] = random();
    }

    return { directions, bases, seeds, initial, colors, accentSeeds, highlightSeeds, baseSeeds, count };
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colorAttribute = points.geometry.getAttribute("color") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const colorArray = colorAttribute.array as Float32Array;
    const time = clock.elapsedTime;
    const interactionBoost = dynamicColors.interactionAmount * 0.06;

    tintParticleForTheme(layerColorRef.current, dynamicColors.shellPalette.glowColor, dynamicColors, darkMode, {
      accentMixDark: 0.06,
      accentMixLight: 0.2,
      deepMixLight: 0.04,
      hueShiftDark: 0.03,
      hueShiftLight: 0.045,
      saturationBoostDark: 0.08,
      saturationBoostLight: 0.12,
      lightnessShiftDark: 0.1,
      lightnessShiftLight: 0.1,
    });

    for (let i = 0; i < data.count; i++) {
      const ix = i * 3;
      const seed = data.seeds[i];
      const pulse = 0.06 * Math.sin(time * 2.3 + seed) + 0.04 * Math.sin(time * 4.9 + seed * 0.6);
      const introLift = (1 - introProgress) * 0.36;
      const radius = data.bases[i] + pulse + introLift + interactionBoost;

      array[ix] = data.directions[ix] * radius;
      array[ix + 1] = data.directions[ix + 1] * radius;
      array[ix + 2] = data.directions[ix + 2] * radius;

      const shimmer = 0.5 + 0.5 * Math.sin(time * 1.5 + seed * 1.3);
      particleColorRef.current
        .copy(layerColorRef.current)
        .lerp(dynamicColors.shellPalette.accentColor, 0.08 + data.accentSeeds[i] * 0.24)
        .lerp(
          dynamicColors.highlightTone,
          (darkMode ? 0.04 : 0.16) * (0.38 + data.highlightSeeds[i] * 0.62) * (0.68 + shimmer * 0.32)
        )
        .lerp(dynamicColors.shellPalette.baseColor, 0.05 + data.baseSeeds[i] * 0.08);

      if (!darkMode) {
        particleColorRef.current.lerp(dynamicColors.highlightTone, 0.06);
      }

      writeColorAt(colorArray, i, particleColorRef.current);
    }

    positions.needsUpdate = true;
    colorAttribute.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity =
        (hovering ? 0.94 : 0.82) * (0.56 + introProgress * 0.56) * (darkMode ? 1 : 0.98);
      materialRef.current.size = hovering ? 0.088 : 0.074;
      materialRef.current.blending = resolveParticleBlending(darkMode);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={3}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
        <bufferAttribute attach="attributes-color" array={data.colors} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff"
        map={texture}
        alphaMap={texture}
        size={0.078}
        transparent
        opacity={0.84}
        sizeAttenuation
        alphaTest={0.02}
        blending={resolveParticleBlending(darkMode)}
        depthWrite={false}
        toneMapped={false}
        vertexColors
      />
    </points>
  );
};

const PlasmaStreams: React.FC<WaveOrbParticlesProps> = ({
  introProgress,
  hovering,
  darkMode,
  loadProfile,
  dynamicColors,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const particleColorRef = useRef(new THREE.Color());
  const texture = useMemo(
    () =>
      createSquareGlowTexture({
        size: 136,
        coreScale: 0.15,
        haloScale: 0.52,
        coreAlpha: 0.96,
        haloAlpha: 0.78,
      }),
    []
  );

  const data = useMemo(() => {
    const streamCount = loadProfile.particles.streamCount;
    const trailLength = loadProfile.particles.streamTrailLength;
    const random = createSeededRandom(loadProfile.seed ^ 0x79a6c4);
    const streams: PlasmaStream[] = [];
    const initial = new Float32Array(streamCount * trailLength * 3);
    const colors = new Float32Array(streamCount * trailLength * 3);
    const streamColorSeeds = new Float32Array(streamCount);

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
      streamColorSeeds[i] = random();
    }

    return {
      streams,
      streamColorSeeds,
      streamCount,
      trailLength,
      initial,
      colors,
      count: streamCount * trailLength,
    };
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colorAttribute = points.geometry.getAttribute("color") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const colorArray = colorAttribute.array as Float32Array;
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

        const trailMix = data.trailLength > 1 ? j / (data.trailLength - 1) : 0;
        const streamSeed = data.streamColorSeeds[i];
        const pulseMix = 0.5 + 0.5 * Math.sin(time * (1.2 + streamSeed * 0.4) + stream.phase + trailMix * 4.8);
        particleColorRef.current
          .copy(hovering ? dynamicColors.shellPalette.accentColor : dynamicColors.shellPalette.baseColor)
          .lerp(dynamicColors.shellPalette.glowColor, 0.18 + trailMix * 0.34 + pulseMix * 0.08)
          .lerp(dynamicColors.highlightTone, (darkMode ? 0.03 : 0.08) * (0.32 + pulseMix * 0.68))
          .lerp(dynamicColors.shellPalette.deepColor, trailMix * (darkMode ? 0.04 : 0.02));

        if (!darkMode) {
          particleColorRef.current.lerp(dynamicColors.highlightTone, 0.03);
        }

        writeColorAt(colorArray, cursor / 3, particleColorRef.current);
        cursor += 3;
      }
    }

    positions.needsUpdate = true;
    colorAttribute.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity =
        (hovering ? 0.98 : 0.84) * Math.max(0.24, introProgress) * (darkMode ? 1 : 0.96);
      materialRef.current.size = hovering ? 0.1 : 0.084;
      materialRef.current.blending = resolveParticleBlending(darkMode);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
        <bufferAttribute attach="attributes-color" array={data.colors} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff"
        map={texture}
        alphaMap={texture}
        size={0.084}
        transparent
        opacity={0.86}
        sizeAttenuation
        blending={resolveParticleBlending(darkMode)}
        depthWrite={false}
        toneMapped={false}
        vertexColors
      />
    </points>
  );
};

const WaveOrbParticles: React.FC<WaveOrbParticlesProps> = (props) => {
  return (
    <>
      <CoronaDust {...props} />
      <PlasmaStreams {...props} />
      <FormationSwarm {...props} />
      <OrbitalGlowMotes {...props} />
      <OrbitingSparkles {...props} />
    </>
  );
};

export default WaveOrbParticles;
