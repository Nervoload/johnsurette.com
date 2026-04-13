import { useEffect, useState } from "react";

const getInitialMatch = (query: string, defaultValue: boolean): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return defaultValue;
  }

  return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string, defaultValue = false): boolean => {
  const [matches, setMatches] = useState<boolean>(() => getInitialMatch(query, defaultValue));

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const syncMatch = (event?: MediaQueryListEvent) => {
      setMatches(event?.matches ?? mediaQuery.matches);
    };

    syncMatch();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", syncMatch);
      return () => mediaQuery.removeEventListener("change", syncMatch);
    }

    mediaQuery.addListener(syncMatch);
    return () => mediaQuery.removeListener(syncMatch);
  }, [query]);

  return matches;
};
