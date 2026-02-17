export const seedFor = (index: number, salt: number): number => {
  const seed = ((index + 1) * 2654435761 + (salt + 1) * 1013904223) >>> 0;
  return seed === 0 ? 1 : seed;
};

export const nextSeed = (seed: number): number => {
  const next = (seed * 1664525 + 1013904223) >>> 0;
  return next === 0 ? 1 : next;
};

export const randomFromState = (seed: number): [number, number] => {
  const next = nextSeed(seed);
  return [next, next / 4294967296];
};

export const randomRange = (seed: number, min: number, max: number): [number, number] => {
  const [next, value] = randomFromState(seed);
  return [next, min + (max - min) * value];
};

export const randomInt = (seed: number, minInclusive: number, maxInclusive: number): [number, number] => {
  const [next, value] = randomFromState(seed);
  const span = maxInclusive - minInclusive + 1;
  return [next, minInclusive + Math.floor(value * span)];
};

export const randomSign = (seed: number): [number, number] => {
  const [next, value] = randomFromState(seed);
  return [next, value < 0.5 ? -1 : 1];
};

export const wrap01 = (value: number): number => {
  if (value < 0) {
    return value + Math.ceil(Math.abs(value));
  }
  if (value >= 1) {
    return value - Math.floor(value);
  }
  return value;
};
