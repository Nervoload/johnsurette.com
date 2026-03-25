import React from "react";
import { motion } from "framer-motion";
import { StorySectionData } from "../storySections";

interface RepairStackSectionProps {
  section: StorySectionData;
}

const RepairStackSection: React.FC<RepairStackSectionProps> = ({ section }) => {
  const nodes = section.focusAreas.slice(0, 6);

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(56,189,248,0.18),rgba(15,23,42,0)_46%),radial-gradient(circle_at_30%_86%,rgba(167,139,250,0.14),rgba(15,23,42,0)_40%)]" />
      <div className="absolute inset-0 story-flow-lines opacity-35" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="theme-story-contrast-accent text-xs uppercase tracking-[0.28em]">{section.eyebrow}</p>
          <h2 className="theme-story-contrast-title mt-4 text-3xl font-semibold leading-tight xs:text-4xl sm:text-5xl">{section.title}</h2>
          <p className="theme-story-contrast-body mt-6 max-w-xl text-lg leading-relaxed">{section.summary}</p>

          <div className="mt-8 space-y-3">
            {nodes.map((node, idx) => (
              <div key={node} className="theme-story-contrast-panel-soft theme-story-contrast-body flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
                <span className="theme-story-contrast-chip inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs">
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
          <div className="theme-story-contrast-panel-soft absolute inset-[32%] rounded-full border" />
          <div className="theme-story-contrast-panel-soft theme-story-contrast-title absolute inset-[36%] flex items-center justify-center rounded-full border text-center">
            <div>
              <p className="theme-story-contrast-accent text-xs uppercase tracking-[0.2em]">Core Loop</p>
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
                className="theme-story-contrast-chip absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-xs shadow-[0_0_24px_rgba(34,211,238,0.15)]"
                style={{ left: `${x}%`, top: `${y}%` }}
                whileInView={{ y: [0, -8, 0] }}
                viewport={{ once: false, amount: 0.1 }}
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
