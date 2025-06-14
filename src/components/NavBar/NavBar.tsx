// src/components/NavBar/NavBar.tsx
import React, { useState, useEffect, useRef } from "react";

export interface NavBarProps {
  pages: string[];
  onNavigate: (page: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ pages, onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const [showGradientZone, setShowGradientZone] = useState(false);

  // Timeouts for delaying auto-open and gradient hide
  const autoTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const navRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const H = window.innerHeight;
      const W = window.innerWidth;

      const gradientThreshold = H * 0.15;  // top 15%
      const autoThreshold     = H * 0.07;  // top 5%
      const centerLeft        = W * 0.35;
      const centerRight       = W * 0.65;

      // 🚩 Only track gradient-hover when menu is closed
      if (!visible) {
        // Show gradient zone when near top
        if (y <= gradientThreshold) {
          setShowGradientZone(true);
        } else {
          setShowGradientZone(false);
        }

        // Delayed auto-show when in top-center band
        if (y <= autoThreshold && x >= centerLeft && x <= centerRight) {
          if (autoTimerRef.current === null) {
            autoTimerRef.current = window.setTimeout(() => {
              setVisible(true);
              autoTimerRef.current = null;
            }, 200);
          }
        } else {
          if (autoTimerRef.current !== null) {
            clearTimeout(autoTimerRef.current);
            autoTimerRef.current = null;
          }
        }
      }

      // 🚩 Auto-hide menu if cursor leaves the “inactivation” envelope
      if (visible && navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const padX = rect.width  * 0.25;  // 1.5× width  ⇒ extra 0.25 each side
        const padY = rect.height * 0.50;  // 1.5× height ⇒ extra 0.5 each side
        if (
          x < rect.left - padX ||
          x > rect.right + padX ||
          y < rect.top  - padY ||
          y > rect.bottom + padY
        ) {
          setVisible(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [visible]);

  // When menu becomes visible, let the gradient linger a short moment
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
      {/* ── 1) Logo toggle, with fade in/out ── */}
      <button
        className={
          `fixed top-4 left-4 z-50 w-8 h-8 bg-gray-300 rounded-md ` +
          `transition-opacity duration-200 ease-in-out ` +
          (visible ? "opacity-0" : "opacity-100")
        }
        onClick={() => setVisible((v) => !v)}
        aria-label="Menu Toggle"
      />

      {/* ── 2) Always-mounted gradient band, slides & fades ── */}
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

      {/* ── 3) Nav container ── */}
      <div
        ref={navRef}
        className={
          `fixed top-0 left-0 right-0 z-50 transform ` +
          `transition-transform duration-400 ease-out ` +
          (visible ? "translate-y-0" : "-translate-y-full")
        }
      >
        <div className="mx-auto max-w-4xl bg-white rounded-3xl shadow-lg p-2 flex justify-center space-x-8">
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
