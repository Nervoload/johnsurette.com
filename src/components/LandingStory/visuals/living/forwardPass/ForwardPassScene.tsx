import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { clamp, damp, smoothstep } from "../core/math.ts";
import { denoiseFrame } from "./core/diffusion.ts";
import { CONV1_KERNELS } from "./core/kernels.ts";
import { CONV2_CHANNELS, HIDDEN_UNITS } from "./core/network.ts";
import { ForwardPassLayout, V3, deckCenter, forwardPassLayout } from "./core/layout.ts";
import {
  LIVING_FRAGMENT_COMMON,
  LIVING_VERTEX_COMMON,
  TONE,
  addPolyline,
  createLivingMaterial,
  createPointBuffers,
  createPointMaterial,
  createSegmentBuffers,
  createSegmentMaterial,
} from "../shaders/livingCommon.ts";
import type { LivingSceneProps } from "../sceneTypes";
import { ForwardPassContent, PreparedInput, prepareForwardPass } from "./forwardPassData";

// ---------------------------------------------------------------------------------------------
// Materials

const RELIEF_VERTEX = /* glsl */ `
${LIVING_VERTEX_COMMON}
attribute vec2 aCell;
uniform sampler2D uImageA;
uniform sampler2D uImageB;
uniform float uMixAB;
uniform float uSignalAmt;
uniform float uNoiseAmt;
uniform float uStep;
uniform float uGrid;
uniform float uCell;
uniform float uHeight;
uniform vec3 uOrigin;
uniform vec4 uKernel;
uniform float uKernelOn;
varying vec3 vColor;
varying float vShade;
varying float vKernel;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 uv = (aCell + 0.5) / uGrid;
  vec2 tuv = vec2(uv.x, 1.0 - uv.y);
  vec3 x0 = mix(texture2D(uImageA, tuv).rgb, texture2D(uImageB, tuv).rgb, uMixAB) * 2.0 - 1.0;
  vec2 seed = aCell * 1.37 + uStep * 17.31;
  vec3 eps = (vec3(hash(seed), hash(seed + 3.1), hash(seed + 7.7)) - 0.5) * 3.4;
  vec3 xt = uSignalAmt * x0 + uNoiseAmt * eps;
  vec3 color = clamp(xt * 0.5 + 0.5, 0.0, 1.0);
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  float height = 0.02 + lum * uHeight;
  float halfGrid = uGrid * 0.5;
  vec3 world = uOrigin + vec3(
    (aCell.x - halfGrid + 0.5) * uCell + position.x * uCell * 0.84,
    (halfGrid - aCell.y - 0.5) * uCell + position.y * uCell * 0.84,
    (position.z + 0.5) * height
  );
  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  vec3 n = normalize(normalMatrix * normal);
  vShade = 0.5 + 0.5 * max(dot(n, normalize(vec3(-0.35, 0.55, 0.76))), 0.0);
  vColor = color;
  float inKernel = step(uKernel.x, uv.x) * step(uv.x, uKernel.z) * step(uKernel.y, uv.y) * step(uv.y, uKernel.w);
  vKernel = inKernel * uKernelOn;
}
`;

const RELIEF_FRAGMENT = /* glsl */ `
${LIVING_FRAGMENT_COMMON}
uniform float uOpacity;
varying vec3 vColor;
varying float vShade;
varying float vKernel;
void main() {
  vec3 color = vColor * vShade * mix(1.0, 0.92, uThemeMix);
  color = mix(color, uSignal, vKernel * 0.65);
  livingWrite(color, uOpacity * mix(0.97, 0.9, uThemeMix));
}
`;

const DECK_VERTEX = /* glsl */ `
${LIVING_VERTEX_COMMON}
attribute float aIndex;
uniform vec3 uOrigin;
uniform vec3 uStepVec;
uniform float uSize;
varying vec2 vUv;
varying float vIndex;
void main() {
  vUv = uv;
  vIndex = aIndex;
  vec3 world = uOrigin + uStepVec * aIndex + vec3(position.x * uSize, position.y * uSize, 0.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
}
`;

