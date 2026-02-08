import React from "react";
import { motion } from "framer-motion";
import { StorySectionData } from "../storySections";

interface RepairStackSectionProps {
  section: StorySectionData;
}

const RepairStackSection: React.FC<RepairStackSectionProps> = ({ section }) => {
  const nodes = section.focusAreas.slice(0, 6);

  return (
    <section className="relative isolate min-h-[118vh] overflow-hidden bg-slate-950 px-6 py-24 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(56,189,248,0.18),rgba(15,23,42,0.0)_46%),radial-gradient(circle_at_30%_86%,rgba(167,139,250,0.15),rgba(15,23,42,0.0)_40%),linear-gradient(180deg,#020617,#0f172a_65%,#111827)]" />
      <div className="absolute inset-0 story-flow-lines opacity-35" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">{section.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">{section.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">{section.summary}</p>

          <div className="mt-8 space-y-3">
            {nodes.map((node, idx) => (
              <div key={node} className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/55 px-4 py-3 text-sm text-slate-200">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/20 text-xs text-cyan-100">
                  {idx + 1}
                </span>
                <span>{node}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto h-[480px] w-full max-w-[520px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85 }}
        >
          <div className="absolute inset-0 rounded-full border border-cyan-300/18 story-rotate-slow" />
          <div className="absolute inset-[10%] rounded-full border border-violet-300/22 story-rotate-reverse" />
          <div className="absolute inset-[18%] rounded-full border border-cyan-200/15" />
          <div className="absolute inset-[32%] rounded-full border border-cyan-200/25 bg-slate-900/72 backdrop-blur-sm" />
          <div className="absolute inset-[36%] flex items-center justify-center rounded-full border border-cyan-100/30 bg-cyan-300/8 text-center text-slate-100">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">Core Loop</p>
              <p className="mt-2 text-sm">Sense → Model → Repair → Adapt</p>
            </div>
          </div>

          {nodes.map((node, idx) => {
            const angle = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 44;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;

            return (
              <motion.div
                key={node}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-200/30 bg-slate-900/78 px-3 py-2 text-xs text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.15)]"
                style={{ left: `${x}%`, top: `${y}%` }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.4 + idx * 0.35, repeat: Infinity, ease: "easeInOut" }}
              >
                {node}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default RepairStackSection;
