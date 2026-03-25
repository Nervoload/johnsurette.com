import { aboutPageContent, timelineEntries } from "./about";
import { allBlogPosts, blogPageContent, blogPosts, getBlogPostBySlug } from "./blog";
import { contactPageContent } from "./contact";
import {
  landingAspirationSectionContent,
  landingBiologySectionContent,
  landingComputationalSectionContent,
  landingConclusionContent,
  landingHeroIdentityContent,
  landingOriginLabContent,
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
  internalNavigationPaths,
  isBlogArticlePath,
  isRouteEnabled,
  navigationItems,
  visibleNavigationItems,
} from "./navigation";
import { projects, projectsPageContent } from "./projects";
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
  landingOriginLabContent,
  landingConclusionContent,
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
  internalNavigationPaths,
  isBlogArticlePath,
  isRouteEnabled,
  landingAspirationSectionContent,
  landingBiologySectionContent,
  landingConclusionContent,
  landingComputationalSectionContent,
  landingHeroIdentityContent,
  landingOriginLabContent,
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
