import { useEffect, useState } from "react";
import {
  createSeededRandom,
  pickRange,
} from "./shared";
import {
  WaveOrbColorProfile,
  WaveOrbInteriorProfile,
  WaveOrbLoadProfile,
  WaveOrbParticleProfile,
  WaveOrbShellProfile,
} from "./types";

const PROFILE_VERSION = 1;
const TRANSIENT_CACHE_KEY = "__wave-orb-load-profile__";

type StoredWaveOrbLoadProfile = {
  version: number;
  profile: WaveOrbLoadProfile;
};

const transientProfileCache = new Map<string, WaveOrbLoadProfile>();

const clampRange = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const hasFiniteFields = (value: unknown, fields: string[]): boolean => {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return fields.every((field) => isFiniteNumber(record[field]));
};

const isWaveOrbShellProfile = (value: unknown): value is WaveOrbShellProfile =>
  hasFiniteFields(value, [
    "radius",
    "opacity",
    "haloOpacity",
    "haloScale",
    "displacementScale",
    "rippleStrength",
    "pulseStrength",
    "fresnelPower",
  ]);

const isWaveOrbParticleProfile = (value: unknown): value is WaveOrbParticleProfile =>
  hasFiniteFields(value, [
    "formationCount",
    "coronaCount",
    "streamCount",
    "streamTrailLength",
    "sparkleCount",
    "sparkleScale",
  ]);

const isWaveOrbInteriorProfile = (value: unknown): value is WaveOrbInteriorProfile =>
  hasFiniteFields(value, [
    "nucleusRadius",
    "nucleusPulseStrength",
    "mitochondriaCount",
    "mitochondriaRadius",
    "vesicleCount",
    "vesicleRadiusMin",
    "vesicleRadiusMax",
    "vesicleEscapeProbability",
    "driftStrength",
    "glowOpacity",
  ]);

const isWaveOrbColorProfile = (value: unknown): value is WaveOrbColorProfile =>
  hasFiniteFields(value, [
    "hueShift",
    "saturationShift",
    "lightnessShift",
    "cycleSpeed",
    "clickCycleBoost",
    "clickBoostDuration",
  ]);

const isWaveOrbLoadProfile = (value: unknown): value is WaveOrbLoadProfile => {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return (
    isFiniteNumber(record.seed) &&
    isWaveOrbShellProfile(record.shell) &&
    isWaveOrbParticleProfile(record.particles) &&
    isWaveOrbInteriorProfile(record.interior) &&
    isWaveOrbColorProfile(record.colors)
  );
};

const isStoredWaveOrbLoadProfile = (value: unknown): value is StoredWaveOrbLoadProfile => {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return (
    isFiniteNumber(record.version) &&
    isWaveOrbLoadProfile(record.profile)
  );
};

const getSessionStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const createFallbackSeed = (): number => {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const seedBuffer = new Uint32Array(1);
    crypto.getRandomValues(seedBuffer);
    return seedBuffer[0] || 1;
  }

  return (Math.floor(Math.random() * 0xffffffff) >>> 0) || 1;
};

const readStoredProfile = (storageKey: string): WaveOrbLoadProfile | null => {
  const storage = getSessionStorage();
  if (!storage) return null;

  const raw = storage.getItem(storageKey);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);

    if (isStoredWaveOrbLoadProfile(parsed) && parsed.version === PROFILE_VERSION) {
      return parsed.profile;
    }

    if (isWaveOrbLoadProfile(parsed)) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
};

const persistProfile = (storageKey: string, profile: WaveOrbLoadProfile): void => {
  const storage = getSessionStorage();
  if (!storage) return;

  try {
    const payload: StoredWaveOrbLoadProfile = {
      version: PROFILE_VERSION,
      profile,
    };
    storage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // Storage is best-effort only.
  }
};

const resolveCachedProfile = (storageKey?: string): WaveOrbLoadProfile => {
  const cacheKey = storageKey ?? TRANSIENT_CACHE_KEY;
  const cachedProfile = transientProfileCache.get(cacheKey);
  if (cachedProfile) {
    return cachedProfile;
  }

  if (storageKey) {
    const storedProfile = readStoredProfile(storageKey);
    if (storedProfile) {
      transientProfileCache.set(cacheKey, storedProfile);
      return storedProfile;
    }
  }

  const createdProfile = createWaveOrbLoadProfile(createFallbackSeed());
  transientProfileCache.set(cacheKey, createdProfile);

  if (storageKey) {
    persistProfile(storageKey, createdProfile);
  }

  return createdProfile;
};

