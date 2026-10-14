import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { clamp, damp, easeInOutCubic, mulberry32, smoothstep } from "../core/math.ts";
import { HH, HHState, createHHState, hhGlow, stepHH } from "./core/hodgkinHuxley.ts";
import { Circuit, createCircuit, resetCircuit, stepCircuit, stimulate } from "./core/izhikevich.ts";
import { V3, buildPyramidalNeuron, pointAlong } from "./core/morphology.ts";
import { COLUMN, CORTICAL_LAYERS, buildColumnPoints, layerBands } from "./core/column.ts";
import { BRAIN_LOBES, BrainPoints, decodeBrainPoints } from "./core/brainFormat.ts";
import {
  LIVING_FRAGMENT_COMMON,
  LIVING_VERTEX_COMMON,
  POINT_FRAGMENT,
  TONE,
  Vec3Tuple,
  addPolyline,
  createLivingMaterial,
  createPointBuffers,
  createPointMaterial,
  createSegmentBuffers,
  createSegmentMaterial,
} from "../shaders/livingCommon.ts";
import type { LivingSceneProps } from "../sceneTypes";

export interface BrainScalesContent {
  readonly pointsSrc: string;
}

// ---------------------------------------------------------------------------------------------
// Powers of ten (well, of eight): each level is drawn at scale R^(level - zoom). The level below
// sits at an anchor inside the level above, so zooming out reveals the context around it.

const R = 8;
const ZOOM_SECONDS = 1.4;
export const BRAIN_STAGE_DURATIONS = [6.0, 5.5, 5.5, 5.5, 2.4] as const;

/** Continuous zoom level 0 (neuron) … 3 (whole brain). */
export const zoomFor = (stage: number, t: number): number => {
  if (stage === 0) return 0;
  if (stage <= 3) return stage - 1 + easeInOutCubic(clamp((t * BRAIN_STAGE_DURATIONS[stage]) / ZOOM_SECONDS));
  return 3 * (1 - easeInOutCubic(t));
};

export const levelOpacity = (level: number, zoom: number): number => {
  if (level === 0) return 1 - smoothstep(0.25, 0.7, zoom);
  const fadeIn = smoothstep(level - 0.75, level - 0.2, zoom);
  if (level === 3) return fadeIn;
  return fadeIn * (1 - smoothstep(level + 0.25, level + 0.7, zoom));
};

const SIM_MS_PER_SECOND = { neuron: 4, circuit: 50 } as const;
const HH_DT = 0.01;
const HH_SAMPLE_MS = 0.05;
const HH_SAMPLES = 320; // 16 ms of history
const HH_PULSE_EVERY_MS = 6;
const NODE_DELAY_MS = 0.32;
const CIRCUIT_DT = 0.5;
const CIRCUIT_EXCITATORY = 16;
const CIRCUIT_INHIBITORY = 4;

// ---------------------------------------------------------------------------------------------
// Neuron membrane material

const MAX_NODES = 12;

const NEURON_VERTEX = /* glsl */ `
${LIVING_VERTEX_COMMON}
attribute float aDist;
attribute float aKind;
varying float vDist;
varying float vKind;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vDist = aDist;
  vKind = aKind;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const NEURON_FRAGMENT = /* glsl */ `
