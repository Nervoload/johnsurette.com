import {
  CLASS_DISTRIBUTION,
  CLASS_MOTION_RANGES,
  CLASS_SHAPE_RANGES,
  DENSITY_PRESETS,
  FLOW_PX_PER_SEC_MAX,
  FLOW_PX_PER_SEC_MIN,
  PALETTE_RANGES,
  SHAPE_PROFILE_COUNT,
  type DensityConfig,
} from "./config";
import { randomFromState, randomInt, randomRange, seedFor } from "./rng";
import {
  type BacteriaSubCell,
  type BehaviorProfile,
  type BioticClass,
  type BioticParticle,
  type BioticSimulation,
  type CreateSimulationOptions,
  type DensityPreset,
  type ProfilesByClass,
} from "./types";

const CLASS_SEED_OFFSET: Record<BioticClass, number> = {
  bacteria: 11,
  bacteriophage: 29,
  viralEnvelope: 47,
  amoeba: 83,
};

const PALETTE_SEED_OFFSET = {
  biotic: 7,
  labBlue: 31,
  neon: 59,
};

const PRESET_SEED_OFFSET: Record<DensityPreset, number> = {
  low: 17,
  balanced: 41,
  high: 73,
};

const GRID_CELL_SIZE = 72;

const ROTATION_SPEED_RANGE: Record<BioticClass, { min: number; max: number }> = {
  bacteria: { min: -0.16, max: 0.16 },
  bacteriophage: { min: -0.34, max: 0.34 },
  viralEnvelope: { min: -0.24, max: 0.24 },
  amoeba: { min: -0.12, max: 0.12 },
};

