import React from "react";

interface OriginExitControlsProps {
  onRequestExitHero?: () => void;
  onRequestExitConclusion?: () => void;
}

const OriginExitControls: React.FC<OriginExitControlsProps> = ({
  onRequestExitHero,
  onRequestExitConclusion,
}) => {
  return (
    <>
      <div className="pointer-events-auto absolute left-4 top-5 z-40 md:left-6 md:top-6">
        <button
          type="button"
          className="origin-exit-chip"
          onClick={() => onRequestExitHero?.()}
        >
          Return to Hero
        </button>
      </div>
      <div className="pointer-events-auto absolute right-4 top-5 z-40 md:right-6 md:top-6">
        <button
          type="button"
          className="origin-exit-chip"
          onClick={() => onRequestExitConclusion?.()}
        >
          Continue On
        </button>
      </div>
    </>
  );
};

export default OriginExitControls;
