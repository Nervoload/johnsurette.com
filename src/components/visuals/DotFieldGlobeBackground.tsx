import React, { useEffect, useRef } from "react";

interface GlobePoint {
  x: number;
  y: number;
  z: number;
  seed: number;
}

export interface DotFieldGlobeBackgroundProps {
  pointCount?: number;
  className?: string;
}

const DotFieldGlobeBackground: React.FC<DotFieldGlobeBackgroundProps> = ({
  pointCount = 220,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const adjustedPointCount = window.innerWidth < 640 ? Math.min(pointCount, 140) : pointCount;

    const points: GlobePoint[] = [];
    for (let i = 0; i < adjustedPointCount; i += 1) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      points.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
        seed: Math.random() * Math.PI * 2,
      });
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (timeMs: number) => {
      const t = timeMs * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.72;
      const cy = height * 0.34;
      const radius = Math.min(width, height) * 0.25;
      const perspective = radius * 2.4;
      const rotation = t * 0.22;

      ctx.strokeStyle = "rgba(15, 23, 42, 0.12)";
      ctx.lineWidth = 0.6;

      const projected: Array<{ x: number; y: number; z: number; alpha: number }> = [];

      for (const p of points) {
        const cosR = Math.cos(rotation);
        const sinR = Math.sin(rotation);
        const rx = p.x * cosR - p.z * sinR;
        const rz = p.x * sinR + p.z * cosR;
        const ry = p.y * Math.cos(rotation * 0.7) - rz * Math.sin(rotation * 0.7) * 0.18;
        const depth = perspective / (perspective - rz * radius);
        const sx = cx + rx * radius * depth;
        const sy = cy + ry * radius * depth;
        const alpha = 0.28 + Math.max(0, rz) * 0.55;
        projected.push({ x: sx, y: sy, z: rz, alpha });
      }

      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j += 1) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 420) continue;
          const linkAlpha = (1 - distSq / 420) * 0.11 * Math.min(a.alpha, b.alpha);
          if (linkAlpha < 0.014) continue;
          ctx.strokeStyle = `rgba(15, 23, 42, ${linkAlpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (let i = 0; i < projected.length; i += 1) {
        const p = projected[i];
        const pulse = 0.72 + Math.sin(t * 1.15 + points[i].seed) * 0.24;
        const dotRadius = 0.7 + Math.max(0, p.z) * 1.75;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 23, 42, ${0.16 + p.alpha * 0.65})`;
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(render);
    };

    if (prefersReducedMotion) {
      render(0);
    } else {
      rafId = window.requestAnimationFrame(render);
    }

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", resize);
    };
  }, [pointCount]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true" />;
};

export default DotFieldGlobeBackground;
