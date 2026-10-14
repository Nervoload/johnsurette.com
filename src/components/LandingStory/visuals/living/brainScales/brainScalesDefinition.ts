import type { LivingSceneDefinition } from "../sceneTypes";
import BrainScalesScene, { BRAIN_STAGE_DURATIONS, BrainScalesContent } from "./BrainScalesScene";

export const brainScalesDefinition: LivingSceneDefinition<BrainScalesContent> = {
  id: "brainScales",
  stages: [
    {
      id: "neuron",
      duration: BRAIN_STAGE_DURATIONS[0],
      label: "Neuron",
      caption: "Hodgkin–Huxley membrane, slowed 250× · click to fire it",
    },
    {
      id: "circuit",
      duration: BRAIN_STAGE_DURATIONS[1],
      label: "Circuit",
      caption: "20 Izhikevich neurons learning by STDP · click one",
    },
    {
      id: "cortex",
      duration: BRAIN_STAGE_DURATIONS[2],
      label: "Cortex",
      caption: "six layers, travelling waves · L5 and L6 project out of the cortex",
    },
    {
      id: "brain",
      duration: BRAIN_STAGE_DURATIONS[3],
      label: "Brain",
      caption: "~86 billion neurons · MNI ICBM152 surface",
    },
    { id: "dive", duration: BRAIN_STAGE_DURATIONS[4], label: "Dive", caption: "back down to a single cell" },
  ],
  labels: [
    { id: "scope-title", text: "Vm · membrane voltage", tone: "ink", align: "left" },
    { id: "scope-peak", text: "+40 mV", align: "left" },
    { id: "scope-rest", text: "−65 mV rest", align: "left" },
    { id: "neuron-apical", text: "apical dendrite → pia", align: "left" },
    { id: "neuron-axon", text: "axon · nodes of Ranvier", align: "left" },
    { id: "circuit-exc", text: "excitatory", align: "left" },
    { id: "circuit-inh", text: "inhibitory", align: "left" },
    { id: "L1", text: "L1", align: "right" },
    { id: "L2", text: "L2", align: "right" },
    { id: "L3", text: "L3", align: "right" },
    { id: "L4", text: "L4", align: "right" },
    { id: "L5", text: "L5", align: "right" },
    { id: "L6", text: "L6", align: "right" },
    { id: "proj-l5", text: "→ brainstem", tone: "warm", align: "left" },
    { id: "proj-l6", text: "→ thalamus", tone: "amber", align: "left" },
    { id: "lobe-frontal", text: "frontal", align: "center" },
    { id: "lobe-parietal", text: "parietal", align: "center" },
    { id: "lobe-temporal", text: "temporal", align: "center" },
    { id: "lobe-occipital", text: "occipital", align: "center" },
    { id: "lobe-cerebellum", text: "cerebellum", align: "center" },
  ],
  camera: { position: [0, 0.15, 6.4], fov: 36 },
  Scene: BrainScalesScene,
};
