import * as THREE from "three";
import { LIVING_THEME_TOKENS, LivingThemeTokens } from "../core/themeTokens.ts";

/**
 * Uniforms every living material shares by reference. The frame driver updates them once per frame,
 * so a theme change or resize reaches every material without touching them individually.
 */
export interface LivingSharedUniforms {
  [name: string]: THREE.IUniform;
  uCanvasPx: THREE.IUniform<THREE.Vector2>;
  uFadePx: THREE.IUniform<number>;
  uCoverage: THREE.IUniform<number>;
  uThemeMix: THREE.IUniform<number>;
  uPxScale: THREE.IUniform<number>;
  uMaxPointPx: THREE.IUniform<number>;
  uDpr: THREE.IUniform<number>;
  uTime: THREE.IUniform<number>;
  uInk: THREE.IUniform<THREE.Color>;
  uDim: THREE.IUniform<THREE.Color>;
  uSignal: THREE.IUniform<THREE.Color>;
  uSignal2: THREE.IUniform<THREE.Color>;
  uWarm: THREE.IUniform<THREE.Color>;
  uAmber: THREE.IUniform<THREE.Color>;
  uMint: THREE.IUniform<THREE.Color>;
}

type ToneKey = "ink" | "dim" | "signal" | "signal2" | "warm" | "amber" | "mint";
const TONE_KEYS: ToneKey[] = ["ink", "dim", "signal", "signal2", "warm", "amber", "mint"];
const TONE_UNIFORM: Record<ToneKey, keyof LivingSharedUniforms> = {
  ink: "uInk",
  dim: "uDim",
  signal: "uSignal",
  signal2: "uSignal2",
  warm: "uWarm",
  amber: "uAmber",
  mint: "uMint",
};

/** Tone ids used in per-vertex `aTone` attributes. */
export const TONE = { ink: 0, dim: 1, signal: 2, signal2: 3, warm: 4, amber: 5, mint: 6 } as const;

const toneColor = (tokens: LivingThemeTokens, key: ToneKey) => new THREE.Color(tokens[key]);
const DARK_COLORS = TONE_KEYS.map((key) => toneColor(LIVING_THEME_TOKENS.dark, key));
const LIGHT_COLORS = TONE_KEYS.map((key) => toneColor(LIVING_THEME_TOKENS.light, key));

export const createSharedUniforms = (themeMix: number): LivingSharedUniforms => {
  const uniforms = {
    uCanvasPx: { value: new THREE.Vector2(1, 1) },
    uFadePx: { value: 48 },
    uCoverage: { value: 1 },
    uThemeMix: { value: themeMix },
    uPxScale: { value: 600 },
    uMaxPointPx: { value: 20 },
    uDpr: { value: 1 },
    uTime: { value: 0 },
    uInk: { value: new THREE.Color() },
    uDim: { value: new THREE.Color() },
    uSignal: { value: new THREE.Color() },
    uSignal2: { value: new THREE.Color() },
    uWarm: { value: new THREE.Color() },
    uAmber: { value: new THREE.Color() },
    uMint: { value: new THREE.Color() },
  } as LivingSharedUniforms;
  applyThemeMix(uniforms, themeMix);
  return uniforms;
};

/** themeMix: 0 = light, 1 = dark. Colors blend in linear space, coverage blends between ink and glow. */
export const applyThemeMix = (uniforms: LivingSharedUniforms, themeMix: number): void => {
  uniforms.uThemeMix.value = themeMix;
  uniforms.uCoverage.value = THREE.MathUtils.lerp(
    LIVING_THEME_TOKENS.light.coverage,
    LIVING_THEME_TOKENS.dark.coverage,
    themeMix,
  );
  TONE_KEYS.forEach((key, index) => {
    (uniforms[TONE_UNIFORM[key]].value as THREE.Color).lerpColors(LIGHT_COLORS[index], DARK_COLORS[index], themeMix);
  });
};

