import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { getPaletteFrame } from "../runtime/palettes";
import { scaleCountByQuality } from "../runtime/quality";
import { POINT_KERNEL_GLSL } from "../runtime/shaders/pointKernel";
import { usePointerTracker } from "../runtime/usePointerTracker";
import { BackgroundEffectProps } from "../types";

const BASE_MOTE_COUNT = 4200;
const BASE_VEIL_COUNT = 80;
const BASE_SILHOUETTE_COUNT = 180;
const BASE_TIME_SCALE = 0.34;

const makeRng = (seed: number): (() => number) => {
  let state = (Math.floor(seed) >>> 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const VolumetricBiofieldEffect: React.FC<BackgroundEffectProps> = ({
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
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 14);
    camera.position.set(0, 0, 3);

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

    const rng = makeRng(styleSeed * 571 + 31);
    const motesCount = scaleCountByQuality(BASE_MOTE_COUNT, quality);
    const veilsCount = scaleCountByQuality(BASE_VEIL_COUNT, quality);
    const silhouettesCount = scaleCountByQuality(BASE_SILHOUETTE_COUNT, quality);

    const motePositions = new Float32Array(motesCount * 3);
    const moteSizes = new Float32Array(motesCount);
    const moteSeeds = new Float32Array(motesCount);
    const motePhases = new Float32Array(motesCount);
    const moteDrifts = new Float32Array(motesCount);
    const moteLaterals = new Float32Array(motesCount);
    const moteCycles = new Float32Array(motesCount);

    for (let index = 0; index < motesCount; index++) {
      const ptr = index * 3;
      motePositions[ptr] = rng() * 3.6 - 1.8;
      motePositions[ptr + 1] = rng() * 3.0 - 1.5;
      motePositions[ptr + 2] = rng() * 0.98;
      moteSizes[index] = 2.6 + rng() * 8.2;
      moteSeeds[index] = rng();
      motePhases[index] = rng() * Math.PI * 2;
      moteDrifts[index] = 0.12 + rng() * 0.42;
      moteLaterals[index] = 0.2 + rng() * 0.8;
      moteCycles[index] = 0.2 + rng() * 0.9;
    }

    const moteGeometry = new THREE.BufferGeometry();
    moteGeometry.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
    moteGeometry.setAttribute("aSize", new THREE.BufferAttribute(moteSizes, 1));
    moteGeometry.setAttribute("aSeed", new THREE.BufferAttribute(moteSeeds, 1));
    moteGeometry.setAttribute("aPhase", new THREE.BufferAttribute(motePhases, 1));
    moteGeometry.setAttribute("aDrift", new THREE.BufferAttribute(moteDrifts, 1));
    moteGeometry.setAttribute("aLateral", new THREE.BufferAttribute(moteLaterals, 1));
    moteGeometry.setAttribute("aCycle", new THREE.BufferAttribute(moteCycles, 1));

    const moteUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uClickPulse: { value: 0 },
      uColorA: { value: new THREE.Color("#3cd8ff") },
      uColorB: { value: new THREE.Color("#7dffd1") },
      uAccent: { value: new THREE.Color("#ffb25e") },
      uHighlight: { value: new THREE.Color("#fff2d1") },
    };

    const moteMaterial = new THREE.ShaderMaterial({
      uniforms: moteUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aSeed;
        attribute float aPhase;
        attribute float aDrift;
        attribute float aLateral;
        attribute float aCycle;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        uniform float uClickPulse;
        varying float vDepth;
        varying float vSeed;
        varying float vPhase;

        void main() {
          vec3 p = position;
          float cycle = fract(uTime * (0.08 + aCycle * 0.16) + aPhase * 0.3);
          float active = smoothstep(0.04, 0.2, cycle) * (1.0 - smoothstep(0.68, 0.9, cycle));

          float y = mod(p.y - uTime * (aDrift + p.z * 0.08) + 1.5, 3.0) - 1.5;
          float xSlide = sin(uTime * (0.42 + aSeed * 0.4) + aPhase + y * 2.4) * (0.02 + aLateral * 0.06) * active;
          float ySlide = cos(uTime * (0.32 + aSeed * 0.3) + aPhase * 1.2) * (0.015 + aLateral * 0.04) * active;

          vec2 pos = vec2(p.x + xSlide, y + ySlide);
          vec2 curl = vec2(
            sin((pos.y * 3.1) + (uTime * 0.32) + aSeed * 5.0),
            cos((pos.x * 2.7) - (uTime * 0.28) + aSeed * 4.0)
          ) * (0.006 + p.z * 0.012);
          pos += curl;

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 3.2) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.14;

          float clickInfluence = exp(-dist * 6.8) * uClickPulse;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.18 - p.z * 0.5) * (1.0 + clickInfluence * 0.18);
          vDepth = p.z;
          vSeed = aSeed;
          vPhase = aPhase;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uAccent;
        uniform vec3 uHighlight;
        uniform float uTime;
        varying float vDepth;
        varying float vSeed;
        varying float vPhase;
        ${POINT_KERNEL_GLSL}

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float phase = vSeed + vPhase * 0.27;
          float alpha = pkPointAlpha(uv, vDepth, uTime, phase, 0.46, 0.62);
          if (alpha <= 0.0001) discard;

          vec3 base = mix(uColorA, uColorB, clamp(vDepth * 1.08, 0.0, 1.0));
          float accentMix = 0.14 + 0.14 * sin(uTime * 0.52 + vSeed * 10.0);
          float hiMix = 0.06 + 0.07 * cos(uTime * 0.34 + vPhase * 1.5);
          base = mix(base, uAccent, accentMix);
          base = mix(base, uHighlight, hiMix);
          base = pkLiftColor(base, 0.34);

          gl_FragColor = vec4(base, min(alpha, 0.9));
        }
      `,
    });

    const motePoints = new THREE.Points(moteGeometry, moteMaterial);
    scene.add(motePoints);

    const veilPositions = new Float32Array(veilsCount * 3);
    const veilSizes = new Float32Array(veilsCount);
    const veilSeeds = new Float32Array(veilsCount);
    const veilDrifts = new Float32Array(veilsCount);
    const veilPhases = new Float32Array(veilsCount);

    for (let index = 0; index < veilsCount; index++) {
      const ptr = index * 3;
      veilPositions[ptr] = rng() * 3.8 - 1.9;
      veilPositions[ptr + 1] = rng() * 3.2 - 1.6;
      veilPositions[ptr + 2] = rng() * 0.96;
      veilSizes[index] = 24 + rng() * 62;
      veilSeeds[index] = rng();
      veilDrifts[index] = 0.06 + rng() * 0.2;
      veilPhases[index] = rng() * Math.PI * 2;
    }

    const veilGeometry = new THREE.BufferGeometry();
    veilGeometry.setAttribute("position", new THREE.BufferAttribute(veilPositions, 3));
    veilGeometry.setAttribute("aSize", new THREE.BufferAttribute(veilSizes, 1));
    veilGeometry.setAttribute("aSeed", new THREE.BufferAttribute(veilSeeds, 1));
    veilGeometry.setAttribute("aDrift", new THREE.BufferAttribute(veilDrifts, 1));
    veilGeometry.setAttribute("aPhase", new THREE.BufferAttribute(veilPhases, 1));

    const veilUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uColorA: { value: new THREE.Color("#9ddfff") },
      uColorB: { value: new THREE.Color("#f5fbff") },
    };

    const veilMaterial = new THREE.ShaderMaterial({
      uniforms: veilUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aSeed;
        attribute float aDrift;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        varying float vDepth;
        varying float vSeed;

        void main() {
          vec3 p = position;
          float y = mod(p.y - uTime * (aDrift + p.z * 0.04) + 1.6, 3.2) - 1.6;
          float x = p.x + sin(uTime * (0.15 + aSeed * 0.2) + aPhase + y * 1.8) * (0.04 + p.z * 0.08);
          vec2 pos = vec2(x, y);

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 3.2) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.045;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.4 - p.z * 0.5);
          vDepth = p.z;
          vSeed = aSeed;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vDepth;
        varying float vSeed;
        ${POINT_KERNEL_GLSL}

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(uv, uv);
          if (r2 > 1.0) discard;
          float r = sqrt(r2);

          float softCore = exp(-r2 * 2.1);
          float shell = exp(-r2 * 0.55) * (1.0 - smoothstep(0.1, 0.9, r));
          float fade = 0.05 + (1.0 - vDepth) * 0.1;
          float grain = pkGrain(gl_FragCoord.xy, vSeed) * 0.2;
          float alpha = clamp((softCore * 0.28 + shell * 0.16) * fade + grain, 0.0, 0.12);

          vec3 color = mix(uColorA, uColorB, vSeed * 0.8 + vDepth * 0.2);
          color = pkLiftColor(color, 0.42);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const veilPoints = new THREE.Points(veilGeometry, veilMaterial);
    scene.add(veilPoints);

    const silhouettePositions = new Float32Array(silhouettesCount * 3);
    const silhouetteSizes = new Float32Array(silhouettesCount);
    const silhouetteSeeds = new Float32Array(silhouettesCount);
    const silhouetteKinds = new Float32Array(silhouettesCount);
    const silhouetteAngles = new Float32Array(silhouettesCount);
    const silhouettePhases = new Float32Array(silhouettesCount);
    const silhouetteDrifts = new Float32Array(silhouettesCount);

    for (let index = 0; index < silhouettesCount; index++) {
      const ptr = index * 3;
      silhouettePositions[ptr] = rng() * 3.6 - 1.8;
      silhouettePositions[ptr + 1] = rng() * 3.2 - 1.6;
      silhouettePositions[ptr + 2] = rng() * 0.95;
      silhouetteSizes[index] = 10 + rng() * 22;
      silhouetteSeeds[index] = rng();
      silhouetteKinds[index] = Math.floor(rng() * 3);
      silhouetteAngles[index] = rng() * Math.PI * 2;
      silhouettePhases[index] = rng() * Math.PI * 2;
      silhouetteDrifts[index] = 0.08 + rng() * 0.28;
    }

    const silhouetteGeometry = new THREE.BufferGeometry();
    silhouetteGeometry.setAttribute("position", new THREE.BufferAttribute(silhouettePositions, 3));
    silhouetteGeometry.setAttribute("aSize", new THREE.BufferAttribute(silhouetteSizes, 1));
    silhouetteGeometry.setAttribute("aSeed", new THREE.BufferAttribute(silhouetteSeeds, 1));
    silhouetteGeometry.setAttribute("aKind", new THREE.BufferAttribute(silhouetteKinds, 1));
    silhouetteGeometry.setAttribute("aAngle", new THREE.BufferAttribute(silhouetteAngles, 1));
    silhouetteGeometry.setAttribute("aPhase", new THREE.BufferAttribute(silhouettePhases, 1));
    silhouetteGeometry.setAttribute("aDrift", new THREE.BufferAttribute(silhouetteDrifts, 1));

    const silhouetteUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uClickPulse: { value: 0 },
      uColorA: { value: new THREE.Color("#8de1ff") },
      uColorB: { value: new THREE.Color("#ffb973") },
      uAccent: { value: new THREE.Color("#ffd7a1") },
    };

    const silhouetteMaterial = new THREE.ShaderMaterial({
      uniforms: silhouetteUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aSeed;
        attribute float aKind;
        attribute float aAngle;
        attribute float aPhase;
        attribute float aDrift;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uPointer;
        uniform float uPointerStrength;
        uniform float uClickPulse;
        varying float vDepth;
        varying float vSeed;
        varying float vKind;
        varying float vAngle;
        varying float vPhase;

        void main() {
          vec3 p = position;
          float y = mod(p.y - uTime * (aDrift + p.z * 0.05) + 1.6, 3.2) - 1.6;
          float x = p.x + sin(uTime * (0.22 + aSeed * 0.2) + aPhase + y * 2.1) * 0.03;
          vec2 pos = vec2(x, y);

          vec2 delta = pos - uPointer;
          float dist = length(delta);
          float influence = exp(-dist * 3.4) * uPointerStrength;
          vec2 dir = normalize(delta + vec2(0.0001));
          pos += dir * influence * 0.08;

          float clickInfluence = exp(-dist * 7.5) * uClickPulse;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y, p.z, 1.0);
          gl_PointSize = aSize * uPixelRatio * (1.1 - p.z * 0.3) * (1.0 + clickInfluence * 0.12);
          vDepth = p.z;
          vSeed = aSeed;
          vKind = aKind;
          vAngle = aAngle + sin(uTime * 0.2 + aSeed * 6.0) * 0.2;
          vPhase = aPhase;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uAccent;
        varying float vDepth;
        varying float vSeed;
        varying float vKind;
        varying float vAngle;
        varying float vPhase;
        ${POINT_KERNEL_GLSL}

        float sdfCapsule(vec2 p, vec2 a, vec2 b, float r) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h) - r;
        }

        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float s = sin(vAngle);
          float c = cos(vAngle);
          vec2 p = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

          float shapeAlpha = 0.0;
          if (vKind < 0.5) {
            float d = sdfCapsule(p, vec2(-0.58, 0.0), vec2(0.58, 0.0), 0.28);
            shapeAlpha = smoothstep(0.09, -0.03, d);
          } else if (vKind < 1.5) {
            float theta = atan(p.y, p.x);
            float radius = length(p);
            float boundary = 0.52 + sin(theta * 8.0 + vPhase * 4.0) * 0.06;
            float shell = smoothstep(boundary + 0.05, boundary - 0.02, radius);
            float inner = smoothstep(0.22, 0.17, radius);
            shapeAlpha = max(shell - inner * 0.65, 0.0);
          } else {
            float theta = atan(p.y, p.x);
            float radius = length(p);
            float boundary =
              0.56 +
              sin(theta * 3.0 + vPhase * 2.4) * 0.08 +
              sin(theta * 7.0 - vPhase * 1.6) * 0.05;
            shapeAlpha = smoothstep(boundary + 0.05, boundary - 0.02, radius);
          }

          if (shapeAlpha <= 0.0001) discard;
          float kernel = pkPointAlpha(uv, vDepth, uTime, vSeed + vPhase * 0.2, 0.6, 0.2);
          float alpha = shapeAlpha * (0.2 + (1.0 - vDepth) * 0.24) * (0.82 + kernel * 0.38);

          vec3 color = mix(uColorA, uColorB, fract(vSeed * 1.7 + vKind * 0.23));
          color = mix(color, uAccent, 0.16 + 0.08 * sin(uTime * 0.4 + vSeed * 8.0));
          color = pkLiftColor(color, 0.33);

          gl_FragColor = vec4(color, min(alpha, 0.62));
        }
      `,
    });

    const silhouettePoints = new THREE.Points(silhouetteGeometry, silhouetteMaterial);
    scene.add(silhouettePoints);

    const primaryA = new THREE.Color();
    const primaryB = new THREE.Color();
    const secondaryA = new THREE.Color();
    const secondaryB = new THREE.Color();
    const accentA = new THREE.Color();
    const accentB = new THREE.Color();
    const highlightA = new THREE.Color();
    const highlightB = new THREE.Color();
    const resize = (): void => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);

      moteUniforms.uPixelRatio.value = dpr;
      veilUniforms.uPixelRatio.value = dpr;
      silhouetteUniforms.uPixelRatio.value = dpr;

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

    const motionScale = reducedMotion ? 0.55 : 1;
    let raf = 0;
    let start = performance.now();
    let last = start;

    const render = (now: number): void => {
      const delta = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const elapsed = (now - start) / 1000;
      const timeStep = delta * motionScale * BASE_TIME_SCALE;

      moteUniforms.uTime.value += timeStep;
      veilUniforms.uTime.value += timeStep;
      silhouetteUniforms.uTime.value += timeStep;

      const frame = getPaletteFrame(elapsed, styleSeed + 911);

      primaryA.set(frame.current.primary);
      primaryB.set(frame.next.primary);
      moteUniforms.uColorA.value.copy(primaryA).lerp(primaryB, frame.mix);

      secondaryA.set(frame.current.secondary);
      secondaryB.set(frame.next.secondary);
      moteUniforms.uColorB.value.copy(secondaryA).lerp(secondaryB, frame.mix);

      accentA.set(frame.current.accent);
      accentB.set(frame.next.accent);
      moteUniforms.uAccent.value.copy(accentA).lerp(accentB, frame.mix);

      highlightA.set(frame.current.highlight);
      highlightB.set(frame.next.highlight);
      moteUniforms.uHighlight.value.copy(highlightA).lerp(highlightB, frame.mix);

      veilUniforms.uColorA.value.copy(moteUniforms.uColorA.value).lerp(moteUniforms.uHighlight.value, 0.56);
      veilUniforms.uColorB.value.copy(moteUniforms.uColorB.value).lerp(moteUniforms.uHighlight.value, 0.74);

      silhouetteUniforms.uColorA.value.copy(moteUniforms.uColorB.value).lerp(moteUniforms.uHighlight.value, 0.2);
      silhouetteUniforms.uColorB.value.copy(moteUniforms.uAccent.value).lerp(moteUniforms.uHighlight.value, 0.22);
      silhouetteUniforms.uAccent.value.copy(moteUniforms.uHighlight.value);

      const pointer = pointerRef.current;
      const pointerX = pointer.x * camera.right;
      const pointerY = pointer.y;

      moteUniforms.uPointer.value.set(pointerX, pointerY);
      veilUniforms.uPointer.value.set(pointerX, pointerY);
      silhouetteUniforms.uPointer.value.set(pointerX, pointerY);

      moteUniforms.uPointerStrength.value = pointer.strength * 1.06;
      veilUniforms.uPointerStrength.value = pointer.strength * 0.46;
      silhouetteUniforms.uPointerStrength.value = pointer.strength * 0.78;

      const clickPulse = reducedMotion ? 0 : pointer.clickPulse;
      moteUniforms.uClickPulse.value = clickPulse;
      silhouetteUniforms.uClickPulse.value = clickPulse;

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

      scene.remove(motePoints);
      scene.remove(veilPoints);
      scene.remove(silhouettePoints);

      moteGeometry.dispose();
      moteMaterial.dispose();
      veilGeometry.dispose();
      veilMaterial.dispose();
      silhouetteGeometry.dispose();
      silhouetteMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [interactionMode, pointerRef, quality, reducedMotion, styleSeed]);

  return (
    <div
      ref={mountRef}
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
      aria-hidden
    />
  );
};

export default VolumetricBiofieldEffect;
