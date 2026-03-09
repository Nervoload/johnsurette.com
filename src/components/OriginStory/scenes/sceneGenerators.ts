export const createScatterCloud = (
  count: number,
  spreadX: number,
  spreadY: number,
  spreadZ: number,
): Float32Array => {
  const output = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    output[index * 3] = (Math.random() - 0.5) * spreadX;
    output[index * 3 + 1] = (Math.random() - 0.5) * spreadY;
    output[index * 3 + 2] = (Math.random() - 0.5) * spreadZ;
  }

  return output;
};

export const createSphereShell = (
  count: number,
  radiusMin: number,
  radiusMax: number,
): Float32Array => {
  const output = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = radiusMin + Math.random() * (radiusMax - radiusMin);

    output[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    output[index * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    output[index * 3 + 2] = Math.cos(phi) * radius;
  }

  return output;
};

export const createHelixLine = (
  steps: number,
  radius: number,
  pitch: number,
  turns: number,
  xOffset = 0,
): [number, number, number][] => {
  return Array.from({ length: steps }, (_, index) => {
    const t = index / Math.max(1, steps - 1);
    const angle = t * Math.PI * 2 * turns;
    return [
      xOffset + Math.cos(angle) * radius,
      (t - 0.5) * pitch,
      Math.sin(angle) * radius,
    ];
  });
};

export const createGridNodes = (
  columns: number,
  rows: number,
  gapX: number,
  gapY: number,
  depthJitter: number,
): [number, number, number][] => {
  return Array.from({ length: columns * rows }, (_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    return [
      (col - (columns - 1) / 2) * gapX,
      ((rows - 1) / 2 - row) * gapY,
      (Math.random() - 0.5) * depthJitter,
    ];
  });
};
