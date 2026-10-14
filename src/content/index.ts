import { aboutPageContent, timelineEntries } from "./about";
import { allBlogPosts, blogPageContent, blogPosts, getBlogPostBySlug } from "./blog";
import { contactPageContent } from "./contact";
import {
  landingAspirationSectionContent,
  landingBiologySectionContent,
  landingComputationalSectionContent,
  landingBrainScalesContent,
  landingConclusionContent,
  landingForwardPassContent,
  landingHeroIdentityContent,
  landingPersonalIntroductionContent,
  landingStory,
  landingStoryTransitions,
} from "./landing";
import {
  canonicalizeRoutePath,
  enabledInternalNavigationPaths,
  enabledNavigationItems,
  getBlogPostPath,
  getBlogPostSlugFromPath,
  getNavigationMatchPath,
  getProjectPath,
  getProjectSlugFromPath,
  internalNavigationPaths,
  isBlogArticlePath,
  isProjectCaseStudyPath,
  isRouteEnabled,
  navigationItems,
  visibleNavigationItems,
} from "./navigation";
import { getProjectBySlug, projects, projectsPageContent } from "./projects";
import { siteMeta } from "./site";
import { pageVisuals } from "./visuals";
import { validateContent } from "./validate";

validateContent({
  siteMeta,
  navigationItems,
  projects,
  blogPosts: allBlogPosts,
  landingStory,
  landingPersonalIntroductionContent,
  landingComputationalSectionContent,
  landingBiologySectionContent,
  landingAspirationSectionContent,
  landingHeroIdentityContent,
  landingConclusionContent,
  landingForwardPassContent,
  landingBrainScalesContent,
  timelineEntries,
  contactPageContent,
  pageVisuals,
});

export {
  aboutPageContent,
  allBlogPosts,
  blogPageContent,
  blogPosts,
  canonicalizeRoutePath,
  enabledInternalNavigationPaths,
  enabledNavigationItems,
  contactPageContent,
  getBlogPostBySlug,
  getBlogPostPath,
  getBlogPostSlugFromPath,
  getNavigationMatchPath,
  getProjectBySlug,
  getProjectPath,
  getProjectSlugFromPath,
  internalNavigationPaths,
  isBlogArticlePath,
  isProjectCaseStudyPath,
  isRouteEnabled,
  landingAspirationSectionContent,
  landingBiologySectionContent,
  landingBrainScalesContent,
  landingConclusionContent,
  landingComputationalSectionContent,
  landingForwardPassContent,
  landingHeroIdentityContent,
  landingPersonalIntroductionContent,
  landingStory,
  landingStoryTransitions,
  navigationItems,
  pageVisuals,
  projects,
  projectsPageContent,
  siteMeta,
  timelineEntries,
  visibleNavigationItems,
};

export * from "./types";
