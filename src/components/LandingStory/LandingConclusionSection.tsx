import React from "react";
import { motion } from "framer-motion";
import { landingConclusionContent } from "../../content";
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,var(--theme-accent-soft),rgba(248,250,252,0)_44%),radial-gradient(circle_at_84%_82%,rgba(168,85,247,0.18),rgba(248,250,252,0)_44%),linear-gradient(180deg,rgba(248,250,252,0.15),rgba(241,245,249,0.05)_42%,rgba(248,250,252,0.02))]" />

      <div className="theme-text-primary relative mx-auto w-full max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.62 }}
        >
          <p className="theme-text-subtle text-xs uppercase tracking-[0.28em]">{landingConclusionContent.eyebrow}</p>
          <h2 className="theme-text-primary mt-4 text-3xl font-semibold leading-tight xs:text-4xl sm:text-5xl">
            {landingConclusionContent.title}
          </h2>
          <p className="theme-text-muted mt-6 max-w-2xl text-lg leading-relaxed">{landingConclusionContent.summary}</p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.24fr_0.76fr]">
          <motion.div
            className="theme-surface-elevated rounded-[1.8rem] p-5 backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.62 }}
          >
            <p className="theme-text-subtle text-xs uppercase tracking-[0.22em]">{landingConclusionContent.highlightedProjectsLabel}</p>
            <div className="mt-4 grid gap-3">
              {featuredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="theme-card-inverse rounded-2xl px-4 py-4 text-left transition hover:scale-[1.01]"
                  onClick={() =>
                    onNavigate("/projects", {
                      color: project.accent,
                    })
                  }
                >
                  <p className="theme-text-subtle text-sm uppercase tracking-[0.12em]">{project.subtitle}</p>
                  <p className="mt-1 text-lg font-semibold">{project.title}</p>
                  <p className="theme-text-muted mt-2 text-sm leading-relaxed">{project.summary}</p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.aside
            className="theme-surface-elevated rounded-[1.8rem] p-5 backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.66 }}
          >
            <p className="theme-text-subtle text-xs uppercase tracking-[0.22em]">{landingConclusionContent.highlightedPostsLabel}</p>
            <div className="mt-4 space-y-3">
              {featuredPosts.map((post) => (
                <article key={post.id} className="theme-card-inverse rounded-2xl px-4 py-4">
                  <p className="theme-text-subtle text-[11px] uppercase tracking-[0.15em]">
                    {post.tag}
                    <span className="mx-2 opacity-50">/</span>
                    {post.dateLabel}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{post.title}</h3>
                  <p className="theme-text-muted mt-2 text-sm leading-relaxed">{post.summary}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.path}
                  type="button"
                  className="theme-card-inverse rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition hover:scale-[1.02]"
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
