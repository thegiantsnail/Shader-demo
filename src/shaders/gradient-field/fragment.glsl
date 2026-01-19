precision highp float;

// Uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform float uFlowSpeed;
uniform float uColorVariance;
uniform float uNoiseAmplitude;
uniform float uBanding;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
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
  float t = uTime * uFlowSpeed;

  float wave = sin((aspectUv.x + aspectUv.y) * 2.0 + t) * 0.5 + 0.5;
  float ripple = cos(length(aspectUv) * 4.0 - t) * 0.5 + 0.5;
  float n = noise2d(aspectUv * 4.0 + t * 0.2);

  float blend = mix(wave, ripple, 0.5 + 0.5 * sin(t * 0.4));
  blend = mix(blend, n, uNoiseAmplitude);

  float bands = smoothstep(0.2, 0.8, fract(blend * (2.0 + uBanding * 6.0)));

  vec3 start = vec3(0.12, 0.22, 0.5);
  vec3 end = vec3(0.9, 0.5, 0.3);
  vec3 color = mix(start, end, blend + uColorVariance * (bands - 0.5));

  float vignette = smoothstep(1.2, 0.2, length(aspectUv));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
