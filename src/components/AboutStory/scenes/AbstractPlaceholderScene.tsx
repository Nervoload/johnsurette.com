import React from "react";
import { RoundedBox } from "@react-three/drei";
import type { AboutAbstractSceneProps } from "../../../content/aboutStory";
import type { AboutSceneComponentProps } from "../types";

const AbstractPlaceholderScene: React.FC<AboutSceneComponentProps> = ({ node, mix, nodeProgress }) => {
  const sceneProps = node.sceneProps as AboutAbstractSceneProps;

  return (
    <group>
      <RoundedBox args={[2.8, 1.72, 0.12]} radius={0.16} smoothness={4}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.54 * mix} roughness={0.22} metalness={0.04} />
      </RoundedBox>
      <mesh position={[0, 0, 0.14]} scale={[2.2, 1.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={sceneProps.accent} transparent opacity={(0.12 + nodeProgress * 0.18) * mix} />
      </mesh>
      <mesh position={[1.1, 0.76, 0.18]} scale={0.22 + nodeProgress * 0.06}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial color={sceneProps.accent} transparent opacity={0.3 * mix} />
      </mesh>
      <mesh position={[-1.18, -0.66, 0.18]} scale={0.16}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18 * mix} />
      </mesh>
    </group>
  );
};

export default AbstractPlaceholderScene;
