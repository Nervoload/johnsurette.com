import React, { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BlogPostEntry } from "../../content";
import type { BlogCardDetailLevel } from "./blogCardState";

interface BlogPostCardProps {
  post: BlogPostEntry;
  detailLevel: BlogCardDetailLevel;
  layoutIndex: number;
  isHero?: boolean;
  isHovered?: boolean;
  motionVector?: {
    x: number;
    y: number;
    rotate: number;
  };
  onHoverStart: (postId: string) => void;
  onHoverEnd: (postId: string) => void;
  onFocusStart: (postId: string) => void;
  onFocusEnd: (postId: string) => void;
  onToggleExpand: (postId: string) => void;
  onOpenArticle: (slug: string) => void;
}

const contentSwapTransition = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1] as const,
};

const detailRevealTransition = {
  duration: 0.26,
  ease: [0.18, 1, 0.24, 1] as const,
};

const contentSwapIn = {
  opacity: 0,
  scale: 0.72,
  y: 8,
  filter: "blur(10px)",
};

const contentSwapRest = {
  opacity: 1,
  scale: 1,
  y: 0,
  filter: "blur(0px)",
};

const contentSwapOut = {
  opacity: 0,
  scale: 0.95,
  y: -4,
  filter: "blur(6px)",
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  detailLevel,
  layoutIndex,
  isHero = false,
  isHovered = false,
  motionVector = { x: 0, y: 0, rotate: 0 },
  onHoverStart,
  onHoverEnd,
  onFocusStart,
  onFocusEnd,
  onToggleExpand,
  onOpenArticle,
}) => {
  const clickTimerRef = useRef<number | null>(null);
  const imageFirst = useMemo(() => layoutIndex % 2 === 0 || isHero, [isHero, layoutIndex]);
  const previewParagraph = post.intro[0] ?? post.summary;
  const isExpanded = detailLevel === "expanded";
  const isInteractive = !isHero;
  const showHoverOverlay = isInteractive && isHovered && !isExpanded;

  useEffect(() => {
    return () => {
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const queueToggleExpand = () => {
    if (!isInteractive) return;

    if (clickTimerRef.current !== null) {
      window.clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = window.setTimeout(() => {
      onToggleExpand(post.id);
      clickTimerRef.current = null;
    }, 160);
  };

  const handleOpenArticle = () => {
    if (clickTimerRef.current !== null) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    onOpenArticle(post.slug);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggleExpand(post.id);
    }
  };

  return (
    <motion.article
      layout
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? `${post.title} blog post preview` : undefined}
      aria-expanded={isInteractive ? isExpanded : undefined}
      className={`blog-post-card is-${detailLevel} ${isHovered ? "is-hovered" : ""} ${isHero ? "is-hero" : ""}`}
      style={
        {
          "--blog-card-motion-scale": 1,
          "--blog-card-motion-translate-y": "0px",
          "--blog-card-motion-tilt-x": `${Math.max(-3, Math.min(3, motionVector.y * -0.08))}deg`,
          "--blog-card-motion-tilt-y": `${Math.max(-3.6, Math.min(3.6, motionVector.x * 0.12))}deg`,
          "--blog-card-motion-brightness": 1,
        } as React.CSSProperties
      }
      onClick={isInteractive ? queueToggleExpand : undefined}
      onDoubleClick={handleOpenArticle}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      onPointerEnter={isInteractive ? () => onHoverStart(post.id) : undefined}
      onPointerLeave={isInteractive ? () => onHoverEnd(post.id) : undefined}
      onFocus={
        isInteractive
          ? (event) => {
              const previous = event.relatedTarget as Node | null;
              if (previous && event.currentTarget.contains(previous)) return;
              onFocusStart(post.id);
            }
          : undefined
      }
      onBlur={
        isInteractive
          ? (event) => {
              const next = event.relatedTarget as Node | null;
              if (next && event.currentTarget.contains(next)) return;
              onFocusEnd(post.id);
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 240, damping: 30, mass: 0.88 }}
    >
      <div className="blog-post-card-shell">
        <div className="blog-post-card-reflection" aria-hidden />
        <div className="blog-post-card-bubble" aria-hidden />
        <div className="blog-post-card-frame">
          <AnimatePresence initial={false} mode="wait">
            {isExpanded ? (
              <motion.div
                key="detail"
                layout
                initial={contentSwapIn}
                animate={contentSwapRest}
                exit={contentSwapOut}
                transition={contentSwapTransition}
                className={`blog-post-content-grid ${imageFirst ? "is-image-first" : "is-copy-first"} is-expanded`}
                style={{ transformOrigin: imageFirst ? "left top" : "right top" }}
              >
                <motion.div layout="position" className="blog-post-media-panel" transition={contentSwapTransition}>
                  <img src={post.coverImage.src} alt={post.coverImage.alt} className="blog-post-cover h-full w-full object-cover" loading="lazy" />
                </motion.div>

                <motion.div layout="position" className="blog-post-copy-panel" transition={contentSwapTransition}>
                  <motion.div layout="position" transition={contentSwapTransition}>
                    <p className="blog-post-meta">
                      {post.tag}
                      <span aria-hidden="true"> / </span>
                      {post.dateLabel}
                    </p>
                    <h2 className="blog-post-title mt-3">{post.title}</h2>
                  </motion.div>

                  <motion.p
                    layout="position"
                    initial={{ opacity: 0, scale: 0.72, y: 8, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    transition={detailRevealTransition}
                    className="blog-post-hook mt-4"
                    style={{ transformOrigin: "top left" }}
                  >
                    {post.hook}
                  </motion.p>

                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, scale: 0.7, y: 10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ ...detailRevealTransition, delay: 0.03 }}
                    className="mt-5 space-y-5"
                    style={{ transformOrigin: "top left" }}
                  >
                    <p className="blog-post-preview">{previewParagraph}</p>
                    <button
                      type="button"
                      className="theme-pill-button rounded-full border px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] transition"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenArticle();
                      }}
                    >
                      Read Full Article
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                layout
                initial={contentSwapIn}
                animate={contentSwapRest}
                exit={contentSwapOut}
                transition={contentSwapTransition}
                className="relative h-full"
              >
                <div className="blog-post-minimal-media blog-post-collapsed-media">
                  <img src={post.coverImage.src} alt={post.coverImage.alt} className="h-full w-full object-cover" loading="lazy" />
                  <div className="blog-post-collapsed-base" aria-hidden />
                </div>

                <div className="blog-post-minimal-overlay blog-post-collapsed-meta">
                  <p className="blog-post-meta">
                    {post.tag}
                    <span aria-hidden="true"> / </span>
                    {post.dateLabel}
                  </p>
                </div>

                <motion.div
                  initial={false}
                  animate={
                    showHoverOverlay
                      ? { opacity: 1, scale: 1, y: 0 }
                      : { opacity: 0, scale: 0.965, y: -10 }
                  }
                  transition={detailRevealTransition}
                  className="blog-post-collapsed-overlay"
                  style={{
                    transformOrigin: "left top",
                    pointerEvents: "none",
                  }}
                  aria-hidden={!showHoverOverlay}
                >
                  <div className="blog-post-collapsed-gradient" aria-hidden />
                  <div className="blog-post-collapsed-copy">
                    <p className="blog-post-meta">
                      {post.tag}
                      <span aria-hidden="true"> / </span>
                      {post.dateLabel}
                    </p>
                    <h2 className="blog-post-collapsed-title mt-3">{post.title}</h2>
                    <p className="blog-post-collapsed-hook mt-3">{post.hook}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogPostCard;
