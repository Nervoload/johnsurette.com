export interface Section {
  name: string;
  color: string;
  path: string;
  description: string;
}

/** Single source of truth for landing slices + navigation. */
export const sections: Section[] = [
  {
    name: "Overview",
    color: "#ff085a",
    path: "/",
    description: "Landing overview and introduction.",
  },
  {
    name: "My Projects",
    color: "#ffd608",
    path: "/projects",
    description: "Project cards and deep dives.",
  },
  {
    name: "My Story",
    color: "#08ff94",
    path: "/about",
    description: "Personal timeline and milestones.",
  },
  {
    name: "Connect",
    color: "#08c5ff",
    path: "/contact",
    description: "Ways to contact and follow.",
  },
  {
    name: "Research Blog",
    color: "#da08ff",
    path: "/blog",
    description: "Essays, notes, and experiments.",
  },
];

export interface SiteRoute {
  label: string;
  path: string;
  color: string;
}

export const siteRoutes: SiteRoute[] = sections.map((section) => ({
  label: section.name,
  path: section.path,
  color: section.color,
}));

const canonicalizeRoutePath = (rawPath: string): string => {
  const trimmed = rawPath.trim();
  if (!trimmed) return "/";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const singleSlashes = withLeadingSlash.replace(/\/{2,}/g, "/");

  if (singleSlashes === "/") {
    return "/";
  }

  return singleSlashes.replace(/\/+$/, "");
};

export const routeSet = new Set(siteRoutes.map((route) => canonicalizeRoutePath(route.path)));

export const normalizeRoute = (path: string): string => {
  const normalized = canonicalizeRoutePath(path);
  if (routeSet.has(normalized)) {
    return normalized;
  }
  return "/";
};
