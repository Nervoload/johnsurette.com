import React, { useRef, useEffect } from "react";
import { sections } from "../sections";

interface RadialDotFieldCanvasProps {
  activeSection: string | null;
  /** dots spawned per second */
  spawnRate?: number;
  /** maximum number of simultaneous dots */
  maxDots?: number;
  /** variation factor for initial velocity */
  randomness?: number;
  /** starting diameter in pixels */
  initialDotSize?: number;
  /** shrink rate in pixels per second */
  shrinkRate?: number;
  /** fade-out rate in opacity units per second */
  fadeRate?: number;
  /** base speed in pixels per second */
  baseSpeed?: number;
  /** fraction of smaller canvas dimension that dots can reach before despawning */
  maxRadiusMultiplier?: number;
}

interface Dot {
  angle: number;
  radius: number;
  velocity: number;
  size: number;
  alpha: number;
  creation: number;
}

const RadialDotFieldCanvas: React.FC<RadialDotFieldCanvasProps> = ({
  activeSection,
  spawnRate = 20,
  maxDots = 100,
  randomness = 0.2,
  initialDotSize = 6,
  shrinkRate = 8,
  fadeRate = 0.2,
  baseSpeed = 120,
  maxRadiusMultiplier = 0.75,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<string | null>(activeSection);

  // Keep latest section color reference without resetting dots
  useEffect(() => {
    activeRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const parent = canvas.parentElement as HTMLElement;
    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Compute center orb radius; adjust factor to match your CenterOrb size
    const orbRadius = () => parent.clientWidth * 0.23;

    let lastTime = performance.now();
    const dots: Dot[] = [];
    let spawnAcc = 0;

    const maxRadius = () => Math.min(canvas.width, canvas.height) * maxRadiusMultiplier;

    // Reset dots when tab returns
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

      // Spawn dots at orb perimeter
      spawnAcc += spawnRate * dt;
      while (dots.length < maxDots && spawnAcc >= 1) {
        dots.push({
          angle: Math.random() * Math.PI * 2,
          radius: orbRadius(),
          velocity: baseSpeed + (Math.random() - 0.5) * baseSpeed * randomness,
          size: initialDotSize,
          alpha: 1,
          creation: ts,
        });
        spawnAcc -= 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Update and draw each dot
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.radius += d.velocity * dt;
        d.size = Math.max(0, d.size - shrinkRate * dt);
        d.alpha = Math.max(0, d.alpha - fadeRate * dt);

        if (d.size <= 0 || d.alpha <= 0 || d.radius > maxRadius()) {
          dots.splice(i, 1);
          continue;
        }

        const hex = sections.find((s) => s.name === activeRef.current)?.color ?? "#000000";
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        ctx.shadowBlur = d.size;
        ctx.shadowColor = `rgba(${r},${g},${b},${d.alpha * 0.3})`;

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
  }, [spawnRate, maxDots, randomness, initialDotSize, shrinkRate, fadeRate, baseSpeed, maxRadiusMultiplier]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export default RadialDotFieldCanvas;
