import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteMeta } from "../content";
import {
  removeRuntimeContextEntry,
  upsertRuntimeContextEntry,
} from "../devtools/codexContext/runtimeRegistry";

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
  backgroundColor = "var(--theme-footer-panel-bg)",
  ownerName = siteMeta.ownerName,
  ownerEmail = siteMeta.ownerEmail,
  runwayVh = 110,
}) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [footerProgress, setFooterProgress] = useState(0);
  const footerVisible = isScrollable && footerProgress > 0.03;

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

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const pagePath = window.location.pathname || "/";
    const contextId = "site:footer-state";

    if (!footerVisible) {
      removeRuntimeContextEntry(pagePath, contextId);
      return;
    }

    const peekProgress = clamp01(footerProgress / 0.35);
    const panelProgress = clamp01((footerProgress - 0.32) / 0.68);

    upsertRuntimeContextEntry({
      pagePath,
      id: contextId,
      componentName: "Footer",
      componentPath: ["App", "Footer"],
      filePath: "/src/components/Footer.tsx",
      role: "footer-shell",
      metadata: {
        isScrollable,
        footerProgress: Number(footerProgress.toFixed(4)),
        peekProgress: Number(peekProgress.toFixed(4)),
        panelProgress: Number(panelProgress.toFixed(4)),
        runwayVh,
      },
    });

    return () => {
      removeRuntimeContextEntry(pagePath, contextId);
    };
  }, [footerProgress, footerVisible, isScrollable, runwayVh]);

  if (!footerVisible) {
    return null;
  }

  const peekProgress = clamp01(footerProgress / 0.35);
  const panelProgress = clamp01((footerProgress - 0.32) / 0.68);
  const footerBarBackground = backgroundColor === "var(--theme-footer-panel-bg)" ? "var(--theme-footer-bar-bg)" : backgroundColor;

  const barOpacity = 0.4 + peekProgress * 0.6;
  const panelOpacity = panelProgress;
  const panelHeightVh = 28 + panelProgress * 72;

  return (
    <>
      <motion.div
        className="theme-footer-bar theme-border-subtle pointer-events-none fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl"
        style={{
          backgroundColor: footerBarBackground,
          opacity: barOpacity,
          transform: `translateY(${(1 - peekProgress) * 14}px)`,
        }}
      >
        <div className="theme-text-primary mx-auto flex h-14 max-w-6xl items-center justify-between px-5 pb-[env(safe-area-inset-bottom,0px)] text-sm">
          <p className="font-medium tracking-wide">{ownerName}</p>
          <p className="theme-text-muted">{ownerEmail}</p>
        </div>
      </motion.div>

      <motion.div
        className="theme-footer-panel theme-border-subtle pointer-events-none fixed bottom-0 left-0 right-0 z-50 overflow-hidden border-t"
        style={{
          height: `${panelHeightVh}vh`,
          opacity: panelOpacity,
          backgroundColor,
          backdropFilter: "blur(16px)",
        }}
      >
        <motion.div
          className="absolute -left-16 top-8 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "var(--theme-accent-soft)" }}
          animate={{ x: [0, 50, -12, 0], y: [0, -16, 22, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-8 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--theme-accent-soft)" }}
          animate={{ x: [0, -56, 16, 0], y: [0, 24, -26, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="theme-text-primary relative mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl" style={{ opacity: 0.45 + panelProgress * 0.55 }}>
            {ownerName}
          </h2>
          <p className="theme-text-muted max-w-xl" style={{ opacity: 0.25 + panelProgress * 0.75 }}>
            {siteMeta.footerTagline}
          </p>
          <div className="theme-text-muted flex items-center gap-5 text-sm" style={{ opacity: 0.2 + panelProgress * 0.8 }}>
            {siteMeta.socialLinks.map((link) => (
              <a
                key={link.label}
                className="theme-link pointer-events-auto underline underline-offset-4"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Footer;
