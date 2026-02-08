import React from "react";
import PageScaffold from "../components/layout/PageScaffold";

const posts = [
  { title: "Designing Narrative Interfaces", tag: "UX", summary: "How scroll progression can guide understanding without overwhelming users." },
  { title: "When to Use Real 3D", tag: "Engineering", summary: "Choosing where 3D genuinely improves storytelling and where 2D depth cues are better." },
  { title: "Building Stable Motion Systems", tag: "Architecture", summary: "Patterns for reusable motion primitives that avoid fragile one-off animation logic." },
];

const BlogPage: React.FC = () => {
  return (
    <PageScaffold backgroundClassName="bg-slate-50" footerBackgroundColor="#ffffff">
      {() => (
        <section className="mx-auto min-h-[170vh] w-full max-w-5xl px-6 pb-20 pt-24 text-slate-900">
          <header className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Blog</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Writing Foundation</h1>
            <p className="mt-4 text-slate-600">Structured article cards are in place so entries can later route into full formatted posts.</p>
          </header>

          <div className="mt-12 grid gap-5">
            {posts.map((post) => (
              <article key={post.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:bg-slate-50">
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">{post.tag}</p>
                <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
                <p className="mt-3 text-slate-600">{post.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </PageScaffold>
  );
};

export default BlogPage;
