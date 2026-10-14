// A small spiking circuit: Izhikevich (2003) neurons with spike-timing-dependent plasticity.
// Regular-spiking excitatory cells and fast-spiking inhibitory cells, driven by seeded Gaussian
// "thalamic" noise as in Izhikevich's 2003 network.

import type { Rng } from "../../core/math.ts";
import { gaussian, mulberry32 } from "../../core/math.ts";

export interface CircuitNeuron {
  readonly excitatory: boolean;
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  v: number;
  u: number;
  /** STDP trace of this cell's own spikes (used as the postsynaptic trace). */
  trace: number;
  /** Extra current injected by a click, in pA-like model units, decaying. */
  stimulus: number;
}

export interface CircuitSynapse {
  readonly pre: number;
  readonly post: number;
  readonly excitatory: boolean;
  readonly initial: number;
  weight: number;
}

export interface Circuit {
  readonly neurons: CircuitNeuron[];
  readonly synapses: CircuitSynapse[];
  /** For each neuron, the synapses it projects onto. */
  readonly outgoing: number[][];
  readonly incoming: number[][];
  rng: Rng;
  time: number;
  readonly seed: number;
}

export const STDP = { aPlus: 0.06, aMinus: 0.066, tau: 20, wMax: 1 } as const;
const SYNAPTIC_GAIN = 18;
const DRIVE = { excitatory: { mean: 2.2, sigma: 5 }, inhibitory: { mean: 1.2, sigma: 2.4 } } as const;

const regularSpiking = () => ({ excitatory: true, a: 0.02, b: 0.2, c: -65, d: 8 });
const fastSpiking = () => ({ excitatory: false, a: 0.1, b: 0.2, c: -65, d: 2 });

export const createCircuit = (excitatory: number, inhibitory: number, seed = 1907, connectionProbability = 0.22): Circuit => {
  const rng = mulberry32(seed);
  const neurons: CircuitNeuron[] = [];
  for (let i = 0; i < excitatory + inhibitory; i += 1) {
    const kind = i < excitatory ? regularSpiking() : fastSpiking();
    neurons.push({ ...kind, v: -65, u: kind.b * -65, trace: 0, stimulus: 0 });
  }
  const synapses: CircuitSynapse[] = [];
  const outgoing: number[][] = neurons.map(() => []);
  const incoming: number[][] = neurons.map(() => []);
  for (let pre = 0; pre < neurons.length; pre += 1) {
    for (let post = 0; post < neurons.length; post += 1) {
      if (pre === post || rng() > connectionProbability) continue;
      const exc = neurons[pre].excitatory;
      const initial = exc ? 0.35 + rng() * 0.3 : 0.8;
      outgoing[pre].push(synapses.length);
      incoming[post].push(synapses.length);
      synapses.push({ pre, post, excitatory: exc, initial, weight: initial });
    }
  }
  return { neurons, synapses, outgoing, incoming, rng, time: 0, seed };
};

/** Back to the initial weights and resting state, with the same input sequence. */
export const resetCircuit = (circuit: Circuit): void => {
  circuit.rng = mulberry32(circuit.seed + 17);
  circuit.time = 0;
  circuit.neurons.forEach((neuron) => {
    neuron.v = neuron.c;
    neuron.u = neuron.b * neuron.c;
    neuron.trace = 0;
    neuron.stimulus = 0;
  });
  circuit.synapses.forEach((synapse) => {
    synapse.weight = synapse.initial;
  });
};

export const stimulate = (circuit: Circuit, index: number, amount = 22): void => {
  const neuron = circuit.neurons[index];
  if (neuron) neuron.stimulus = amount;
};

const clampWeight = (w: number) => Math.min(STDP.wMax, Math.max(0, w));

/**
 * Advance by dt (ms). Returns indices that spiked during this step. Synaptic input from spikes in
 * the previous step arrives this step (one-step delay keeps the update order-independent).
 */
export const stepCircuit = (circuit: Circuit, dt: number, pendingInput: Float32Array): number[] => {
  const { neurons, synapses } = circuit;
  const spiked: number[] = [];
  const decay = Math.exp(-dt / STDP.tau);

  for (let i = 0; i < neurons.length; i += 1) {
    const neuron = neurons[i];
    neuron.trace *= decay;
    let current = pendingInput[i];
    pendingInput[i] = 0;
    const drive = neuron.excitatory ? DRIVE.excitatory : DRIVE.inhibitory;
    current += drive.mean + drive.sigma * gaussian(circuit.rng);
    current += neuron.stimulus;
    neuron.stimulus *= Math.exp(-dt / 25);

    // Two half-steps for v, as in Izhikevich's reference implementation.
    const half = dt / 2;
    for (let k = 0; k < 2; k += 1) {
      neuron.v += half * (0.04 * neuron.v * neuron.v + 5 * neuron.v + 140 - neuron.u + current);
    }
    neuron.u += dt * neuron.a * (neuron.b * neuron.v - neuron.u);

    if (neuron.v >= 30) {
      neuron.v = neuron.c;
      neuron.u += neuron.d;
      spiked.push(i);
    }
  }

  for (const index of spiked) {
    const neuron = neurons[index];
    // Post spike: potentiate incoming excitatory synapses by the presynaptic traces.
    for (const s of circuit.incoming[index]) {
      const synapse = synapses[s];
      if (!synapse.excitatory) continue;
      synapse.weight = clampWeight(synapse.weight + STDP.aPlus * neurons[synapse.pre].trace * (STDP.wMax - synapse.weight));
    }
    // Pre spike: depress outgoing excitatory synapses by the postsynaptic traces, and deliver input.
    for (const s of circuit.outgoing[index]) {
      const synapse = synapses[s];
      if (synapse.excitatory) {
        synapse.weight = clampWeight(synapse.weight - STDP.aMinus * neurons[synapse.post].trace * synapse.weight);
      }
      pendingInput[synapse.post] += (synapse.excitatory ? 1 : -1.6) * synapse.weight * SYNAPTIC_GAIN;
    }
    neuron.trace += 1;
  }

  circuit.time += dt;
  return spiked;
};
