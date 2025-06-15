// src/components/Transitions/TransitionWipe.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useLayoutEffect,
} from "react";

export type WipeOptions = {
  color?: string;
  direction?: "left" | "right" | "up" | "down";
  duration?: number; // ms
};

export type TransitionHandle = {
  start: (opts?: WipeOptions) => Promise<void>;
  done: () => void;
};

const BASE_DURATION = 500;

type State =
  | { phase: "idle" }
  | { phase: "entering"; opts: Required<WipeOptions>; resolve: () => void }
  | { phase: "entered"; opts: Required<WipeOptions> }
  | { phase: "exiting"; opts: Required<WipeOptions> };

const TransitionWipe = forwardRef<TransitionHandle>((_, ref) => {
  const [state, setState] = useState<State>({ phase: "idle" });

  const defaultOpts = (o?: WipeOptions): Required<WipeOptions> => ({
    color: o?.color ?? "#fff",
    direction: o?.direction ?? "right",
    duration: o?.duration ?? BASE_DURATION,
  });

  // Expose start() and done()
  useImperativeHandle(ref, () => ({
    start(opts) {
      return new Promise<void>((resolve) => {
        setState({ phase: "entering", opts: defaultOpts(opts), resolve });
      });
    },
    done() {
      if (state.phase === "entered") {
        setState({ phase: "exiting", opts: state.opts });
      }
    },
  }), [state]);

  // Once mounted as "entering", kick into "entered" so CSS transition fires
  useLayoutEffect(() => {
    if (state.phase === "entering") {
      // next tick, animate on-screen
      requestAnimationFrame(() => {
        setState({ phase: "entered", opts: state.opts });
      });
    }
  }, [state.phase]);

  if (state.phase === "idle") return null;

  const { color, direction, duration } = state.opts;

  // Map direction → off-screen transform
  const offscreen =
    direction === "left"
      ? "-translate-x-full"
      : direction === "right"
      ? "translate-x-full"
      : direction === "up"
      ? "-translate-y-full"
      : "translate-y-full";

  // Determine transform + transition classes
  let transformClass: string;
  let transitionClass: string;
  if (state.phase === "entering") {
    // mount off-screen, no transition
    transformClass = offscreen;
    transitionClass = "";
  } else if (state.phase === "entered") {
    // animate on-screen
    transformClass = "translate-x-0 translate-y-0";
    transitionClass = `transition-transform duration-[${duration}ms] ease-out`;
  } else {
    // exiting: animate off-screen again
    transformClass = offscreen;
    transitionClass = `transition-transform duration-[${duration}ms] ease-out`;
  }

  const style: React.CSSProperties = {
    backgroundColor: color,
    transitionDuration: `${duration}ms`,
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] will-change-transform transform
        ${transitionClass} ${transformClass}`}
      style={style}
      onTransitionEnd={() => {
        if (state.phase === "entered") {
          state.resolve();              // covered → resolve promise
        }
        if (state.phase === "exiting") {
          setState({ phase: "idle" });  // done exiting → unmount
        }
      }}
    />
  );
});

export default TransitionWipe;
