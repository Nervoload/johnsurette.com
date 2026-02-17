import {
  type BehaviorProfile,
  type BioticParticle,
  type BioticSimulation,
  type EmissionParticle,
  type TrailPoint,
} from "./types";

const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const hsla = (h: number, s: number, l: number, a: number): string =>
  `hsla(${((h % 360) + 360) % 360},${clamp(s, 0, 100)}%,${clamp(l, 0, 100)}%,${clamp(a, 0, 1)})`;

const getProfile = (sim: BioticSimulation, particle: BioticParticle): BehaviorProfile => {
  const bank = sim.profiles[particle.classType];
  return bank[particle.profileIndex] ?? bank[0];
};

const depthScale = (particle: BioticParticle): number => 0.55 + particle.z * 0.95;

const getParticleColor = (
  particle: BioticParticle,
  profile: BehaviorProfile
): { hue: number; saturation: number; lightness: number } => ({
  hue: profile.shape.hue + particle.hueOffset,
  saturation: clamp(profile.shape.saturation + particle.saturationOffset, 16, 98),
  lightness: clamp(profile.shape.lightness + particle.lightnessOffset, 22, 92),
});

const pointToPx = (sim: BioticSimulation, point: TrailPoint): { x: number; y: number } => ({
  x: point.nx * sim.width,
  y: point.ny * sim.height,
});

const particleToPx = (sim: BioticSimulation, particle: BioticParticle): { x: number; y: number } => ({
  x: particle.nx * sim.width,
  y: particle.ny * sim.height,
});