const DECK_FRAGMENT = /* glsl */ `
${LIVING_FRAGMENT_COMMON}
uniform sampler2D uAtlas;
uniform float uTiles;
uniform vec3 uReveal;
uniform float uOpacity;
uniform float uFrame;
uniform float uIsolate;
uniform float uTone;
varying vec2 vUv;
varying float vIndex;
void main() {
  float v = texture2D(uAtlas, vec2((vIndex + clamp(vUv.x, 0.002, 0.998)) / uTiles, vUv.y)).r;
  float rowBands = (1.0 - vUv.y) * 8.0;
  float band = floor(rowBands);
  float across = mod(band, 2.0) < 0.5 ? vUv.x : 1.0 - vUv.x;
  float revealed = band < uReveal.x - 0.5 ? 1.0 : (abs(band - uReveal.x) < 0.5 ? step(across, uReveal.y) : 0.0);
  revealed = mix(1.0, revealed, uReveal.z);
  vec2 e = min(vUv, 1.0 - vUv);
  float frame = 1.0 - smoothstep(0.0, 0.014, min(e.x, e.y));
  float iso = uIsolate < -0.5 ? 1.0 : (abs(vIndex - uIsolate) < 0.5 ? 1.35 : 0.2);
  vec3 tone = livingTone(uTone);
  vec3 color = mix(tone * 0.6, tone, smoothstep(0.08, 0.7, v));
  color = mix(color, uInk, pow(v, 3.0) * 0.5);
  float body = v * revealed * mix(0.9, 0.95, uThemeMix);
  float alpha = (body + frame * uFrame + 0.025 * revealed) * uOpacity * iso;
  livingWrite(color, alpha);
}
`;

const createReliefGeometry = (grid: number): THREE.InstancedBufferGeometry => {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = box.index;
  geometry.setAttribute("position", box.getAttribute("position"));
  geometry.setAttribute("normal", box.getAttribute("normal"));
  const cells = new Float32Array(grid * grid * 2);
  for (let row = 0; row < grid; row += 1) {
    for (let col = 0; col < grid; col += 1) {
      cells[(row * grid + col) * 2] = col;
      cells[(row * grid + col) * 2 + 1] = row;
    }
  }
  geometry.setAttribute("aCell", new THREE.InstancedBufferAttribute(cells, 2));
  geometry.instanceCount = grid * grid;
  return geometry;
};

const createDeckGeometry = (count: number): THREE.InstancedBufferGeometry => {
  const plane = new THREE.PlaneGeometry(1, 1);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = plane.index;
  geometry.setAttribute("position", plane.getAttribute("position"));
  geometry.setAttribute("uv", plane.getAttribute("uv"));
  const index = new Float32Array(count);
  for (let i = 0; i < count; i += 1) index[i] = i;
  geometry.setAttribute("aIndex", new THREE.InstancedBufferAttribute(index, 1));
  geometry.instanceCount = count;
  return geometry;
};

let placeholder: THREE.DataTexture | null = null;
const placeholderTexture = () => {
  if (!placeholder) {
    placeholder = new THREE.DataTexture(new Uint8Array([24, 30, 46, 255]), 1, 1, THREE.RGBAFormat);
    placeholder.needsUpdate = true;
  }
  return placeholder;
};

const v3 = (value: V3, target = new THREE.Vector3()) => target.set(value[0], value[1], value[2]);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

// ---------------------------------------------------------------------------------------------