const ROTATION_SCALE: Record<BioticClass, number> = {
  bacteria: 0.34,
  bacteriophage: 1,
  viralEnvelope: 0.7,
  amoeba: 0.52,
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const pickClassByWeight = (seed: number): [number, BioticClass] => {
  const [next, value] = randomFromState(seed);
  let cursor = 0;

  for (let index = 0; index < CLASS_DISTRIBUTION.length; index++) {
    cursor += CLASS_DISTRIBUTION[index].weight;
    if (value <= cursor) {
      return [next, CLASS_DISTRIBUTION[index].classType];
    }
  }

  return [next, CLASS_DISTRIBUTION[CLASS_DISTRIBUTION.length - 1].classType];
};

const getTargetCount = (width: number, height: number, preset: DensityPreset): number => {
  const settings = DENSITY_PRESETS[preset];
  const area = width * height;
  return clamp(Math.floor(area / settings.areaDivisor), settings.minParticles, settings.maxParticles);
};

const randomForParticle = (particle: BioticParticle): number => {
  const [next, value] = randomFromState(particle.rngState);
  particle.rngState = next;
  return value;
};

const randomRangeForParticle = (particle: BioticParticle, min: number, max: number): number => {
  return min + (max - min) * randomForParticle(particle);
};

const getProfile = (sim: BioticSimulation, particle: BioticParticle): BehaviorProfile => {
  const classProfiles = sim.profiles[particle.classType];
  return classProfiles[particle.profileIndex] ?? classProfiles[0];
};

const flowPxPerSecond = (sim: BioticSimulation, particle: BioticParticle, profile: BehaviorProfile): number => {
  const reducedScale = sim.reducedMotion ? 0.52 : 1;
  return (
    (FLOW_PX_PER_SEC_MIN + (FLOW_PX_PER_SEC_MAX - FLOW_PX_PER_SEC_MIN) * particle.z) *
    profile.motion.flowScale *
    sim.flowStrength *
    reducedScale
  );
};

const createProfilesByClass = (palette: BioticSimulation["palette"]): ProfilesByClass => {
  const profiles: ProfilesByClass = {
    bacteria: [],
    bacteriophage: [],
    viralEnvelope: [],
    amoeba: [],
  };

  const classes: BioticClass[] = ["bacteria", "bacteriophage", "viralEnvelope", "amoeba"];

  for (let classIndex = 0; classIndex < classes.length; classIndex++) {
    const classType = classes[classIndex];

    for (let profileIndex = 0; profileIndex < SHAPE_PROFILE_COUNT; profileIndex++) {
      let seed = seedFor(profileIndex, CLASS_SEED_OFFSET[classType] + PALETTE_SEED_OFFSET[palette] * 13);
      const motionRange = CLASS_MOTION_RANGES[classType];
      const shapeRange = CLASS_SHAPE_RANGES[classType];
      const colorRange = PALETTE_RANGES[palette][classType];

      let slideDuration: number;
      let pauseDuration: number;
      let impulse: number;
      let damping: number;
      let flowScale: number;
      let driftJitter: number;

      [seed, slideDuration] = randomRange(seed, motionRange.slideDurationMin, motionRange.slideDurationMax);
      [seed, pauseDuration] = randomRange(seed, motionRange.pauseDurationMin, motionRange.pauseDurationMax);
      [seed, impulse] = randomRange(seed, motionRange.impulseMin, motionRange.impulseMax);
      [seed, damping] = randomRange(seed, motionRange.dampingMin, motionRange.dampingMax);
      [seed, flowScale] = randomRange(seed, motionRange.flowScaleMin, motionRange.flowScaleMax);
      [seed, driftJitter] = randomRange(seed, motionRange.driftJitterMin, motionRange.driftJitterMax);

      let size: number;
      let trailLength: number;
      let trailWidth: number;
      let hue: number;
      let saturation: number;
      let lightness: number;
      let alpha: number;

      [seed, size] = randomRange(seed, shapeRange.sizeMin, shapeRange.sizeMax);
      [seed, trailLength] = randomRange(seed, shapeRange.trailLengthMin, shapeRange.trailLengthMax);
      [seed, trailWidth] = randomRange(seed, shapeRange.trailWidthMin, shapeRange.trailWidthMax);
      [seed, hue] = randomRange(seed, colorRange.hueMin, colorRange.hueMax);
      [seed, saturation] = randomRange(seed, colorRange.saturationMin, colorRange.saturationMax);
      [seed, lightness] = randomRange(seed, colorRange.lightnessMin, colorRange.lightnessMax);
      [seed, alpha] = randomRange(seed, colorRange.alphaMin, colorRange.alphaMax);

      const profile: BehaviorProfile = {
        id: profileIndex,
        classType,
        motion: {
          slideDuration,
          pauseDuration,
          impulse,
          damping,
          flowScale,
          driftJitter,
        },
        shape: {
          classType,
          size,
          trailLength,
          trailWidth,
          hue,
          saturation,
          lightness,
          alpha,
        },
      };

      if (classType === "bacteria") {
        let length: number;
        let thickness: number;
        let maxSubCells: number;
        let fissionInterval: number;
        let localJitter: number;

        [seed, length] = randomRange(seed, shapeRange.lengthMin ?? 14, shapeRange.lengthMax ?? 30);
        [seed, thickness] = randomRange(seed, shapeRange.thicknessMin ?? 4, shapeRange.thicknessMax ?? 9);
        [seed, maxSubCells] = randomInt(seed, shapeRange.maxSubCellsMin ?? 2, shapeRange.maxSubCellsMax ?? 4);
        [seed, fissionInterval] = randomRange(seed, shapeRange.fissionIntervalMin ?? 2, shapeRange.fissionIntervalMax ?? 4);
        [seed, localJitter] = randomRange(seed, shapeRange.localJitterMin ?? 4, shapeRange.localJitterMax ?? 12);

        profile.shape.length = length;
        profile.shape.thickness = thickness;
        profile.shape.maxSubCells = maxSubCells;
        profile.shape.fissionInterval = fissionInterval;
        profile.shape.localJitter = localJitter;
      }

      if (classType === "bacteriophage") {
        let headRadius: number;
        let tailLength: number;
        let tailLegs: number;

        [seed, headRadius] = randomRange(seed, shapeRange.headRadiusMin ?? 4, shapeRange.headRadiusMax ?? 8);
        [seed, tailLength] = randomRange(seed, shapeRange.tailLengthMin ?? 10, shapeRange.tailLengthMax ?? 18);
        [seed, tailLegs] = randomInt(seed, shapeRange.tailLegsMin ?? 3, shapeRange.tailLegsMax ?? 6);

        profile.shape.headRadius = headRadius;
        profile.shape.tailLength = tailLength;
        profile.shape.tailLegs = tailLegs;
      }

      if (classType === "viralEnvelope") {
        let protrusions: number;
        let protrusionLength: number;
        let emissionInterval: number;
        let emissionSpeed: number;
        let emissionTTL: number;

        [seed, protrusions] = randomInt(seed, shapeRange.protrusionsMin ?? 8, shapeRange.protrusionsMax ?? 14);
        [seed, protrusionLength] = randomRange(seed, shapeRange.protrusionLengthMin ?? 1.5, shapeRange.protrusionLengthMax ?? 4);
        [seed, emissionInterval] = randomRange(seed, shapeRange.emissionIntervalMin ?? 0.7, shapeRange.emissionIntervalMax ?? 2);
        [seed, emissionSpeed] = randomRange(seed, shapeRange.emissionSpeedMin ?? 28, shapeRange.emissionSpeedMax ?? 80);
        [seed, emissionTTL] = randomRange(seed, shapeRange.emissionTTLMin ?? 0.4, shapeRange.emissionTTLMax ?? 1);

        profile.shape.protrusions = protrusions;
        profile.shape.protrusionLength = protrusionLength;
        profile.shape.emissionInterval = emissionInterval;
        profile.shape.emissionSpeed = emissionSpeed;
        profile.shape.emissionTTL = emissionTTL;
        profile.shape.protrusionStyle = "spike";
      }

      if (classType === "amoeba") {
        let lobeCount: number;
        let roughness: number;
        let pulseSpeed: number;
        let senseRadius: number;
        let chaseStrength: number;
        let bumpStrength: number;

        [seed, lobeCount] = randomInt(seed, shapeRange.lobeCountMin ?? 8, shapeRange.lobeCountMax ?? 14);
        [seed, roughness] = randomRange(seed, shapeRange.roughnessMin ?? 0.08, shapeRange.roughnessMax ?? 0.24);
        [seed, pulseSpeed] = randomRange(seed, shapeRange.pulseSpeedMin ?? 0.8, shapeRange.pulseSpeedMax ?? 1.8);
        [seed, senseRadius] = randomRange(seed, shapeRange.senseRadiusMin ?? 56, shapeRange.senseRadiusMax ?? 124);
        [seed, chaseStrength] = randomRange(seed, shapeRange.chaseStrengthMin ?? 18, shapeRange.chaseStrengthMax ?? 56);
        [seed, bumpStrength] = randomRange(seed, shapeRange.bumpStrengthMin ?? 40, shapeRange.bumpStrengthMax ?? 88);

        profile.shape.lobeCount = lobeCount;
        profile.shape.roughness = roughness;
        profile.shape.pulseSpeed = pulseSpeed;
        profile.shape.senseRadius = senseRadius;
        profile.shape.chaseStrength = chaseStrength;
        profile.shape.bumpStrength = bumpStrength;
      }

      profiles[classType].push(profile);
    }
  }

  return profiles;
};

const configureSlideImpulse = (particle: BioticParticle, profile: BehaviorProfile, sim: BioticSimulation): void => {
  const angle = randomForParticle(particle) * Math.PI * 2;
  const impulsePx = profile.motion.impulse * (0.5 + randomForParticle(particle) * 0.55);
  const lateral = Math.cos(angle);
  const vertical = Math.sin(angle);
  const downwardBias = 0.34 + randomForParticle(particle) * 0.32;
  const verticalComponent = vertical < 0 ? vertical * 0.28 : vertical;

  particle.slideAx = (lateral * impulsePx) / Math.max(sim.width, 1);
  particle.slideAy = ((verticalComponent + downwardBias) * impulsePx) / Math.max(sim.height, 1);
};

const setParticlePhase = (
  particle: BioticParticle,
  profile: BehaviorProfile,
  sim: BioticSimulation,
  phase: "slide" | "pause"
): void => {
  particle.phase = phase;
  particle.phaseTime = 0;

  const baseDuration = phase === "slide" ? profile.motion.slideDuration : profile.motion.pauseDuration;
  const duration = baseDuration * (0.72 + randomForParticle(particle) * 0.62);
  particle.phaseDuration = duration;

  if (phase === "slide") {
    configureSlideImpulse(particle, profile, sim);
  } else {
    particle.slideAx = 0;
    particle.slideAy = 0;
  }
};

const createBacteriaSubCell = (particle: BioticParticle, baseScale: number): BacteriaSubCell => {
  const angle = randomForParticle(particle) * Math.PI * 2;
  const dist = randomRangeForParticle(particle, 0, 8);

  return {
    offsetX: Math.cos(angle) * dist,
    offsetY: Math.sin(angle) * dist,
    vx: randomRangeForParticle(particle, -12, 12),
    vy: randomRangeForParticle(particle, -12, 12),
    scale: baseScale,
  };
};

const createParticle = (
  index: number,
  sim: BioticSimulation,
  densitySettings: DensityConfig,
  resetFromExisting?: BioticParticle
): BioticParticle => {
  let seed = seedFor(index + (resetFromExisting?.respawnCount ?? 0), PRESET_SEED_OFFSET[sim.preset] + PALETTE_SEED_OFFSET[sim.palette] * 5);
  let classType: BioticClass;
  let profileIndex: number;
  let nx: number;
  let ny: number;
  let z: number;
  let rotation: number;
  let rotationSpeed: number;

  [seed, classType] = pickClassByWeight(seed);
  [seed, profileIndex] = randomInt(seed, 0, sim.profiles[classType].length - 1);
  [seed, nx] = randomRange(seed, 0, 1);
  [seed, ny] = randomRange(seed, -0.2, 1.05);
  [seed, z] = randomRange(seed, 0.08, 1);
  [seed, rotation] = randomRange(seed, -Math.PI, Math.PI);
  [seed, rotationSpeed] = randomRange(seed, ROTATION_SPEED_RANGE[classType].min, ROTATION_SPEED_RANGE[classType].max);

  const particle: BioticParticle = {
    id: index,
    classType,
    profileIndex,
    rngState: seed,
    respawnCount: resetFromExisting?.respawnCount ?? 0,
    hueOffset: 0,
    saturationOffset: 0,
    lightnessOffset: 0,
    nx,
    ny,
    vx: 0,
    vy: 0,
    z,
    phase: "slide",
    phaseTime: 0,
    phaseDuration: 0,
    slideAx: 0,
    slideAy: 0,
    rotation,
    rotationSpeed,
    trail: [],
  };

  const profile = getProfile(sim, particle);
  const hueVariance = classType === "bacteria" ? 58 : classType === "viralEnvelope" ? 46 : 34;
  particle.hueOffset = randomRangeForParticle(particle, -hueVariance, hueVariance);
  particle.saturationOffset = randomRangeForParticle(particle, -16, 14);
  particle.lightnessOffset = randomRangeForParticle(particle, -10, 12);
  particle.vx = randomRangeForParticle(particle, -0.004, 0.004);
  particle.vy = (flowPxPerSecond(sim, particle, profile) / Math.max(sim.height, 1)) * randomRangeForParticle(particle, 0.2, 0.48);

  if (classType === "bacteria") {
    const maxSubCells = clamp(Math.round(profile.shape.maxSubCells ?? 3), 1, densitySettings.bacteriaSubCellCap);
    const initialSubCells = randomForParticle(particle) > 0.58 ? 2 : 1;
    const subCells: BacteriaSubCell[] = [];

    for (let subIndex = 0; subIndex < initialSubCells; subIndex++) {
      const scale = 0.72 + randomForParticle(particle) * 0.44;
      subCells.push(createBacteriaSubCell(particle, scale));
    }

    particle.bacteria = {
      subCells,
      fissionTimer: randomRangeForParticle(particle, 0.1, 1.4),
      fissionInterval: (profile.shape.fissionInterval ?? 2.8) * (0.62 + randomForParticle(particle) * 0.92),
      maxSubCells,
      localJitter: profile.shape.localJitter ?? 8,
      hasFlagella: randomForParticle(particle) > 0.62,
      flagellaCount: 1 + Math.floor(randomForParticle(particle) * 3),
      flagellaLength: (profile.shape.length ?? 24) * randomRangeForParticle(particle, 0.68, 1.18),
      flagellaPhase: randomRangeForParticle(particle, 0, Math.PI * 2),
      flagellaSpeed: randomRangeForParticle(particle, 1.2, 2.6),
    };
  }

  if (classType === "viralEnvelope") {
    particle.viralEnvelope = {
      emitTimer: randomRangeForParticle(particle, 0, profile.shape.emissionInterval ?? 1),
      emitInterval: (profile.shape.emissionInterval ?? 1.1) * (0.76 + randomForParticle(particle) * 0.72),
      emissions: [],
      protrusionWobble: randomRangeForParticle(particle, 0, Math.PI * 2),
    };
  }

  if (classType === "amoeba") {
    particle.amoeba = {
      pulsePhase: randomRangeForParticle(particle, 0, Math.PI * 2),
      senseRadius: profile.shape.senseRadius ?? 84,
      chaseStrength: profile.shape.chaseStrength ?? 34,
      bumpStrength: profile.shape.bumpStrength ?? 62,
    };
  }

  if (classType === "bacteriophage") {
    particle.bacteriophage = {
      flutterPhase: randomRangeForParticle(particle, 0, Math.PI * 2),
      tailJitter: randomRangeForParticle(particle, 0.35, 1.1),
    };
  }

  const initialPhase = randomForParticle(particle) > 0.92 ? "slide" : "pause";
  setParticlePhase(particle, profile, sim, initialPhase);
  particle.phaseTime = randomRangeForParticle(particle, 0, particle.phaseDuration * 0.5);

  const initialTrailCount = Math.max(2, Math.round((profile.shape.trailLength ?? 6) * 0.4));
  for (let indexTrail = 0; indexTrail < initialTrailCount; indexTrail++) {
    particle.trail.push({ nx: particle.nx, ny: particle.ny });
  }

  return particle;
};

const respawnParticle = (particle: BioticParticle, sim: BioticSimulation): void => {
  particle.respawnCount += 1;
  particle.nx = randomForParticle(particle);
  particle.ny = -0.1 - randomForParticle(particle) * 0.26;
  particle.vx = randomRangeForParticle(particle, -0.003, 0.003);
  particle.vy = 0;
  particle.rotation = randomRangeForParticle(particle, -Math.PI, Math.PI);

  const profile = getProfile(sim, particle);
  setParticlePhase(particle, profile, sim, randomForParticle(particle) > 0.9 ? "slide" : "pause");
  particle.phaseTime = randomRangeForParticle(particle, 0, particle.phaseDuration * 0.5);

  if (particle.viralEnvelope) {
    particle.viralEnvelope.emissions.length = 0;
    particle.viralEnvelope.emitTimer = randomRangeForParticle(particle, 0, particle.viralEnvelope.emitInterval);
  }

  particle.trail.length = 0;
  particle.trail.push({ nx: particle.nx, ny: particle.ny });
};

const updateBacteria = (particle: BioticParticle, profile: BehaviorProfile, sim: BioticSimulation, dt: number): void => {
  if (!particle.bacteria) return;

  const group = particle.bacteria;
  const localRadius = (profile.shape.length ?? 24) * 0.78;
  const motionBoost = 1.14;

  for (let index = 0; index < group.subCells.length; index++) {
    const subCell = group.subCells[index];
    subCell.vx += (randomForParticle(particle) - 0.5) * group.localJitter * dt * motionBoost;
    subCell.vy += (randomForParticle(particle) - 0.5) * group.localJitter * dt * motionBoost;
    subCell.vx *= 0.88;
    subCell.vy *= 0.88;
    subCell.offsetX += subCell.vx * dt;
    subCell.offsetY += subCell.vy * dt;

    const dist = Math.hypot(subCell.offsetX, subCell.offsetY);
    if (dist > localRadius) {
      subCell.offsetX = (subCell.offsetX / dist) * localRadius;
      subCell.offsetY = (subCell.offsetY / dist) * localRadius;
      subCell.vx *= 0.5;
      subCell.vy *= 0.5;
    }
  }

  if (group.hasFlagella) {
    const speed = sim.reducedMotion ? group.flagellaSpeed * 0.45 : group.flagellaSpeed;
    group.flagellaPhase += dt * speed;
  }

  if (sim.reducedMotion) return;

  group.fissionTimer += dt;
  if (group.fissionTimer < group.fissionInterval || group.subCells.length >= group.maxSubCells) {
    return;
  }

  const parentIndex = Math.floor(randomForParticle(particle) * group.subCells.length);
  const parent = group.subCells[parentIndex] ?? group.subCells[0];
  const angle = randomForParticle(particle) * Math.PI * 2;
  const dist = randomRangeForParticle(particle, 4, 10);

  const subCell: BacteriaSubCell = {
    offsetX: parent.offsetX + Math.cos(angle) * dist,
    offsetY: parent.offsetY + Math.sin(angle) * dist,
    vx: Math.cos(angle) * randomRangeForParticle(particle, 8, 26),
    vy: Math.sin(angle) * randomRangeForParticle(particle, 8, 26),
    scale: clamp(parent.scale * randomRangeForParticle(particle, 0.78, 1.18), 0.55, 1.3),
  };

  group.subCells.push(subCell);
  group.fissionTimer = 0;
  group.fissionInterval = (profile.shape.fissionInterval ?? 2.6) * (0.62 + randomForParticle(particle) * 0.88);
};

const updateViralEnvelope = (particle: BioticParticle, profile: BehaviorProfile, sim: BioticSimulation, dt: number): void => {
  if (!particle.viralEnvelope) return;

  const viral = particle.viralEnvelope;
  viral.protrusionWobble += dt * 0.7;

  if (!sim.reducedMotion) {
    viral.emitTimer += dt;
    if (viral.emitTimer >= viral.emitInterval) {
      const burstCount = randomForParticle(particle) > 0.74 ? 2 : 1;

      for (let index = 0; index < burstCount; index++) {
        const angle = randomForParticle(particle) * Math.PI * 2;
        const speedPx = (profile.shape.emissionSpeed ?? 44) * (0.62 + randomForParticle(particle) * 0.88);
        const ttl = (profile.shape.emissionTTL ?? 0.8) * (0.62 + randomForParticle(particle) * 0.88);
        const shellRadiusPx = (profile.shape.size ?? 10) * 0.58 + (profile.shape.protrusionLength ?? 2.2);
        const startNx = particle.nx + (Math.cos(angle) * shellRadiusPx) / Math.max(sim.width, 1);
        const startNy = particle.ny + (Math.sin(angle) * shellRadiusPx) / Math.max(sim.height, 1);

        viral.emissions.push({
          nx: startNx,
          ny: startNy,
          vx: (Math.cos(angle) * speedPx) / Math.max(sim.width, 1),
          vy: (Math.sin(angle) * speedPx) / Math.max(sim.height, 1),
          ttl,
          life: ttl,
          size: (profile.shape.size ?? 10) * randomRangeForParticle(particle, 0.12, 0.28),
          hue: profile.shape.hue + particle.hueOffset + randomRangeForParticle(particle, -14, 14),
          saturation: clamp(profile.shape.saturation + particle.saturationOffset + randomRangeForParticle(particle, -8, 12), 20, 98),
          lightness: clamp(profile.shape.lightness + particle.lightnessOffset + randomRangeForParticle(particle, 2, 18), 30, 90),
          alpha: clamp(profile.shape.alpha + randomRangeForParticle(particle, -0.06, 0.12), 0.12, 0.8),
        });
      }

      while (viral.emissions.length > sim.emissionCapPerVirus) {
        viral.emissions.shift();
      }

      viral.emitTimer = 0;
      viral.emitInterval = (profile.shape.emissionInterval ?? 1.1) * (0.74 + randomForParticle(particle) * 0.95);
    }
  }

  const flowPx = flowPxPerSecond(sim, particle, profile) * 0.35;
  const flowNorm = flowPx / Math.max(sim.height, 1);

  for (let index = viral.emissions.length - 1; index >= 0; index--) {
    const emission = viral.emissions[index];
    emission.vx *= 0.986;
    emission.vy *= 0.986;
    emission.vy += flowNorm * dt;
    emission.nx += emission.vx * dt;
    emission.ny += flowNorm * dt;
    emission.ny += emission.vy * dt;
    emission.ttl -= dt;

    if (emission.ttl <= 0 || emission.ny > 1.22 || emission.nx < -0.16 || emission.nx > 1.16) {
      viral.emissions.splice(index, 1);
    }
  }
};

const updateBacteriophage = (particle: BioticParticle, dt: number): void => {
  if (!particle.bacteriophage) return;

  particle.bacteriophage.flutterPhase += dt * (1.4 + particle.bacteriophage.tailJitter);
  particle.rotation += Math.sin(particle.bacteriophage.flutterPhase) * 0.02;
};

const updateAmoebaState = (particle: BioticParticle, profile: BehaviorProfile, dt: number): void => {
  if (!particle.amoeba) return;
  particle.amoeba.pulsePhase += dt * (profile.shape.pulseSpeed ?? 1.1);
};

const buildSpatialGrid = (sim: BioticSimulation): Map<string, number[]> => {
  const grid = new Map<string, number[]>();

  for (let index = 0; index < sim.particles.length; index++) {
    const particle = sim.particles[index];
    const px = particle.nx * sim.width;
    const py = particle.ny * sim.height;
    const cx = Math.floor(px / GRID_CELL_SIZE);
    const cy = Math.floor(py / GRID_CELL_SIZE);
    const key = `${cx}:${cy}`;

    const bucket = grid.get(key);
    if (bucket) {
      bucket.push(index);
    } else {
      grid.set(key, [index]);
    }
  }

  return grid;
};

const updateAmoebaInteractions = (sim: BioticSimulation, dt: number): void => {
  const grid = buildSpatialGrid(sim);

  for (let index = 0; index < sim.particles.length; index++) {
    const particle = sim.particles[index];
    if (particle.classType !== "amoeba" || !particle.amoeba) continue;

    const profile = getProfile(sim, particle);
    const state = particle.amoeba;

    const px = particle.nx * sim.width;
    const py = particle.ny * sim.height;
    const cx = Math.floor(px / GRID_CELL_SIZE);
    const cy = Math.floor(py / GRID_CELL_SIZE);

    const senseRadius = (state.senseRadius ?? profile.shape.senseRadius ?? 84) * (0.68 + particle.z * 0.52);
    const bumpRadius = Math.max(12, senseRadius * 0.26);

    let nearestIndex = -1;
    let nearestDistSq = Number.POSITIVE_INFINITY;
    let checked = 0;

    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const key = `${cx + ox}:${cy + oy}`;
        const bucket = grid.get(key);
        if (!bucket) continue;

        for (let bucketIndex = 0; bucketIndex < bucket.length; bucketIndex++) {
          const otherIndex = bucket[bucketIndex];
          if (otherIndex === index) continue;

          checked += 1;
          const other = sim.particles[otherIndex];
          const otherPx = other.nx * sim.width;
          const otherPy = other.ny * sim.height;
          const dx = otherPx - px;
          const dy = otherPy - py;
          const distSq = dx * dx + dy * dy;

          if (distSq < senseRadius * senseRadius && distSq < nearestDistSq) {
            nearestDistSq = distSq;
            nearestIndex = otherIndex;
          }

          if (distSq < bumpRadius * bumpRadius && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const bumpStrengthNormX = (state.bumpStrength / Math.max(sim.width, 1)) * dt;
            const bumpStrengthNormY = (state.bumpStrength / Math.max(sim.height, 1)) * dt;

            particle.vx -= nx * bumpStrengthNormX;
            particle.vy -= ny * bumpStrengthNormY;

            other.vx += nx * bumpStrengthNormX * 0.18;
            other.vy += ny * bumpStrengthNormY * 0.18;
          }

          if (checked >= sim.maxAmoebaChecks) {
            break;
          }
        }

        if (checked >= sim.maxAmoebaChecks) {
          break;
        }
      }

      if (checked >= sim.maxAmoebaChecks) {
        break;
      }
    }

    if (nearestIndex >= 0 && nearestDistSq > 0.0001) {
      const target = sim.particles[nearestIndex];
      const targetPx = target.nx * sim.width;
      const targetPy = target.ny * sim.height;
      const dx = targetPx - px;
      const dy = targetPy - py;
      const dist = Math.sqrt(nearestDistSq);
      const nx = dx / dist;
      const ny = dy / dist;

      const chaseX = (state.chaseStrength / Math.max(sim.width, 1)) * dt;
      const chaseY = (state.chaseStrength / Math.max(sim.height, 1)) * dt;
      particle.vx += nx * chaseX;
      particle.vy += ny * chaseY;
    }
  }
};

