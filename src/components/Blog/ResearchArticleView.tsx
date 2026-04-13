import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BlogPostEntry } from "../../content";
import { ResolvedThemeMode } from "../theme/themeMode";
import ResearchAmbientScene from "./ResearchAmbientScene";
import { getResearchLayoutIds, getResearchThemeStyle } from "./researchVisuals";

interface ResearchArticleViewProps {
  post: BlogPostEntry;
  themeMode: ResolvedThemeMode;
  onBack: () => void;
}

const ResearchArticleView: React.FC<ResearchArticleViewProps> = ({ post, themeMode, onBack }) => {
  const layoutIds = getResearchLayoutIds(post.id);
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <article
      className={`research-article-page is-${post.visualIdentity.articleTheme}`}
      style={getResearchThemeStyle(post, themeMode)}
    >
      <section className="research-article-stage">
        <ResearchAmbientScene post={post} reducedMotion={prefersReducedMotion} />

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
          className="research-article-stage-inner"
        >
          <button type="button" onClick={onBack} className="research-article-back">
            Back To Research Blog
          </button>

          <motion.div layoutId={layoutIds.shell} className="research-article-hero-shell">
            <div className="research-article-hero-grid">
              <motion.div layoutId={layoutIds.media} className="research-article-hero-media">
                <img src={post.coverImage.src} alt={post.coverImage.alt} className="research-article-hero-image" loading="eager" />
              </motion.div>

              <div className="research-article-hero-copy">
                <motion.p layoutId={layoutIds.meta} className="research-article-meta">
                  {post.tag}
                  <span aria-hidden="true"> / </span>
                  {post.dateLabel}
                </motion.p>
                <motion.h1 layoutId={layoutIds.title} className="research-article-title">
                  {post.title}
                </motion.h1>
                <motion.p layoutId={layoutIds.hook} className="research-article-hook">
                  {post.hook}
                </motion.p>
                <p className="research-article-summary">{post.summary}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="research-article-body">
        <div className="research-article-layout">
          <div className="research-article-reading">
            <section className="research-article-section research-article-intro">
              {post.intro.map((paragraph) => (
                <p key={paragraph} className="research-article-paragraph">
                  {paragraph}
                </p>
              ))}
            </section>

            <aside className="research-article-callout">
              <p className="research-article-callout-label">Reading Note</p>
              <p className="research-article-callout-body">{post.hook}</p>
            </aside>

            {post.articleSections.map((section, index) => (
              <section key={section.id} id={section.id} className="research-article-section scroll-mt-28">
                <div className="research-article-divider" aria-hidden="true" />
                {section.eyebrow ? <p className="research-article-section-eyebrow">{section.eyebrow}</p> : null}
                <h2 className="research-article-section-title">{section.title}</h2>
                <div className="research-article-section-copy">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="research-article-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {index === 0 ? (
                  <figure className="research-article-figure">
                    <div className="research-article-figure-frame" />
                    <figcaption className="research-article-figure-caption">
                      Figure-ready placeholder frame for future diagrams, code captures, or experimental visuals.
                    </figcaption>
                  </figure>
                ) : null}
              </section>
            ))}
          </div>

          <aside className="research-article-outline">
            <p className="research-article-outline-label">Article Map</p>
            <ol className="research-article-outline-list">
              {post.articleSections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="research-article-outline-item">
                    <span className="research-article-outline-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </article>
  );
};

export default ResearchArticleView;
