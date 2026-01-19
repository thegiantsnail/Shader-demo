// Uniforms
// uniform float uTime;
// uniform vec2 uResolution;
// uniform vec2 uMouse;
// uniform float uSubdivision;
// uniform float uColorVariance;
// uniform float uNoiseAmplitude;
// uniform float uFlowSpeed;
// uniform float uGlow;

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

vec3 voronoi(vec2 x, float time, float flow) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  vec2 mg = vec2(0.0);
  vec2 mr = vec2(0.0);
  float md = 8.0;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = vec2(hash21(n + g), hash21(n + g + 2.0));
      o = 0.5 + 0.5 * sin(time * flow + 6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < md) {
        md = d;
        mr = r;
        mg = g;
      }
    }
  }

  md = 8.0;
  for (int j = -2; j <= 2; j++) {
    for (int i = -2; i <= 2; i++) {
      vec2 g = mg + vec2(float(i), float(j));
      vec2 o = vec2(hash21(n + g), hash21(n + g + 2.0));
      o = 0.5 + 0.5 * sin(time * flow + 6.2831 * o);
      vec2 r = g + o - f;
      float edge = dot(0.5 * (mr + r), normalize(r - mr));
      md = min(md, edge);
    }
  }

  return vec3(md, mr);
}

void main() {
  vec2 aspectUv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 cursor = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float dist = length(aspectUv - cursor);
  float cursorInfluence = smoothstep(0.6, 0.0, dist);

  float scale = mix(1.5, 6.0, uSubdivision);
  vec2 p = aspectUv * scale;
  p += vec2(sin(uTime * uFlowSpeed), cos(uTime * uFlowSpeed * 0.7)) * 0.3;
  p += cursorInfluence * normalize(aspectUv - cursor) * 0.4;

  vec3 v = voronoi(p, uTime, uFlowSpeed);
  float distToEdge = v.x;
  float edge = smoothstep(0.02, 0.2, distToEdge);

  float n = noise2d(p * 2.2 + uTime * 0.2);
  float grain = mix(0.4, 1.0, n);

  vec3 base = vec3(0.08, 0.2, 0.35);
  vec3 accent = vec3(0.4, 0.8, 1.0);
  vec3 color = mix(base, accent, edge);
  color += uColorVariance * vec3(n, n * 0.6, 1.0 - n);
  color *= mix(1.0, 1.0 + uNoiseAmplitude, grain);

  float glow = exp(-distToEdge * (18.0 / max(uGlow, 0.1))) * uGlow;
  color += glow * vec3(0.4, 0.6, 1.0);

  float vignette = smoothstep(1.2, 0.2, length(aspectUv));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
