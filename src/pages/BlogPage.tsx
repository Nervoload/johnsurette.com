import React from "react";
import { blogPageContent, pageVisuals } from "../content";
import { blogPosts, getBlogPostBySlug } from "../components/Blog/blogPosts";
import ResearchBlogExperience from "../components/Blog/ResearchBlogExperience";
import ResearchSignalBackdrop from "../components/Blog/ResearchSignalBackdrop";
import PageScaffold from "../components/layout/PageScaffold";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { ResolvedThemeMode } from "../components/theme/themeMode";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";

interface BlogPageProps {
  onNavigate: (path: string, opts?: WipeOptions) => void;
  articleSlug?: string;
  themeMode: ResolvedThemeMode;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, articleSlug, themeMode }) => {
  const blogPageProbe = createCodexProbeAttributes({
    componentName: "BlogPage",
    filePath: "/src/pages/BlogPage.tsx",
    componentPath: ["BlogPage"],
    role: "page",
  });
  const featuredPost = blogPosts.find((post) => post.featured) ?? blogPosts[0] ?? null;
  const backgroundPost = (articleSlug ? getBlogPostBySlug(articleSlug) : null) ?? featuredPost;

  return (
    <PageScaffold
      backgroundClassName={pageVisuals.blog.backgroundClassName}
      footerBackgroundColor={pageVisuals.blog.footerBackgroundColor}
      footerRunwayVh={88}
    >
      {(scrollRef) => (
        <div {...blogPageProbe} className="research-page-shell">
          {backgroundPost ? (
            <div className="research-page-backdrop-layer" aria-hidden="true">
              <div className="research-page-backdrop-sticky">
                <ResearchSignalBackdrop post={backgroundPost} />
              </div>
            </div>
          ) : null}

          <div className="research-page-content">
            <ResearchBlogExperience
              posts={blogPosts}
              pageContent={blogPageContent}
              articleSlug={articleSlug}
              scrollRef={scrollRef}
              themeMode={themeMode}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      )}
    </PageScaffold>
  );
};

export default BlogPage;
