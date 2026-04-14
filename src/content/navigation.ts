import { defineRoute } from "./define";
import { NavigationItem } from "./types";

const BLOG_ROUTE_BASE = "/blog";
const PROJECT_ROUTE_BASE = "/projects";
const blogArticleRoutePattern = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const projectCaseStudyRoutePattern = /^\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const canonicalizeRoutePath = (rawPath: string): string => {
  const trimmed = rawPath.trim();
  if (!trimmed) return "/";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const singleSlashes = withLeadingSlash.replace(/\/{2,}/g, "/");

  if (singleSlashes === "/") return "/";
  return singleSlashes.replace(/\/+$/, "");
};

export const isBlogArticlePath = (path: string): boolean => blogArticleRoutePattern.test(canonicalizeRoutePath(path));
export const isProjectCaseStudyPath = (path: string): boolean =>
  projectCaseStudyRoutePattern.test(canonicalizeRoutePath(path));

export const getBlogPostSlugFromPath = (path: string): string | null => {
  const normalized = canonicalizeRoutePath(path);
  if (!isBlogArticlePath(normalized)) return null;
  return normalized.slice(`${BLOG_ROUTE_BASE}/`.length);
};

export const getBlogPostPath = (slug: string): string => canonicalizeRoutePath(`${BLOG_ROUTE_BASE}/${slug}`);

export const getProjectSlugFromPath = (path: string): string | null => {
  const normalized = canonicalizeRoutePath(path);
  if (!isProjectCaseStudyPath(normalized)) return null;
  return normalized.slice(`${PROJECT_ROUTE_BASE}/`.length);
};

export const getProjectPath = (slug: string): string => canonicalizeRoutePath(`${PROJECT_ROUTE_BASE}/${slug}`);

export const getNavigationMatchPath = (path: string): string => {
  const normalized = canonicalizeRoutePath(path);
  if (isBlogArticlePath(normalized)) {
    return BLOG_ROUTE_BASE;
  }

  if (isProjectCaseStudyPath(normalized)) {
    return PROJECT_ROUTE_BASE;
  }

  return normalized;
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
    id: "blog",
    label: "Research Blog",
    color: "#da08ff",
    path: "/blog",
    description: "Essays, notes, and experiments.",
  }),
  defineRoute({
    id: "contact",
    label: "Connect",
    color: "#08c5ff",
    path: "/contact",
    description: "Ways to contact and follow.",
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

export const isRouteEnabled = (path: string): boolean => {
  const normalized = canonicalizeRoutePath(path);
  if (enabledRouteSet.has(normalized)) {
    return true;
  }

  if (isBlogArticlePath(normalized)) {
    return enabledRouteSet.has(BLOG_ROUTE_BASE);
  }

  if (isProjectCaseStudyPath(normalized)) {
    return enabledRouteSet.has(PROJECT_ROUTE_BASE);
  }

  return false;
};
