import React, { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OriginCameraPreset, OriginHotspotDefinition, OriginPointer } from "../types";

interface OriginCameraRigProps {
  preset: OriginCameraPreset;
  pointer: OriginPointer;
  hotspot: OriginHotspotDefinition | null;
  reducedMotion: boolean;
}

const OriginCameraRig: React.FC<OriginCameraRigProps> = ({ preset, pointer, hotspot, reducedMotion }) => {
  const { camera } = useThree();

  const positionTarget = useMemo(() => new THREE.Vector3(), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);
  const pointerVector = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) {
      return;
    }

    const basePosition = preset.position;
    const baseTarget = preset.target;
    const parallaxStrength = reducedMotion ? preset.parallax * 0.4 : preset.parallax;
    const drift = reducedMotion ? preset.drift * 0.3 : preset.drift;

    pointerVector.set(pointer.x * parallaxStrength, pointer.y * parallaxStrength * 0.6, 0);

    positionTarget.set(basePosition[0], basePosition[1], basePosition[2]);
    positionTarget.x += pointerVector.x;
    positionTarget.y += pointerVector.y;
    positionTarget.z += Math.sin(state.clock.elapsedTime * 0.28) * drift;

    lookAtTarget.set(baseTarget[0], baseTarget[1], baseTarget[2]);
    lookAtTarget.x += pointer.x * parallaxStrength * 0.18;
    lookAtTarget.y += pointer.y * parallaxStrength * 0.14;

    if (hotspot) {
      positionTarget.x += hotspot.cameraOffset[0];
      positionTarget.y += hotspot.cameraOffset[1];
      positionTarget.z += hotspot.cameraOffset[2];
      lookAtTarget.set(hotspot.focusTarget[0], hotspot.focusTarget[1], hotspot.focusTarget[2]);
    }

    const mix = 1 - Math.exp(-delta * 3.8);
    camera.position.lerp(positionTarget, mix);
    camera.fov = THREE.MathUtils.lerp(camera.fov, preset.fov, mix);
    camera.lookAt(lookAtTarget);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, preset.roll ?? 0, mix * 0.5);
    camera.updateProjectionMatrix();
  });

  return null;
};

export default OriginCameraRig;
