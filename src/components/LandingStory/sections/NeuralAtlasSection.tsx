import React from "react";
import { motion } from "framer-motion";
import { StorySectionData } from "../storySections";

interface NeuralAtlasSectionProps {
  section: StorySectionData;
}

type NodeDef = {
  id: string;
  x: number;
  y: number;
  label: string;
};

const nodes: NodeDef[] = [
  { id: "predictive", x: 14, y: 42, label: "Prediction" },
  { id: "attention", x: 30, y: 24, label: "Attention" },
  { id: "memory", x: 48, y: 50, label: "Memory" },
  { id: "encoding", x: 64, y: 28, label: "Encoding" },
  { id: "motor", x: 74, y: 62, label: "Motor" },
  { id: "interface", x: 40, y: 74, label: "Interface" },
  { id: "plasticity", x: 24, y: 66, label: "Plasticity" },
];

const links: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [0, 6],
  [6, 5],
  [5, 2],
  [3, 4],
];

const NeuralAtlasSection: React.FC<NeuralAtlasSectionProps> = ({ section }) => {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(20,184,166,0.16),rgba(2,6,23,0)_44%),radial-gradient(circle_at_88%_14%,rgba(236,72,153,0.14),rgba(2,6,23,0)_42%),linear-gradient(170deg,#020617,#0b1120_60%,#0f172a)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.62 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">{section.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-100 xs:text-4xl sm:text-5xl">{section.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{section.summary}</p>
        </motion.div>

        <motion.div
          className="relative h-[540px] overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-slate-900/45 shadow-[0_25px_90px_-50px_rgba(6,182,212,0.55)]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 story-neural-noise opacity-35" />

          {links.map(([a, b], idx) => {
            const from = nodes[a];
            const to = nodes[b];
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            return (
              <div
                key={`link-${idx}`}
                className="absolute h-[2px] origin-left bg-gradient-to-r from-cyan-300/10 via-cyan-300/60 to-violet-300/20"
                style={{
                  left: `${from.x}%`,
                  top: `${from.y}%`,
                  width: `${length}%`,
                  transform: `rotate(${angle}deg)`,
                }}
              />
            );
          })}

          {nodes.map((node, idx) => (
            <motion.div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-200/25 bg-slate-950/72 px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-cyan-100"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              whileInView={{
                boxShadow: [
                  "0 0 0 rgba(34,211,238,0)",
                  "0 0 24px rgba(34,211,238,0.45)",
                  "0 0 0 rgba(34,211,238,0)",
                ],
              }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 2.2 + idx * 0.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {node.label}
            </motion.div>
          ))}

          <div className="absolute right-6 top-6 max-w-xs rounded-2xl border border-slate-700/80 bg-slate-900/72 p-4 text-sm text-slate-200 backdrop-blur">
            Signal paths represent how perception, memory, and interface design can be mapped as one adaptive network.
          </div>

          <div className="absolute bottom-6 left-6 grid gap-2 sm:grid-cols-2">
            {section.focusAreas.map((item) => (
              <div key={item} className="rounded-xl border border-slate-700/70 bg-slate-900/65 px-3 py-2 text-xs text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NeuralAtlasSection;