const updateTrails = (sim: BioticSimulation): void => {
  for (let index = 0; index < sim.particles.length; index++) {
    const particle = sim.particles[index];
    const profile = getProfile(sim, particle);
    const maxTrail = Math.max(2, Math.round(profile.shape.trailLength ?? 6));
    particle.trail.push({ nx: particle.nx, ny: particle.ny });
    while (particle.trail.length > maxTrail) {
      particle.trail.shift();
    }
  }
};

const updateParticleMotion = (sim: BioticSimulation, particle: BioticParticle, dt: number): void => {
  const profile = getProfile(sim, particle);

  particle.phaseTime += dt;
  if (particle.phaseTime >= particle.phaseDuration) {
    setParticlePhase(particle, profile, sim, particle.phase === "slide" ? "pause" : "slide");
  }

  if (particle.phase === "slide") {
    particle.vx += particle.slideAx * dt;
    particle.vy += particle.slideAy * dt;

    const jitterX = ((randomForParticle(particle) - 0.5) * profile.motion.driftJitter) / Math.max(sim.width, 1);
    const jitterY = ((randomForParticle(particle) - 0.5) * profile.motion.driftJitter) / Math.max(sim.height, 1);
    particle.vx += jitterX * dt;
    particle.vy += jitterY * dt;
  }

  const damping = Math.pow(profile.motion.damping, dt * 60);
  particle.vx *= damping;
  particle.vy *= damping;

  if (particle.phase === "pause") {
    particle.vx *= 0.88;
    particle.vy *= 0.88;
  }

  const flowNorm = flowPxPerSecond(sim, particle, profile) / Math.max(sim.height, 1);
  particle.ny += flowNorm * dt;
  particle.vy += flowNorm * dt * 0.08;

  particle.nx += particle.vx * dt;
  particle.ny += particle.vy * dt;
  particle.rotation += particle.rotationSpeed * dt * ROTATION_SCALE[particle.classType];

  if (particle.nx < -0.08) particle.nx += 1.16;
  if (particle.nx > 1.08) particle.nx -= 1.16;

  if (particle.ny > 1.16) {
    respawnParticle(particle, sim);
  }

  if (particle.classType === "bacteria") {
    updateBacteria(particle, profile, sim, dt);
  }

  if (particle.classType === "viralEnvelope") {
    updateViralEnvelope(particle, profile, sim, dt);
  }

  if (particle.classType === "bacteriophage") {
    updateBacteriophage(particle, dt);
  }

  if (particle.classType === "amoeba") {
    updateAmoebaState(particle, profile, dt);
  }
};