const roundCount = (value: number): number => Math.max(1, Math.round(value));

/**
 * Create a deterministic centerpiece load profile from a numeric seed.
 * The returned object is plain JSON and can be serialized directly.
 */
export const createWaveOrbLoadProfile = (seed: number = createFallbackSeed()): WaveOrbLoadProfile => {
  const normalizedSeed = seed >>> 0;
  const random = createSeededRandom(normalizedSeed);

  const mood = random();
  const clarity = random();
  const vitality = random();
  const shimmer = random();
  const symmetry = random();

  const shell: WaveOrbShellProfile = {
    radius: clampRange(1.16 + clarity * 0.11 + shimmer * 0.04, 1.12, 1.32),
    opacity: clampRange(0.46 + clarity * 0.14, 0.42, 0.66),
    haloOpacity: clampRange(0.12 + shimmer * 0.1, 0.1, 0.26),
    haloScale: clampRange(1.18 + vitality * 0.16, 1.14, 1.38),
    displacementScale: clampRange(0.86 + vitality * 0.28, 0.82, 1.22),
    rippleStrength: clampRange(0.84 + mood * 0.42, 0.78, 1.28),
    pulseStrength: clampRange(0.86 + symmetry * 0.3, 0.82, 1.18),
    fresnelPower: clampRange(2.35 + shimmer * 1.35, 2.2, 4.1),
  };

  const particles: WaveOrbParticleProfile = {
    formationCount: roundCount(880 + clarity * 320),
    coronaCount: roundCount(680 + shimmer * 300),
    streamCount: roundCount(18 + vitality * 10),
    streamTrailLength: roundCount(20 + clarity * 10),
    sparkleCount: roundCount(112 + mood * 76),
    sparkleScale: clampRange(1.85 + shimmer * 1.15, 1.7, 3.1),
  };

  const nucleusRadius = clampRange(0.24 + clarity * 0.11 + symmetry * 0.03, 0.22, 0.38);
  const mitochondriaRadius = clampRange(0.08 + vitality * 0.05, 0.07, 0.15);
  const vesicleRadiusMin = clampRange(0.034 + mood * 0.018, 0.03, 0.06);
  const vesicleRadiusMax = clampRange(vesicleRadiusMin + 0.04 + shimmer * 0.03, 0.07, 0.12);

  const interior: WaveOrbInteriorProfile = {
    nucleusRadius,
    nucleusPulseStrength: clampRange(0.018 + vitality * 0.03, 0.016, 0.058),
    mitochondriaCount: roundCount(4 + mood * 4 + symmetry * 2),
    mitochondriaRadius,
    vesicleCount: roundCount(8 + clarity * 6 + shimmer * 2),
    vesicleRadiusMin,
    vesicleRadiusMax,
    vesicleEscapeProbability: clampRange(0.12 + vitality * 0.18, 0.1, 0.3),
    driftStrength: clampRange(0.028 + symmetry * 0.05, 0.024, 0.082),
    glowOpacity: clampRange(0.18 + clarity * 0.12, 0.16, 0.34),
  };

  const colors: WaveOrbColorProfile = {
    hueShift: clampRange(pickRange(random, -0.16, 0.16), -0.18, 0.18),
    saturationShift: clampRange(pickRange(random, -0.08, 0.16), -0.1, 0.18),
    lightnessShift: clampRange(pickRange(random, -0.06, 0.12), -0.08, 0.14),
    cycleSpeed: clampRange(0.03 + vitality * 0.05 + shimmer * 0.01, 0.024, 0.09),
    clickCycleBoost: clampRange(2.4 + clarity * 1.9, 2.2, 4.8),
    clickBoostDuration: clampRange(0.62 + symmetry * 0.58, 0.6, 1.2),
  };

  return {
    seed: normalizedSeed,
    shell,
    particles,
    interior,
    colors,
  };
};

/**
 * Resolve a stable centerpiece load profile for the current session.
 * When a storage key is provided, the profile is stored in sessionStorage.
 */
export const useWaveOrbLoadProfile = (storageKey?: string): WaveOrbLoadProfile => {
  const [profile] = useState<WaveOrbLoadProfile>(() => resolveCachedProfile(storageKey));

  useEffect(() => {
    if (!storageKey) return;

    persistProfile(storageKey, profile);
    transientProfileCache.set(storageKey, profile);
  }, [profile, storageKey]);

  return profile;
};
