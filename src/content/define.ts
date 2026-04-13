import {
  AboutPageContent,
  BlogAccentLight,
  BlogPageContent,
  BlogPostEntry,
  BlogVisualIdentity,
  ContactPageContent,
  LandingAspirationSectionContent,
  LandingAspirationOverlayBeat,
  LandingBiologySectionContent,
  LandingConclusionContent,
  LandingComputationalSectionContent,
  LandingHeroIdentityContent,
  LandingOriginLabContent,
  LandingPersonalIntroductionContent,
  LandingStoryPoster,
  LandingSectionLink,
  LandingStoryEntry,
  NavigationItem,
  PageVisualConfig,
  ProjectCaseStudyBlock,
  ProjectCaseStudyMedia,
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

const defineProjectCaseStudyMedia = (input: ProjectCaseStudyMedia): ProjectCaseStudyMedia => ({
  ...input,
  src: trim(input.src),
  alt: trim(input.alt),
  kind: input.kind ?? "image",
  poster: input.poster?.trim(),
  aspectRatio: input.aspectRatio?.trim(),
  fit: input.fit ?? "cover",
});

const defineProjectCaseStudyBlock = (input: ProjectCaseStudyBlock): ProjectCaseStudyBlock => {
  if (input.type === "text") {
    return {
      ...input,
      id: trim(input.id),
      header: trim(input.header),
      body: normalizeStringArray(input.body),
    };
  }

  return {
    ...input,
    id: trim(input.id),
    media: defineProjectCaseStudyMedia(input.media),
    captionTitle: input.captionTitle?.trim(),
    caption: input.caption?.trim(),
  };
};

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
    navVisible: input.navVisible ?? true,
    routeEnabled: input.routeEnabled ?? true,
  };
};

export const defineProject = (input: ProjectEntry): ProjectEntry => {
  assertNonEmpty(`project.${input.id}.id`, input.id);
  assertNonEmpty(`project.${input.id}.slug`, input.slug);
  assertNonEmpty(`project.${input.id}.title`, input.title);
  assertNonEmpty(`project.${input.id}.subtitle`, input.subtitle);
  assertNonEmpty(`project.${input.id}.summary`, input.summary);
  assertNonEmpty(`project.${input.id}.details`, input.details);
  assertNonEmpty(`project.${input.id}.role`, input.role);
  assertNonEmpty(`project.${input.id}.year`, input.year);
  assertNonEmpty(`project.${input.id}.accent`, input.accent);

  return {
    ...input,
    id: trim(input.id),
    slug: trim(input.slug),
    title: trim(input.title),
    subtitle: trim(input.subtitle),
    summary: trim(input.summary),
    details: trim(input.details),
    role: trim(input.role),
    year: trim(input.year),
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
    hero: {
      ...input.hero,
      eyebrow: trim(input.hero.eyebrow),
      thesis: trim(input.hero.thesis),
      summary: trim(input.hero.summary),
      media: defineProjectCaseStudyMedia(input.hero.media),
    },
    metrics: (input.metrics ?? []).map((metric) => ({
      label: trim(metric.label),
      value: trim(metric.value),
      detail: trim(metric.detail),
    })),
    chapters: (input.chapters ?? []).map((chapter) => ({
      ...chapter,
      id: trim(chapter.id),
      eyebrow: trim(chapter.eyebrow),
      title: trim(chapter.title),
      body: normalizeStringArray(chapter.body),
      aside: chapter.aside?.trim(),
    })),
    gallery: (input.gallery ?? []).map((asset) => ({
      ...asset,
      id: trim(asset.id),
      src: trim(asset.src),
      alt: trim(asset.alt),
    })),
    captions: (input.captions ?? []).map((caption) => ({
      ...caption,
      assetId: trim(caption.assetId),
      title: trim(caption.title),
      body: trim(caption.body),
    })),
    outcomes: (input.outcomes ?? []).map((outcome) => ({
      ...outcome,
      label: trim(outcome.label),
      value: trim(outcome.value),
      detail: trim(outcome.detail),
    })),
    credits: (input.credits ?? []).map((credit) => ({
      ...credit,
      label: trim(credit.label),
      value: trim(credit.value),
    })),
    caseStudyRows: (input.caseStudyRows ?? []).map((row) => ({
      ...row,
      id: trim(row.id),
      blocks: (row.blocks ?? []).map(defineProjectCaseStudyBlock),
    })),
    nextProject: input.nextProject?.trim(),
  };
};

