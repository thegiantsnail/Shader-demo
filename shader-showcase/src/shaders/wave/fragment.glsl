uniform float uTime;
uniform vec2 uResolution;
uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uAmplitude;

varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  float time = uTime * uWaveSpeed;
  
  // Multiple wave sources
  vec2 source1 = vec2(cos(time * 0.5) * 0.5, sin(time * 0.5) * 0.5);
  vec2 source2 = vec2(-cos(time * 0.7) * 0.5, -sin(time * 0.7) * 0.5);
  vec2 source3 = vec2(sin(time * 0.3) * 0.5, cos(time * 0.3) * 0.5);
  
  float dist1 = length(uv - source1);
  float dist2 = length(uv - source2);
  float dist3 = length(uv - source3);
  
  // Wave interference
  float wave1 = sin(dist1 * uWaveFrequency - time * 2.0) * uAmplitude;
  float wave2 = sin(dist2 * uWaveFrequency * 1.3 - time * 2.5) * uAmplitude;
  float wave3 = sin(dist3 * uWaveFrequency * 0.8 - time * 1.8) * uAmplitude;
  
  float wave = (wave1 + wave2 + wave3) / 3.0;
  
  // Color based on wave height
  vec3 color1 = vec3(0.1, 0.2, 0.5);
  vec3 color2 = vec3(0.3, 0.6, 0.9);
  vec3 color3 = vec3(0.8, 0.9, 1.0);
  
  float t = wave * 0.5 + 0.5;
  vec3 finalColor = mix(color1, color2, t);
  finalColor = mix(finalColor, color3, pow(t, 3.0));
  
  // Add highlights at wave peaks
  float highlight = smoothstep(0.7, 0.9, t);
  finalColor += highlight * vec3(1.0) * 0.5;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
