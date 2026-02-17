import React, {
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  edgeColor?: string;
  edgeGlow?: MotionValue<number>;
  flip?: MotionValue<number>;
  pop?: MotionValue<number>;
  popScale?: number;
  onClick?: () => void;
  isClickable?: () => boolean;
  frontAttachment?: React.ReactNode;
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
      edgeColor,
      edgeGlow,
      flip,
      pop,
      popScale = 1.15,
      onClick,
      isClickable,
      frontAttachment,
      ...rest
    },
    ref
  ) => {
    const { viewport, gl } = useThree();
    const base = Math.min(viewport.width, viewport.height);
    const w = width ?? base * 0.08;
    const h = height ?? w * 1.4;

    const innerRef = useRef<THREE.Group>(null!);
    const frontMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
    const frontGlowMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const frontDetailMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const edgeMaterialRef = useRef<THREE.LineBasicMaterial>(null);
    const glowShellMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const hoveredRef = useRef(false);
    useImperativeHandle(ref, () => innerRef.current, []);

    const frontMap = useLoader(THREE.TextureLoader, frontSrc ?? FALLBACK_FRONT);
    const backMap = useLoader(THREE.TextureLoader, backSrc ?? FALLBACK_BACK);
    const glowColor = useMemo(
      () => new THREE.Color(edgeColor ?? borderColor),
      [edgeColor, borderColor],
    );
    const glowLineGeometry = useMemo(
      () => {
        const glowBox = new THREE.BoxGeometry(
          w + 0.016,
          h + 0.016,
          thickness + 0.012,
        );
        const edges = new THREE.EdgesGeometry(glowBox);
        glowBox.dispose();
        return edges;
      },
      [w, h, thickness],
    );

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

      const baseGlow = edgeGlow?.get?.() ?? 0;
      const hoverBoost = hoveredRef.current ? 2.15 : 1;
      const glowStrength = THREE.MathUtils.clamp(baseGlow * hoverBoost, 0, 1.9);

      const frontMaterial = frontMaterialRef.current;
      if (frontMaterial) {
        frontMaterial.emissive.setRGB(1, 1, 1);
        frontMaterial.emissiveIntensity = 0.24 + glowStrength * 0.2;
      }

      const frontGlowMaterial = frontGlowMaterialRef.current;
      if (frontGlowMaterial) {
        frontGlowMaterial.uniforms.uAccentColor.value.copy(glowColor);
        frontGlowMaterial.uniforms.uGlow.value = THREE.MathUtils.clamp(
          glowStrength * 0.52,
          0,
          1.1,
        );
      }
      const frontDetailMaterial = frontDetailMaterialRef.current;
      if (frontDetailMaterial) {
        frontDetailMaterial.opacity = THREE.MathUtils.clamp(
          0.34 + glowStrength * 0.22,
          0.34,
          0.76,
        );
      }

      const edgeMaterial = edgeMaterialRef.current;
      if (edgeMaterial) {
        edgeMaterial.opacity = THREE.MathUtils.clamp(glowStrength * 0.64, 0, 0.95);
        edgeMaterial.color.copy(glowColor).multiplyScalar(0.95 + glowStrength * 2.3);
        edgeMaterial.visible = edgeMaterial.opacity > 0.01;
      }

      const glowShellMaterial = glowShellMaterialRef.current;
      if (glowShellMaterial) {
        glowShellMaterial.uniforms.uColor.value.copy(glowColor);
        glowShellMaterial.uniforms.uOpacity.value = THREE.MathUtils.clamp(
          glowStrength * 0.28,
          0,
          0.48,
        );
        glowShellMaterial.uniforms.uStrength.value = 0.85 + glowStrength * 1.7;
        glowShellMaterial.visible = glowStrength > 0.01;
      }
    });

    useEffect(() => {
      return () => {
        gl.domElement.style.cursor = "auto";
      };
    }, [gl]);

    useEffect(() => {
      return () => {
        glowLineGeometry.dispose();
      };
    }, [glowLineGeometry]);

    const canClick = () => (isClickable ? isClickable() : true);

    const handleFrontPointerOver = (
      event: {
        stopPropagation: () => void;
      },
    ) => {
      hoveredRef.current = true;
      if (onClick && canClick()) {
        event.stopPropagation();
        gl.domElement.style.cursor = "pointer";
      } else {
        gl.domElement.style.cursor = "auto";
      }
    };

    const handleFrontPointerOut = () => {
      hoveredRef.current = false;
      gl.domElement.style.cursor = "auto";
    };

    const handleFrontClick = (
      event: {
        stopPropagation: () => void;
      },
    ) => {
      if (!onClick || !canClick()) return;
      event.stopPropagation();
      onClick();
    };

    return (
      <group ref={innerRef} {...rest}>
        <mesh renderOrder={2}>
          <boxGeometry args={[w + 0.03, h + 0.03, thickness + 0.04]} />
          <shaderMaterial
            ref={glowShellMaterialRef}
            uniforms={{
              uColor: { value: glowColor.clone() },
              uOpacity: { value: 0 },
              uStrength: { value: 0.7 },
            }}
            vertexShader={`
              varying vec3 vNormal;
              varying vec3 vViewDir;

              void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vNormal = normalize(normalMatrix * normal);
                vViewDir = normalize(-mvPosition.xyz);
                gl_Position = projectionMatrix * mvPosition;
              }
            `}
            fragmentShader={`
              uniform vec3 uColor;
              uniform float uOpacity;
              uniform float uStrength;
              varying vec3 vNormal;
              varying vec3 vViewDir;

              void main() {
                float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.8);
                float alpha = fresnel * uOpacity;
                vec3 rgb = uColor * (uStrength * (0.5 + fresnel * 0.9));
                gl_FragColor = vec4(rgb, alpha);
              }
            `}
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
            depthTest={true}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        <lineSegments geometry={glowLineGeometry} renderOrder={3}>
          <lineBasicMaterial
            ref={edgeMaterialRef}
            color={glowColor}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </lineSegments>

        <mesh castShadow>
          <boxGeometry args={[w, h, thickness]} />
          <meshStandardMaterial color={borderColor} metalness={0.08} roughness={0.52} />
        </mesh>

        <mesh
          position={[0, 0, thickness / 2 + 0.0001]}
          onPointerOver={handleFrontPointerOver}
          onPointerOut={handleFrontPointerOut}
          onClick={handleFrontClick}
        >
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            ref={frontMaterialRef}
            map={frontMap}
            roughness={0.3}
            metalness={0}
            emissive="#ffffff"
            emissiveMap={frontMap}
            emissiveIntensity={0.34}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[0, 0, thickness / 2 + 0.00018]} renderOrder={5}>
          <planeGeometry args={[w, h]} />
          <shaderMaterial
            ref={frontGlowMaterialRef}
            uniforms={{
              uMap: { value: frontMap },
              uAccentColor: { value: glowColor.clone() },
              uGlow: { value: 0 },
            }}
            vertexShader={`
              varying vec2 vUv;

              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform sampler2D uMap;
              uniform vec3 uAccentColor;
              uniform float uGlow;
              varying vec2 vUv;

              void main() {
                vec4 tex = texture2D(uMap, vUv);
                float lum = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
                float maxC = max(tex.r, max(tex.g, tex.b));
                float minC = min(tex.r, min(tex.g, tex.b));
                float chroma = maxC - minC;

                float detail = length(vec2(dFdx(lum), dFdy(lum)));
                float detailMask = smoothstep(0.004, 0.028, detail);
                float colorMask = smoothstep(0.08, 0.24, chroma);
                float whiteMask = smoothstep(0.76, 0.98, lum) * (1.0 - smoothstep(0.04, 0.15, chroma)) * detailMask;

                float glow = uGlow;
                vec3 gray = vec3(lum);
                vec3 satBoost = gray + (tex.rgb - gray) * (1.0 + 0.42 * glow * colorMask);
                vec3 accentPush = uAccentColor * (0.22 + 0.72 * colorMask) * glow * 0.52;
                vec3 whitePush = vec3(1.0) * whiteMask * glow * 0.46;

                vec3 outColor =
                  satBoost * (0.08 + glow * (0.16 + colorMask * 0.12))
                  + accentPush
                  + whitePush;
                float alpha = clamp((colorMask * 0.44 + whiteMask * 0.66) * glow, 0.0, 0.82);

                gl_FragColor = vec4(outColor, alpha);
              }
            `}
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
            depthTest={true}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[0, 0, thickness / 2 + 0.00026]} renderOrder={6}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={frontDetailMaterialRef}
            map={frontMap}
            transparent
            opacity={0.34}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {frontAttachment ? (
          <group position={[0, 0, thickness / 2 + 0.0015]}>
            {frontAttachment}
          </group>
        ) : null}

        <mesh rotation-y={Math.PI} position={[0, 0, -thickness / 2 - 0.0001]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            map={backMap}
            roughness={0.28}
            metalness={0}
            emissive="#ffffff"
            emissiveMap={backMap}
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    );
  }
);

Card3D.displayName = "Card3D";

export default Card3D;
