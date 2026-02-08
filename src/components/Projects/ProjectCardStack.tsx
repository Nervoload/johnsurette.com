import React, { RefObject, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ProjectItem } from "./projectData";

interface ProjectCardStackProps {
  items: ProjectItem[];
  active: boolean;
  scrollContainer: RefObject<HTMLDivElement>;
  handoffProgress: number;
}

interface StackCardProps {
  item: ProjectItem;
  isExpanded: boolean;
  onToggle: () => void;
  revealProgress: number;
  index: number;
  total: number;
  stackMode: boolean;
  active: boolean;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

const StackCard: React.FC<StackCardProps> = ({ item, isExpanded, onToggle, revealProgress, index, total, stackMode, active }) => {
  const descend = easeOut(clamp01((revealProgress - index * 0.08) / 0.52));
  const flip = easeOut(clamp01((revealProgress - 0.08 - index * 0.07) / 0.44));

  const yStart = -190 - index * 28;
  const y = yStart * (1 - descend);
  const tilt = (index % 2 === 0 ? -1 : 1) * (1 - descend) * 3.4;
  const shellScaleX = 0.84 + flip * 0.16;
  const shellScaleY = 0.94 + flip * 0.06;
  const opacity = clamp01(descend * 1.25);

  const canInteract = flip > 0.92 && revealProgress > 0.72;
  const overlap = stackMode && index > 0 ? -Math.max(72, 112 - index * 10) : 0;

  return (
    <motion.article
      className="relative"
      style={{
        y,
        rotateZ: tilt,
        opacity,
        marginTop: overlap,
        zIndex: isExpanded ? total + 10 : total - index,
      }}
    >
      <div className="mx-auto" style={{ perspective: 1800 }}>
        <motion.div
          initial={false}
          className={`relative overflow-hidden border border-slate-200/95 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.35)] transition-all duration-300 ${
            isExpanded
              ? "h-[560px] w-full max-w-[980px] rounded-[1.9rem] sm:h-[640px]"
              : "h-[220px] w-full max-w-[700px] rounded-[1.2rem] sm:h-[260px] md:h-[300px]"
          }`}
          style={{
            transformStyle: "preserve-3d",
            rotateY: 180 * (1 - flip),
            scaleX: shellScaleX,
            scaleY: shellScaleY,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(0deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              backgroundColor: "#ffffff",
            }}
          >
            <img
              src={item.cardFrontSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
              loading="eager"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.52),transparent_54%),linear-gradient(140deg,rgba(255,255,255,0.2),transparent)]" />

            <motion.button
              type="button"
              onClick={onToggle}
              disabled={!canInteract || isExpanded}
              className="absolute inset-0 w-full text-left disabled:cursor-default"
              aria-expanded={isExpanded}
              aria-label={`Toggle ${item.title}`}
              style={{ pointerEvents: isExpanded ? "none" : "auto" }}
              initial={false}
              animate={{ opacity: isExpanded ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 backdrop-blur-md md:inset-x-5 md:bottom-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">{item.subtitle}</p>
                <h3 className="mt-1 text-[18px] font-medium leading-tight text-slate-900" style={{ color: item.accent }}>
                  {item.title}
                </h3>
                <p className="mt-1 text-[12px] text-slate-700">Click to expand</p>
              </div>
            </motion.button>

            <motion.div
              initial={false}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 p-5 md:p-6"
              style={{ pointerEvents: isExpanded ? "auto" : "none" }}
            >
              <div className="h-full overflow-auto rounded-[1.25rem] border border-white/75 bg-white/84 p-5 backdrop-blur-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{item.subtitle}</p>
                    <h3 className="mt-2 text-[27px] font-medium leading-tight text-slate-900 md:text-[30px]" style={{ color: item.accent }}>
                      {item.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onToggle}
                    className="rounded-full border border-slate-300 bg-white/85 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500"
                  >
                    Collapse
                  </button>
                </div>

                <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-600">{item.summary}</p>
                <p className="mt-4 text-[14px] leading-relaxed text-slate-700">{item.details}</p>

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
              </div>
            </motion.div>
          </div>

          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              backgroundColor: "#1f5fd8",
            }}
          >
            <img
              src={item.cardBackSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
              loading="eager"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_26%,rgba(255,255,255,0.2),transparent_52%),linear-gradient(120deg,rgba(255,255,255,0.14),transparent)]" />
            <div className="absolute inset-[10px] rounded-[inherit] border border-white/60" />
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
};

const ProjectCardStack: React.FC<ProjectCardStackProps> = ({ items, active, scrollContainer, handoffProgress }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: sectionRef,
    offset: ["start 95%", "end 22%"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrollProgress(value);
  });

  const revealProgress = clamp01(scrollProgress * 1.18 + handoffProgress * 0.95);
  const revealActive = active || handoffProgress > 0.01 || scrollProgress > 0.02;
  const stackMode = openId === null;

  return (
    <section ref={sectionRef} className="relative z-30 mx-auto -mt-[46vh] min-h-[210vh] w-full max-w-6xl px-6 pb-28 pt-2">
      <motion.div
        initial={false}
        animate={{ opacity: revealActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: revealActive ? "auto" : "none" }}
      >
        <div className="mb-8 max-w-3xl text-slate-900">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Project Stack</p>
          <h2 className="mt-3 text-[40px] font-medium leading-[1.03] sm:text-[50px]">Cards land, flip, then expand on click</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            Face-down cards settle into a horizontal v-stack, flip during scroll, and expand into full detail sections on click.
          </p>
        </div>

        <div className={stackMode ? "flex flex-col items-center pb-16" : "grid gap-6"}>
          {items.map((item, index) => {
            const isExpanded = openId === item.id;
            return (
              <StackCard
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                active={active}
                stackMode={stackMode}
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
