import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OriginSceneComponentProps } from "../types";
import { clamp01, smoothStep } from "./sceneMath";

const createStarTextPoints = (): Float32Array => {
  if (typeof document === "undefined") return new Float32Array();

  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  if (!context) return new Float32Array();

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 104px Manrope, sans-serif";
  context.fillText("PART OF", canvas.width / 2, canvas.height / 2 - 58);
  context.fillText("THE FUTURE", canvas.width / 2, canvas.height / 2 + 64);

  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const output: number[] = [];

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const index = (y * canvas.width + x) * 4;
      const alpha = image.data[index + 3];
      if (alpha < 185) continue;
      output.push((x / canvas.width - 0.5) * 5, -(y / canvas.height - 0.5) * 1.9, (Math.random() - 0.5) * 0.22);
    }
  }

  return new Float32Array(output);
};

const createSpiralArms = (
  count: number,
  armCount: number,
  radiusMax: number,
  thickness: number,
): Float32Array => {
  const output = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const arm = i % armCount;
    const radius = Math.pow(Math.random(), 0.48) * radiusMax;
    const swirl =
      radius * (1.28 + Math.random() * 0.44) +
      arm * ((Math.PI * 2) / armCount) +
      (Math.random() - 0.5) * 0.42;
    output[i * 3] = Math.cos(swirl) * radius + (Math.random() - 0.5) * 0.08;
    output[i * 3 + 1] = (Math.random() - 0.5) * thickness * (0.64 + radius / radiusMax);
    output[i * 3 + 2] = Math.sin(swirl) * radius + (Math.random() - 0.5) * 0.08;
  }

  return output;
};

const createDiffuseDust = (count: number, radiusMin: number, radiusMax: number): Float32Array => {
  const output = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const radius = radiusMin + Math.pow(Math.random(), 0.72) * (radiusMax - radiusMin);
    const theta = Math.random() * Math.PI * 2;
    output[i * 3] = Math.cos(theta) * radius;
    output[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    output[i * 3 + 2] = Math.sin(theta) * radius;
  }
  return output;
};

interface StarTextMorphBuffers {
  start: Float32Array;
  target: Float32Array;
  current: Float32Array;
}

const createStarTextMorphBuffers = (): StarTextMorphBuffers => {
  const target = createStarTextPoints();
  const start = new Float32Array(target.length);
  const current = new Float32Array(target.length);

  for (let i = 0; i < target.length; i += 3) {
    const radius = 3.1 + Math.random() * 3.2;
    const theta = Math.random() * Math.PI * 2;
    start[i] = Math.cos(theta) * radius;
    start[i + 1] = (Math.random() - 0.5) * 1.7;
    start[i + 2] = Math.sin(theta) * radius;
    current[i] = start[i];
    current[i + 1] = start[i + 1];
    current[i + 2] = start[i + 2];
  }

  return { start, target, current };
};

