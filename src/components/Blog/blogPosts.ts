import { blogPosts as publishedBlogPosts, getBlogPostBySlug, getBlogPostPath } from "../../content";
import type { BlogPostEntry } from "../../content";

export type BlogPostSeed = BlogPostEntry;
export const blogPosts: BlogPostSeed[] = publishedBlogPosts;
export { getBlogPostBySlug, getBlogPostPath };
