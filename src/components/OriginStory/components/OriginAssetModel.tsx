import React, { ReactNode, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OriginAssetAnchor, OriginAssetSlotConfig, OriginQualityTier } from "../types";

interface OriginAssetModelProps {
  config?: OriginAssetSlotConfig;
  url?: string;
  qualityTier: OriginQualityTier;
  fallback?: ReactNode;
  scale?: number | [number, number, number];
  fitHeight?: number;
  anchor?: OriginAssetAnchor;
}

interface CachedAssetState {
  status: "idle" | "loading" | "success" | "error";
  scene: THREE.Group | null;
}

const assetCache = new Map<string, CachedAssetState>();

const prepareScene = (scene: THREE.Group): void => {
  scene.traverse((object) => {
    if ("castShadow" in object) {
      object.castShadow = true;
    }
    if ("receiveShadow" in object) {
      object.receiveShadow = true;
    }
    if ("frustumCulled" in object) {
      object.frustumCulled = true;
    }
  });
};

const OriginAssetModel: React.FC<OriginAssetModelProps> = ({
  config,
  url,
  qualityTier,
  fallback = null,
  scale = 1,
  fitHeight,
  anchor = "center",
}) => {
  const assetUrl = url ?? config?.glbUrl;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(() => {
    if (!assetUrl) return "error";
    return assetCache.get(assetUrl)?.status ?? "idle";
  });

  const [loadedScene, setLoadedScene] = useState<THREE.Group | null>(() => {
    if (!assetUrl) return null;
    return assetCache.get(assetUrl)?.scene ?? null;
  });

  useEffect(() => {
    if (!assetUrl) {
      setStatus("error");
      setLoadedScene(null);
      return;
    }

    const cached = assetCache.get(assetUrl);
    if (cached?.status === "success" && cached.scene) {
      setLoadedScene(cached.scene);
      setStatus("success");
      return;
    }

    if (cached?.status === "error") {
      setLoadedScene(null);
      setStatus("error");
      return;
    }

    let cancelled = false;
    const loader = new GLTFLoader();

    assetCache.set(assetUrl, {
      status: "loading",
      scene: null,
    });
    setStatus("loading");

    loader.load(
      assetUrl,
      (gltf) => {
        if (cancelled) return;
        prepareScene(gltf.scene);
        assetCache.set(assetUrl, {
          status: "success",
          scene: gltf.scene,
        });
        setLoadedScene(gltf.scene);
        setStatus("success");
      },
      undefined,
      () => {
        if (cancelled) return;
        assetCache.set(assetUrl, {
          status: "error",
          scene: null,
        });
        setLoadedScene(null);
        setStatus("error");
      },
    );

    return () => {
      cancelled = true;
    };
  }, [assetUrl]);

  const clonedScene = useMemo(() => {
    if (!loadedScene || status !== "success") return null;
    const scene = loadedScene.clone(true);

    if (!fitHeight && anchor === "center") {
      return scene;
    }

    const bounds = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    if (anchor === "bottom") {
      scene.position.x -= center.x;
      scene.position.z -= center.z;
      scene.position.y -= bounds.min.y;
    } else {
      scene.position.sub(center);
    }

    if (fitHeight) {
      const scaleFactor = fitHeight / Math.max(size.y, 0.0001);
      scene.scale.multiplyScalar(scaleFactor);
    }

    return scene;
  }, [anchor, fitHeight, loadedScene, status]);

  if (!clonedScene) {
    return <>{fallback}</>;
  }

  const assetScale = config ? config.quality.assetScaleByTier[qualityTier] ?? 1 : 1;

  return (
    <group scale={scale}>
      <group scale={assetScale}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
};

export default OriginAssetModel;