export const createSimulation = (options: CreateSimulationOptions): BioticSimulation => {
  const densitySettings = DENSITY_PRESETS[options.preset];
  const profiles = createProfilesByClass(options.palette);

  const simulation: BioticSimulation = {
    width: options.width,
    height: options.height,
    dpr: options.dpr,
    time: 0,
    preset: options.preset,
    palette: options.palette,
    reducedMotion: options.reducedMotion,
    flowStrength: options.flowStrength,
    maxAmoebaChecks: densitySettings.maxAmoebaChecks,
    emissionCapPerVirus: densitySettings.emissionCapPerVirus,
    particles: [],
    profiles,
  };

  const targetCount = getTargetCount(options.width, options.height, options.preset);
  for (let index = 0; index < targetCount; index++) {
    simulation.particles.push(createParticle(index, simulation, densitySettings));
  }

  return simulation;
};

export const resizeSimulation = (simulation: BioticSimulation, width: number, height: number, dpr: number): void => {
  simulation.width = width;
  simulation.height = height;
  simulation.dpr = dpr;

  const densitySettings = DENSITY_PRESETS[simulation.preset];
  simulation.maxAmoebaChecks = densitySettings.maxAmoebaChecks;
  simulation.emissionCapPerVirus = densitySettings.emissionCapPerVirus;

  const targetCount = getTargetCount(width, height, simulation.preset);

  if (simulation.particles.length < targetCount) {
    const start = simulation.particles.length;
    for (let index = start; index < targetCount; index++) {
      simulation.particles.push(createParticle(index, simulation, densitySettings));
    }
  } else if (simulation.particles.length > targetCount) {
    simulation.particles.length = targetCount;
  }
};

export const stepSimulation = (simulation: BioticSimulation, deltaSeconds: number): void => {
  const dt = clamp(deltaSeconds, 0.001, 0.05);
  simulation.time += dt;

  for (let index = 0; index < simulation.particles.length; index++) {
    updateParticleMotion(simulation, simulation.particles[index], dt);
  }

  updateAmoebaInteractions(simulation, dt);
};
