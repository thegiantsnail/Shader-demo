uniform float uTime;
uniform vec2 uResolution;
uniform float uFrequency1;
uniform float uFrequency2;
uniform float uRotation;

varying vec2 vUv;

// Rotation matrix
mat2 rotate(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = (vUv - 0.5) * 2.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // First pattern - concentric circles
  float dist1 = length(uv);
  float pattern1 = sin(dist1 * uFrequency1);
  
  // Second pattern - rotated concentric circles
  vec2 uv2 = uv * rotate(uRotation + uTime * 0.2);
  float dist2 = length(uv2);
  float pattern2 = sin(dist2 * uFrequency2);
  
  // Combine patterns to create moiré interference
  float moire = pattern1 * pattern2;
  
  // Add additional interference from linear patterns
  float lines1 = sin(uv.x * uFrequency1 * 2.0 + uTime);
  float lines2 = sin(uv2.y * uFrequency2 * 2.0);
  float linearMoire = lines1 * lines2;
  
  // Combine circular and linear moiré
  float combined = moire * 0.7 + linearMoire * 0.3;
  
  // Map to colors
  float t = combined * 0.5 + 0.5;
  
  // Create psychedelic color scheme
  vec3 color1 = vec3(0.9, 0.1, 0.5);
  vec3 color2 = vec3(0.1, 0.9, 0.9);
  vec3 color3 = vec3(1.0, 0.8, 0.1);
  
  vec3 finalColor = mix(color1, color2, t);
  finalColor = mix(finalColor, color3, pow(t, 2.0));
  
  // Add pulsing brightness
  finalColor *= 0.8 + 0.2 * sin(uTime * 2.0);
  
  // Enhance contrast in the interference zones
  float contrast = abs(combined);
  finalColor += contrast * 0.3;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
