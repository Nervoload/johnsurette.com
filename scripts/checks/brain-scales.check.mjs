import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHHState, stepHH, HH } from "../../src/components/LandingStory/visuals/living/brainScales/core/hodgkinHuxley.ts";
import { createCircuit, resetCircuit, stepCircuit, STDP } from "../../src/components/LandingStory/visuals/living/brainScales/core/izhikevich.ts";
import { buildPyramidalNeuron } from "../../src/components/LandingStory/visuals/living/brainScales/core/morphology.ts";
import { CORTICAL_LAYERS, buildColumnPoints } from "../../src/components/LandingStory/visuals/living/brainScales/core/column.ts";
import { decodeBrainPoints } from "../../src/components/LandingStory/visuals/living/brainScales/core/brainFormat.ts";

const DT = 0.01;

const runHH = (pulses, duration) => {
  const s = createHHState();
  let peak = -Infinity;
  let spikes = 0;
  let above = false;
  let nan = false;
  for (let t = 0; t < duration; t += DT) {
    const current = pulses.reduce((sum, [start, len, amp]) => (t >= start && t < start + len ? sum + amp : sum), 0);
    stepHH(s, current, DT);
    if (!Number.isFinite(s.v)) nan = true;
    peak = Math.max(peak, s.v);
    if (!above && s.v > 0) {
      spikes += 1;
      above = true;
    }
    if (above && s.v < -20) above = false;
  }
  return { peak, spikes, nan, state: s };
};

export default async () => {
  const out = [];

  const rest = runHH([], 50);
  out.push(["HH rests at −65 ± 1 mV", Math.abs(rest.state.v - HH.rest) < 1, rest.state.v.toFixed(2)]);

  const single = runHH([[5, 1, 10]], 30);
  out.push(["1 ms of 10 µA/cm² fires one spike peaking +30…+50 mV", single.spikes === 1 && single.peak > 30 && single.peak < 50, `${single.spikes} spike, peak ${single.peak.toFixed(1)} mV`]);

  const weak = runHH([[5, 1, 2]], 30);
  out.push(["2 µA/cm² stays subthreshold", weak.spikes === 0, `peak ${weak.peak.toFixed(1)} mV`]);

  const refractory = runHH([[5, 1, 10], [8, 1, 10]], 30);
  out.push(["a second pulse 3 ms later is refractory", refractory.spikes === 1]);

  const singular = [-40, -55].every((v) => {
    const s = createHHState(v);
    stepHH(s, 0, DT);
    return Number.isFinite(s.v) && Number.isFinite(s.m) && Number.isFinite(s.n);
  });
  out.push(["no NaN at the 0/0 points (−40, −55 mV)", singular && !single.nan]);

  // Izhikevich: tonic firing of RS vs FS under the same constant drive.
  const countSpikes = (circuit, index, current) => {
    const pending = new Float32Array(circuit.neurons.length);
    let n = 0;
    for (let t = 0; t < 1000; t += 0.5) {
      pending[index] += current;
      if (stepCircuit(circuit, 0.5, pending).includes(index)) n += 1;
    }
    return n;
  };
  const lone = createCircuit(1, 1, 3, 0);
  const rs = countSpikes(lone, 0, 10);
  const fs = countSpikes(lone, 1, 10);
  out.push(["regular-spiking cell fires tonically", rs >= 5 && rs < 40, `${rs} Hz`]);
  out.push(["fast-spiking cell fires faster", fs > rs, `${fs} Hz`]);

  // STDP sign: build a two-cell circuit with one excitatory synapse 0 → 1.
  const pair = (order) => {
    const c = createCircuit(2, 0, 11, 1);
    const synapse = c.synapses.find((s) => s.pre === 0 && s.post === 1);
    synapse.weight = 0.5;
    const pending = new Float32Array(2);
    const fire = (index) => {
      c.neurons[index].v = 35;
    };
    const steps = (n) => {
      for (let i = 0; i < n; i += 1) {
        c.rng = () => 0.25; // Box–Muller gives 0 for u = v = 0.25: no noise, only the mean drive
        stepCircuit(c, 0.5, pending);
        pending.fill(0);
      }
    };
    if (order === "pre-post") {
      fire(0); steps(1); steps(10); fire(1); steps(1);
    } else {
      fire(1); steps(1); steps(10); fire(0); steps(1);
    }
    return synapse.weight;
  };
  const potentiated = pair("pre-post");
  const depressed = pair("post-pre");
  out.push(["STDP: pre→post (Δt = +5 ms) potentiates", potentiated > 0.5, potentiated.toFixed(3)]);
  out.push(["STDP: post→pre (Δt = −5 ms) depresses", depressed < 0.5, depressed.toFixed(3)]);

  const busy = createCircuit(16, 4, 1907);
  const pending = new Float32Array(20);
  let total = 0;
  for (let t = 0; t < 2000; t += 0.5) total += stepCircuit(busy, 0.5, pending).length;
  const bounded = busy.synapses.every((s) => s.weight >= 0 && s.weight <= STDP.wMax);
  out.push(["20-cell circuit stays active and bounded", total > 40 && total < 4000 && bounded, `${total} spikes in 2 s`]);
  resetCircuit(busy);
  out.push(["reset restores initial weights", busy.synapses.every((s) => s.weight === s.initial)]);

  const neuron = buildPyramidalNeuron();
  const nodesInside = neuron.nodes.length >= 6 && neuron.nodes.every((d) => d > 0 && d < neuron.axonLength);
  out.push(["neuron has a myelinated axon with nodes of Ranvier", nodesInside && neuron.myelin.length === neuron.nodes.length, `${neuron.nodes.length} nodes`]);

  const column = buildColumnPoints(9000);
  const perLayer = CORTICAL_LAYERS.map((_, i) => column.layer.filter((l) => l === i).length);
  const perThickness = perLayer.map((n, i) => n / CORTICAL_LAYERS[i].thickness);
  out.push(["column: L4 is the densest layer, L1 the sparsest", perThickness[3] === Math.max(...perThickness) && perThickness[0] === Math.min(...perThickness), perLayer.join("/")]);
  out.push(["column: L5 and L6 projection sources exist", column.l5Sources.length >= 4 && column.l6Sources.length >= 2]);

  const file = await readFile(fileURLToPath(new URL("../../public/models/brain-points.v1.bin", import.meta.url)));
  const brain = decodeBrainPoints(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));
  out.push(["brain file decodes 20k points within 200 KB", brain.count === 20000 && file.byteLength <= 204800, `${file.byteLength} bytes`]);
  const quarter = Math.floor(brain.count / 4);
  let ok = true;
  for (let axis = 0; axis < 3; axis += 1) {
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i < quarter; i += 1) {
      lo = Math.min(lo, brain.position[i * 3 + axis]);
      hi = Math.max(hi, brain.position[i * 3 + axis]);
    }
    const span = brain.max[axis] - brain.min[axis];
    if (lo - brain.min[axis] > span * 0.05 || brain.max[axis] - hi > span * 0.05) ok = false;
  }
  out.push(["first 25% of points spans the whole brain (any prefix works for low tiers)", ok]);
  return out;
};
