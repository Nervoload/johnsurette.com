import React from "react";
import { motion } from "framer-motion";
import { StorySectionData } from "../storySections";

interface CellularDawnSectionProps {
  section: StorySectionData;
}

const CellularDawnSection: React.FC<CellularDawnSectionProps> = ({ section }) => {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(34,211,238,0.18),rgba(15,23,42,0)_42%),radial-gradient(circle_at_84%_14%,rgba(129,140,248,0.16),rgba(15,23,42,0)_44%),linear-gradient(160deg,#f8fafc,#ecfeff_40%,#eef2ff)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.08fr_1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{section.eyebrow}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-slate-900 xs:text-4xl sm:text-5xl">{section.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{section.summary}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {section.focusAreas.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-3 text-sm text-slate-700 shadow-sm backdrop-blur-sm">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative h-[420px] rounded-[2rem] border border-cyan-200/60 bg-slate-950/72 p-5 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.85)] backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="absolute left-[8%] top-[16%] h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl story-blob-drift" />
            <div className="absolute right-[12%] top-[30%] h-36 w-36 rounded-full bg-indigo-300/18 blur-2xl story-blob-drift-rev" />
            <div className="absolute bottom-[12%] left-[34%] h-32 w-32 rounded-full bg-teal-200/18 blur-2xl story-blob-drift" />
            <div className="absolute inset-[14%] rounded-[1.35rem] border border-cyan-100/30" />
            <div className="absolute inset-[18%] rounded-[1.1rem] bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.2),rgba(15,23,42,0.45)_65%)]" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-100/90">
              Biofield Playback
            </div>

            <div className="rounded-2xl border border-cyan-100/20 bg-slate-900/45 p-4 text-cyan-50/90">
              <p className="text-sm leading-relaxed">
                Abstract stage for cellular behavior clips, protocol overlays, and context notes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CellularDawnSection;
