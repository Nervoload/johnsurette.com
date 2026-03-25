import React from "react";
import { getBlogPostBySlug, pageVisuals } from "../content";
import BlogArticleView from "../components/Blog/BlogArticleView";
import PageScaffold from "../components/layout/PageScaffold";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";

interface BlogArticlePageProps {
  slug: string;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug, onNavigate }) => {
  const post = getBlogPostBySlug(slug);
  const articleProbe = createCodexProbeAttributes({
    componentName: "BlogArticlePage",
    filePath: "/src/pages/BlogArticlePage.tsx",
    componentPath: ["BlogArticlePage"],
    role: "page",
  });

  return (
    <PageScaffold
      backgroundClassName={pageVisuals.blog.backgroundClassName}
      footerBackgroundColor={pageVisuals.blog.footerBackgroundColor}
      footerRunwayVh={64}
    >
      {() => (
        <div {...articleProbe}>
          {post ? (
            <BlogArticleView
              post={post}
              onBack={() =>
                onNavigate("/blog", {
                  color: "#da08ff",
                  direction: "up",
                  intensity: "lite",
                  duration: 620,
                })
              }
            />
          ) : (
            <section className="theme-text-primary relative mx-auto w-full max-w-4xl px-6 pb-28 pt-28">
              <div className="blog-empty-state rounded-[2rem] border px-6 py-10 sm:px-8 sm:py-12">
                <p className="text-xs uppercase tracking-[0.24em]">Article Not Found</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">This research note does not exist yet.</h1>
                <p className="theme-text-muted mt-5 max-w-2xl text-base leading-relaxed">
                  The route is valid, but there is no article published for the slug <span className="font-medium text-inherit">{slug}</span>.
                </p>
                <button
                  type="button"
                  className="theme-pill-button mt-8 rounded-full border px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] transition"
                  onClick={() =>
                    onNavigate("/blog", {
                      color: "#da08ff",
                      direction: "up",
                      intensity: "lite",
                      duration: 620,
                    })
                  }
                >
                  Back To Research Blog
                </button>
              </div>
            </section>
          )}
        </div>
      )}
    </PageScaffold>
  );
};

export default BlogArticlePage;
