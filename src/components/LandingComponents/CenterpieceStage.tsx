import React, { useEffect, useRef, useState } from "react";
import TypewriterTerminal from "./TypewriterTerminal";
import { CenterpieceProps, PointerVector } from "./centerpieceTypes";

interface CenterpieceStageProps {
  activeSection: string | null;
  centerpiece: React.ComponentType<CenterpieceProps>;
}

const INTRO_MS = 1700;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const CenterpieceStage: React.FC<CenterpieceStageProps> = ({ activeSection, centerpiece: Centerpiece }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<PointerVector>({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / INTRO_MS);
      setIntroProgress(easeOutCubic(t));
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

    setPointer({
      x: Math.max(-1, Math.min(1, normalizedX)),
      y: Math.max(-1, Math.min(1, normalizedY)),
    });
  };

  return (
    <div className="relative h-[clamp(260px,74vmin,720px)] w-[clamp(260px,74vmin,720px)]">
      <div className="pointer-events-none absolute inset-[-24%] rounded-full bg-[radial-gradient(circle_at_40%_30%,rgba(56,189,248,0.25),rgba(99,102,241,0.17)_36%,rgba(217,70,239,0.14)_54%,rgba(2,6,23,0)_75%)] blur-[40px]" />
      <div className="pointer-events-none absolute inset-[-8%] stage-flow-ring" />
      <div className="pointer-events-none absolute inset-[2%] stage-flow-ring-alt" />
      <div
        ref={stageRef}
        className="relative h-full w-full overflow-hidden rounded-full border border-cyan-200/10 bg-[radial-gradient(circle_at_50%_36%,rgba(30,41,59,0.72),rgba(15,23,42,0.62)_44%,rgba(2,6,23,0.42)_100%)] shadow-[0_55px_140px_-85px_rgba(14,116,144,0.82),inset_0_0_80px_rgba(56,189,248,0.08)]"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false);
          setPressed(false);
          setPointer({ x: 0, y: 0 });
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerMove={handlePointerMove}
      >
        <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_34%,rgba(56,189,248,0.06),rgba(15,23,42,0.03)_46%,rgba(2,6,23,0.08)_100%)] backdrop-blur-[1px]" />

        <div className="absolute inset-0 z-10">
          <Centerpiece
            activeSection={activeSection}
            pointer={pointer}
            hovering={hovering}
            pressed={pressed}
            introProgress={introProgress}
          />
        </div>
      </div>

      <TypewriterTerminal activeSection={activeSection} />
    </div>
  );
};

export default CenterpieceStage;
