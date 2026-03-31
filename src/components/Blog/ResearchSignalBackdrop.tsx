import React, { useEffect, useMemo, useRef, useState } from "react";
import type { BlogPostEntry } from "../../content";
import { usePointerTracker } from "../LandingComponents/backgroundEffects/runtime/usePointerTracker";
import type { BackgroundInteractionMode } from "../LandingComponents/backgroundEffects/types";

interface ResearchSignalBackdropProps {
  post: BlogPostEntry;
  interactionMode?: BackgroundInteractionMode;
  className?: string;
}

interface SignalSlip {
  nx: number;
  ny: number;
  width: number;
  height: number;
  depth: number;
  rotation: number;
  sway: number;
  drift: number;
  phase: number;
  variant: "slip" | "ledger" | "capsule";
  ruleCount: number;
  emphasis: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const hashString = (value: string): number => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const makeRng = (seed: number): (() => number) => {
  let state = seed || 1;
  return () => {
    state = Math.imul(state, 1664525) + 1013904223;
    return ((state >>> 0) & 0xffffffff) / 4294967296;
  };
};

const toRgba = (color: string, alpha: number): string => {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized = hex.length === 3
      ? hex.split("").map((channel) => channel + channel).join("")
      : hex;

    if (normalized.length === 6) {
      const red = Number.parseInt(normalized.slice(0, 2), 16);
      const green = Number.parseInt(normalized.slice(2, 4), 16);
      const blue = Number.parseInt(normalized.slice(4, 6), 16);
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
  }

  return color;
};

const buildSlips = (seed: number, count: number, sceneId?: string): SignalSlip[] => {
  const rng = makeRng(seed);
  const slips: SignalSlip[] = [];
  const preferredVariant =
    sceneId === "signalGrid" ? "ledger" : sceneId === "neuralBloom" ? "capsule" : "slip";

  for (let index = 0; index < count; index += 1) {
    const variantRoll = rng();
    const variant =
      variantRoll > 0.68
        ? preferredVariant
        : variantRoll > 0.34
          ? "ledger"
          : "slip";
    const depth = 0.28 + rng() * 0.72;
    const width = variant === "capsule" ? 0.12 + rng() * 0.08 : 0.08 + rng() * 0.12;
    const height = variant === "ledger" ? 0.06 + rng() * 0.06 : 0.038 + rng() * 0.05;

    slips.push({
      nx: rng(),
      ny: rng() * 1.28 - 0.14,
      width,
      height,
      depth,
      rotation: (rng() - 0.5) * 0.42,
      sway: 0.18 + rng() * 0.44,
      drift: 0.018 + rng() * 0.036,
      phase: rng() * Math.PI * 2,
      variant,
      ruleCount: 1 + Math.floor(rng() * 4),
      emphasis: rng(),
    });
  }

  return slips.sort((a, b) => a.depth - b.depth);
};

const drawRoundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void => {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
};

const ResearchSignalBackdrop: React.FC<ResearchSignalBackdropProps> = ({
  post,
  interactionMode = "medium",
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerRef = usePointerTracker(interactionMode, reducedMotion);
  const slips = useMemo(() => {
    const seed = hashString(`${post.id}-${post.visualIdentity.sceneId ?? "research"}`);
    return buildSlips(seed, 26, post.visualIdentity.sceneId);
  }, [post.id, post.visualIdentity.sceneId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;

    const syncCanvasSize = (): void => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.8);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawSlip = (slip: SignalSlip, time: number): void => {
      const pointer = pointerRef.current;
      const pointerX = (pointer.x + 1) * 0.5 * width;
      const pointerY = (1 - pointer.y) * 0.5 * height;
      const clickPulse = pointer.clickPulse;
      const parallaxX = pointer.x * 18 * slip.depth;
      const parallaxY = pointer.y * -14 * slip.depth;
      const timeScale = reducedMotion ? 0.22 : 1;

      const wrappedY = ((slip.ny + time * slip.drift * 0.018 * timeScale) % 1.34 + 1.34) % 1.34 - 0.17;
      const x = slip.nx * width + Math.sin(time * slip.sway * 0.52 * timeScale + slip.phase) * width * 0.028 * slip.depth + parallaxX;
      const y = wrappedY * height + Math.cos(time * slip.sway * 0.36 * timeScale + slip.phase) * 14 * slip.depth + parallaxY;
      const slipWidth = width * slip.width * (0.8 + slip.depth * 0.45);
      const slipHeight = height * slip.height * (0.76 + slip.depth * 0.36);

      const dx = x - pointerX;
      const dy = y - pointerY;
      const distance = Math.hypot(dx, dy);
      const influence = pointer.active ? Math.exp(-distance / (180 + slip.depth * 120)) * pointer.strength : 0;
      const repelX = distance > 0 ? (dx / distance) * 14 * influence : 0;
      const repelY = distance > 0 ? (dy / distance) * 9 * influence : 0;
      const rotation = slip.rotation + Math.sin(time * 0.24 * timeScale + slip.phase) * 0.08 * slip.depth + pointer.x * 0.08 * influence;

      context.save();
      context.translate(x + repelX, y + repelY);
      context.rotate(rotation);

      const fillAlpha = 0.035 + slip.depth * 0.11 + clickPulse * 0.016;
      const strokeAlpha = 0.08 + slip.depth * 0.16 + clickPulse * 0.04;
      const markAlpha = 0.12 + slip.depth * 0.22;
      const glowAlpha = 0.08 + slip.depth * 0.14 + clickPulse * 0.05;
      const radius = Math.min(slipWidth, slipHeight) * 0.26;
      const left = -slipWidth / 2;
      const top = -slipHeight / 2;

      context.shadowBlur = reducedMotion ? 0 : 26 * slip.depth;
      context.shadowColor = toRgba(post.visualIdentity.palette.accent, glowAlpha);

      const fillGradient = context.createLinearGradient(left, top, left + slipWidth, top + slipHeight);
      fillGradient.addColorStop(0, toRgba(post.visualIdentity.palette.surface, fillAlpha));
      fillGradient.addColorStop(1, toRgba(post.visualIdentity.palette.highlight, fillAlpha * 0.44));

      drawRoundedRect(context, left, top, slipWidth, slipHeight, radius);
      context.fillStyle = fillGradient;
      context.fill();
      context.strokeStyle = toRgba(post.visualIdentity.palette.highlight, strokeAlpha);
      context.lineWidth = 1;
      context.stroke();

      context.shadowBlur = 0;
      context.strokeStyle = toRgba(post.visualIdentity.palette.text, markAlpha);
      context.lineWidth = 0.8;

      if (slip.variant === "capsule") {
        context.beginPath();
        context.moveTo(left + slipWidth * 0.18, 0);
        context.lineTo(left + slipWidth * 0.82, 0);
        context.stroke();
      } else {
        const paddingX = slipWidth * 0.16;
        const lineGap = slipHeight / (slip.ruleCount + 1.8);

        for (let index = 0; index < slip.ruleCount; index += 1) {
          const ruleY = top + lineGap * (index + 1.1);
          const ruleWidth = slipWidth * (0.34 + ((index + 1) / slip.ruleCount) * 0.38) * (0.84 + slip.emphasis * 0.2);
          context.beginPath();
          context.moveTo(left + paddingX, ruleY);
          context.lineTo(left + paddingX + ruleWidth, ruleY);
          context.stroke();
        }

        context.fillStyle = toRgba(post.visualIdentity.palette.accent, 0.18 + slip.depth * 0.14);
        context.beginPath();
        context.arc(left + paddingX, top + slipHeight * 0.24, Math.max(1.3, slipHeight * 0.08), 0, Math.PI * 2);
        context.fill();
      }

      if (slip.variant === "ledger") {
        context.strokeStyle = toRgba(post.visualIdentity.palette.accent, 0.16 + slip.depth * 0.16);
        context.beginPath();
        context.moveTo(left + slipWidth * 0.78, top + slipHeight * 0.2);
        context.lineTo(left + slipWidth * 0.92, top + slipHeight * 0.2);
        context.lineTo(left + slipWidth * 0.92, top + slipHeight * 0.44);
        context.stroke();
      }

      context.restore();
    };

    const draw = (timeMs: number): void => {
      const time = timeMs / 1000;
      context.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const pointerX = (pointer.x + 1) * 0.5 * width;
      const pointerY = (1 - pointer.y) * 0.5 * height;
      const maxDim = Math.max(width, height);

      const pointerGlow = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, maxDim * 0.28);
      pointerGlow.addColorStop(0, toRgba(post.visualIdentity.palette.accent, pointer.active ? 0.12 + pointer.clickPulse * 0.06 : 0.05));
      pointerGlow.addColorStop(1, toRgba(post.visualIdentity.palette.accent, 0));
      context.fillStyle = pointerGlow;
      context.fillRect(0, 0, width, height);

      const ambientGlow = context.createRadialGradient(
        width * (post.visualIdentity.accentLight.x / 100),
        height * (post.visualIdentity.accentLight.y / 100),
        0,
        width * (post.visualIdentity.accentLight.x / 100),
        height * (post.visualIdentity.accentLight.y / 100),
        maxDim * 0.4,
      );
      ambientGlow.addColorStop(0, toRgba(post.visualIdentity.accentLight.color, 0.1));
      ambientGlow.addColorStop(1, toRgba(post.visualIdentity.accentLight.color, 0));
      context.fillStyle = ambientGlow;
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < slips.length; index += 1) {
        drawSlip(slips[index], time);
      }

      raf = window.requestAnimationFrame(draw);
    };

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncCanvasSize) : null;
    if (resizeObserver) {
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", syncCanvasSize);
    }

    syncCanvasSize();
    raf = window.requestAnimationFrame(draw);

    return () => {
      resizeObserver?.disconnect();
      if (!resizeObserver) {
        window.removeEventListener("resize", syncCanvasSize);
      }
      window.cancelAnimationFrame(raf);
    };
  }, [post, pointerRef, reducedMotion, slips]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "research-signal-backdrop"}
      aria-hidden
    />
  );
};

export default ResearchSignalBackdrop;
