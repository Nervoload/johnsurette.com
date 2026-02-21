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
      <div className="pointer-events-auto absolute left-4 top-5 z-40">
        <button
          type="button"
          className="origin-exit-chip"
          onClick={() => onRequestExitHero?.()}
        >
          Back to Hero
        </button>
      </div>
      <div className="pointer-events-auto absolute bottom-5 right-4 z-40">
        <button
          type="button"
          className="origin-exit-chip"
          onClick={() => onRequestExitConclusion?.()}
        >
          Continue to Conclusion
        </button>
      </div>
    </>
  );
};

export default OriginExitControls;
