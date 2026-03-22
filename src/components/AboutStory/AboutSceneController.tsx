import React from "react";
import { aboutStoryNodesById } from "../../content/aboutStory";
import { aboutSceneRegistry } from "./aboutSceneRegistry";
import type { AboutStoryOverlayState, AboutStoryPointer, AboutStoryQualityMode, AboutTimelineState } from "./types";

interface AboutSceneControllerProps {
  timeline: AboutTimelineState;
  pointer: AboutStoryPointer;
  qualityMode: AboutStoryQualityMode;
  overlayState: AboutStoryOverlayState;
}

const AboutSceneController: React.FC<AboutSceneControllerProps> = ({
  timeline,
  pointer,
  qualityMode,
  overlayState,
}) => {
  return (
    <>
      {timeline.renderedNodeIds.map((nodeId) => {
        const node = aboutStoryNodesById[nodeId];
        const runtime = timeline.nodes.find((entry) => entry.node.id === nodeId);
        if (!node || !runtime) return null;

        const SceneComponent = aboutSceneRegistry[node.type];
        return (
          <group key={node.id} visible={runtime.mix > 0.001}>
            <SceneComponent
              node={node}
              globalProgress={timeline.smoothedProgress}
              nodeProgress={runtime.nodeProgress}
              mix={runtime.mix}
              direction={timeline.transition?.direction ?? 1}
              isActive={timeline.activeIndex === runtime.index}
              isAdjacent={timeline.adjacentIndex === runtime.index}
              qualityMode={qualityMode}
              pointer={pointer}
              overlayState={overlayState}
            />
          </group>
        );
      })}
    </>
  );
};

export default AboutSceneController;
