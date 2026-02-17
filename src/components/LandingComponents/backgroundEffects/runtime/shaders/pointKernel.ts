export const POINT_KERNEL_GLSL = `
float pkHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float pkGaussian(float r2, float sharpness) {
  return exp(-r2 * sharpness);
}

float pkRadialShimmer(float r, float theta, float time, float phase) {
  float ring = sin(r * 9.0 - time * 1.1 + phase * 6.28318);
  float swirl = cos(theta * 4.0 + time * 0.76 + phase * 12.0);
  return 0.78 + 0.22 * ring * swirl;
}

float pkGrain(vec2 fragCoord, float phase) {
  float n = pkHash(fragCoord * 0.52 + phase * 17.0);
  return (n - 0.5) * 0.08;
}

float pkPointAlpha(vec2 uv, float depth, float time, float phase, float baseStrength, float depthBoost) {
  float r2 = dot(uv, uv);
  if (r2 > 1.0) {
    return -1.0;
  }

  float r = sqrt(max(r2, 0.00001));
  float theta = atan(uv.y, uv.x);
  float core = pkGaussian(r2, 4.8);
  float halo = pkGaussian(r2, 1.45) * (1.0 - smoothstep(0.62, 1.0, r));
  float shimmer = pkRadialShimmer(r, theta, time, phase);
  float depthTerm = baseStrength + (1.0 - depth) * depthBoost;
  float grain = pkGrain(gl_FragCoord.xy, phase);
  float alpha = (core * 0.78 + halo * 0.46) * shimmer * depthTerm + grain;

  return clamp(alpha, 0.0, 0.95);
}

vec3 pkLiftColor(vec3 color, float floorLuma) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float needLift = clamp((floorLuma - luma) / max(floorLuma, 0.0001), 0.0, 1.0);
  vec3 lifted = mix(color, color + vec3(0.16, 0.14, 0.1), needLift);
  return clamp(lifted, 0.0, 1.0);
}
`;

