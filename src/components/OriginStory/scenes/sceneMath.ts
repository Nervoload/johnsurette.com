export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const smoothStep = (value: number): number => {
  const clamped = clamp01(value);
  return clamped * clamped * (3 - 2 * clamped);
};

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;
