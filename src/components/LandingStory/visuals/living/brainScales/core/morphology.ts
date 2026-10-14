// A seeded, stylised layer 2/3 pyramidal neuron: soma, apical dendrite with obliques and a tuft,
// basal dendrites, and a myelinated axon with nodes of Ranvier. Units are scene units; +y points to
// the pia (cortical surface), as in the cortex stage.

import type { Rng } from "../../core/math.ts";
import { mulberry32 } from "../../core/math.ts";

export type V3 = [number, number, number];
export type BranchKind = "apical" | "oblique" | "tuft" | "basal" | "axon" | "terminal";

export interface Branch {
  readonly kind: BranchKind;
  readonly points: V3[];
  readonly radiusStart: number;
  readonly radiusEnd: number;
  /** Path distance from the soma at the first point. */
  readonly distStart: number;
}

export interface NeuronMorphology {
  readonly somaRadius: number;
  readonly branches: Branch[];
  /** Path distances (from the soma) of the nodes of Ranvier along the main axon. */
  readonly nodes: number[];
  /** Myelinated stretches of the axon, as [from, to] path distances. */
  readonly myelin: Array<[number, number]>;
  readonly axonLength: number;
  readonly axonPoints: V3[];
}

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const length = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const normalize = (a: V3): V3 => scale(a, 1 / (length(a) || 1));

/** A gently wandering path from `start` along `direction`. */
const wander = (rng: Rng, start: V3, direction: V3, len: number, segments: number, jitter: number): V3[] => {
  const points: V3[] = [start];
  let dir = normalize(direction);
  let p = start;
  for (let i = 0; i < segments; i += 1) {
    dir = normalize(add(dir, [(rng() - 0.5) * jitter, (rng() - 0.5) * jitter * 0.6, (rng() - 0.5) * jitter]));
    p = add(p, scale(dir, len / segments));
    points.push(p);
  }
  return points;
};

export const pathLength = (points: V3[]): number => {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += length([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1], points[i][2] - points[i - 1][2]]);
  }
  return total;
};

/** Point at a fraction along a polyline (by arc length). */
export const pointAlong = (points: V3[], fraction: number): V3 => {
  const total = pathLength(points);
  let target = Math.max(0, Math.min(1, fraction)) * total;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const seg = length([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
    if (target <= seg || i === points.length - 1) {
      const t = seg > 0 ? Math.min(1, target / seg) : 0;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }
    target -= seg;
  }
  return points[points.length - 1];
};

export const buildPyramidalNeuron = (seed = 1963): NeuronMorphology => {
  const rng = mulberry32(seed);
  const somaRadius = 0.11;
  const branches: Branch[] = [];

  // Apical trunk toward the pia, with obliques and a terminal tuft.
  const apical = wander(rng, [0, somaRadius * 0.9, 0], [0.04, 1, 0.02], 1.05, 10, 0.18);
  const apicalLength = pathLength(apical);
  branches.push({ kind: "apical", points: apical, radiusStart: 0.034, radiusEnd: 0.013, distStart: 0 });
  [0.28, 0.46, 0.62, 0.78].forEach((at, i) => {
    const origin = pointAlong(apical, at);
    const side = i % 2 === 0 ? 1 : -1;
    const dir: V3 = [side * (0.8 + rng() * 0.3), 0.55 + rng() * 0.4, (rng() - 0.5) * 0.8];
    branches.push({
      kind: "oblique",
      points: wander(rng, origin, dir, 0.26 + rng() * 0.16, 5, 0.35),
      radiusStart: 0.011,
      radiusEnd: 0.004,
      distStart: at * apicalLength,
    });
  });
  const tip = apical[apical.length - 1];
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2 + rng() * 0.6;
    const dir: V3 = [Math.cos(angle) * 0.9, 0.7 + rng() * 0.3, Math.sin(angle) * 0.9];
    const tuft = wander(rng, tip, dir, 0.3 + rng() * 0.12, 5, 0.4);
    branches.push({ kind: "tuft", points: tuft, radiusStart: 0.01, radiusEnd: 0.003, distStart: apicalLength });
  }

  // Basal dendrites radiating from the lower soma, each forking once.
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2 + rng() * 0.5;
    const dir: V3 = [Math.cos(angle), -0.35 - rng() * 0.45, Math.sin(angle) * 0.8];
    const start: V3 = scale(normalize(dir), somaRadius * 0.85);
    const trunk = wander(rng, start, dir, 0.32 + rng() * 0.1, 5, 0.32);
    const trunkLength = pathLength(trunk);
    branches.push({ kind: "basal", points: trunk, radiusStart: 0.018, radiusEnd: 0.008, distStart: 0 });
    const fork = trunk[trunk.length - 1];
    for (let k = 0; k < 2; k += 1) {
      const turn = k === 0 ? 0.55 : -0.55;
      const forkDir: V3 = [dir[0] * Math.cos(turn) - dir[2] * Math.sin(turn), dir[1] - 0.1, dir[0] * Math.sin(turn) + dir[2] * Math.cos(turn)];
      branches.push({
        kind: "basal",
        points: wander(rng, fork, forkDir, 0.2 + rng() * 0.1, 4, 0.35),
        radiusStart: 0.008,
        radiusEnd: 0.003,
        distStart: trunkLength,
      });
    }
  }

  // Axon down toward the white matter: initial segment, then myelin interrupted by nodes of Ranvier.
  const axonPoints = wander(rng, [0, -somaRadius * 0.95, 0], [0.06, -1, 0.03], 1.3, 14, 0.12);
  const axonLength = pathLength(axonPoints);
  branches.push({ kind: "axon", points: axonPoints, radiusStart: 0.012, radiusEnd: 0.009, distStart: 0 });
  const nodes: number[] = [];
  const myelin: Array<[number, number]> = [];
  const initialSegment = 0.17;
  const internode = 0.145;
  const gap = 0.022;
  let at = initialSegment;
  while (at + internode < axonLength - 0.04) {
    myelin.push([at + gap / 2, at + internode - gap / 2]);
    at += internode;
    nodes.push(at);
  }
  const end = axonPoints[axonPoints.length - 1];
  for (let i = 0; i < 3; i += 1) {
    const angle = (i / 3) * Math.PI * 2 + rng();
    branches.push({
      kind: "terminal",
      points: wander(rng, end, [Math.cos(angle) * 0.8, -0.7, Math.sin(angle) * 0.8], 0.16, 3, 0.4),
      radiusStart: 0.006,
      radiusEnd: 0.003,
      distStart: axonLength,
    });
  }

  return { somaRadius, branches, nodes, myelin, axonLength, axonPoints };
};