/** Declarations + helpers shared by every living fragment shader. */
export const LIVING_FRAGMENT_COMMON = /* glsl */ `
uniform vec2 uCanvasPx;
uniform float uFadePx;
uniform float uCoverage;
uniform float uThemeMix;
uniform vec3 uInk;
uniform vec3 uDim;
uniform vec3 uSignal;
uniform vec3 uSignal2;
uniform vec3 uWarm;
uniform vec3 uAmber;
uniform vec3 uMint;

vec3 livingTone(float tone) {
  if (tone < 0.5) return uInk;
  if (tone < 1.5) return uDim;
  if (tone < 2.5) return uSignal;
  if (tone < 3.5) return uSignal2;
  if (tone < 4.5) return uWarm;
  if (tone < 5.5) return uAmber;
  return uMint;
}

// Soft fade toward the canvas bounds so nothing ever ends on a hard line.
float livingEdgeFade() {
  vec2 d = min(gl_FragCoord.xy, uCanvasPx - gl_FragCoord.xy);
  float m = min(d.x, d.y);
  return smoothstep(0.0, uFadePx, m);
}

// Premultiplied output. uCoverage ~0.16 on dark (adds light), 1.0 on light (covers like ink).
void livingWrite(vec3 linearColor, float alpha) {
  alpha = clamp(alpha, 0.0, 1.0) * livingEdgeFade();
  vec3 c = linearToOutputTexel(vec4(linearColor, 1.0)).rgb;
  gl_FragColor = vec4(c * alpha, alpha * uCoverage);
}
`;

export const LIVING_VERTEX_COMMON = /* glsl */ `
uniform vec2 uCanvasPx;
uniform float uPxScale;
uniform float uMaxPointPx;
uniform float uDpr;
uniform float uTime;
uniform float uThemeMix;
`;

export interface LivingMaterialOptions {
  vertexShader: string;
  fragmentShader: string;
  uniforms?: Record<string, THREE.IUniform>;
  depthTest?: boolean;
  depthWrite?: boolean;
  side?: THREE.Side;
}

