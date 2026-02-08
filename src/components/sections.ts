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

export const routeSet = new Set(siteRoutes.map((route) => route.path));

export const normalizeRoute = (path: string): string => {
  if (routeSet.has(path)) {
    return path;
  }
  return "/";
};
