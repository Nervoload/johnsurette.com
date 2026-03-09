import {
  AboutPageContent,
  BlogPageContent,
  BlogPostEntry,
  ContactPageContent,
  LandingConclusionContent,
  LandingOriginLabContent,
  LandingStoryEntry,
  NavigationItem,
  PageVisualConfig,
  ProjectEntry,
  SiteMeta,
  TimelineEntry,
} from "./types";

const trim = (value: string) => value.trim();

const assertNonEmpty = (label: string, value: string) => {
  if (!trim(value)) {
    throw new Error(`[content] ${label} must be a non-empty string.`);
  }
};

const normalizeStringArray = (value?: string[]) => (value ?? []).map((item) => item.trim()).filter(Boolean);

export const defineSiteMeta = (input: SiteMeta): SiteMeta => {
  assertNonEmpty("siteMeta.ownerName", input.ownerName);
  assertNonEmpty("siteMeta.ownerEmail", input.ownerEmail);
  assertNonEmpty("siteMeta.footerTagline", input.footerTagline);

  return {
    ...input,
    ownerName: trim(input.ownerName),
    ownerEmail: trim(input.ownerEmail),
    footerTagline: trim(input.footerTagline),
    socialLinks: (input.socialLinks ?? []).map((link) => ({
      label: trim(link.label),
      href: trim(link.href),
    })),
  };
};

export const defineRoute = (input: NavigationItem): NavigationItem => {
  assertNonEmpty("navigation.id", input.id);
  assertNonEmpty("navigation.label", input.label);
  assertNonEmpty("navigation.path", input.path);
  assertNonEmpty("navigation.color", input.color);
  assertNonEmpty("navigation.description", input.description);

  return {
    ...input,
    id: trim(input.id),
    label: trim(input.label),
    path: trim(input.path),
    color: trim(input.color),
    description: trim(input.description),
  };
};

export const defineProject = (input: ProjectEntry): ProjectEntry => {
  assertNonEmpty(`project.${input.id}.id`, input.id);
  assertNonEmpty(`project.${input.id}.title`, input.title);
  assertNonEmpty(`project.${input.id}.subtitle`, input.subtitle);
  assertNonEmpty(`project.${input.id}.summary`, input.summary);
  assertNonEmpty(`project.${input.id}.details`, input.details);
  assertNonEmpty(`project.${input.id}.accent`, input.accent);

  return {
    ...input,
    id: trim(input.id),
    title: trim(input.title),
    subtitle: trim(input.subtitle),
    summary: trim(input.summary),
    details: trim(input.details),
    accent: trim(input.accent),
    tags: normalizeStringArray(input.tags),
    media: normalizeStringArray(input.media),
    links: (input.links ?? []).map((link) => ({
      label: trim(link.label),
      href: trim(link.href),
    })),
    front: {
      ...input.front,
      dateLabel: input.front.dateLabel?.trim(),
      iconSvg: input.front.iconSvg?.trim(),
    },
  };
};

export const defineBlogPost = (input: BlogPostEntry): BlogPostEntry => {
  assertNonEmpty(`blog.${input.id}.id`, input.id);
  assertNonEmpty(`blog.${input.id}.slug`, input.slug);
  assertNonEmpty(`blog.${input.id}.title`, input.title);
  assertNonEmpty(`blog.${input.id}.tag`, input.tag);
  assertNonEmpty(`blog.${input.id}.summary`, input.summary);
  assertNonEmpty(`blog.${input.id}.dateLabel`, input.dateLabel);
  assertNonEmpty(`blog.${input.id}.publishedAt`, input.publishedAt);

  return {
    ...input,
    id: trim(input.id),
    slug: trim(input.slug),
    title: trim(input.title),
    tag: trim(input.tag),
    summary: trim(input.summary),
    dateLabel: trim(input.dateLabel),
    publishedAt: trim(input.publishedAt),
    featured: input.featured ?? false,
  };
};

