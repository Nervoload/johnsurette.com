// src/components/NavBar/LandingOrb.tsx
import React, { useRef, useEffect, useState } from "react";

export interface LandingOrbProps {
  onClick: () => void;
}

const LandingOrb: React.FC<LandingOrbProps> = ({ onClick }) => {
  const [hover, setHover] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw three harmonic waves clipped to circle, with shorter wavelengths and higher amplitude
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let rafId: number;
    const draw = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);

      // clip to circle
      const r = Math.min(w, h) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.clip();

      // draw waves with increased freq and amplitude
      const t = performance.now() / 1000;
      [ 1, 3].forEach((freq, i) => {
        ctx.beginPath();
        // higher amplitude: half radius, scaled by (i+1)
        const amp = (r / 2) / (i + 1);
        for (let x = 0; x <= w; x++) {
          const phase = (x / w) * Math.PI * 2 * freq + t * freq;
          const y = h / 2 + Math.sin(phase) * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(0,0,0,${0.6 / (i + 1)})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes hueRotate {
          from { filter: hue-rotate(0deg); }
          to   { filter: hue-rotate(360deg); }
        }
      `}</style>

      <div
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={
          `w-10 h-10 rounded-full p-[2px] cursor-pointer ` +
          `transition-transform duration-200 ease-in-out ` +
          (hover ? "scale-110" : "scale-100")
        }
        style={{
          background:
            "conic-gradient(from 0deg at 20% 30%,rgb(255, 100, 100),rgb(255, 247, 104),rgb(131, 255, 150), #8fd3f4,rgb(77, 77, 255), #ff3cac)",
          animation: "hueRotate 8s linear infinite",
        }}
      >
        {/* inner orb */}
        <div
          className={
            `w-full h-full rounded-full overflow-hidden relative ` +
            `bg-gradient-to-br from-white/90 to-white/30`
          }
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>
    </>
  );
};

export default LandingOrb;
