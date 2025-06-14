// src/App.tsx
import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import NavBar        from "./components/NavBar/NavBar";

/** Very small site-state machine for now */
type Page =
  | "landing"
  | "Overview"
  | "My Projects"
  | "My Story"
  | "Connect"
  | "Research Blog";

/** The list of pages we want in the NavBar (excluding "landing") */
const pages: Page[] = [
  "Overview",
  "My Projects",
  "My Story",
  "Connect",
  "Research Blog",
];

function App() {
  const [page, setPage] = useState<Page>("landing");

  /** Called by both LandingPage and NavBar when the user wants to switch */
  const handleNavigate = (target: Page) => {
    setPage(target);
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Always-on NavBar */}
      <NavBar
        pages={pages}
        onNavigate={(p) => handleNavigate(p as Page)}
      />

      {/* Page content switch */}
      {page === "landing" ? (
        <LandingPage onNavigate={(sec) => handleNavigate(sec as Page)} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <h1 className="text-4xl">{page} Page</h1>
        </div>
      )}
    </div>
  );
}

export default App;
