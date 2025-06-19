import React, { useEffect, useState } from "react";

export interface FooterProps {
  /**
   * Optional ref to the element whose scroll position controls the footer.
   * Defaults to the window if not provided.
   */
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const Footer: React.FC<FooterProps> = ({ scrollContainerRef }) => {
  const [showMini, setShowMini] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = scrollContainerRef?.current;

    const getMetrics = () => {
      if (el) {
        const { scrollTop, scrollHeight, clientHeight } = el;
        return {
          distance: scrollHeight - clientHeight - scrollTop,
          scrollable: scrollHeight > clientHeight + 5,
        };
      } else {
        const scrollY = window.scrollY;
        const viewport = window.innerHeight;
        const height = document.documentElement.scrollHeight;
        return {
          distance: height - viewport - scrollY,
          scrollable: height > viewport + 5,
        };
      }
    };

    const handle = () => {
      const { distance, scrollable } = getMetrics();
      if (!scrollable) {
        setShowMini(false);
        setExpanded(false);
        return;
      }
      setShowMini(distance < 200);
      setExpanded(distance < 20);
    };

    if (el) {
      el.addEventListener("scroll", handle);
    } else {
      window.addEventListener("scroll", handle);
    }
    handle();
    return () => {
      if (el) {
        el.removeEventListener("scroll", handle);
      } else {
        window.removeEventListener("scroll", handle);
      }
    };
  }, [scrollContainerRef]);

  return (
    <>
      {showMini && (
        <div
          className={
            "fixed bottom-0 left-0 right-0 z-30 bg-gray-800 text-white p-3 " +
            "transition-transform" +
            (expanded ? " translate-y-full" : " translate-y-0")
          }
        >
          <div className="max-w-4xl mx-auto flex justify-between text-sm">
            <span>John Surette</span>
            <span>contact@example.com</span>
          </div>
        </div>
      )}
      {expanded && (
        <div className="fixed inset-0 z-40 bg-gray-800 text-white flex flex-col items-center justify-center space-y-4 p-6">
          <h2 className="text-3xl font-bold">John Surette</h2>
          <p>contact@example.com</p>
          <div className="flex space-x-4">
            <a href="#" className="underline">
              LinkedIn
            </a>
            <a href="#" className="underline">
              GitHub
            </a>
          </div>
          <p className="text-xs mt-6">Scroll up to return</p>
        </div>
      )}
    </>
  );
};

export default Footer;
