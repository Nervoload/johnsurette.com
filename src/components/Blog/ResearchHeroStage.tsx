import React, { RefObject } from "react";
import { motion, MotionValue, useReducedMotion, useTransform } from "framer-motion";
import type { BlogPageContent, BlogPostEntry } from "../../content";
import ResearchAmbientScene from "./ResearchAmbientScene";
import { getResearchLayoutIds, getResearchThemeStyle } from "./researchVisuals";

interface ResearchHeroStageProps {
  post: BlogPostEntry;
  pageContent: BlogPageContent;
  postCount: number;
  progress: MotionValue<number>;
  sectionRef: RefObject<HTMLElement>;
  onOpenArticle: (post: BlogPostEntry) => void;
}

const ResearchHeroStage: React.FC<ResearchHeroStageProps> = ({
  post,
  pageContent,
  postCount,
  progress,
  sectionRef,
  onOpenArticle,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const layoutIds = getResearchLayoutIds(post.id);
  const heroOpacity = useTransform(progress, [0, 0.2, 0.58], [1, 1, 0]);
  const heroScale = useTransform(progress, [0, 0.48], [1, 0.965]);
  const heroY = useTransform(progress, [0, 0.48], [0, -32]);
  const eyebrowOpacity = useTransform(progress, [0, 0.34], [1, 0.42]);

  return (
    <section
      ref={sectionRef}
      className="research-hero-section"
      style={getResearchThemeStyle(post)}
    >
      <div className="research-hero-sticky">
        <motion.div
          className="research-hero-stage"
          style={prefersReducedMotion ? undefined : { opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="research-hero-surface">
            <ResearchAmbientScene post={post} reducedMotion={prefersReducedMotion} />
            <div className="research-hero-grid">
              <div className="research-hero-intro">
                <motion.p
                  className="research-hero-page-eyebrow"
                  style={prefersReducedMotion ? undefined : { opacity: eyebrowOpacity }}
                >
                  {pageContent.eyebrow}
                </motion.p>
                <h1 className="research-hero-page-title">{pageContent.title}</h1>
                <p className="research-hero-page-summary">{pageContent.summary}</p>

                <div className="research-hero-marker">
                  <span>Latest Entry</span>
                  <span aria-hidden="true"> / </span>
                  <span>{String(postCount).padStart(2, "0")} Notes</span>
                </div>
              </div>

              <motion.div layoutId={layoutIds.shell} className="research-feature-shell research-hero-feature">
                <div className="research-feature-copy">
                  <motion.p layoutId={layoutIds.meta} className="research-feature-meta">
                    {post.tag}
                    <span aria-hidden="true"> / </span>
                    {post.dateLabel}
                  </motion.p>
                  <motion.h2 layoutId={layoutIds.title} className="research-feature-title">
                    {post.title}
                  </motion.h2>
                  <motion.p layoutId={layoutIds.hook} className="research-feature-hook">
                    {post.hook}
                  </motion.p>
                  <p className="research-feature-summary">{post.summary}</p>
                  <button type="button" className="research-feature-cta" onClick={() => onOpenArticle(post)}>
                    Read Full Article
                  </button>
                </div>

                <motion.div layoutId={layoutIds.media} className="research-feature-media">
                  <img src={post.coverImage.src} alt={post.coverImage.alt} className="research-feature-media-image" loading="eager" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchHeroStage;
