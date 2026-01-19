uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uSubdivision;
uniform float uComplexity;
uniform float uParticleSize;
uniform float uFluidity;
uniform float uColorShift;
uniform float uDepth;
uniform float uGlow;
uniform int uMode;

varying vec2 vUv;

// GLSL Hash functions
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

// Improved Voronoi returns: x=dist to edge, yz=relative vector to center
vec3 voronoi(vec2 x, float fluidity) {
  vec2 n = floor(x);
  vec2 f = fract(x);

  vec2 mg, mr;
  float md = 8.0;

  for(int j=-1; j<=1; j++)
  for(int i=-1; i<=1; i++) {
      vec2 g = vec2(float(i),float(j));
      vec2 o = hash33(vec3(n + g, 0.0)).xy;
      o = 0.5 + 0.5*sin(uTime * fluidity + 6.2831*o);
      vec2 r = g + o - f;
      float d = dot(r,r);

      if(d<md) {
          md = d;
          mr = r;
          mg = g;
      }
  }

  md = 8.0;
  for(int j=-2; j<=2; j++)
  for(int i=-2; i<=2; i++) {
      vec2 g = mg + vec2(float(i),float(j));
      vec2 o = hash33(vec3(n + g, 0.0)).xy;
      o = 0.5 + 0.5*sin(uTime * fluidity + 6.2831*o);
      vec2 r = g + o - f;

      if( dot(mr-r,mr-r)>0.00001 )
      md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
  }

  return vec3(md, mr);
}

void main() {
  vec2 uv = vUv;
  vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x/uResolution.y, 1.0);
  
  vec3 finalColor = vec3(0.0);
  float totalWeight = 0.0;

  // Multiscale Sheafing Loop
  for(int i = 0; i < 3; i++) {
    float scale = pow(2.1, float(i)) * uSubdivision;
    vec2 p = aspectUv * scale;
    
    // Fluid Vectoring
    p += vec2(sin(uTime * uFluidity * 0.4 + float(i)), cos(uTime * uFluidity * 0.25)) * 0.3;

    vec3 v = voronoi(p, uFluidity);
    float distToEdge = v.x;
    vec2 relPos = v.yz;

    float interiorWeight = smoothstep(0.0, 0.3, distToEdge);
    float edgeWeight = 1.0 - interiorWeight;

    // Internal grain texture
    float cellLocalAngle = atan(relPos.y, relPos.x);
    float grain = sin(cellLocalAngle * (5.0 + uComplexity * 10.0) + uTime * uFluidity) * 0.5 + 0.5;
    grain *= (1.0 - distToEdge);

    // Color generation per scale
    vec3 cellSeed = vec3(floor(p), uColorShift);
    vec3 colorA = hash33(cellSeed);
    vec3 colorB = hash33(cellSeed + vec3(1.23, 4.56, 7.89));
    vec3 colorC = hash33(cellSeed * 1.5 + 0.5);

    vec3 colData;
    if (i == 0) colData = mix(colorA, colorB, 0.3);
    else if (i == 1) colData = mix(colorB, colorC, 0.5);
    else colData = colorC;

    // Particulate refinement
    float particleMask = smoothstep(uParticleSize + 0.1, uParticleSize, 1.0 - distToEdge);
    
    // Mode-specific refinement
    if (uMode == 0) { // Crystalline
      colData = mix(colData, vec3(0.7, 0.9, 1.0), edgeWeight);
      interiorWeight *= (sin(distToEdge * 30.0) * 0.5 + 0.5);
    } else if (uMode == 1) { // Organic
      colData *= (1.0 + grain * 0.2);
      interiorWeight = pow(interiorWeight, 1.5);
    } else if (uMode == 2) { // Topological
      float rings = sin(distToEdge * 40.0 - uTime * 2.0) * 0.5 + 0.5;
      colData = mix(colData, vec3(1.0), rings * edgeWeight);
      interiorWeight *= rings;
    } else if (uMode == 3) { // Impressionist
      colData += grain * 0.4;
      particleMask = smoothstep(uParticleSize * 3.0, 0.0, 1.0 - distToEdge);
    }

    // Layer synthesis with glow
    float layerGlow = exp(-(1.0 - distToEdge) * (4.0 / uGlow)) * uGlow;
    vec3 layerColor = colData * (interiorWeight + layerGlow * edgeWeight);
    layerColor *= (0.3 + particleMask * 0.7);

    float weight = 1.0 / pow(1.8, float(i));
    finalColor += layerColor * weight;
    totalWeight += weight;
  }

  finalColor /= totalWeight;
  finalColor = pow(finalColor, vec3(uDepth));

  // Vignette
  float vig = smoothstep(1.4, 0.3, length(aspectUv));
  finalColor *= vig;

  gl_FragColor = vec4(finalColor, 1.0);
}
