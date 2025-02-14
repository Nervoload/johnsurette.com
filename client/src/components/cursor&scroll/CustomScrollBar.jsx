// src/components/cursor&scroll/CustomScrollBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './custom-scroll.css';

const CustomScrollBar = ({
  scrollContainerRef,
  sectionCount = 4, // Total number of sections
  scrollColors = []   // e.g., ['#fff', '#000', '#000', '#fff']
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [totalHeight, setTotalHeight] = useState(window.innerHeight * sectionCount);
  const [currentSection, setCurrentSection] = useState(0);
  const animationFrame = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollTop = container.scrollTop;
      const currentIndex = Math.floor(scrollTop / viewportHeight);
      setCurrentSection(currentIndex);
      const maxScroll = totalHeight - viewportHeight;
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      setScrollProgress(progress);
      animationFrame.current = null;
    };

    const handleScroll = () => {
      if (animationFrame.current === null) {
        animationFrame.current = requestAnimationFrame(updateProgress);
      }
    };

    const handleResize = () => {
      const newViewportHeight = window.innerHeight;
      setViewportHeight(newViewportHeight);
      setTotalHeight(newViewportHeight * sectionCount);
      updateProgress();
    };

    handleResize();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [scrollContainerRef, sectionCount, viewportHeight, totalHeight]);

  // Compute fill color based on current section (default white).
  const fillColor = (scrollColors && scrollColors[currentSection]) || '#fff';
  // Define the height of the scrollbar container.
  const containerHeight = Math.min(viewportHeight * 0.6, viewportHeight - 40);

  return (
    <div className="custom-scrollbar" style={{ height: `${containerHeight}px` }}>
      <div className="scrollbar-track">
        <div
          className="scrollbar-fill"
          style={{ 
            height: `${scrollProgress * 100}%`,
            backgroundColor: fillColor
          }}
        />
      </div>
    </div>
  );
};

export default CustomScrollBar;