export const createLivingMaterial = (
  shared: LivingSharedUniforms,
  options: LivingMaterialOptions,
): THREE.ShaderMaterial => {
  const material = new THREE.ShaderMaterial({
    vertexShader: options.vertexShader,
    fragmentShader: options.fragmentShader,
    uniforms: { ...shared, ...(options.uniforms ?? {}) },
    transparent: true,
    depthTest: options.depthTest ?? true,
    depthWrite: options.depthWrite ?? false,
    side: options.side ?? THREE.FrontSide,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendEquationAlpha: THREE.AddEquation,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
  return material;
};

// ---------------------------------------------------------------------------------------------
// Points: soft discs with a halo. Size is in world units, projected and capped in device pixels.

export interface PointBuffers {
  geometry: THREE.BufferGeometry;
  position: Float32Array;
  size: Float32Array;
  tone: Float32Array;
  activity: Float32Array;
  seed: Float32Array;
  capacity: number;
  count: number;
  /** Call after writing `activity` (or anything else) to upload it. */
  commit(attributes?: Array<"position" | "size" | "tone" | "activity" | "seed">): void;
}

export const createPointBuffers = (capacity: number): PointBuffers => {
  const geometry = new THREE.BufferGeometry();
  const position = new Float32Array(capacity * 3);
  const size = new Float32Array(capacity);
  const tone = new Float32Array(capacity);
  const activity = new Float32Array(capacity);
  const seed = new Float32Array(capacity);
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geometry.setAttribute("aTone", new THREE.BufferAttribute(tone, 1));
  const activityAttr = new THREE.BufferAttribute(activity, 1);
  activityAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("aActivity", activityAttr);
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const buffers: PointBuffers = {
    geometry,
    position,
    size,
    tone,
    activity,
    seed,
    capacity,
    count: 0,
    commit(attributes = ["activity"]) {
      const names: Record<string, string> = {
        position: "position",
        size: "aSize",
        tone: "aTone",
        activity: "aActivity",
        seed: "aSeed",
      };
      attributes.forEach((name) => {
        (geometry.getAttribute(names[name]) as THREE.BufferAttribute).needsUpdate = true;
      });
      geometry.setDrawRange(0, buffers.count);
    },
  };
  geometry.setDrawRange(0, 0);
  return buffers;
};

export const POINT_VERTEX = /* glsl */ `
${LIVING_VERTEX_COMMON}
attribute float aSize;
attribute float aTone;
attribute float aActivity;
attribute float aSeed;
uniform float uOpacity;
uniform float uSizeBoost;
varying float vTone;
varying float vActivity;
varying float vSeed;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float px = aSize * uPxScale / max(-mv.z, 0.001) * (1.0 + aActivity * uSizeBoost);
  gl_PointSize = clamp(px, 1.0, uMaxPointPx * uDpr);
  vTone = aTone;
  vActivity = aActivity;
  vSeed = aSeed;
}
`;

export const POINT_FRAGMENT = /* glsl */ `
${LIVING_FRAGMENT_COMMON}
uniform float uOpacity;
uniform float uBase;
uniform float uHalo;
uniform vec3 uHot;
varying float vTone;
varying float vActivity;
varying float vSeed;
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(uv, uv);
  if (r2 > 1.0) discard;
  float core = exp(-r2 * 6.0);
  float halo = exp(-r2 * 1.6) * (1.0 - r2);
  float energy = uBase + vActivity;
  // Light theme: crisper dots, less halo, so it reads as ink.
  float haloMix = mix(0.35, 1.0, uThemeMix) * uHalo;
  float alpha = (core * 0.95 + halo * haloMix) * energy * uOpacity;
  vec3 color = mix(livingTone(vTone), uHot, clamp(vActivity * 0.7, 0.0, 1.0));
  livingWrite(color, alpha);
}
`;

export const createPointMaterial = (
  shared: LivingSharedUniforms,
  options: { base?: number; halo?: number; sizeBoost?: number; hot?: THREE.Color } = {},
): THREE.ShaderMaterial =>
  createLivingMaterial(shared, {
    vertexShader: POINT_VERTEX,
    fragmentShader: POINT_FRAGMENT,
    uniforms: {
      uOpacity: { value: 1 },
      uBase: { value: options.base ?? 0.35 },
      uHalo: { value: options.halo ?? 0.6 },
      uSizeBoost: { value: options.sizeBoost ?? 0.8 },
      uHot: { value: options.hot ?? (shared.uSignal.value as THREE.Color) },
    },
  });

// ---------------------------------------------------------------------------------------------
// Segments: instanced screen-space quads, so lines keep a real pixel width (WebGL lines are 1px).

export interface SegmentBuffers {
  geometry: THREE.InstancedBufferGeometry;
  start: Float32Array;
  end: Float32Array;
  /** t0, t1 (position along the parent curve), width (CSS px), intensity */
  param: Float32Array;
  tone: Float32Array;
  activity: Float32Array;
  /** pulse center (in curve t), pulse strength */
  pulse: Float32Array;
  capacity: number;
  count: number;
  commit(attributes?: Array<"start" | "end" | "param" | "tone" | "activity" | "pulse">): void;
}

export type Vec3Tuple = [number, number, number];

export const createSegmentBuffers = (capacity: number): SegmentBuffers => {
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([0, -1, 0, 1, -1, 0, 1, 1, 0, 0, 1, 0]), 3),
  );
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  const start = new Float32Array(capacity * 3);
  const end = new Float32Array(capacity * 3);
  const param = new Float32Array(capacity * 4);
  const tone = new Float32Array(capacity);
  const activity = new Float32Array(capacity);
  const pulse = new Float32Array(capacity * 2);
  const attrs: Record<string, THREE.InstancedBufferAttribute> = {
    aStart: new THREE.InstancedBufferAttribute(start, 3),
    aEnd: new THREE.InstancedBufferAttribute(end, 3),
    aParam: new THREE.InstancedBufferAttribute(param, 4),
    aTone: new THREE.InstancedBufferAttribute(tone, 1),
    aActivity: new THREE.InstancedBufferAttribute(activity, 1),
    aPulse: new THREE.InstancedBufferAttribute(pulse, 2),
  };
  attrs.aActivity.setUsage(THREE.DynamicDrawUsage);
  attrs.aPulse.setUsage(THREE.DynamicDrawUsage);
  Object.entries(attrs).forEach(([name, attr]) => geometry.setAttribute(name, attr));
  const names: Record<string, string> = {
    start: "aStart",
    end: "aEnd",
    param: "aParam",
    tone: "aTone",
    activity: "aActivity",
    pulse: "aPulse",
  };
  const buffers: SegmentBuffers = {
    geometry,
    start,
    end,
    param,
    tone,
    activity,
    pulse,
    capacity,
    count: 0,
    commit(list = ["activity", "pulse"]) {
      list.forEach((name) => {
        (geometry.getAttribute(names[name]) as THREE.InstancedBufferAttribute).needsUpdate = true;
      });
      geometry.instanceCount = buffers.count;
    },
  };
  geometry.instanceCount = 0;
  return buffers;
};

