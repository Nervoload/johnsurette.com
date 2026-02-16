import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { sections } from "../../sections";
import { CenterpieceProps } from "../centerpieceTypes";
import CanvasErrorBoundary from "../../CanvasErrorBoundary";

interface Palette {
  baseHex: string;
  glowHex: string;
  accentHex: string;
  deepHex: string;
  baseColor: THREE.Color;
  glowColor: THREE.Color;
  accentColor: THREE.Color;
  deepColor: THREE.Color;
}

interface CoreSceneProps extends CenterpieceProps {
  palette: Palette;
}

interface PlasmaStream {
  anchor: THREE.Vector3;
  tangent: THREE.Vector3;
  bitangent: THREE.Vector3;
  span: number;
  height: number;
  phase: number;
  speed: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothStep = (value: number) => value * value * (3 - 2 * value);

const randomUnitVector = (): THREE.Vector3 => {
  const z = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return new THREE.Vector3(r * Math.cos(t), z, r * Math.sin(t));
};

const perpendicularTo = (vector: THREE.Vector3): THREE.Vector3 => {
  const basis = Math.abs(vector.y) > 0.8 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  return new THREE.Vector3().crossVectors(vector, basis).normalize();
};

const CORE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vEnergy;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.56;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      value += noise(p * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return value;
  }

  void main() {
    vec3 p = position;
    float n = fbm(normal * 2.7 + p * 0.8 + vec3(uTime * 0.26, uTime * 0.21, uTime * 0.19));
    float angular = atan(p.z, p.x);
    float spikes = pow(max(0.0, sin(angular * 12.0 + uTime * 2.5 + n * 7.0)), 4.0);
    float ripples = abs(sin((p.y + uTime * 0.28) * 14.0)) * 0.06;
    float interactionBoost = 1.0 + uInteraction * 1.6;
    float displacement = (0.05 + uBeat * 0.07) * n + spikes * (0.08 + uBeat * 0.08) * interactionBoost + ripples;
    displacement *= mix(0.16, 1.0, uIntro);

    vec3 displaced = p + normal * displacement;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);

    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vEnergy = n + spikes;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const CORE_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vEnergy;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uDeepColor;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);
    float turbulence = 0.5 + 0.5 * sin((vWorldPos.x + vWorldPos.z) * 3.8 + uTime * 2.0 + vEnergy * 10.0);
    float scan = 0.5 + 0.5 * sin((vWorldPos.y * 18.0) + uTime * 3.2 + vEnergy * 12.0);
    float heat = smoothstep(0.28, 1.28, vEnergy);

    vec3 base = mix(uDeepColor, uColorA, heat);
    base = mix(base, uColorB, turbulence * 0.52);
    base = mix(base, uColorC, scan * 0.36);

    vec3 rim = fresnel * (uColorC * 1.8 + uColorB * 0.5);
    vec3 pulse = uColorB * (0.12 + uBeat * 0.34 + uInteraction * 0.28);
    vec3 color = base + rim + pulse + uColorC * (uInteraction * 0.18);

    float alpha = (0.78 + fresnel * 0.2) * uIntro;
    gl_FragColor = vec4(color, alpha);
  }
