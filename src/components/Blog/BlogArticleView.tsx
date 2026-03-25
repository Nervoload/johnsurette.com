import React from "react";
import { motion } from "framer-motion";
import type { BlogPostEntry } from "../../content";

interface BlogArticleViewProps {
  post: BlogPostEntry;
  onBack: () => void;
}

const BlogArticleView: React.FC<BlogArticleViewProps> = ({ post, onBack }) => {
  return (
    <article className="theme-text-primary relative mx-auto w-full max-w-5xl px-6 pb-28 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      >
        <button type="button" onClick={onBack} className="theme-pill-button rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition">
          Back To Research Blog
        </button>

        <div className="mt-7 blog-article-hero overflow-hidden rounded-[2.4rem] border">
          <img src={post.coverImage.src} alt={post.coverImage.alt} className="h-full w-full object-cover" loading="eager" />
        </div>

        <header className="mt-10 max-w-3xl">
          <p className="blog-article-meta">
            {post.tag}
            <span aria-hidden="true"> / </span>
            {post.dateLabel}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
          <p className="theme-text-muted mt-5 text-lg leading-relaxed">{post.summary}</p>
          <p className="blog-article-hook mt-6 text-xl leading-relaxed">{post.hook}</p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="space-y-8">
            <section className="blog-article-panel">
              {post.intro.map((paragraph) => (
                <p key={paragraph} className="blog-article-paragraph">
                  {paragraph}
                </p>
              ))}
            </section>

            {post.articleSections.map((section) => (
              <section key={section.id} id={section.id} className="blog-article-panel scroll-mt-28">
                {section.eyebrow ? <p className="blog-article-section-eyebrow">{section.eyebrow}</p> : null}
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{section.title}</h2>
                <div className="mt-5 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="blog-article-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="blog-article-sidebar lg:sticky lg:top-28">
            <p className="blog-article-section-eyebrow">Article Map</p>
            <ol className="mt-4 space-y-3">
              {post.articleSections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="blog-article-outline-item">
                    <span className="blog-article-outline-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </motion.div>
    </article>
  );
};

export default BlogArticleView;