export interface PolylineStyle {
  width: number;
  intensity: number;
  tone: number;
  t0?: number;
  t1?: number;
}

/** Appends a polyline as consecutive segments. Returns the index of its first segment. */
export const addPolyline = (buffers: SegmentBuffers, points: Vec3Tuple[], style: PolylineStyle): number => {
  const first = buffers.count;
  const t0 = style.t0 ?? 0;
  const t1 = style.t1 ?? 1;
  const segments = points.length - 1;
  for (let i = 0; i < segments && buffers.count < buffers.capacity; i += 1) {
    const index = buffers.count;
    buffers.start.set(points[i], index * 3);
    buffers.end.set(points[i + 1], index * 3);
    buffers.param.set(
      [t0 + ((t1 - t0) * i) / segments, t0 + ((t1 - t0) * (i + 1)) / segments, style.width, style.intensity],
      index * 4,
    );
    buffers.tone[index] = style.tone;
    buffers.count += 1;
  }
  return first;
};

export const SEGMENT_VERTEX = /* glsl */ `
${LIVING_VERTEX_COMMON}
attribute vec3 aStart;
attribute vec3 aEnd;
attribute vec4 aParam;
attribute float aTone;
attribute float aActivity;
attribute vec2 aPulse;
uniform float uWidthScale;
varying float vT;
varying float vSidePx;
varying float vHalfPx;
varying float vTone;
varying float vActivity;
varying float vIntensity;
varying vec2 vPulse;
void main() {
  vec4 cs = projectionMatrix * modelViewMatrix * vec4(aStart, 1.0);
  vec4 ce = projectionMatrix * modelViewMatrix * vec4(aEnd, 1.0);
  vec2 ps = cs.xy / cs.w * 0.5 * uCanvasPx;
  vec2 pe = ce.xy / ce.w * 0.5 * uCanvasPx;
  vec2 dir = pe - ps;
  float len = length(dir);
  dir = len > 0.0001 ? dir / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  vec4 c = mix(cs, ce, position.x);
  float halfPx = max(aParam.z * uWidthScale * uDpr * 0.5, 0.5) + 1.0;
  c.xy += nrm * position.y * halfPx * 2.0 / uCanvasPx * c.w;
  gl_Position = c;
  vT = mix(aParam.x, aParam.y, position.x);
  vSidePx = position.y * halfPx;
  vHalfPx = halfPx;
  vTone = aTone;
  vActivity = aActivity;
  vIntensity = aParam.w;
  vPulse = aPulse;
}
`;

export const SEGMENT_FRAGMENT = /* glsl */ `
${LIVING_FRAGMENT_COMMON}
uniform float uOpacity;
uniform float uPulseWidth;
uniform vec3 uHot;
varying float vT;
varying float vSidePx;
varying float vHalfPx;
varying float vTone;
varying float vActivity;
varying float vIntensity;
varying vec2 vPulse;
void main() {
  float aa = 1.0 - smoothstep(vHalfPx - 1.25, vHalfPx, abs(vSidePx));
  float d = (vT - vPulse.x) / uPulseWidth;
  float pulse = vPulse.y * exp(-d * d);
  float energy = vIntensity * (1.0 + vActivity) + pulse;
  vec3 color = mix(livingTone(vTone), uHot, clamp(pulse + vActivity * 0.5, 0.0, 1.0));
  livingWrite(color, aa * energy * uOpacity);
}
`;

export const createSegmentMaterial = (
  shared: LivingSharedUniforms,
  options: { widthScale?: number; pulseWidth?: number; hot?: THREE.Color; depthTest?: boolean } = {},
): THREE.ShaderMaterial =>
  createLivingMaterial(shared, {
    vertexShader: SEGMENT_VERTEX,
    fragmentShader: SEGMENT_FRAGMENT,
    depthTest: options.depthTest ?? true,
    uniforms: {
      uOpacity: { value: 1 },
      uWidthScale: { value: options.widthScale ?? 1 },
      uPulseWidth: { value: options.pulseWidth ?? 0.06 },
      uHot: { value: options.hot ?? (shared.uSignal.value as THREE.Color) },
    },
  });
