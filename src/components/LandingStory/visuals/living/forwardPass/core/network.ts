// A small CNN forward pass, computed for real on a 64×64 photo:
// conv1 (8 fixed 5×5 filters) → ReLU → 2×2 max-pool → conv2 (16 seeded 3×3×8 filters) → ReLU
// → 2×2 max-pool → global average pool → dense 16→24 (ReLU) → dense 24→N logits → softmax.
// Only the classifier is staged: the final logits are steered toward the photo's target label.

import { gaussian, mulberry32 } from "../../core/math.ts";
import { CONV1_KERNELS, KERNEL_SIZE } from "./kernels.ts";

export const INPUT_SIZE = 64;
export const CONV2_CHANNELS = 16;
export const HIDDEN_UNITS = 24;

export interface FeatureMaps {
  readonly size: number;
  readonly channels: number;
  /** Channel-major: data[c * size * size + y * size + x]; y = 0 is the top row. */
  readonly data: Float32Array;
}

export interface NetworkWeights {
  readonly conv2: Float32Array; // [16][8][3][3]
  readonly conv2Bias: Float32Array;
  readonly dense1: Float32Array; // [24][16]
  readonly dense1Bias: Float32Array;
  readonly dense2: Float32Array; // [outputs][24]
  readonly outputs: number;
}

export interface ForwardPassResult {
  readonly conv1: FeatureMaps;
  readonly conv2: FeatureMaps;
  readonly features: Float32Array;
  readonly hidden: Float32Array;
  readonly logits: Float32Array;
  readonly probabilities: Float32Array;
  readonly winner: number;
}

/** Same-padded 2D convolution of one channel (edge pixels are clamped). */
export const conv2dSame = (input: Float32Array, size: number, kernel: Float32Array, kernelSize: number): Float32Array => {
  const out = new Float32Array(size * size);
  const r = (kernelSize - 1) / 2;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let sum = 0;
      for (let ky = -r; ky <= r; ky += 1) {
        const sy = Math.min(size - 1, Math.max(0, y + ky));
        for (let kx = -r; kx <= r; kx += 1) {
          const sx = Math.min(size - 1, Math.max(0, x + kx));
          sum += input[sy * size + sx] * kernel[(ky + r) * kernelSize + (kx + r)];
        }
      }
      out[y * size + x] = sum;
    }
  }
  return out;
};

export const relu = (values: Float32Array): Float32Array => {
  for (let i = 0; i < values.length; i += 1) if (values[i] < 0) values[i] = 0;
  return values;
};

export const maxPool2 = (maps: FeatureMaps): FeatureMaps => {
  const size = maps.size / 2;
  const data = new Float32Array(maps.channels * size * size);
  for (let c = 0; c < maps.channels; c += 1) {
    const src = c * maps.size * maps.size;
    const dst = c * size * size;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const i = src + 2 * y * maps.size + 2 * x;
        data[dst + y * size + x] = Math.max(
          maps.data[i],
          maps.data[i + 1],
          maps.data[i + maps.size],
          maps.data[i + maps.size + 1],
        );
      }
    }
  }
  return { size, channels: maps.channels, data };
};

