// Decoder for public/models/brain-points.v1.bin (written by scripts/assets/build_brain_points.py).

export const BRAIN_LOBES = ["frontal", "parietal", "temporal", "occipital", "cerebellum", "brainstem"] as const;
export type BrainLobe = (typeof BRAIN_LOBES)[number];

export interface BrainPoints {
  readonly count: number;
  /** MNI millimetres: x right, y anterior, z superior. */
  readonly position: Float32Array;
  readonly normal: Float32Array;
  /** lobe | (hemisphere << 3); hemisphere 0 = left, 1 = right. */
  readonly region: Uint8Array;
  readonly min: [number, number, number];
  readonly max: [number, number, number];
}

export const decodeBrainPoints = (buffer: ArrayBuffer, limit = Infinity): BrainPoints => {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  if (magic !== "BRP1") throw new Error(`brain points: bad magic ${magic}`);
  const total = view.getUint32(4, true);
  const count = Math.min(total, limit);
  const min: [number, number, number] = [view.getFloat32(8, true), view.getFloat32(12, true), view.getFloat32(16, true)];
  const max: [number, number, number] = [view.getFloat32(20, true), view.getFloat32(24, true), view.getFloat32(28, true)];
  const positionsOffset = 32;
  const normalsOffset = positionsOffset + total * 6;
  const regionsOffset = normalsOffset + total * 3;
  if (buffer.byteLength < regionsOffset + total) throw new Error("brain points: truncated file");

  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  const region = new Uint8Array(count);
  for (let i = 0; i < count; i += 1) {
    for (let axis = 0; axis < 3; axis += 1) {
      const q = view.getUint16(positionsOffset + (i * 3 + axis) * 2, true) / 65535;
      position[i * 3 + axis] = min[axis] + q * (max[axis] - min[axis]);
      normal[i * 3 + axis] = view.getInt8(normalsOffset + i * 3 + axis) / 127;
    }
    region[i] = view.getUint8(regionsOffset + i);
  }
  return { count, position, normal, region, min, max };
};
