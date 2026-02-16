import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

interface SceneBloomProps {
  enabled?: boolean;
  strength?: number;
  radius?: number;
  threshold?: number;
}

interface BloomResources {
  baseTarget: THREE.WebGLRenderTarget;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  compositeScene: THREE.Scene;
  compositeCamera: THREE.OrthographicCamera;
  compositeMaterial: THREE.ShaderMaterial;
  compositeMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
}

const SceneBloom: React.FC<SceneBloomProps> = ({
  enabled = true,
  strength = 0.32,
  radius = 0.72,
  threshold = 0.88,
}) => {
  const { gl, scene, camera, size } = useThree();
  const failedRef = useRef(false);

  const resources = useMemo<BloomResources | null>(() => {
    try {
      const pixelRatio = gl.getPixelRatio();
      const renderWidth = Math.max(1, Math.floor(size.width * pixelRatio));
      const renderHeight = Math.max(1, Math.floor(size.height * pixelRatio));

      const baseTarget = new THREE.WebGLRenderTarget(renderWidth, renderHeight, {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        depthBuffer: true,
        stencilBuffer: false,
      });

      const bloomTarget = new THREE.WebGLRenderTarget(renderWidth, renderHeight, {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        depthBuffer: true,
        stencilBuffer: false,
      });

      const composer = new EffectComposer(gl, bloomTarget);
      composer.renderToScreen = false;

      const renderPass = new RenderPass(scene, camera);
      renderPass.clear = true;
      renderPass.clearAlpha = 0;
      composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(renderWidth, renderHeight),
        strength,
        radius,
        threshold,
      );
      composer.addPass(bloomPass);

      const compositeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tBase: { value: baseTarget.texture },
          tBloomCombined: { value: composer.readBuffer.texture },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: `
          #include <common>
          varying vec2 vUv;
          uniform sampler2D tBase;
          uniform sampler2D tBloomCombined;

          void main() {
            vec4 base = texture2D(tBase, vUv);
            vec3 bloomCombined = texture2D(tBloomCombined, vUv).rgb;
            vec3 bloomOnly = max(bloomCombined - base.rgb, vec3(0.0));
            vec3 finalRgb = base.rgb + bloomOnly;
            gl_FragColor = vec4(finalRgb, base.a);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
        depthWrite: false,
        depthTest: false,
        transparent: true,
        blending: THREE.NormalBlending,
      });

      const compositeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositeMaterial);
      const compositeScene = new THREE.Scene();
      const compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      compositeScene.add(compositeMesh);

      return {
        baseTarget,
        composer,
        bloomPass,
        compositeScene,
        compositeCamera,
        compositeMaterial,
        compositeMesh,
      };
    } catch (error) {
      console.error("[SceneBloom] Failed to initialize bloom pipeline.", error);
      return null;
    }
  }, [gl, scene, camera, size.width, size.height, strength, radius, threshold]);

  useEffect(() => {
    failedRef.current = false;
  }, [resources]);

  useEffect(() => {
    if (!resources) return;

    const pixelRatio = gl.getPixelRatio();
    const renderWidth = Math.max(1, Math.floor(size.width * pixelRatio));
    const renderHeight = Math.max(1, Math.floor(size.height * pixelRatio));

    resources.baseTarget.setSize(renderWidth, renderHeight);
    resources.composer.setSize(size.width, size.height);
    resources.compositeMaterial.uniforms.tBase.value = resources.baseTarget.texture;
    resources.compositeMaterial.uniforms.tBloomCombined.value = resources.composer.readBuffer.texture;
  }, [resources, gl, size.width, size.height]);

  useEffect(() => {
    if (!resources) return;
    resources.bloomPass.enabled = enabled;
    resources.bloomPass.strength = strength;
    resources.bloomPass.radius = radius;
    resources.bloomPass.threshold = threshold;
  }, [resources, enabled, strength, radius, threshold]);

  useEffect(() => {
    return () => {
      if (!resources) return;
      resources.bloomPass.dispose();
      resources.composer.dispose();
      resources.baseTarget.dispose();
      resources.compositeMesh.geometry.dispose();
      resources.compositeMaterial.dispose();
    };
  }, [resources]);

  useFrame((state) => {
    const renderer = state.gl;

    const prevAutoClear = renderer.autoClear;
    const prevClearAlpha = renderer.getClearAlpha();
    const prevClearColor = renderer.getClearColor(new THREE.Color()).clone();
    const renderBase = () => {
      renderer.setRenderTarget(null);
      renderer.autoClear = true;
      renderer.setClearColor(prevClearColor, 0);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);
    };

    try {
      if (!enabled || !resources || failedRef.current) {
        renderBase();
        return;
      }

      renderer.autoClear = true;
      renderer.setRenderTarget(resources.baseTarget);
      renderer.setClearColor(prevClearColor, 0);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);

      resources.composer.render();

      resources.compositeMaterial.uniforms.tBloomCombined.value = resources.composer.readBuffer.texture;

      renderer.setRenderTarget(null);
      renderer.setClearColor(prevClearColor, 0);
      renderer.clear(true, true, true);
      renderer.render(resources.compositeScene, resources.compositeCamera);
    } catch (error) {
      failedRef.current = true;
      console.error("[SceneBloom] Runtime bloom failure; falling back to base render.", error);
      renderBase();
    } finally {
      renderer.setClearColor(prevClearColor, prevClearAlpha);
      renderer.autoClear = prevAutoClear;
    }
  }, 1);

  return null;
};

export default SceneBloom;