/** rgb: size*size*3 floats in 0..1, row-major from the top. */
export const opponentChannels = (rgb: Float32Array, size: number) => {
  const n = size * size;
  const luma = new Float32Array(n);
  const redGreen = new Float32Array(n);
  const blueYellow = new Float32Array(n);
  for (let i = 0; i < n; i += 1) {
    const r = rgb[i * 3];
    const g = rgb[i * 3 + 1];
    const b = rgb[i * 3 + 2];
    luma[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    redGreen[i] = r - g;
    blueYellow[i] = b - (r + g) / 2;
  }
  return { luma, redGreen, blueYellow };
};

export const runConv1 = (rgb: Float32Array, size: number): FeatureMaps => {
  const channels = opponentChannels(rgb, size);
  const data = new Float32Array(CONV1_KERNELS.length * size * size);
  CONV1_KERNELS.forEach((kernel, c) => {
    const response = relu(conv2dSame(channels[kernel.channel], size, kernel.weights, KERNEL_SIZE));
    data.set(response, c * size * size);
  });
  return { size, channels: CONV1_KERNELS.length, data };
};

export const createNetworkWeights = (outputs: number, seed = 20271): NetworkWeights => {
  const rng = mulberry32(seed);
  const inChannels = CONV1_KERNELS.length;
  const conv2 = new Float32Array(CONV2_CHANNELS * inChannels * 9);
  const conv2Bias = new Float32Array(CONV2_CHANNELS);
  for (let o = 0; o < CONV2_CHANNELS; o += 1) {
    // Each conv2 filter listens to two or three conv1 maps, like a sparse mid-level detector.
    const picks = new Set<number>();
    const count = 2 + Math.floor(rng() * 2);
    while (picks.size < count) picks.add(Math.floor(rng() * inChannels));
    picks.forEach((c) => {
      for (let k = 0; k < 9; k += 1) {
        conv2[((o * inChannels + c) * 9) + k] = gaussian(rng) * 0.35 + (k === 4 ? 0.45 : 0.08);
      }
    });
    conv2Bias[o] = -0.02;
  }
  const dense1 = new Float32Array(HIDDEN_UNITS * CONV2_CHANNELS);
  const dense1Bias = new Float32Array(HIDDEN_UNITS);
  for (let i = 0; i < dense1.length; i += 1) dense1[i] = gaussian(rng) / Math.sqrt(CONV2_CHANNELS);
  for (let i = 0; i < HIDDEN_UNITS; i += 1) dense1Bias[i] = 0.1;
  const dense2 = new Float32Array(outputs * HIDDEN_UNITS);
  for (let i = 0; i < dense2.length; i += 1) dense2[i] = gaussian(rng) / Math.sqrt(HIDDEN_UNITS);
  return { conv2, conv2Bias, dense1, dense1Bias, dense2, outputs };
};

export const runConv2 = (pooled: FeatureMaps, weights: NetworkWeights): FeatureMaps => {
  const size = pooled.size;
  const n = size * size;
  const data = new Float32Array(CONV2_CHANNELS * n);
  const kernel = new Float32Array(9);
  for (let o = 0; o < CONV2_CHANNELS; o += 1) {
    const out = data.subarray(o * n, (o + 1) * n);
    out.fill(weights.conv2Bias[o]);
    for (let c = 0; c < pooled.channels; c += 1) {
      const base = (o * pooled.channels + c) * 9;
      let any = false;
      for (let k = 0; k < 9; k += 1) {
        kernel[k] = weights.conv2[base + k];
        if (kernel[k] !== 0) any = true;
      }
      if (!any) continue;
      const response = conv2dSame(pooled.data.subarray(c * n, (c + 1) * n), size, kernel, 3);
      for (let i = 0; i < n; i += 1) out[i] += response[i];
    }
    relu(out);
  }
  return { size, channels: CONV2_CHANNELS, data };
};

export const globalAveragePool = (maps: FeatureMaps): Float32Array => {
  const n = maps.size * maps.size;
  const out = new Float32Array(maps.channels);
  for (let c = 0; c < maps.channels; c += 1) {
    let sum = 0;
    for (let i = 0; i < n; i += 1) sum += maps.data[c * n + i];
    out[c] = sum / n;
  }
  return out;
};

const standardize = (values: Float32Array): Float32Array => {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance) || 1;
  return values.map((value) => (value - mean) / std);
};

export const softmax = (values: Float32Array, temperature = 1): Float32Array => {
  const max = Math.max(...values);
  const exps = values.map((value) => Math.exp((value - max) / temperature));
  const sum = exps.reduce((acc, value) => acc + value, 0);
  return exps.map((value) => value / sum);
};

export const runForwardPass = (
  rgb: Float32Array,
  weights: NetworkWeights,
  targetOutput: number,
): ForwardPassResult => {
  const conv1 = runConv1(rgb, INPUT_SIZE);
  const conv2 = runConv2(maxPool2(conv1), weights);
  const features = standardize(globalAveragePool(maxPool2(conv2)));

  const hidden = new Float32Array(HIDDEN_UNITS);
  for (let h = 0; h < HIDDEN_UNITS; h += 1) {
    let sum = weights.dense1Bias[h];
    for (let f = 0; f < CONV2_CHANNELS; f += 1) sum += weights.dense1[h * CONV2_CHANNELS + f] * features[f];
    hidden[h] = Math.max(0, sum);
  }

  const raw = new Float32Array(weights.outputs);
  for (let o = 0; o < weights.outputs; o += 1) {
    let sum = 0;
    for (let h = 0; h < HIDDEN_UNITS; h += 1) sum += weights.dense2[o * HIDDEN_UNITS + h] * hidden[h];
    raw[o] = sum;
  }

  // The staged part: nudge the target label just past the strongest competitor.
  const logits = standardize(raw);
  let strongestOther = -Infinity;
  logits.forEach((value, index) => {
    if (index !== targetOutput) strongestOther = Math.max(strongestOther, value);
  });
  if (targetOutput >= 0 && targetOutput < logits.length) {
    logits[targetOutput] = Math.max(logits[targetOutput], strongestOther) + 1.2;
  }
  const probabilities = softmax(logits, 0.7);
  let winner = 0;
  probabilities.forEach((value, index) => {
    if (value > probabilities[winner]) winner = index;
  });

  return { conv1, conv2, features, hidden, logits, probabilities, winner };
};

/** 8-bit display copy of feature maps, one atlas row of tiles, normalized per map (99th percentile). */
export const toDisplayAtlas = (maps: FeatureMaps): Uint8Array => {
  const { size, channels } = maps;
  const n = size * size;
  const atlasWidth = size * channels;
  const out = new Uint8Array(atlasWidth * size);
  const scratch = new Float32Array(n);
  for (let c = 0; c < channels; c += 1) {
    scratch.set(maps.data.subarray(c * n, (c + 1) * n));
    const sorted = Float32Array.from(scratch).sort();
    const ceiling = sorted[Math.floor(n * 0.99)] || sorted[n - 1] || 1;
    for (let y = 0; y < size; y += 1) {
      // Texture rows start at the bottom; feature rows start at the top.
      const row = size - 1 - y;
      for (let x = 0; x < size; x += 1) {
        const value = Math.min(1, scratch[y * size + x] / ceiling);
        out[row * atlasWidth + c * size + x] = Math.round(Math.pow(value, 0.8) * 255);
      }
    }
  }
  return out;
};
