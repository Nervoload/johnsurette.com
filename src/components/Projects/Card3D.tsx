// src/components/Projects/Card3D.tsx
import React, { useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder from "./textures/backtemp.png";

/* ───────────────────────────── Types */
type GroupProps = ThreeElements['group'];

export interface Card3DProps extends GroupProps {
  frontSrc?: string;          // texture url (can be data-url)
  backSrc?:  string;
  width?:    number;          // world units
  height?:   number;
  thickness?: number;
  /** 0 → 1 motion value; rotation Y = π * value */
  flip?: MotionValue<number>;
  /** 0 → 1 motion value; 1 = normal scale, >1 = pop-out */
  pop?: MotionValue<number>;
  /** scale multiplier when pop == 1 (default 1.15) */
  popScale?: number;
  /** optional onClick handler (let storyboard decide what to do) */
  onClick?: () => void;
}

/* ───────────────────────────── Component */
const Card3D: React.FC<Card3DProps> = ({
  frontSrc,
  backSrc,
  width = 1,
  height = 1.4,
  thickness = 0.02,
  flip,
  pop,
  popScale = 1.15,
  onClick,
  ...rest
}) => {
  const group = useRef<THREE.Group>(null);

  /* textures (lazy) */
  const [frontMap] = useTexture([frontSrc ?? frontPlaceholder]);
  const [backMap]  = useTexture([backSrc  ?? backPlaceholder]);

  /* animation on every frame (cheap) */
  useFrame(() => {
    const g = group.current;
    if (!g) return;

    /* flip */
    const f = flip?.get?.() ?? 0;
    g.rotation.y = Math.PI * f;

    /* pop-out scale */
    const p = pop?.get?.() ?? 0;
    const scl = 1 + (popScale - 1) * p;
    g.scale.setScalar(scl);
  });

  /* ───────────────────────────── Render */
  return (
    <group ref={group} onClick={onClick} {...rest}>
      {/* subtle bevel: thin box for the rim */}
      <mesh>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.25} roughness={0.8} />
      </mesh>

      {/* front plane */}
      <mesh position={[0, 0, thickness / 2 + 0.0001]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={frontMap} toneMapped={false} />
      </mesh>

      {/* back plane (rotated so texture isn’t mirrored) */}
      <mesh rotation-y={Math.PI} position={[0, 0, -thickness / 2 - 0.0001]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={backMap} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default Card3D;
