import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TAU = Math.PI * 2;
const GLYPH_BANK = ["0", "1", "01", "10", "λ", "Σ", "∴", "∑", "∫", "µ", "⊕", "ア", "カ", "ツ"];

interface RainColumn {
  drift: number;
  glyphOffset: number;
  length: number;
  offset: number;
  size: number;
  speed: number;
  x: number;
}

interface NodePoint {
  x: number;
  y: number;
}

interface ComputationalCanvasPlaceholderProps {
  active?: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const smoothstep = (start: number, end: number, value: number) => {
  const x = clamp((value - start) / (end - start), 0, 1);
  return x * x * (3 - 2 * x);
};

const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

const roundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
};

const createRainColumns = (width: number) => {
  const count = Math.max(20, Math.min(44, Math.floor(width / 26)));

  return Array.from({ length: count }, (_, index) => ({
    drift: Math.sin(index * 1.37) * 8,
    glyphOffset: index * 5,
    length: 11 + (index % 7),
    offset: (index * 61) % 480,
    size: 10 + (index % 4) * 1.5,
    speed: 44 + (index % 6) * 10 + index * 0.55,
    x: ((index + 0.5) / count) * width,
  }));
};

const buildLayers = (width: number, height: number, counts: number[]) => {
  const left = width * 0.13;
  const right = width * 0.86;

  return counts.map((count, layerIndex) => {
    const x = mix(left, right, layerIndex / (counts.length - 1));
    const top = height * (layerIndex === 0 || layerIndex === counts.length - 1 ? 0.34 : 0.22);
    const bottom = height * (layerIndex === 0 || layerIndex === counts.length - 1 ? 0.66 : 0.78);

    return Array.from({ length: count }, (_, nodeIndex) => ({
      x,
      y: count === 1 ? height / 2 : mix(top, bottom, nodeIndex / (count - 1)),
    }));
  });
};

const strokeConnection = (
  context: CanvasRenderingContext2D,
  start: NodePoint,
  end: NodePoint,
  alpha: number,
  width: number,
) => {
  const midX = (start.x + end.x) / 2;

  context.beginPath();
  context.moveTo(start.x, start.y);
  context.bezierCurveTo(midX, start.y, midX, end.y, end.x, end.y);
  context.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
  context.lineWidth = width;
  context.stroke();
};

