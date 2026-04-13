import { backgroundEffectRegistry } from "../components/LandingComponents/backgroundEffects/backgroundEffectRegistry";
import { centerpieceRegistry } from "../components/LandingComponents/centerpieces/centerpieceRegistry";
import {
  BlogPostEntry,
  ContactPageContent,
  LandingAspirationSectionContent,
  LandingBiologySectionContent,
  LandingConclusionContent,
  LandingComputationalSectionContent,
  LandingHeroIdentityContent,
  LandingOriginLabContent,
  LandingPersonalIntroductionContent,
  LandingStoryEntry,
  NavigationItem,
  PageVisuals,
  ProjectEntry,
  SiteMeta,
  TimelineEntry,
} from "./types";
import { canonicalizeRoutePath, getProjectPath, internalNavigationPaths } from "./navigation";

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
  landingPersonalIntroductionContent: LandingPersonalIntroductionContent;
  landingComputationalSectionContent: LandingComputationalSectionContent;
  landingBiologySectionContent: LandingBiologySectionContent;
  landingAspirationSectionContent: LandingAspirationSectionContent;
  landingHeroIdentityContent: LandingHeroIdentityContent;
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
  landingPersonalIntroductionContent,
  landingComputationalSectionContent,
  landingBiologySectionContent,
  landingAspirationSectionContent,
  landingHeroIdentityContent,
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
    ...projects.map((project) => canonicalizeRoutePath(getProjectPath(project.slug))),
    ...blogPosts.map((post) => canonicalizeRoutePath(`/blog/${post.slug}`)),
  ]);

  assertUnique(projects, (item) => item.id, "project id");
  assertUnique(projects, (item) => item.slug, "project slug");
  projects.forEach((project) => {
    assert(slugPattern.test(project.slug), `project.${project.id}.slug must be URL-safe.`);
    assertNonEmpty(`project.${project.id}.title`, project.title);
    assert(project.media.length > 0, `project.${project.id} must include at least one media item.`);
    assertNonEmpty(`project.${project.id}.hero.media.src`, project.hero.media.src);
    assertNonEmpty(`project.${project.id}.hero.media.alt`, project.hero.media.alt);
    assert(project.metrics.length > 0, `project.${project.id} must include at least one metric.`);
    assert(project.chapters.length > 0, `project.${project.id} must include at least one chapter.`);
    assert(project.gallery.length > 0, `project.${project.id} must include at least one gallery asset.`);
    assert(project.captions.length > 0, `project.${project.id} must include at least one caption.`);
    assert(project.outcomes.length > 0, `project.${project.id} must include at least one outcome.`);
    assert(project.credits.length > 0, `project.${project.id} must include at least one credit.`);
    assert(project.caseStudyRows.length > 0, `project.${project.id} must include at least one caseStudyRows entry.`);
    assertUnique(project.gallery, (asset) => asset.id, `project.${project.id} gallery asset id`);
    assertUnique(project.captions, (caption) => caption.assetId, `project.${project.id} caption asset id`);
    assertUnique(project.caseStudyRows, (row) => row.id, `project.${project.id} case study row id`);

    const galleryAssetIds = new Set(project.gallery.map((asset) => asset.id));
    project.captions.forEach((caption, index) => {
      assert(
        galleryAssetIds.has(caption.assetId),
        `project.${project.id}.captions[${index}] references unknown gallery asset ${caption.assetId}`,
      );
    });

    project.caseStudyRows.forEach((row, rowIndex) => {
      assert(
        row.blocks.length > 0 && row.blocks.length <= 2,
        `project.${project.id}.caseStudyRows[${rowIndex}] must contain one or two blocks.`,
      );

      row.blocks.forEach((block, blockIndex) => {
        assertNonEmpty(
          `project.${project.id}.caseStudyRows[${rowIndex}].blocks[${blockIndex}].id`,
          block.id,
        );

        if (block.type === "text") {
          assertNonEmpty(
            `project.${project.id}.caseStudyRows[${rowIndex}].blocks[${blockIndex}].header`,
            block.header,
          );
          assert(
            block.body.length > 0,
            `project.${project.id}.caseStudyRows[${rowIndex}].blocks[${blockIndex}] must include body copy.`,
          );
          return;
        }

        assertNonEmpty(
          `project.${project.id}.caseStudyRows[${rowIndex}].blocks[${blockIndex}].media.src`,
          block.media.src,
        );
        assertNonEmpty(
          `project.${project.id}.caseStudyRows[${rowIndex}].blocks[${blockIndex}].media.alt`,
          block.media.alt,
        );
      });
    });

    project.links.forEach((link, index) => {
      assertNonEmpty(`project.${project.id}.links[${index}].label`, link.label);
      assertNonEmpty(`project.${project.id}.links[${index}].href`, link.href);
      if (link.href.startsWith("/")) {
        assertInternalPath(link.href, validInternalPaths, `project.${project.id}.links[${index}]`);
      }
    });
  });

  const projectSlugSet = new Set(projects.map((project) => project.slug));
  projects.forEach((project) => {
    if (!project.nextProject) return;
    assert(
      project.nextProject !== project.slug,
      `project.${project.id}.nextProject must reference a different project slug.`,
    );
    assert(
      projectSlugSet.has(project.nextProject),
      `project.${project.id}.nextProject references unknown project slug ${project.nextProject}`,
    );
  });

  assertUnique(blogPosts, (item) => item.id, "blog id");
  assertUnique(blogPosts, (item) => item.slug, "blog slug");
  blogPosts.forEach((post) => {
    assert(slugPattern.test(post.slug), `blog.${post.id}.slug must be URL-safe.`);
    assertNonEmpty(`blog.${post.id}.title`, post.title);
    assertNonEmpty(`blog.${post.id}.hook`, post.hook);
    assertNonEmpty(`blog.${post.id}.visualIdentity.palette.background`, post.visualIdentity.palette.background);
    assertNonEmpty(`blog.${post.id}.visualIdentity.palette.surface`, post.visualIdentity.palette.surface);
    assertNonEmpty(`blog.${post.id}.visualIdentity.palette.accent`, post.visualIdentity.palette.accent);
    assertNonEmpty(`blog.${post.id}.visualIdentity.palette.highlight`, post.visualIdentity.palette.highlight);
    assertNonEmpty(`blog.${post.id}.visualIdentity.palette.text`, post.visualIdentity.palette.text);
    assertNonEmpty(`blog.${post.id}.visualIdentity.accentLight.color`, post.visualIdentity.accentLight.color);
    assert(post.intro.length > 0, `blog.${post.id}.intro must include at least one paragraph.`);
    assert(post.articleSections.length > 0, `blog.${post.id}.articleSections must include at least one section.`);
    post.articleSections.forEach((section, index) => {
      assertNonEmpty(`blog.${post.id}.articleSections[${index}].id`, section.id);
      assertNonEmpty(`blog.${post.id}.articleSections[${index}].title`, section.title);
      assert(
        section.paragraphs.length > 0,
        `blog.${post.id}.articleSections[${index}] must include at least one paragraph.`,
      );
    });
  });

  assertUnique(landingStory, (item) => item.id, "landing story id");
  landingStory.forEach((section) => {
    assert(section.focusAreas.length > 0, `landing.${section.id} must include at least one focus area.`);
  });

  assertNonEmpty("landingPersonalIntroductionContent.title", landingPersonalIntroductionContent.title);
  assertNonEmpty("landingPersonalIntroductionContent.subtitle", landingPersonalIntroductionContent.subtitle);
  assert(landingPersonalIntroductionContent.body.length >= 2, "landingPersonalIntroductionContent.body should include two paragraphs.");
  assertUnique(landingPersonalIntroductionContent.photos, (item) => item.id, "landing photo id");

  assertNonEmpty("landingComputationalSectionContent.title", landingComputationalSectionContent.title);
  assertInternalPath(
    landingComputationalSectionContent.cta.path,
    validInternalPaths,
    "landingComputationalSectionContent.cta.path",
  );

  assertNonEmpty("landingBiologySectionContent.overlayTitle", landingBiologySectionContent.overlayTitle);
  assertInternalPath(
    landingBiologySectionContent.cta.path,
    validInternalPaths,
    "landingBiologySectionContent.cta.path",
  );

  assertNonEmpty("landingAspirationSectionContent.footerTitle", landingAspirationSectionContent.footerTitle);
  assertUnique(landingAspirationSectionContent.overlayBeats, (item) => item.id, "landing aspiration overlay beat id");
  landingAspirationSectionContent.overlayBeats.forEach((beat) => {
    assertNonEmpty(`landingAspirationSectionContent.overlayBeats.${beat.id}.text`, beat.text);
  });
  assertUnique(landingAspirationSectionContent.nodes, (item) => item.id, "landing aspiration node id");
  const aspirationNodeIds = new Set(landingAspirationSectionContent.nodes.map((node) => node.id));
  landingAspirationSectionContent.edges.forEach((edge, index) => {
    assert(aspirationNodeIds.has(edge.from), `landing aspiration edge ${index} references unknown from node ${edge.from}`);
    assert(aspirationNodeIds.has(edge.to), `landing aspiration edge ${index} references unknown to node ${edge.to}`);
  });

  assertNonEmpty("landingHeroIdentityContent.kicker", landingHeroIdentityContent.kicker);
  assertNonEmpty("landingHeroIdentityContent.firstName", landingHeroIdentityContent.firstName);
  assertNonEmpty("landingHeroIdentityContent.lastName", landingHeroIdentityContent.lastName);
  assertNonEmpty("landingHeroIdentityContent.domainSuffix", landingHeroIdentityContent.domainSuffix);
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
