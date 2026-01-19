uniform float uTime;
uniform vec2 uResolution;
uniform float uGlitchIntensity;
uniform float uChromaticAberration;

varying vec2 vUv;

// Random function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Noise function
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;
  
  // Scanlines
  float scanline = sin(uv.y * 800.0 + uTime * 10.0) * 0.04;
  
  // Block displacement
  float blockNoise = noise(vec2(floor(uv.y * 20.0), floor(uTime * 5.0)));
  float displacement = (blockNoise - 0.5) * uGlitchIntensity * 0.1;
  
  // Apply displacement randomly
  if(random(vec2(floor(uTime * 10.0), floor(uv.y * 10.0))) > 0.95) {
    uv.x += displacement;
  }
  
  // Chromatic aberration
  vec2 offset = vec2(uChromaticAberration * 0.01, 0.0);
  
  // Sample with color separation
  float r = step(0.5, fract((uv.x + offset.x) * 10.0 + uTime));
  float g = step(0.5, fract(uv.x * 10.0 + uTime));
  float b = step(0.5, fract((uv.x - offset.x) * 10.0 + uTime));
  
  // Create pattern
  float pattern = step(0.5, fract(uv.y * 10.0 + sin(uTime + uv.x * 5.0)));
  
  vec3 color = vec3(r, g, b) * pattern;
  
  // Add digital noise
  float digitalNoise = random(uv + fract(uTime * 2.0)) * 0.1;
  color += digitalNoise;
  
  // Add scanlines
  color -= scanline;
  
  // Glitch flicker
  if(random(vec2(uTime)) > 0.98) {
    color = 1.0 - color;
  }
  
  // Add RGB shift on edges
  float edge = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);
  edge *= smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
  color *= edge * 0.5 + 0.5;
  
  gl_FragColor = vec4(color, 1.0);
}
