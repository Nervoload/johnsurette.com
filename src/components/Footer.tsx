import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface FooterProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  backgroundColor?: string;
  ownerName?: string;
  ownerEmail?: string;
  runwayVh?: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const Footer: React.FC<FooterProps> = ({
  scrollContainerRef,
  backgroundColor = "#ffffff",
  ownerName = "John Surette",
  ownerEmail = "john@johnsurette.com",
  runwayVh = 110,
}) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [footerProgress, setFooterProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef?.current;

    const getMetrics = () => {
      if (container) {
        const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        const runwayPx = Math.max(1, container.clientHeight * (runwayVh / 100));
        const contentEnd = Math.max(0, maxScroll - runwayPx);
        const afterContent = container.scrollTop - contentEnd;

        return {
          scrollable: maxScroll > 4,
          progress: clamp01(afterContent / runwayPx),
        };
      }

      const root = document.documentElement;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const runwayPx = Math.max(1, window.innerHeight * (runwayVh / 100));
      const contentEnd = Math.max(0, maxScroll - runwayPx);
      const afterContent = window.scrollY - contentEnd;

      return {
        scrollable: maxScroll > 4,
        progress: clamp01(afterContent / runwayPx),
      };
    };

    const update = () => {
      const metrics = getMetrics();
      setIsScrollable(metrics.scrollable);
      setFooterProgress(metrics.scrollable ? metrics.progress : 0);
    };

    const target: HTMLElement | Window = container ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      target.removeEventListener("scroll", update as EventListener);
      window.removeEventListener("resize", update);
    };
  }, [scrollContainerRef, runwayVh]);

  if (!isScrollable || footerProgress <= 0.03) {
    return null;
  }

  const peekProgress = clamp01(footerProgress / 0.35);
  const panelProgress = clamp01((footerProgress - 0.32) / 0.68);

  const barOpacity = 0.4 + peekProgress * 0.6;
  const panelOpacity = panelProgress;
  const panelHeightVh = 28 + panelProgress * 72;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 backdrop-blur-xl"
        style={{
          backgroundColor: `${backgroundColor}eb`,
          opacity: barOpacity,
          transform: `translateY(${(1 - peekProgress) * 14}px)`,
        }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 pb-[env(safe-area-inset-bottom,0px)] text-sm text-slate-800">
          <p className="font-medium tracking-wide">{ownerName}</p>
          <p className="text-slate-500">{ownerEmail}</p>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 overflow-hidden border-t border-slate-200/90"
        style={{
          height: `${panelHeightVh}vh`,
          opacity: panelOpacity,
          backgroundColor: `${backgroundColor}f3`,
          backdropFilter: "blur(16px)",
        }}
      >
        <motion.div
          className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl"
          animate={{ x: [0, 50, -12, 0], y: [0, -16, 22, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-indigo-200/35 blur-3xl"
          animate={{ x: [0, -56, 16, 0], y: [0, 24, -26, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center text-slate-800">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl" style={{ opacity: 0.45 + panelProgress * 0.55 }}>
            {ownerName}
          </h2>
          <p className="max-w-xl text-slate-600" style={{ opacity: 0.25 + panelProgress * 0.75 }}>
            Last to die, or first to live without the fear of death.
          </p>
          <div className="flex items-center gap-5 text-sm text-slate-600" style={{ opacity: 0.2 + panelProgress * 0.8 }}>
            <a className="pointer-events-auto underline decoration-slate-400 underline-offset-4" href="https://github.com/Nervoload" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="pointer-events-auto underline decoration-slate-400 underline-offset-4" href="https://www.linkedin.com/in/johnmsurette" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Footer;
