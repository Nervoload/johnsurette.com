// src/components/backgrounds/NoiseGradientBG.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* 
  Smooth simplex noise function (from Ashima Arts)
  https://github.com/ashima/webgl-noise
*/
const noiseGLSL = `
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0/289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0/289.0)) * 289.0;
}
vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0+2.0*C.x
                      0.024390243902439); // 1.0/41.0
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  vec3 p = permute(permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const vertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  // Uniform array of 7 colors.
  uniform vec3 u_colors[7];
  uniform float u_speed;
  uniform float u_intensity; // How strongly the noise distorts the gradient.
  varying vec2 vUv;
  
  
  ${noiseGLSL}
  
  void main(){
    // Use the y coordinate of the UV to define the gradient.
    // (You can switch to vUv.x if you prefer a horizontal gradient.)
    float t = vUv.y;
    
    // Compute a noise value that depends on both coordinates and time.
    // Here we use snoise to generate a smooth displacement.
    float displacement = snoise(vUv * 3.0 + u_time * u_speed);
    // Distort the gradient coordinate by the noise, scaled by intensity.
    t += displacement * u_intensity;
    // Clamp the result to [0,1]
    t = clamp(t, 0.0, 1.0);
    
    // Map t continuously across 7 colors.
    // 7 colors form 6 segments.
    float segments = 6.0;
    float idx = t * segments;
    float index = floor(idx);
    float localT = fract(idx);
    localT = smoothstep(0.0, 1.0, localT);
    
    vec3 col;
    if (index < 0.5) {
      col = mix(u_colors[0], u_colors[1], localT);
    } else if (index < 1.5) {
      col = mix(u_colors[1], u_colors[2], localT);
    } else if (index < 2.5) {
      col = mix(u_colors[2], u_colors[3], localT);
    } else if (index < 3.5) {
      col = mix(u_colors[3], u_colors[4], localT);
    } else if (index < 4.5) {
      col = mix(u_colors[4], u_colors[5], localT);
    } else {
      col = mix(u_colors[5], u_colors[6], localT);
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function NoiseGradient({ planeWidth, planeHeight }) {
  const meshRef = useRef();

  // Helper function to create a random bright color.
  // Ensures lightness is at least 0.7 (70%).
  const randomBrightColor = (h,s,l) => {
    const color = new THREE.Color();
    if (h == null){
      h = Math.random(); // Hue between 0 and 1
    }
    if (s == null){
      s = 0.8 + Math.random() * 0.2; // Saturation between 0.5 and 1 for decent vibrancy
    }
    if (l == null) {
      l = 0.5 + Math.random() * 0.2; // Lightness between 0.7 and 1
    }
    
    color.setHSL(h, s, l);
    return color;
  };

  // Generate 4 bright colors only once on component mount.
  const defaulthue = () => {
    return Math.floor(Math.random() * 12) / 12;
  }
  var h = defaulthue();

  const brightColors = useMemo(() => [
    randomBrightColor(h,null,null),
    randomBrightColor((1-h+((1-h)*Math.random())),null,null),
    randomBrightColor((1-h),null,null),
    randomBrightColor(h,null,null)
  ], []);

  
  useFrame(({ clock, size }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      // Update the time uniform.
      meshRef.current.material.uniforms.u_time.value = t;
      // Update the resolution uniform.
      meshRef.current.material.uniforms.u_resolution.value = new THREE.Vector2(size.width, size.height);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        attach="material"
        uniforms={{
          u_time: { value: 0 },
          u_resolution: { value: new THREE.Vector2(2000, 2000) },
          // The first and last two colors are fixed (black) and the 4 in the middle are randomized.
          u_colors: { value: [
            //new THREE.Color('#FFFFFF'), // Fixed white
            new THREE.Color('#000000'),
            brightColors[0],
            brightColors[1],
            brightColors[2],
            brightColors[3],
            new THREE.Color('#000000'),
            new THREE.Color('#000000')
            //new THREE.Color('#FFFFFF'), // Fixed white
            // new THREE.Color('#FFFFFF') 
          ] },
          u_speed: { value: 0.45 },
          u_intensity: { value: 0.18 },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

function NoiseGradientCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  
  // For an orthographic camera, define a view height.
  const viewHeight = 2;
  const viewWidth = viewHeight * aspect;
  
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      orthographic
      camera={{
        left: -viewWidth / 2,
        right: viewWidth / 2,
        top: viewHeight / 2,
        bottom: -viewHeight / 2,
        zoom: 1,
        position: [0, 0, 100],
      }}
    >
      <NoiseGradient planeWidth={viewWidth} planeHeight={viewHeight} />
    </Canvas>
  );
}

export default React.memo(NoiseGradientCanvas);