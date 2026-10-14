// The "imagine" step: a photo emerges from Gaussian noise along a diffusion schedule.
// Cosine ᾱ schedule from Nichol & Dhariwal (2021): x_t = √ᾱ_t · x_0 + √(1 − ᾱ_t) · ε.

import { clamp } from "../../core/math.ts";

export const DENOISE_STEPS = 20;
const S = 0.008;

const f = (t: number) => Math.cos(((t + S) / (1 + S)) * (Math.PI / 2)) ** 2;

/** ᾱ at diffusion time t ∈ [0, 1] (0 = clean image, 1 = pure noise). */
export const alphaBar = (t: number): number => clamp(f(clamp(t)) / f(0), 0, 1);

export interface DenoiseFrame {
  /** Which of the visible denoising steps we're on (0..DENOISE_STEPS). Changes the noise sample. */
  step: number;
  signal: number;
  noise: number;
}

/**
 * progress 0 → pure noise, 1 → clean image. Quantized into visible steps the way a sampler would run,
 * so each step draws fresh noise at a lower level.
 */
export const denoiseFrame = (progress: number, steps = DENOISE_STEPS): DenoiseFrame => {
  const step = Math.min(steps, Math.floor(clamp(progress) * steps));
  const t = 1 - step / steps;
  const ab = alphaBar(t);
  return { step, signal: Math.sqrt(ab), noise: Math.sqrt(1 - ab) };
};
