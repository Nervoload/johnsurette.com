// src/pages/landing/sections/WelcomeSection.jsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../styles/WelcomeSection.css'; // (Create a CSS file to style this section)

//
// Interactive 3D Asset – a warped cube that distorts on hover
//
const WarpedCube = () => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Uniforms for our custom shader material
  const uniforms = {
    u_time: { value: 0 },
    u_warp: { value: 0 }
  };

  // Custom vertex shader: displaces vertices along normals based on time and a warp factor.
  const vertexShader = `
    uniform float u_time;
    uniform float u_warp;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos += normal * sin(u_time + position.x * 5.0) * u_warp;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Simple fragment shader with a solid color
  const fragmentShader = `
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0);
    }
  `;

  // Animate time and smoothly transition the warp value on hover
  useFrame((state, delta) => {
    uniforms.u_time.value += delta;
    // Smoothly update u_warp: target 0.3 when hovered, 0 when not.
    const target = hovered ? 0.3 : 0;
    uniforms.u_warp.value += (target - uniforms.u_warp.value) * delta * 5;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

//
// WelcomeSection Component – text on the left and interactive asset on the right
//
const WelcomeSection = () => {
  return (
    <div className="welcome-content">
      <div className="text-side">
        <h1>This is</h1>
        <h1>JOHN SURETTE</h1>
        <h1>Welcome</h1>
      </div>
      <div className="asset-side">
        {/* The Canvas here is scoped to the 3D asset */}
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 3] }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <WarpedCube />
        </Canvas>
      </div>
    </div>
  );
};

export default WelcomeSection;