// src/components/Footer.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export interface FooterProps {
  /** Element whose scroll position controls the footer (defaults to window). */
  scrollContainerRef?: React.RefObject<HTMLElement>;
  /** Background colour of the wipe & panel. Tailwind string or HEX. */
  backgroundColor?: string;
  /** Milliseconds for the wipe slide‑in/out. */
  wipeDuration?: number;
  /** Milliseconds for the text fade‑in/out. */
  fadeDuration?: number;
}

const Footer: React.FC<FooterProps> = ({
  scrollContainerRef,
  backgroundColor = "#1f2937", // gray‑800
  wipeDuration = 400,
  fadeDuration = 300,
}) => {
  const [showMini, setShowMini] = useState(false);
  const [expanded, setExpanded] = useState(false);

  /* ───────────────────────────── Scroll logic */
  useEffect(() => {
    const el = scrollContainerRef?.current;

    const getMetrics = () => {
      if (el) {
        const { scrollTop, scrollHeight, clientHeight } = el;
        return {
          distance: scrollHeight - clientHeight - scrollTop,
          scrollable: scrollHeight > clientHeight + 5,
        };
      }
      const h = document.documentElement.scrollHeight;
      const v = window.innerHeight;
      const y = window.scrollY;
      return { distance: h - v - y, scrollable: h > v + 5 };
    };

    const handle = () => {
      const { distance, scrollable } = getMetrics();
      if (!scrollable) {
        setShowMini(false);
        setExpanded(false);
        return;
      }
      setShowMini(distance < 200);
      setExpanded(distance < 20);
    };

    (el ?? window).addEventListener("scroll", handle);
    handle();
    return () => (el ?? window).removeEventListener("scroll", handle);
  }, [scrollContainerRef]);

  /* ───────────────────────────── Animation variants */
  const barVariants: Variants = {
    hidden: { y: "100%", transition: { duration: wipeDuration / 1000 } },
    visible: { y: 0, transition: { duration: wipeDuration / 1000 } },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20, transition: { duration: fadeDuration / 1000 } },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: fadeDuration / 1000,
        delay: wipeDuration / 1000, // start after wipe finishes
      },
    },
  };

  /* ───────────────────────────── Render */
  return (
    <>
      {/* Mini bar */}
      <AnimatePresence>
        {showMini && (
          <motion.div
            key="mini"
            className="fixed bottom-0 left-0 right-0 z-30 bg-gray-800 text-black p-3"
            initial={{ y: "100%" }}
            animate={{ y: 0, transition: { duration: wipeDuration / 1000 } }}
            exit={{ y: "100%", transition: { duration: wipeDuration / 1000 } }}
            style={{ backgroundColor }}
          >
            <div className="max-w-4xl mx-auto flex justify-between text-sm text-black">
              <span>John Surette</span>
              <span>contact@example.com</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full‑screen overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 flex items-center justify-center p-6 pointer-events-none"
            style={{ backgroundColor }}
            variants={barVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="flex flex-col items-center space-y-4 pointer-events-auto text-black"
              variants={contentVariants}
            >
              <h2 className="text-3xl font-bold">John Surette</h2>
              <p>contact@example.com</p>
              <div className="flex space-x-4">
                <a href="#" className="underline">
                  LinkedIn
                </a>
                <a href="#" className="underline">
                  GitHub
                </a>
              </div>
              <p className="text-xs mt-6">Scroll up to return</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
