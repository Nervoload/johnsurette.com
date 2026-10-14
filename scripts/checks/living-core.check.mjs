import { createLoopClock, resolveStage } from "../../src/components/LandingStory/visuals/living/core/loopClock.ts";
import { fovForBleed, mulberry32 } from "../../src/components/LandingStory/visuals/living/core/math.ts";

export default () => {
  const out = [];
  const stages = [
    { id: "a", duration: 2 },
    { id: "b", duration: 3 },
    { id: "c", duration: 1 },
  ];

  const mid = resolveStage(stages, 6, 3.5);
  out.push(["stage resolves inside a loop", mid.stageIndex === 1 && Math.abs(mid.stageT - 0.5) < 1e-9, JSON.stringify(mid)]);
  const wrapped = resolveStage(stages, 6, 13.0);
  out.push(["phase wraps across loops", wrapped.loopIndex === 2 && wrapped.stageIndex === 0 && Math.abs(wrapped.stageT - 0.5) < 1e-9]);
  const edge = resolveStage(stages, 6, 2.0);
  out.push(["stage boundary goes to the next stage", edge.stageIndex === 1 && edge.stageT === 0]);

  const clock = createLoopClock(stages, { slowScale: 0.25, lambda: 4 });
  for (let i = 0; i < 60; i += 1) clock.tick(1 / 60, { engaged: true, paused: false, autoAdvance: true });
  out.push(["engaged slows to within 5% of 0.25× in 1 s", Math.abs(clock.state.timeScale - 0.25) < 0.25 * 0.05 + 0.02, clock.state.timeScale.toFixed(3)]);
  for (let i = 0; i < 60; i += 1) clock.tick(1 / 60, { engaged: false, paused: false, autoAdvance: true });
  out.push(["released speeds back up toward 1×", clock.state.timeScale > 0.9, clock.state.timeScale.toFixed(3)]);

  const before = clock.state.phase;
  clock.tick(1 / 60, { engaged: false, paused: true, autoAdvance: true });
  out.push(["pause stops time completely", clock.state.phase === before && clock.state.dt === 0]);
  clock.tick(10, { engaged: false, paused: false, autoAdvance: true });
  out.push(["long frame gaps are clamped", clock.state.phase - before <= 1 / 20 + 1e-9]);

  const epoch = clock.state.epoch;
  clock.seek(4.2);
  out.push(["seek is exact and bumps the epoch", clock.state.phase === 4.2 && clock.state.stageIndex === 1 && clock.state.epoch === epoch + 1]);
  clock.tick(1 / 60, { engaged: false, paused: false, autoAdvance: false });
  out.push(["no auto-advance holds the phase (reduced motion)", clock.state.phase === 4.2]);

  const a = mulberry32(7);
  const b = mulberry32(7);
  out.push(["seeded rng is deterministic", a() === b() && a() === b()]);

  const fov = fovForBleed(36, 800, 800);
  out.push(["bleed fov is unchanged without bleed", Math.abs(fov - 36) < 1e-9]);
  const wide = fovForBleed(36, 800, 1100);
  const ratio = Math.tan((wide * Math.PI) / 360) / Math.tan((36 * Math.PI) / 360);
  out.push(["bleed fov keeps the slot framing", Math.abs(ratio - 1100 / 800) < 1e-9]);
  return out;
};
