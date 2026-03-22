import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiteRoute } from "../sections";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { useIsTouch } from "../../hooks/usePointerDevice";
import { ResolvedThemeMode } from "../theme/themeMode";
import {
  removeRuntimeContextEntry,
  upsertRuntimeContextEntry,
} from "../../devtools/codexContext/runtimeRegistry";

export interface NavBarProps {
  routes: SiteRoute[];
  currentPath: string;
  onNavigate: (path: string, opts?: WipeOptions) => boolean | void;
  resolvedThemeMode: ResolvedThemeMode;
  onToggleTheme: () => void;
  onHintNavInteraction?: (kind: "hover-zone" | "menu-toggle") => void;
}

const compactLabel = (label: string): string => {
  if (label === "Overview") return "Home";
  if (label === "My Projects") return "Projects";
  if (label === "My Story") return "Story";
  if (label === "Research Blog") return "Blog";
  return label;
};

const ThemeGlyph: React.FC<{ mode: ResolvedThemeMode }> = ({ mode }) => {
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="10" cy="10" r="3.2" className="theme-nav-fab-line" />
        <path className="theme-nav-fab-line" d="M10 2V4.5" />
        <path className="theme-nav-fab-line" d="M10 15.5V18" />
        <path className="theme-nav-fab-line" d="M2 10H4.5" />
        <path className="theme-nav-fab-line" d="M15.5 10H18" />
        <path className="theme-nav-fab-line" d="M4.4 4.4L6.1 6.1" />
        <path className="theme-nav-fab-line" d="M13.9 13.9L15.6 15.6" />
        <path className="theme-nav-fab-line" d="M13.9 6.1L15.6 4.4" />
        <path className="theme-nav-fab-line" d="M4.4 15.6L6.1 13.9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        className="theme-nav-fab-line"
        d="M13.9 2.7C11.2 3.2 9.1 5.6 9.1 8.5C9.1 11.8 11.8 14.5 15.1 14.5C16.2 14.5 17.2 14.2 18 13.7C17.2 16.2 14.8 18 12 18C8.5 18 5.6 15.1 5.6 11.6C5.6 7.9 8.8 5 12.6 5C13.1 5 13.5 5 13.9 5.1"
      />
    </svg>
  );
};

const NavBar: React.FC<NavBarProps> = ({
  routes,
  currentPath,
  onNavigate,
  resolvedThemeMode,
  onToggleTheme,
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

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const contextId = "site:navigation-state";
    upsertRuntimeContextEntry({
      pagePath: currentPath,
      id: contextId,
      componentName: "NavBar",
      componentPath: ["App", "NavBar"],
      filePath: "/src/components/NavBar/NavBar.tsx",
      role: "navigation-shell",
      metadata: {
        currentPath,
        open,
        visible,
        isTouch,
      },
    });

    return () => {
      removeRuntimeContextEntry(currentPath, contextId);
    };
  }, [currentPath, isTouch, open, visible]);

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
        className="theme-nav-fab fixed right-3 top-3 z-[72] flex h-[3.3rem] w-[3.3rem] items-center justify-center rounded-full transition duration-300 active:scale-95"
      >
        <span className="sr-only">{visible ? "Close navigation" : "Open navigation"}</span>
        <span className="relative block h-[1.48rem] w-[1.48rem]">
          <span
            className={`theme-nav-fab-line absolute left-0 top-1/2 h-[2.2px] w-[1.48rem] -translate-y-1/2 rounded-full transition-all duration-300 ${
              visible ? "rotate-45" : "-translate-y-[5.5px]"
            }`}
          />
          <span
            className={`theme-nav-fab-line absolute left-0 top-1/2 h-[2.2px] w-[1.48rem] -translate-y-1/2 rounded-full transition-all duration-300 ${
              visible ? "-rotate-45" : "translate-y-[5.5px]"
            }`}
          />
        </span>
      </button>

      <button
        type="button"
        aria-label={resolvedThemeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onClick={onToggleTheme}
        className="theme-nav-fab fixed right-3 top-[4.83rem] z-[72] flex h-[3.3rem] w-[3.3rem] items-center justify-center rounded-full transition duration-300 active:scale-95"
      >
        <ThemeGlyph mode={resolvedThemeMode} />
      </button>

      <div className="pointer-events-none fixed left-1/2 top-3 z-[70] w-[min(92vw,872px)] -translate-x-1/2">
        <motion.nav
          className="pointer-events-auto"
          initial={false}
          animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => !isTouch && setHoveringTop(true)}
          onMouseLeave={() => !isTouch && setHoveringTop(false)}
        >
          <div className="theme-nav-panel mx-auto flex flex-wrap items-center justify-center gap-[0.55rem] rounded-[1.7rem] px-[0.96rem] py-[0.7rem] sm:rounded-full sm:px-[0.72rem] sm:py-[0.4rem]">
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
                  className={`theme-nav-link rounded-full px-[1.21rem] py-[0.66rem] text-[1.03rem] font-medium tracking-[0.01em] transition active:scale-95 sm:px-[1.05rem] sm:py-[0.58rem] sm:text-[1.01rem] ${isActive ? "is-active" : ""}`}
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
