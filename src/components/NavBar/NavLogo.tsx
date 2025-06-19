import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";

const LogoMesh: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ mouse }) => {
    if (ref.current) {
      ref.current.rotation.x = mouse.y * Math.PI * 0.3;
      ref.current.rotation.y = mouse.x * Math.PI * 0.3;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <MeshDistortMaterial color="#ffffff" speed={2} roughness={0.2} metalness={0.6} />
    </mesh>
  );
};

const NavLogo: React.FC = () => (
  <Canvas className="w-10 h-10" camera={{ position: [0, 0, 3] }}>
    <ambientLight intensity={0.7} />
    <pointLight position={[2, 2, 3]} />
    <LogoMesh />
  </Canvas>
);

export default NavLogo;
