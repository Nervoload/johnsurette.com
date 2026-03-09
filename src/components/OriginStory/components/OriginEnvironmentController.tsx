import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

interface OriginEnvironmentControllerProps {
  url?: string;
}

const OriginEnvironmentController: React.FC<OriginEnvironmentControllerProps> = ({ url }) => {
  const { scene } = useThree();
  const activeTextureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) {
      scene.environment = null;
      return;
    }

    let cancelled = false;
    const loader = new RGBELoader();

    loader.load(
      url,
      (texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }

        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        activeTextureRef.current = texture;
      },
      undefined,
      () => {
        scene.environment = null;
        activeTextureRef.current = null;
      },
    );

    return () => {
      cancelled = true;
      if (activeTextureRef.current) {
        if (scene.environment === activeTextureRef.current) {
          scene.environment = null;
        }
        activeTextureRef.current.dispose();
        activeTextureRef.current = null;
      }
    };
  }, [scene, url]);

  return null;
};

export default OriginEnvironmentController;
