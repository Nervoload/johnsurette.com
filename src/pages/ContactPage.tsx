import React from "react";
import DotFieldGlobeBackground from "../components/visuals/DotFieldGlobeBackground";
import SocialPostCarousel, { SocialPost } from "../components/Contact/SocialPostCarousel";
import PageScaffold from "../components/layout/PageScaffold";

const socialPosts: SocialPost[] = [
  {
    id: "x-build-notes",
    platform: "X",
    handle: "@johnsurette",
    publishedLabel: "2 days ago",
    title: "Rebuilt page architecture for smoother motion",
    excerpt:
      "Finished the foundation pass: centralized transitions, reusable page scaffolding, and cleaner route-level loading.",
    href: "https://x.com/johnsurette",
    accentClassName: "bg-slate-800",
  },
  {
    id: "linkedin-project-stack",
    platform: "LinkedIn",
    handle: "linkedin.com/in/johnsurette",
    publishedLabel: "5 days ago",
    title: "Project stack now supports expandable detail cards",
    excerpt:
      "Moved from one-off project scenes to a consistent card stack model so each project can share the same interaction pattern.",
    href: "https://www.linkedin.com/in/johnsurette",
    accentClassName: "bg-sky-700",
  },
  {
    id: "github-shader-pass",
    platform: "GitHub",
    handle: "github.com/johnsurette",
    publishedLabel: "1 week ago",
    title: "Updated intro sequence for deterministic card animation",
    excerpt:
      "Refactored intro sequence logic to reduce animation drift and make scene ordering predictable during route transitions.",
    href: "https://github.com/johnsurette",
    accentClassName: "bg-emerald-700",
  },
];

const ContactPage: React.FC = () => {
  return (
    <PageScaffold
      backgroundClassName="bg-[radial-gradient(circle_at_8%_12%,rgba(186,230,253,0.56),rgba(224,231,255,0.3)_34%,rgba(248,250,252,1)_68%)]"
      footerBackgroundColor="#ffffff"
      footerRunwayVh={120}
    >
      {() => (
        <section className="relative min-h-[140vh] w-full overflow-hidden px-4 pb-24 pt-24 text-slate-900 xs:px-6 sm:min-h-[180vh]">
          <div className="pointer-events-none absolute inset-0">
            <DotFieldGlobeBackground pointCount={240} className="opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(248,250,252,0.06),rgba(248,250,252,0.85)_38%,rgba(248,250,252,0.96)_70%)]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <header className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Contact</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight xs:text-4xl sm:text-6xl">Let&apos;s Connect</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                An easy path to connect with me for project work, collaborations, or quick conversations. Reach out directly, then explore the latest updates below.
              </p>
            </header>

            <div className="mt-12 grid gap-10 border-t border-slate-300/60 pt-10 md:grid-cols-[1.25fr_1fr]">
              <article>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact Me</p>
                <a
                  href="mailto:contact@example.com"
                  className="mt-5 inline-flex text-xl font-semibold tracking-tight text-slate-900 underline decoration-slate-300 underline-offset-8 transition hover:decoration-slate-700 xs:text-2xl"
                >
                  contact@example.com
                </a>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                  Best for freelance work, consulting, partnerships, and technical collaboration.
                </p>
                <div className="mt-7 flex flex-wrap gap-5 text-[12px] uppercase tracking-[0.16em] text-slate-600">
                  <a href="https://github.com/johnsurette" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700">
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/johnsurette" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700">
                    LinkedIn
                  </a>
                  <a href="https://x.com/johnsurette" target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700">
                    X
                  </a>
                </div>
              </article>

              <article className="md:border-l md:border-slate-300/60 md:pl-10">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Availability</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Open to new builds</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Currently taking on selective projects centered on product design systems, interactive front-end experiences, and animation architecture.
                </p>
                <div className="mt-8 space-y-2 text-[13px] uppercase tracking-[0.15em] text-slate-500">
                  <p>Response Window: 24-48 hours</p>
                  <p>Timezone: Eastern Time (ET)</p>
                  <p>Preferred Contact: Email</p>
                </div>
              </article>
            </div>

            <div className="mt-20 border-t border-slate-300/60 pt-10">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Social Feed</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">Latest Posts</h2>
                </div>
                <p className="max-w-sm text-sm text-slate-600">
                  A compact live-style carousel for your most recent updates across platforms.
                </p>
              </div>

              <SocialPostCarousel posts={socialPosts} />
            </div>
          </div>
        </section>
      )}
    </PageScaffold>
  );
};

export default ContactPage;
