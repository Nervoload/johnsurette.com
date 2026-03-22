import React, { useEffect, useRef, useState } from "react";
import TypewriterTerminal from "./TypewriterTerminal";
import { CenterpieceProps, PointerVector } from "./centerpieceTypes";
import { ShadowAssetId } from "../theme/shadowAssetRegistry";
import { ShadowMode } from "../theme/shadowMode";
import { createCodexProbeAttributes } from "../../devtools/codexContext/probe";

interface CenterpieceStageProps {
  activeSection: string | null;
  centerpiece: React.ComponentType<CenterpieceProps>;
  shadowMode: ShadowMode;
  shadowAssetId?: ShadowAssetId;
}

const INTRO_MS = 1700;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const CenterpieceStage: React.FC<CenterpieceStageProps> = ({
  activeSection,
  centerpiece: Centerpiece,
  shadowMode,
  shadowAssetId = "heroCenterpiece",
}) => {
  const stageProbe = createCodexProbeAttributes({
    componentName: "CenterpieceStage",
    filePath: "/src/components/LandingComponents/CenterpieceStage.tsx",
    componentPath: ["LandingPage", "LandingContent", "CenterpieceStage"],
    role: "interactive-stage",
  });

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
    <div
      {...stageProbe}
      className="relative h-[clamp(220px,65vmin,720px)] w-[clamp(220px,65vmin,720px)] sm:h-[clamp(260px,74vmin,720px)] sm:w-[clamp(260px,74vmin,720px)]"
    >
      <div
        ref={stageRef}
        className="relative h-full w-full touch-pan-y"
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
        <div className="absolute left-1/2 top-1/2 z-10 h-[114%] w-[136%] -translate-x-1/2 -translate-y-1/2">
          <Centerpiece
            activeSection={activeSection}
            pointer={pointer}
            hovering={hovering}
            pressed={pressed}
            introProgress={introProgress}
            shadowMode={shadowMode}
            shadowAssetId={shadowAssetId}
          />
        </div>
      </div>

      <TypewriterTerminal activeSection={activeSection} shadowMode={shadowMode} />
    </div>
  );
};

export default CenterpieceStage;
