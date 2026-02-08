import React, { useEffect, useRef } from "react";

type SymbolParticle = {
  nx: number;
  ny: number;
  z: number;
  speed: number;
  drift: number;
  size: number;
  phase: number;
  glyph: string;
  trail: number;
};

const glyphs = [
  "0",
  "1",
  "{",
  "}",
  "[",
  "]",
  "<",
  ">",
  "/",
  "\\",
  "+",
  "-",
  "=",
  "*",
  ";",
  ":",
  "$",
  "#",
  "@",
  "&",
];

const particleCountForArea = (width: number, height: number): number => {
  const area = width * height;
  return Math.max(120, Math.min(360, Math.floor(area / 9000)));
};

const seed = (index: number, salt: number): number => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

const DepthRainBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: SymbolParticle[] = [];
    let raf = 0;
    let lastTime = performance.now();

    const createParticle = (index: number): SymbolParticle => {
      const z = seed(index, 3);
      const normalizedY = seed(index, 4) * 1.2 - 0.1;

      return {
        nx: seed(index, 1),
        ny: normalizedY,
        z,
        speed: 24 + z * 66,
        drift: (seed(index, 5) - 0.5) * (16 + z * 34),
        size: 8 + z * 9,
        phase: seed(index, 6) * Math.PI * 2,
        glyph: glyphs[Math.floor(seed(index, 7) * glyphs.length)],
        trail: 3 + Math.floor(seed(index, 8) * 3),
      };
    };

    const syncParticleCount = () => {
      const count = particleCountForArea(width, height);

      if (particles.length === count) return;

      if (particles.length < count) {
        const startIndex = particles.length;
        for (let i = startIndex; i < count; i++) {
          particles.push(createParticle(i));
        }
        return;
      }

      particles = particles.slice(0, count);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncParticleCount();
    };

    const drawGlyph = (glyph: string, x: number, y: number, size: number, alpha: number, hue: number) => {
      ctx.font = `${size}px Menlo, Monaco, Consolas, monospace`;
      ctx.fillStyle = `hsla(${hue}, 96%, 75%, ${alpha})`;
      ctx.fillText(glyph, x, y);
    };

    const tick = (time: number) => {
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const sway = Math.sin(time * 0.001 + particle.phase) * particle.drift;

        particle.ny += (particle.speed * delta) / Math.max(height, 1);
        particle.nx += (sway * delta) / Math.max(width, 1) * 0.35;

        if (particle.ny > 1.15) {
          particle.ny = -0.12 - seed(i, time * 0.001) * 0.2;
          particle.nx = seed(i, time * 0.002 + 20);
          particle.glyph = glyphs[Math.floor(seed(i, time * 0.003 + 12) * glyphs.length)];
        }

        if (particle.nx < -0.05) particle.nx += 1.1;
        if (particle.nx > 1.05) particle.nx -= 1.1;

        const x = particle.nx * width;
        const y = particle.ny * height;

        const near = particle.z;
        const hue = 182 + near * 70;
        const alpha = 0.06 + near * 0.24;
        const depthFade = 0.5 + near * 0.6;
        const symbolSize = particle.size * depthFade;

        drawGlyph(particle.glyph, x, y, symbolSize, alpha, hue);

        for (let t = 1; t <= particle.trail; t++) {
          const trailFactor = (particle.trail - t + 1) / (particle.trail + 1);
          const trailY = y - t * (3 + near * 5);
          const trailX = x - sway * 0.008 * t;
          const trailAlpha = alpha * trailFactor * 0.5;
          drawGlyph(particle.glyph, trailX, trailY, symbolSize * (0.92 - t * 0.08), trailAlpha, hue + t * 2);
        }
      }

      ctx.globalCompositeOperation = "source-over";
      raf = window.requestAnimationFrame(tick);
    };

    resize();
    if (particles.length === 0) {
      syncParticleCount();
    }
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden />;
};

export default DepthRainBackdrop;
