import * as THREE from "three";
import { INPUT_SIZE, NetworkWeights, ForwardPassResult, createNetworkWeights, runForwardPass, toDisplayAtlas } from "./core/network.ts";

export interface ForwardPassInput {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  /** Index into the outputs this photo should win. */
  readonly outputIndex: number;
}

export interface ForwardPassContent {
  readonly inputs: readonly ForwardPassInput[];
  readonly outputs: readonly { readonly id: string; readonly label: string }[];
}

export interface PreparedInput {
  readonly result: ForwardPassResult;
  readonly image: THREE.DataTexture;
  readonly conv1: THREE.DataTexture;
  readonly conv2: THREE.DataTexture;
}

const loadPixels = async (src: string): Promise<Float32Array> => {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = INPUT_SIZE;
  canvas.height = INPUT_SIZE;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("2D canvas unavailable");
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, INPUT_SIZE, INPUT_SIZE);
  const { data } = context.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
  const rgb = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
  for (let i = 0; i < INPUT_SIZE * INPUT_SIZE; i += 1) {
    rgb[i * 3] = data[i * 4] / 255;
    rgb[i * 3 + 1] = data[i * 4 + 1] / 255;
    rgb[i * 3 + 2] = data[i * 4 + 2] / 255;
  }
  return rgb;
};

const imageTexture = (rgb: Float32Array): THREE.DataTexture => {
  const bytes = new Uint8Array(INPUT_SIZE * INPUT_SIZE * 4);
  for (let y = 0; y < INPUT_SIZE; y += 1) {
    const row = INPUT_SIZE - 1 - y; // texture rows start at the bottom
    for (let x = 0; x < INPUT_SIZE; x += 1) {
      const src = (y * INPUT_SIZE + x) * 3;
      const dst = (row * INPUT_SIZE + x) * 4;
      bytes[dst] = Math.round(rgb[src] * 255);
      bytes[dst + 1] = Math.round(rgb[src + 1] * 255);
      bytes[dst + 2] = Math.round(rgb[src + 2] * 255);
      bytes[dst + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(bytes, INPUT_SIZE, INPUT_SIZE, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
};

const atlasTexture = (bytes: Uint8Array, width: number, height: number): THREE.DataTexture => {
  const texture = new THREE.DataTexture(bytes, width, height, THREE.RedFormat, THREE.UnsignedByteType);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
};

const idle = () =>
  new Promise<void>((resolve) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => resolve(), { timeout: 120 });
    else window.setTimeout(resolve, 16);
  });

let sharedWeights: NetworkWeights | null = null;

/** Loads each photo and runs the real forward pass on it, yielding between photos. */
export const prepareForwardPass = async (
  content: ForwardPassContent,
  onReady: (index: number, prepared: PreparedInput) => void,
  isCancelled: () => boolean,
): Promise<void> => {
  sharedWeights ??= createNetworkWeights(content.outputs.length);
  for (let index = 0; index < content.inputs.length; index += 1) {
    const input = content.inputs[index];
    const rgb = await loadPixels(input.src);
    if (isCancelled()) return;
    await idle();
    const result = runForwardPass(rgb, sharedWeights, input.outputIndex);
    if (isCancelled()) return;
    onReady(index, {
      result,
      image: imageTexture(rgb),
      conv1: atlasTexture(toDisplayAtlas(result.conv1), result.conv1.size * result.conv1.channels, result.conv1.size),
      conv2: atlasTexture(toDisplayAtlas(result.conv2), result.conv2.size * result.conv2.channels, result.conv2.size),
    });
    await idle();
  }
};
