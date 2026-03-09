import { blogPosts as publishedBlogPosts } from "../../content";
import type { BlogPostEntry } from "../../content";

export type BlogPostSeed = BlogPostEntry;
export const blogPosts: BlogPostSeed[] = publishedBlogPosts;
