import React from "react";
import { motion } from "framer-motion";
import { blogPosts } from "../Blog/blogPosts";
import { projectItems } from "../Projects/projectData";
import { sections } from "../sections";
import { WipeOptions } from "../Transitions/TransitionWipe";

interface LandingConclusionSectionProps {
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const featuredProjects = projectItems.slice(0, 3);
const featuredPosts = blogPosts.slice(0, 2);

const LandingConclusionSection: React.FC<LandingConclusionSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 pb-24 pt-24 xs:px-6 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.2),rgba(248,250,252,0)_44%),radial-gradient(circle_at_84%_82%,rgba(168,85,247,0.18),rgba(248,250,252,0)_44%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.98)_42%,rgba(248,250,252,1))]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.62 }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">03 · Continue</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 xs:text-4xl sm:text-5xl">
            Explore projects, writing, and ongoing research.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            This site is an evolving lab across longevity science, neuroscience, and design systems.
            Start anywhere and follow the thread.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.24fr_0.76fr]">
          <motion.div
            className="rounded-[1.8rem] bg-white/58 p-5 shadow-[0_40px_90px_-70px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.62 }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Highlighted Projects</p>
            <div className="mt-4 grid gap-3">
              {featuredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="rounded-2xl bg-slate-900/84 px-4 py-4 text-left text-slate-100 transition hover:scale-[1.01]"
                  onClick={() =>
                    onNavigate("/projects", {
                      color: project.accent,
                    })
                  }
                >
                  <p className="text-sm uppercase tracking-[0.12em] text-slate-300">{project.subtitle}</p>
                  <p className="mt-1 text-lg font-semibold">{project.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.summary}</p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.aside
            className="rounded-[1.8rem] bg-white/52 p-5 shadow-[0_40px_90px_-70px_rgba(15,23,42,0.72)] backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.66 }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Recent Research Notes</p>
            <div className="mt-4 space-y-3">
              {featuredPosts.map((post) => (
                <article key={post.id} className="rounded-2xl bg-slate-900/88 px-4 py-4 text-slate-100">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-slate-300">
                    {post.tag}
                    <span className="mx-2 text-slate-500">/</span>
                    {post.dateLabel}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{post.summary}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.path}
                  type="button"
                  className="rounded-full bg-slate-900/85 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition hover:scale-[1.02]"
                  style={{ color: section.color }}
                  onClick={() =>
                    onNavigate(section.path, {
                      color: section.color,
                    })
                  }
                >
                  {section.name}
                </button>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default LandingConclusionSection;
