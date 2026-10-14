// Where every layer of the forward pass sits, for a wide slot and a tall (phone) slot.
// Map planes face the camera (+z) and recede into depth like a fanned deck of cards; the input photo
// is a height field that extrudes toward the viewer. Pure numbers, no three.js.

import { easeInOutCubic, lerp } from "../../core/math.ts";

export type V3 = [number, number, number];

export type LayerId = "input" | "conv1" | "conv2" | "dense";

export interface DeckLayout {
  origin: V3;
  size: number;
  /** Offset between consecutive maps in the deck. */
  step: V3;
}

export interface ForwardPassLayout {
  orientation: "landscape" | "portrait";
  input: { origin: V3; size: number; height: number };
  conv1: DeckLayout;
  conv2: DeckLayout;
  dense(index: number, count: number): V3;
  output(index: number, count: number): V3;
  /** Screen-right offset (world units) from an output node to its label. */
  outputLabelOffset: V3;
  /** Arc the winning color takes back to the input. */
  returnPath(samples: number): V3[];
  /** Anchor and alignment of each layer's caption label. */
  layerLabel(layer: LayerId): { anchor: V3; align: "left" | "center" };
  /** Group yaw that turns the stack slightly, so its depth reads. */
  yaw: number;
  camera(focus: number): { position: V3; target: V3 };
  /** Where along the network the camera looks, for a stage and its 0..1 progress. */
  focus(stage: number, t: number): number;
}

const arc = (from: V3, to: V3, lift: number, samples: number): V3[] => {
  const points: V3[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const bump = Math.sin(t * Math.PI);
    points.push([lerp(from[0], to[0], t), lerp(from[1], to[1], t) + bump * lift, lerp(from[2], to[2], t) + bump * 0.25]);
  }
  return points;
};

const staged = (stops: [number, number, number, number, number], stage: number, t: number): number => {
  const [imagine, convolveEnd, deepenEnd, denseEnd, output] = stops;
  const e = easeInOutCubic(t);
  switch (stage) {
    case 0:
      return imagine;
    case 1:
      return lerp(imagine, convolveEnd, e);
    case 2:
      return lerp(convolveEnd, deepenEnd, e);
    case 3:
      return lerp(deepenEnd, denseEnd, e);
    default:
      return t < 0.6 ? lerp(denseEnd, output, easeInOutCubic(t / 0.6)) : lerp(output, imagine, easeInOutCubic((t - 0.6) / 0.4));
  }
};

const landscape: ForwardPassLayout = {
  orientation: "landscape",
  // A diagonal from top-left to bottom-right uses a square slot better than a horizontal strip.
  input: { origin: [-1.95, 1.05, 0], size: 1.55, height: 0.3 },
  conv1: { origin: [-0.35, 0.42, -0.15], size: 1.2, step: [0.065, -0.04, -0.14] },
  conv2: { origin: [0.9, -0.2, -0.3], size: 0.72, step: [0.035, -0.026, -0.07] },
  dense(index, count) {
    const t = index / Math.max(count - 1, 1);
    return [1.85 + Math.sin(t * Math.PI) * 0.07, -0.6 + (0.5 - t) * 1.9, -0.75 + Math.cos(t * Math.PI) * 0.1];
  },
  output(index, count) {
    return [2.45, -0.6 + ((count - 1) / 2 - index) * 0.42, -0.75];
  },
  outputLabelOffset: [0.12, 0, 0],
  returnPath: (samples) => arc([2.45, 0.1, -0.75], [-1.95, 1.95, 0.1], 0.5, samples),
  layerLabel(layer) {
    const below = (center: V3, size: number): V3 => [center[0], center[1] - size / 2 - 0.16, center[2]];
    if (layer === "input") return { anchor: below(this.input.origin, this.input.size), align: "center" };
    if (layer === "conv1") return { anchor: below(deckCenter(this.conv1, 3.5), this.conv1.size), align: "center" };
    if (layer === "conv2") return { anchor: below(deckCenter(this.conv2, 7.5), this.conv2.size), align: "center" };
    const last = this.dense(23, 24);
    return { anchor: [last[0], last[1] - 0.2, last[2]], align: "center" };
  },
  yaw: 0.3,
  // Almost no lateral pan: the whole stack stays inside the slot; focus only dollies a little.
  camera: (focus) => ({ position: [0.08, 0.7, 10.4 - focus * 0.12], target: [0.16 + focus * 0.04, 0.12, -0.4] }),
  focus: (stage, t) => staged([-1.4, -0.6, 0.5, 1.1, 1.25], stage, t),
};

const portrait: ForwardPassLayout = {
  orientation: "portrait",
  input: { origin: [0, 1.95, 0], size: 1.3, height: 0.26 },
  conv1: { origin: [-0.12, 0.55, -0.15], size: 0.95, step: [0.05, -0.035, -0.12] },
  conv2: { origin: [-0.08, -0.55, -0.3], size: 0.56, step: [0.028, -0.02, -0.06] },
  dense(index, count) {
    const t = index / Math.max(count - 1, 1);
    return [-0.95 + t * 1.9, -1.35 + Math.sin(t * Math.PI) * 0.05, -0.6 + Math.cos(t * Math.PI) * 0.1];
  },
  output(index) {
    return [-0.7, -1.85 - index * 0.3, -0.6];
  },
  outputLabelOffset: [0.11, 0, 0],
  returnPath: (samples) =>
    arc([-0.7, -1.85, -0.6], [-0.75, 1.95, 0.1], 0, samples).map(([x, y, z], i, all) => {
      const bump = Math.sin((i / (all.length - 1)) * Math.PI);
      return [x - bump * 0.7, y, z] as V3;
    }),
  layerLabel(layer) {
    if (layer === "input") {
      return { anchor: [this.input.origin[0], this.input.origin[1] - this.input.size / 2 - 0.14, this.input.origin[2]], align: "center" };
    }
    if (layer === "dense") {
      const last = this.dense(23, 24);
      return { anchor: [last[0] + 0.1, last[1], last[2]], align: "left" };
    }
    const deck = layer === "conv1" ? this.conv1 : this.conv2;
    const center = deckCenter(deck, layer === "conv1" ? 3.5 : 7.5);
    return { anchor: [center[0] + deck.size / 2 + 0.12, center[1], center[2]], align: "left" };
  },
  yaw: 0.22,
  // Content spans y 2.6 → -2.75; aim a little low so it clears the controls at the slot's bottom.
  camera: (focus) => ({ position: [0.3, 0.1 - focus * 0.12, 10.8], target: [0.12, -0.42 - focus * 0.16, -0.4] }),
  focus: (stage, t) => staged([-1.0, -0.3, 0.6, 1.2, 1.4], stage, t),
};

export const forwardPassLayout = (slotAspect: number): ForwardPassLayout => (slotAspect < 0.82 ? portrait : landscape);

export const deckCenter = (deck: DeckLayout, index: number): V3 => [
  deck.origin[0] + deck.step[0] * index,
  deck.origin[1] + deck.step[1] * index,
  deck.origin[2] + deck.step[2] * index,
];
