import { backgroundEffectRegistry } from "../components/LandingComponents/backgroundEffects/backgroundEffectRegistry";
import { centerpieceRegistry } from "../components/LandingComponents/centerpieces/centerpieceRegistry";
import {
  BlogPostEntry,
  ContactPageContent,
  LandingConclusionContent,
  LandingOriginLabContent,
  LandingStoryEntry,
  NavigationItem,
  PageVisuals,
  ProjectEntry,
  SiteMeta,
  TimelineEntry,
} from "./types";
import { canonicalizeRoutePath, internalNavigationPaths } from "./navigation";

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(`[content] ${message}`);
  }
};

const assertUnique = <T>(items: T[], key: (item: T) => string, label: string) => {
  const seen = new Set<string>();
  for (const item of items) {
    const value = key(item);
    assert(!seen.has(value), `Duplicate ${label}: ${value}`);
    seen.add(value);
  }
};

const assertNonEmpty = (label: string, value: string) => {
  assert(value.trim().length > 0, `${label} must not be empty.`);
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const assertInternalPath = (path: string, validPaths: Set<string>, label: string) => {
  const normalized = canonicalizeRoutePath(path);
  assert(validPaths.has(normalized), `${label} references unknown internal path: ${path}`);
};

export interface ValidateContentInput {
  siteMeta: SiteMeta;
  navigationItems: NavigationItem[];
  projects: ProjectEntry[];
  blogPosts: BlogPostEntry[];
  landingStory: LandingStoryEntry[];
  landingOriginLabContent: LandingOriginLabContent;
  landingConclusionContent: LandingConclusionContent;
  timelineEntries: TimelineEntry[];
  contactPageContent: ContactPageContent;
  pageVisuals: PageVisuals;
}

export const validateContent = ({
  siteMeta,
  navigationItems,
  projects,
  blogPosts,
  landingStory,
  landingOriginLabContent,
  landingConclusionContent,
  timelineEntries,
  contactPageContent,
  pageVisuals,
}: ValidateContentInput) => {
  assertNonEmpty("siteMeta.ownerName", siteMeta.ownerName);
  assertNonEmpty("siteMeta.ownerEmail", siteMeta.ownerEmail);
  assertNonEmpty("siteMeta.footerTagline", siteMeta.footerTagline);

  assertUnique(navigationItems, (item) => item.id, "navigation id");
  assertUnique(navigationItems, (item) => canonicalizeRoutePath(item.path), "navigation path");
  navigationItems.forEach((item) => {
    assertNonEmpty(`navigation.${item.id}.label`, item.label);
    assertNonEmpty(`navigation.${item.id}.path`, item.path);
  });

  const validInternalPaths = new Set([
    ...navigationItems.map((item) => canonicalizeRoutePath(item.path)),
    ...internalNavigationPaths.map((path) => canonicalizeRoutePath(path)),
  ]);

  assertUnique(projects, (item) => item.id, "project id");
  projects.forEach((project) => {
    assertNonEmpty(`project.${project.id}.title`, project.title);
    assert(project.media.length > 0, `project.${project.id} must include at least one media item.`);
    project.links.forEach((link, index) => {
      assertNonEmpty(`project.${project.id}.links[${index}].label`, link.label);
      assertNonEmpty(`project.${project.id}.links[${index}].href`, link.href);
      if (link.href.startsWith("/")) {
        assertInternalPath(link.href, validInternalPaths, `project.${project.id}.links[${index}]`);
      }
    });
  });

  assertUnique(blogPosts, (item) => item.id, "blog id");
  assertUnique(blogPosts, (item) => item.slug, "blog slug");
  blogPosts.forEach((post) => {
    assert(slugPattern.test(post.slug), `blog.${post.id}.slug must be URL-safe.`);
    assertNonEmpty(`blog.${post.id}.title`, post.title);
  });

  assertUnique(landingStory, (item) => item.id, "landing story id");
  landingStory.forEach((section) => {
    assert(section.focusAreas.length > 0, `landing.${section.id} must include at least one focus area.`);
  });

  assertNonEmpty("landingOriginLabContent.ctaPath", landingOriginLabContent.ctaPath);
  assertInternalPath(landingOriginLabContent.ctaPath, validInternalPaths, "landingOriginLabContent.ctaPath");
  assertNonEmpty("landingConclusionContent.title", landingConclusionContent.title);

  assertUnique(timelineEntries, (item) => item.id, "timeline id");
  timelineEntries.forEach((entry) => {
    assertUnique(entry.nowActions, (action) => action.label, `timeline.${entry.id} action label`);
    entry.nowActions.forEach((action, index) => {
      assertInternalPath(action.path, validInternalPaths, `timeline.${entry.id}.nowActions[${index}]`);
    });
  });

  assertUnique(contactPageContent.socialPosts, (item) => item.id, "social post id");
  contactPageContent.socialPosts.forEach((post) => {
    assertNonEmpty(`contact.socialPosts.${post.id}.title`, post.title);
  });

  assert(pageVisuals.landing.centerpieceId !== undefined, "pageVisuals.landing.centerpieceId is required.");
  assert(pageVisuals.landing.backdropEffectId !== undefined, "pageVisuals.landing.backdropEffectId is required.");
  assert(pageVisuals.projects.backdropEffectId !== undefined, "pageVisuals.projects.backdropEffectId is required.");

  if (pageVisuals.landing.centerpieceId) {
    assert(
      pageVisuals.landing.centerpieceId in centerpieceRegistry,
      `Unknown centerpiece id: ${pageVisuals.landing.centerpieceId}`,
    );
  }

  [pageVisuals.landing, pageVisuals.projects].forEach((config, index) => {
    if (config.backdropEffectId) {
      assert(
        config.backdropEffectId in backgroundEffectRegistry,
        `Unknown background effect id in visual config ${index}: ${config.backdropEffectId}`,
      );
    }
  });
};
