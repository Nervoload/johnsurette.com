// DEV-only control surface for deterministic screenshots and checks:
//   window.__living.seek("forwardPass", 7.25); await window.__living.whenRendered("forwardPass");
// and the query form ?living=freeze&scene=forwardPass&t=7.25 applied at mount.

export interface LivingDebugEntry {
  seek(phase: number): void;
  freeze(on: boolean): void;
  frames(): number;
  whenRendered(): Promise<void>;
  state(): Record<string, unknown>;
}

interface LivingDebugApi {
  list(): string[];
  seek(id: string, phase: number): void;
  freeze(id: string, on: boolean): void;
  frames(id: string): number;
  whenRendered(id: string): Promise<void>;
  state(id: string): Record<string, unknown> | undefined;
}

const registry = new Map<string, LivingDebugEntry>();

const install = () => {
  const target = window as Window & { __living?: LivingDebugApi };
  if (target.__living) return;
  target.__living = {
    list: () => [...registry.keys()],
    seek: (id, phase) => registry.get(id)?.seek(phase),
    freeze: (id, on) => registry.get(id)?.freeze(on),
    frames: (id) => registry.get(id)?.frames() ?? -1,
    whenRendered: (id) => registry.get(id)?.whenRendered() ?? Promise.resolve(),
    state: (id) => registry.get(id)?.state(),
  };
};

export const registerLivingDebug = (id: string, entry: LivingDebugEntry): (() => void) => {
  if (!import.meta.env.DEV || typeof window === "undefined") return () => undefined;
  install();
  registry.set(id, entry);
  return () => {
    if (registry.get(id) === entry) registry.delete(id);
  };
};

export const readLivingQuery = (id: string): { freeze: boolean; phase: number | null } => {
  if (!import.meta.env.DEV || typeof window === "undefined") return { freeze: false, phase: null };
  const params = new URLSearchParams(window.location.search);
  const scene = params.get("scene");
  if (scene && scene !== id) return { freeze: false, phase: null };
  const t = params.get("t");
  const phase = t === null ? null : Number(t);
  return { freeze: params.get("living") === "freeze", phase: Number.isFinite(phase) ? phase : null };
};
