// src/components/AnimatedDotFieldCanvas.tsx
import React, { useRef, useEffect } from "react";

interface Ring {
  radius: number;
  angle: number;
  alpha: number;
}

const AnimatedDotFieldCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const rings = useRef<Ring[]>([]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let anim: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Initialize a few rings
    for (let i = 0; i < 6; i++) {
      rings.current.push({
        radius: 80 + i * 40,
        angle: 0,
        alpha: 1 - i * 0.3,
      });
    }

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      rings.current.forEach((ring) => {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(ring.angle);

        // dotted arc via dash pattern
        ctx.setLineDash([0, 12]);  
        ctx.strokeStyle = `rgba(0,0,0,${ring.alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // update
        ring.angle += 0.002;      // slow rotate
        ring.radius += 0.3;       // expand
        ring.alpha  -= 0.001;     // fade
      });

      // recycle finished rings
      rings.current = rings.current.map((r) =>
        r.alpha <= 0
          ? { radius: 80, angle: 0, alpha: 1 }
          : r
      );

      anim = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
};

export default AnimatedDotFieldCanvas;