export const defineBlogPost = (input: BlogPostEntry): BlogPostEntry => {
  assertNonEmpty(`blog.${input.id}.id`, input.id);
  assertNonEmpty(`blog.${input.id}.slug`, input.slug);
  assertNonEmpty(`blog.${input.id}.title`, input.title);
  assertNonEmpty(`blog.${input.id}.tag`, input.tag);
  assertNonEmpty(`blog.${input.id}.summary`, input.summary);
  assertNonEmpty(`blog.${input.id}.hook`, input.hook);
  assertNonEmpty(`blog.${input.id}.coverImage.src`, input.coverImage.src);
  assertNonEmpty(`blog.${input.id}.coverImage.alt`, input.coverImage.alt);
  assertNonEmpty(`blog.${input.id}.dateLabel`, input.dateLabel);
  assertNonEmpty(`blog.${input.id}.publishedAt`, input.publishedAt);
  assertNonEmpty(`blog.${input.id}.visualIdentity.palette.background`, input.visualIdentity.palette.background);
  assertNonEmpty(`blog.${input.id}.visualIdentity.palette.surface`, input.visualIdentity.palette.surface);
  assertNonEmpty(`blog.${input.id}.visualIdentity.palette.accent`, input.visualIdentity.palette.accent);
  assertNonEmpty(`blog.${input.id}.visualIdentity.palette.highlight`, input.visualIdentity.palette.highlight);
  assertNonEmpty(`blog.${input.id}.visualIdentity.palette.text`, input.visualIdentity.palette.text);
  assertNonEmpty(`blog.${input.id}.visualIdentity.accentLight.color`, input.visualIdentity.accentLight.color);

  return {
    ...input,
    id: trim(input.id),
    slug: trim(input.slug),
    title: trim(input.title),
    tag: trim(input.tag),
    summary: trim(input.summary),
    hook: trim(input.hook),
    coverImage: {
      src: trim(input.coverImage.src),
      alt: trim(input.coverImage.alt),
    },
    intro: normalizeStringArray(input.intro),
    articleSections: (input.articleSections ?? []).map((section) => ({
      ...section,
      id: trim(section.id),
      eyebrow: section.eyebrow?.trim(),
      title: trim(section.title),
      paragraphs: normalizeStringArray(section.paragraphs),
    })),
    dateLabel: trim(input.dateLabel),
    publishedAt: trim(input.publishedAt),
    featured: input.featured ?? false,
    visualIdentity: defineBlogVisualIdentity(input.visualIdentity),
  };
};

export const defineBlogAccentLight = (input: BlogAccentLight): BlogAccentLight => ({
  ...input,
  color: trim(input.color),
});

export const defineBlogVisualIdentity = (input: BlogVisualIdentity): BlogVisualIdentity => ({
  ...input,
  palette: {
    background: trim(input.palette.background),
    surface: trim(input.palette.surface),
    accent: trim(input.palette.accent),
    highlight: trim(input.palette.highlight),
    text: trim(input.palette.text),
  },
  material: input.material,
  grain: input.grain,
  accentLight: defineBlogAccentLight(input.accentLight),
  articleTheme: input.articleTheme,
  sceneId: input.sceneId,
});

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
  isVisible: input.isVisible ?? true,
});

export const defineLandingHeroIdentity = (input: LandingHeroIdentityContent): LandingHeroIdentityContent => ({
  ...input,
  kicker: trim(input.kicker),
  firstName: trim(input.firstName),
  lastName: trim(input.lastName),
  domainSuffix: trim(input.domainSuffix),
});

export const defineLandingSectionLink = (input: LandingSectionLink): LandingSectionLink => ({
  ...input,
  label: trim(input.label),
  path: trim(input.path),
});

export const defineLandingStoryPoster = (input: LandingStoryPoster): LandingStoryPoster => ({
  ...input,
  src: trim(input.src),
  alt: trim(input.alt),
});

export const defineLandingPersonalIntroduction = (
  input: LandingPersonalIntroductionContent,
): LandingPersonalIntroductionContent => ({
  ...input,
  title: trim(input.title),
  subtitle: trim(input.subtitle),
  body: normalizeStringArray(input.body),
  photos: (input.photos ?? []).map((photo) => ({
    ...photo,
    id: trim(photo.id),
    src: photo.src ? trim(photo.src) : undefined,
    alt: trim(photo.alt),
    caption: trim(photo.caption),
    palette: photo.palette,
  })),
});

export const defineLandingComputationalSection = (
  input: LandingComputationalSectionContent,
): LandingComputationalSectionContent => ({
  ...input,
  title: trim(input.title),
  quote: trim(input.quote),
  body: trim(input.body),
  cta: defineLandingSectionLink(input.cta),
  poster: defineLandingStoryPoster(input.poster),
});

export const defineLandingBiologySection = (
  input: LandingBiologySectionContent,
): LandingBiologySectionContent => ({
  ...input,
  overlayTitle: trim(input.overlayTitle),
  overlayBody: trim(input.overlayBody),
  body: trim(input.body),
  cta: defineLandingSectionLink(input.cta),
  poster: defineLandingStoryPoster(input.poster),
});

export const defineLandingAspirationSection = (
  input: LandingAspirationSectionContent,
): LandingAspirationSectionContent => ({
  ...input,
  title: trim(input.title),
  body: trim(input.body),
  footerTitle: trim(input.footerTitle),
  footerBody: trim(input.footerBody),
  overlayBeats: (input.overlayBeats ?? []).map(
    (beat): LandingAspirationOverlayBeat => ({
      ...beat,
      text: trim(beat.text),
    }),
  ),
  nodes: (input.nodes ?? []).map((node) => ({
    ...node,
    id: trim(node.id),
    label: trim(node.label),
  })),
  edges: (input.edges ?? []).map((edge) => ({
    ...edge,
    from: trim(edge.from),
    to: trim(edge.to),
  })),
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
