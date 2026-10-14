// A slab of neocortex with its six layers. Thickness and relative cell density follow the usual
// textbook proportions: sparse L1, dense granular L4, large L5 pyramids, thick L6.

import { mulberry32 } from "../../core/math.ts";

export interface CorticalLayer {
  readonly id: "L1" | "L2" | "L3" | "L4" | "L5" | "L6";
  /** Fraction of cortical thickness. */
  readonly thickness: number;
  /** Relative density of cell bodies. */
  readonly density: number;
  /** Relative size of the drawn cell bodies. */
  readonly cellSize: number;
}

export const CORTICAL_LAYERS: readonly CorticalLayer[] = [
  { id: "L1", thickness: 0.08, density: 0.12, cellSize: 0.8 },
  { id: "L2", thickness: 0.1, density: 0.95, cellSize: 0.9 },
  { id: "L3", thickness: 0.2, density: 0.75, cellSize: 1.0 },
  { id: "L4", thickness: 0.12, density: 1.3, cellSize: 0.75 },
  { id: "L5", thickness: 0.22, density: 0.55, cellSize: 1.55 },
  { id: "L6", thickness: 0.28, density: 0.72, cellSize: 1.0 },
];

export interface ColumnDimensions {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export const COLUMN: ColumnDimensions = { width: 2.2, height: 1.7, depth: 1.0 };

/** Top and bottom y of each layer (pia at +height/2). */
export const layerBands = (dims: ColumnDimensions = COLUMN): Array<{ top: number; bottom: number; center: number }> => {
  let top = dims.height / 2;
  return CORTICAL_LAYERS.map((layer) => {
    const bottom = top - layer.thickness * dims.height;
    const band = { top, bottom, center: (top + bottom) / 2 };
    top = bottom;
    return band;
  });
};

export interface ColumnPoints {
  readonly count: number;
  readonly position: Float32Array;
  readonly layer: Float32Array;
  readonly size: Float32Array;
  readonly seed: Float32Array;
  readonly inhibitory: Uint8Array;
  /** Indices of large L5 pyramids and L6 cells used as long-range projection sources. */
  readonly l5Sources: number[];
  readonly l6Sources: number[];
}

export const buildColumnPoints = (count: number, seed = 1909, dims: ColumnDimensions = COLUMN): ColumnPoints => {
  const rng = mulberry32(seed);
  const bands = layerBands(dims);
  const weights = CORTICAL_LAYERS.map((layer) => layer.thickness * layer.density);
  const total = weights.reduce((sum, w) => sum + w, 0);
  const position = new Float32Array(count * 3);
  const layer = new Float32Array(count);
  const size = new Float32Array(count);
  const seeds = new Float32Array(count);
  const inhibitory = new Uint8Array(count);
  const l5: number[] = [];
  const l6: number[] = [];

  let index = 0;
  CORTICAL_LAYERS.forEach((spec, layerIndex) => {
    const n = layerIndex === CORTICAL_LAYERS.length - 1 ? count - index : Math.round((weights[layerIndex] / total) * count);
    const band = bands[layerIndex];
    for (let i = 0; i < n && index < count; i += 1, index += 1) {
      position[index * 3] = (rng() - 0.5) * dims.width;
      position[index * 3 + 1] = band.bottom + rng() * (band.top - band.bottom);
      position[index * 3 + 2] = (rng() - 0.5) * dims.depth;
      layer[index] = layerIndex;
      const isInhibitory = rng() < 0.2;
      inhibitory[index] = isInhibitory ? 1 : 0;
      size[index] = (isInhibitory ? 0.8 : 1) * spec.cellSize * (0.75 + rng() * 0.5);
      seeds[index] = rng();
      if (!isInhibitory && spec.id === "L5" && size[index] > 1.5 && l5.length < 6) l5.push(index);
      if (!isInhibitory && spec.id === "L6" && l6.length < 4 && rng() < 0.05) l6.push(index);
    }
  });

  return { count, position, layer, size, seed: seeds, inhibitory, l5Sources: l5, l6Sources: l6 };
};
