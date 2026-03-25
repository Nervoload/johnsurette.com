import type { CSSProperties } from "react";
import type { BlogPostEntry } from "../../content";

export const getResearchLayoutIds = (postId: string) => ({
  shell: `research-shell-${postId}`,
  media: `research-media-${postId}`,
  meta: `research-meta-${postId}`,
  title: `research-title-${postId}`,
  hook: `research-hook-${postId}`,
});

export const getResearchThemeStyle = (post: BlogPostEntry): CSSProperties =>
  ({
    "--research-bg": post.visualIdentity.palette.background,
    "--research-surface": post.visualIdentity.palette.surface,
    "--research-accent": post.visualIdentity.palette.accent,
    "--research-highlight": post.visualIdentity.palette.highlight,
    "--research-text": post.visualIdentity.palette.text,
    "--research-light-color": post.visualIdentity.accentLight.color,
    "--research-light-x": `${post.visualIdentity.accentLight.x}%`,
    "--research-light-y": `${post.visualIdentity.accentLight.y}%`,
    "--research-light-blur": `${post.visualIdentity.accentLight.blur}px`,
    "--research-light-opacity": post.visualIdentity.accentLight.opacity,
  }) as CSSProperties;
