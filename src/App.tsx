import React, { useState, useRef } from "react";
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import NavBar       from "./components/NavBar/NavBar";
import TransitionWipe, {
  TransitionHandle,
  WipeOptions,
} from "./components/Transitions/TransitionWipe";

type Page =
  | "landing"
  | "Overview"
  | "My Projects"
  | "My Story"
  | "Connect"
  | "Research Blog";

const pages: Page[] = [
  "Overview",
  "My Projects",
  "My Story",
  "Connect",
  "Research Blog",
];

function App() {
  const [page, setPage] = useState<Page>("landing");
  const wipeRef = useRef<TransitionHandle>(null);

  const handleNavigate = (target: string, opts?: WipeOptions): void => {
    wipeRef.current
      ?.start(opts)
      .then(() => {
        setPage(target as Page);
        // allow React to mount new content, then reverse the wipe
        setTimeout(() => wipeRef.current?.done(), 50);
      });
  };

  return (
    <div className="relative w-screen h-screen">
      {/* full-screen wipe overlay */}
      <TransitionWipe ref={wipeRef} />

      {/* nav bar (always on) */}
      <NavBar pages={pages} onNavigate={handleNavigate} />

      {/* main content */}
      {page === "landing" ? (
        <LandingPage onNavigate={handleNavigate} />
      ) : page === "My Projects" ? (
        <ProjectsPage />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <h1 className="text-4xl">{page} Page</h1>
        </div>
      )}
    </div>
  );
}

export default App;
