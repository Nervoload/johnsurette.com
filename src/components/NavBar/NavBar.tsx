import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiteRoute } from "../sections";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { useIsTouch } from "../../hooks/usePointerDevice";

export interface NavBarProps {
  routes: SiteRoute[];
  currentPath: string;
  onNavigate: (path: string, opts?: WipeOptions) => boolean | void;
  onHintNavInteraction?: (kind: "hover-zone" | "menu-toggle") => void;
}

const compactLabel = (label: string): string => {
  if (label === "Overview") return "Home";
  if (label === "My Projects") return "Projects";
  if (label === "My Story") return "Story";
  if (label === "Research Blog") return "Blog";
  return label;
};

const NavBar: React.FC<NavBarProps> = ({
  routes,
  currentPath,
  onNavigate,
  onHintNavInteraction,
}) => {
  const [open, setOpen] = useState(false);
  const [hoveringTop, setHoveringTop] = useState(false);
  const isTouch = useIsTouch();

  // On touch devices the hover zone does nothing — only hamburger toggles.
  // On desktop the nav appears on hover OR toggle.
  const visible = open || (!isTouch && hoveringTop);

  // Close nav when route changes (important on mobile after tapping a link)
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  // Close nav on outside tap (touch only)
  const handleBackdropTap = useCallback(() => {
    if (open) setOpen(false);
  }, [open]);

  const handleTopZoneEnter = useCallback(() => {
    setHoveringTop(true);
    onHintNavInteraction?.("hover-zone");
  }, [onHintNavInteraction]);

  return (
    <>
      {/* Hover zone — only active for mouse/trackpad users */}
      {!isTouch && (
        <div
          className="fixed inset-x-0 top-0 z-40 h-14"
          onMouseEnter={handleTopZoneEnter}
          onMouseLeave={() => setHoveringTop(false)}
        />
      )}

      {/* Transparent backdrop to close nav on outside tap (touch) */}
      {isTouch && open && (
        <div
          className="fixed inset-0 z-[68]"
          aria-hidden
          onClick={handleBackdropTap}
        />
      )}

      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={visible}
        onClick={() => {
          setOpen((prev) => !prev);
          onHintNavInteraction?.("menu-toggle");
        }}
        className="fixed right-3 top-3 z-[72] flex h-11 w-11 items-center justify-center rounded-full bg-white/58 text-slate-700 shadow-[0_10px_32px_-22px_rgba(15,23,42,0.68)] backdrop-blur-xl transition duration-300 hover:bg-white/72 active:scale-95"
      >
        <span className="sr-only">{visible ? "Close navigation" : "Open navigation"}</span>
        <span className="relative block h-5 w-5">
          <span
            className={`absolute left-0 top-1/2 h-[1.8px] w-5 -translate-y-1/2 rounded-full bg-slate-700 transition-all duration-300 ${
              visible ? "rotate-45" : "-translate-y-[4.5px]"
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-[1.8px] w-5 -translate-y-1/2 rounded-full bg-slate-700 transition-all duration-300 ${
              visible ? "-rotate-45" : "translate-y-[4.5px]"
            }`}
          />
        </span>
      </button>

      <div className="pointer-events-none fixed left-1/2 top-3 z-[70] w-[min(92vw,720px)] -translate-x-1/2">
        <motion.nav
          className="pointer-events-auto"
          initial={false}
          animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => !isTouch && setHoveringTop(true)}
          onMouseLeave={() => !isTouch && setHoveringTop(false)}
        >
          <div className="mx-auto flex flex-wrap items-center justify-center gap-1.5 rounded-[1.4rem] border border-white/55 bg-white/40 px-3 py-2 shadow-lg backdrop-blur-xl sm:rounded-full sm:px-2 sm:py-1">
            {routes.map((route) => {
              const isActive = route.path === currentPath;
              return (
                <button
                  key={route.path}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onNavigate(route.path, {
                      color: route.color,
                    });
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium tracking-[0.01em] transition active:scale-95 sm:px-3 sm:py-1.5 sm:text-sm ${
                    isActive
                      ? "bg-white/85 text-slate-900"
                      : "text-slate-700 hover:bg-white/65 hover:text-slate-900"
                  }`}
                  style={isActive ? { boxShadow: `0 0 0 1px ${route.color}88 inset` } : undefined}
                >
                  {compactLabel(route.label)}
                </button>
              );
            })}
          </div>
        </motion.nav>
      </div>
    </>
  );
};

export default NavBar;
