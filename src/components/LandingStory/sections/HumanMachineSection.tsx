import React from "react";
import { motion } from "framer-motion";
import { StorySectionData } from "../storySections";

interface HumanMachineSectionProps {
  section: StorySectionData;
}

const HumanMachineSection: React.FC<HumanMachineSectionProps> = ({ section }) => {
  const cards = section.focusAreas.slice(0, 6);

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 py-24 xs:px-6 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(14,165,233,0.18),rgba(15,23,42,0)_44%),radial-gradient(circle_at_88%_88%,rgba(45,212,191,0.14),rgba(15,23,42,0)_42%),linear-gradient(150deg,rgba(15,23,42,0.72),rgba(17,24,39,0.7)_46%,rgba(11,17,32,0.74))]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/75">{section.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-100 xs:text-4xl sm:text-5xl">{section.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{section.summary}</p>
        </motion.div>

        <div className="mt-12 grid auto-rows-[170px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.article
            className="relative overflow-hidden rounded-2xl border border-sky-200/25 bg-slate-900/70 p-5 shadow-[0_20px_60px_-40px_rgba(14,165,233,0.7)] sm:col-span-2 sm:row-span-2"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.68 }}
          >
            <div className="absolute inset-0 story-circuit-grid opacity-45" />
            <h3 className="relative text-xl font-semibold text-cyan-100">Augmentation Principle</h3>
            <p className="relative mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              Build interfaces that increase agency and clarity. Hardware, AI, and biology should compose into understandable systems.
            </p>
          </motion.article>

          {cards.map((item, idx) => (
            <motion.article
              key={item}
              className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/68 p-4"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
            >
              <div className="absolute inset-0 story-circuit-grid opacity-30" />
              <h4 className="relative text-sm font-semibold uppercase tracking-[0.12em] text-slate-100">{item}</h4>
              <p className="relative mt-2 text-xs leading-relaxed text-slate-300">
                Design notes and experiments mapped to human outcomes.
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HumanMachineSection;
