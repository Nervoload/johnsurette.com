import { SelectionContextReport, SelectionContextSavePaths } from "./types";

export const saveSelectionContextReport = async (
  report: SelectionContextReport,
): Promise<SelectionContextSavePaths> => {
  const response = await fetch("/__codex-context/frame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    throw new Error(`Failed to save selection context (${response.status})`);
  }

  return (await response.json()) as SelectionContextSavePaths;
};
