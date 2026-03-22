import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface VesicleSeed extends Vec3 {
  radius: number;
  phase: number;
  drift: number;
}

interface ReceptorSeed extends Vec3 {
  phase: number;
}

interface SignalRoute {
  from: number;
  to: number;
  seed: number;
  speed: number;
  offset: number;
  thickness: number;
}

const TAU = Math.PI * 2;
const BASE_WIDTH = 900;
const BASE_HEIGHT = 620;

const vesicles: VesicleSeed[] = [
  { x: -126, y: -156, z: 18, radius: 18, phase: 0.08, drift: 0.9 },
  { x: -74, y: -170, z: 12, radius: 22, phase: 0.22, drift: 1.05 },
  { x: -18, y: -182, z: 26, radius: 16, phase: 0.39, drift: 0.82 },
  { x: 42, y: -168, z: 15, radius: 21, phase: 0.53, drift: 1.18 },
  { x: 98, y: -150, z: 20, radius: 17, phase: 0.69, drift: 0.95 },
  { x: -145, y: -112, z: 10, radius: 19, phase: 0.14, drift: 1.01 },
  { x: -88, y: -118, z: 14, radius: 16, phase: 0.31, drift: 0.77 },
  { x: -32, y: -128, z: 8, radius: 20, phase: 0.47, drift: 1.08 },
  { x: 24, y: -118, z: 22, radius: 17, phase: 0.61, drift: 0.88 },
  { x: 84, y: -104, z: 16, radius: 18, phase: 0.76, drift: 1.14 },
  { x: -108, y: -72, z: 28, radius: 15, phase: 0.18, drift: 0.85 },
  { x: -46, y: -82, z: 11, radius: 19, phase: 0.44, drift: 1.02 },
];

const receptors: ReceptorSeed[] = [
  { x: -224, y: 128, z: 8, phase: 0.05 },
  { x: -172, y: 140, z: 16, phase: 0.13 },
  { x: -120, y: 132, z: 10, phase: 0.21 },
  { x: -68, y: 145, z: 24, phase: 0.29 },
  { x: -18, y: 136, z: 14, phase: 0.37 },
  { x: 32, y: 146, z: 18, phase: 0.45 },
  { x: 84, y: 132, z: 10, phase: 0.53 },
  { x: 136, y: 144, z: 22, phase: 0.61 },
  { x: 188, y: 134, z: 12, phase: 0.69 },
  { x: 240, y: 142, z: 20, phase: 0.77 },
  { x: -52, y: 154, z: 28, phase: 0.85 },
  { x: 116, y: 156, z: 26, phase: 0.93 },
];

const signalRoutes: SignalRoute[] = Array.from({ length: 22 }, (_, index) => ({
  from: index % vesicles.length,
  to: (index * 2 + 1) % receptors.length,
  seed: index * 0.097,
  speed: 0.16 + (index % 4) * 0.03,
  offset: (index % 5) * 0.06,
  thickness: 1.15 + (index % 3) * 0.35,
})).slice(0, 16);

const backdropSpecks = Array.from({ length: 18 }, (_, index) => ({
  x: Math.cos(index * 0.91) * (160 + (index % 5) * 22),
  y: -170 + (index % 6) * 58,
  z: -120 + (index % 7) * 22,
  radius: 1.2 + (index % 4) * 0.6,
  phase: index * 0.11,
}));

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const smoothstep = (start: number, end: number, value: number) => {
  const amount = clamp((value - start) / (end - start), 0, 1);
  return amount * amount * (3 - 2 * amount);
};

const wrap01 = (value: number) => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

const easeInOutCubic = (value: number) => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2);

const cubicBezier = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const inv = 1 - t;
  return (
    inv * inv * inv * p0 +
    3 * inv * inv * t * p1 +
    3 * inv * t * t * p2 +
    t * t * t * p3
  );
};

const rotatePoint = (point: Vec3, tiltX: number, tiltY: number, tiltZ: number): Vec3 => {
  const cosY = Math.cos(tiltY);
  const sinY = Math.sin(tiltY);
  const cosX = Math.cos(tiltX);
  const sinX = Math.sin(tiltX);
  const cosZ = Math.cos(tiltZ);
  const sinZ = Math.sin(tiltZ);

  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;
  const x3 = x1 * cosZ - y2 * sinZ;
  const y3 = x1 * sinZ + y2 * cosZ;

  return {
    x: x3,
    y: y3,
    z: z2,
  };
};

const projectPoint = (point: Vec3, camera: { focal: number; distance: number }) => {
  const depth = point.z + camera.distance;
  const perspective = camera.focal / (camera.focal + depth);

  return {
    x: point.x * perspective,
    y: point.y * perspective,
    scale: perspective,
    depth,
  };
};

