import { CodexProbeDescriptor } from "./types";

type ProbeAttributes = Record<string, string>;

const joinComponentPath = (componentPath?: string[]): string | undefined => {
  if (!componentPath || componentPath.length === 0) return undefined;
  return componentPath.join(" > ");
};

export const createCodexProbeAttributes = (descriptor: CodexProbeDescriptor): ProbeAttributes => {
  if (!import.meta.env.DEV) {
    return {};
  }

  const attrs: ProbeAttributes = {
    "data-codex-probe": "true",
    "data-codex-component": descriptor.componentName,
    "data-codex-file": descriptor.filePath,
  };

  const componentPath = joinComponentPath(descriptor.componentPath);
  if (componentPath) {
    attrs["data-codex-path"] = componentPath;
  }

  if (descriptor.role) {
    attrs["data-codex-role"] = descriptor.role;
  }

  return attrs;
};
