import React, { useEffect, useRef } from "react";
import { ResolvedThemeMode } from "../theme/themeMode";

interface GlobePoint {
  x: number;
  y: number;
  z: number;
  seed: number;
  color: [number, number, number];
}

export interface DotFieldGlobeBackgroundProps {
  pointCount?: number;
  className?: string;
  themeMode: ResolvedThemeMode;
}

interface GlobePalette {
  pointColors: Array<[number, number, number]>;
  linkColor: [number, number, number];
}

const toRgb = (hex: string): [number, number, number] => {
  const value = hex.replace("#", "");
  const safe = value.length === 3
    ? value.split("").map((char) => `${char}${char}`).join("")
    : value;
  const parsed = Number.parseInt(safe, 16);
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
};

const globePalettes: Record<ResolvedThemeMode, GlobePalette> = {
  light: {
    pointColors: ["#0ea5e9", "#06b6d4", "#4f46e5", "#14b8a6", "#10b981"].map(toRgb),
    linkColor: toRgb("#1e293b"),
  },
  dark: {
    pointColors: ["#67e8f9", "#22d3ee", "#a78bfa", "#f59e0b", "#34d399"].map(toRgb),
    linkColor: toRgb("#67e8f9"),
  },
};

const DotFieldGlobeBackground: React.FC<DotFieldGlobeBackgroundProps> = ({
  pointCount = 220,
  className = "",
  themeMode,
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
    const palette = globePalettes[themeMode];

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
        color: palette.pointColors[Math.floor(Math.random() * palette.pointColors.length)],
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

      ctx.strokeStyle = `rgba(${palette.linkColor[0]}, ${palette.linkColor[1]}, ${palette.linkColor[2]}, ${
        themeMode === "dark" ? 0.14 : 0.12
      })`;
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
          const linkAlpha = (1 - distSq / 420) * (themeMode === "dark" ? 0.13 : 0.11) * Math.min(a.alpha, b.alpha);
          if (linkAlpha < 0.014) continue;
          ctx.strokeStyle = `rgba(${palette.linkColor[0]}, ${palette.linkColor[1]}, ${palette.linkColor[2]}, ${linkAlpha})`;
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
        const [red, green, blue] = points[i].color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius * pulse, 0, Math.PI * 2);
        const alpha = themeMode === "dark"
          ? 0.28 + p.alpha * 0.64
          : 0.18 + p.alpha * 0.62;
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
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
  }, [pointCount, themeMode]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true" />;
};

export default DotFieldGlobeBackground;
