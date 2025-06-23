// src/components/Projects/ProjectCardInfo.tsx
import React, { useMemo } from "react";
import { MotionValue, useTransform, useSpring } from "framer-motion";
import Card3D from "./Card3D";
import { Html } from "@react-three/drei";
import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder from "./textures/backtemp.png";

interface InfoCard {
  id: string;
  front: string;
  back: string;
  title: string;
  description: string;
}

interface ProjectCardInfoProps {
  progress: MotionValue<number>;
  items?: InfoCard[];
  expandScale?: number;
}

const sampleInfo: InfoCard[] = [
  {
    id: "a",
    front: frontPlaceholder,
    back: backPlaceholder,
    title: "First Project",
    description: "Lorem ipsum dolor sit amet.",
  },
];

const ProjectCardInfo: React.FC<ProjectCardInfoProps> = ({
  progress,
  items = sampleInfo,
  expandScale = 4,
}) => {
  /* We’ll just use the first item for demonstration */
  const card = useMemo(() => items[0], [items]);

  const flip = useTransform(progress, [0, 0.2], [0, 1], { clamp: true });
  const expand = useTransform(progress, [0.2, 1], [1, expandScale], { clamp: true });
  const springExpand = useSpring(expand, { damping: 25, stiffness: 150 });

  return (
    <group>
      <Card3D
        frontSrc={card.front}
        backSrc={card.back}
        flip={flip}
        pop={undefined}
        popScale={1}
        /* expanding in scale */
        scale-x={springExpand}
        scale-y={springExpand}
      />
      {/* Pure-HTML overlay (title, description) using CSS 2-D for simplicity */}
      <Html fullscreen>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            style={{
              opacity: useTransform(progress, [0.5, 0.7], [0, 1]).get(),
              transform: `translateY(${useTransform(progress, [0.5, 0.7], [20, 0]).get()}px)`,
            }}
            className="text-center max-w-md px-4"
          >
            <h2 className="text-3xl font-bold mb-2">{card.title}</h2>
            <p className="text-lg leading-snug">{card.description}</p>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default ProjectCardInfo;
