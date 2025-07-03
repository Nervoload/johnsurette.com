import React, { useMemo, useRef } from "react";
import { MotionValue, useTransform, useSpring } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Card3D from "./Card3D";

import frontPlaceholder from "./textures/fronttemp.png";
import backPlaceholder  from "./textures/backtemp.png";

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
    back:  backPlaceholder,
    title: "First Project",
    description: "Lorem ipsum dolor sit amet.",
  },
];

const ProjectCardInfo: React.FC<ProjectCardInfoProps> = ({
  progress,
  items = sampleInfo,
  expandScale = 4,
}) => {
  const card = useMemo(() => items[0], [items]);

  const flip = useTransform(progress, [0, 0.2], [0, 1], { clamp: true });
  const scl = useTransform(progress, [0.2, 1], [1, expandScale], { clamp: true });
  const spring = useSpring(scl, { damping: 25, stiffness: 150 });

  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    ref.current?.scale.setScalar(spring.get());
  });

  return (
    <group ref={ref}>
      <Card3D frontSrc={card.front} backSrc={card.back} flip={flip} />
    </group>
  );
};

export default ProjectCardInfo;