${LIVING_FRAGMENT_COMMON}
uniform float uOpacity;
uniform float uSomaGlow;
uniform float uNodeDist[${MAX_NODES}];
uniform float uNodeGlow[${MAX_NODES}];
uniform float uRipple;
varying float vDist;
varying float vKind;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.6);
  float glow = 0.0;
  if (vKind < 0.5) {
    glow = uSomaGlow;
  } else if (vKind < 1.5) {
    glow = uSomaGlow * exp(-vDist * 1.4);
  } else if (vKind < 2.5) {
    glow = vDist < 0.17 ? uSomaGlow : 0.0;
    for (int i = 0; i < ${MAX_NODES}; i++) {
      float d = (vDist - uNodeDist[i]) / 0.045;
      glow += uNodeGlow[i] * exp(-d * d);
    }
  }
  vec3 membrane = mix(uDim, uInk, mix(0.55, 0.32, uThemeMix));
  vec3 color = mix(membrane, uSignal, clamp(glow * 1.2, 0.0, 1.0));
  color = mix(color, uInk, clamp(glow - 0.75, 0.0, 1.0) * uThemeMix);
  float alpha;
  if (vKind > 2.5) {
    // Myelin sheath: a pale, translucent wrap.
    color = mix(uSignal2, uInk, 0.35);
    alpha = (0.22 + rim * 0.45) * mix(1.0, 0.9, uThemeMix);
  } else {
    alpha = mix(0.88, 0.4 + rim * 0.55, uThemeMix) + glow * 0.8 + uRipple * (vKind < 0.5 ? 0.6 : 0.0);
  }
  livingWrite(color, alpha * uOpacity);
}
`;

interface NeuronGeometry {
  geometry: THREE.BufferGeometry;
  nodes: number[];
  axonPoints: V3[];
}

const buildNeuronGeometry = (radial: number): NeuronGeometry => {
  const morph = buildPyramidalNeuron();
  const positions: number[] = [];
  const normals: number[] = [];
  const dists: number[] = [];
  const kinds: number[] = [];
  const kindId = { apical: 1, oblique: 1, tuft: 1, basal: 1, axon: 2, terminal: 2 } as const;

  const tube = (points: V3[], r0: number, r1: number, distStart: number, kind: number, from = 0, to = 1) => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, "centripetal");
    const total = curve.getLength();
    const segments = Math.max(4, Math.round(points.length * 2.5 * (to - from)));
    const frames = curve.computeFrenetFrames(segments, false);
    const ring = (i: number) => {
      const u = from + ((to - from) * i) / segments;
      const center = curve.getPointAt(u);
      const frameIndex = Math.min(segments, Math.round(((u - from) / Math.max(to - from, 1e-6)) * segments));
      const n = frames.normals[frameIndex];
      const b = frames.binormals[frameIndex];
      const radius = THREE.MathUtils.lerp(r0, r1, u);
      const vertices: Array<{ p: THREE.Vector3; n: THREE.Vector3 }> = [];
      for (let j = 0; j < radial; j += 1) {
        const angle = (j / radial) * Math.PI * 2;
        const dir = n.clone().multiplyScalar(Math.cos(angle)).addScaledVector(b, Math.sin(angle));
        vertices.push({ p: center.clone().addScaledVector(dir, radius), n: dir });
      }
      return { vertices, dist: distStart + u * total };
    };
    let previous = ring(0);
    for (let i = 1; i <= segments; i += 1) {
      const next = ring(i);
      for (let j = 0; j < radial; j += 1) {
        const k = (j + 1) % radial;
        const quad = [
          [previous.vertices[j], previous.dist],
          [next.vertices[j], next.dist],
          [next.vertices[k], next.dist],
          [previous.vertices[j], previous.dist],
          [next.vertices[k], next.dist],
          [previous.vertices[k], previous.dist],
        ] as const;
        quad.forEach(([vertex, dist]) => {
          positions.push(vertex.p.x, vertex.p.y, vertex.p.z);
          normals.push(vertex.n.x, vertex.n.y, vertex.n.z);
          dists.push(dist);
          kinds.push(kind);
        });
      }
      previous = next;
    }
  };

  morph.branches.forEach((branch) => tube(branch.points, branch.radiusStart, branch.radiusEnd, branch.distStart, kindId[branch.kind]));
  morph.myelin.forEach(([from, to]) => tube(morph.axonPoints, 0.024, 0.022, 0, 3, from / morph.axonLength, to / morph.axonLength));

  const soma = new THREE.IcosahedronGeometry(morph.somaRadius, 2);
  const sp = soma.getAttribute("position");
  const sn = soma.getAttribute("normal");
  for (let i = 0; i < sp.count; i += 1) {
    positions.push(sp.getX(i), sp.getY(i) * 1.15, sp.getZ(i));
    normals.push(sn.getX(i), sn.getY(i), sn.getZ(i));
    dists.push(0);
    kinds.push(0);
  }
  soma.dispose();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("aDist", new THREE.Float32BufferAttribute(dists, 1));
  geometry.setAttribute("aKind", new THREE.Float32BufferAttribute(kinds, 1));
  return { geometry, nodes: morph.nodes.slice(0, MAX_NODES), axonPoints: morph.axonPoints };
};

// ---------------------------------------------------------------------------------------------
// Column and brain point shaders: activity is computed on the GPU from time, layer/region and seed.

const COLUMN_VERTEX = /* glsl */ `
${LIVING_VERTEX_COMMON}
attribute float aSize;
attribute float aTone;
attribute float aActivity;
attribute float aSeed;
uniform float uOpacity;
uniform float uSizeBoost;
uniform float uGain;
varying float vTone;
varying float vActivity;
varying float vSeed;
float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
void main() {
  float layer = aActivity; // layer index lives in aActivity for this cloud
  float freq = layer < 0.5 ? 0.35 : (layer < 2.5 ? 1.6 : (layer < 3.5 ? 1.15 : 0.55));
  float wave = 0.5 + 0.5 * sin(6.28318 * freq * uTime - position.x * 3.0 + aSeed * 1.7);
  float spike = step(0.962, hash(aSeed * 91.7 + floor(uTime * 5.0 + aSeed * 7.0)));
  float act = (pow(wave, 6.0) * 0.55 + spike * 0.85) * uGain;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float px = aSize * uPxScale / max(-mv.z, 0.001) * (1.0 + act * uSizeBoost);
  gl_PointSize = clamp(px, 1.0, uMaxPointPx * uDpr);
  vTone = aTone;
  vActivity = act;
  vSeed = aSeed;
}
`;

const BRAIN_VERTEX = /* glsl */ `
${LIVING_VERTEX_COMMON}
attribute float aSize;
attribute float aTone;
attribute float aActivity;
attribute float aSeed;
uniform float uOpacity;
uniform float uSizeBoost;
uniform float uGain;
varying float vTone;
varying float vActivity;
varying float vSeed;
float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
void main() {
  float lobe = aActivity;
  float travel = 0.5 + 0.5 * sin(6.28318 * 0.32 * uTime - position.x * 2.3 + lobe * 1.3);
  float flicker = step(0.955, hash(aSeed * 57.3 + floor(uTime * 4.0 + aSeed * 9.0)));
  float act = (pow(travel, 7.0) * 0.8 + flicker * 0.75) * uGain;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float px = aSize * uPxScale / max(-mv.z, 0.001) * (1.0 + act * uSizeBoost);
  gl_PointSize = clamp(px, 1.0, uMaxPointPx * uDpr);
  vTone = aTone;
  vActivity = act;
  vSeed = aSeed;
}
`;

const LOBE_TONES = [TONE.signal, TONE.signal2, TONE.warm, TONE.amber, TONE.mint, TONE.dim];

// ---------------------------------------------------------------------------------------------
// Helpers

const bezier = (p0: V3, p1: V3, p2: V3, p3: V3, samples: number): Vec3Tuple[] => {
  const out: Vec3Tuple[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const a = (1 - t) ** 3;
    const b = 3 * (1 - t) ** 2 * t;
    const c = 3 * (1 - t) * t * t;
    const d = t ** 3;
    out.push([
      a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
      a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
      a * p0[2] + b * p1[2] + c * p2[2] + d * p3[2],
    ]);
  }
  return out;
};

const quadratic = (p0: V3, control: V3, p2: V3, samples: number): Vec3Tuple[] => {
  const out: Vec3Tuple[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const a = (1 - t) ** 2;
    const b = 2 * (1 - t) * t;
    const c = t * t;
    out.push([a * p0[0] + b * control[0] + c * p2[0], a * p0[1] + b * control[1] + c * p2[1], a * p0[2] + b * control[2] + c * p2[2]]);
  }
  return out;
};

/** Brain points in scene space: x = posterior→anterior flipped so frontal faces left, y up, z toward camera. */
interface BrainScene {
  count: number;
  position: Float32Array;
  lobe: Float32Array;
  tone: Float32Array;
  seed: Float32Array;
  anchor: V3;
  lobeCentroids: Array<V3 | null>;
  arcs: Array<{ from: V3; to: V3; inter: boolean }>;
}

const BRAIN_SCALE = 2.45 / 180;
const BRAIN_TILT = new THREE.Euler(0.32, -0.42, 0, "YXZ");

const buildBrainScene = (points: BrainPoints, arcCount: number): BrainScene => {
  const center = [(points.min[0] + points.max[0]) / 2, (points.min[1] + points.max[1]) / 2, (points.min[2] + points.max[2]) / 2];
  const rotation = new THREE.Matrix4().makeRotationFromEuler(BRAIN_TILT);
  const v = new THREE.Vector3();
  const toScene = (x: number, y: number, z: number, out: THREE.Vector3) =>
    out.set(-(y - center[1]) * BRAIN_SCALE, (z - center[2]) * BRAIN_SCALE, -(x - center[0]) * BRAIN_SCALE).applyMatrix4(rotation);

  const position = new Float32Array(points.count * 3);
  const lobe = new Float32Array(points.count);
  const tone = new Float32Array(points.count);
  const seed = new Float32Array(points.count);
  const rng = mulberry32(86);
  const sums = BRAIN_LOBES.map(() => [0, 0, 0, 0]);
  let anchorIndex = 0;
  let anchorBest = Infinity;
  for (let i = 0; i < points.count; i += 1) {
    const x = points.position[i * 3];
    const y = points.position[i * 3 + 1];
    const z = points.position[i * 3 + 2];
    toScene(x, y, z, v);
    position.set([v.x, v.y, v.z], i * 3);
    const lobeId = points.region[i] & 7;
    lobe[i] = lobeId;
    tone[i] = LOBE_TONES[lobeId] ?? TONE.signal;
    seed[i] = rng();
    if ((points.region[i] >> 3) === 0) {
      const sum = sums[lobeId];
      sum[0] += v.x;
      sum[1] += v.y;
      sum[2] += v.z;
      sum[3] += 1;
    }
    // Where the cortical column sits: left hemisphere, near the top of the central region.
    const d = (x + 32) ** 2 + (y + 18) ** 2 + (z - 68) ** 2;
    if (d < anchorBest) {
      anchorBest = d;
      anchorIndex = i;
    }
  }
  const anchor: V3 = [position[anchorIndex * 3], position[anchorIndex * 3 + 1], position[anchorIndex * 3 + 2]];
  const lobeCentroids = sums.map((sum) => (sum[3] > 20 ? ([sum[0] / sum[3], sum[1] / sum[3], sum[2] / sum[3] + 0.25] as V3) : null));

  const arcs: BrainScene["arcs"] = [];
  let guard = 0;
  while (arcs.length < arcCount && guard < arcCount * 20) {
    guard += 1;
    const a = Math.floor(rng() * points.count);
    const b = Math.floor(rng() * points.count);
    const lobeA = points.region[a] & 7;
    const lobeB = points.region[b] & 7;
    const inter = points.region[a] >> 3 !== points.region[b] >> 3;
    if (lobeA === lobeB && !inter) continue;
    if (lobeA === 5 || lobeB === 5) continue;
    arcs.push({
      from: [position[a * 3], position[a * 3 + 1], position[a * 3 + 2]],
      to: [position[b * 3], position[b * 3 + 1], position[b * 3 + 2]],
      inter,
    });
  }
  return { count: points.count, position, lobe, tone, seed, anchor, lobeCentroids, arcs };
};

// ---------------------------------------------------------------------------------------------

const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();

interface NeuronSim {
  state: HHState;
  time: number;
  samples: Float32Array;
  head: number;
  sinceSample: number;
  injections: number[];
  rippleAt: number;
}

const createNeuronSim = (): NeuronSim => ({
  state: createHHState(),
  time: 0,
  samples: new Float32Array(HH_SAMPLES).fill(HH.rest),
  head: 0,
  sinceSample: 0,
  injections: [],
  rippleAt: -10,
});

const neuronCurrent = (sim: NeuronSim): number => {
  const sinceScheduled = (sim.time + HH_PULSE_EVERY_MS - 1.5) % HH_PULSE_EVERY_MS;
  let current = sinceScheduled < 1 ? 11 : 0;
  for (const at of sim.injections) if (sim.time >= at && sim.time < at + 1) current += 16;
  return current;
};

const advanceNeuron = (sim: NeuronSim, ms: number) => {
  let remaining = Math.min(ms, 40);
  while (remaining > 1e-9) {
    const dt = Math.min(HH_DT, remaining);
    stepHH(sim.state, neuronCurrent(sim), dt);
    sim.time += dt;
    sim.sinceSample += dt;
    remaining -= dt;
    if (sim.sinceSample >= HH_SAMPLE_MS) {
      sim.sinceSample -= HH_SAMPLE_MS;
      sim.head = (sim.head + 1) % HH_SAMPLES;
      sim.samples[sim.head] = sim.state.v;
    }
  }
  sim.injections = sim.injections.filter((at) => sim.time < at + 2);
};

/** Membrane voltage `delayMs` ago, from the sample ring. */
const voltageAgo = (sim: NeuronSim, delayMs: number): number => {
  const steps = Math.min(HH_SAMPLES - 1, Math.round(delayMs / HH_SAMPLE_MS));
  return sim.samples[(sim.head - steps + HH_SAMPLES) % HH_SAMPLES];
};

interface CircuitSim {
  circuit: Circuit;
  pending: Float32Array;
  lastSpike: Float32Array; // visual seconds
  synapseSpike: Float32Array;
  carry: number;
  visualTime: number;
}

const createCircuitSim = (): CircuitSim => {
  const circuit = createCircuit(CIRCUIT_EXCITATORY, CIRCUIT_INHIBITORY, 1907);
  return {
    circuit,
    pending: new Float32Array(circuit.neurons.length),
    lastSpike: new Float32Array(circuit.neurons.length).fill(-10),
    synapseSpike: new Float32Array(circuit.synapses.length).fill(-10),
    carry: 0,
    visualTime: 0,
  };
};

const advanceCircuit = (sim: CircuitSim, visualSeconds: number) => {
  sim.carry += visualSeconds * SIM_MS_PER_SECOND.circuit;
  let steps = 0;
  while (sim.carry >= CIRCUIT_DT && steps < 400) {
    sim.carry -= CIRCUIT_DT;
    steps += 1;
    sim.visualTime += CIRCUIT_DT / SIM_MS_PER_SECOND.circuit;
    const spiked = stepCircuit(sim.circuit, CIRCUIT_DT, sim.pending);
    for (const index of spiked) {
      sim.lastSpike[index] = sim.visualTime;
      for (const s of sim.circuit.outgoing[index]) sim.synapseSpike[s] = sim.visualTime;
    }
  }
};

const resetCircuitSim = (sim: CircuitSim) => {
  resetCircuit(sim.circuit);
  sim.pending.fill(0);
  sim.lastSpike.fill(-10);
  sim.synapseSpike.fill(-10);
  sim.carry = 0;
  sim.visualTime = 0;
};

// ---------------------------------------------------------------------------------------------

const BrainScalesScene: React.FC<LivingSceneProps<BrainScalesContent>> = ({ runtime, content }) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const shared = runtime.shared;
  const rootRef = useRef<THREE.Group>(null);
  const levelRefs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const [brain, setBrain] = useState<BrainScene | null>(null);
  const motion = useRef({ yaw: 0, pitch: 0, offsetX: -0.55, offsetY: 0 });
  const simRef = useRef({ neuron: createNeuronSim(), circuit: createCircuitSim(), epoch: -1, loop: -1, stage: -1 });

  // --- Level 0: one pyramidal neuron --------------------------------------------------------
  const neuron = useMemo(() => {
    const built = buildNeuronGeometry(runtime.tier === "high" ? 7 : 5);
    const nodeDist = new Array(MAX_NODES).fill(-10);
    built.nodes.forEach((d, i) => {
      nodeDist[i] = d;
    });
    const material = createLivingMaterial(shared, {
      vertexShader: NEURON_VERTEX,
      fragmentShader: NEURON_FRAGMENT,
      depthWrite: true,
      uniforms: {
        uOpacity: { value: 1 },
        uSomaGlow: { value: 0 },
        uNodeDist: { value: nodeDist },
        uNodeGlow: { value: new Array(MAX_NODES).fill(0) },
        uRipple: { value: 0 },
      },
    });
    return { ...built, material };
  }, [runtime.tier, shared]);

  const scope = useMemo(() => {
    const buffers = createSegmentBuffers(HH_SAMPLES + 40);
    // Axis at rest and a +40 mV guide, then the trace itself (rewritten per frame).
    addPolyline(buffers, [[0.78, -0.2, 0], [2.05, -0.2, 0]], { width: 0.8, intensity: 0.35, tone: TONE.dim });
    addPolyline(buffers, [[0.78, 0.7, 0], [2.05, 0.7, 0]], { width: 0.6, intensity: 0.16, tone: TONE.dim });
    const trace = buffers.count;
    for (let i = 0; i < HH_SAMPLES - 1; i += 1) {
      addPolyline(buffers, [[0, 0, 0], [0, 0, 0.0001]], { width: 1.6, intensity: 0.9, tone: TONE.signal, t0: i / HH_SAMPLES, t1: (i + 1) / HH_SAMPLES });
    }
    const ripple = buffers.count;
    const ring: Vec3Tuple[] = [];
    for (let i = 0; i <= 24; i += 1) ring.push([Math.cos((i / 24) * Math.PI * 2), Math.sin((i / 24) * Math.PI * 2), 0]);
    addPolyline(buffers, ring, { width: 1.2, intensity: 0, tone: TONE.signal });
    buffers.commit(["start", "end", "param", "tone", "activity", "pulse"]);
    return { buffers, trace, ripple, material: createSegmentMaterial(shared, { depthTest: false }) };
  }, [shared]);

  // --- Level 1: a small circuit ---------------------------------------------------------------
  const circuitLayout = useMemo(() => {
    const rng = mulberry32(1906);
    const count = CIRCUIT_EXCITATORY + CIRCUIT_INHIBITORY;
    const positions: V3[] = [[0, 0, 0]];
    let guard = 0;
    while (positions.length < count && guard < 5000) {
      guard += 1;
      const p: V3 = [(rng() - 0.5) * 2.3, (rng() - 0.5) * 1.7, (rng() - 0.5) * 0.6];
      if (Math.hypot(p[0] / 1.15, p[1] / 0.85) > 1) continue;
      if (positions.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 0.3)) continue;
      positions.push(p);
    }
    return positions;
  }, []);

  const circuitDraw = useMemo(() => {
    const sim = simRef.current.circuit;
    const points = createPointBuffers(circuitLayout.length);
    circuitLayout.forEach((p, i) => {
      points.position.set(p, i * 3);
      const excitatory = sim.circuit.neurons[i].excitatory;
      points.size[i] = excitatory ? 0.07 : 0.055;
      points.tone[i] = excitatory ? TONE.signal : TONE.signal2;
      points.seed[i] = i;
    });
    points.count = circuitLayout.length;
    points.commit(["position", "size", "tone", "seed", "activity"]);

    const segments = createSegmentBuffers(circuitLayout.length * 6 + sim.circuit.synapses.length * 9);
    // Each cell as a little glyph: pyramids get an apical dendrite toward the pia (+y).
    circuitLayout.forEach((p, i) => {
      const excitatory = sim.circuit.neurons[i].excitatory;
      const style = { width: 0.9, intensity: 0.3, tone: excitatory ? TONE.ink : TONE.signal2 };
      if (excitatory) {
        addPolyline(segments, [p, [p[0] + 0.01, p[1] + 0.17, p[2]]], style);
        addPolyline(segments, [p, [p[0] - 0.07, p[1] - 0.06, p[2]]], style);
        addPolyline(segments, [p, [p[0] + 0.07, p[1] - 0.06, p[2]]], style);
        addPolyline(segments, [p, [p[0] + 0.01, p[1] - 0.15, p[2]]], { ...style, intensity: 0.2 });
      } else {
        for (let k = 0; k < 5; k += 1) {
          const a = (k / 5) * Math.PI * 2;
          addPolyline(segments, [p, [p[0] + Math.cos(a) * 0.07, p[1] + Math.sin(a) * 0.07, p[2]]], style);
        }
      }
    });
    const synapseFirst = segments.count;
    const SEG = 8;
    sim.circuit.synapses.forEach((synapse, index) => {
      const a = circuitLayout[synapse.pre];
      const b = circuitLayout[synapse.post];
      const from: V3 = [a[0], a[1] - 0.12, a[2]];
      const mid: V3 = [(from[0] + b[0]) / 2, (from[1] + b[1]) / 2, (from[2] + b[2]) / 2];
      const dx = b[0] - from[0];
      const dy = b[1] - from[1];
      const bend = (index % 2 === 0 ? 1 : -1) * 0.22;
      const control: V3 = [mid[0] - dy * bend, mid[1] + dx * bend, mid[2] + 0.08];
      addPolyline(segments, quadratic(from, control, b, SEG), {
        width: 1,
        intensity: 0.2,
        tone: synapse.excitatory ? TONE.signal : TONE.signal2,
      });
    });
    segments.commit(["start", "end", "param", "tone", "activity", "pulse"]);
    return {
      points,
      segments,
      synapseFirst,
      synapseSegments: SEG,
      pointMaterial: createPointMaterial(shared, { base: 0.5, halo: 0.9, sizeBoost: 1.1 }),
      segmentMaterial: createSegmentMaterial(shared, { pulseWidth: 0.12 }),
    };
  }, [circuitLayout, shared]);

  // --- Level 2: cortical column ---------------------------------------------------------------
  const column = useMemo(() => {
    const count = Math.round(10000 * runtime.density);
    const built = buildColumnPoints(count);
    const buffers = createPointBuffers(count + 16);
    buffers.position.set(built.position);
    for (let i = 0; i < count; i += 1) {
      buffers.size[i] = 0.016 * built.size[i];
      buffers.tone[i] = built.inhibitory[i] ? TONE.signal2 : TONE.signal;
      buffers.activity[i] = built.layer[i];
      buffers.seed[i] = built.seed[i];
    }
    buffers.count = count;
    buffers.commit(["position", "size", "tone", "activity", "seed"]);
    const material = createLivingMaterial(shared, {
      vertexShader: COLUMN_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      uniforms: {
        uOpacity: { value: 1 },
        uBase: { value: 0.32 },
        uHalo: { value: 0.5 },
        uSizeBoost: { value: 0.9 },
        uGain: { value: 1 },
        uHot: { value: shared.uSignal.value },
      },
    });

    const bands = layerBands();
    const w = COLUMN.width / 2;
    const h = COLUMN.height / 2;
    const d = COLUMN.depth / 2;
    const lines = createSegmentBuffers(256 + 10 * 30 + 260);
    const box: Array<[V3, V3]> = [
      [[-w, -h, d], [w, -h, d]], [[-w, h, d], [w, h, d]], [[-w, -h, d], [-w, h, d]], [[w, -h, d], [w, h, d]],
      [[-w, -h, -d], [w, -h, -d]], [[-w, h, -d], [w, h, -d]], [[-w, -h, -d], [-w, h, -d]], [[w, -h, -d], [w, h, -d]],
      [[-w, -h, d], [-w, -h, -d]], [[w, -h, d], [w, -h, -d]], [[-w, h, d], [-w, h, -d]], [[w, h, d], [w, h, -d]],
    ];
    box.forEach(([a, b]) => addPolyline(lines, [a, b], { width: 0.8, intensity: 0.28, tone: TONE.dim }));
    bands.slice(0, -1).forEach((band) => {
      addPolyline(lines, [[-w, band.bottom, d], [w, band.bottom, d]], { width: 0.6, intensity: 0.2, tone: TONE.dim });
      addPolyline(lines, [[-w, band.bottom, d], [-w, band.bottom, -d]], { width: 0.6, intensity: 0.2, tone: TONE.dim });
    });

    // Apical dendrites of pyramidal cells, all pointing to the pia: the columnar texture of cortex.
    const strokeRng = mulberry32(1888);
    let strokes = 0;
    for (let i = 0; i < count && strokes < 220; i += 1) {
      const layerIndex = built.layer[i];
      if (built.inhibitory[i] || !(layerIndex === 1 || layerIndex === 2 || layerIndex === 4 || layerIndex === 5)) continue;
      if (strokeRng() > (layerIndex === 4 ? 0.18 : 0.04)) continue;
      const x = built.position[i * 3];
      const y = built.position[i * 3 + 1];
      const z = built.position[i * 3 + 2];
      const reach = layerIndex === 4 ? 0.55 + strokeRng() * 0.35 : 0.12 + strokeRng() * 0.22;
      const top = Math.min(h - 0.02, y + reach);
      addPolyline(lines, [[x, y, z], [x + (strokeRng() - 0.5) * 0.02, top, z]], {
        width: layerIndex === 4 ? 0.7 : 0.5,
        intensity: layerIndex === 4 ? 0.16 : 0.1,
        tone: TONE.ink,
      });
      strokes += 1;
    }

    // Long-range projections: L5 pyramids to brainstem / spinal cord, L6 to the thalamus.
    const projections: Array<{ first: number; count: number; offset: number; kind: 5 | 6; source: number }> = [];
    const pos = (i: number): V3 => [built.position[i * 3], built.position[i * 3 + 1], built.position[i * 3 + 2]];
    built.l5Sources.forEach((source, k) => {
      const p = pos(source);
      const target: V3 = [-1.7 - k * 0.09, -1.6 - k * 0.04, 0.7 + k * 0.05];
      const first = addPolyline(lines, bezier(p, [p[0], -h - 0.55, p[2]], [target[0] + 0.55, target[1] + 0.55, target[2]], target, 26), {
        width: 1.1,
        intensity: 0.16,
        tone: TONE.warm,
      });
      projections.push({ first, count: 26, offset: k * 0.37, kind: 5, source });
    });
    built.l6Sources.forEach((source, k) => {
      const p = pos(source);
      const target: V3 = [1.7 + k * 0.08, -1.5 - k * 0.05, 0.5];
      const first = addPolyline(lines, bezier(p, [p[0], -h - 0.45, p[2]], [target[0] - 0.55, target[1] + 0.5, target[2]], target, 26), {
        width: 1.1,
        intensity: 0.16,
        tone: TONE.amber,
      });
      projections.push({ first, count: 26, offset: 0.2 + k * 0.53, kind: 6, source });
    });
    lines.commit(["start", "end", "param", "tone", "activity", "pulse"]);
    const anchor: V3 = [0.32, (bands[1].center + bands[2].center) / 2, 0.22];
    return {
      buffers,
      material,
      lines,
      projections,
      anchor,
      bands,
      lineMaterial: createSegmentMaterial(shared, { pulseWidth: 0.07 }),
    };
  }, [runtime.density, shared]);

  // --- Level 3: whole brain -------------------------------------------------------------------
  useEffect(() => {
    const controller = new AbortController();
    fetch(content.pointsSrc, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`brain points ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const points = decodeBrainPoints(buffer, Math.round(20000 * runtime.density));
        setBrain(buildBrainScene(points, runtime.tier === "high" ? 130 : 70));
        runtime.invalidate();
      })
      .catch((error) => {
        if (!controller.signal.aborted) console.warn("[BrainScales] whole-brain stage unavailable:", error);
      });
    return () => controller.abort();
  }, [content.pointsSrc, runtime]);

  const brainDraw = useMemo(() => {
    if (!brain) return null;
    const buffers = createPointBuffers(brain.count);
    buffers.position.set(brain.position);
    for (let i = 0; i < brain.count; i += 1) {
      buffers.size[i] = 0.0135;
      buffers.tone[i] = brain.tone[i];
      buffers.activity[i] = brain.lobe[i];
      buffers.seed[i] = brain.seed[i];
    }
    buffers.count = brain.count;
    buffers.commit(["position", "size", "tone", "activity", "seed"]);
    const material = createLivingMaterial(shared, {
      vertexShader: BRAIN_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      uniforms: {
        uOpacity: { value: 1 },
        uBase: { value: 0.3 },
        uHalo: { value: 0.45 },
        uSizeBoost: { value: 0.8 },
        uGain: { value: 1 },
        uHot: { value: shared.uSignal.value },
      },
    });
    const SEG = 14;
    const lines = createSegmentBuffers(brain.arcs.length * SEG + 8);
    brain.arcs.forEach((arc) => {
      const mid: V3 = [(arc.from[0] + arc.to[0]) / 2, (arc.from[1] + arc.to[1]) / 2, (arc.from[2] + arc.to[2]) / 2];
      const control: V3 = [mid[0] * 0.35, mid[1] * 0.35 + 0.05, mid[2] * 0.35];
      addPolyline(lines, quadratic(arc.from, control, arc.to, SEG), {
        width: 0.8,
        intensity: 0.05,
        tone: arc.inter ? TONE.warm : TONE.signal,
      });
    });
    lines.commit(["start", "end", "param", "tone", "activity", "pulse"]);
    return { buffers, material, lines, segments: SEG, lineMaterial: createSegmentMaterial(shared, { pulseWidth: 0.1 }) };
  }, [brain, shared]);

  useEffect(
    () => () => {
      neuron.geometry.dispose();
      neuron.material.dispose();
    },
    [neuron],
  );
  useEffect(
    () => () => {
      scope.buffers.geometry.dispose();
      scope.material.dispose();
      circuitDraw.points.geometry.dispose();
      circuitDraw.segments.geometry.dispose();
      circuitDraw.pointMaterial.dispose();
      circuitDraw.segmentMaterial.dispose();
    },
    [circuitDraw, scope],
  );
  useEffect(
    () => () => {
      column.buffers.geometry.dispose();
      column.material.dispose();
      column.lines.geometry.dispose();
      column.lineMaterial.dispose();
    },
    [column],
  );
  useEffect(
    () => () => {
      if (!brainDraw) return;
      brainDraw.buffers.geometry.dispose();
      brainDraw.material.dispose();
      brainDraw.lines.geometry.dispose();
      brainDraw.lineMaterial.dispose();
    },
    [brainDraw],
  );

  useFrame((_, deltaWall) => {
    const root = rootRef.current;
    if (!root) return;
    const dtWall = Math.min(deltaWall, 1 / 20);
    const clock = runtime.clock.state;
    let stage = clock.stageIndex;
    let t = clock.stageT;
    // Without the brain data the loop skips the whole-brain stage.
    if (!brain && stage === 3) {
      stage = 4;
      t = 0;
    }
    const zoom = brain ? zoomFor(stage, t) : Math.min(2, zoomFor(stage, t));
    const pointer = runtime.pointer;
    const reduced = runtime.reducedMotion;
    const settle = clock.dt === 0;
    const sims = simRef.current;

    // --- Simulations: reset at loop start, rebuild deterministically after a seek ------------
    const stageStart = runtime.clock.stageStart(clock.stageIndex);
    const intoStage = (clock.phase % runtime.clock.total) - stageStart;
    if (sims.epoch !== clock.epoch || sims.loop !== clock.loopIndex || sims.stage !== clock.stageIndex) {
      const rebuild = sims.epoch !== clock.epoch || sims.loop !== clock.loopIndex;
      if (rebuild || clock.stageIndex === 0) {
        sims.neuron = createNeuronSim();
        if (clock.stageIndex === 0) advanceNeuron(sims.neuron, Math.max(0, intoStage) * SIM_MS_PER_SECOND.neuron);
      }
      if (rebuild || clock.stageIndex === 1) {
        resetCircuitSim(sims.circuit);
        if (clock.stageIndex === 1) advanceCircuit(sims.circuit, Math.max(0, intoStage));
      }
      sims.epoch = clock.epoch;
      sims.loop = clock.loopIndex;
      sims.stage = clock.stageIndex;
    }
    if (stage === 0 || zoom < 0.7) advanceNeuron(sims.neuron, clock.dt * SIM_MS_PER_SECOND.neuron);
    if (zoom > 0.3 && zoom < 1.75) advanceCircuit(sims.circuit, clock.dt);

    // --- Root: gentle drift + orbit -------------------------------------------------------------
    if (!pointer.dragging) {
      pointer.orbitYaw = damp(pointer.orbitYaw, 0, 1.4, dtWall);
      pointer.orbitPitch = damp(pointer.orbitPitch, 0, 1.4, dtWall);
    }
    const drift = reduced ? 0 : Math.sin(clock.phase * 0.21) * 0.2;
    const yawTarget = drift + pointer.orbitYaw + (reduced ? 0 : pointer.slotX * 0.08);
    const pitchTarget = 0.06 + pointer.orbitPitch - (reduced ? 0 : pointer.slotY * 0.05);
    const m = motion.current;
    m.yaw = settle ? yawTarget : damp(m.yaw, yawTarget, 4, dtWall);
    m.pitch = settle ? pitchTarget : damp(m.pitch, pitchTarget, 4, dtWall);
    const o0 = levelOpacity(0, zoom);
    const offsetTarget = -0.55 * o0;
    m.offsetX = settle ? offsetTarget : damp(m.offsetX, offsetTarget, 3, dtWall);
    // The circuit (and so the zoom anchor) sits in L2/3; lift the column so its deep layers and the
    // L5/L6 projections clear the controls under the slot.
    const liftTarget = 0.34 * levelOpacity(2, zoom);
    m.offsetY = settle ? liftTarget : damp(m.offsetY, liftTarget, 3, dtWall);
    root.rotation.set(m.pitch, m.yaw, 0);
    root.position.set(m.offsetX, m.offsetY, 0);
    camera.position.set(0, 0.15, 6.4);
    camera.lookAt(0, 0, 0);

    // --- Level transforms -----------------------------------------------------------------------
    const anchors: V3[] = [[0, 0, 0], [0, 0, 0], column.anchor, brain?.anchor ?? [0, 1, 0.3]];
    const opacities = [0, 1, 2, 3].map((level) => levelOpacity(level, zoom));
    levelRefs.forEach((ref, level) => {
      const group = ref.current;
      if (!group) return;
      const scale = Math.pow(R, level - zoom);
      group.visible = opacities[level] > 0.002 && scale < 60;
      group.scale.setScalar(scale);
      const a = anchors[level];
      group.position.set(-a[0] * scale, -a[1] * scale, -a[2] * scale);
    });

    root.updateMatrixWorld();

    // --- Clicks: stimulate the neuron, or the nearest cell of the circuit ---------------------
    if (pointer.clicks.length > 0) {
      const clicks = pointer.clicks.splice(0);
      const last = clicks[clicks.length - 1];
      if (zoom < 0.5) {
        sims.neuron.injections.push(sims.neuron.time);
        sims.neuron.rippleAt = clock.phase;
      } else if (zoom < 1.5) {
        const clickX = (last.ndcX * 0.5 + 0.5) * size.width;
        const clickY = (-last.ndcY * 0.5 + 0.5) * size.height;
        let best = -1;
        let bestDistance = last.touch ? 48 : 34;
        const group = levelRefs[1].current;
        circuitLayout.forEach((p, i) => {
          if (!group) return;
          tmp.set(p[0], p[1], p[2]);
          group.localToWorld(tmp).project(camera);
          const distance = Math.hypot((tmp.x * 0.5 + 0.5) * size.width - clickX, (-tmp.y * 0.5 + 0.5) * size.height - clickY);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });
        if (best >= 0) stimulate(sims.circuit.circuit, best, 26);
      }
    }

    // --- Level 0 drawing --------------------------------------------------------------------------
    const nu = neuron.material.uniforms;
    nu.uOpacity.value = o0;
    nu.uSomaGlow.value = hhGlow(sims.neuron.state.v);
    const nodeGlow = nu.uNodeGlow.value as number[];
    neuron.nodes.forEach((_, i) => {
      nodeGlow[i] = hhGlow(voltageAgo(sims.neuron, (i + 1) * NODE_DELAY_MS));
    });
    const rippleAge = clock.phase - sims.neuron.rippleAt;
    nu.uRipple.value = rippleAge >= 0 && rippleAge < 0.6 ? 1 - rippleAge / 0.6 : 0;

    const sb = scope.buffers;
    for (let i = 0; i < HH_SAMPLES - 1; i += 1) {
      const a = sims.neuron.samples[(sims.neuron.head + 1 + i) % HH_SAMPLES];
      const b = sims.neuron.samples[(sims.neuron.head + 2 + i) % HH_SAMPLES];
      const x0 = 0.78 + (i / (HH_SAMPLES - 1)) * 1.27;
      const x1 = 0.78 + ((i + 1) / (HH_SAMPLES - 1)) * 1.27;
      const index = scope.trace + i;
      sb.start.set([x0, -0.2 + ((a - HH.rest) / 105) * 0.9, 0], index * 3);
      sb.end.set([x1, -0.2 + ((b - HH.rest) / 105) * 0.9, 0], index * 3);
      sb.param[index * 4 + 3] = (0.25 + 0.75 * (i / HH_SAMPLES)) * o0;
    }
    sb.param[0 * 4 + 3] = 0.35 * o0;
    sb.param[1 * 4 + 3] = 0.16 * o0;
    const rippleRadius = 0.12 + Math.max(0, rippleAge) * 0.7;
    for (let i = 0; i < 24; i += 1) {
      const index = scope.ripple + i;
      const a0 = (i / 24) * Math.PI * 2;
      const a1 = ((i + 1) / 24) * Math.PI * 2;
      sb.start.set([Math.cos(a0) * rippleRadius, Math.sin(a0) * rippleRadius, 0], index * 3);
      sb.end.set([Math.cos(a1) * rippleRadius, Math.sin(a1) * rippleRadius, 0], index * 3);
      sb.param[index * 4 + 3] = nu.uRipple.value * 0.9 * o0;
    }
    sb.commit(["start", "end", "param"]);

    // --- Level 1 drawing --------------------------------------------------------------------------
    const o1 = opacities[1];
    const cs = sims.circuit;
    const cp = circuitDraw.points;
    for (let i = 0; i < circuitLayout.length; i += 1) {
      const since = cs.visualTime - cs.lastSpike[i];
      cp.activity[i] = since >= 0 && since < 1 ? Math.exp(-since / 0.16) * 1.6 : 0;
    }
    cp.commit(["activity"]);
    // While the circuit is still zoomed far in (just emerging from the neuron), keep it faint.
    const circuitScale = Math.pow(R, 1 - zoom);
    const emerging = 1 - smoothstep(1.6, 5, circuitScale) * 0.8;
    circuitDraw.pointMaterial.uniforms.uOpacity.value = o1 * emerging;
    circuitDraw.segmentMaterial.uniforms.uOpacity.value = o1 * emerging;
    const cseg = circuitDraw.segments;
    cs.circuit.synapses.forEach((synapse, s) => {
      const since = cs.visualTime - cs.synapseSpike[s];
      const center = since >= 0 && since < 0.45 ? since / 0.35 : -1;
      const strength = center < 0 ? 0 : 1.1 * synapse.weight;
      const potentiation = clamp((synapse.weight - synapse.initial) * 4, -0.5, 1);
      for (let k = 0; k < circuitDraw.synapseSegments; k += 1) {
        const index = circuitDraw.synapseFirst + s * circuitDraw.synapseSegments + k;
        cseg.param[index * 4 + 2] = 0.6 + synapse.weight * 1.6;
        cseg.param[index * 4 + 3] = synapse.excitatory ? 0.06 + synapse.weight * 0.34 : 0.12;
        cseg.activity[index] = synapse.excitatory ? Math.max(0, potentiation) * 0.8 : 0;
        cseg.pulse[index * 2] = center;
        cseg.pulse[index * 2 + 1] = reduced ? 0 : strength;
      }
    });
    cseg.commit(["param", "activity", "pulse"]);

    // --- Level 2 drawing --------------------------------------------------------------------------
    const o2 = opacities[2];
    column.material.uniforms.uOpacity.value = o2;
    column.lineMaterial.uniforms.uOpacity.value = o2;
    const lb = column.lines;
    const time = clock.phase;
    column.projections.forEach((projection) => {
      const period = projection.kind === 5 ? 2.3 : 2.9;
      const local = ((time + projection.offset * period) % period) / period;
      const center = local * 1.35 - 0.1;
      for (let k = 0; k < projection.count; k += 1) {
        const index = projection.first + k;
        lb.pulse[index * 2] = center;
        lb.pulse[index * 2 + 1] = reduced ? 0 : 1.2;
      }
    });
    lb.commit(["pulse"]);

    // --- Level 3 drawing --------------------------------------------------------------------------
    const o3 = opacities[3];
    if (brainDraw) {
      const fireUp = stage === 3 ? 0.3 + 0.7 * smoothstep(0.25, 0.85, t) : stage === 4 ? 1 : 0.3;
      brainDraw.material.uniforms.uOpacity.value = o3;
      brainDraw.material.uniforms.uGain.value = fireUp;
      brainDraw.lineMaterial.uniforms.uOpacity.value = o3 * (0.4 + fireUp * 0.6);
      const bl = brainDraw.lines;
      const arcs = brain?.arcs.length ?? 0;
      for (let a = 0; a < arcs; a += 1) {
        const period = 2.6 + (a % 7) * 0.31;
        const local = ((time + a * 0.173) % period) / period;
        for (let k = 0; k < brainDraw.segments; k += 1) {
          const index = a * brainDraw.segments + k;
          bl.pulse[index * 2] = local * 1.3 - 0.1;
          bl.pulse[index * 2 + 1] = reduced ? 0 : fireUp * 1.1;
        }
      }
      bl.commit(["pulse"]);
    }

    // --- Labels -----------------------------------------------------------------------------------
    const place = (id: string, group: THREE.Object3D | null, local: V3, opacity: number) => {
      const element = runtime.labels.get(id);
      if (!element) return;
      if (!group || opacity < 0.01) {
        if (element.style.opacity !== "0") element.style.opacity = "0";
        return;
      }
      tmp2.set(local[0], local[1], local[2]);
      group.localToWorld(tmp2).project(camera);
      element.style.transform = `translate3d(${((tmp2.x * 0.5 + 0.5) * size.width).toFixed(1)}px, ${(
        (-tmp2.y * 0.5 + 0.5) * size.height
      ).toFixed(1)}px, 0)`;
      element.style.opacity = (tmp2.z < 1 ? opacity : 0).toFixed(3);
    };
    const g0 = levelRefs[0].current;
    place("scope-title", g0, [0.78, 0.92, 0], o0 * 0.95);
    place("scope-peak", g0, [2.1, 0.7, 0], o0 * 0.6);
    place("scope-rest", g0, [2.1, -0.2, 0], o0 * 0.6);
    place("neuron-apical", g0, [0.26, 1.34, 0], o0 * 0.6);
    const axonMid = pointAlong(neuron.axonPoints, 0.55);
    place("neuron-axon", g0, [axonMid[0] + 0.1, axonMid[1], axonMid[2]], o0 * 0.6);
    const g1 = levelRefs[1].current;
    const excitatoryExample = circuitLayout[3] ?? [0, 0, 0];
    const inhibitoryExample = circuitLayout[CIRCUIT_EXCITATORY] ?? [0, 0, 0];
    place("circuit-exc", g1, [excitatoryExample[0] + 0.1, excitatoryExample[1] + 0.05, excitatoryExample[2]], o1 * 0.7);
    place("circuit-inh", g1, [inhibitoryExample[0] + 0.1, inhibitoryExample[1], inhibitoryExample[2]], o1 * 0.7);
    const g2 = levelRefs[2].current;
    column.bands.forEach((band, i) => {
      place(CORTICAL_LAYERS[i].id, g2, [-COLUMN.width / 2 - 0.08, band.center, COLUMN.depth / 2], o2 * 0.85);
    });
    // Projection labels sit beside their source layers; the arcs themselves spill out below.
    place("proj-l5", g2, [COLUMN.width / 2 + 0.1, column.bands[4].center, COLUMN.depth / 2], o2 * 0.9);
    place("proj-l6", g2, [COLUMN.width / 2 + 0.1, column.bands[5].center, COLUMN.depth / 2], o2 * 0.9);
    const g3 = levelRefs[3].current;
    ["frontal", "parietal", "temporal", "occipital", "cerebellum"].forEach((lobe, i) => {
      const centroid = brain?.lobeCentroids[i];
      if (centroid) place(`lobe-${lobe}`, g3, centroid, o3 * 0.75);
      else place(`lobe-${lobe}`, null, [0, 0, 0], 0);
    });
  });

  return (
    <group ref={rootRef}>
      <group ref={levelRefs[0]}>
        <mesh geometry={neuron.geometry} material={neuron.material} frustumCulled={false} renderOrder={2} />
        <mesh geometry={scope.buffers.geometry} material={scope.material} frustumCulled={false} renderOrder={3} />
      </group>
      <group ref={levelRefs[1]}>
        <mesh geometry={circuitDraw.segments.geometry} material={circuitDraw.segmentMaterial} frustumCulled={false} renderOrder={2} />
        <points geometry={circuitDraw.points.geometry} material={circuitDraw.pointMaterial} frustumCulled={false} renderOrder={3} />
      </group>
      <group ref={levelRefs[2]}>
        <mesh geometry={column.lines.geometry} material={column.lineMaterial} frustumCulled={false} renderOrder={1} />
        <points geometry={column.buffers.geometry} material={column.material} frustumCulled={false} renderOrder={2} />
      </group>
      <group ref={levelRefs[3]}>
        {brainDraw ? (
          <>
            <mesh geometry={brainDraw.lines.geometry} material={brainDraw.lineMaterial} frustumCulled={false} renderOrder={1} />
            <points geometry={brainDraw.buffers.geometry} material={brainDraw.material} frustumCulled={false} renderOrder={2} />
          </>
        ) : null}
      </group>
    </group>
  );
};

export default BrainScalesScene;
