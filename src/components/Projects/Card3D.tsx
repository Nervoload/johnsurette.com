import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

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

const FALLBACK_FRONT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><rect width='720' height='1024' fill='#f8fafc'/><rect x='36' y='36' width='648' height='952' rx='28' fill='none' stroke='#94a3b8' stroke-width='8'/></svg>");

const FALLBACK_BACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 1024'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#103a8a'/><stop offset='100%' stop-color='#1f5fd8'/></linearGradient></defs><rect width='720' height='1024' fill='url(#g)'/></svg>");

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

    const frontMap = useLoader(THREE.TextureLoader, frontSrc ?? FALLBACK_FRONT);
    const backMap = useLoader(THREE.TextureLoader, backSrc ?? FALLBACK_BACK);

    useMemo(() => {
      const maxAniso = gl.capabilities.getMaxAnisotropy();
      for (const map of [frontMap, backMap]) {
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = maxAniso;
        map.minFilter = THREE.LinearMipmapLinearFilter;
        map.needsUpdate = true;
      }
    }, [frontMap, backMap, gl]);

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
