import React from "react";
import { motion } from "framer-motion";
import { StorySectionData } from "../storySections";
import { sections } from "../../sections";
import { WipeOptions } from "../../Transitions/TransitionWipe";

interface FutureProtocolSectionProps {
  section: StorySectionData;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const FutureProtocolSection: React.FC<FutureProtocolSectionProps> = ({ section, onNavigate }) => {
  return (
    <section className="relative isolate min-h-[118vh] overflow-hidden px-6 pb-28 pt-24 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.16),rgba(2,6,23,0)_45%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),rgba(2,6,23,0)_45%),linear-gradient(180deg,#020617,#0f172a_52%,#f8fafc_100%)]" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">{section.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">{section.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{section.summary}</p>
        </motion.div>

        <motion.div
          className="relative mt-12 w-full overflow-hidden rounded-[2rem] border border-cyan-200/30 bg-slate-950/70 p-8 shadow-[0_30px_90px_-50px_rgba(34,211,238,0.65)]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.72 }}
        >
          <div className="absolute inset-0 story-terminal-haze" />

          <div className="relative z-10 grid gap-3 sm:grid-cols-2">
            {section.focusAreas.map((item) => (
              <div key={item} className="rounded-xl border border-cyan-200/20 bg-slate-900/66 px-4 py-3 text-left text-sm text-cyan-50/95">
                {item}
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-3">
            {sections.map((item) => (
              <button
                key={item.path}
                type="button"
                className="rounded-full border px-4 py-2 text-sm font-medium transition hover:scale-[1.02]"
                style={{
                  borderColor: `${item.color}88`,
                  color: item.color,
                  backgroundColor: "rgba(15, 23, 42, 0.55)",
                }}
                onClick={() =>
                  onNavigate(item.path, {
                    direction: "right",
                    color: item.color,
                    duration: 430,
                  })
                }
              >
                Open {item.name}
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 8 }).map((_, idx) => (
              <span
                key={`token-${idx}`}
                className="absolute story-token-orbit rounded-full border border-cyan-200/35 bg-cyan-300/8"
                style={{
                  width: `${18 + (idx % 3) * 8}px`,
                  height: `${18 + (idx % 3) * 8}px`,
                  left: `${8 + idx * 11}%`,
                  top: `${18 + (idx % 2) * 50}%`,
                  animationDelay: `${idx * 0.35}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureProtocolSection;