const drawSoftEllipse = (
  context: CanvasRenderingContext2D,
  radiusX: number,
  radiusY: number,
  fillTop: string,
  fillBottom: string,
  stroke: string,
  lineWidth: number,
) => {
  const fill = context.createLinearGradient(0, -radiusY, 0, radiusY);
  fill.addColorStop(0, fillTop);
  fill.addColorStop(1, fillBottom);
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.ellipse(0, 0, radiusX, radiusY, 0, 0, TAU);
  context.fill();
  context.stroke();
};

const drawBody = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  tilt: number,
  tint: { top: string; bottom: string; stroke: string; highlight: string },
  neck?: { width: number; height: number; offsetY: number },
) => {
  context.save();
  context.translate(x, y);
  context.rotate(tilt);

  context.save();
  context.scale(1.04, 0.92);
  drawSoftEllipse(context, radiusX, radiusY, tint.top, tint.bottom, tint.stroke, 2.25);
  context.restore();

  context.save();
  context.globalCompositeOperation = "screen";
  const glow = context.createRadialGradient(-radiusX * 0.18, -radiusY * 0.48, 0, 0, 0, radiusX * 1.12);
  glow.addColorStop(0, tint.highlight);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = glow;
  context.beginPath();
  context.ellipse(0, 0, radiusX * 1.04, radiusY * 0.94, 0, 0, TAU);
  context.fill();
  context.restore();

  context.save();
  context.globalAlpha = 0.58;
  context.strokeStyle = "rgba(255,255,255,0.3)";
  context.lineWidth = 1.6;
  for (let index = 0; index < 4; index += 1) {
    const t = 0.24 + index * 0.16;
    context.beginPath();
    context.ellipse(-radiusX * 0.14, -radiusY * 0.14 + index * 9, radiusX * (0.76 - index * 0.04), radiusY * (0.22 + index * 0.03), 0.12, 0, TAU);
    context.stroke();
  }
  context.restore();

  if (neck) {
    context.save();
    context.translate(0, neck.offsetY);
    const neckFill = context.createLinearGradient(0, -neck.height, 0, neck.height);
    neckFill.addColorStop(0, "rgba(103, 232, 249, 0.18)");
    neckFill.addColorStop(1, "rgba(8, 47, 73, 0.92)");
    context.fillStyle = neckFill;
    context.strokeStyle = "rgba(165, 243, 252, 0.5)";
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(0, 0, neck.width, neck.height, 0, 0, TAU);
    context.fill();
    context.stroke();
    context.restore();
  }

  context.restore();
};

const drawReceptor = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  pulse: number,
  accent: boolean,
) => {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.globalAlpha = 0.95;
  context.strokeStyle = accent ? "rgba(167, 243, 208, 0.95)" : "rgba(125, 211, 252, 0.92)";
  context.fillStyle = accent ? "rgba(16, 185, 129, 0.18)" : "rgba(14, 165, 233, 0.14)";
  context.lineWidth = 3;

  context.beginPath();
  context.moveTo(-10, 10);
  context.bezierCurveTo(-10, -8 - pulse * 6, -4, -16 - pulse * 10, 0, -7 - pulse * 6);
  context.bezierCurveTo(4, -16 - pulse * 10, 10, -8 - pulse * 6, 10, 10);
  context.stroke();

  context.beginPath();
  context.arc(0, -2 - pulse * 3, 4.6, 0, TAU);
  context.fill();
  context.stroke();
  context.restore();
};

const drawParticleTrail = (
  context: CanvasRenderingContext2D,
  start: Vec3,
  c1: Vec3,
  c2: Vec3,
  end: Vec3,
  time: number,
  camera: { focal: number; distance: number },
  reduced: boolean,
  color: string,
  thickness: number,
) => {
  const trailCount = reduced ? 1 : 4;
  const trailGap = 0.065;

  for (let index = 0; index < trailCount; index += 1) {
    const rawProgress = wrap01(time - index * trailGap);
    const progress = easeInOutCubic(rawProgress);
    const fade = 1 - index / trailCount;
    const point = {
      x: cubicBezier(start.x, c1.x, c2.x, end.x, progress),
      y: cubicBezier(start.y, c1.y, c2.y, end.y, progress),
      z: cubicBezier(start.z, c1.z, c2.z, end.z, progress),
    };
    const rotated = rotatePoint(point, Math.sin(time * 0.32) * 0.05, Math.cos(time * 0.24) * 0.06, Math.sin(time * 0.28) * 0.03);
    const projected = projectPoint(rotated, camera);
    const size = (3.3 + thickness) * projected.scale;

    context.save();
    context.globalCompositeOperation = "lighter";
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 18 * fade;
    context.globalAlpha = fade * 0.88;
    context.beginPath();
    context.arc(projected.x, projected.y, size, 0, TAU);
    context.fill();
    context.restore();
  }
};

