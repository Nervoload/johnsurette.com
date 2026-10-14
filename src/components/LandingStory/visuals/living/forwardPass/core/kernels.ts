// conv1 filters. Fixed, not learned, but they are the shapes trained CNNs converge to in layer one:
// oriented Gabor edges, centre-surround (difference of Gaussians), and colour-opponent blobs.

export const KERNEL_SIZE = 5;
const R = (KERNEL_SIZE - 1) / 2;

export type Conv1Channel = "luma" | "redGreen" | "blueYellow";

export interface Conv1Kernel {
  readonly id: string;
  readonly label: string;
  readonly channel: Conv1Channel;
  readonly weights: Float32Array;
}

const zeroMean = (weights: Float32Array): Float32Array => {
  const mean = weights.reduce((sum, value) => sum + value, 0) / weights.length;
  for (let i = 0; i < weights.length; i += 1) weights[i] -= mean;
  return weights;
};

/** Scale so the positive lobe sums to 1 (keeps responses comparable across filters). */
const normalizePositive = (weights: Float32Array): Float32Array => {
  const positive = weights.reduce((sum, value) => sum + Math.max(value, 0), 0) || 1;
  for (let i = 0; i < weights.length; i += 1) weights[i] /= positive;
  return weights;
};

export const gaborKernel = (thetaDeg: number, sigma = 1.15, wavelength = 4.2, gamma = 0.7): Float32Array => {
  const theta = (thetaDeg * Math.PI) / 180;
  const weights = new Float32Array(KERNEL_SIZE * KERNEL_SIZE);
  for (let y = -R; y <= R; y += 1) {
    for (let x = -R; x <= R; x += 1) {
      const xr = x * Math.cos(theta) + y * Math.sin(theta);
      const yr = -x * Math.sin(theta) + y * Math.cos(theta);
      const envelope = Math.exp(-(xr * xr + gamma * gamma * yr * yr) / (2 * sigma * sigma));
      weights[(y + R) * KERNEL_SIZE + (x + R)] = envelope * Math.cos((2 * Math.PI * xr) / wavelength + Math.PI / 2);
    }
  }
  return normalizePositive(zeroMean(weights));
};

const gaussianKernel = (sigma: number): Float32Array => {
  const weights = new Float32Array(KERNEL_SIZE * KERNEL_SIZE);
  let sum = 0;
  for (let y = -R; y <= R; y += 1) {
    for (let x = -R; x <= R; x += 1) {
      const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      weights[(y + R) * KERNEL_SIZE + (x + R)] = value;
      sum += value;
    }
  }
  for (let i = 0; i < weights.length; i += 1) weights[i] /= sum;
  return weights;
};

export const differenceOfGaussians = (sign: 1 | -1, inner = 0.8, outer = 1.9): Float32Array => {
  const a = gaussianKernel(inner);
  const b = gaussianKernel(outer);
  const weights = new Float32Array(a.length);
  for (let i = 0; i < a.length; i += 1) weights[i] = sign * (a[i] - b[i]);
  return normalizePositive(zeroMean(weights));
};

export const CONV1_KERNELS: readonly Conv1Kernel[] = [
  { id: "edge-0", label: "edge θ=0°", channel: "luma", weights: gaborKernel(0) },
  { id: "edge-45", label: "edge θ=45°", channel: "luma", weights: gaborKernel(45) },
  { id: "edge-90", label: "edge θ=90°", channel: "luma", weights: gaborKernel(90) },
  { id: "edge-135", label: "edge θ=135°", channel: "luma", weights: gaborKernel(135) },
  { id: "dog-on", label: "on-centre", channel: "luma", weights: differenceOfGaussians(1) },
  { id: "dog-off", label: "off-centre", channel: "luma", weights: differenceOfGaussians(-1) },
  { id: "red-green", label: "red–green", channel: "redGreen", weights: gaussianKernel(1.1) },
  { id: "blue-yellow", label: "blue–yellow", channel: "blueYellow", weights: gaussianKernel(1.1) },
];