`;

const FormationSwarm: React.FC<{ introProgress: number; palette: Palette }> = ({
  introProgress,
  palette,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const data = useMemo(() => {
    const count = 1400;
    const starts = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const startDirection = randomUnitVector();
      const targetDirection = randomUnitVector();

      const startRadius = 3.8 + Math.random() * 4.6;
      const targetRadius = 0.9 + Math.pow(Math.random(), 1.25) * 1.2;

      starts[i * 3] = startDirection.x * startRadius;
      starts[i * 3 + 1] = startDirection.y * startRadius;
      starts[i * 3 + 2] = startDirection.z * startRadius;

      targets[i * 3] = targetDirection.x * targetRadius;
      targets[i * 3 + 1] = targetDirection.y * targetRadius;
      targets[i * 3 + 2] = targetDirection.z * targetRadius;

      seeds[i] = Math.random() * Math.PI * 2;
    }

    return {
      starts,
      targets,
      seeds,
      initial: starts.slice(),
      count,
    };
  }, []);

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

      const startX = data.starts[ix];
      const startY = data.starts[ix + 1];
      const startZ = data.starts[ix + 2];

      const targetX = data.targets[ix];
      const targetY = data.targets[ix + 1];
      const targetZ = data.targets[ix + 2];

      const swirl = (1 - t) * (0.38 + 0.18 * Math.sin(time * 1.8 + seed));

      array[ix] = THREE.MathUtils.lerp(startX, targetX, t) + Math.cos(time * 2.1 + seed) * swirl;
      array[ix + 1] = THREE.MathUtils.lerp(startY, targetY, t) + Math.sin(time * 1.7 + seed * 1.3) * swirl;
      array[ix + 2] = THREE.MathUtils.lerp(startZ, targetZ, t) + Math.cos(time * 2.3 + seed * 0.7) * swirl;
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0, 0.95 - t * 0.92);
      materialRef.current.size = 0.03 + (1 - t) * 0.02;
      materialRef.current.color.set(t < 0.55 ? palette.accentHex : palette.glowHex);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={palette.accentHex}
        size={0.04}
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const CoronaDust: React.FC<{ introProgress: number; hovering: boolean; palette: Palette }> = ({
  introProgress,
  hovering,
  palette,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const data = useMemo(() => {
    const count = 1100;
    const directions = new Float32Array(count * 3);
    const bases = new Float32Array(count);
    const seeds = new Float32Array(count);
    const initial = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const direction = randomUnitVector();
      const radius = 1.08 + Math.pow(Math.random(), 1.5) * 0.68;

      directions[i * 3] = direction.x;
      directions[i * 3 + 1] = direction.y;
      directions[i * 3 + 2] = direction.z;

      bases[i] = radius;
      seeds[i] = Math.random() * Math.PI * 2;

      initial[i * 3] = direction.x * radius;
      initial[i * 3 + 1] = direction.y * radius;
      initial[i * 3 + 2] = direction.z * radius;
    }

    return { directions, bases, seeds, initial, count };
  }, []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const time = clock.elapsedTime;

    for (let i = 0; i < data.count; i++) {
      const ix = i * 3;
      const seed = data.seeds[i];
      const dirX = data.directions[ix];
      const dirY = data.directions[ix + 1];
      const dirZ = data.directions[ix + 2];
      const pulse = 0.06 * Math.sin(time * 2.3 + seed) + 0.04 * Math.sin(time * 4.9 + seed * 0.6);
      const introLift = (1 - introProgress) * 0.36;
      const radius = data.bases[i] + pulse + introLift;

      array[ix] = dirX * radius;
      array[ix + 1] = dirY * radius;
      array[ix + 2] = dirZ * radius;
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = (hovering ? 0.68 : 0.56) * (0.5 + introProgress * 0.5);
      materialRef.current.size = hovering ? 0.028 : 0.024;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={3}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={palette.glowHex}
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

const PlasmaStreams: React.FC<{ introProgress: number; hovering: boolean; palette: Palette }> = ({
  introProgress,
  hovering,
  palette,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const data = useMemo(() => {
    const streamCount = 24;
    const trailLength = 26;
    const streams: PlasmaStream[] = [];
    const initial = new Float32Array(streamCount * trailLength * 3);

    for (let i = 0; i < streamCount; i++) {
      const anchor = randomUnitVector();
      const tangent = perpendicularTo(anchor);
      const bitangent = new THREE.Vector3().crossVectors(anchor, tangent).normalize();

      streams.push({
        anchor,
        tangent,
        bitangent,
        span: 0.8 + Math.random() * 0.8,
        height: 0.18 + Math.random() * 0.72,
        phase: Math.random() * Math.PI * 2,
        speed: 0.16 + Math.random() * 0.42,
      });
    }

    return {
      streams,
      streamCount,
      trailLength,
      initial,
      count: streamCount * trailLength,
    };
  }, []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const time = clock.elapsedTime;

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

        const x = stream.anchor.x * (1.03 + lift) + stream.tangent.x * along + stream.bitangent.x * sway;
        const y = stream.anchor.y * (1.03 + lift) + stream.tangent.y * along + stream.bitangent.y * sway;
        const z = stream.anchor.z * (1.03 + lift) + stream.tangent.z * along + stream.bitangent.z * sway;

        array[cursor] = x;
        array[cursor + 1] = y;
        array[cursor + 2] = z;
        cursor += 3;
      }
    }

    positions.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = (hovering ? 0.9 : 0.72) * Math.max(0.2, introProgress);
      materialRef.current.size = hovering ? 0.038 : 0.032;
      materialRef.current.color.set(hovering ? palette.accentHex : palette.baseHex);
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.initial} itemSize={3} count={data.count} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={palette.baseHex}
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

const OrbScene: React.FC<CoreSceneProps> = ({
  pointer,
  hovering,
  pressed,
  introProgress,
  palette,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const coreMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBeat: { value: 0 },
      uIntro: { value: 0 },
      uInteraction: { value: 0 },
      uColorA: { value: palette.baseColor.clone() },
      uColorB: { value: palette.glowColor.clone() },
      uColorC: { value: palette.accentColor.clone() },
      uDeepColor: { value: palette.deepColor.clone() },
    }),
    [palette]
  );

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.55, 0.07);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.42, 0.07);
      groupRef.current.rotation.z += delta * 0.03;
    }

    if (coreMaterialRef.current) {
      const beat = 0.5 + 0.5 * Math.sin(time * 2.6);
      const interactionTarget = (hovering ? 0.55 : 0) + (pressed ? 0.9 : 0);
      const interaction = THREE.MathUtils.lerp(
        coreMaterialRef.current.uniforms.uInteraction.value,
        interactionTarget,
        0.1
      );
      coreMaterialRef.current.uniforms.uTime.value = time;
      coreMaterialRef.current.uniforms.uBeat.value = beat;
      coreMaterialRef.current.uniforms.uIntro.value = Math.max(0.08, introProgress);
      coreMaterialRef.current.uniforms.uInteraction.value = interaction;
    }

    if (coreRef.current) {
      const interaction = (hovering ? 0.06 : 0) + (pressed ? 0.1 : 0);
      const breath = Math.sin(time * 1.5) * 0.025;
      const scale = 0.62 + introProgress * 0.42 + interaction + breath;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.rotation.y += delta * 0.1;
      coreRef.current.rotation.x += delta * 0.04;
    }

    if (haloRef.current) {
      const haloPulse = 1 + Math.sin(time * 1.8) * 0.03;
      haloRef.current.scale.setScalar(haloPulse);
      const material = haloRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = (hovering ? 0.22 : 0.16) * Math.max(0.2, introProgress);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.24} />
      <pointLight position={[3.2, 2.1, 3.8]} color={palette.accentColor} intensity={2.0} />
      <pointLight position={[-3.4, -2.3, -2.5]} color={palette.glowColor} intensity={1.6} />
      <pointLight position={[0, 3.2, -4]} color={palette.baseColor} intensity={1.35} />

      <group ref={groupRef}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.06, 42]} />
          <shaderMaterial
            ref={coreMaterialRef}
            uniforms={coreUniforms}
            vertexShader={CORE_VERTEX_SHADER}
            fragmentShader={CORE_FRAGMENT_SHADER}
            transparent
          />
        </mesh>

        <mesh ref={haloRef} scale={1.24}>
          <sphereGeometry args={[1.1, 40, 40]} />
          <meshBasicMaterial
            color={palette.glowColor}
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <CoronaDust introProgress={introProgress} hovering={hovering} palette={palette} />
        <PlasmaStreams introProgress={introProgress} hovering={hovering} palette={palette} />
        <FormationSwarm introProgress={introProgress} palette={palette} />

        <Sparkles
          count={150}
          size={2.4}
          speed={0.5}
          scale={4.8}
          color={palette.accentHex}
          opacity={0.45}
          noise={1.0}
        />
      </group>
    </>
  );
};

const WaveOrbCenterpiece: React.FC<CenterpieceProps> = ({ activeSection, ...rest }) => {
  const palette = useMemo<Palette>(() => {
    const baseColor = new THREE.Color(
      sections.find((section) => section.name === activeSection)?.color ?? "#06b6d4"
    );

    const hsl = { h: 0, s: 0, l: 0 };
    baseColor.getHSL(hsl);

    const glowColor = new THREE.Color().setHSL(
      (hsl.h + 0.09) % 1,
      clamp01(hsl.s * 0.95 + 0.18),
      clamp01(hsl.l + 0.18)
    );
    const accentColor = new THREE.Color().setHSL(
      (hsl.h + 0.25) % 1,
      clamp01(hsl.s + 0.28),
      clamp01(hsl.l + 0.14)
    );
    const deepColor = new THREE.Color().setHSL(
      (hsl.h + 0.58) % 1,
      clamp01(hsl.s * 0.62 + 0.2),
      0.08
    );

    return {
      baseHex: `#${baseColor.getHexString()}`,
      glowHex: `#${glowColor.getHexString()}`,
      accentHex: `#${accentColor.getHexString()}`,
      deepHex: `#${deepColor.getHexString()}`,
      baseColor,
      glowColor,
      accentColor,
      deepColor,
    };
  }, [activeSection]);

  return (
    <CanvasErrorBoundary>
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <OrbScene activeSection={activeSection} palette={palette} {...rest} />
    </Canvas>
    </CanvasErrorBoundary>
  );
};

export default WaveOrbCenterpiece;