const BiologySynapsePlaceholder: React.FC = () => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const visibilityRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastDrawRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "120px 0px 120px 0px",
        threshold: [0, 0.08, 0.18],
      },
    );

    observer.observe(wrapper);
    visibilityRef.current = observer;

    return () => {
      observer.disconnect();
      visibilityRef.current = null;
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let width = 0;
    let height = 0;

    const drawScene = (timestamp: number) => {
      if (!prefersReducedMotion) {
        const targetFrameMs = 1000 / 30;
        if (timestamp - lastDrawRef.current < targetFrameMs) {
          frameRef.current = window.requestAnimationFrame(drawScene);
          return;
        }
        lastDrawRef.current = timestamp;
      }

      const seconds = timestamp / 1000;
      const camera = {
        focal: 920,
        distance: 720,
      };
      const centerX = width / 2;
      const centerY = height / 2 + height * 0.02;
      const wobbleX = Math.sin(seconds * 0.38) * 0.055;
      const wobbleY = Math.cos(seconds * 0.28) * 0.075;
      const wobbleZ = Math.sin(seconds * 0.24) * 0.04;
      const reduced = prefersReducedMotion;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(2, 6, 23, 1)";
      context.fillRect(0, 0, width, height);

      const backdrop = context.createRadialGradient(width * 0.52, height * 0.26, 0, width * 0.52, height * 0.26, Math.max(width, height) * 0.86);
      backdrop.addColorStop(0, "rgba(34, 211, 238, 0.16)");
      backdrop.addColorStop(0.45, "rgba(16, 185, 129, 0.08)");
      backdrop.addColorStop(1, "rgba(2, 6, 23, 0)");
      context.fillStyle = backdrop;
      context.fillRect(0, 0, width, height);

      context.save();
      context.translate(centerX, centerY);
      context.scale(Math.min(width / BASE_WIDTH, height / BASE_HEIGHT), Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));

      const horizonGlow = context.createLinearGradient(0, -240, 0, 220);
      horizonGlow.addColorStop(0, "rgba(34, 211, 238, 0)");
      horizonGlow.addColorStop(0.42, "rgba(34, 211, 238, 0.22)");
      horizonGlow.addColorStop(1, "rgba(2, 6, 23, 0)");
      context.fillStyle = horizonGlow;
      context.beginPath();
      context.ellipse(0, 0, 360, 180, 0, 0, TAU);
      context.fill();

      for (let index = 0; index < 12; index += 1) {
        const x = lerp(-330, 330, index / 11) + Math.sin(seconds * 0.22 + index * 0.65) * 5;
        context.save();
        context.strokeStyle = `rgba(103, 232, 249, ${0.03 + index * 0.003})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x, -248);
        context.bezierCurveTo(x + 8, -160 + Math.sin(index) * 8, x - 12, 46 + Math.cos(index) * 10, x, 250);
        context.stroke();
        context.restore();
      }

      for (const speck of backdropSpecks) {
        const x = speck.x + Math.sin(seconds * 0.28 + speck.phase) * 12;
        const y = speck.y + Math.cos(seconds * 0.22 + speck.phase * 1.4) * 10;
        const z = speck.z + Math.sin(seconds * 0.18 + speck.phase * 1.2) * 6;
        const rotated = rotatePoint({ x, y, z }, wobbleX, wobbleY, wobbleZ);
        const projected = projectPoint(rotated, camera);
        context.save();
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(186, 230, 253, 0.52)";
        context.shadowColor = "rgba(34, 211, 238, 0.3)";
        context.shadowBlur = 16;
        context.globalAlpha = 0.12 + (speck.radius * 0.08);
        context.beginPath();
        context.arc(projected.x, projected.y, speck.radius * projected.scale, 0, TAU);
        context.fill();
        context.restore();
      }

      drawBody(
        context,
        0,
        -120,
        206,
        128,
        -0.075 + Math.sin(seconds * 0.22) * 0.015,
        {
          top: "rgba(103, 232, 249, 0.28)",
          bottom: "rgba(8, 47, 73, 0.96)",
          stroke: "rgba(165, 243, 252, 0.4)",
          highlight: "rgba(255, 255, 255, 0.12)",
        },
        { width: 28, height: 64, offsetY: -220 },
      );

      context.save();
      context.translate(0, -222);
      context.rotate(0.02);
      context.globalCompositeOperation = "screen";
      const neckGlow = context.createRadialGradient(0, -20, 0, 0, 0, 88);
      neckGlow.addColorStop(0, "rgba(125, 211, 252, 0.22)");
      neckGlow.addColorStop(1, "rgba(125, 211, 252, 0)");
      context.fillStyle = neckGlow;
      context.beginPath();
      context.ellipse(0, 0, 42, 78, 0, 0, TAU);
      context.fill();
      context.restore();

      context.save();
      const cleftGlow = context.createRadialGradient(0, 14, 0, 0, 18, 180);
      cleftGlow.addColorStop(0, "rgba(224, 242, 254, 0.28)");
      cleftGlow.addColorStop(0.42, "rgba(34, 211, 238, 0.16)");
      cleftGlow.addColorStop(1, "rgba(2, 6, 23, 0)");
      context.fillStyle = cleftGlow;
      context.beginPath();
      context.ellipse(0, 16, 288, 52, 0, 0, TAU);
      context.fill();

      for (let lane = 0; lane < 7; lane += 1) {
        const y = -6 + lane * 8;
        context.strokeStyle = `rgba(186, 230, 253, ${0.12 - lane * 0.012})`;
        context.lineWidth = lane % 2 === 0 ? 2.5 : 1.25;
        context.beginPath();
        context.moveTo(-256, y);
        context.bezierCurveTo(-176, y - 10, -48, y + 6, 0, y - 2);
        context.bezierCurveTo(58, y - 8, 178, y + 10, 256, y + 2);
        context.stroke();
      }
      context.restore();

      drawBody(
        context,
        0,
        122,
        252,
        134,
        0.062 + Math.cos(seconds * 0.18) * 0.014,
        {
          top: "rgba(16, 185, 129, 0.22)",
          bottom: "rgba(6, 78, 59, 0.96)",
          stroke: "rgba(167, 243, 208, 0.34)",
          highlight: "rgba(255, 255, 255, 0.1)",
        },
      );

      context.save();
      context.translate(0, 96);
      context.globalCompositeOperation = "screen";
      const ridgeGlow = context.createLinearGradient(-256, 0, 256, 0);
      ridgeGlow.addColorStop(0, "rgba(125, 211, 252, 0)");
      ridgeGlow.addColorStop(0.5, "rgba(167, 243, 208, 0.14)");
      ridgeGlow.addColorStop(1, "rgba(125, 211, 252, 0)");
      context.strokeStyle = ridgeGlow;
      context.lineWidth = 8;
      context.beginPath();
      context.moveTo(-252, 36);
      context.bezierCurveTo(-168, 12, -60, 6, 0, 10);
      context.bezierCurveTo(70, 14, 168, 20, 252, 34);
      context.stroke();
      context.restore();

      for (const receptor of receptors) {
        const pulse = reduced ? 0.1 : (Math.sin(seconds * 2.5 + receptor.phase * TAU) + 1) * 0.5;
        const x = receptor.x + Math.sin(seconds * 0.72 + receptor.phase * TAU) * 5;
        const y = receptor.y + Math.cos(seconds * 0.62 + receptor.phase * TAU) * 4;
        drawReceptor(context, x, y, 1 + pulse * 0.06, pulse, receptor.phase > 0.5);
      }

      for (const vesicle of vesicles) {
        const bob = reduced ? 0 : Math.sin(seconds * (0.95 + vesicle.drift * 0.1) + vesicle.phase * TAU);
        const x = vesicle.x + Math.sin(seconds * 0.6 + vesicle.phase * TAU) * 7;
        const y = vesicle.y + bob * 6;
        const z = vesicle.z + Math.cos(seconds * 0.48 + vesicle.phase * TAU) * 12;
        const rotated = rotatePoint({ x, y, z }, wobbleX * 0.8, wobbleY * 0.78, wobbleZ * 0.55);
        const projected = projectPoint(rotated, camera);
        const size = vesicle.radius * projected.scale * (1 + z * 0.0003);
        const glow = context.createRadialGradient(projected.x - size * 0.22, projected.y - size * 0.26, 0, projected.x, projected.y, size * 1.6);
        glow.addColorStop(0, "rgba(255,255,255,0.9)");
        glow.addColorStop(0.3, "rgba(186, 230, 253, 0.38)");
        glow.addColorStop(1, "rgba(34, 211, 238, 0)");

        context.save();
        context.globalCompositeOperation = "lighter";
        context.fillStyle = glow;
        context.shadowColor = "rgba(103, 232, 249, 0.42)";
        context.shadowBlur = 16;
        context.beginPath();
        context.arc(projected.x, projected.y, size * 1.05, 0, TAU);
        context.fill();
        context.restore();

        context.save();
        context.fillStyle = "rgba(186, 230, 253, 0.76)";
        context.strokeStyle = "rgba(224, 242, 254, 0.54)";
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(projected.x, projected.y, size * 0.82, 0, TAU);
        context.fill();
        context.stroke();
        context.restore();

        context.save();
        context.fillStyle = "rgba(255,255,255,0.72)";
        context.beginPath();
        context.arc(projected.x - size * 0.25, projected.y - size * 0.22, Math.max(1.8, size * 0.18), 0, TAU);
        context.fill();
        context.restore();
      }

      for (const route of signalRoutes) {
        const source = vesicles[route.from];
        const target = receptors[route.to];
        const sourcePoint: Vec3 = {
          x: source.x,
          y: source.y + 4,
          z: source.z,
        };
        const targetPoint: Vec3 = {
          x: target.x,
          y: target.y - 14,
          z: target.z,
        };
        const ctrl1: Vec3 = {
          x: lerp(sourcePoint.x, 0, 0.3) + Math.sin(seconds * 0.4 + route.seed) * 18,
          y: lerp(sourcePoint.y, -16, 0.38),
          z: lerp(sourcePoint.z, 34, 0.4),
        };
        const ctrl2: Vec3 = {
          x: lerp(targetPoint.x, 0, 0.24) + Math.cos(seconds * 0.35 + route.seed) * 14,
          y: lerp(targetPoint.y, 16, 0.34),
          z: lerp(targetPoint.z, 8, 0.4),
        };
        const phase = wrap01(seconds * route.speed + route.offset + route.seed);
        const active = reduced ? 1 : smoothstep(0.02, 0.9, phase) * (1 - smoothstep(0.92, 1, phase));
        if (active <= 0.001) continue;

        drawParticleTrail(
          context,
          sourcePoint,
          ctrl1,
          ctrl2,
          targetPoint,
          phase,
          camera,
          reduced,
          route.seed % 2 > 0.5 ? "rgba(167, 243, 208, 0.88)" : "rgba(125, 211, 252, 0.9)",
          route.thickness,
        );
      }

      for (let index = 0; index < 8; index += 1) {
        const t = index / 7;
        const y = lerp(-92, 132, t);
        const sway = Math.sin(seconds * 0.9 + t * TAU) * 14;
        context.save();
        context.globalCompositeOperation = "screen";
        context.strokeStyle = `rgba(103, 232, 249, ${0.05 + (1 - Math.abs(0.5 - t) * 2) * 0.06})`;
        context.lineWidth = 1.2;
        context.beginPath();
        context.moveTo(-208 + sway, y - 30);
        context.bezierCurveTo(-108 + sway * 0.3, y - 42, 94 - sway * 0.2, y + 40, 220 - sway * 0.5, y + 18);
        context.stroke();
        context.restore();
      }

      context.restore();

      if (!reduced && isVisible) {
        frameRef.current = window.requestAnimationFrame(drawScene);
      }
    };

    const resizeCanvas = () => {
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(0);
    };

    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });

    observer.observe(wrapper);
    resizeObserverRef.current = observer;

    if (!prefersReducedMotion && isVisible) {
      frameRef.current = window.requestAnimationFrame(drawScene);
    }

    return () => {
      observer.disconnect();
      resizeObserverRef.current = null;

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastDrawRef.current = 0;
    };
  }, [isVisible, prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto h-[min(72vh,56rem)] w-full max-w-[68rem] overflow-visible lg:h-[min(76vh,60rem)]"
    >
      <div className="pointer-events-none absolute inset-[-10%_-8%_-12%] bg-[radial-gradient(circle_at_50%_24%,rgba(34,211,238,0.2),transparent_24%),radial-gradient(circle_at_50%_74%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_16%_38%,rgba(59,130,246,0.12),transparent_18%),radial-gradient(circle_at_86%_42%,rgba(56,189,248,0.12),transparent_20%)] blur-3xl" />
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[2.4rem] border border-cyan-100/10 bg-slate-950/78 shadow-[0_40px_120px_rgba(2,6,23,0.46)]"
        initial={{ opacity: 0, scale: 0.985, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.26),rgba(2,6,23,0.76)),radial-gradient(circle_at_50%_24%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_50%_72%,rgba(16,185,129,0.14),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px)] [background-size:30px_30px] opacity-35" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/84 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/88 to-transparent" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      </motion.div>
    </div>
  );
};

export default BiologySynapsePlaceholder;
