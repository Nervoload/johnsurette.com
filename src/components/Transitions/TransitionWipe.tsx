import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

export type WipeOptions = {
  color?: string;
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  intensity?: "full" | "lite";
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

type TransitionIntensity = "full" | "lite";

const BASE_DURATION = 760;
const ENTER_EASE = "cubic-bezier(0.14, 0.88, 0.22, 1)";
const EXIT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const FALLBACK_RGB: RGB = { r: 148, g: 163, b: 184 };
const NEUTRAL_BLEND_RGB: RGB = { r: 194, g: 205, b: 220 };

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

const snapshotByPhase = (phase: Phase, intensity: TransitionIntensity): StageSnapshot => {
  if (intensity === "lite") {
    if (phase === "entering") {
      return { opacity: 0, scale: 1.045, blur: 18 };
    }

    if (phase === "entered") {
      return { opacity: 1, scale: 1, blur: 0 };
    }

    return { opacity: 0, scale: 0.976, blur: 12 };
  }

  if (phase === "entering") {
    return { opacity: 0, scale: 1.09, blur: 30 };
  }

  if (phase === "entered") {
    return { opacity: 1, scale: 1, blur: 0 };
  }

  return { opacity: 0, scale: 0.962, blur: 22 };
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

    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    legacyMediaQuery.addListener?.(syncPreference);
    return () => legacyMediaQuery.removeListener?.(syncPreference);
  }, []);

  return prefersReducedMotion;
};

const defaultOptions = (opts?: WipeOptions): Required<WipeOptions> => ({
  color: opts?.color ?? "#e2e8f0",
  direction: opts?.direction ?? "right",
  duration: opts?.duration ?? BASE_DURATION,
  intensity: opts?.intensity ?? "full",
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

  const isLite = state.opts.intensity === "lite";
  const softTint = blendColor(parseColor(state.opts.color), NEUTRAL_BLEND_RGB, 0.82);
  const glowOrigin = glowOriginFromDirection(state.opts.direction);
  const stage = snapshotByPhase(state.phase, state.opts.intensity);
  const motionDuration =
    state.phase === "exiting"
      ? isLite
        ? Math.max(300, Math.floor(state.opts.duration * 0.66))
        : Math.max(460, Math.floor(state.opts.duration * 0.84))
      : isLite
        ? Math.max(420, Math.floor(state.opts.duration * 0.82))
        : state.opts.duration;
  const easing = state.phase === "exiting" ? EXIT_EASE : ENTER_EASE;
  const textureTone = toRgba(softTint, 0.068);
  const frameTone = toRgba(softTint, 0.4);
  const vignetteTone = toRgba({ r: 10, g: 16, b: 26 }, 0.26);
  const mistTone = toRgba(softTint, 0.2);
  const stageTransition = `opacity ${motionDuration}ms ${easing}, transform ${motionDuration}ms ${easing}, filter ${motionDuration}ms ${easing}`;

  const stageStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 120,
    overflow: "hidden",
    pointerEvents: "none",
    opacity: stage.opacity,
    transform: `scale(${stage.scale})`,
    filter: isLite ? `blur(${stage.blur}px)` : `blur(${stage.blur}px) saturate(108%) contrast(103%)`,
    willChange: "opacity, transform, filter",
    transition: state.phase === "entering" ? "none" : stageTransition,
  };

  const veilStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at ${glowOrigin}, ${toRgba(softTint, 0.23)} 0%, ${toRgba(softTint, 0.1)} 32%, rgba(255,255,255,0) 68%),
      linear-gradient(145deg, rgba(247, 251, 255, 0.988) 0%, rgba(235, 242, 250, 0.995) 42%, rgba(208, 219, 233, 0.988) 100%)
    `,
  };

  const textureStyle: React.CSSProperties = {
    position: "absolute",
    inset: isLite ? "-8%" : "-12%",
    opacity: state.phase === "entered" ? (isLite ? 0.26 : 0.4) : isLite ? 0.14 : 0.24,
    backgroundImage: `
      repeating-linear-gradient(126deg, transparent 0px, transparent 9px, ${textureTone} 9px, ${textureTone} 10px),
      repeating-linear-gradient(36deg, transparent 0px, transparent 14px, rgba(255,255,255,0.24) 14px, rgba(255,255,255,0.24) 15px)
    `,
    transform: state.phase === "entered" ? "translate3d(0,0,0) scale(1)" : isLite ? "translate3d(0,0,0) scale(1.03)" : "translate3d(-2%,1.5%,0) scale(1.08)",
    mixBlendMode: isLite ? "normal" : "overlay",
    transition: `opacity ${Math.max(240, Math.floor(motionDuration * 0.62))}ms ${easing}, transform ${Math.max(260, Math.floor(motionDuration * 0.7))}ms ${easing}`,
  };

  const haloStyle: React.CSSProperties = {
    position: "absolute",
    inset: "-24%",
    background: `radial-gradient(circle at ${glowOrigin}, ${toRgba(softTint, 0.3)} 0%, ${toRgba(softTint, 0.11)} 30%, rgba(255,255,255,0) 60%)`,
    opacity: state.phase === "exiting" ? (isLite ? 0.34 : 0.5) : isLite ? 0.58 : 0.84,
    transform: state.phase === "entered" ? "scale(1)" : isLite ? "scale(1.08)" : "scale(1.16)",
    transition: `opacity ${Math.max(240, Math.floor(motionDuration * 0.64))}ms ${easing}, transform ${Math.max(260, Math.floor(motionDuration * 0.72))}ms ${easing}`,
    willChange: "opacity, transform",
  };

  const mistStyle: React.CSSProperties = {
    position: "absolute",
    inset: "-18%",
    background: `
      radial-gradient(circle at 22% 32%, ${mistTone} 0%, rgba(255,255,255,0) 44%),
      radial-gradient(circle at 80% 66%, ${toRgba(softTint, 0.16)} 0%, rgba(255,255,255,0) 42%)
    `,
    opacity: state.phase === "exiting" ? 0.32 : 0.52,
    transform: state.phase === "entered" ? "scale(1)" : "scale(1.1)",
    transition: `opacity ${Math.max(320, Math.floor(motionDuration * 0.72))}ms ${easing}, transform ${Math.max(320, Math.floor(motionDuration * 0.74))}ms ${easing}`,
    filter: "blur(20px)",
  };

  const frameStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: state.phase === "exiting" ? (isLite ? 0.44 : 0.58) : isLite ? 0.62 : 0.8,
    boxShadow: `inset 0 0 0 1px ${frameTone}, inset 0 58px 120px -68px ${toRgba(softTint, 0.34)}, inset 0 -58px 120px -72px ${toRgba(softTint, 0.3)}`,
    transition: `opacity ${Math.max(220, Math.floor(motionDuration * 0.56))}ms ${easing}`,
  };

  const vignetteStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: state.phase === "exiting" ? (isLite ? 0.42 : 0.72) : isLite ? 0.58 : 0.86,
    background: `
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 50%, ${vignetteTone} 100%),
      linear-gradient(to bottom, rgba(2,6,23,0.32) 0%, rgba(2,6,23,0) 22%, rgba(2,6,23,0) 78%, rgba(2,6,23,0.28) 100%)
    `,
    transition: `opacity ${Math.max(260, Math.floor(motionDuration * 0.62))}ms ${easing}`,
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
      {isLite ? null : <div style={mistStyle} />}
      <div style={frameStyle} />
      <div style={vignetteStyle} />
    </div>
  );
});

TransitionWipe.displayName = "TransitionWipe";

export default TransitionWipe;
