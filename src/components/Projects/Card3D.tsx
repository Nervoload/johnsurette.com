// src/components/Projects/Card3D.tsx
import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder from "./textures/backtemp.png";

/* ───────────────────────────── Types */

export interface Card3DProps {
  frontSrc?: string;          // texture url (can be data-url)
  backSrc?:  string;
  width?:    number;          // world units (optional override)
  height?:   number;          // world units (optional override)
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
  width,
  height,
  thickness = 0.02,
  flip,
  pop,
  popScale = 1.15,
  onClick,
  ...rest
}) => {
  /* responsive default size based on viewport */
  const { viewport } = useThree();
  const base = Math.min(viewport.width, viewport.height);      // scene units
  const w = width ?? base * 0.08;      // 25 % of the shorter side
  const h = height ?? w * 1.4;
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
        <boxGeometry args={[w, h, thickness]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.25} roughness={0.8} />
      </mesh>

      {/* front plane */}
      <mesh position={[0, 0, thickness / 2 + 0.0001]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={frontMap} toneMapped={false} />
      </mesh>

      {/* back plane (rotated so texture isn’t mirrored) */}
      <mesh rotation-y={Math.PI} position={[0, 0, -thickness / 2 - 0.0001]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={backMap} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default Card3D;
