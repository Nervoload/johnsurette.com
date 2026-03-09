import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_THEME_PREFERENCE,
  isThemePreference,
  ResolvedThemeMode,
  THEME_PREFERENCE_STORAGE_KEY,
  ThemePreference,
} from "./themeMode";

interface ThemeModeRuntime {
  preference: ThemePreference;
  resolvedMode: ResolvedThemeMode;
  setPreference: (next: ThemePreference) => void;
  toggleTheme: () => void;
}

const resolveSystemMode = (): ResolvedThemeMode => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const readStoredPreference = (): ThemePreference => {
  if (typeof window === "undefined") return DEFAULT_THEME_PREFERENCE;
  const value = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
  return isThemePreference(value) ? value : DEFAULT_THEME_PREFERENCE;
};

export const useThemeMode = (): ThemeModeRuntime => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStoredPreference());
  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(() => resolveSystemMode());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference);
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") return;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent): void => {
      setSystemMode(event.matches ? "dark" : "light");
    };

    setSystemMode(mediaQuery.matches ? "dark" : "light");

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [preference]);

  const resolvedMode = useMemo<ResolvedThemeMode>(
    () => (preference === "system" ? systemMode : preference),
    [preference, systemMode],
  );

  const setPreference = useCallback((next: ThemePreference): void => {
    setPreferenceState(next);
  }, []);

  const toggleTheme = useCallback((): void => {
    setPreferenceState((prev) => {
      const currentResolved: ResolvedThemeMode = prev === "system" ? systemMode : prev;
      return currentResolved === "dark" ? "light" : "dark";
    });
  }, [systemMode]);

  return {
    preference,
    resolvedMode,
    setPreference,
    toggleTheme,
  };
};

