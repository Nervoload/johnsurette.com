// Hodgkin–Huxley (1952) squid giant axon, units: mV, ms, µA/cm², mS/cm², µF/cm².
// Gating variables use the Rush–Larsen exponential update (stable at large steps), voltage uses Euler.

export interface HHState {
  v: number;
  m: number;
  h: number;
  n: number;
}

export const HH = {
  cm: 1,
  gNa: 120,
  eNa: 50,
  gK: 36,
  eK: -77,
  gL: 0.3,
  eL: -54.387,
  rest: -65,
} as const;

// The two removable singularities (0/0) are replaced by their limits.
const alphaM = (v: number) => (Math.abs(v + 40) < 1e-7 ? 1 : (0.1 * (v + 40)) / (1 - Math.exp(-(v + 40) / 10)));
const betaM = (v: number) => 4 * Math.exp(-(v + 65) / 18);
const alphaH = (v: number) => 0.07 * Math.exp(-(v + 65) / 20);
const betaH = (v: number) => 1 / (1 + Math.exp(-(v + 35) / 10));
const alphaN = (v: number) => (Math.abs(v + 55) < 1e-7 ? 0.1 : (0.01 * (v + 55)) / (1 - Math.exp(-(v + 55) / 10)));
const betaN = (v: number) => 0.125 * Math.exp(-(v + 65) / 80);

const gate = (x: number, alpha: number, beta: number, dt: number) => {
  const sum = alpha + beta;
  const inf = alpha / sum;
  return inf + (x - inf) * Math.exp(-dt * sum);
};

export const createHHState = (v = HH.rest): HHState => {
  const a = alphaM(v);
  const b = alphaH(v);
  const c = alphaN(v);
  return {
    v,
    m: a / (a + betaM(v)),
    h: b / (b + betaH(v)),
    n: c / (c + betaN(v)),
  };
};

/** Membrane current terms, for display. */
export const hhCurrents = (s: HHState) => ({
  iNa: HH.gNa * s.m ** 3 * s.h * (s.v - HH.eNa),
  iK: HH.gK * s.n ** 4 * (s.v - HH.eK),
  iL: HH.gL * (s.v - HH.eL),
});

export const stepHH = (s: HHState, current: number, dt: number): HHState => {
  const v = s.v;
  s.m = gate(s.m, alphaM(v), betaM(v), dt);
  s.h = gate(s.h, alphaH(v), betaH(v), dt);
  s.n = gate(s.n, alphaN(v), betaN(v), dt);
  const { iNa, iK, iL } = hhCurrents(s);
  s.v = v + ((current - iNa - iK - iL) / HH.cm) * dt;
  return s;
};

/** Normalized depolarization for drawing: 0 at rest (-65 mV), 1 near the spike peak (+40 mV). */
export const hhGlow = (v: number): number => Math.max(0, Math.min(1, (v - HH.rest) / 105));
