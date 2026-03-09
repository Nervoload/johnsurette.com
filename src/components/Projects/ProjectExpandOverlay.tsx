import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectItem } from "./projectData";
import { ResolvedThemeMode } from "../theme/themeMode";

interface ProjectExpandOverlayProps {
  item: ProjectItem | null;
  originPos: { x: number; y: number } | null;
  onClose: () => void;
  themeMode: ResolvedThemeMode;
}

/**
 * Pure-DOM overlay that expands from a 3D card's screen position.
 * Displays full project details, tags, media, and links.
 */
const ProjectExpandOverlay: React.FC<ProjectExpandOverlayProps> = ({
  item,
  originPos,
  onClose,
}) => {
  /* Close on Escape key */
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && originPos && (
        <>
          {/* ── Backdrop ───────────────────────────────── */}
          <motion.div
            key="overlay-backdrop"
            className="theme-overlay-backdrop fixed inset-0 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
          />

          {/* ── Expanding card panel ───────────────────── */}
          <motion.div
            key={`overlay-${item.id}`}
            className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="theme-overlay-panel relative max-h-[82vh] w-full max-w-[720px] overflow-y-auto rounded-3xl border backdrop-blur-xl"
              initial={{
                scale: 0.25,
                x: originPos.x - window.innerWidth / 2,
                y: originPos.y - window.innerHeight / 2,
                opacity: 0,
              }}
              animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Accent bar ──────────────────────────── */}
              <div
                className="h-1.5 rounded-t-3xl"
                style={{ background: item.accent }}
              />

              <div className="p-6 sm:p-8">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="theme-overlay-close absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Header */}
                <p className="theme-text-subtle text-[11px] uppercase tracking-[0.24em]">
                  {item.subtitle}
                </p>
                <h3
                  className="mt-2 text-[28px] font-medium leading-tight sm:text-[36px]"
                  style={{ color: item.accent }}
                >
                  {item.title}
                </h3>

                {/* Summary + details */}
                <p className="theme-text-muted mt-4 text-[15px] leading-relaxed">
                  {item.summary}
                </p>
                <p className="theme-text-primary mt-3 text-[14px] leading-relaxed">
                  {item.details}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="theme-chip-subtle rounded-full px-3 py-1 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Media grid */}
                {item.media.length > 0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {item.media.map((src, idx) => (
                      <div
                        key={`${item.id}-media-${idx}`}
                        className="theme-media-frame overflow-hidden rounded-2xl border"
                      >
                        <img
                          src={src}
                          alt={`${item.title} preview ${idx + 1}`}
                          className="h-44 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Links */}
                {item.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {item.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="theme-pill-button rounded-lg border px-4 py-2 text-[13px] font-medium transition"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectExpandOverlay;
