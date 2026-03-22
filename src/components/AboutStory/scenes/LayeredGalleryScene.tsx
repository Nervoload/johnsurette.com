import React, { forwardRef, useEffect, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AboutLayeredGalleryItem, AboutLayeredGallerySceneProps } from "../../../content/aboutStory";
import {
  removeRuntimeContextEntry,
  removeRuntimeSceneEntity,
  upsertRuntimeContextEntry,
  upsertRuntimeSceneEntity,
} from "../../../devtools/codexContext/runtimeRegistry";
import type { RectSnapshot } from "../../../devtools/codexContext/types";
import type { AboutSceneComponentProps } from "../types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothStep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const GALLERY_CONTEXT_ID = "about:layered-gallery";

const toScreenRectSnapshot = (
  object: THREE.Object3D | null | undefined,
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  thickness: number,
): RectSnapshot | null => {
  if (!object) return null;

  object.updateWorldMatrix(true, false);

  const corners = [
    new THREE.Vector3(-width / 2, -height / 2, thickness / 2),
    new THREE.Vector3(width / 2, -height / 2, thickness / 2),
    new THREE.Vector3(width / 2, height / 2, thickness / 2),
    new THREE.Vector3(-width / 2, height / 2, thickness / 2),
  ];
  const canvasRect = canvas.getBoundingClientRect();

  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const corner of corners) {
    const projected = corner.clone().applyMatrix4(object.matrixWorld).project(camera);
    const screenX = canvasRect.left + (projected.x * 0.5 + 0.5) * canvasRect.width;
    const screenY = canvasRect.top + (-projected.y * 0.5 + 0.5) * canvasRect.height;

    left = Math.min(left, screenX);
    right = Math.max(right, screenX);
    top = Math.min(top, screenY);
    bottom = Math.max(bottom, screenY);
  }

  const rectWidth = right - left;
  const rectHeight = bottom - top;
  if (!Number.isFinite(rectWidth) || !Number.isFinite(rectHeight) || rectWidth <= 1 || rectHeight <= 1) {
    return null;
  }

  return {
    left,
    top,
    right,
    bottom,
    width: rectWidth,
    height: rectHeight,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  };
};

const getLayeredCardRuntime = (
  item: AboutLayeredGalleryItem,
  nodeProgress: number,
  mix: number,
  pointerX: number,
  pointerY: number,
) => {
  const appear = clamp01((nodeProgress - item.entryProgress) / 0.28);
  const travel = smoothStep(appear);
  const fadeOut = 1 - smoothStep(clamp01((appear - 0.78) / 0.22));
  const opacity = travel * fadeOut * mix;

  const z = item.basePosition[2] + travel * item.travelDepth;
  const x = item.basePosition[0] + pointerX * item.parallax;
  const y = item.basePosition[1] + pointerY * item.parallax * 0.42 + travel * 0.08;
  const rotation = (pointerX * 0.08 + travel * 0.12) * (item.depth === "foreground" ? 1 : 0.45);

  return {
    position: [x, y, z] as [number, number, number],
    rotation: [0, rotation, rotation * 0.4] as [number, number, number],
    opacity,
    travel,
  };
};

