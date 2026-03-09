import { aboutPageContent, timelineEntries } from "./about";
import { allBlogPosts, blogPageContent, blogPosts } from "./blog";
import { contactPageContent } from "./contact";
import {
  landingConclusionContent,
  landingOriginLabContent,
  landingStory,
  landingStoryTransitions,
} from "./landing";
import { canonicalizeRoutePath, internalNavigationPaths, navigationItems } from "./navigation";
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
  contactPageContent,
  internalNavigationPaths,
  landingConclusionContent,
  landingOriginLabContent,
  landingStory,
  landingStoryTransitions,
  navigationItems,
  pageVisuals,
  projects,
  projectsPageContent,
  siteMeta,
  timelineEntries,
};

export * from "./types";
