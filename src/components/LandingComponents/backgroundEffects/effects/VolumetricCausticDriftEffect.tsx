import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { getPaletteFrame } from "../runtime/palettes";
import { scaleCountByQuality } from "../runtime/quality";
import { POINT_KERNEL_GLSL } from "../runtime/shaders/pointKernel";
import { usePointerTracker } from "../runtime/usePointerTracker";
import { BackgroundEffectProps } from "../types";

const LAYER_COUNT = 6;
const BASE_PARTICLE_COUNT = 4200;
const BASE_TIME_SCALE = 0.42;

const makeRng = (seed: number): (() => number) => {
  let state = (Math.floor(seed) >>> 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const VolumetricCausticDriftEffect: React.FC<BackgroundEffectProps> = ({
  quality,
  interactionMode,
  styleSeed,
  reducedMotion,
  className,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointerRef = usePointerTracker(interactionMode, reducedMotion);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 12);
    camera.position.set(0, 0, 2.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uClickPulse: { value: 0 },
      uColorA: { value: new THREE.Color("#5ed8ff") },
      uColorB: { value: new THREE.Color("#7b6bff") },
      uAccent: { value: new THREE.Color("#f26d9d") },
    };

    const vertexShader = `
      attribute float aSize;
      attribute float aPhase;
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform vec2 uPointer;
      uniform float uPointerStrength;
      uniform float uClickPulse;
      varying float vDepth;
      varying float vSeed;

      void main() {
        vec3 p = position;
        float drift = mod(p.y - uTime * (0.12 + aSeed * 0.2 + p.z * 0.08) + 1.35, 2.7) - 1.35;
        float waveA = sin((p.x * 3.1) + (uTime * (0.2 + aSeed * 0.15)) + aPhase);
        float waveB = cos((p.y * 2.7) - (uTime * (0.14 + aSeed * 0.11)) + aPhase * 1.3);
        vec2 pos = vec2(
          p.x + waveA * (0.03 + p.z * 0.014),
          drift + waveB * (0.035 + p.z * 0.015)
        );

        vec2 delta = pos - uPointer;
        float dist = length(delta);
        float influence = exp(-dist * 3.8) * uPointerStrength;
        vec2 dir = normalize(delta + vec2(0.0001));
        pos += dir * influence * 0.11;

        float clickInfluence = exp(-dist * 6.0) * uClickPulse;
        float depthScale = 1.25 - p.z * 0.55;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
        gl_PointSize = aSize * uPixelRatio * depthScale * (1.0 + clickInfluence * 0.22);
        vDepth = clamp(p.z, 0.0, 1.0);
        vSeed = aSeed;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uAccent;
      uniform float uTime;
      varying float vDepth;
      varying float vSeed;
      ${POINT_KERNEL_GLSL}

      void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float alpha = pkPointAlpha(uv, vDepth, uTime, vSeed, 0.34, 0.44);
        if (alpha <= 0.0001) discard;

        vec3 base = mix(uColorA, uColorB, clamp(vDepth * 1.1, 0.0, 1.0));
        float accentBlend = 0.24 + 0.16 * sin(uTime * 0.6 + vSeed * 8.0);
        base = mix(base, uAccent, accentBlend);
        base = pkLiftColor(base, 0.24);

        gl_FragColor = vec4(base, min(alpha, 0.84));
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });

    const layers: Array<{ geometry: THREE.BufferGeometry; points: THREE.Points }> = [];
    const targetCount = scaleCountByQuality(BASE_PARTICLE_COUNT, quality);
    const basePerLayer = Math.floor(targetCount / LAYER_COUNT);
    const remainder = targetCount % LAYER_COUNT;

    for (let layer = 0; layer < LAYER_COUNT; layer++) {
      const count = basePerLayer + (layer < remainder ? 1 : 0);
      const rng = makeRng(styleSeed * 97 + layer * 1337 + 17);
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const phases = new Float32Array(count);
      const seeds = new Float32Array(count);

      for (let index = 0; index < count; index++) {
        const ptr = index * 3;
        positions[ptr] = rng() * 2.6 - 1.3;
        positions[ptr + 1] = rng() * 2.7 - 1.35;
        positions[ptr + 2] = layer / Math.max(1, LAYER_COUNT - 1);

        sizes[index] = 2.5 + rng() * 7.5;
        phases[index] = rng() * Math.PI * 2;
        seeds[index] = rng();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      layers.push({ geometry, points });
    }

    const primaryA = new THREE.Color();
    const primaryB = new THREE.Color();
    const accentA = new THREE.Color();
    const accentB = new THREE.Color();
    const secondaryA = new THREE.Color();
    const secondaryB = new THREE.Color();

    const syncPalette = (time: number): void => {
      const frame = getPaletteFrame(time, styleSeed);

      primaryA.set(frame.current.primary);
      primaryB.set(frame.next.primary);
      uniforms.uColorA.value.copy(primaryA).lerp(primaryB, frame.mix);

      secondaryA.set(frame.current.secondary);
      secondaryB.set(frame.next.secondary);
      uniforms.uColorB.value.copy(secondaryA).lerp(secondaryB, frame.mix);

      accentA.set(frame.current.accent);
      accentB.set(frame.next.accent);
      uniforms.uAccent.value.copy(accentA).lerp(accentB, frame.mix);
    };

    const resize = (): void => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      uniforms.uPixelRatio.value = dpr;

      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof window.ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
    } else {
      window.addEventListener("resize", resize);
    }

    const motionScale = (reducedMotion ? 0.55 : 1) * BASE_TIME_SCALE;
    let raf = 0;
    let start = performance.now();
    let last = start;

    const render = (now: number): void => {
      const delta = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const elapsed = (now - start) / 1000;

      uniforms.uTime.value += delta * motionScale;
      syncPalette(elapsed);

      const pointer = pointerRef.current;
      uniforms.uPointer.value.set(pointer.x * camera.right, pointer.y);
      uniforms.uPointerStrength.value = pointer.strength;
      uniforms.uClickPulse.value = reducedMotion ? 0 : pointer.clickPulse;

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(render);
    };

    resize();
    raf = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(raf);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }

      for (let index = 0; index < layers.length; index++) {
        scene.remove(layers[index].points);
        layers[index].geometry.dispose();
      }
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [interactionMode, pointerRef, quality, reducedMotion, styleSeed]);

  return <div ref={mountRef} className={className ?? "pointer-events-none absolute inset-0 h-full w-full"} aria-hidden />;
};

export default VolumetricCausticDriftEffect;