const GalaxyFutureScene: React.FC<OriginSceneComponentProps> = ({
  weight,
  localProgress,
  pointer,
  reducedMotion,
  qualityFactor,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const innerArmRef = useRef<THREE.Points>(null);
  const midArmRef = useRef<THREE.Points>(null);
  const haloRef = useRef<THREE.Points>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Points>(null);
  const textGeometryRef = useRef<THREE.BufferGeometry>(null);

  const innerArms = useMemo(() => {
    const count = Math.max(1800, Math.floor(4600 * qualityFactor));
    return createSpiralArms(count, 5, 4.2, 0.68);
  }, [qualityFactor]);

  const midArms = useMemo(() => {
    const count = Math.max(950, Math.floor(2700 * qualityFactor));
    return createSpiralArms(count, 4, 5.2, 1.2);
  }, [qualityFactor]);

  const haloDust = useMemo(() => {
    const count = Math.max(840, Math.floor(2300 * qualityFactor));
    return createDiffuseDust(count, 4.5, 9.2);
  }, [qualityFactor]);

  const starTextMorph = useMemo(() => createStarTextMorphBuffers(), []);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    const intensity = clamp01(weight);
    const reveal = smoothStep((localProgress - 0.16) / 0.6);
    const morphStrength = reducedMotion ? Math.max(reveal, 0.7) : reveal;

    if (rootRef.current) {
      rootRef.current.rotation.y = elapsed * (reducedMotion ? 0.01 : 0.03) + pointer.x * 0.18 * intensity;
      rootRef.current.rotation.x = pointer.y * 0.08 * intensity;
    }

    if (innerArmRef.current?.material instanceof THREE.PointsMaterial) {
      innerArmRef.current.rotation.y = elapsed * 0.018;
      innerArmRef.current.material.opacity = 0.08 + intensity * 0.66;
      innerArmRef.current.material.size = 0.008 + intensity * 0.018;
    }

    if (midArmRef.current?.material instanceof THREE.PointsMaterial) {
      midArmRef.current.rotation.y = -elapsed * 0.014;
      midArmRef.current.material.opacity = 0.05 + intensity * 0.48;
      midArmRef.current.material.size = 0.006 + intensity * 0.012;
    }

    if (haloRef.current?.material instanceof THREE.PointsMaterial) {
      haloRef.current.rotation.y = elapsed * 0.006;
      haloRef.current.material.opacity = 0.04 + intensity * 0.28;
      haloRef.current.material.size = 0.005 + intensity * 0.009;
    }

    if (coreGlowRef.current?.material instanceof THREE.MeshBasicMaterial) {
      coreGlowRef.current.scale.setScalar(0.82 + intensity * 0.22);
      coreGlowRef.current.material.opacity = 0.12 + intensity * 0.28;
    }

    if (textRef.current?.material instanceof THREE.PointsMaterial) {
      textRef.current.material.opacity = (0.08 + reveal * 0.88) * intensity;
      textRef.current.material.size = 0.012 + reveal * 0.02;
      textRef.current.rotation.y = Math.sin(elapsed * 0.16) * 0.08;
    }

    const position = textGeometryRef.current?.getAttribute("position");
    if (position instanceof THREE.BufferAttribute && starTextMorph.current.length > 0) {
      const drift = Math.max(0, 1 - morphStrength);
      for (let i = 0; i < starTextMorph.current.length; i += 3) {
        const tx = starTextMorph.target[i];
        const ty = starTextMorph.target[i + 1];
        const tz = starTextMorph.target[i + 2];

        const sx = starTextMorph.start[i];
        const sy = starTextMorph.start[i + 1];
        const sz = starTextMorph.start[i + 2];

        const jitterX = Math.sin(elapsed * 0.8 + i * 0.013) * drift * 0.08;
        const jitterY = Math.cos(elapsed * 0.74 + i * 0.011) * drift * 0.05;
        const jitterZ = Math.sin(elapsed * 0.62 + i * 0.017) * drift * 0.08;

        starTextMorph.current[i] = sx + (tx - sx) * morphStrength + jitterX;
        starTextMorph.current[i + 1] = sy + (ty - sy) * morphStrength + jitterY;
        starTextMorph.current[i + 2] = sz + (tz - sz) * morphStrength + jitterZ;
      }
      position.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef} visible={weight > 0.004}>
      <mesh ref={coreGlowRef}>
        <sphereGeometry args={[0.9, 48, 48]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points ref={innerArmRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={innerArms}
            itemSize={3}
            count={innerArms.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f8fafc"
          transparent
          opacity={0.6}
          size={0.014}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={midArmRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={midArms}
            itemSize={3}
            count={midArms.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#a5f3fc"
          transparent
          opacity={0.36}
          size={0.011}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={haloRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={haloDust}
            itemSize={3}
            count={haloDust.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c4b5fd"
          transparent
          opacity={0.22}
          size={0.008}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={textRef} position={[0, -0.16, 0.4]}>
        <bufferGeometry ref={textGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            array={starTextMorph.current}
            itemSize={3}
            count={starTextMorph.current.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#99f6e4"
          transparent
          opacity={0.74}
          size={0.026}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={haloDust}
            itemSize={3}
            count={haloDust.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f0f9ff"
          transparent
          opacity={0.1}
          size={0.004}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default GalaxyFutureScene;
