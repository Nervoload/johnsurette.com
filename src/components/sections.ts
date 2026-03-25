import {
  canonicalizeRoutePath,
  enabledInternalNavigationPaths,
  enabledNavigationItems,
  isRouteEnabled,
  visibleNavigationItems,
} from "../content";

export interface Section {
  name: string;
  color: string;
  path: string;
  description: string;
}

/** Single source of truth for landing slices + navigation. */
export const sections: Section[] = visibleNavigationItems.map((item) => ({
  name: item.label,
  color: item.color,
  path: item.path,
  description: item.description,
}));

export interface SiteRoute {
  label: string;
  path: string;
  color: string;
}

export const siteRoutes: SiteRoute[] = visibleNavigationItems.map((item) => ({
  label: item.label,
  path: item.path,
  color: item.color,
}));

export const internalRoutes = [...enabledInternalNavigationPaths] as const;

export const normalizeRoute = (path: string): string => {
  const normalized = canonicalizeRoutePath(path);
  if (isRouteEnabled(normalized)) {
    return normalized;
  }
  return "/";
};