export const defineStorySection = (input: LandingStoryEntry): LandingStoryEntry => {
  assertNonEmpty(`landing.${input.id}.eyebrow`, input.eyebrow);
  assertNonEmpty(`landing.${input.id}.title`, input.title);
  assertNonEmpty(`landing.${input.id}.summary`, input.summary);

  return {
    ...input,
    eyebrow: trim(input.eyebrow),
    title: trim(input.title),
    summary: trim(input.summary),
    focusAreas: normalizeStringArray(input.focusAreas),
  };
};

export const defineTimelineScene = (input: TimelineEntry): TimelineEntry => {
  assertNonEmpty(`timeline.${input.id}.id`, input.id);
  assertNonEmpty(`timeline.${input.id}.year`, input.year);
  assertNonEmpty(`timeline.${input.id}.title`, input.title);
  assertNonEmpty(`timeline.${input.id}.summary`, input.summary);

  return {
    ...input,
    id: trim(input.id),
    year: trim(input.year),
    title: trim(input.title),
    summary: trim(input.summary),
    nowActions: (input.nowActions ?? []).map((action) => ({
      label: trim(action.label),
      path: trim(action.path),
    })),
  };
};

export const defineAboutPage = (input: AboutPageContent): AboutPageContent => ({
  ...input,
  eyebrow: trim(input.eyebrow),
  title: trim(input.title),
  summary: trim(input.summary),
  highlights: normalizeStringArray(input.highlights),
});

export const defineBlogPage = (input: BlogPageContent): BlogPageContent => ({
  ...input,
  eyebrow: trim(input.eyebrow),
  title: trim(input.title),
  summary: trim(input.summary),
  emptyLabel: trim(input.emptyLabel),
});

export const defineOriginLabContent = (input: LandingOriginLabContent): LandingOriginLabContent => ({
  ...input,
  eyebrow: trim(input.eyebrow),
  title: trim(input.title),
  summary: trim(input.summary),
  ctaLabel: trim(input.ctaLabel),
  ctaPath: trim(input.ctaPath),
});

export const defineLandingConclusion = (input: LandingConclusionContent): LandingConclusionContent => ({
  ...input,
  eyebrow: trim(input.eyebrow),
  title: trim(input.title),
  summary: trim(input.summary),
  highlightedProjectsLabel: trim(input.highlightedProjectsLabel),
  highlightedPostsLabel: trim(input.highlightedPostsLabel),
  routePillsLabel: trim(input.routePillsLabel),
});

export const defineContactPage = (input: ContactPageContent): ContactPageContent => ({
  ...input,
  eyebrow: trim(input.eyebrow),
  title: trim(input.title),
  summary: trim(input.summary),
  contactLabel: trim(input.contactLabel),
  copyButtonLabel: trim(input.copyButtonLabel),
  copySuccessLabel: trim(input.copySuccessLabel),
  copyErrorLabel: trim(input.copyErrorLabel),
  contactDescription: trim(input.contactDescription),
  availabilityEyebrow: trim(input.availabilityEyebrow),
  availabilityTitle: trim(input.availabilityTitle),
  availabilitySummary: trim(input.availabilitySummary),
  responseWindowLabel: trim(input.responseWindowLabel),
  timezoneLabel: trim(input.timezoneLabel),
  preferredContactLabel: trim(input.preferredContactLabel),
  socialFeedEyebrow: trim(input.socialFeedEyebrow),
  socialFeedTitle: trim(input.socialFeedTitle),
  socialFeedSummary: trim(input.socialFeedSummary),
  socialPosts: (input.socialPosts ?? []).map((post) => ({
    ...post,
    id: trim(post.id),
    platform: trim(post.platform),
    handle: trim(post.handle),
    publishedLabel: trim(post.publishedLabel),
    title: trim(post.title),
    excerpt: trim(post.excerpt),
    href: trim(post.href),
    accentClassName: trim(post.accentClassName),
    github: post.github
      ? {
          username: trim(post.github.username),
          profileUrl: trim(post.github.profileUrl),
        }
      : undefined,
  })),
});

export const definePageVisual = (input: PageVisualConfig): PageVisualConfig => ({
  ...input,
  backgroundClassName: input.backgroundClassName?.trim(),
  footerBackgroundColor: input.footerBackgroundColor?.trim(),
  backdropClassName: input.backdropClassName?.trim(),
  backdropOverlayClassName: input.backdropOverlayClassName?.trim(),
});
