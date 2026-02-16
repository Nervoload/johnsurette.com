import React from "react";
import PageScaffold from "../components/layout/PageScaffold";

const posts = [
  {
    title: "Designing Narrative Interfaces",
    tag: "UX",
    summary: "How scroll progression can guide understanding without overwhelming users.",
    dateLabel: "Feb 2026",
  },
  {
    title: "When to Use Real 3D",
    tag: "Engineering",
    summary: "Choosing where 3D genuinely improves storytelling and where 2D depth cues are better.",
    dateLabel: "Jan 2026",
  },
  {
    title: "Building Stable Motion Systems",
    tag: "Architecture",
    summary: "Patterns for reusable motion primitives that avoid fragile one-off animation logic.",
    dateLabel: "Dec 2025",
  },
];

const BlogPage: React.FC = () => {
  return (
    <PageScaffold
      backgroundClassName="bg-[radial-gradient(circle_at_12%_10%,rgba(186,230,253,0.5),rgba(224,231,255,0.34)_34%,rgba(248,250,252,1)_72%)]"
      footerBackgroundColor="#ffffff"
    >
      {() => (
        <section className="relative min-h-[175vh] w-full pb-24 pt-24 text-slate-900">
          <div className="mx-auto w-full max-w-5xl px-6">
            <header className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Blog</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight xs:text-4xl sm:text-6xl">Research Notes</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                Writing on interface systems, narrative motion, and architecture choices behind this portfolio.
              </p>
            </header>

            <div className="mt-12 border-t border-slate-300/60">
              {posts.map((post) => (
                <article
                  key={post.title}
                  className="grid gap-4 border-b border-slate-300/55 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-8"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {post.tag}
                    <span className="mx-2 text-slate-300">/</span>
                    {post.dateLabel}
                  </p>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{post.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{post.summary}</p>
                  </div>
                  <span
                    className="justify-self-start text-xs font-medium uppercase tracking-[0.16em] text-slate-400 sm:justify-self-end"
                    aria-disabled="true"
                  >
                    Coming Soon
                  </span>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.16em] text-slate-500">
              Individual posts coming soon.
            </p>
          </div>
        </section>
      )}
    </PageScaffold>
  );
};

export default BlogPage;
