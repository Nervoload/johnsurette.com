import React from "react";
import { RoundedBox } from "@react-three/drei";
import type { AboutDecisionBranchSceneProps } from "../../../content/aboutStory";
import type { AboutSceneComponentProps } from "../types";

const DecisionBranchScene: React.FC<AboutSceneComponentProps> = ({ node, mix, nodeProgress }) => {
  const sceneProps = node.sceneProps as AboutDecisionBranchSceneProps;
  const bubbleLift = nodeProgress * 0.26;

  return (
    <group>
      <RoundedBox args={[1.86, 2.52, 0.14]} radius={0.16} smoothness={4} position={[0, -0.24, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.62 * mix} roughness={0.26} metalness={0.04} />
      </RoundedBox>
      <mesh position={[0, 1.46, 0]} scale={[0.74, 0.74, 0.74]}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.7 * mix} roughness={0.2} metalness={0.04} />
      </mesh>

      {sceneProps.thoughts.map((thought, index) => (
        <group key={thought.id} position={[thought.anchor[0], thought.anchor[1] + bubbleLift * (index + 1), thought.anchor[2]]}>
          <mesh scale={0.36 + index * 0.04}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color={thought.tint} emissive={thought.tint} emissiveIntensity={0.24} transparent opacity={0.34 * mix} />
          </mesh>
          <mesh position={[0, 0, -0.08]} scale={0.46 + index * 0.04}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1 * mix} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default DecisionBranchScene;