const drawRain = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  elapsedSeconds: number,
  columns: RainColumn[],
) => {
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";

  columns.forEach((column, columnIndex) => {
    context.font = `600 ${column.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    const travel = (elapsedSeconds * column.speed + column.offset) % (height + column.length * column.size * 1.45);
    const columnX = column.x + Math.sin(elapsedSeconds * 0.45 + columnIndex) * column.drift;

    for (let glyphIndex = 0; glyphIndex < column.length; glyphIndex += 1) {
      const y = travel - glyphIndex * column.size * 1.25 - 60;

      if (y < -40 || y > height + 40) {
        continue;
      }

      const headGlow = glyphIndex === 0 ? 0.62 : 0;
      const alpha = (1 - glyphIndex / column.length) * 0.24 + headGlow;
      const glyph = GLYPH_BANK[(column.glyphOffset + glyphIndex + Math.floor(elapsedSeconds * 9)) % GLYPH_BANK.length];

      context.fillStyle = `rgba(196, 248, 255, ${alpha})`;
      context.shadowColor = "rgba(34, 211, 238, 0.38)";
      context.shadowBlur = glyphIndex === 0 ? 18 : 0;
      context.fillText(glyph, columnX, y);
    }
  });

  context.restore();
};

const drawNode = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  glow: number,
) => {
  context.save();
  context.shadowColor = `rgba(56, 189, 248, ${0.35 * glow})`;
  context.shadowBlur = 22 * glow;
  context.fillStyle = `rgba(236, 254, 255, ${alpha})`;
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  context.fill();
  context.restore();
};

const drawSmallNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneTime: number,
  alpha: number,
) => {
  if (alpha <= 0.001) {
    return;
  }

  const spawn = smoothstep(0.2, 5.2, sceneTime);
  const exitZoom = smoothstep(4.8, 7.2, sceneTime);
  const zoom = mix(1.08, 0.92, exitZoom);
  const counts = [4, 4 + Math.round(spawn * 3), 5 + Math.round(spawn * 4), 4 + Math.round(spawn * 3), 2];
  const layers = buildLayers(width, height, counts);
  const pulseTravel = (sceneTime * 0.2) % 1;

  context.save();
  context.translate(width * 0.48, height * 0.5);
  context.scale(zoom, zoom);
  context.translate(-width * 0.48, -height * 0.5);

  layers.slice(0, -1).forEach((layer, layerIndex) => {
    const nextLayer = layers[layerIndex + 1];
    const segmentStart = layerIndex / (layers.length - 1);
    const segmentEnd = (layerIndex + 1) / (layers.length - 1);
    const pulseStrength = smoothstep(segmentStart - 0.08, segmentStart + 0.06, pulseTravel)
      * (1 - smoothstep(segmentEnd - 0.02, segmentEnd + 0.12, pulseTravel));

    layer.forEach((source, sourceIndex) => {
      nextLayer.forEach((target, targetIndex) => {
        const connectionAlpha = alpha * (0.06 + 0.12 * pulseStrength);
        const isHighlighted = (sourceIndex + targetIndex + layerIndex + Math.floor(sceneTime * 1.8)) % 3 !== 0;

        strokeConnection(context, source, target, connectionAlpha, 1);

        if (pulseStrength > 0.02 && isHighlighted) {
          strokeConnection(context, source, target, alpha * (0.12 + pulseStrength * 0.34), 1.8);
        }
      });
    });
  });

  layers.forEach((layer, layerIndex) => {
    const layerPulse = 1 - Math.abs(pulseTravel - layerIndex / (layers.length - 1)) * 4.6;

    layer.forEach((node, nodeIndex) => {
      const active = clamp(layerPulse + (((nodeIndex + layerIndex + Math.floor(sceneTime * 1.4)) % 4 === 0) ? 0.28 : 0), 0, 1);
      drawNode(context, node.x, node.y, layerIndex === layers.length - 1 ? 8 : 6, alpha * (0.28 + active * 0.72), 0.8 + active);
    });
  });

  context.restore();
};

const drawLargeModel = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneTime: number,
  alpha: number,
) => {
  if (alpha <= 0.001) {
    return;
  }

  const intro = smoothstep(0.3, 2.8, sceneTime);
  const zoom = mix(1.3, 0.98, intro);
  const layers = 13;
  const marginX = width * 0.1;
  const travel = (sceneTime * 0.15) % 1;

  context.save();
  context.translate(width * 0.5, height * 0.5);
  context.scale(zoom, zoom);
  context.translate(-width * 0.5, -height * 0.5);

  const sheetRects = Array.from({ length: layers }, (_, layerIndex) => {
    const x = mix(marginX, width - marginX, layerIndex / (layers - 1));
    const layerHeight = height * (0.52 + Math.sin(layerIndex * 0.7) * 0.07);
    const layerWidth = 18 + (layerIndex % 3) * 5;

    return {
      height: layerHeight,
      width: layerWidth,
      x,
      y: height * 0.5 - layerHeight / 2,
    };
  });

  sheetRects.slice(0, -1).forEach((sourceRect, layerIndex) => {
    const targetRect = sheetRects[layerIndex + 1];

    for (let bandIndex = 0; bandIndex < 8; bandIndex += 1) {
      const y1 = mix(sourceRect.y + 24, sourceRect.y + sourceRect.height - 24, bandIndex / 7);
      const y2 = mix(targetRect.y + 24, targetRect.y + targetRect.height - 24, (bandIndex + 0.5) / 8);
      const signal = 1 - Math.abs(travel - layerIndex / (layers - 1)) * 4.2;
      const bandAlpha = alpha * (0.05 + clamp(signal, 0, 1) * 0.26);

      context.beginPath();
      context.moveTo(sourceRect.x + sourceRect.width / 2, y1);
      context.bezierCurveTo(
        sourceRect.x + 34,
        y1 + Math.sin(layerIndex + bandIndex) * 16,
        targetRect.x - 34,
        y2 - Math.cos(layerIndex + bandIndex) * 16,
        targetRect.x - targetRect.width / 2,
        y2,
      );
      context.strokeStyle = `rgba(103, 232, 249, ${bandAlpha})`;
      context.lineWidth = 1.15 + clamp(signal, 0, 1) * 1.6;
      context.stroke();
    }
  });

  sheetRects.forEach((rect, layerIndex) => {
    const glow = 1 - Math.abs(travel - layerIndex / (layers - 1)) * 5;
    const fill = context.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
    fill.addColorStop(0, `rgba(15, 118, 110, ${alpha * 0.38})`);
    fill.addColorStop(0.5, `rgba(56, 189, 248, ${alpha * (0.18 + clamp(glow, 0, 1) * 0.18)})`);
    fill.addColorStop(1, `rgba(12, 18, 36, ${alpha * 0.92})`);

    context.save();
    context.shadowColor = `rgba(34, 211, 238, ${alpha * 0.38})`;
    context.shadowBlur = 26 * clamp(glow, 0.2, 1.1);
    roundRect(context, rect.x - rect.width / 2, rect.y, rect.width, rect.height, rect.width / 2);
    context.fillStyle = fill;
    context.fill();
    context.restore();
  });

  const dotFade = 1 - smoothstep(1.4, 3.4, sceneTime);
  if (dotFade > 0.001) {
    sheetRects.forEach((rect, layerIndex) => {
      const rows = 6 + (layerIndex % 4);

      for (let dotIndex = 0; dotIndex < rows; dotIndex += 1) {
        drawNode(
          context,
          rect.x + Math.sin(dotIndex + layerIndex) * 2,
          mix(rect.y + 18, rect.y + rect.height - 18, rows === 1 ? 0.5 : dotIndex / (rows - 1)),
          2.6,
          alpha * dotFade * 0.42,
          0.45,
        );
      }
    });
  }

  context.restore();
};

const createBrainPath = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const centerX = width * 0.52;
  const centerY = height * 0.52;
  const brainWidth = width * 0.55;
  const brainHeight = height * 0.52;

  context.beginPath();
  context.moveTo(centerX - brainWidth * 0.48, centerY - brainHeight * 0.03);
  context.bezierCurveTo(
    centerX - brainWidth * 0.52,
    centerY - brainHeight * 0.46,
    centerX - brainWidth * 0.12,
    centerY - brainHeight * 0.58,
    centerX + brainWidth * 0.16,
    centerY - brainHeight * 0.48,
  );
  context.bezierCurveTo(
    centerX + brainWidth * 0.46,
    centerY - brainHeight * 0.38,
    centerX + brainWidth * 0.52,
    centerY - brainHeight * 0.08,
    centerX + brainWidth * 0.44,
    centerY + brainHeight * 0.12,
  );
  context.bezierCurveTo(
    centerX + brainWidth * 0.38,
    centerY + brainHeight * 0.32,
    centerX + brainWidth * 0.14,
    centerY + brainHeight * 0.44,
    centerX - brainWidth * 0.16,
    centerY + brainHeight * 0.42,
  );
  context.bezierCurveTo(
    centerX - brainWidth * 0.38,
    centerY + brainHeight * 0.4,
    centerX - brainWidth * 0.52,
    centerY + brainHeight * 0.22,
    centerX - brainWidth * 0.48,
    centerY - brainHeight * 0.03,
  );
  context.closePath();
};

const drawBrainSlice = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneTime: number,
  alpha: number,
) => {
  if (alpha <= 0.001) {
    return;
  }

  context.save();
  createBrainPath(context, width, height);

  const fill = context.createLinearGradient(width * 0.32, height * 0.22, width * 0.72, height * 0.86);
  fill.addColorStop(0, `rgba(16, 185, 129, ${alpha * 0.18})`);
  fill.addColorStop(0.45, `rgba(14, 116, 144, ${alpha * 0.16})`);
  fill.addColorStop(1, `rgba(2, 6, 23, ${alpha * 0.82})`);

  context.fillStyle = fill;
  context.shadowColor = `rgba(34, 211, 238, ${alpha * 0.22})`;
  context.shadowBlur = 30;
  context.fill();

  context.strokeStyle = `rgba(167, 243, 255, ${alpha * 0.24})`;
  context.lineWidth = 2;
  context.stroke();

  context.clip();

  const waveOffset = (sceneTime * 90) % (height + 140);

  for (let laneIndex = 0; laneIndex < 18; laneIndex += 1) {
    const baseX = mix(width * 0.3, width * 0.73, laneIndex / 17);

    context.beginPath();

    for (let step = 0; step <= 28; step += 1) {
      const y = mix(height * 0.18, height * 0.86, step / 28);
      const sway = Math.sin(step * 0.68 + sceneTime * 1.35 + laneIndex * 0.7) * (10 + (laneIndex % 3) * 2);
      const x = baseX + sway;

      if (step === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.strokeStyle = `rgba(103, 232, 249, ${alpha * 0.13})`;
    context.lineWidth = laneIndex % 4 === 0 ? 2.6 : 1.5;
    context.stroke();

    const pulseY = ((waveOffset + laneIndex * 26) % (height + 120)) - 30;
    const pulseX = baseX + Math.sin((pulseY / 28) + sceneTime * 1.35 + laneIndex * 0.7) * (10 + (laneIndex % 3) * 2);

    context.save();
    context.shadowColor = `rgba(34, 211, 238, ${alpha * 0.52})`;
    context.shadowBlur = 24;
    context.fillStyle = `rgba(232, 253, 255, ${alpha * 0.7})`;
    context.beginPath();
    context.arc(pulseX, pulseY, 3.2 + (laneIndex % 3), 0, TAU);
    context.fill();
    context.restore();
  }

  for (let bandIndex = 0; bandIndex < 7; bandIndex += 1) {
    const y = height * (0.28 + bandIndex * 0.08);
    context.beginPath();
    context.moveTo(width * 0.28, y);
    context.bezierCurveTo(width * 0.38, y - 18, width * 0.56, y + 10, width * 0.74, y - 12);
    context.strokeStyle = `rgba(186, 230, 253, ${alpha * 0.06})`;
    context.lineWidth = 1.2;
    context.stroke();
  }

  context.restore();
};

const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);
};

const ComputationalCanvasPlaceholder: React.FC<ComputationalCanvasPlaceholderProps> = ({ active = true }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const columnsRef = useRef<RainColumn[]>([]);
  const sceneStartRef = useRef<number | null>(null);
  const lastDrawRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let width = 0;
    let height = 0;

    const stopAnimation = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (canvas.width > 0 && canvas.height > 0) {
        clearCanvas(context, canvas.width, canvas.height);
      }
    };

    const resizeCanvas = () => {
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      columnsRef.current = createRainColumns(width);
      if (!active) {
        clearCanvas(context, canvas.width, canvas.height);
      }
    };

    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });

    observer.observe(wrapper);

    const drawFrame = (timestamp: number) => {
      if (!active) {
        stopAnimation();
        return;
      }

      if (sceneStartRef.current === null) {
        sceneStartRef.current = timestamp;
      }

      if (!reduceMotion) {
        const targetFrameMs = 1000 / 30;
        if (timestamp - lastDrawRef.current < targetFrameMs) {
          frameRef.current = window.requestAnimationFrame(drawFrame);
          return;
        }
        lastDrawRef.current = timestamp;
      }

      const seconds = timestamp / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      const loop = 18;
      const sceneTime = ((timestamp - sceneStartRef.current) / 1000) % loop;
      const smallAlpha = 1 - smoothstep(5.4, 7.8, sceneTime);
      const modelAlpha = smoothstep(5.3, 7.4, sceneTime) * (1 - smoothstep(11.8, 13.9, sceneTime));
      const brainAlpha = smoothstep(11.7, 13.8, sceneTime);

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.fillStyle = "rgba(2, 6, 23, 0.18)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const backgroundGlow = context.createRadialGradient(width * 0.22, height * 0.18, 0, width * 0.22, height * 0.18, width * 0.45);
      backgroundGlow.addColorStop(0, "rgba(34, 211, 238, 0.12)");
      backgroundGlow.addColorStop(1, "rgba(34, 211, 238, 0)");
      context.fillStyle = backgroundGlow;
      context.fillRect(0, 0, width, height);

      const secondaryGlow = context.createRadialGradient(width * 0.8, height * 0.24, 0, width * 0.8, height * 0.24, width * 0.35);
      secondaryGlow.addColorStop(0, "rgba(129, 140, 248, 0.13)");
      secondaryGlow.addColorStop(1, "rgba(129, 140, 248, 0)");
      context.fillStyle = secondaryGlow;
      context.fillRect(0, 0, width, height);

      drawRain(context, width, height, seconds, columnsRef.current);
      drawSmallNetwork(context, width, height, sceneTime, smallAlpha);
      drawLargeModel(context, width, height, Math.max(0, sceneTime - 5.5), modelAlpha);
      drawBrainSlice(context, width, height, Math.max(0, sceneTime - 11.8), brainAlpha);

      const vignette = context.createLinearGradient(0, 0, 0, height);
      vignette.addColorStop(0, "rgba(2, 6, 23, 0.18)");
      vignette.addColorStop(0.5, "rgba(2, 6, 23, 0)");
      vignette.addColorStop(1, "rgba(2, 6, 23, 0.32)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      if (!reduceMotion) {
        frameRef.current = window.requestAnimationFrame(drawFrame);
      }
    };

    if (active) {
      frameRef.current = window.requestAnimationFrame(drawFrame);
    } else {
      stopAnimation();
    }

    return () => {
      observer.disconnect();
      stopAnimation();
    };
  }, [active, reduceMotion]);

  useEffect(() => {
    if (!active) {
      sceneStartRef.current = null;
      lastDrawRef.current = 0;
    }
  }, [active]);

  return (
    <motion.div
      ref={wrapperRef}
      className="relative h-[72vh] min-h-[34rem] overflow-hidden rounded-[2.4rem] bg-transparent shadow-[0_0_120px_rgba(15,23,42,0.18)] sm:h-[76vh] lg:h-[82vh]"
      initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(34,211,238,0.15),transparent_32%),radial-gradient(circle_at_70%_26%,rgba(99,102,241,0.14),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.22),rgba(2,6,23,0.7)_54%,rgba(2,6,23,0.88))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/72 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/82 to-transparent" />

      <div className="pointer-events-none absolute left-[7%] top-[12%] h-[24%] w-[42%] rounded-full bg-cyan-300/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[20%] h-[22%] w-[28%] rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[10%] left-[18%] h-[16%] w-[36%] rounded-full bg-emerald-300/8 blur-3xl" />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

      <div className="pointer-events-none absolute inset-x-6 bottom-6 flex flex-wrap gap-2 sm:inset-x-8 sm:bottom-8">
        {["small network", "large model", "brain-like dynamics"].map((label) => (
          <span
            key={label}
            className="rounded-full border border-cyan-300/20 bg-slate-950/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/72 backdrop-blur-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ComputationalCanvasPlaceholder;
