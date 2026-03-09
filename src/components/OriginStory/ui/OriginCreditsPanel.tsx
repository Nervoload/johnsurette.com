import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OriginAssetCreditEntry } from "../types";

interface OriginCreditsPanelProps {
  open: boolean;
  chapterLabel: string;
  entries: OriginAssetCreditEntry[];
  onClose: () => void;
}

const OriginCreditsPanel: React.FC<OriginCreditsPanelProps> = ({ open, chapterLabel, entries, onClose }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          className="origin-credits-panel"
          initial={{ opacity: 0, x: 28, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20, y: 8 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="origin-credits-head">
            <div>
              <p className="origin-credits-kicker">Origin credits</p>
              <h3 className="origin-credits-title">{chapterLabel}</h3>
            </div>
            <button type="button" className="origin-overlay-button" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="origin-credits-list">
            {entries.map((entry) => (
              <article key={entry.id} className="origin-credit-item">
                <p className="origin-credit-kind">{entry.kind}</p>
                <h4 className="origin-credit-title">{entry.title}</h4>
                <p className="origin-credit-meta">
                  {entry.author} · {entry.license}
                </p>
                <p className="origin-credit-body">{entry.attribution}</p>
                <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="origin-credit-link">
                  Source
                </a>
              </article>
            ))}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};

export default OriginCreditsPanel;
