import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { getPaletteFrame } from "../runtime/palettes";
import { scaleCountByQuality } from "../runtime/quality";
import { POINT_KERNEL_GLSL } from "../runtime/shaders/pointKernel";
import { usePointerTracker } from "../runtime/usePointerTracker";
import { BackgroundEffectProps } from "../types";

const RIBBON_COUNT = 14;
const RIBBON_POINTS = 48;
const BASE_DUST_COUNT = 1600;

type RibbonState = {
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
  line: THREE.Line;
  positions: Float32Array;
  phase: number;
  speed: number;
  ampX: number;
  ampY: number;
  laneX: number;
  scroll: number;
  depth: number;
  colorBias: number;
};

const makeRng = (seed: number): (() => number) => {
  let state = (Math.floor(seed) >>> 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const ChromaticRibbonLatticeEffect: React.FC<BackgroundEffectProps> = ({
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
    camera.position.set(0, 0, 2.4);

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

    const rng = makeRng(styleSeed * 313 + 79);
    const ribbons: RibbonState[] = [];

    for (let ribbonIndex = 0; ribbonIndex < RIBBON_COUNT; ribbonIndex++) {
      const positions = new Float32Array(RIBBON_POINTS * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color("#7cd8ff"),
        transparent: true,
        opacity: reducedMotion ? 0.24 : 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);

      ribbons.push({
        geometry,
        material,
        line,
        positions,
        phase: rng() * Math.PI * 2,
        speed: 0.18 + rng() * 0.24,
        ampX: 0.05 + rng() * 0.11,
        ampY: 0.03 + rng() * 0.07,
        laneX: -1.4 + (ribbonIndex / Math.max(1, RIBBON_COUNT - 1)) * 2.8,
        scroll: rng() * 2.8,
        depth: 0.06 + (ribbonIndex / Math.max(1, RIBBON_COUNT - 1)) * 0.84,
        colorBias: rng(),
      });
    }

    const dustCount = scaleCountByQuality(BASE_DUST_COUNT, quality);
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustSpeeds = new Float32Array(dustCount);
    const dustPhases = new Float32Array(dustCount);
    const dustMix = new Float32Array(dustCount);

    for (let index = 0; index < dustCount; index++) {
      const ptr = index * 3;
      dustPositions[ptr] = rng() * 3.2 - 1.6;
      dustPositions[ptr + 1] = rng() * 2.8 - 1.4;
      dustPositions[ptr + 2] = rng() * 0.95;
      dustSizes[index] = 1.8 + rng() * 3.8;
      dustSpeeds[index] = 0.14 + rng() * 0.36;
      dustPhases[index] = rng() * Math.PI * 2;
      dustMix[index] = rng();
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute("aSize", new THREE.BufferAttribute(dustSizes, 1));
    dustGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(dustSpeeds, 1));
    dustGeometry.setAttribute("aPhase", new THREE.BufferAttribute(dustPhases, 1));
    dustGeometry.setAttribute("aMix", new THREE.BufferAttribute(dustMix, 1));

    const dustUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uDustA: { value: new THREE.Color("#8ecaff") },
      uDustB: { value: new THREE.Color("#f7ffe9") },
    };

    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: dustUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aSpeed;
        attribute float aPhase;
        attribute float aMix;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        varying float vMix;
        varying float vDepth;

        void main() {
          float y = mod(position.y - uTime * aSpeed + 1.4, 2.8) - 1.4;
          float x = position.x + sin(uTime * 0.7 + aPhase + y * 2.6) * 0.025;
          vec2 pos = vec2(x, y);

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 4.2) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.08;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, position.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.12 - position.z * 0.45);

          vMix = aMix;
          vDepth = position.z;
        }
      `,
      fragmentShader: `
        uniform vec3 uDustA;
        uniform vec3 uDustB;
        uniform float uTime;
        varying float vMix;
        varying float vDepth;
        ${POINT_KERNEL_GLSL}

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float alpha = pkPointAlpha(uv, vDepth, uTime, vMix, 0.24, 0.35);
          if (alpha <= 0.0001) discard;
          vec3 color = mix(uDustA, uDustB, vMix);
          color = pkLiftColor(color, 0.25);
          float depthAlpha = 0.2 + (1.0 - vDepth) * 0.4;

          gl_FragColor = vec4(color, min(alpha * depthAlpha, 0.78));
        }
      `,
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    const palettePrimaryA = new THREE.Color();
    const palettePrimaryB = new THREE.Color();
    const paletteSecondaryA = new THREE.Color();
    const paletteSecondaryB = new THREE.Color();
    const paletteAccentA = new THREE.Color();
    const paletteAccentB = new THREE.Color();

    const blendPrimary = new THREE.Color();
    const blendSecondary = new THREE.Color();
    const blendAccent = new THREE.Color();

    const resize = (): void => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      dustUniforms.uPixelRatio.value = dpr;

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

    let raf = 0;
    const start = performance.now();
    let last = start;
    const motionScale = reducedMotion ? 0.55 : 1;

    const render = (now: number): void => {
      const delta = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const elapsed = (now - start) / 1000;
      const time = elapsed * motionScale;

      const paletteFrame = getPaletteFrame(elapsed, styleSeed + 211);
      palettePrimaryA.set(paletteFrame.current.primary);
      palettePrimaryB.set(paletteFrame.next.primary);
      blendPrimary.copy(palettePrimaryA).lerp(palettePrimaryB, paletteFrame.mix);

      paletteSecondaryA.set(paletteFrame.current.secondary);
      paletteSecondaryB.set(paletteFrame.next.secondary);
      blendSecondary.copy(paletteSecondaryA).lerp(paletteSecondaryB, paletteFrame.mix);

      paletteAccentA.set(paletteFrame.current.accent);
      paletteAccentB.set(paletteFrame.next.accent);
      blendAccent.copy(paletteAccentA).lerp(paletteAccentB, paletteFrame.mix);

      dustUniforms.uTime.value = time;
      const pointer = pointerRef.current;
      const pointerX = pointer.x * camera.right;
      const pointerY = pointer.y;
      dustUniforms.uPointer.value.set(pointerX, pointerY);
      dustUniforms.uPointerStrength.value = pointer.strength;

      dustUniforms.uDustA.value.copy(blendSecondary);
      dustUniforms.uDustB.value.copy(blendAccent);

      for (let ribbonIndex = 0; ribbonIndex < ribbons.length; ribbonIndex++) {
        const ribbon = ribbons[ribbonIndex];

        for (let pointIndex = 0; pointIndex < RIBBON_POINTS; pointIndex++) {
          const t = pointIndex / Math.max(1, RIBBON_POINTS - 1);
          const flowY = 1.4 - ((ribbon.scroll + time * ribbon.speed + t * 2.2) % 2.8);

          let x =
            ribbon.laneX +
            Math.sin(t * 6.2 + ribbon.phase + time * 0.44) * ribbon.ampX +
            Math.sin(t * 12.5 + ribbon.phase * 0.6 + time * 0.28) * ribbon.ampX * 0.45;
          let y = flowY + Math.cos(t * 5.4 + ribbon.phase * 1.2 + time * 0.37) * ribbon.ampY;

          const dx = x - pointerX;
          const dy = y - pointerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.exp(-dist * 4.2) * pointer.strength;

          if (influence > 0.0001) {
            const inv = 1 / Math.max(dist, 0.0001);
            x += dx * inv * influence * 0.14;
            y += dy * inv * influence * 0.08;
          }

          if (!reducedMotion && pointer.clickPulse > 0.001) {
            const clickInfluence = Math.exp(-dist * 7.2) * pointer.clickPulse;
            x += Math.sin(time * 8 + t * 14 + ribbon.phase) * clickInfluence * 0.03;
            y += Math.cos(time * 7 + t * 13 + ribbon.phase) * clickInfluence * 0.02;
          }

          const ptr = pointIndex * 3;
          ribbon.positions[ptr] = x;
          ribbon.positions[ptr + 1] = y;
          ribbon.positions[ptr + 2] = ribbon.depth;
        }

        ribbon.geometry.attributes.position.needsUpdate = true;

        ribbon.material.color.copy(blendPrimary).lerp(blendSecondary, 0.25 + ribbon.colorBias * 0.45);
        ribbon.material.color.lerp(blendAccent, 0.1 + 0.14 * (0.5 + 0.5 * Math.sin(time * 0.4 + ribbon.phase)));
        ribbon.material.opacity = reducedMotion
          ? 0.2
          : 0.28 + 0.18 * (0.5 + 0.5 * Math.sin(time * 0.62 + ribbon.phase));
      }

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

      for (let index = 0; index < ribbons.length; index++) {
        scene.remove(ribbons[index].line);
        ribbons[index].geometry.dispose();
        ribbons[index].material.dispose();
      }

      scene.remove(dustPoints);
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [interactionMode, pointerRef, quality, reducedMotion, styleSeed]);

  return <div ref={mountRef} className={className ?? "pointer-events-none absolute inset-0 h-full w-full"} aria-hidden />;
};

export default ChromaticRibbonLatticeEffect;
