import { defineBlogPage } from "./define";
import { BlogPageContent, BlogPostEntry } from "./types";

// EDIT HERE: blog page copy and blog metadata.
export const blogPageContent: BlogPageContent = defineBlogPage({
  eyebrow: "Blog",
  title: "Research Notes",
  summary:
    "A place for future writing on computational neuroscience, machine learning systems, and engineering work.",
  emptyLabel: "No published posts yet.",
});

export const allBlogPosts: BlogPostEntry[] = [];

export const blogPosts = allBlogPosts.filter((post) => post.status === "published");
