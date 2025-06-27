import React, { useRef } from "react";
import { MotionValue } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Card3D from "./Card3D";
import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder  from "./textures/backtemp.png";

interface ProjectMeta {
  id: string;
  front: string;
  back: string;
}

interface ProjectDeckProps {
  progress: MotionValue<number>;
  projects?: ProjectMeta[];
  gap?: number;
  dealAngle?: number;
}

const sampleProjects: ProjectMeta[] = [
  { id: "a", front: frontPlaceholder, back: backPlaceholder },
  { id: "b", front: frontPlaceholder, back: backPlaceholder },
  { id: "c", front: frontPlaceholder, back: backPlaceholder },
];

const ProjectDeck: React.FC<ProjectDeckProps> = ({
  progress,
  projects = sampleProjects,
  gap = 2,
  dealAngle = 0.4,
}) => {
  const refs = useRef<THREE.Group[]>([]);
  const step = 1 / projects.length;

  useFrame(() => {
    const t = progress.get();
    projects.forEach((_, i) => {
      const g = refs.current[i];
      if (!g) return;
      const low = i * step;
      const high = (i + 1) * step;
      const ph = Math.min(Math.max((t - low) / (high - low), 0), 1);

      g.position.y = 10 + (-i * gap - 10) * ph;
      g.rotation.z = dealAngle * (1 - ph);
    });
  });

  return (
    <>
      {projects.map((p, i) => (
        <group key={p.id} ref={(el) => (refs.current[i] = el!)}>
          <Card3D frontSrc={p.front} backSrc={p.back} />
        </group>
      ))}
    </>
  );
};

export default ProjectDeck;
