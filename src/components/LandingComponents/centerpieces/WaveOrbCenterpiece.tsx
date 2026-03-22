import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CenterpieceProps } from "../centerpieceTypes";
import CanvasErrorBoundary from "../../CanvasErrorBoundary";
import { getShadowAssetConfig, resolveShadowGlowColor } from "../../theme/shadowAssetRegistry";
import { removeRuntimeContextEntry, upsertRuntimeContextEntry } from "../../../devtools/codexContext/runtimeRegistry";
import { buildBasePalette } from "./waveOrb/shared";
import { useWaveOrbLoadProfile } from "./waveOrb/loadProfile";
import WaveOrbInterior from "./waveOrb/WaveOrbInterior";
import WaveOrbParticles from "./waveOrb/WaveOrbParticles";
import useWaveOrbColorCycle from "./waveOrb/useWaveOrbColorCycle";
import { Palette, WaveOrbLoadProfile } from "./waveOrb/types";

interface CoreSceneProps extends CenterpieceProps {
  basePalette: Palette;
  loadProfile: WaveOrbLoadProfile;
}

const WAVE_ORB_RUNTIME_CONTEXT_ID = "landing:wave-orb-centerpiece";

const CORE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;
  uniform float uDisplacementScale;
  uniform float uRippleStrength;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.56;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      value += noise(p * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return value;
  }

  void main() {
    vec3 p = position;
    float n = fbm(normal * 2.7 + p * 0.8 + vec3(uTime * 0.26, uTime * 0.21, uTime * 0.19));
    float angular = atan(p.z, p.x);
    float spikes = pow(max(0.0, sin(angular * 12.0 + uTime * 2.5 + n * 7.0)), 4.0);
    float rippleWave = abs(sin((p.y + uTime * (0.24 + uRippleStrength * 0.08)) * (12.0 + uRippleStrength * 3.5)));
    float ripples = rippleWave * 0.06 * uRippleStrength;
    float interactionBoost = 1.0 + uInteraction * (1.25 + uRippleStrength * 0.2);
    float displacement = (
      (0.05 + uBeat * 0.07) * n +
      spikes * (0.08 + uBeat * 0.08) * interactionBoost +
      ripples
    ) * uDisplacementScale;
    displacement *= mix(0.16, 1.0, uIntro);

    vec3 displaced = p + normal * displacement;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);

    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normalize(displaced));

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const CORE_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uInteraction;
  uniform float uFresnelPower;
  uniform float uShellOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uDeepColor;
  uniform vec3 uHighlightTone;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 worldDir = normalize(vWorldPos);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower);
    float swirl = 0.5 + 0.5 * sin(atan(vWorldPos.z, vWorldPos.x) * 2.1 + vWorldPos.y * 1.4 - uTime * 0.75);
    float latitude = 0.5 + 0.5 * sin(vWorldPos.y * 2.8 + uTime * 0.82);
    float heat = smoothstep(0.16, 0.94, 0.5 + 0.5 * dot(worldDir, normalize(vec3(0.2, 0.9, 0.4))));

    vec3 base = mix(uDeepColor, uColorA, heat);
    base = mix(base, uColorB, swirl * 0.24);
    base = mix(base, uColorC, latitude * 0.12);

    vec3 rimTone = mix(uColorC, uHighlightTone, 0.42);
    vec3 rim = fresnel * (rimTone * 1.36 + uColorB * 0.34);
    vec3 pulse = uColorB * (0.08 + uBeat * 0.2 + uInteraction * 0.12);
    vec3 color = base + rim + pulse + uColorC * (uInteraction * 0.1);

    float alpha = (uShellOpacity + fresnel * 0.14) * uIntro;
    gl_FragColor = vec4(color, alpha);
  }
