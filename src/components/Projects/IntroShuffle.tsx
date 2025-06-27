import React, { useMemo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface IntroShuffleProps {
  progress: MotionValue<number>;
  cardCount?: number;
}

const IntroShuffle: React.FC<IntroShuffleProps> = ({ progress, cardCount = 5 }) => {
  const cards = useMemo(() => Array.from({ length: cardCount }), [cardCount]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {cards.map((_, idx) => {
        const start = idx * 0.1;
        const end = start + 1;
        const rotate = useTransform(progress, [start, end], [0, 360], { clamp: true });
        const scale = useTransform(progress, [start, end], [0.5, 1], { clamp: true });
        const opacity = useTransform(progress, [start, end * 0.8], [0, 1], { clamp: true });

        return (
          <motion.div
            key={idx}
            style={{ rotate, scale, opacity }}
            className="w-32 h-48 bg-gray-200 rounded-lg shadow-lg m-1"
          />
        );
      })}
    </div>
  );
};

export default IntroShuffle;
