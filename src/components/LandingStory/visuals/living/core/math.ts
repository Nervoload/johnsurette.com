// Pure helpers shared by the living scenes. No three.js or DOM imports: these run in Node checks too.

export type Rng = () => number;

/** Small, fast, seedable PRNG (mulberry32). */
export const mulberry32 = (seed: number): Rng => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Standard normal sample (Box–Muller). */
export const gaussian = (rng: Rng): number => {
  let u = 0;
  while (u === 0) u = rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Frame-rate independent exponential approach of `current` toward `target`. */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  target + (current - target) * Math.exp(-lambda * dt);

/**
 * Vertical field of view (degrees) for a canvas that is taller than the slot it is framed for,
 * so the slot area keeps the framing `slotFovDeg` while the extra bleed shows more of the scene.
 */
export const fovForBleed = (slotFovDeg: number, slotHeight: number, canvasHeight: number): number => {
  const half = (slotFovDeg * Math.PI) / 360;
  const ratio = canvasHeight / Math.max(slotHeight, 1);
  return (Math.atan(Math.tan(half) * ratio) * 360) / Math.PI;
};
