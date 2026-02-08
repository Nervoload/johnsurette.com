import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";
import { CARD_BACK_TEXTURES, CARD_FRONT_TEXTURES } from "./cardTextures";

export interface Card3DProps {
  frontSrc?: string;
  backSrc?: string;
  width?: number;
  height?: number;
  thickness?: number;
  borderColor?: string;
  flip?: MotionValue<number>;
  pop?: MotionValue<number>;
  popScale?: number;
  onClick?: () => void;
}

const Card3D = forwardRef<THREE.Group, Card3DProps>(
  (
    {
      frontSrc,
      backSrc,
      width,
      height,
      thickness = 0.02,
      borderColor = "#e0e0e0",
      flip,
      pop,
      popScale = 1.15,
      onClick,
      ...rest
    },
    ref
  ) => {
    const { viewport, gl } = useThree();
    const base = Math.min(viewport.width, viewport.height);
    const w = width ?? base * 0.08;
    const h = height ?? w * 1.4;

    const innerRef = useRef<THREE.Group>(null!);
    useImperativeHandle(ref, () => innerRef.current, []);

    const frontMap = useLoader(THREE.TextureLoader, frontSrc ?? CARD_FRONT_TEXTURES[0]);
    const backMap = useLoader(THREE.TextureLoader, backSrc ?? CARD_BACK_TEXTURES[0]);

    frontMap.colorSpace = THREE.SRGBColorSpace;
    backMap.colorSpace = THREE.SRGBColorSpace;
    frontMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    backMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    frontMap.wrapS = THREE.ClampToEdgeWrapping;
    frontMap.wrapT = THREE.ClampToEdgeWrapping;
    backMap.wrapS = THREE.ClampToEdgeWrapping;
    backMap.wrapT = THREE.ClampToEdgeWrapping;
    frontMap.generateMipmaps = false;
    backMap.generateMipmaps = false;
    frontMap.minFilter = THREE.LinearFilter;
    backMap.minFilter = THREE.LinearFilter;
    frontMap.magFilter = THREE.LinearFilter;
    backMap.magFilter = THREE.LinearFilter;
    frontMap.needsUpdate = true;
    backMap.needsUpdate = true;

    useFrame(() => {
      const group = innerRef.current;
      if (!group) return;

      const flipValue = flip?.get?.() ?? 0;
      group.rotation.y = Math.PI * flipValue;

      const popValue = pop?.get?.() ?? 0;
      const scale = 1 + (popScale - 1) * popValue;
      group.scale.setScalar(scale);
    });

    return (
      <group ref={innerRef} onClick={onClick} {...rest}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, thickness]} />
          <meshStandardMaterial color={borderColor} metalness={0.12} roughness={0.62} />
        </mesh>

        <mesh castShadow receiveShadow position={[0, 0, thickness / 2 + 0.0001]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={frontMap} roughness={0.62} metalness={0.02} />
        </mesh>

        <mesh castShadow receiveShadow rotation-y={Math.PI} position={[0, 0, -thickness / 2 - 0.0001]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={backMap} roughness={0.62} metalness={0.02} />
        </mesh>
      </group>
    );
  }
);

Card3D.displayName = "Card3D";

export default Card3D;
