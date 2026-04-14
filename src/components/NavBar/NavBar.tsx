import React, { useCallback, useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiteRoute } from "../sections";
import { WipeOptions } from "../Transitions/TransitionWipe";
import { useIsTouch } from "../../hooks/usePointerDevice";
import { useMediaQuery } from "../../hooks/useMediaQuery";
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

const DRAWER_BREAKPOINT_QUERY = "(max-width: 1100px)";

const SunGlyph: React.FC = () => {
  return (
    <svg viewBox="0 0 20 20" className="theme-nav-glyph-svg" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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
};

const MoonGlyph: React.FC = () => {
  const maskId = useId();

  return (
    <svg viewBox="0 0 20 20" className="theme-nav-glyph-svg" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <mask id={maskId}>
          <rect width="20" height="20" fill="black" />
          <circle cx="10" cy="10" r="6.25" fill="white" />
          <circle cx="13.4" cy="7.15" r="6.45" fill="black" />
        </mask>
      </defs>
      <circle cx="10" cy="10" r="6.25" className="theme-nav-fab-fill" mask={`url(#${maskId})`} />
    </svg>
  );
};

const ThemeGlyph: React.FC<{ mode: ResolvedThemeMode }> = ({ mode }) => {
  const prefersReducedMotion = useReducedMotion();
  const icon = mode === "dark" ? <MoonGlyph /> : <SunGlyph />;

  if (prefersReducedMotion) {
    return <span className="theme-nav-glyph-shell">{icon}</span>;
  }

  return (
    <span className="theme-nav-glyph-shell" aria-hidden>
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={mode}
          className="theme-nav-glyph-orbit"
          initial={{ opacity: 0, x: -28, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 28, y: 10, scale: 0.92 }}
          transition={{
            duration: 0.7,
            ease: [0.33, 0.78, 0.12, 1],
            opacity: { duration: 0.35, ease: "linear" },
          }}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </span>
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
  const compactViewport = useMediaQuery(DRAWER_BREAKPOINT_QUERY);
  const prefersReducedMotion = useReducedMotion();
  const isLandingPage = currentPath === "/";
  const useDrawerNav = isTouch || compactViewport;

  // On desktop the nav appears on hover or toggle. On smaller screens it becomes
  // a dedicated drawer so labels never wrap into a second line.
  const visible = useDrawerNav ? open : open || hoveringTop;
  const dormantChrome = isLandingPage && !visible;

  // Close nav when route changes (important on mobile after tapping a link)
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (useDrawerNav) {
      setHoveringTop(false);
    }
  }, [useDrawerNav]);

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
        useDrawerNav,
      },
    });

    return () => {
      removeRuntimeContextEntry(currentPath, contextId);
    };
  }, [currentPath, isTouch, open, useDrawerNav, visible]);

  const handleBackdropTap = useCallback(() => {
    if (open) setOpen(false);
  }, [open]);

  const handleTopZoneEnter = useCallback(() => {
    setHoveringTop(true);
    onHintNavInteraction?.("hover-zone");
  }, [onHintNavInteraction]);

  const handleMenuToggle = useCallback(() => {
    setOpen((prev) => !prev);
    onHintNavInteraction?.("menu-toggle");
  }, [onHintNavInteraction]);

  const handleNavigate = useCallback((route: SiteRoute) => {
    setOpen(false);
    onNavigate(route.path, {
      color: route.color,
    });
  }, [onNavigate]);

  return (
    <>
      {/* Hover zone — only active for mouse/trackpad users */}
      {!useDrawerNav && (
        <div
          className="fixed inset-x-0 top-0 z-40 h-14"
          onMouseEnter={handleTopZoneEnter}
          onMouseLeave={() => setHoveringTop(false)}
        />
      )}

      <motion.button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={useDrawerNav ? open : visible}
        onClick={handleMenuToggle}
        className="theme-nav-fab fixed right-3 top-3 z-[92] flex h-[3.3rem] w-[3.3rem] items-center justify-center rounded-full transition duration-300 active:scale-95"
        initial={false}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: dormantChrome ? 0.72 : 1,
                scale: dormantChrome ? 0.94 : 1,
                y: dormantChrome ? 4 : 0,
              }
        }
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
      </motion.button>

      <motion.button
        type="button"
        aria-label={resolvedThemeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onClick={onToggleTheme}
        className="theme-nav-fab fixed right-3 top-[4.83rem] z-[92] flex h-[3.3rem] w-[3.3rem] items-center justify-center rounded-full transition duration-300 active:scale-95"
        initial={false}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: dormantChrome ? 0.42 : 1,
                scale: dormantChrome ? 0.9 : 1,
                y: dormantChrome ? -4 : 0,
              }
        }
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <ThemeGlyph mode={resolvedThemeMode} />
      </motion.button>

      {useDrawerNav ? (
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="drawer-shell"
              className="fixed inset-0 z-[80]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                aria-label="Close navigation"
                className="theme-nav-drawer-backdrop absolute inset-0"
                onClick={handleBackdropTap}
              />

              <motion.nav
                aria-label="Primary navigation"
                className="absolute inset-y-0 right-0 z-[81] w-full"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="theme-nav-drawer-panel flex h-full flex-col justify-center px-8 pb-10 pt-24 sm:px-12">
                  <div className="theme-text-subtle mb-8 text-right text-[0.78rem] font-semibold uppercase tracking-[0.32em]">
                    Menu
                  </div>

                  <div className="ml-auto flex w-full max-w-[30rem] flex-col items-end gap-4 text-right sm:gap-5">
                    {routes.map((route) => {
                      const isActive = route.path === currentPath;
                      return (
                        <button
                          key={route.path}
                          type="button"
                          onClick={() => handleNavigate(route)}
                          className={`theme-nav-drawer-link leading-none tracking-[-0.05em] transition active:scale-[0.98] text-[clamp(2.1rem,7vw,4rem)] ${isActive ? "is-active font-semibold" : "font-medium"}`}
                        >
                          {route.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : (
        <div className="pointer-events-none fixed left-1/2 top-4 z-[70] w-[min(96vw,980px)] -translate-x-1/2">
          <motion.nav
            className="pointer-events-auto"
            initial={false}
            animate={{ y: visible ? 0 : -92, opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHoveringTop(true)}
            onMouseLeave={() => setHoveringTop(false)}
          >
            <div className="theme-nav-panel mx-auto flex items-center justify-center gap-[0.72rem] rounded-full px-[0.94rem] py-[0.58rem]">
              {routes.map((route) => {
                const isActive = route.path === currentPath;
                return (
                  <button
                    key={route.path}
                    type="button"
                    onClick={() => handleNavigate(route)}
                    className={`theme-nav-link rounded-full px-[1.32rem] py-[0.76rem] text-[1.09rem] tracking-[0.01em] transition active:scale-95 ${isActive ? "is-active font-semibold" : "font-medium"}`}
                  >
                    {route.label}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        </div>
      )}
    </>
  );
};

export default NavBar;