const beginCapsulePath = (ctx: CanvasRenderingContext2D, length: number, thickness: number): void => {
  const radius = thickness * 0.5;
  const halfLength = Math.max(radius, length * 0.5);

  ctx.beginPath();
  ctx.moveTo(-halfLength + radius, -radius);
  ctx.lineTo(halfLength - radius, -radius);
  ctx.arc(halfLength - radius, 0, radius, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(-halfLength + radius, radius);
  ctx.arc(-halfLength + radius, 0, radius, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
};

const drawTrail = (
  ctx: CanvasRenderingContext2D,
  sim: BioticSimulation,
  particle: BioticParticle,
  profile: BehaviorProfile
): void => {
  if (particle.trail.length < 4) return;

  const points = particle.trail;
  const headSkip = 2;
  const totalSegments = points.length - 1 - headSkip;
  if (totalSegments <= 1) return;
  const dScale = depthScale(particle);
  const baseWidth = (profile.shape.trailWidth ?? 1.3) * dScale * 1.3;
  const baseAlpha = profile.shape.alpha * (0.34 + particle.z * 0.78);
  const color = getParticleColor(particle, profile);
  const hue = color.hue;
  const saturation = color.saturation;
  const lightness = color.lightness;

  for (let index = 1; index <= totalSegments; index++) {
    const from = points[index - 1];
    const to = points[index];
    const diffX = Math.abs(to.nx - from.nx);
    const diffY = Math.abs(to.ny - from.ny);

    if (diffX > 0.25 || diffY > 0.25) {
      continue;
    }

    const fromPx = pointToPx(sim, from);
    const toPx = pointToPx(sim, to);
    const progress = index / totalSegments;
    const tailStrength = 1 - progress;
    const alpha = baseAlpha * (0.22 + tailStrength * 0.92);

    ctx.strokeStyle = hsla(hue + progress * 8, saturation, lightness + 14, alpha * 0.42);
    ctx.lineWidth = baseWidth * (0.6 + tailStrength * 1.28);
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(fromPx.x, fromPx.y);
    ctx.lineTo(toPx.x, toPx.y);
    ctx.stroke();

    ctx.strokeStyle = hsla(hue + progress * 8, saturation, lightness + 7, alpha);
    ctx.lineWidth = baseWidth * (0.34 + tailStrength * 0.82);
    ctx.beginPath();
    ctx.moveTo(fromPx.x, fromPx.y);
    ctx.lineTo(toPx.x, toPx.y);
    ctx.stroke();
  }
};

const drawEmission = (
  ctx: CanvasRenderingContext2D,
  sim: BioticSimulation,
  emission: EmissionParticle,
  parentDepth: number
): void => {
  const life = clamp(emission.ttl / Math.max(emission.life, 0.0001), 0, 1);
  const x = emission.nx * sim.width;
  const y = emission.ny * sim.height;
  const tailX = x - emission.vx * sim.width * 0.045;
  const tailY = y - emission.vy * sim.height * 0.045;
  const radius = emission.size * (0.7 + life * 0.6) * (0.65 + parentDepth * 0.55);
  const alpha = emission.alpha * life * (0.35 + parentDepth * 0.8);

  ctx.strokeStyle = hsla(emission.hue + 10, emission.saturation, emission.lightness + 4, alpha * 0.8);
  ctx.lineWidth = Math.max(0.8, radius * 0.45);
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(x, y);
  ctx.stroke();
};

const drawBacteria = (
  ctx: CanvasRenderingContext2D,
  sim: BioticSimulation,
  particle: BioticParticle,
  profile: BehaviorProfile,
  x: number,
  y: number
): void => {
  const dScale = depthScale(particle);
  const cells = particle.bacteria?.subCells ?? [{ offsetX: 0, offsetY: 0, vx: 0, vy: 0, scale: 1 }];
  const color = getParticleColor(particle, profile);
  const hue = color.hue;
  const saturation = color.saturation;
  const lightness = color.lightness;
  const alpha = profile.shape.alpha * (0.35 + particle.z * 0.75);
  const group = particle.bacteria;

  for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const cell = cells[cellIndex];
    const capsuleLength = (profile.shape.length ?? profile.shape.size * 2.1) * cell.scale * dScale;
    const capsuleThickness = (profile.shape.thickness ?? profile.shape.size * 0.45) * cell.scale * dScale;
    const localRotation = particle.rotation + cellIndex * 0.2;

    ctx.save();
    ctx.translate(x + cell.offsetX * dScale, y + cell.offsetY * dScale);
    ctx.rotate(localRotation);
    beginCapsulePath(ctx, capsuleLength, capsuleThickness);
    ctx.fillStyle = hsla(hue + cellIndex * 5, saturation, lightness + 2, alpha);
    ctx.shadowColor = hsla(hue + 8, saturation, lightness + 10, alpha * 0.45);
    ctx.shadowBlur = 8 * dScale;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = hsla(hue - 8, saturation - 8, lightness - 6, alpha * 0.9);
    ctx.lineWidth = Math.max(0.65, capsuleThickness * 0.14);
    ctx.stroke();

    if (group?.hasFlagella && cellIndex < group.flagellaCount) {
      const strandCount = 1 + (cellIndex % 2);
      const baseX = -capsuleLength * 0.52;
      const strandLength = group.flagellaLength * cell.scale * dScale;
      const phaseBase = group.flagellaPhase + cellIndex * 0.9 + sim.time * 0.35;

      for (let strandIndex = 0; strandIndex < strandCount; strandIndex++) {
        const segCount = 6;
        const startY = ((strandIndex / Math.max(1, strandCount - 1)) - 0.5) * capsuleThickness * 0.72;
        ctx.beginPath();
        ctx.moveTo(baseX, startY);

        for (let seg = 1; seg <= segCount; seg++) {
          const t = seg / segCount;
          const px = baseX - strandLength * t;
          const wave =
            Math.sin(phaseBase + t * 7 + strandIndex * 1.4) *
            capsuleThickness *
            (0.18 + t * 0.44);
          ctx.lineTo(px, startY + wave);
        }

        ctx.strokeStyle = hsla(hue + 18, saturation - 8, lightness + 6, alpha * 0.84);
        ctx.lineWidth = Math.max(0.45, capsuleThickness * 0.11);
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }

    ctx.restore();
  }
};

const drawBacteriophage = (
  ctx: CanvasRenderingContext2D,
  sim: BioticSimulation,
  particle: BioticParticle,
  profile: BehaviorProfile,
  x: number,
  y: number
): void => {
  const dScale = depthScale(particle);
  const radius = (profile.shape.headRadius ?? profile.shape.size * 0.5) * dScale;
  const tailLength = (profile.shape.tailLength ?? profile.shape.size * 1.3) * dScale;
  const tailSegments = 6;
  const alpha = profile.shape.alpha * (0.32 + particle.z * 0.72);
  const flutter = Math.sin((particle.bacteriophage?.flutterPhase ?? 0) + sim.time * 1.2);
  const color = getParticleColor(particle, profile);
  const hue = color.hue;
  const saturation = color.saturation;
  const lightness = color.lightness;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(particle.rotation + flutter * 0.08);
  ctx.shadowColor = hsla(hue + 10, saturation, lightness + 8, alpha * 0.5);
  ctx.shadowBlur = 7 * dScale;

  ctx.beginPath();
  for (let index = 0; index < 8; index++) {
    const angle = (index / 8) * TAU + Math.PI / 8;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (index === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fillStyle = hsla(hue, saturation, lightness + 6, alpha);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = hsla(hue + 12, saturation + 4, lightness + 12, alpha * 0.95);
  ctx.lineWidth = Math.max(0.9, radius * 0.24);
  ctx.stroke();

  const tailStartX = radius * 0.85;
  const tailEndX = tailStartX + tailLength;
  const phase = particle.bacteriophage?.flutterPhase ?? 0;
  const waveAmplitude = (1.1 + (particle.bacteriophage?.tailJitter ?? 0.7) * 1.2) * dScale;

  ctx.beginPath();
  ctx.moveTo(tailStartX, 0);
  for (let segment = 1; segment <= tailSegments; segment++) {
    const t = segment / tailSegments;
    const tailX = tailStartX + (tailEndX - tailStartX) * t;
    const tailY = Math.sin(sim.time * 3.3 + phase + segment * 0.85) * waveAmplitude * (0.2 + t * 0.8);
    ctx.lineTo(tailX, tailY);
  }
  ctx.strokeStyle = hsla(hue + 8, saturation - 4, lightness + 4, alpha * 0.9);
  ctx.lineWidth = Math.max(0.85, radius * 0.17);
  ctx.stroke();

  ctx.restore();
};

const drawViralEnvelope = (
  ctx: CanvasRenderingContext2D,
  sim: BioticSimulation,
  particle: BioticParticle,
  profile: BehaviorProfile,
  x: number,
  y: number
): void => {
  const dScale = depthScale(particle);
  const radius = (profile.shape.size ?? 10) * 0.58 * dScale;
  const protrusions = clamp(Math.round(profile.shape.protrusions ?? 10), 6, 20);
  const protrusionLength = (profile.shape.protrusionLength ?? 2.4) * dScale;
  const alpha = profile.shape.alpha * (0.34 + particle.z * 0.74);
  const wobble = particle.viralEnvelope?.protrusionWobble ?? sim.time;
  const color = getParticleColor(particle, profile);
  const hue = color.hue;
  const saturation = color.saturation;
  const lightness = color.lightness;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(particle.rotation * 0.4);

  ctx.strokeStyle = hsla(hue + 8, saturation + 4, lightness + 8, alpha * 0.8);
  ctx.lineWidth = Math.max(0.7, radius * 0.16);

  for (let index = 0; index < protrusions; index++) {
    const t = index / protrusions;
    const angle = t * TAU + wobble * 0.28;
    const fromX = Math.cos(angle) * radius;
    const fromY = Math.sin(angle) * radius;
    const wobbleScale = 0.8 + Math.sin(sim.time * 1.6 + index * 0.7 + wobble) * 0.22;
    const outRadius = radius + protrusionLength * wobbleScale;
    const toX = Math.cos(angle) * outRadius;
    const toY = Math.sin(angle) * outRadius;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  ctx.shadowColor = hsla(hue + 8, saturation + 2, lightness + 10, alpha * 0.42);
  ctx.shadowBlur = 9 * dScale;
  ctx.fillStyle = hsla(hue, saturation, lightness + 4, alpha * 0.22);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TAU);
  ctx.arc(0, 0, radius * 0.56, 0, TAU, true);
  ctx.fill("evenodd");
  ctx.shadowBlur = 0;
  ctx.strokeStyle = hsla(hue - 4, saturation - 8, lightness - 4, alpha * 0.92);
  ctx.lineWidth = Math.max(0.9, radius * 0.18);
  ctx.stroke();

  ctx.restore();
};

const drawAmoeba = (
  ctx: CanvasRenderingContext2D,
  sim: BioticSimulation,
  particle: BioticParticle,
  profile: BehaviorProfile,
  x: number,
  y: number
): void => {
  const dScale = depthScale(particle);
  const baseRadius = (profile.shape.size ?? 11) * 0.66 * dScale;
  const lobeCount = clamp(Math.round(profile.shape.lobeCount ?? 10), 6, 18);
  const roughness = clamp(profile.shape.roughness ?? 0.15, 0.02, 0.38);
  const alpha = profile.shape.alpha * (0.3 + particle.z * 0.7);
  const pulse = 1 + Math.sin((particle.amoeba?.pulsePhase ?? 0) + sim.time * 0.8) * 0.1;
  const color = getParticleColor(particle, profile);
  const hue = color.hue;
  const saturation = color.saturation;
  const lightness = color.lightness;

  const points: Array<{ x: number; y: number }> = [];
  for (let index = 0; index < lobeCount; index++) {
    const angle = (index / lobeCount) * TAU;
    const n1 = Math.sin(angle * 2 + sim.time * 1.4 + particle.id * 0.37);
    const n2 = Math.sin(angle * 5 - sim.time * 0.9 + particle.id * 0.11);
    const noise = 1 + roughness * (n1 * 0.65 + n2 * 0.35);
    const radius = baseRadius * pulse * noise;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(particle.rotation * 0.35);
  ctx.beginPath();
  for (let index = 0; index < points.length; index++) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const midX = (current.x + next.x) * 0.5;
    const midY = (current.y + next.y) * 0.5;
    if (index === 0) {
      ctx.moveTo(midX, midY);
    } else {
      ctx.quadraticCurveTo(current.x, current.y, midX, midY);
    }
  }
  ctx.closePath();

  ctx.shadowColor = hsla(hue + 10, saturation + 2, lightness + 8, alpha * 0.45);
  ctx.shadowBlur = 10 * dScale;
  ctx.fillStyle = hsla(hue, saturation, lightness + 1, alpha);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = hsla(hue - 6, saturation - 12, lightness - 8, alpha * 0.9);
  ctx.lineWidth = Math.max(0.8, baseRadius * 0.16);
  ctx.stroke();
  ctx.restore();
};

const drawParticleBody = (ctx: CanvasRenderingContext2D, sim: BioticSimulation, particle: BioticParticle): void => {
  const profile = getProfile(sim, particle);
  const { x, y } = particleToPx(sim, particle);

  if (particle.classType === "bacteria") {
    drawBacteria(ctx, sim, particle, profile, x, y);
    return;
  }

  if (particle.classType === "bacteriophage") {
    drawBacteriophage(ctx, sim, particle, profile, x, y);
    return;
  }

  if (particle.classType === "viralEnvelope") {
    drawViralEnvelope(ctx, sim, particle, profile, x, y);
    return;
  }

  drawAmoeba(ctx, sim, particle, profile, x, y);
};

const drawParticleTrails = (ctx: CanvasRenderingContext2D, sim: BioticSimulation, particle: BioticParticle): void => {
  const profile = getProfile(sim, particle);
  drawTrail(ctx, sim, particle, profile);

  if (particle.classType === "viralEnvelope" && particle.viralEnvelope) {
    for (let index = 0; index < particle.viralEnvelope.emissions.length; index++) {
      drawEmission(ctx, sim, particle.viralEnvelope.emissions[index], particle.z);
    }
  }
};

const getDepthSorted = (sim: BioticSimulation): BioticParticle[] => {
  const sorted = sim.particles.slice();
  sorted.sort((a, b) => a.z - b.z);
  return sorted;
};

export const drawSimulation = (ctx: CanvasRenderingContext2D, sim: BioticSimulation): void => {
  ctx.clearRect(0, 0, sim.width, sim.height);
  const particles = getDepthSorted(sim);

  for (let index = 0; index < particles.length; index++) {
    drawParticleBody(ctx, sim, particles[index]);
  }
};
