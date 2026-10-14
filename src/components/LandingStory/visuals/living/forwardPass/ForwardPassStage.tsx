import React, { useMemo } from "react";
import type { LandingForwardPassContent } from "../../../../../content/types";
import LivingSceneFrame, { LivingSceneFrameProps } from "../LivingSceneFrame";
import { forwardPassDefinition } from "./forwardPassDefinition";
import type { ForwardPassContent } from "./forwardPassData";

export type ForwardPassStageProps = Omit<
  LivingSceneFrameProps<ForwardPassContent>,
  "definition" | "content" | "title" | "description"
> & {
  content: LandingForwardPassContent;
};

/** Lazy-loadable unit: the landing section (and the lab) import this file only. */
const ForwardPassStage: React.FC<ForwardPassStageProps> = ({ content, ...frame }) => {
  const sceneContent = useMemo<ForwardPassContent>(
    () => ({
      inputs: content.inputs.map((input) => ({
        id: input.id,
        src: input.src,
        alt: input.alt,
        outputIndex: Math.max(
          0,
          content.outputs.findIndex((output) => output.id === input.outputId),
        ),
      })),
      outputs: content.outputs.map((output) => ({ id: output.id, label: output.label })),
    }),
    [content],
  );
  const photos = content.inputs.map((input) => input.alt.replace(/^John /, "")).join("; ");

  return (
    <LivingSceneFrame
      {...frame}
      definition={forwardPassDefinition}
      content={sceneContent}
      title="Forward pass: a neural network running on photos of John"
      description={`An animated 3D convolutional network. A photo is denoised out of random noise, eight real convolution filters sweep across it, deeper layers combine their responses, and the output layer picks a path from the tree below: ${content.outputs
        .map((output) => output.label)
        .join(", ")}. Photos: ${photos}.`}
    />
  );
};

export default ForwardPassStage;
