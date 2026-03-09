import React, { useEffect, useMemo, useState } from "react";
import { landingTerminalPrompts } from "./terminalPrompts";
import { resolveShadowStyleTokens } from "../theme/shadowAssetRegistry";
import { ShadowMode } from "../theme/shadowMode";

interface TypewriterTerminalProps {
  activeSection: string | null;
  shadowMode: ShadowMode;
}

const TYPE_SPEED_MS = 52;
const DELETE_SPEED_MS = 26;
const HOLD_MS = 1200;

const pickNextIndex = (length: number, currentIndex: number): number => {
  if (length <= 1) return 0;
  const next = Math.floor(Math.random() * (length - 1));
  return next >= currentIndex ? next + 1 : next;
};

const TypewriterTerminal: React.FC<TypewriterTerminalProps> = ({ activeSection, shadowMode }) => {
  const prompts = useMemo(
    () => (activeSection ? [`Focused route: ${activeSection}`, ...landingTerminalPrompts] : landingTerminalPrompts),
    [activeSection]
  );
  const shadowTokens = useMemo(
    () => resolveShadowStyleTokens("heroTerminalText", shadowMode),
    [shadowMode]
  );
  const shadowStyle = useMemo(
    () =>
      ({
        "--asset-shadow-rgba": shadowTokens.rgba,
        "--asset-shadow-blur": `${shadowTokens.blurPx}px`,
      } as React.CSSProperties),
    [shadowTokens]
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    setLineIndex(Math.floor(Math.random() * prompts.length));
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
      setLineIndex((prev) => pickNextIndex(prompts.length, prev));
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
    <div
      className="pointer-events-none absolute left-1/2 top-[74%] z-30 w-[min(92vw,860px)] -translate-x-1/2 px-4 text-center sm:px-6"
      style={shadowStyle}
    >
      <p className="asset-shadow-text theme-hero-terminal-text min-h-[2rem] font-mono text-[clamp(1.05rem,2.05vw,1.62rem)] font-medium tracking-[0.02em]">
        <span>{visibleText}</span>
        <span className="asset-shadow-surface theme-hero-terminal-cursor ml-[2px] inline-block h-[1.08em] w-[0.56ch] translate-y-[2px] animate-pulse" />
      </p>
    </div>
  );
};

export default TypewriterTerminal;
