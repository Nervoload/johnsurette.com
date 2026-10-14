import { useSyncExternalStore } from "react";

export interface LivingUiState {
  stageIndex: number;
  paused: boolean;
  ready: boolean;
  failed: boolean;
}

export interface LivingStore {
  get(): LivingUiState;
  set(partial: Partial<LivingUiState>): void;
  subscribe(listener: () => void): () => void;
}

/** A tiny external store: the DOM overlay subscribes, the R3F tree only reads it inside useFrame. */
export const createLivingStore = (initial: LivingUiState): LivingStore => {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(partial) {
      let changed = false;
      for (const key of Object.keys(partial) as Array<keyof LivingUiState>) {
        if (partial[key] !== undefined && partial[key] !== state[key]) changed = true;
      }
      if (!changed) return;
      state = { ...state, ...partial };
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const useLivingStore = <T,>(store: LivingStore, select: (state: LivingUiState) => T): T =>
  useSyncExternalStore(store.subscribe, () => select(store.get()), () => select(store.get()));
