// src/components/NavBar/NavBar.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NavLogo from "./NavLogo";
import { sections } from "../sections";
import { WipeOptions } from "../Transitions/TransitionWipe";

export interface NavBarProps {
  pages: string[];
  onNavigate: (page: string, opts?: WipeOptions) => void;
}

/**
 * Top navigation bar that only becomes visible after activation
 * (hover-at-top band or small toggle button).
 * While hidden it is *fully* transparent and `pointer-events-none`, so even
 * overscroll rubber‑banding will not reveal any part of it.
 */
const NavBar: React.FC<NavBarProps> = ({ pages, onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const [showGradientZone, setShowGradientZone] = useState(false);

  // ───────────────────────── Colour map for hover highlight
  const colorMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    sections.forEach((s) => (map[s.name] = s.color));
    return map;
  }, []);

  const hoverStyle = React.useCallback(
    (label: string) => {
      const hex = colorMap[label];
      return hex
        ? { scale: 1.1, color: hex, textShadow: `0 0 8px ${hex}` }
        : { scale: 1.1 };
    },
    [colorMap]
  );

  // ───────────────────────── Internal timers & refs
  const autoTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const navRef       = useRef<HTMLDivElement>(null);

  const clear = (r: React.MutableRefObject<number | null>) => {
    if (r.current !== null) {
      clearTimeout(r.current);
      r.current = null;
    }
  };

  // ───────────────────────── Gradient reveal & auto‑open / close logic
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const H = window.innerHeight;
      const W = window.innerWidth;

      const gradY = H * 0.15; // show gradient within 15 vh
      const openY = H * 0.08; // auto‑open within 8 vh, mid‑third width
      const bandL = W * 0.35;
      const bandR = W * 0.65;

      // ── When hidden: maybe show gradient and/or auto‑open
      if (!visible) {
        setShowGradientZone(y <= gradY);
        const inBand = y <= openY && x >= bandL && x <= bandR;
        if (inBand) {
          if (autoTimerRef.current === null) {
            autoTimerRef.current = window.setTimeout(() => {
              setVisible(true);
              autoTimerRef.current = null;
            }, 180);
          }
        } else {
          clear(autoTimerRef);
        }
        return; // nothing else to do if bar isn’t visible
      }

      // ── When visible: hide if cursor drifts away
      if (navRef.current) {
        const r = navRef.current.getBoundingClientRect();
        const padX = r.width * 0.25;
        const padY = r.height * 0.5;
        const inside =
          x >= r.left - padX &&
          x <= r.right + padX &&
          y >= r.top - padY &&
          y <= r.bottom + padY;
        if (!inside) {
          if (hideTimerRef.current === null) {
            hideTimerRef.current = window.setTimeout(() => {
              setVisible(false);
              hideTimerRef.current = null;
            }, 280);
          }
        } else {
          clear(hideTimerRef);
        }
      }
    };

    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      [autoTimerRef, hideTimerRef, fadeTimerRef].forEach(clear);
    };
  }, [visible]);

  // Fade gradient once bar actually appears
  useEffect(() => {
    if (visible && showGradientZone) {
      fadeTimerRef.current = window.setTimeout(() => {
        setShowGradientZone(false);
        fadeTimerRef.current = null;
      }, 200);
    }
  }, [visible, showGradientZone]);

  // ───────────────────────── Render
  return (
    <>
      {/* Tiny square toggle for mobile / fallback */}
      <button
        className={`fixed top-4 left-4 z-[60] w-8 h-8 rounded-md bg-gray-300 transition-opacity duration-200 ${visible ? "opacity-0" : "opacity-100"}`}
        aria-label="Toggle navigation"
        onClick={() => {
          [autoTimerRef, hideTimerRef].forEach(clear);
          setVisible((v) => !v);
        }}
      />

      {/* Gradient hint */}
      <div
        onClick={() => setVisible(true)}
        className={`fixed top-0 left-0 right-0 h-[15vh] z-40 bg-gradient-to-b from-gray-800/60 to-transparent transition-all duration-200 ${showGradientZone && !visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      />

      {/* Nav bar itself */}
      <motion.div
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${visible ? "translate-y-5 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}
      >
        <div className="mx-auto max-w-4xl flex items-center justify-center space-x-8 rounded-3xl border border-white/30 bg-white/20 backdrop-blur-lg shadow-lg p-2">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => onNavigate("landing")}> 
            <NavLogo />
          </div>

          {/* Links */}
          {pages.map((p) => (
            <motion.button
              key={p}
              className="whitespace-nowrap text-lg font-medium px-2 leading-none"
              whileHover={hoverStyle(p)}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => {
                setVisible(false);
                onNavigate(p);
              }}
            >
              {p}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default NavBar;
