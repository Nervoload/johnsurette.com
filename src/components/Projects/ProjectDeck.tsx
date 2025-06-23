// src/components/Projects/ProjectDeck.tsx
import React from "react";
import { MotionValue, useTransform } from "framer-motion";
import Card3D from "./Card3D";

interface ProjectMeta {
  id: string;
  front: string;
  back: string;
}

interface ProjectDeckProps {
  progress: MotionValue<number>;
  projects?: ProjectMeta[];
  gap?: number;           // vertical spacing between cards
  dealAngle?: number;     // radians tilt during flight
}

const sampleProjects: ProjectMeta[] = [
  { id: "a", front: "/textures/fronttemp.png", back: "//textures/backtemp.png" },
  { id: "b", front: "/textures/fronttemp.png", back: "/textures/backtemp.png" },
  { id: "c", front: "/textures/fronttemp.png", back: "/textures/backtemp.png" },
];

const ProjectDeck: React.FC<ProjectDeckProps> = ({
  progress,
  projects = sampleProjects,
  gap = 2,
  dealAngle = 0.4,
}) => {
  /* Each card gets its own appearance window inside the scene range ------ */
  const step = 1 / projects.length;

  return (
    <group>
      {projects.map((proj, i) => {
        const appear = useTransform(progress, [i * step, (i + 1) * step], [0, 1], {
          clamp: true,
        });

        /* vertical drop-in */
        const yMv = useTransform(appear, [0, 1], [10, -i * gap]);
        const rotZ = useTransform(appear, [0, 1], [dealAngle, 0]);

        return (
          <Card3D
            key={proj.id}
            frontSrc={proj.front}
            backSrc={proj.back}
            flip={undefined}  // initially face-down
            pop={undefined}
            position-y={yMv}
            rotation-z={rotZ}
          />
        );
      })}
    </group>
  );
};

export default ProjectDeck;
