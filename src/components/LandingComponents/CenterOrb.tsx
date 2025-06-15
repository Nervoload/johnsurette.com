import React from "react";
import { sections } from "../sections";

type CenterOrbProps = { label: string | null };

const CenterOrb: React.FC<CenterOrbProps> = ({ label }) => {
  // Find the matching section colour, defaulting to white
  const glowColor =
    sections.find((s) => s.name === label)?.color ?? "rgba(39, 35, 35, 0.8)";

  return (
    /* wrapper keeps orb perfectly centred */
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* aspect-square guarantees circle; 80% of parent size */}
      <div
        className="
          w-[80%] aspect-square rounded-full
          flex items-center justify-center
          bg-white/30 backdrop-blur-lg shadow-inner shadow-white/50
        "
        style={{
          boxShadow: `
            inset 0 0 30px rgba(255, 255, 255, 0.27),
            0 0 20px 4px ${glowColor}30    /* subtle halo around orb */
          `,
        }}
      >
        <span
          className="text-3xl font-bold font-sans"
          style={{
            textShadow: `
              0 0 4px ${glowColor}10,   /* inner glow */
              0 0 2px ${glowColor}15   /* outer spread */
            `,
            color: "rgba(20, 15, 69, 0.82)",            /* dark text for contrast */
            fontSize: "3vh"
          }}
        >
          {label ?? "John Surette"}
        </span>
      </div>
    </div>
  );
};

export default CenterOrb;
