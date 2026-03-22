import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleNodeCameraPose, mixCameraPoses } from "./sceneCamera";
import type { AboutStoryPointer, AboutStoryQualityMode, AboutTimelineState } from "./types";

interface AboutCameraRigProps {
  timeline: AboutTimelineState;
  pointer: AboutStoryPointer;
  qualityMode: AboutStoryQualityMode;
}

const AboutCameraRig: React.FC<AboutCameraRigProps> = ({ timeline, pointer, qualityMode }) => {
  const { camera } = useThree();
  const lookAtTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const activeNode = timeline.nodes[timeline.activeIndex];

  const desiredPose = useMemo(() => {
    const fallbackPose = {
      position: [0, 0.12, 6.2] as [number, number, number],
      target: [0, 0, 0] as [number, number, number],
      fov: 36,
    };

    if (!activeNode) {
      return fallbackPose;
    }

    if (timeline.transition) {
      const fromRuntime = timeline.nodes[timeline.transition.boundaryIndex];
      const toRuntime = timeline.nodes[timeline.transition.boundaryIndex + 1];

      if (fromRuntime && toRuntime) {
        const fromPose = sampleNodeCameraPose(fromRuntime.node, fromRuntime.nodeProgress, pointer, qualityMode);
        const toPose = sampleNodeCameraPose(toRuntime.node, toRuntime.nodeProgress, pointer, qualityMode);
        return mixCameraPoses(fromPose, toPose, timeline.transition.cameraMix);
      }
    }

    return sampleNodeCameraPose(activeNode.node, activeNode.nodeProgress, pointer, qualityMode);
  }, [activeNode, pointer, qualityMode, timeline.nodes, timeline.transition]);

  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPose.position[0], 5.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPose.position[1], 5.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPose.position[2], 5.8, delta);

    lookAtTargetRef.current.x = THREE.MathUtils.damp(lookAtTargetRef.current.x, desiredPose.target[0], 6.6, delta);
    lookAtTargetRef.current.y = THREE.MathUtils.damp(lookAtTargetRef.current.y, desiredPose.target[1], 6.6, delta);
    lookAtTargetRef.current.z = THREE.MathUtils.damp(lookAtTargetRef.current.z, desiredPose.target[2], 6.6, delta);

    camera.lookAt(lookAtTargetRef.current);

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const nextFov = THREE.MathUtils.damp(perspectiveCamera.fov, desiredPose.fov, 5.6, delta);
    if (Math.abs(nextFov - perspectiveCamera.fov) > 0.001) {
      perspectiveCamera.fov = nextFov;
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
};

export default AboutCameraRig;
