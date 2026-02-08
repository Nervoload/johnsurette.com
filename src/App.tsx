import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import TransitionWipe, { TransitionHandle, WipeOptions } from "./components/Transitions/TransitionWipe";
import { normalizeRoute, siteRoutes } from "./components/sections";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const PageFallback: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 text-slate-800">
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm tracking-wide text-slate-600 shadow-sm">
        Loading page...
      </div>
    </div>
  );
};

function App() {
  const initialPath = typeof window === "undefined" ? "/" : normalizeRoute(window.location.pathname);

  const [path, setPath] = useState<string>(initialPath);
  const pathRef = useRef<string>(initialPath);
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
    if (nextPath === pathRef.current) return;

    const run = async () => {
      if (wipeRef.current) {
        await wipeRef.current.start(opts);
      }

      window.history.pushState({}, "", nextPath);
      pathRef.current = nextPath;
      setPath(nextPath);

      requestAnimationFrame(() => wipeRef.current?.done());
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
      return <AboutPage />;
    }

    if (path === "/contact") {
      return <ContactPage />;
    }

    if (path === "/blog") {
      return <BlogPage />;
    }

    return <LandingPage onNavigate={navigate} />;
  }, [path, navigate]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-50">
      <TransitionWipe ref={wipeRef} />
      <NavBar routes={siteRoutes} currentPath={path} onNavigate={navigate} />
      <Suspense fallback={<PageFallback />}>{pageNode}</Suspense>
    </div>
  );
}

export default App;
