import React, { useState } from "react";
import { motion } from "framer-motion";
import NavLogo from "./NavLogo";
import { SiteRoute } from "../sections";
import { WipeOptions } from "../Transitions/TransitionWipe";

export interface NavBarProps {
  routes: SiteRoute[];
  currentPath: string;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const compactLabel = (label: string): string => {
  if (label === "Overview") return "Home";
  if (label === "My Projects") return "Projects";
  if (label === "My Story") return "Story";
  if (label === "Research Blog") return "Blog";
  return label;
};

const NavBar: React.FC<NavBarProps> = ({ routes, currentPath, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const [hoveringTop, setHoveringTop] = useState(false);

  const visible = open || hoveringTop;
  const homeRoute = routes.find((route) => route.path === "/");

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-40 h-14"
        onMouseEnter={() => setHoveringTop(true)}
        onMouseLeave={() => setHoveringTop(false)}
      />

      <button
        type="button"
        aria-label="Go to home"
        className="fixed left-3 top-3 z-[72] rounded-full border border-white/55 bg-white/45 p-1.5 shadow-sm backdrop-blur-xl transition hover:bg-white/60"
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
        onClick={() => setOpen((prev) => !prev)}
        className="fixed right-3 top-3 z-[72] flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-white/45 text-slate-700 backdrop-blur-xl transition hover:bg-white/60"
      >
        <span className="text-base leading-none">{visible ? "×" : "≡"}</span>
      </button>

      <div className="pointer-events-none fixed left-1/2 top-3 z-[70] w-[min(92vw,720px)] -translate-x-1/2">
        <motion.nav
          className="pointer-events-auto"
          initial={false}
          animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHoveringTop(true)}
          onMouseLeave={() => setHoveringTop(false)}
        >
          <div className="mx-auto flex items-center justify-center gap-1 rounded-full border border-white/55 bg-white/40 px-2 py-1 shadow-lg backdrop-blur-xl">
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
                  className={`rounded-full px-3 py-1.5 text-xs font-medium tracking-[0.01em] transition sm:text-sm ${
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
