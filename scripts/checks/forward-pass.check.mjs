import { CONV1_KERNELS, KERNEL_SIZE } from "../../src/components/LandingStory/visuals/living/forwardPass/core/kernels.ts";
import {
  INPUT_SIZE,
  conv2dSame,
  createNetworkWeights,
  runForwardPass,
  toDisplayAtlas,
} from "../../src/components/LandingStory/visuals/living/forwardPass/core/network.ts";
import { alphaBar, denoiseFrame } from "../../src/components/LandingStory/visuals/living/forwardPass/core/diffusion.ts";

const syntheticImage = (fn) => {
  const rgb = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
  for (let y = 0; y < INPUT_SIZE; y += 1) {
    for (let x = 0; x < INPUT_SIZE; x += 1) {
      const [r, g, b] = fn(x, y);
      const i = (y * INPUT_SIZE + x) * 3;
      rgb[i] = r;
      rgb[i + 1] = g;
      rgb[i + 2] = b;
    }
  }
  return rgb;
};

export default () => {
  const out = [];
  const size = INPUT_SIZE;
  const verticalEdge = new Float32Array(size * size);
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) verticalEdge[y * size + x] = x < size / 2 ? 0 : 1;

  const response = (kernelIndex, image) =>
    conv2dSame(image, size, CONV1_KERNELS[kernelIndex].weights, KERNEL_SIZE).map((v) => Math.abs(v));
  const edge0 = response(0, verticalEdge);
  const atEdge = edge0[32 * size + 31] + edge0[32 * size + 32];
  const flat = edge0[32 * size + 8];
  out.push(["θ=0° filter fires on a vertical edge and ~0 on flat areas", atEdge > 0.3 && flat < 1e-6, `edge ${atEdge.toFixed(3)}, flat ${flat.toExponential(1)}`]);
  const edge90 = response(2, verticalEdge);
  out.push(["θ=90° filter mostly ignores a vertical edge", edge90[32 * size + 31] + edge90[32 * size + 32] < atEdge * 0.25]);

  const sums = CONV1_KERNELS.slice(0, 6).map((k) => k.weights.reduce((s, v) => s + v, 0));
  out.push(["edge and centre-surround filters are zero-mean", sums.every((s) => Math.abs(s) < 1e-6)]);

  const weights = createNetworkWeights(4);
  const again = createNetworkWeights(4);
  out.push(["same seed gives identical weights", weights.dense2.every((v, i) => v === again.dense2[i])]);

  const face = syntheticImage((x, y) => {
    const d = Math.hypot(x - 32, y - 28) / 20;
    return d < 1 ? [0.85, 0.65, 0.55] : [0.12, 0.14, 0.2];
  });
  const target = 2;
  const started = performance.now();
  const result = runForwardPass(face, weights, target);
  const elapsed = performance.now() - started;
  out.push(["shapes: 64² × 8 → 32² × 16 → 16-d → 24 → 4", result.conv1.size === 64 && result.conv1.channels === 8 && result.conv2.size === 32 && result.conv2.channels === 16 && result.features.length === 16 && result.hidden.length === 24 && result.probabilities.length === 4]);
  const total = result.probabilities.reduce((s, v) => s + v, 0);
  out.push(["softmax sums to 1", Math.abs(total - 1) < 1e-5, total.toFixed(6)]);
  out.push(["the target label wins", result.winner === target, Array.from(result.probabilities).map((v) => v.toFixed(2)).join(" ")]);
  out.push(["forward pass under 60 ms in Node", elapsed < 60, `${elapsed.toFixed(1)} ms`]);
  out.push(["conv1 responses are non-negative (ReLU)", result.conv1.data.every((v) => v >= 0)]);
  const atlas = toDisplayAtlas(result.conv1);
  out.push(["display atlas is 8 tiles of 64×64 bytes", atlas.length === 64 * 8 * 64 && atlas.some((v) => v > 200)]);

  let monotonic = true;
  for (let t = 0; t < 1; t += 0.05) if (alphaBar(t + 0.05) > alphaBar(t) + 1e-12) monotonic = false;
  out.push(["cosine ᾱ schedule is monotonic, 1 → 0", monotonic && Math.abs(alphaBar(0) - 1) < 1e-9 && alphaBar(1) < 1e-3]);
  const start = denoiseFrame(0);
  const end = denoiseFrame(1);
  out.push(["denoise runs from noise to the clean photo", start.noise > 0.99 && end.signal > 0.999 && end.noise < 0.01]);
  return out;
};
