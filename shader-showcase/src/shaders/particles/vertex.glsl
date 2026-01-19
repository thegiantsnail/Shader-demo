uniform float uTime;
uniform float uSize;

attribute vec3 aRandom;

varying vec3 vColor;

void main() {
  // Position with circular motion
  vec3 pos = position;
  
  float angle = uTime * 0.5 + aRandom.x * 6.28318;
  float radius = 2.0 + aRandom.y;
  
  pos.x += cos(angle) * radius;
  pos.y += sin(angle) * radius;
  pos.z += sin(uTime * 0.3 + aRandom.z * 6.28318) * 0.5;
  
  // Color based on position
  vColor = vec3(
    0.5 + 0.5 * sin(aRandom.x * 10.0 + uTime),
    0.5 + 0.5 * cos(aRandom.y * 10.0 + uTime * 0.7),
    0.5 + 0.5 * sin(aRandom.z * 10.0 + uTime * 1.3)
  );
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Size attenuation
  gl_PointSize = uSize * (300.0 / -mvPosition.z);
}
