import { RuntimeContextEntrySnapshot, RuntimeSceneEntitySnapshot } from "./types";

const sceneEntities = new Map<string, RuntimeSceneEntitySnapshot>();
const contextEntries = new Map<string, RuntimeContextEntrySnapshot>();

const buildRegistryKey = (pagePath: string, id: string): string => `${pagePath}::${id}`;

export const upsertRuntimeSceneEntity = (entity: RuntimeSceneEntitySnapshot): void => {
  if (!import.meta.env.DEV) return;
  sceneEntities.set(buildRegistryKey(entity.pagePath, entity.id), entity);
};

export const removeRuntimeSceneEntity = (pagePath: string, id: string): void => {
  if (!import.meta.env.DEV) return;
  sceneEntities.delete(buildRegistryKey(pagePath, id));
};

export const upsertRuntimeContextEntry = (entry: RuntimeContextEntrySnapshot): void => {
  if (!import.meta.env.DEV) return;
  contextEntries.set(buildRegistryKey(entry.pagePath, entry.id), entry);
};

export const removeRuntimeContextEntry = (pagePath: string, id: string): void => {
  if (!import.meta.env.DEV) return;
  contextEntries.delete(buildRegistryKey(pagePath, id));
};

export const readRuntimeRegistrySnapshot = (
  pagePath: string,
): {
  sceneEntities: RuntimeSceneEntitySnapshot[];
  runtimeEntries: RuntimeContextEntrySnapshot[];
} => {
  if (!import.meta.env.DEV) {
    return {
      sceneEntities: [],
      runtimeEntries: [],
    };
  }

  return {
    sceneEntities: Array.from(sceneEntities.values()).filter((entry) => entry.pagePath === pagePath),
    runtimeEntries: Array.from(contextEntries.values()).filter((entry) => entry.pagePath === pagePath),
  };
};
