import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BlogPostEntry } from "../../content";
import { ResolvedThemeMode } from "../theme/themeMode";
import { getResearchLayoutIds, getResearchThemeStyle } from "./researchVisuals";

interface ResearchArchiveCardProps {
  post: BlogPostEntry;
  themeMode: ResolvedThemeMode;
  expanded: boolean;
  hovered: boolean;
  onHoverStart: (postId: string) => void;
  onHoverEnd: (postId: string) => void;
  onFocusStart: (postId: string) => void;
  onFocusEnd: (postId: string) => void;
  onToggleExpand: (postId: string) => void;
  onOpenArticle: (post: BlogPostEntry) => void;
}

const overlayTransition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1] as const,
};

const detailTransition = {
  type: "spring",
  stiffness: 260,
  damping: 32,
  mass: 0.78,
} as const;

const ResearchArchiveCard: React.FC<ResearchArchiveCardProps> = ({
  post,
  themeMode,
  expanded,
  hovered,
  onHoverStart,
  onHoverEnd,
  onFocusStart,
  onFocusEnd,
  onToggleExpand,
  onOpenArticle,
}) => {
  const clickTimerRef = useRef<number | null>(null);
  const layoutIds = getResearchLayoutIds(post.id);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const queueExpand = () => {
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

    onOpenArticle(post);
  };

  const handlePrimaryAction = () => {
    if (expanded) {
      handleOpenArticle();
      return;
    }

    queueExpand();
  };

  return (
    <motion.article
      className={`research-archive-card ${expanded ? "is-expanded" : "is-collapsed"} ${hovered ? "is-hovered" : ""}`}
      style={getResearchThemeStyle(post, themeMode)}
      role="button"
      tabIndex={0}
      aria-label={`${post.title} research article preview`}
      aria-expanded={expanded}
      onClick={handlePrimaryAction}
      onDoubleClick={handleOpenArticle}
      onPointerEnter={() => onHoverStart(post.id)}
      onPointerLeave={() => onHoverEnd(post.id)}
      onFocus={(event) => {
        const previous = event.relatedTarget as Node | null;
        if (previous && event.currentTarget.contains(previous)) return;
        onFocusStart(post.id);
      }}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && event.currentTarget.contains(next)) return;
        onFocusEnd(post.id);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handlePrimaryAction();
        }
      }}
      transition={detailTransition}
    >
      <motion.div layoutId={layoutIds.shell} className="research-card-shell" transition={detailTransition}>
        <motion.div layoutId={layoutIds.media} className="research-card-media" transition={detailTransition}>
          <img src={post.coverImage.src} alt={post.coverImage.alt} className="research-card-media-image" loading="lazy" />
        </motion.div>

        {!expanded ? (
          <motion.div className="research-card-content" transition={detailTransition}>
            <div className="research-card-badge" aria-hidden={hovered}>
              <span>{post.tag}</span>
              <span aria-hidden="true"> / </span>
              <span>{post.dateLabel}</span>
            </div>

            <AnimatePresence initial={false}>
              {hovered ? (
                <motion.div
                  key="overlay-copy"
                  className="research-card-overlay-copy"
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.985, y: -4 }}
                  transition={overlayTransition}
                  style={{ transformOrigin: "left top" }}
                >
                  <p className="research-card-meta">
                    {post.tag}
                    <span aria-hidden="true"> / </span>
                    {post.dateLabel}
                  </p>
                  <h2 className="research-card-title">{post.title}</h2>
                  <p className="research-card-hook">{post.hook}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: -4 }}
              transition={overlayTransition}
              className="research-card-expanded-content"
              style={{ transformOrigin: "left top" }}
            >
              <motion.p layoutId={layoutIds.meta} className="research-card-meta">
                {post.tag}
                <span aria-hidden="true"> / </span>
                {post.dateLabel}
              </motion.p>
              <motion.h2 layoutId={layoutIds.title} className="research-card-title">
                {post.title}
              </motion.h2>
              <motion.p layoutId={layoutIds.hook} className="research-card-hook">
                {post.hook}
              </motion.p>

              <div className="research-card-expanded-copy">
                <p className="research-card-preview">{post.intro[0] ?? post.summary}</p>
                <button
                  type="button"
                  className="research-card-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenArticle();
                  }}
                >
                  Read Full Article
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  );
};

export default ResearchArchiveCard;
