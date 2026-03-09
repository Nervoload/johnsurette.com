import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OriginLightPreset, OriginPalette, OriginPointer } from "../types";

interface OriginLightRigProps {
  lighting: OriginLightPreset;
  palette: OriginPalette;
  pointer: OriginPointer;
  reducedMotion: boolean;
}

const OriginLightRig: React.FC<OriginLightRigProps> = ({ lighting, palette, pointer, reducedMotion }) => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  const accentColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const secondaryColor = useMemo(() => new THREE.Color(palette.secondary), [palette.secondary]);
  const glowColor = useMemo(() => new THREE.Color(palette.glow), [palette.glow]);

  useFrame((_, delta) => {
    const mix = 1 - Math.exp(-delta * 4.2);
    const pointerLift = reducedMotion ? 0.08 : 0.18;

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        lighting.ambientIntensity,
        mix,
      );
      ambientRef.current.color.lerp(accentColor, mix * 0.4);
    }

    if (keyRef.current) {
      keyRef.current.intensity = THREE.MathUtils.lerp(keyRef.current.intensity, lighting.keyIntensity, mix);
      keyRef.current.position.lerp(
        new THREE.Vector3(
          lighting.keyPosition[0] + pointer.x * pointerLift,
          lighting.keyPosition[1] + pointer.y * pointerLift,
          lighting.keyPosition[2],
        ),
        mix,
      );
      keyRef.current.color.lerp(new THREE.Color(palette.text), mix * 0.4);
    }

    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(fillRef.current.intensity, lighting.fillIntensity, mix);
      fillRef.current.position.lerp(
        new THREE.Vector3(
          lighting.fillPosition[0] - pointer.x * pointerLift * 0.5,
          lighting.fillPosition[1],
          lighting.fillPosition[2],
        ),
        mix,
      );
      fillRef.current.color.lerp(secondaryColor, mix);
    }

    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.lerp(rimRef.current.intensity, lighting.rimIntensity, mix);
      rimRef.current.position.lerp(new THREE.Vector3(0, 1.4, -2.4), mix);
      rimRef.current.color.lerp(glowColor, mix);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={lighting.ambientIntensity} color={palette.text} />
      <directionalLight ref={keyRef} intensity={lighting.keyIntensity} position={lighting.keyPosition} color={palette.text} />
      <pointLight ref={fillRef} intensity={lighting.fillIntensity} position={lighting.fillPosition} color={palette.secondary} distance={9} />
      <pointLight ref={rimRef} intensity={lighting.rimIntensity} position={[0, 1.4, -2.4]} color={palette.glow} distance={8} />
    </>
  );
};

export default OriginLightRig;
