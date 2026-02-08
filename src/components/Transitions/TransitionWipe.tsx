import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

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

const BASE_DURATION = 450;

const defaultOptions = (opts?: WipeOptions): Required<WipeOptions> => ({
  color: opts?.color ?? "#ffffff",
  direction: opts?.direction ?? "right",
  duration: opts?.duration ?? BASE_DURATION,
});

const transformFromDirection = (direction: Required<WipeOptions>["direction"]): string => {
  if (direction === "left") return "translate3d(-100%,0,0)";
  if (direction === "right") return "translate3d(100%,0,0)";
  if (direction === "up") return "translate3d(0,-100%,0)";
  return "translate3d(0,100%,0)";
};

const TransitionWipe = forwardRef<TransitionHandle>((_, ref) => {
  const [state, setState] = useState<WipeState>({
    phase: "idle",
    opts: defaultOptions(),
  });
  const resolveRef = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    start(opts?: WipeOptions) {
      return new Promise<void>((resolve) => {
        resolveRef.current = resolve;
        setState({ phase: "entering", opts: defaultOptions(opts) });
      });
    },
    done() {
      setState((prev) => {
        if (prev.phase !== "entered") return prev;
        return { ...prev, phase: "exiting" };
      });
    },
  }));

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

  const offscreen = transformFromDirection(state.opts.direction);

  const style: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    backgroundColor: state.opts.color,
    willChange: "transform",
    transform: state.phase === "entered" ? "translate3d(0,0,0)" : offscreen,
    transition: state.phase === "entering" ? "none" : `transform ${state.opts.duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
  };

  return (
    <div
      style={style}
      onTransitionEnd={(event) => {
        if (event.propertyName !== "transform") return;

        if (state.phase === "entered") {
          resolveRef.current?.();
          resolveRef.current = null;
        } else if (state.phase === "exiting") {
          setState((prev) => ({ ...prev, phase: "idle" }));
        }
      }}
    />
  );
});

TransitionWipe.displayName = "TransitionWipe";

export default TransitionWipe;
