import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import CardScene from "./CardScene";

export interface ProjectCardProps {
  index: number;
  title: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ index, title }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section ref={ref} className="h-screen flex items-center justify-center">
      <motion.div
        style={{ rotateY }}
        className="w-64 h-96 bg-white rounded-lg shadow-xl flex items-center justify-center"
      >
        <Canvas className="w-full h-full">
          <CardScene />
        </Canvas>
      </motion.div>
    </section>
  );
};

export default ProjectCard;
