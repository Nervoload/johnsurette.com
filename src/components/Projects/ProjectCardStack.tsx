import React, { RefObject, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ProjectItem } from "./projectData";

interface ProjectCardStackProps {
  items: ProjectItem[];
  active: boolean;
  scrollContainer: RefObject<HTMLDivElement>;
}

interface StackCardProps {
  item: ProjectItem;
  isExpanded: boolean;
  onToggle: () => void;
  revealProgress: number;
  index: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

const StackCard: React.FC<StackCardProps> = ({ item, isExpanded, onToggle, revealProgress, index }) => {
  const descend = easeOut(clamp01((revealProgress - index * 0.085) / 0.42));
  const flip = easeOut(clamp01((revealProgress - 0.14 - index * 0.08) / 0.42));

  const yStart = -280 - index * 34;
  const y = yStart * (1 - descend);
  const zRotation = (index % 2 === 0 ? -1 : 1) * (1 - descend) * 5.2;
  const shellScaleX = 0.72 + flip * 0.28;
  const shellOpacity = clamp01(descend * 1.25);

  const canInteract = flip > 0.96;

  return (
    <motion.article
      className="relative"
      style={{
        y,
        rotateZ: zRotation,
        opacity: shellOpacity,
      }}
    >
      <div className="mx-auto w-full max-w-[980px]" style={{ perspective: 1700 }}>
        <motion.div
          layout
          className="relative rounded-[1.9rem] border border-slate-200/95 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.35)]"
          style={{
            transformStyle: "preserve-3d",
            rotateY: 180 * (1 - flip),
            scaleX: shellScaleX,
            background: "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(248,250,252,0.96))",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="rounded-[1.9rem] p-6 md:p-7"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <button
              type="button"
              onClick={onToggle}
              disabled={!canInteract}
              className="w-full text-left disabled:cursor-default"
              aria-expanded={isExpanded}
              aria-label={`Toggle ${item.title}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{item.subtitle}</p>
                  <h3 className="mt-2 text-[27px] font-medium leading-tight text-slate-900 md:text-[30px]" style={{ color: item.accent }}>
                    {item.title}
                  </h3>
                </div>
                <span className="rounded-full border border-slate-300 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  {isExpanded ? "Open" : "Collapsed"}
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-600">{item.summary}</p>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? 22 : 0,
              }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="text-[14px] leading-relaxed text-slate-700">{item.details}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {item.media.map((src) => (
                  <div key={src} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img
                      src={src}
                      alt={`${item.title} preview`}
                      className="h-44 w-full object-cover transition duration-500 hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {item.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          <div
            className="absolute inset-0 rounded-[1.9rem] border border-slate-200/90"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background:
                "linear-gradient(145deg, rgba(194,210,232,0.95), rgba(229,236,247,0.9)), radial-gradient(circle at 32% 30%, rgba(131,168,213,0.35), transparent 58%)",
            }}
          >
            <div className="absolute inset-0 rounded-[1.9rem] bg-[radial-gradient(circle_at_24%_26%,rgba(255,255,255,0.4),transparent_48%),linear-gradient(120deg,rgba(255,255,255,0.18),transparent)]" />
            <div className="absolute inset-[12px] rounded-[1.45rem] border border-white/65" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/30" />
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
};

const ProjectCardStack: React.FC<ProjectCardStackProps> = ({ items, active, scrollContainer }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: sectionRef,
    offset: ["start 90%", "end 15%"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrollProgress(value);
  });

  const revealProgress = active ? scrollProgress : 0;

  return (
    <section ref={sectionRef} className="mx-auto min-h-[210vh] w-full max-w-6xl px-6 pb-28 pt-12">
      <motion.div
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        style={{ pointerEvents: active ? "auto" : "none" }}
      >
        <div className="mb-10 max-w-3xl text-slate-900">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Project Stack</p>
          <h2 className="mt-3 text-[44px] font-medium leading-[1.03] sm:text-[52px]">Cards fly in, flip, and expand on click</h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            The sequence now continues from the intro flight: cards land into a vertical stack face-down, then flip and widen with scroll progression.
          </p>
        </div>

        <div className="grid gap-4">
          {items.map((item, index) => {
            const isExpanded = openId === item.id;
            return (
              <StackCard
                key={item.id}
                item={item}
                index={index}
                isExpanded={isExpanded}
                revealProgress={revealProgress}
                onToggle={() => {
                  setOpenId((prev) => (prev === item.id ? null : item.id));
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectCardStack;
