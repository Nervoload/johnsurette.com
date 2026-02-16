import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import NavBar from "./components/NavBar/NavBar";
import TransitionWipe, { TransitionHandle, WipeOptions } from "./components/Transitions/TransitionWipe";
import { normalizeRoute, siteRoutes } from "./components/sections";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ROUTE_TRANSITION_FULL_MS = 760;
const ROUTE_TRANSITION_LITE_MS = 620;
const HEAVY_TRANSITION_ROUTES = new Set(["/", "/projects"]);

const routeIndexMap = new Map<string, number>(
  siteRoutes.map((route, index) => [normalizeRoute(route.path), index]),
);

const routeColorMap = new Map<string, string>(siteRoutes.map((route) => [normalizeRoute(route.path), route.color]));

const buildTransitionOptions = (
  fromPath: string,
  toPath: string,
  opts?: WipeOptions,
): Required<WipeOptions> => {
  const fromIndex = routeIndexMap.get(fromPath) ?? 0;
  const toIndex = routeIndexMap.get(toPath) ?? fromIndex;

  const inferredDirection: Required<WipeOptions>["direction"] = toIndex >= fromIndex ? "right" : "left";
  const enteringHeavyRoute = HEAVY_TRANSITION_ROUTES.has(toPath);

  return {
    direction: opts?.direction ?? inferredDirection,
    color: opts?.color ?? routeColorMap.get(toPath) ?? "#e2e8f0",
    duration: opts?.duration ?? (enteringHeavyRoute ? ROUTE_TRANSITION_LITE_MS : ROUTE_TRANSITION_FULL_MS),
    intensity: opts?.intensity ?? (enteringHeavyRoute ? "lite" : "full"),
  };
};

const PageFallback: React.FC = () => {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center bg-slate-50 text-slate-800">
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm tracking-wide text-slate-600 shadow-sm">
        Loading page...
      </div>
    </div>
  );
};

function App() {
  const initialPath = typeof window === "undefined" ? "/" : normalizeRoute(window.location.pathname);
  const prefersReducedMotion = useReducedMotion();

  const [path, setPath] = useState<string>(initialPath);
  const pathRef = useRef<string>(initialPath);
  const navigationLockRef = useRef(false);
  const wipeRef = useRef<TransitionHandle>(null);

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

  const navigate = useCallback((targetPath: string, opts?: WipeOptions) => {
    const nextPath = normalizeRoute(targetPath);
    if (nextPath === pathRef.current || navigationLockRef.current) return;

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
  }, []);

  const pageNode = useMemo(() => {
    if (path === "/") {
      return <LandingPage onNavigate={navigate} />;
    }

    if (path === "/projects") {
      return <ProjectsPage />;
    }

    if (path === "/about") {
      return <AboutPage onNavigate={navigate} />;
    }

    if (path === "/contact") {
      return <ContactPage />;
    }

    if (path === "/blog") {
      return <BlogPage />;
    }

    return <LandingPage onNavigate={navigate} />;
  }, [path, navigate]);

  const isHeavyRoute = HEAVY_TRANSITION_ROUTES.has(path);
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
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-slate-50 supports-[height:100dvh]:h-[100dvh]">
      <TransitionWipe ref={wipeRef} />
      <NavBar routes={siteRoutes} currentPath={path} onNavigate={navigate} />
      <Suspense fallback={<PageFallback />}>
        <motion.main
          key={path}
          className="h-full w-full"
          initial={pageInitialMotion}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
          }
          transition={pageTransition}
          style={{ willChange: prefersReducedMotion ? "auto" : "transform, opacity, filter" }}
        >
          {pageNode}
        </motion.main>
      </Suspense>
    </div>
  );
}

export default App;
