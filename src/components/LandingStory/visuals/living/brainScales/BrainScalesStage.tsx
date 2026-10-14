import React from "react";
import type { LandingBrainScalesContent } from "../../../../../content/types";
import LivingSceneFrame, { LivingSceneFrameProps } from "../LivingSceneFrame";
import { brainScalesDefinition } from "./brainScalesDefinition";
import type { BrainScalesContent } from "./BrainScalesScene";

export type BrainScalesStageProps = Omit<
  LivingSceneFrameProps<BrainScalesContent>,
  "definition" | "content" | "title" | "description"
> & {
  content: LandingBrainScalesContent;
};

/** Lazy-loadable unit for the "Scales of mind" scene. */
const BrainScalesStage: React.FC<BrainScalesStageProps> = ({ content, ...frame }) => (
  <LivingSceneFrame
    {...frame}
    definition={brainScalesDefinition}
    content={content}
    title="Scales of mind: from one neuron to a whole brain"
    description={`An animated 3D zoom. It starts on a single pyramidal neuron simulated with the Hodgkin–Huxley equations, firing action potentials that jump between nodes of Ranvier. It pulls back to a small circuit of spiking neurons whose connections change with spike-timing-dependent plasticity, then to a slab of neocortex with its six layers and long-range projections from layers 5 and 6, then to a whole brain lighting up, before diving back into one cell. ${content.attribution}`}
  />
);

export default BrainScalesStage;