`;

const OrbScene: React.FC<CoreSceneProps> = ({
  pointer,
  hovering,
  pressed,
  introProgress,
  shadowMode,
  shadowAssetId = "heroCenterpiece",
  basePalette,
  loadProfile,
}) => {
  const dynamicColors = useWaveOrbColorCycle({
    basePalette,
    loadProfile,
    hovering,
    pressed,
    introProgress,
    darkMode: shadowMode === "dark",
  });

  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const coreMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const accentLightRef = useRef<THREE.PointLight>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);
  const baseLightRef = useRef<THREE.PointLight>(null);
  const shadowLayerRef = useRef<THREE.Sprite>(null);
  const shadowMaterialRef = useRef<THREE.SpriteMaterial>(null);
  const shadowViewportTargetRef = useRef(new THREE.Vector3(0, -0.08, -2.2));
  const beatPhaseRef = useRef(0);

  const shadowConfig = useMemo(() => getShadowAssetConfig(shadowAssetId), [shadowAssetId]);
  const shadowColor = useMemo(
    () => new THREE.Color(resolveShadowGlowColor(shadowAssetId, shadowMode)),
    [shadowAssetId, shadowMode]
  );
  const shadowTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const center = size / 2;
    const radius = center * (shadowMode === "dark" ? 0.84 : 0.78);
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.scale(1, shadowMode === "dark" ? 0.66 : 0.72);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.82)");
    gradient.addColorStop(0.18, "rgba(255, 255, 255, 0.46)");
    gradient.addColorStop(0.42, "rgba(255, 255, 255, 0.16)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.04)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, [shadowMode]);

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBeat: { value: 0 },
      uIntro: { value: 0 },
      uInteraction: { value: 0 },
      uDisplacementScale: { value: loadProfile.shell.displacementScale },
      uRippleStrength: { value: loadProfile.shell.rippleStrength },
      uFresnelPower: { value: loadProfile.shell.fresnelPower },
      uShellOpacity: { value: loadProfile.shell.opacity },
      uColorA: { value: basePalette.baseColor.clone() },
      uColorB: { value: basePalette.glowColor.clone() },
      uColorC: { value: basePalette.accentColor.clone() },
      uDeepColor: { value: basePalette.deepColor.clone() },
      uHighlightTone: { value: new THREE.Color("#fff8ef") },
    }),
    [basePalette, loadProfile]
  );

  useEffect(() => {
    return () => {
      shadowTexture?.dispose();
    };
  }, [shadowTexture]);

  useEffect(() => {
    if (!shadowMaterialRef.current) return;
    shadowMaterialRef.current.blending = THREE.NormalBlending;
    shadowMaterialRef.current.needsUpdate = true;
    if (haloMaterialRef.current) {
      haloMaterialRef.current.blending =
        shadowMode === "dark" ? THREE.NormalBlending : THREE.AdditiveBlending;
      haloMaterialRef.current.needsUpdate = true;
    }
  }, [shadowMode]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const interaction = dynamicColors.interactionAmount;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.55, 0.07);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.42, 0.07);
      groupRef.current.rotation.z += delta * (0.024 + loadProfile.colors.cycleSpeed * 0.16);
    }

    if (coreMaterialRef.current) {
      beatPhaseRef.current += delta * (1.82 + loadProfile.shell.pulseStrength * 0.52 + interaction * 0.12);
      const beat =
        0.5 +
        0.5 *
          Math.sin(beatPhaseRef.current + dynamicColors.cyclePhase * Math.PI * 2);

      coreMaterialRef.current.uniforms.uTime.value = time;
      coreMaterialRef.current.uniforms.uBeat.value = beat;
      coreMaterialRef.current.uniforms.uIntro.value = Math.max(0.08, introProgress);
      coreMaterialRef.current.uniforms.uInteraction.value = interaction;
      coreMaterialRef.current.uniforms.uDisplacementScale.value = loadProfile.shell.displacementScale;
      coreMaterialRef.current.uniforms.uRippleStrength.value =
        loadProfile.shell.rippleStrength * (1 + interaction * 0.08);
      coreMaterialRef.current.uniforms.uFresnelPower.value = loadProfile.shell.fresnelPower;
      coreMaterialRef.current.uniforms.uShellOpacity.value = dynamicColors.shellOpacity;
      coreMaterialRef.current.uniforms.uColorA.value.copy(dynamicColors.shellPalette.baseColor);
      coreMaterialRef.current.uniforms.uColorB.value.copy(dynamicColors.shellPalette.glowColor);
      coreMaterialRef.current.uniforms.uColorC.value.copy(dynamicColors.shellPalette.accentColor);
      coreMaterialRef.current.uniforms.uDeepColor.value.copy(dynamicColors.shellPalette.deepColor);
      coreMaterialRef.current.uniforms.uHighlightTone.value.copy(dynamicColors.highlightTone);
    }

    if (coreRef.current) {
      const breath = Math.sin(time * (1.4 + loadProfile.shell.pulseStrength * 0.34)) * 0.024;
      const scale = 0.64 + introProgress * 0.36 + interaction * 0.11 + breath;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.rotation.y += delta * (0.08 + loadProfile.colors.cycleSpeed * 0.4);
      coreRef.current.rotation.x += delta * 0.032;
    }

    if (haloRef.current) {
      const haloPulse = 1 + Math.sin(time * (1.3 + loadProfile.colors.cycleSpeed * 3.5)) * 0.035;
      haloRef.current.scale.setScalar(loadProfile.shell.haloScale * haloPulse);
    }

    if (haloMaterialRef.current) {
      haloMaterialRef.current.opacity =
        (shadowMode === "dark" ? dynamicColors.haloOpacity * 0.82 : dynamicColors.haloOpacity) *
        Math.max(0.2, introProgress);
      haloMaterialRef.current.color
        .copy(dynamicColors.highlightTone)
        .lerp(dynamicColors.shellPalette.glowColor, shadowMode === "dark" ? 0.08 : 0.18);
    }

    if (accentLightRef.current) {
      accentLightRef.current.color.copy(dynamicColors.shellPalette.accentColor);
      accentLightRef.current.intensity = 1.8 + interaction * 0.45;
    }
    if (glowLightRef.current) {
      glowLightRef.current.color.copy(dynamicColors.shellPalette.glowColor);
      glowLightRef.current.intensity = 1.5 + interaction * 0.35;
    }
    if (baseLightRef.current) {
      baseLightRef.current.color.copy(dynamicColors.shellPalette.baseColor);
      baseLightRef.current.intensity = 1.25 + interaction * 0.2;
    }

    if (shadowLayerRef.current) {
      const blurPx = shadowMode === "dark" ? shadowConfig.darkGlowBlurPx : shadowConfig.lightShadowBlurPx;
      const blurScale = THREE.MathUtils.clamp(blurPx / 24, 0.8, 1.9);
      const hoverBoost = hovering ? 0.14 : 0;
      const pressBoost = pressed ? 0.2 : 0;
      const pulse = 1 + Math.sin(time * 1.2) * (shadowMode === "dark" ? 0.03 : 0.015);
      const shellScaleFactor = loadProfile.shell.radius / 1.16;
      const desiredWidth =
        ((shadowMode === "dark" ? 4.9 : 4.3) * shellScaleFactor + hoverBoost + pressBoost) * blurScale;
      const desiredHeight =
        ((shadowMode === "dark" ? 3.4 : 3.0) * shellScaleFactor + hoverBoost * 0.8 + pressBoost * 0.9) *
        blurScale;
      const shadowY = -0.08 + (pressed ? -0.02 : 0);

      shadowViewportTargetRef.current.set(0, shadowY, -2.2);
      const shadowViewport = state.viewport.getCurrentViewport(state.camera, shadowViewportTargetRef.current);
      const fitScale = Math.min(
        1,
        (shadowViewport.width * 0.94) / desiredWidth,
        (shadowViewport.height * 0.88) / desiredHeight
      );

      shadowLayerRef.current.scale.set(desiredWidth * fitScale * pulse, desiredHeight * fitScale * pulse, 1);
      shadowLayerRef.current.position.y = shadowY;
    }

    if (shadowMaterialRef.current) {
      shadowMaterialRef.current.color
        .copy(shadowMode === "dark" ? dynamicColors.highlightTone : shadowColor)
        .lerp(dynamicColors.shellPalette.glowColor, shadowMode === "dark" ? 0.04 : 0.18);
      const baseOpacity = shadowMode === "dark" ? shadowConfig.darkGlowOpacity : shadowConfig.lightShadowOpacity;
      const interactionBoost = (hovering ? 0.06 : 0) + (pressed ? 0.08 : 0);
      shadowMaterialRef.current.opacity = Math.min(
        shadowMode === "dark" ? 0.56 : 0.84,
        (baseOpacity + interactionBoost + dynamicColors.haloOpacity * 0.12) * Math.max(0.2, introProgress)
      );
    }
  });

  return (
    <>
      {shadowTexture ? (
        <sprite ref={shadowLayerRef} position={[0, -0.08, -2.2]} scale={[4.3, 3, 1]} renderOrder={-2}>
          <spriteMaterial
            ref={shadowMaterialRef}
            map={shadowTexture}
            color={shadowColor}
            transparent
            opacity={shadowConfig.lightShadowOpacity}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ) : null}

      <ambientLight intensity={0.24} />
      <pointLight ref={accentLightRef} position={[3.2, 2.1, 3.8]} color={basePalette.accentColor} intensity={2.0} />
      <pointLight ref={glowLightRef} position={[-3.4, -2.3, -2.5]} color={basePalette.glowColor} intensity={1.6} />
      <pointLight ref={baseLightRef} position={[0, 3.2, -4]} color={basePalette.baseColor} intensity={1.35} />

      <group ref={groupRef}>
        <WaveOrbInterior
          introProgress={introProgress}
          hovering={hovering}
          pressed={pressed}
          loadProfile={loadProfile}
          dynamicColors={dynamicColors}
        />

        <mesh ref={coreRef} renderOrder={6}>
          <sphereGeometry args={[loadProfile.shell.radius, 88, 88]} />
          <shaderMaterial
            ref={coreMaterialRef}
            uniforms={coreUniforms}
            vertexShader={CORE_VERTEX_SHADER}
            fragmentShader={CORE_FRAGMENT_SHADER}
            transparent
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>

        <mesh ref={haloRef} scale={loadProfile.shell.haloScale} renderOrder={1}>
          <sphereGeometry args={[loadProfile.shell.radius * 1.05, 40, 40]} />
          <meshBasicMaterial
            ref={haloMaterialRef}
            color={basePalette.glowColor}
            transparent
            opacity={loadProfile.shell.haloOpacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <WaveOrbParticles
          introProgress={introProgress}
          hovering={hovering}
          loadProfile={loadProfile}
          dynamicColors={dynamicColors}
        />
      </group>
    </>
  );
};

const WaveOrbCenterpiece: React.FC<CenterpieceProps> = ({ activeSection, ...rest }) => {
  const basePalette = useMemo(() => buildBasePalette(activeSection), [activeSection]);
  const loadProfile = useWaveOrbLoadProfile("landing-wave-orb-profile");

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    upsertRuntimeContextEntry({
      pagePath: "/",
      id: WAVE_ORB_RUNTIME_CONTEXT_ID,
      componentName: "WaveOrbCenterpiece",
      componentPath: ["LandingPage", "LandingContent", "CenterpieceStage", "WaveOrbCenterpiece"],
      filePath: "/src/components/LandingComponents/centerpieces/WaveOrbCenterpiece.tsx",
      role: "centerpiece-runtime",
      metadata: {
        centerpieceId: "waveOrb",
        sectionLabel: activeSection ?? "hero",
        introProgress: Number(rest.introProgress.toFixed(4)),
        interactionState: {
          hovering: rest.hovering,
          pressed: rest.pressed,
          shadowMode: rest.shadowMode,
        },
        loadProfile: {
          seed: loadProfile.seed,
          shell: { ...loadProfile.shell },
          particles: { ...loadProfile.particles },
          interior: { ...loadProfile.interior },
          colors: { ...loadProfile.colors },
        },
        palette: {
          baseHex: basePalette.baseHex,
          glowHex: basePalette.glowHex,
          accentHex: basePalette.accentHex,
          deepHex: basePalette.deepHex,
        },
        labels: ["coreOrb", "interiorOrganelles", "formationSwarm", "coronaDust", "plasmaStreams"],
        shadowAssetId: rest.shadowAssetId ?? "heroCenterpiece",
      },
    });

    return () => {
      removeRuntimeContextEntry("/", WAVE_ORB_RUNTIME_CONTEXT_ID);
    };
  }, [
    activeSection,
    basePalette.accentHex,
    basePalette.baseHex,
    basePalette.deepHex,
    basePalette.glowHex,
    loadProfile,
    rest.hovering,
    rest.introProgress,
    rest.pressed,
    rest.shadowAssetId,
    rest.shadowMode,
  ]);

  return (
    <CanvasErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="h-full w-full"
      >
        <OrbScene activeSection={activeSection} basePalette={basePalette} loadProfile={loadProfile} {...rest} />
      </Canvas>
    </CanvasErrorBoundary>
  );
};

export default WaveOrbCenterpiece;
