export type ThemePreference = "system" | "light" | "dark";
export type ResolvedThemeMode = "light" | "dark";

export const THEME_PREFERENCE_STORAGE_KEY = "site_theme_preference";
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export const isThemePreference = (value: string | null | undefined): value is ThemePreference => {
  return value === "system" || value === "light" || value === "dark";
};

