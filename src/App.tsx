import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import NavBar from "./components/NavBar/NavBar";
import TransitionWipe, { TransitionHandle, WipeOptions } from "./components/Transitions/TransitionWipe";
import { SiteRoute, normalizeRoute, siteRoutes } from "./components/sections";
import {
  canonicalizeRoutePath,
  getBlogPostSlugFromPath,
  getNavigationMatchPath,
  getProjectSlugFromPath,
  isRouteEnabled,
} from "./content";
import { useThemeMode } from "./components/theme/useThemeMode";
import CodexContextInspector from "./devtools/codexContext/CodexContextInspector";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const OriginStoryPage = lazy(() => import("./pages/OriginStoryPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectCaseStudyPage = lazy(() => import("./pages/ProjectCaseStudyPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const ROUTE_TRANSITION_FULL_MS = 760;
const ROUTE_TRANSITION_LITE_MS = 620;
const ORIGIN_DEV_ROUTE: SiteRoute = {
  label: "Origin Lab",
  path: "/origin",
  color: "#22d3ee",
};
const originRouteEnabled = isRouteEnabled("/origin");
const transitionRoutes: SiteRoute[] = originRouteEnabled ? [...siteRoutes, ORIGIN_DEV_ROUTE] : [...siteRoutes];
const HEAVY_TRANSITION_ROUTES = new Set(originRouteEnabled ? ["/", "/projects", "/origin"] : ["/", "/projects"]);

const routeIndexMap = new Map<string, number>(
  transitionRoutes.map((route, index) => [normalizeRoute(route.path), index]),
);

const routeColorMap = new Map<string, string>(
  transitionRoutes.map((route) => [normalizeRoute(route.path), route.color]),
);

type LandingEntryTarget = "hero" | "conclusion";

const buildTransitionOptions = (
  fromPath: string,
  toPath: string,
  opts?: WipeOptions,
): Required<WipeOptions> => {
  const fromKey = getNavigationMatchPath(fromPath);
  const toKey = getNavigationMatchPath(toPath);
  const fromIndex = routeIndexMap.get(fromKey) ?? 0;
  const toIndex = routeIndexMap.get(toKey) ?? fromIndex;

  const inferredDirection: Required<WipeOptions>["direction"] = toIndex >= fromIndex ? "right" : "left";
  const enteringHeavyRoute = HEAVY_TRANSITION_ROUTES.has(toKey);
  const isInBlogFamily = fromKey === "/blog" && toKey === "/blog";

  return {
    direction: opts?.direction ?? inferredDirection,
    color: opts?.color ?? routeColorMap.get(toKey) ?? "#e2e8f0",
    duration: opts?.duration ?? (isInBlogFamily ? 420 : enteringHeavyRoute ? ROUTE_TRANSITION_LITE_MS : ROUTE_TRANSITION_FULL_MS),
    intensity: opts?.intensity ?? (isInBlogFamily || enteringHeavyRoute ? "lite" : "full"),
  };
};

const PageFallback: React.FC = () => {
  return (
    <div className="theme-page-bg theme-text-primary flex h-[100svh] w-screen items-center justify-center">
      <div className="theme-surface-elevated theme-border-subtle theme-text-muted rounded-xl border px-5 py-3 text-sm tracking-wide shadow-sm">
        Loading page...
      </div>
    </div>
  );
};

function App() {
  const initialPath = typeof window === "undefined" ? "/" : normalizeRoute(window.location.pathname);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedMode, toggleTheme } = useThemeMode();

  const [path, setPath] = useState<string>(initialPath);
  const [navInteractionTick, setNavInteractionTick] = useState(0);
  const [landingEntryTarget, setLandingEntryTarget] = useState<LandingEntryTarget>("hero");
  const [landingEntryNonce, setLandingEntryNonce] = useState(0);
  const pathRef = useRef<string>(initialPath);
  const navigationLockRef = useRef(false);
  const wipeRef = useRef<TransitionHandle>(null);
  const navCurrentPath = useMemo(() => getNavigationMatchPath(path), [path]);

  const navRoutes = useMemo<SiteRoute[]>(
    () => (import.meta.env.DEV && originRouteEnabled ? [...siteRoutes, ORIGIN_DEV_ROUTE] : siteRoutes),
    [],
  );

  const setLandingEntry = useCallback((target: LandingEntryTarget) => {
    setLandingEntryTarget(target);
    setLandingEntryNonce((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.pathname !== initialPath) {
      window.history.replaceState({}, "", initialPath);
    }

    const onPopState = () => {
      const next = normalizeRoute(window.location.pathname);
      pathRef.current = next;
      setPath(next);
      if (window.location.pathname !== next) {
        window.history.replaceState({}, "", next);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [initialPath]);

  const navigate = useCallback(
    (targetPath: string, opts?: WipeOptions): boolean => {
      const requestedPath = canonicalizeRoutePath(targetPath);
      if (requestedPath !== "/" && !isRouteEnabled(requestedPath)) return false;

      const nextPath = normalizeRoute(targetPath);
      if (nextPath === pathRef.current || navigationLockRef.current) return false;

      if (nextPath === "/" && pathRef.current !== "/origin") {
        setLandingEntry("hero");
      }

      const transitionOptions = buildTransitionOptions(pathRef.current, nextPath, opts);

      const run = async () => {
        navigationLockRef.current = true;

        try {
          if (wipeRef.current) {
            await wipeRef.current.start(transitionOptions);
          }

          window.history.pushState({}, "", nextPath);
          pathRef.current = nextPath;
          setPath(nextPath);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              wipeRef.current?.done();
            });
          });
        } finally {
          window.setTimeout(() => {
            navigationLockRef.current = false;
          }, Math.max(260, transitionOptions.duration + 120));
        }
      };

      void run();
      return true;
    },
    [setLandingEntry],
  );

  const handleHintNavInteraction = useCallback(() => {
    setNavInteractionTick((prev) => prev + 1);
  }, []);

  const handleEnterOriginExperience = useCallback(() => {
    return navigate("/origin", {
      color: ORIGIN_DEV_ROUTE.color,
      direction: "down",
      intensity: "lite",
      duration: 640,
    });
  }, [navigate]);

  const handleOriginExitToHero = useCallback(() => {
    const accepted = navigate("/", {
      color: "#dbeafe",
      direction: "up",
      intensity: "lite",
      duration: 640,
    });
    if (accepted) {
      setLandingEntry("hero");
    }
  }, [navigate, setLandingEntry]);

  const handleOriginExitToConclusion = useCallback(() => {
    const accepted = navigate("/", {
      color: "#ddd6fe",
      direction: "up",
      intensity: "lite",
      duration: 660,
    });
    if (accepted) {
      setLandingEntry("conclusion");
    }
  }, [navigate, setLandingEntry]);

  const pageNode = useMemo(() => {
    if (path === "/") {
      return (
        <LandingPage
          onNavigate={navigate}
          shadowMode={resolvedMode}
          navInteractionTick={navInteractionTick}
          onEnterOriginExperience={handleEnterOriginExperience}
          entryTarget={landingEntryTarget}
          entryNonce={landingEntryNonce}
        />
      );
    }

    if (path === "/origin") {
      return (
        <OriginStoryPage
          onExitToLandingHero={handleOriginExitToHero}
          onExitToLandingConclusion={handleOriginExitToConclusion}
        />
      );
    }

    const projectSlug = getProjectSlugFromPath(path);

    if (path === "/projects") {
      return <ProjectsPage themeMode={resolvedMode} navInteractionTick={navInteractionTick} onNavigate={navigate} />;
    }

    if (projectSlug) {
      return <ProjectCaseStudyPage slug={projectSlug} onNavigate={navigate} themeMode={resolvedMode} />;
    }

    if (path === "/about") {
      return <AboutPage onNavigate={navigate} themeMode={resolvedMode} />;
    }

    if (path === "/contact") {
      return <ContactPage themeMode={resolvedMode} />;
    }

    const blogSlug = getBlogPostSlugFromPath(path);

    if (path === "/blog" || blogSlug) {
      return <BlogPage onNavigate={navigate} articleSlug={blogSlug ?? undefined} themeMode={resolvedMode} />;
    }

    return (
      <LandingPage
        onNavigate={navigate}
        shadowMode={resolvedMode}
        navInteractionTick={navInteractionTick}
        onEnterOriginExperience={handleEnterOriginExperience}
        entryTarget={landingEntryTarget}
        entryNonce={landingEntryNonce}
      />
    );
  }, [
    handleEnterOriginExperience,
    handleOriginExitToConclusion,
    handleOriginExitToHero,
    landingEntryNonce,
    landingEntryTarget,
    navInteractionTick,
    navigate,
    path,
    resolvedMode,
  ]);

  const isHeavyRoute = HEAVY_TRANSITION_ROUTES.has(navCurrentPath);
  const pageMotionKey = navCurrentPath === "/blog" ? "/blog" : path;
  const pageInitialMotion = prefersReducedMotion
    ? { opacity: 1 }
    : isHeavyRoute
      ? { opacity: 0, y: 12, filter: "blur(4px)", scale: 0.996 }
      : { opacity: 0, y: 24, filter: "blur(10px)", scale: 0.992 };
  const pageTransition = prefersReducedMotion
    ? { duration: 0 }
    : isHeavyRoute
      ? { duration: 0.48, ease: [0.14, 0.88, 0.22, 1] as [number, number, number, number] }
      : { duration: 0.7, ease: [0.14, 0.88, 0.22, 1] as [number, number, number, number] };

  return (
    <div className="relative h-[100svh] w-screen overflow-hidden theme-page-bg" data-theme={resolvedMode}>
      <TransitionWipe ref={wipeRef} />
      <NavBar
        routes={navRoutes}
        currentPath={navCurrentPath}
        onNavigate={navigate}
        resolvedThemeMode={resolvedMode}
        onToggleTheme={toggleTheme}
        onHintNavInteraction={handleHintNavInteraction}
      />
      <Suspense fallback={<PageFallback />}>
        <motion.main
          key={pageMotionKey}
          className="h-full w-full"
          initial={pageInitialMotion}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={pageTransition}
          style={{ willChange: prefersReducedMotion ? "auto" : "transform, opacity, filter" }}
        >
          {pageNode}
        </motion.main>
      </Suspense>
      {import.meta.env.DEV ? <CodexContextInspector currentPath={path} /> : null}
    </div>
  );
}

export default App;