const ForwardPassScene: React.FC<LivingSceneProps<ForwardPassContent>> = ({ runtime, content }) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const shared = runtime.shared;
  const outputs = content.outputs;
  const rootRef = useRef<THREE.Group>(null);
  const prepared = useRef<Array<PreparedInput | undefined>>([]);
  const motion = useRef({ focus: -1.4, yaw: 0, pitch: 0, isolate: -1, isolateDeck: 0, isolateUntil: 0 });
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(() =>
    runtime.slotAspect < 0.82 ? "portrait" : "landscape",
  );
  const layout: ForwardPassLayout = useMemo(() => forwardPassLayout(orientation === "portrait" ? 0.5 : 1), [orientation]);

  useEffect(() => {
    let cancelled = false;
    void prepareForwardPass(
      content,
      (index, value) => {
        prepared.current[index] = value;
        runtime.invalidate();
      },
      () => cancelled,
    ).catch((error) => console.warn("[ForwardPass] could not prepare inputs", error));
    return () => {
      cancelled = true;
      prepared.current.forEach((item) => {
        item?.image.dispose();
        item?.conv1.dispose();
        item?.conv2.dispose();
      });
      prepared.current = [];
    };
  }, [content, runtime]);

  const grid = runtime.tier === "high" ? 64 : 40;

  const relief = useMemo(() => {
    const material = createLivingMaterial(shared, {
      vertexShader: RELIEF_VERTEX,
      fragmentShader: RELIEF_FRAGMENT,
      depthWrite: true,
      uniforms: {
        uImageA: { value: placeholderTexture() },
        uImageB: { value: placeholderTexture() },
        uMixAB: { value: 1 },
        uSignalAmt: { value: 0 },
        uNoiseAmt: { value: 1 },
        uStep: { value: 0 },
        uGrid: { value: grid },
        uCell: { value: layout.input.size / grid },
        uHeight: { value: layout.input.height },
        uOrigin: { value: v3(layout.input.origin) },
        uKernel: { value: new THREE.Vector4(0, 0, 0, 0) },
        uKernelOn: { value: 0 },
        uOpacity: { value: 1 },
      },
    });
    return { geometry: createReliefGeometry(grid), material };
  }, [grid, layout, shared]);

  const decks = useMemo(() => {
    const make = (count: number, deck: ForwardPassLayout["conv1"], tone: number) => ({
      geometry: createDeckGeometry(count),
      material: createLivingMaterial(shared, {
        vertexShader: DECK_VERTEX,
        fragmentShader: DECK_FRAGMENT,
        side: THREE.DoubleSide,
        uniforms: {
          uAtlas: { value: placeholderTexture() },
          uTiles: { value: count },
          uReveal: { value: new THREE.Vector3(0, 0, 0) },
          uOpacity: { value: 1 },
          uFrame: { value: 0.32 },
          uIsolate: { value: -1 },
          uTone: { value: tone },
          uOrigin: { value: v3(deck.origin) },
          uStepVec: { value: v3(deck.step) },
          uSize: { value: deck.size },
        },
      }),
    });
    return {
      conv1: make(CONV1_KERNELS.length, layout.conv1, TONE.signal),
      conv2: make(CONV2_CHANNELS, layout.conv2, TONE.signal2),
    };
  }, [layout, shared]);

  const nodes = useMemo(() => {
    const buffers = createPointBuffers(HIDDEN_UNITS + outputs.length);
    for (let i = 0; i < HIDDEN_UNITS; i += 1) {
      buffers.position.set(layout.dense(i, HIDDEN_UNITS), i * 3);
      buffers.size[i] = 0.06;
      buffers.tone[i] = TONE.signal2;
      buffers.seed[i] = i;
    }
    for (let o = 0; o < outputs.length; o += 1) {
      const index = HIDDEN_UNITS + o;
      buffers.position.set(layout.output(o, outputs.length), index * 3);
      buffers.size[index] = 0.1;
      buffers.tone[index] = TONE.signal;
      buffers.seed[index] = index;
    }
    buffers.count = HIDDEN_UNITS + outputs.length;
    buffers.commit(["position", "size", "tone", "seed", "activity"]);
    return { buffers, material: createPointMaterial(shared, { base: 0.45, halo: 0.9, sizeBoost: 0.9 }) };
  }, [layout, outputs.length, shared]);

  const edges = useMemo(() => {
    const buffers = createSegmentBuffers(CONV2_CHANNELS * HIDDEN_UNITS + HIDDEN_UNITS * outputs.length + 64);
    const conv2ToDense = buffers.count;
    for (let c = 0; c < CONV2_CHANNELS; c += 1) {
      const from = deckCenter(layout.conv2, c);
      for (let h = 0; h < HIDDEN_UNITS; h += 1) {
        addPolyline(buffers, [from, layout.dense(h, HIDDEN_UNITS)], { width: 0.6, intensity: 0.06, tone: TONE.dim });
      }
    }
    const denseToOut = buffers.count;
    for (let h = 0; h < HIDDEN_UNITS; h += 1) {
      for (let o = 0; o < outputs.length; o += 1) {
        addPolyline(buffers, [layout.dense(h, HIDDEN_UNITS), layout.output(o, outputs.length)], {
          width: 0.7,
          intensity: 0.08,
          tone: TONE.dim,
        });
      }
    }
    // Kernel outline (4) and its receptive-field cone to the first conv1 map (4); moved per frame.
    const kernel = buffers.count;
    for (let i = 0; i < 8; i += 1) {
      addPolyline(buffers, [[0, 0, 0], [0, 0, 0.001]], { width: i < 4 ? 1.6 : 0.9, intensity: 0, tone: TONE.signal });
    }
    const returnFirst = addPolyline(buffers, layout.returnPath(28), { width: 1.4, intensity: 0, tone: TONE.signal });
    const returnCount = buffers.count - returnFirst;
    buffers.commit(["start", "end", "param", "tone", "activity", "pulse"]);
    return {
      buffers,
      conv2ToDense,
      denseToOut,
      kernel,
      returnFirst,
      returnCount,
      material: createSegmentMaterial(shared, { pulseWidth: 0.09 }),
    };
  }, [layout, outputs.length, shared]);

  useEffect(
    () => () => {
      relief.geometry.dispose();
      relief.material.dispose();
    },
    [relief],
  );
  useEffect(
    () => () => {
      [decks.conv1, decks.conv2].forEach((deck) => {
        deck.geometry.dispose();
        deck.material.dispose();
      });
    },
    [decks],
  );
  useEffect(
    () => () => {
      nodes.buffers.geometry.dispose();
      nodes.material.dispose();
    },
    [nodes],
  );
  useEffect(
    () => () => {
      edges.buffers.geometry.dispose();
      edges.material.dispose();
    },
    [edges],
  );

  useEffect(() => {
    outputs.forEach((output, index) => {
      const label = runtime.labels.get(`out-${index}`);
      if (label) label.textContent = output.label;
    });
  }, [outputs, runtime]);

  useFrame((_, deltaWall) => {
    const root = rootRef.current;
    if (!root) return;
    const nextOrientation = runtime.slotAspect < 0.82 ? "portrait" : "landscape";
    if (nextOrientation !== orientation) {
      setOrientation(nextOrientation);
      return;
    }
    const dtWall = Math.min(deltaWall, 1 / 20);
    const clock = runtime.clock.state;
    const stage = clock.stageIndex;
    const t = clock.stageT;
    const count = Math.max(content.inputs.length, 1);
    const photo = ((clock.loopIndex % count) + count) % count;
    const previous = (photo - 1 + count) % count;
    const current = prepared.current[photo];
    const prior = prepared.current[previous] ?? current;
    const settle = clock.dt === 0;
    const reduced = runtime.reducedMotion;
    const pointer = runtime.pointer;

    // --- Camera and orbit -----------------------------------------------------------------
    const focusTarget = layout.focus(stage, t);
    motion.current.focus = settle ? focusTarget : damp(motion.current.focus, focusTarget, 2.2, dtWall);
    if (!pointer.dragging) {
      pointer.orbitYaw = damp(pointer.orbitYaw, 0, 1.4, dtWall);
      pointer.orbitPitch = damp(pointer.orbitPitch, 0, 1.4, dtWall);
    }
    const parallax = reduced ? 0 : 1;
    const yawTarget = layout.yaw + pointer.orbitYaw + pointer.slotX * 0.07 * parallax;
    const pitchTarget = pointer.orbitPitch - pointer.slotY * 0.04 * parallax;
    motion.current.yaw = settle ? yawTarget : damp(motion.current.yaw, yawTarget, 5, dtWall);
    motion.current.pitch = settle ? pitchTarget : damp(motion.current.pitch, pitchTarget, 5, dtWall);
    root.rotation.set(motion.current.pitch, motion.current.yaw, 0);
    const shot = layout.camera(motion.current.focus);
    camera.position.set(shot.position[0], shot.position[1], shot.position[2]);
    camera.lookAt(shot.target[0], shot.target[1], shot.target[2]);

    // --- Input relief: imagine (noise → photo), then hold ---------------------------------
    const ru = relief.material.uniforms;
    if (current) {
      ru.uImageB.value = current.image;
      ru.uImageA.value = prior?.image ?? current.image;
    }
    if (!current) {
      ru.uSignalAmt.value = 0;
      ru.uNoiseAmt.value = 0.3;
      ru.uStep.value = Math.floor(clock.phase * 6);
    } else if (stage === 0) {
      const leaving = t < 0.16;
      const frame = leaving ? denoiseFrame(1 - t / 0.16) : denoiseFrame((t - 0.16) / 0.84);
      ru.uMixAB.value = leaving ? 0 : 1;
      ru.uSignalAmt.value = frame.signal;
      ru.uNoiseAmt.value = frame.noise;
      ru.uStep.value = frame.step + (leaving ? 100 : 0);
    } else {
      ru.uMixAB.value = 1;
      ru.uSignalAmt.value = 1;
      ru.uNoiseAmt.value = 0;
    }

    // --- Kernel sweep over the input; conv1 fills band by band -----------------------------
    const sweep = stage === 1 ? t : stage > 1 ? 1 : 0;
    const bandFloat = sweep * 8;
    const band = Math.min(7, Math.floor(bandFloat));
    const across = bandFloat - band;
    const c1 = decks.conv1.material.uniforms;
    const c2 = decks.conv2.material.uniforms;
    if (current) {
      c1.uAtlas.value = stage === 0 && prior ? prior.conv1 : current.conv1;
      c2.uAtlas.value = stage <= 1 && prior ? prior.conv2 : current.conv2;
    }
    const fadeOut = stage === 0 ? 1 - smoothstep(0, 0.3, t) : 1;
    c1.uReveal.value.set(band, across, stage === 1 ? 1 : 0);
    c1.uOpacity.value = stage === 0 ? 0.18 + 0.82 * fadeOut : stage === 1 ? 1 : 0.8;
    const deepen = stage === 2 ? t : stage > 2 ? 1 : 0;
    const band2Float = deepen * 8;
    const band2 = Math.min(7, Math.floor(band2Float));
    c2.uReveal.value.set(band2, band2Float - band2, stage === 2 ? 1 : 0);
    c2.uOpacity.value = stage === 0 ? 0.18 + 0.82 * fadeOut : stage === 1 ? 0.18 : 1;

    const kernelOn = stage === 1 ? 1 : 0;
    const column = (band % 2 === 0 ? across : 1 - across) * (1 - 5 / 64);
    const row = (band * 8 + 1.5) / 64;
    ru.uKernel.value.set(column, row, column + 5 / 64, row + 5 / 64);
    ru.uKernelOn.value = kernelOn;

    const eb = edges.buffers;
    const input = layout.input;
    const cellX = (u: number) => input.origin[0] + (u - 0.5) * input.size;
    const cellY = (v: number) => input.origin[1] + (0.5 - v) * input.size;
    const kz = input.origin[2] + input.height * 0.75;
    const corners: V3[] = [
      [cellX(column), cellY(row), kz],
      [cellX(column + 5 / 64), cellY(row), kz],
      [cellX(column + 5 / 64), cellY(row + 5 / 64), kz],
      [cellX(column), cellY(row + 5 / 64), kz],
    ];
    const front = deckCenter(layout.conv1, 0);
    const mapU = column + 2.5 / 64;
    const mapV = row + 2.5 / 64;
    const coneTip: V3 = [
      front[0] + (mapU - 0.5) * layout.conv1.size,
      front[1] + (0.5 - mapV) * layout.conv1.size,
      front[2] + 0.002,
    ];
    for (let i = 0; i < 4; i += 1) {
      const index = edges.kernel + i;
      eb.start.set(corners[i], index * 3);
      eb.end.set(corners[(i + 1) % 4], index * 3);
      eb.param[index * 4 + 3] = kernelOn * 0.95;
      const cone = edges.kernel + 4 + i;
      eb.start.set(corners[i], cone * 3);
      eb.end.set(coneTip, cone * 3);
      eb.param[cone * 4 + 3] = kernelOn * 0.42;
    }

    // --- Dense and output ------------------------------------------------------------------
    const nb = nodes.buffers;
    const hidden = current?.result.hidden;
    const probabilities = current?.result.probabilities;
    const winner = current?.result.winner ?? 0;
    let hiddenMax = 1e-6;
    hidden?.forEach((value) => {
      hiddenMax = Math.max(hiddenMax, value);
    });
    const denseLit = stage === 3 ? smoothstep(0.35, 0.85, t) : stage === 4 ? 1 - smoothstep(0.6, 0.95, t) * 0.7 : 0;
    for (let h = 0; h < HIDDEN_UNITS; h += 1) nb.activity[h] = hidden ? (hidden[h] / hiddenMax) * denseLit * 1.4 : 0;
    const outLit = stage === 4 ? smoothstep(0.32, 0.55, t) : 0;
    for (let o = 0; o < outputs.length; o += 1) {
      const p = probabilities?.[o] ?? 0;
      nb.activity[HIDDEN_UNITS + o] = p * outLit * 2.2 + (o === winner ? outLit * 0.6 : 0);
    }
    nb.commit(["activity"]);

    const features = current?.result.features;
    const densePulse = stage === 3 && !reduced ? t * 1.25 - 0.1 : -1;
    for (let c = 0; c < CONV2_CHANNELS; c += 1) {
      const strength = features ? clamp(0.25 + features[c] * 0.35, 0, 1) : 0;
      for (let h = 0; h < HIDDEN_UNITS; h += 1) {
        const index = edges.conv2ToDense + c * HIDDEN_UNITS + h;
        eb.pulse[index * 2] = densePulse;
        eb.pulse[index * 2 + 1] = densePulse < 0 ? 0 : strength * 0.55;
        eb.activity[index] = stage === 3 ? 0.4 : 0;
      }
    }
    const outPulse = stage === 4 && !reduced ? t * 2.2 - 0.1 : -1;
    for (let h = 0; h < HIDDEN_UNITS; h += 1) {
      const lit = hidden ? hidden[h] / hiddenMax : 0;
      for (let o = 0; o < outputs.length; o += 1) {
        const index = edges.denseToOut + h * outputs.length + o;
        const toWinner = o === winner ? 1 : 0.35;
        eb.pulse[index * 2] = outPulse;
        eb.pulse[index * 2 + 1] = outPulse < 0 || outPulse > 1.2 ? 0 : lit * toWinner * 0.9;
        eb.activity[index] = stage === 4 ? lit * toWinner * outLit * 1.2 : 0;
      }
    }
    const returning = stage === 4 ? smoothstep(0.58, 0.68, t) * (1 - smoothstep(0.96, 1, t)) : 0;
    const returnCenter = stage === 4 ? (t - 0.6) / 0.38 : -1;
    for (let i = 0; i < edges.returnCount; i += 1) {
      const index = edges.returnFirst + i;
      eb.param[index * 4 + 3] = returning * 0.14;
      eb.pulse[index * 2] = returnCenter;
      eb.pulse[index * 2 + 1] = reduced ? 0 : returning * 1.4;
    }
    eb.commit(["start", "end", "param", "activity", "pulse"]);

    // --- Click a feature map to isolate it --------------------------------------------------
    root.updateMatrixWorld();
    const m = motion.current;
    if (pointer.clicks.length > 0) {
      const clicks = pointer.clicks.splice(0);
      const last = clicks[clicks.length - 1];
      const clickX = (last.ndcX * 0.5 + 0.5) * size.width;
      const clickY = (-last.ndcY * 0.5 + 0.5) * size.height;
      let best = -1;
      let bestDeck = 0;
      let bestDistance = last.touch ? 44 : 30;
      [layout.conv1, layout.conv2].forEach((deck, deckIndex) => {
        const n = deckIndex === 0 ? CONV1_KERNELS.length : CONV2_CHANNELS;
        for (let i = 0; i < n; i += 1) {
          v3(deckCenter(deck, i), tmpA);
          root.localToWorld(tmpA).project(camera);
          const x = (tmpA.x * 0.5 + 0.5) * size.width;
          const y = (-tmpA.y * 0.5 + 0.5) * size.height;
          const distance = Math.hypot(x - clickX, y - clickY) - deck.size * 60;
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
            bestDeck = deckIndex;
          }
        }
      });
      if (best >= 0 && !(m.isolate === best && m.isolateDeck === bestDeck)) {
        m.isolate = best;
        m.isolateDeck = bestDeck;
        m.isolateUntil = clock.phase + 8;
      } else {
        m.isolate = -1;
      }
    }
    if (m.isolate >= 0 && clock.phase > m.isolateUntil && !runtime.isEngaged()) m.isolate = -1;
    c1.uIsolate.value = m.isolate >= 0 && m.isolateDeck === 0 ? m.isolate : -1;
    c2.uIsolate.value = m.isolate >= 0 && m.isolateDeck === 1 ? m.isolate : -1;

    // --- Labels ------------------------------------------------------------------------------
    const place = (id: string, local: THREE.Vector3, opacity: number, tone?: "ink" | "muted" | "accent") => {
      const element = runtime.labels.get(id);
      if (!element) return;
      tmpB.copy(local);
      root.localToWorld(tmpB).project(camera);
      element.style.transform = `translate3d(${((tmpB.x * 0.5 + 0.5) * size.width).toFixed(1)}px, ${(
        (-tmpB.y * 0.5 + 0.5) * size.height
      ).toFixed(1)}px, 0)`;
      element.style.opacity = (tmpB.z < 1 ? opacity : 0).toFixed(3);
      if (tone && element.dataset.tone !== tone) element.dataset.tone = tone;
    };
    const setText = (id: string, text: string) => {
      const element = runtime.labels.get(id);
      if (element && element.textContent !== text) element.textContent = text;
    };
    const activeTone = (on: boolean) => (on ? "ink" : "muted");
    const placeLayer = (id: string, layer: "input" | "conv1" | "conv2" | "dense", active: boolean) => {
      const spec = layout.layerLabel(layer);
      const element = runtime.labels.get(id);
      if (element && element.dataset.align !== spec.align) element.dataset.align = spec.align;
      place(id, v3(spec.anchor, tmpA).clone(), active ? 0.95 : 0.5, activeTone(active));
    };
    setText(
      "layer-conv1",
      m.isolate >= 0 && m.isolateDeck === 0 ? `conv1 · ${CONV1_KERNELS[m.isolate].label}` : "conv1 · 8 filters, 5×5",
    );
    setText(
      "layer-conv2",
      m.isolate >= 0 && m.isolateDeck === 1 ? `conv2 · filter ${m.isolate + 1} of 16` : "conv2 · 16 filters, 3×3",
    );
    placeLayer("layer-input", "input", stage <= 1);
    placeLayer("layer-conv1", "conv1", stage === 1 || (m.isolate >= 0 && m.isolateDeck === 0));
    placeLayer("layer-conv2", "conv2", stage === 2 || (m.isolate >= 0 && m.isolateDeck === 1));
    placeLayer("layer-dense", "dense", stage === 3);
    outputs.forEach((output, o) => {
      const p = probabilities?.[o] ?? 0;
      setText(`out-${o}`, outLit > 0.05 ? `${output.label}  ${p.toFixed(2)}` : output.label);
      const node = layout.output(o, outputs.length);
      const isWinner = o === winner && outLit > 0.5;
      place(
        `out-${o}`,
        tmpA.set(node[0] + layout.outputLabelOffset[0], node[1] + layout.outputLabelOffset[1], node[2] + layout.outputLabelOffset[2]).clone(),
        0.55 + outLit * 0.45,
        isWinner ? "accent" : outLit > 0.05 ? "ink" : "muted",
      );
    });
  });

  return (
    <group ref={rootRef}>
      <mesh geometry={relief.geometry} material={relief.material} frustumCulled={false} renderOrder={1} />
      <mesh geometry={decks.conv2.geometry} material={decks.conv2.material} frustumCulled={false} renderOrder={2} />
      <mesh geometry={decks.conv1.geometry} material={decks.conv1.material} frustumCulled={false} renderOrder={3} />
      <mesh geometry={edges.buffers.geometry} material={edges.material} frustumCulled={false} renderOrder={4} />
      <points geometry={nodes.buffers.geometry} material={nodes.material} frustumCulled={false} renderOrder={5} />
    </group>
  );
};

export default ForwardPassScene;
