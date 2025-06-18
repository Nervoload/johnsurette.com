import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const SpinningBox: React.FC = () => {
  const ref = useRef<any>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
      ref.current.rotation.x += delta / 2;
    }
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffa500" />
    </mesh>
  );
};

const CardScene: React.FC = () => (
  <>
    <ambientLight intensity={0.5} />
    <SpinningBox />
  </>
);

export default CardScene;
