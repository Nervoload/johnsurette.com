import { defineRoute } from "./define";
import { NavigationItem } from "./types";

export const canonicalizeRoutePath = (rawPath: string): string => {
  const trimmed = rawPath.trim();
  if (!trimmed) return "/";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const singleSlashes = withLeadingSlash.replace(/\/{2,}/g, "/");

  if (singleSlashes === "/") return "/";
  return singleSlashes.replace(/\/+$/, "");
};

export const internalNavigationPaths = ["/origin"] as const;
export const disabledInternalNavigationPaths = ["/origin"] as const;

// EDIT HERE: update the public site navigation and route metadata.
export const navigationItems = [
  defineRoute({
    id: "overview",
    label: "Overview",
    color: "#ff085a",
    path: "/",
    description: "Landing overview and introduction.",
  }),
  defineRoute({
    id: "projects",
    label: "My Projects",
    color: "#ffd608",
    path: "/projects",
    description: "Project cards and deep dives.",
  }),
  defineRoute({
    id: "about",
    label: "My Story",
    color: "#08ff94",
    path: "/about",
    description: "Personal timeline and milestones.",
    navVisible: false,
    routeEnabled: false,
  }),
  defineRoute({
    id: "contact",
    label: "Connect",
    color: "#08c5ff",
    path: "/contact",
    description: "Ways to contact and follow.",
  }),
  defineRoute({
    id: "blog",
    label: "Research Blog",
    color: "#da08ff",
    path: "/blog",
    description: "Essays, notes, and experiments.",
  }),
] satisfies NavigationItem[];

const disabledInternalRouteSet = new Set(disabledInternalNavigationPaths.map((path) => canonicalizeRoutePath(path)));

export const enabledNavigationItems = navigationItems.filter((item) => item.routeEnabled !== false);
export const visibleNavigationItems = enabledNavigationItems.filter((item) => item.navVisible !== false);
export const enabledInternalNavigationPaths = internalNavigationPaths.filter(
  (path) => !disabledInternalRouteSet.has(canonicalizeRoutePath(path)),
);

const enabledRouteSet = new Set([
  ...enabledNavigationItems.map((item) => canonicalizeRoutePath(item.path)),
  ...enabledInternalNavigationPaths.map((path) => canonicalizeRoutePath(path)),
]);

export const isRouteEnabled = (path: string): boolean => enabledRouteSet.has(canonicalizeRoutePath(path));
