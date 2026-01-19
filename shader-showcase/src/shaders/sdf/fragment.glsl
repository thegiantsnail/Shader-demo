uniform float uTime;
uniform vec2 uResolution;
uniform float uMorphing;
uniform float uSmoothing;

varying vec2 vUv;

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001

// SDF primitives
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// Smooth minimum for blending
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

// Rotation matrix
mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float getDist(vec3 p) {
  // Animate positions
  vec3 p1 = p - vec3(sin(uTime) * 1.5, 0.0, 0.0);
  vec3 p2 = p - vec3(-sin(uTime) * 1.5, cos(uTime) * 0.5, 0.0);
  vec3 p3 = p - vec3(0.0, sin(uTime * 1.3) * 1.2, cos(uTime * 0.7) * 1.2);
  
  // Rotate shapes
  p1.xz *= rot(uTime * 0.5);
  p2.xy *= rot(uTime * 0.7);
  p3.yz *= rot(uTime * 0.3);
  
  // Create shapes
  float sphere1 = sdSphere(p1, 0.5);
  float sphere2 = sdSphere(p2, 0.6);
  float box = sdBox(p3, vec3(0.4));
  
  // Smooth blend
  float d = smin(sphere1, sphere2, uSmoothing);
  d = smin(d, box, uSmoothing * 0.8);
  
  return d;
}

vec3 getNormal(vec3 p) {
  float d = getDist(p);
  vec2 e = vec2(0.001, 0.0);
  vec3 n = d - vec3(
    getDist(p - e.xyy),
    getDist(p - e.yxy),
    getDist(p - e.yyx)
  );
  return normalize(n);
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = getDist(p);
    dO += dS;
    if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
  }
  
  return dO;
}

void main() {
  vec2 uv = (vUv - 0.5) * 2.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Camera
  vec3 ro = vec3(0.0, 0.0, 5.0);
  vec3 rd = normalize(vec3(uv, -1.0));
  
  // Ray march
  float d = rayMarch(ro, rd);
  
  vec3 color = vec3(0.0);
  
  if(d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);
    
    // Lighting
    vec3 lightPos = vec3(2.0, 3.0, 4.0);
    vec3 lightDir = normalize(lightPos - p);
    float diff = max(dot(n, lightDir), 0.0);
    
    // Fresnel
    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    
    // Color based on position
    vec3 baseColor = vec3(0.5, 0.3, 0.8);
    baseColor += 0.3 * sin(p * 3.0 + uTime);
    
    color = baseColor * (0.3 + 0.7 * diff);
    color += fresnel * vec3(0.3, 0.5, 1.0) * 0.5;
  } else {
    // Background gradient
    color = mix(vec3(0.1, 0.1, 0.2), vec3(0.05), length(uv) * 0.5);
  }
  
  gl_FragColor = vec4(color, 1.0);
}
