import React from "react";
import { RoundedBox } from "@react-three/drei";
import type { AboutIntroPortraitSceneProps } from "../../../content/aboutStory";
import type { AboutSceneComponentProps } from "../types";

const IntroPortraitScene: React.FC<AboutSceneComponentProps> = ({ node, mix, nodeProgress }) => {
  const sceneProps = node.sceneProps as AboutIntroPortraitSceneProps;
  const panelOpacity = 0.22 + mix * 0.68;

  return (
    <group position={[0, 0, 0]}>
      <RoundedBox args={[2.9, 3.6, 0.16]} radius={0.18} smoothness={4} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={panelOpacity} roughness={0.2} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[2.42, 2.92, 0.08]} radius={0.16} smoothness={4} position={[0, 0.08, 0.11]}>
        <meshStandardMaterial color="#dbeafe" transparent opacity={(0.3 + nodeProgress * 0.36) * mix} roughness={0.1} metalness={0.06} />
      </RoundedBox>
      <mesh position={[0, -1.08, 0.16]} scale={[1.4, 0.12, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.12 + mix * 0.2} />
      </mesh>
      <mesh position={[0.92, 1.1, 0.2]} scale={0.22}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.4 * mix} />
      </mesh>
      <mesh position={[-1.02, -1.22, 0.2]} scale={0.16}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.34 * mix} />
      </mesh>

      <mesh position={[0, 0.08, 0.22]} scale={[1.4, 1.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={sceneProps.layout === "video-panel" ? "#e0f2fe" : "#ede9fe"} transparent opacity={0.16 + mix * 0.24} />
      </mesh>
    </group>
  );
};

export default IntroPortraitScene;
