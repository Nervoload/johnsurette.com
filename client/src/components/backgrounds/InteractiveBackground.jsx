// src/components/backgrounds/InteractiveBackground.jsx
import React, { useEffect, useState } from 'react';
import './interactive-Background.css';
import BackgroundCanvas from './NoiseGradientBG';



const InteractiveBackground = ({ sensitivity = 0.01 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get mouse position relative to the center of the viewport
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate transforms based on mouse position
  const backgroundTransform = `translate(${-mousePosition.x * sensitivity * 20}px, ${-mousePosition.y * sensitivity * 20}px)`;
  const circleTransform = `translate(${-mousePosition.x * sensitivity}px, ${-mousePosition.y * sensitivity}px)`;

  return (
    <div className="interactive-background">
      <div 
        className="background-layer"
        style={{ transform: backgroundTransform }}
      >
        <div className="background-base">
        <BackgroundCanvas />
        </div>
      </div>
      <div 
        className="foreground-layer"
        style={{ transform: circleTransform }}
      >
      </div>
    </div>
  );
};


export default InteractiveBackground;