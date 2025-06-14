// src/components/NavBar/NavBar.tsx
import React, { useState, useEffect, useRef } from "react";
import LandingOrb from "./LandingOrb";

export interface NavBarProps {
  pages: string[];
  onNavigate: (page: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ pages, onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const [showGradientZone, setShowGradientZone] = useState(false);

  // Timers
  const autoTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

  /** Clear any pending auto-open timer */
  const clearAutoTimer = () => {
    if (autoTimerRef.current !== null) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  /** Clear any pending hide-after-leave timer */
  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  /** When the menu opens, hide the gradient and clear auto-open */
  useEffect(() => {
    if (visible) {
      setShowGradientZone(false);
      clearAutoTimer();
      clearHideTimer();
    }
  }, [visible]);

  /** Main mousemove handler: gradient show/auto-open + delayed hide */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const H = window.innerHeight;
      const W = window.innerWidth;

      const gradientThreshold = H * 0.15; // 15% from top
      const autoThreshold     = H * 0.08; // 8% from top
      const centerLeft        = W * 0.35;
      const centerRight       = W * 0.65;

      // Only when menu is closed: gradient + auto-open
      if (!visible) {
        // Gradient zone show/hide
        if (y <= gradientThreshold) {
          setShowGradientZone(true);
        } else {
          setShowGradientZone(false);
        }

        // Auto-open after debounce in center band
        const inAutoZone = y <= autoThreshold && x >= centerLeft && x <= centerRight;
        if (inAutoZone) {
          if (autoTimerRef.current === null) {
            autoTimerRef.current = window.setTimeout(() => {
              setVisible(true);
              autoTimerRef.current = null;
            }, 200);
          }
        } else {
          clearAutoTimer();
        }
      }

      // When menu is visible: delayed inactivation-zone hide
      if (visible && navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const padX = rect.width  * 0.25; // 1.5× width total
        const padY = rect.height * 0.50; // 1.5× height total

        const insideZone =
          x >= rect.left  - padX &&
          x <= rect.right + padX &&
          y >= rect.top   - padY &&
          y <= rect.bottom+ padY;

        if (!insideZone) {
          if (hideTimerRef.current === null) {
            hideTimerRef.current = window.setTimeout(() => {
              setVisible(false);
              hideTimerRef.current = null;
            }, 300); // delay before hiding
          }
        } else {
          // Cursor re-entered: cancel pending hide
          clearHideTimer();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearAutoTimer();
      clearHideTimer();
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    };
  }, [visible]);

  /** Fade out the gradient a moment after menu opens if it was showing */
  useEffect(() => {
    if (visible && showGradientZone) {
      fadeTimerRef.current = window.setTimeout(() => {
        setShowGradientZone(false);
        fadeTimerRef.current = null;
      }, 220);
    }
  }, [visible, showGradientZone]);

  return (
    <>
      {/* 1) Logo toggle (fades out when visible) */}
      <button
        className={
          `fixed top-4 left-4 z-50 w-8 h-8 bg-gray-300 rounded-md ` +
          `transition-opacity duration-200 ease-in-out ` +
          (visible ? "opacity-0" : "opacity-100")
        }
        onClick={() => {
          clearAutoTimer();
          clearHideTimer();
          setVisible((v) => !v);
        }}
        aria-label="Menu Toggle"
      />

      {/* 2) Gradient hover-zone */}
      <div
        onClick={() => setVisible(true)}
        className={
          `fixed top-0 left-0 right-0 h-[15vh] z-40 cursor-pointer ` +
          `bg-gradient-to-b from-gray-800/60 to-transparent ` +
          `transform transition-all duration-200 ease-out ` +
          (showGradientZone && !visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none")
        }
      />

      {/* 3) Nav container */}
      <div
        ref={navRef}
        className={
          `fixed top-0 left-0 right-0 z-50 transform ` +
          `transition-transform duration-400 ease-out ` +
          (visible ? "translate-y-5" : "-translate-y-full")
        }
      >
        <div className="mx-auto max-w-4xl bg-white rounded-3xl shadow-lg p-2 flex justify-center space-x-8">
          <LandingOrb onClick={() => onNavigate("landing")} />
          {pages.map((page) => (
            <button
              key={page}
              className="text-lg font-medium hover:underline"
              onClick={() => {
                setVisible(false);
                onNavigate(page);
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavBar;
