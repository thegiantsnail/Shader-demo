precision highp float;

// Uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform float uSubdivision;
uniform float uNoiseAmplitude;
uniform float uColorVariance;
uniform float uRippleStrength;
uniform float uSurfaceDepth;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(213.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise2d(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 aspectUv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float scale = mix(2.0, 10.0, uSubdivision);
  vec2 p = aspectUv * scale;

  float n = noise2d(p + uTime * 0.4);
  float ripple = sin((p.x + p.y) * 2.5 + uTime * 1.4) * 0.5 + 0.5;
  float elevation = mix(n, ripple, uRippleStrength);

  float field = smoothstep(0.4, 0.9, elevation + uNoiseAmplitude * 0.5);
  float grain = noise2d(p * 3.0 + uTime * 0.2);

  vec3 base = vec3(0.07, 0.08, 0.12);
  vec3 surface = vec3(0.35, 0.7, 0.85) + uColorVariance * vec3(grain, grain * 0.4, 1.0 - grain);
  vec3 color = mix(base, surface, field);
  color += uSurfaceDepth * vec3(0.2, 0.35, 0.5) * elevation;

  float vignette = smoothstep(1.2, 0.2, length(aspectUv));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
