import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

export type WipeOptions = {
  color?: string;
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
};

export type TransitionHandle = {
  start: (opts?: WipeOptions) => Promise<void>;
  done: () => void;
};

type Phase = "idle" | "entering" | "entered" | "exiting";

type WipeState = {
  phase: Phase;
  opts: Required<WipeOptions>;
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

type StageSnapshot = {
  opacity: number;
  scale: number;
  blur: number;
};

const BASE_DURATION = 560;
const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EXIT_EASE = "cubic-bezier(0.35, 0, 0.2, 1)";
const FALLBACK_RGB: RGB = { r: 148, g: 163, b: 184 };
const NEUTRAL_BLEND_RGB: RGB = { r: 202, g: 213, b: 226 };

const clampChannel = (value: number): number => Math.min(255, Math.max(0, Math.round(value)));

const parseHexColor = (value: string): RGB | null => {
  const hex = value.replace("#", "").trim();
  if (!/^[\da-f]+$/i.test(hex)) return null;

  if (hex.length === 3) {
    return {
      r: clampChannel(Number.parseInt(`${hex[0]}${hex[0]}`, 16)),
      g: clampChannel(Number.parseInt(`${hex[1]}${hex[1]}`, 16)),
      b: clampChannel(Number.parseInt(`${hex[2]}${hex[2]}`, 16)),
    };
  }

  if (hex.length === 6) {
    return {
      r: clampChannel(Number.parseInt(hex.slice(0, 2), 16)),
      g: clampChannel(Number.parseInt(hex.slice(2, 4), 16)),
      b: clampChannel(Number.parseInt(hex.slice(4, 6), 16)),
    };
  }

  return null;
};

const parseRgbColor = (value: string): RGB | null => {
  const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!rgbMatch) return null;

  return {
    r: clampChannel(Number.parseInt(rgbMatch[1], 10)),
    g: clampChannel(Number.parseInt(rgbMatch[2], 10)),
    b: clampChannel(Number.parseInt(rgbMatch[3], 10)),
  };
};

const parseColor = (value: string): RGB => {
  const trimmed = value.trim();
  if (trimmed.startsWith("#")) {
    return parseHexColor(trimmed) ?? FALLBACK_RGB;
  }
  if (trimmed.toLowerCase().startsWith("rgb")) {
    return parseRgbColor(trimmed) ?? FALLBACK_RGB;
  }
  return FALLBACK_RGB;
};

