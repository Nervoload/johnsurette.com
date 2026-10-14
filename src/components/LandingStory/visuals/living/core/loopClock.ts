// The loop clock owns scene time. Scenes never read the renderer clock (R3F resets it whenever the
// frameloop changes); they read `clock.state`, which only moves forward by `dtWall * timeScale`.

import { clamp, damp } from "./math.ts";

export interface StageSpec {
  readonly id: string;
  /** Seconds at 1x speed. */
  readonly duration: number;
}

export interface ClockState {
  /** Unbounded scene time in seconds. */
  phase: number;
  /** Seconds of scene time advanced by the latest tick (0 when paused or frozen). */
  dt: number;
  timeScale: number;
  stageIndex: number;
  /** 0..1 progress through the current stage. */
  stageT: number;
  loopIndex: number;
  /** 0..1 progress through the current loop. */
  loopT: number;
  /** Increments on every seek, so scenes know to rebuild history-dependent state. */
  epoch: number;
}

export interface ClockInput {
  engaged: boolean;
  paused: boolean;
  /** When false (reduced motion or frozen), time only moves through seek(). */
  autoAdvance: boolean;
}

export interface LoopClock {
  readonly stages: readonly StageSpec[];
  readonly total: number;
  readonly state: ClockState;
  tick(dtWall: number, input: ClockInput): ClockState;
  seek(phase: number): ClockState;
  stageStart(index: number): number;
}

export interface LoopClockOptions {
  /** Speed while someone is interacting. */
  slowScale?: number;
  /** Responsiveness of the speed change (1/s). 4 reaches ~95% in 0.75 s. */
  lambda?: number;
  /** Clamp for wall-clock frame gaps (tab switches, long tasks). */
  maxDt?: number;
}

export const resolveStage = (
  stages: readonly StageSpec[],
  total: number,
  phase: number,
): Pick<ClockState, "stageIndex" | "stageT" | "loopIndex" | "loopT"> => {
  const loopIndex = Math.floor(phase / total);
  let local = phase - loopIndex * total;
  for (let index = 0; index < stages.length; index += 1) {
    const duration = stages[index].duration;
    if (local < duration || index === stages.length - 1) {
      return {
        stageIndex: index,
        stageT: clamp(local / duration),
        loopIndex,
        loopT: clamp((phase - loopIndex * total) / total),
      };
    }
    local -= duration;
  }
  return { stageIndex: 0, stageT: 0, loopIndex, loopT: 0 };
};

export const createLoopClock = (stages: readonly StageSpec[], options: LoopClockOptions = {}): LoopClock => {
  if (stages.length === 0) throw new Error("createLoopClock needs at least one stage");
  const slowScale = options.slowScale ?? 0.25;
  const lambda = options.lambda ?? 4;
  const maxDt = options.maxDt ?? 1 / 20;
  const total = stages.reduce((sum, stage) => sum + stage.duration, 0);

  const state: ClockState = {
    phase: 0,
    dt: 0,
    timeScale: 1,
    epoch: 0,
    ...resolveStage(stages, total, 0),
  };

  const apply = (phase: number): ClockState => {
    state.phase = phase;
    Object.assign(state, resolveStage(stages, total, phase));
    return state;
  };

  return {
    stages,
    total,
    state,
    tick(dtWall, input) {
      const dt = clamp(dtWall, 0, maxDt);
      if (input.paused || !input.autoAdvance) {
        state.timeScale = 0;
        state.dt = 0;
        return state;
      }
      const target = input.engaged ? slowScale : 1;
      // Resume from a pause at the slow speed, then ease up, rather than jumping.
      state.timeScale = damp(state.timeScale === 0 ? slowScale : state.timeScale, target, lambda, dt);
      state.dt = dt * state.timeScale;
      return apply(state.phase + state.dt);
    },
    seek(phase) {
      state.epoch += 1;
      state.dt = 0;
      return apply(Math.max(0, phase));
    },
    stageStart(index) {
      let start = 0;
      for (let i = 0; i < index && i < stages.length; i += 1) start += stages[i].duration;
      return start;
    },
  };
};
