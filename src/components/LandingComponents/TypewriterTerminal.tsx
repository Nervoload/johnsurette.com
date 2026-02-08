import React, { useEffect, useMemo, useState } from "react";
import { sections } from "../sections";
import { landingTerminalPrompts } from "./terminalPrompts";

interface TypewriterTerminalProps {
  activeSection: string | null;
}

const TYPE_SPEED_MS = 52;
const DELETE_SPEED_MS = 26;
const HOLD_MS = 1200;

const TypewriterTerminal: React.FC<TypewriterTerminalProps> = ({ activeSection }) => {
  const basePrompts = useMemo(
    () => [
      ...landingTerminalPrompts,
      ...sections.map((section) => `Open ${section.name} -> ${section.path}`),
    ],
    []
  );
  const prompts = useMemo(
    () => (activeSection ? [`Focused route: ${activeSection}`, ...basePrompts] : basePrompts),
    [activeSection, basePrompts]
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    setLineIndex(0);
    setTypedLength(0);
    setIsDeleting(false);
    setIsHolding(false);
  }, [prompts]);

  useEffect(() => {
    if (isHolding) return;

    const currentLine = prompts[lineIndex] ?? prompts[0];

    const completedTyping = typedLength >= currentLine.length;
    const completedDeleting = typedLength <= 0;

    if (!isDeleting && completedTyping) {
      setIsHolding(true);
      const holdTimeout = window.setTimeout(() => {
        setIsHolding(false);
        setIsDeleting(true);
      }, HOLD_MS);
      return () => window.clearTimeout(holdTimeout);
    }

    if (isDeleting && completedDeleting) {
      setIsDeleting(false);
      setLineIndex((prev) => (prev + 1) % prompts.length);
      return;
    }

    const timeout = window.setTimeout(() => {
      setTypedLength((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? DELETE_SPEED_MS : TYPE_SPEED_MS);

    return () => window.clearTimeout(timeout);
  }, [isDeleting, isHolding, lineIndex, prompts, typedLength]);

  const line = prompts[lineIndex] ?? prompts[0];
  const visibleText = line.slice(0, Math.max(0, typedLength));

  return (
    <div className="pointer-events-none absolute left-1/2 top-[67%] z-30 w-[min(84vw,670px)] -translate-x-1/2 rounded-xl border border-cyan-200/35 bg-slate-950/60 px-4 py-3 shadow-[0_16px_52px_-26px_rgba(14,116,144,0.85),0_0_28px_rgba(56,189,248,0.18)] backdrop-blur-xl sm:px-5">
      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
        <span>signal terminal</span>
      </div>
      <p className="min-h-[1.5rem] font-mono text-sm text-cyan-50 sm:text-base">
        <span>{visibleText}</span>
        <span className="ml-[1px] inline-block h-[1.1em] w-[0.6ch] translate-y-[2px] animate-pulse bg-cyan-300/90 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
      </p>
    </div>
  );
};

export default TypewriterTerminal;