const toRgba = (color: RGB, alpha: number): string =>
  `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;

const blendColor = (from: RGB, to: RGB, weightTo: number): RGB => {
  const normalizedWeight = Math.max(0, Math.min(1, weightTo));
  const keepWeight = 1 - normalizedWeight;

  return {
    r: clampChannel(from.r * keepWeight + to.r * normalizedWeight),
    g: clampChannel(from.g * keepWeight + to.g * normalizedWeight),
    b: clampChannel(from.b * keepWeight + to.b * normalizedWeight),
  };
};

const glowOriginFromDirection = (direction: Required<WipeOptions>["direction"]): string => {
  if (direction === "left") return "18% 50%";
  if (direction === "right") return "82% 50%";
  if (direction === "up") return "50% 20%";
  return "50% 80%";
};

const snapshotByPhase = (phase: Phase): StageSnapshot => {
  if (phase === "entering") {
    return { opacity: 0, scale: 1.035, blur: 16 };
  }

  if (phase === "entered") {
    return { opacity: 1, scale: 1, blur: 0 };
  }

  return { opacity: 0, scale: 0.988, blur: 12 };
};

const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();

    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", syncPreference);
      return () => mediaQuery.removeEventListener("change", syncPreference);
    }

    mediaQuery.addListener(syncPreference);
    return () => mediaQuery.removeListener(syncPreference);
  }, []);

  return prefersReducedMotion;
};

const defaultOptions = (opts?: WipeOptions): Required<WipeOptions> => ({
  color: opts?.color ?? "#e2e8f0",
  direction: opts?.direction ?? "right",
  duration: opts?.duration ?? BASE_DURATION,
});

const TransitionWipe = forwardRef<TransitionHandle>((_, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<WipeState>({
    phase: "idle",
    opts: defaultOptions(),
  });
  const resolveRef = useRef<(() => void) | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      start(opts?: WipeOptions) {
        const resolved = defaultOptions(opts);

        if (prefersReducedMotion) {
          setState((prev) => ({ ...prev, phase: "idle", opts: resolved }));
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          resolveRef.current = resolve;
          setState({ phase: "entering", opts: resolved });
        });
      },
      done() {
        if (prefersReducedMotion) {
          setState((prev) => ({ ...prev, phase: "idle" }));
          return;
        }

        setState((prev) => {
          if (prev.phase !== "entered") return prev;
          return { ...prev, phase: "exiting" };
        });
      },
    }),
    [prefersReducedMotion],
  );

  useLayoutEffect(() => {
    if (state.phase === "entering") {
      const raf = requestAnimationFrame(() => {
        setState((prev) => (prev.phase === "entering" ? { ...prev, phase: "entered" } : prev));
      });
      return () => cancelAnimationFrame(raf);
    }
    return;
  }, [state.phase]);

  if (state.phase === "idle") return null;

  const softTint = blendColor(parseColor(state.opts.color), NEUTRAL_BLEND_RGB, 0.9);
  const glowOrigin = glowOriginFromDirection(state.opts.direction);
  const stage = snapshotByPhase(state.phase);
  const motionDuration =
    state.phase === "exiting" ? Math.max(320, Math.floor(state.opts.duration * 0.74)) : state.opts.duration;
  const easing = state.phase === "exiting" ? EXIT_EASE : ENTER_EASE;
  const textureTone = toRgba(softTint, 0.058);
  const frameTone = toRgba(softTint, 0.34);
  const stageTransition = `opacity ${motionDuration}ms ${easing}, transform ${motionDuration}ms ${easing}, filter ${motionDuration}ms ${easing}`;

  const stageStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 120,
    overflow: "hidden",
    pointerEvents: "none",
    opacity: stage.opacity,
    transform: `scale(${stage.scale})`,
    filter: `blur(${stage.blur}px) saturate(104%)`,
    willChange: "opacity, transform, filter",
    transition: state.phase === "entering" ? "none" : stageTransition,
  };

  const veilStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at ${glowOrigin}, ${toRgba(softTint, 0.18)} 0%, ${toRgba(softTint, 0.07)} 30%, rgba(255,255,255,0) 66%),
      linear-gradient(145deg, rgba(251, 253, 255, 0.986) 0%, rgba(244, 248, 252, 0.995) 35%, rgba(230, 236, 244, 0.99) 100%)
    `,
  };

  const textureStyle: React.CSSProperties = {
    position: "absolute",
    inset: "-12%",
    opacity: state.phase === "entered" ? 0.31 : 0.18,
    backgroundImage: `
      repeating-linear-gradient(126deg, transparent 0px, transparent 9px, ${textureTone} 9px, ${textureTone} 10px),
      repeating-linear-gradient(36deg, transparent 0px, transparent 14px, rgba(255,255,255,0.19) 14px, rgba(255,255,255,0.19) 15px)
    `,
    mixBlendMode: "multiply",
    transition: `opacity ${Math.max(260, Math.floor(motionDuration * 0.62))}ms ${easing}`,
  };

  const haloStyle: React.CSSProperties = {
    position: "absolute",
    inset: "-24%",
    background: `radial-gradient(circle at ${glowOrigin}, ${toRgba(softTint, 0.23)} 0%, ${toRgba(softTint, 0.08)} 26%, rgba(255,255,255,0) 58%)`,
    opacity: state.phase === "exiting" ? 0.42 : 0.72,
    transform: state.phase === "entered" ? "scale(1)" : "scale(1.12)",
    transition: `opacity ${Math.max(240, Math.floor(motionDuration * 0.68))}ms ${easing}, transform ${Math.max(240, Math.floor(motionDuration * 0.74))}ms ${easing}`,
    willChange: "opacity, transform",
  };

  const frameStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: state.phase === "exiting" ? 0.46 : 0.64,
    boxShadow: `inset 0 0 0 1px ${frameTone}, inset 0 42px 80px -60px ${toRgba(softTint, 0.28)}, inset 0 -42px 80px -62px ${toRgba(softTint, 0.24)}`,
    transition: `opacity ${Math.max(220, Math.floor(motionDuration * 0.58))}ms ${easing}`,
  };

  return (
    <div
      style={stageStyle}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget || event.propertyName !== "opacity") return;

        if (state.phase === "entered") {
          resolveRef.current?.();
          resolveRef.current = null;
        } else if (state.phase === "exiting") {
          setState((prev) => ({ ...prev, phase: "idle" }));
        }
      }}
    >
      <div style={veilStyle} />
      <div style={textureStyle} />
      <div style={haloStyle} />
      <div style={frameStyle} />
    </div>
  );
});

TransitionWipe.displayName = "TransitionWipe";

export default TransitionWipe;
