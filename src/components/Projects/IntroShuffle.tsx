import React from "react";
import { motion } from "framer-motion";

const IntroShuffle: React.FC = () => {
  const cards = Array.from({ length: 5 });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {cards.map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 360, scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: idx * 0.2 }}
          className="w-32 h-48 bg-gray-200 rounded-lg shadow-lg m-1"
        />
      ))}
    </div>
  );
};

export default IntroShuffle;
