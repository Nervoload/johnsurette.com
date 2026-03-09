import React from "react";
import { blogPageContent, pageVisuals } from "../content";
import PageScaffold from "../components/layout/PageScaffold";
import { blogPosts } from "../components/Blog/blogPosts";

const BlogPage: React.FC = () => {
  return (
    <PageScaffold
      backgroundClassName={pageVisuals.blog.backgroundClassName}
      footerBackgroundColor={pageVisuals.blog.footerBackgroundColor}
    >
      {() => (
        <section className="theme-text-primary relative min-h-[100dvh] w-full pb-24 pt-24">
          <div className="mx-auto w-full max-w-5xl px-6">
            <header className="max-w-3xl">
              <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{blogPageContent.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight xs:text-4xl sm:text-6xl">{blogPageContent.title}</h1>
              <p className="theme-text-muted mt-5 max-w-2xl text-[15px] leading-relaxed">{blogPageContent.summary}</p>
            </header>

            <div className="theme-border-subtle mt-12 border-t">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="theme-border-subtle grid gap-4 border-b py-8 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-8"
                >
                  <p className="theme-text-subtle text-xs uppercase tracking-[0.18em]">
                    {post.tag}
                    <span className="mx-2 opacity-50">/</span>
                    {post.dateLabel}
                  </p>
                  <div>
                    <h2 className="theme-text-primary text-2xl font-semibold tracking-tight">{post.title}</h2>
                    <p className="theme-text-muted mt-3 text-sm leading-relaxed">{post.summary}</p>
                  </div>
                  <span
                    className="theme-text-subtle justify-self-start text-xs font-medium uppercase tracking-[0.16em] sm:justify-self-end"
                    aria-disabled="true"
                  >
                    Coming Soon
                  </span>
                </article>
              ))}
            </div>
            <p className="theme-text-subtle mt-5 text-xs uppercase tracking-[0.16em]">{blogPageContent.emptyLabel}</p>
          </div>
        </section>
      )}
    </PageScaffold>
  );
};

export default BlogPage;
