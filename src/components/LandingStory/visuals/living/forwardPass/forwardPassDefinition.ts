import type { LivingSceneDefinition } from "../sceneTypes";
import type { ForwardPassContent } from "./forwardPassData";
import ForwardPassScene from "./ForwardPassScene";

export const forwardPassDefinition: LivingSceneDefinition<ForwardPassContent> = {
  id: "forwardPass",
  stages: [
    {
      id: "imagine",
      duration: 2.6,
      label: "Imagine",
      caption: "a photo of me, denoised from pure noise in 20 steps",
      keyframe: 0.97,
    },
    { id: "convolve", duration: 3.6, label: "Convolve", caption: "8 real 5×5 filters: edges, centre-surround, colour" },
    { id: "deepen", duration: 2.4, label: "Deepen", caption: "max-pool 2×2, then 16 filters that combine them" },
    { id: "dense", duration: 2.4, label: "Dense", caption: "global average pool into 24 hidden units" },
    { id: "output", duration: 3.0, label: "Output", caption: "softmax over the paths I've taken", keyframe: 0.52 },
  ],
  labels: [
    { id: "layer-input", text: "input · 64×64 px", align: "center" },
    { id: "layer-conv1", text: "conv1 · 8 filters, 5×5", align: "center" },
    { id: "layer-conv2", text: "conv2 · 16 filters, 3×3", align: "center" },
    { id: "layer-dense", text: "dense · 24", align: "center" },
    { id: "out-0", text: "", align: "left" },
    { id: "out-1", text: "", align: "left" },
    { id: "out-2", text: "", align: "left" },
    { id: "out-3", text: "", align: "left" },
  ],
  camera: { position: [-3.35, 1.75, 6.15], fov: 34 },
  stillStage: 4,
  Scene: ForwardPassScene,
};
