import React, { useMemo } from "react";
import { sections } from "../sections";

type Props = {
  onHover:  (name: string | null) => void;
  onSelect: (name: string) => void;
  innerRadiusPct?: number; // defaults to 40 (matches ring mask)
};

const SectionLayer: React.FC<Props> = ({
  innerRadiusPct = 38,
  onHover,
  onSelect,
}) => {
  const outer = 70;
  const count = sections.length;

  const slice = 360 / count;
  const angleOffset = -90 - slice / 2; // match GradientRing

  const slices = useMemo(() => {
    const pt = (a: number, r: number) => {
      const rad = ((a - 90) * Math.PI) / 180;
      return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
    };

    return sections.map((sec, i) => {
      const a0 = angleOffset + i * slice;     // start of this section
      const a1 = a0  + slice;         // end of this section
      const p1 = pt(a0, innerRadiusPct);
      const p2 = pt(a0, outer);
      const p3 = pt(a1, outer);
      const p4 = pt(a1, innerRadiusPct);

      return {
        name: sec.name,
        poly: `polygon(${p1.x}% ${p1.y}%, ${p2.x}% ${p2.y}%, 
                       ${p3.x}% ${p3.y}%, ${p4.x}% ${p4.y}%)`,
      };
    });
  }, [count, innerRadiusPct, angleOffset, slice]);

  return (
    <div className="absolute inset-0 z-10">
      {slices.map((s) => (
        <div
          key={s.name}
          className="absolute inset-0 cursor-pointer"
          style={{ clipPath: s.poly }}
          onMouseEnter={() => onHover(s.name)}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect(s.name)}
        />
      ))}
    </div>
  );
};

export default SectionLayer;