const LayeredCard = forwardRef<THREE.Group, {
  item: AboutLayeredGalleryItem;
  nodeProgress: number;
  mix: number;
  pointerX: number;
  pointerY: number;
}>(({ item, nodeProgress, mix, pointerX, pointerY }, ref) => {
  const runtime = getLayeredCardRuntime(item, nodeProgress, mix, pointerX, pointerY);
  const [x, y, z] = runtime.position;
  const [rotX, rotY, rotZ] = runtime.rotation;
  const opacity = runtime.opacity;
  const travel = runtime.travel;

  const cardColor = item.gradient[0];
  const panelColor = item.gradient[1];

  return (
    <group ref={ref} position={[x, y, z]} rotation={[rotX, rotY, rotZ]}>
      <RoundedBox args={[item.size[0], item.size[1], 0.06]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color={cardColor} transparent opacity={0.88 * opacity} roughness={0.28} metalness={0.04} />
      </RoundedBox>

      <RoundedBox args={[item.size[0] * 0.82, item.size[1] * 0.66, 0.04]} radius={0.1} smoothness={4} position={[0.02, 0.02, 0.05]}>
        <meshStandardMaterial color={panelColor} transparent opacity={0.72 * opacity} roughness={0.2} metalness={0.06} />
      </RoundedBox>

      <mesh position={[item.size[0] * 0.22, item.size[1] * -0.18, 0.1]} scale={0.18 + travel * 0.08}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshStandardMaterial color={item.accent} emissive={item.accent} emissiveIntensity={0.38} transparent opacity={0.9 * opacity} />
      </mesh>

      <mesh position={[-item.size[0] * 0.18, item.size[1] * 0.22, 0.08]} scale={[item.size[0] * 0.3, 0.06, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28 * opacity} />
      </mesh>
      <mesh position={[-item.size[0] * 0.18, item.size[1] * 0.1, 0.08]} scale={[item.size[0] * 0.22, 0.04, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18 * opacity} />
      </mesh>
    </group>
  );
});

LayeredCard.displayName = "LayeredCard";

const LayeredGalleryScene: React.FC<AboutSceneComponentProps> = ({ node, mix, nodeProgress, pointer }) => {
  const sceneProps = node.sceneProps as AboutLayeredGallerySceneProps;
  const cardRefs = useRef<Array<THREE.Group | null>>([]);
  const { camera, gl } = useThree();
  const backgroundOpacity = 0.24 + mix * 0.24;

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const pagePath = window.location.pathname || "/about";

    return () => {
      removeRuntimeContextEntry(pagePath, GALLERY_CONTEXT_ID);
      sceneProps.items.forEach((item) => {
        removeRuntimeSceneEntity(pagePath, `about:layered-gallery:${node.id}:${item.id}`);
      });
    };
  }, [node.id, sceneProps.items]);

  useFrame(() => {
    if (!import.meta.env.DEV) return;

    const pagePath = window.location.pathname || "/about";
    const visibleItemIds: string[] = [];
    let activeItemId: string | null = null;
    let activeItemTitle: string | null = null;
    let activeOpacity = -1;

    sceneProps.items.forEach((item, index) => {
      const ref = cardRefs.current[index];
      const runtime = getLayeredCardRuntime(item, nodeProgress, mix, pointer.x, pointer.y);
      const rect = toScreenRectSnapshot(ref, camera, gl.domElement, item.size[0], item.size[1], 0.06);

      if (runtime.opacity > 0.08) {
        visibleItemIds.push(item.id);
      }

      if (runtime.opacity > activeOpacity) {
        activeOpacity = runtime.opacity;
        activeItemId = item.id;
        activeItemTitle = item.title;
      }

      if (!rect || runtime.opacity <= 0.04) {
        removeRuntimeSceneEntity(pagePath, `about:layered-gallery:${node.id}:${item.id}`);
        return;
      }

      upsertRuntimeSceneEntity({
        pagePath,
        id: `about:layered-gallery:${node.id}:${item.id}`,
        componentName: "LayeredGalleryItem",
        componentPath: ["AboutPage", "AboutExperience", "AboutSceneController", "LayeredGalleryScene", "LayeredCard"],
        filePath: "/src/components/AboutStory/scenes/LayeredGalleryScene.tsx",
        role: "gallery-item",
        rect,
        domTag: "scene-entity",
        domIdentifier: item.id,
        metadata: {
          nodeId: node.id,
          galleryTitle: sceneProps.galleryTitle,
          itemId: item.id,
          title: item.title,
          depth: item.depth,
          entryProgress: item.entryProgress,
          travelDepth: item.travelDepth,
          opacity: Number(runtime.opacity.toFixed(4)),
          visible: runtime.opacity > 0.08,
          nodeProgress: Number(nodeProgress.toFixed(4)),
          mix: Number(mix.toFixed(4)),
        },
      });
    });

    upsertRuntimeContextEntry({
      pagePath,
      id: GALLERY_CONTEXT_ID,
      componentName: "LayeredGalleryScene",
      componentPath: ["AboutPage", "AboutExperience", "AboutSceneController", "LayeredGalleryScene"],
      filePath: "/src/components/AboutStory/scenes/LayeredGalleryScene.tsx",
      role: "gallery-scene",
      metadata: {
        nodeId: node.id,
        nodeTitle: node.title,
        galleryTitle: sceneProps.galleryTitle,
        itemCount: sceneProps.items.length,
        activeItemId,
        activeItemTitle,
        visibleItemIds,
        nodeProgress: Number(nodeProgress.toFixed(4)),
        mix: Number(mix.toFixed(4)),
      },
    });
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0, -3.6]} scale={[14, 8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={sceneProps.backgroundGradient[0]} transparent opacity={backgroundOpacity} />
      </mesh>

      <mesh position={[0.4, 0.1, -2.2]} rotation={[0.02, -0.04, 0]} scale={[6.8, 4.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={sceneProps.backgroundGradient[1]} transparent opacity={0.34 * mix} />
      </mesh>

      <mesh position={[-2.4, 1.46, -1.8]} scale={[0.32, 0.32, 0.32]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={sceneProps.ambientColor} transparent opacity={0.3 * mix} />
      </mesh>
      <mesh position={[2.1, -1.1, -1.5]} scale={[0.24, 0.24, 0.24]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18 * mix} />
      </mesh>

      {sceneProps.items.map((item, index) => (
        <LayeredCard
          key={item.id}
          ref={(group) => {
            cardRefs.current[index] = group;
          }}
          item={item}
          nodeProgress={nodeProgress}
          mix={mix}
          pointerX={pointer.x}
          pointerY={pointer.y}
        />
      ))}

      <mesh position={[0, -1.64, -0.8]} rotation={[-Math.PI / 2, 0, 0]} scale={[5.8, 5.8, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08 * mix} />
      </mesh>
    </group>
  );
};

export default LayeredGalleryScene;
