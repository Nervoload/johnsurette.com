import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavLogo from "./NavLogo";
import { SiteRoute } from "../sections";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { useIsTouch } from "../../hooks/usePointerDevice";

export interface NavBarProps {
  routes: SiteRoute[];
  currentPath: string;
  onNavigate: (path: string, opts?: WipeOptions) => void;
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

  const homeRoute = routes.find((route) => route.path === "/");

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
        aria-label="Go to home"
        className="fixed left-3 top-3 z-[72] rounded-full border border-white/55 bg-white/45 p-2 shadow-sm backdrop-blur-xl transition active:scale-95 hover:bg-white/60"
        onClick={() => {
          setOpen(false);
          onNavigate("/", { color: homeRoute?.color ?? "#e2e8f0" });
        }}
      >
        <NavLogo size={30} ringThickness={3} />
      </button>

      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={visible}
        onClick={() => {
          setOpen((prev) => !prev);
          onHintNavInteraction?.("menu-toggle");
        }}
        className="fixed right-3 top-3 z-[72] flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/45 text-slate-700 backdrop-blur-xl transition active:scale-95 hover:bg-white/60"
      >
        <span className="text-lg leading-none">{visible ? "×" : "≡"}</span>
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
