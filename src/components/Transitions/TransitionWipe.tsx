// src/components/Transitions/TransitionWipe.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useLayoutEffect,
  useRef,
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

type IdleState = { phase: "idle" };
type EnteringState = { phase: "entering"; opts: Required<WipeOptions> };
type EnteredState  = { phase: "entered";  opts: Required<WipeOptions> };
type ExitingState  = { phase: "exiting";  opts: Required<WipeOptions> };

type State = IdleState | EnteringState | EnteredState | ExitingState;

const TransitionWipe = forwardRef<TransitionHandle>((_, ref) => {
  const [state, setState] = useState<State>({ phase: "idle" });
  const resolveRef = useRef<() => void>();

  const defaultOpts = (o?: WipeOptions): Required<WipeOptions> => ({
    color: o?.color ?? "#ffffff",
    direction: o?.direction ?? "right",
    duration: o?.duration ?? BASE_DURATION,
  });

  useImperativeHandle(
    ref,
    () => ({
      start(opts) {
        return new Promise<void>((resolve) => {
          resolveRef.current = resolve;
          setState({
            phase: "entering",
            opts: defaultOpts(opts),
          });
        });
      },
      done() {
        if (state.phase === "entered") {
          setState({ phase: "exiting", opts: state.opts });
        }
      },
    }),
    [state]
  );

  // bump from "entering" → "entered" on next frame
  useLayoutEffect(() => {
    if (state.phase === "entering") {
      requestAnimationFrame(() =>
        setState({ phase: "entered", opts: state.opts })
      );
    }
  }, [state.phase]);

  // don't render anything when idle
  if (state.phase === "idle") {
    return null;
  }

  // from here, phase ∈ {"entering","entered","exiting"} so opts exists
  const { opts } = state;
  const { color, direction, duration } = opts;

  // determine off-screen transform
  const offscreen =
    direction === "left"
      ? "-translate-x-full"
      : direction === "right"
      ? "translate-x-full"
      : direction === "up"
      ? "-translate-y-full"
      : "translate-y-full";

  // build transform + transition classes per phase
  let transformClass: string;
  let transitionClass: string;

  switch (state.phase) {
    case "entering":
      transformClass = offscreen;
      transitionClass = "";
      break;
    case "entered":
      transformClass = "translate-x-0 translate-y-0";
      transitionClass = `transition-transform duration-[${duration}ms] ease-out`;
      break;
    case "exiting":
      transformClass = offscreen;
      transitionClass = `transition-transform duration-[${duration}ms] ease-out`;
      break;
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
          resolveRef.current?.();
        } else if (state.phase === "exiting") {
          setState({ phase: "idle" });
        }
      }}
    />
  );
});

export default TransitionWipe;
