import React, { useRef, useEffect } from "react";
import { sections } from "../sections";

interface AnimatedDotFieldCanvasProps {
  activeSection: string | null;
  spawnRate?: number;            // dots per second
  maxDots?: number;              // cap of simultaneous dots
  randomness?: number;           // orbit speed variation
  waveformAmplitude?: number;    // radial pulsation px
  initialDotSize?: number;       // starting diameter px
  shrinkRate?: number;           // px per second
  fadeRate?: number;             // opacity units per second
  orbitSpeed?: number;           // radians per second
}

interface Dot {
  angle: number;
  baseRadius: number;
  radius: number;
  size: number;
  alpha: number;
  offset: number;
  velocity: number;
  creation: number;
}

const AnimatedDotFieldCanvas: React.FC<AnimatedDotFieldCanvasProps> = ({
  activeSection,
  spawnRate = 20,
  maxDots = 80,
  randomness = 0.3,
  waveformAmplitude = 10,
  initialDotSize = 6,
  shrinkRate = 8,
  fadeRate = 0.2,
  orbitSpeed = 0.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string | null>(activeSection);

  // Update active section in ref to avoid resetting dots
  useEffect(() => {
    activeRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Resize to match center orb container
    const parent = canvas.parentElement as HTMLElement;
    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Radii based on the center orb
    const orbRadius = () => parent.clientWidth * 0.23;
    const outerRadius = () => orbRadius() * 1.23;

    let lastTime = performance.now();
    const dots: Dot[] = [];
    let spawnAcc = 0;

    // Reset on tab visibility change
    const handleVisibility = () => {
      if (!document.hidden) {
        dots.length = 0;
        spawnAcc = 0;
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const render = (ts: number) => {
      const dt = (ts - lastTime) / 1000;
      lastTime = ts;

      // Spawn up to spawnRate per second
      spawnAcc += spawnRate * dt;
      while (dots.length < maxDots && spawnAcc >= 1) {
        const angle = Math.random() * Math.PI * 2;
        const innerR = orbRadius();
        const outerR = outerRadius();
        const baseRadius = innerR + Math.random() * (outerR - innerR);
        dots.push({
          angle,
          baseRadius,
          radius: baseRadius,
          size: initialDotSize,
          alpha: 1,
          offset: Math.random() * Math.PI * 2,
          velocity: orbitSpeed + (Math.random() - 0.5) * orbitSpeed * randomness,
          creation: ts,
        });
        spawnAcc -= 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Update & draw dots
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        const age = (ts - d.creation) / 1000;

        d.radius = d.baseRadius + waveformAmplitude * Math.sin(age + d.offset);
        d.angle += d.velocity * dt;
        d.size = Math.max(0, d.size - shrinkRate * dt);
        d.alpha = Math.max(0, d.alpha - fadeRate * dt);

        if (d.size <= 0 || d.alpha <= 0) {
          dots.splice(i, 1);
          continue;
        }

        // Determine color (default black)
        const hex = sections.find((s) => s.name === activeRef.current)?.color ?? "#000000";
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        // Glow effect
        ctx.shadowBlur = d.size;
        ctx.shadowColor = `rgba(${r},${g},${b},${d.alpha * 0.3})`;

        // Draw dot
        ctx.beginPath();
        ctx.arc(
          d.radius * Math.cos(d.angle),
          d.radius * Math.sin(d.angle),
          d.size / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(${r},${g},${b},${d.alpha})`;
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      ctx.restore();
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [spawnRate, maxDots, randomness, waveformAmplitude, initialDotSize, shrinkRate, fadeRate, orbitSpeed]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export default AnimatedDotFieldCanvas;
