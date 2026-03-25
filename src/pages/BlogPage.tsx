import React from "react";
import { blogPageContent, pageVisuals } from "../content";
import { blogPosts } from "../components/Blog/blogPosts";
import ResearchBlogExperience from "../components/Blog/ResearchBlogExperience";
import PageScaffold from "../components/layout/PageScaffold";
import { WipeOptions } from "../components/Transitions/TransitionWipe";
import { createCodexProbeAttributes } from "../devtools/codexContext/probe";

interface BlogPageProps {
  onNavigate: (path: string, opts?: WipeOptions) => void;
  articleSlug?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, articleSlug }) => {
  const blogPageProbe = createCodexProbeAttributes({
    componentName: "BlogPage",
    filePath: "/src/pages/BlogPage.tsx",
    componentPath: ["BlogPage"],
    role: "page",
  });

  return (
    <PageScaffold
      backgroundClassName={pageVisuals.blog.backgroundClassName}
      footerBackgroundColor={pageVisuals.blog.footerBackgroundColor}
      footerRunwayVh={88}
    >
      {(scrollRef) => (
        <div {...blogPageProbe}>
          <ResearchBlogExperience
            posts={blogPosts}
            pageContent={blogPageContent}
            articleSlug={articleSlug}
            scrollRef={scrollRef}
            onNavigate={onNavigate}
          />
        </div>
      )}
    </PageScaffold>
  );
};

export default BlogPage;
