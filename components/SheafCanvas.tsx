
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SheafParams, AestheticMode, RenderMode } from '../types';

interface SheafCanvasProps {
  params: SheafParams;
  mode: AestheticMode;
  renderMode: RenderMode;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uSubdivision;
  uniform float uComplexity;
  uniform float uParticleSize;
  uniform float uFluidity;
  uniform float uColorShift;
  uniform float uInteriorRadius;
  uniform float uNoiseStrength;
  uniform float uFlowSpeed;
  uniform float uColorVariance;
  uniform float uDepth;
  uniform float uGlow;
  uniform int uMode; // 0: Crystalline, 1: Organic, 2: Topological, 3: Impressionist
  uniform int uRenderMode; // 0: Edge Bloom, 1: Interior Color

  varying vec2 vUv;

  // GLSL Hash functions
  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
  }

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

  vec2 curlNoise(vec2 p) {
    float e = 0.1;
    float n1 = noise2d(p + vec2(0.0, e));
    float n2 = noise2d(p - vec2(0.0, e));
    float n3 = noise2d(p + vec2(e, 0.0));
    float n4 = noise2d(p - vec2(e, 0.0));
    vec2 curl = vec2(n1 - n2, n4 - n3);
    return curl;
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
    
    // Mouse Influence (Field Distortion)
    float mouseDist = length(aspectUv - (uMouse - 0.5) * vec2(uResolution.x/uResolution.y, 1.0));
    float mouseAttr = smoothstep(0.6, 0.0, mouseDist);

    vec3 finalColor = vec3(0.0);
    float totalWeight = 0.0;

    // Multiscale Sheafing Loop
    for(int i = 0; i < 3; i++) {
      float scale = pow(2.1, float(i)) * uSubdivision;
      vec2 p = aspectUv * scale;
      
      // Fluid Vectoring
      p += vec2(sin(uTime * uFluidity * 0.4 + float(i)), cos(uTime * uFluidity * 0.25)) * 0.3;
      p += mouseAttr * normalize(aspectUv - (uMouse - 0.5)) * 0.5;

      vec3 v = voronoi(p, uFluidity);
      float distToEdge = v.x; // 0 at edge, higher at center
      vec2 relPos = v.yz;    // relative vector from current point to cell center

      float distToCenter = length(relPos);
      float interiorWeight = smoothstep(uInteriorRadius, 0.0, distToCenter);
      float edgeWeight = 1.0 - interiorWeight;
      if (uRenderMode == 0) {
        interiorWeight = 0.0;
        edgeWeight = 1.0;
      }

      // MODEL 2: Cell-as-Micro-Texture (Internal Grain)
      float cellLocalAngle = atan(relPos.y, relPos.x);
      float grain = sin(cellLocalAngle * (5.0 + uComplexity * 10.0) + uTime * uFluidity) * 0.5 + 0.5;
      grain *= (1.0 - distToEdge); // Grain stronger as we approach edges

      // MODEL 3: Sheafed Color Bundles
      // Each scale level samples a different part of the local color manifold
      vec3 cellSeed = vec3(floor(p), uColorShift);
      vec3 colorA = hash33(cellSeed);
      vec3 colorB = hash33(cellSeed + vec3(1.23, 4.56, 7.89));
      vec3 colorC = hash33(cellSeed * 1.5 + 0.5);

      vec3 colData;
      if (i == 0) colData = mix(colorA, colorB, 0.3);
      else if (i == 1) colData = mix(colorB, colorC, 0.5);
      else colData = colorC;
      vec3 variedColor = mix(colData, hash33(cellSeed + vec3(9.1, 2.4, 5.7)), uColorVariance);

      // Particulate Refinement
      float particleMask = smoothstep(uParticleSize + 0.1, uParticleSize, 1.0 - distToEdge);
      
      // Mode-Specific Logic Refinement
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

      vec2 flow = curlNoise(p * (0.4 + uComplexity) + uTime * uFlowSpeed);
      float interiorNoise = noise2d(relPos * (3.0 + uComplexity * 6.0) + flow * 2.0 + uTime * 0.5);
      float textureBoost = 1.0 + (interiorNoise - 0.5) * 2.0 * uNoiseStrength;
      float gradientMix = smoothstep(0.0, uInteriorRadius, distToCenter);
      vec3 interiorColor = variedColor * mix(1.2, 0.6, gradientMix) * textureBoost;

      float layerGlow = exp(-(1.0 - distToEdge) * (4.0 / uGlow)) * uGlow;
      vec3 layerColor = interiorColor * interiorWeight + variedColor * layerGlow * edgeWeight;
      
      // Apply the particulate mask to "chunk" the effect
      layerColor *= (0.3 + particleMask * 0.7);

      float weight = 1.0 / pow(1.8, float(i));
      finalColor += layerColor * weight;
      totalWeight += weight;
    }

    finalColor /= totalWeight;
    
    // Post-processing
    finalColor = pow(finalColor, vec3(uDepth));
    finalColor *= (1.0 + mouseAttr * 0.5); // Highlight area under mouse

    // Soft Vignette for focus
    float vig = smoothstep(1.4, 0.3, length(aspectUv));
    finalColor *= vig;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const SheafPlane: React.FC<SheafCanvasProps> = ({ params, mode, renderMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uSubdivision: { value: params.subdivision },
    uComplexity: { value: params.complexity },
    uParticleSize: { value: params.particleSize },
    uFluidity: { value: params.fluidity },
    uColorShift: { value: params.colorShift },
    uInteriorRadius: { value: params.interiorRadius },
    uNoiseStrength: { value: params.noiseStrength },
    uFlowSpeed: { value: params.flowSpeed },
    uColorVariance: { value: params.colorVariance },
    uDepth: { value: params.depth },
    uGlow: { value: params.glow },
    uMode: { value: 1 },
    uRenderMode: { value: 1 }
  }), []);

  // Sync uniforms
  useMemo(() => {
    uniforms.uSubdivision.value = params.subdivision;
    uniforms.uComplexity.value = params.complexity;
    uniforms.uParticleSize.value = params.particleSize;
    uniforms.uFluidity.value = params.fluidity;
    uniforms.uColorShift.value = params.colorShift;
    uniforms.uInteriorRadius.value = params.interiorRadius;
    uniforms.uNoiseStrength.value = params.noiseStrength;
    uniforms.uFlowSpeed.value = params.flowSpeed;
    uniforms.uColorVariance.value = params.colorVariance;
    uniforms.uDepth.value = params.depth;
    uniforms.uGlow.value = params.glow;
    
    let modeVal = 1;
    if (mode === AestheticMode.CRYSTALLINE) modeVal = 0;
    if (mode === AestheticMode.ORGANIC) modeVal = 1;
    if (mode === AestheticMode.TOPOLOGICAL) modeVal = 2;
    if (mode === AestheticMode.IMPRESSIONIST) modeVal = 3;
    uniforms.uMode.value = modeVal;
    uniforms.uRenderMode.value = renderMode === RenderMode.EDGE_BLOOM ? 0 : 1;
  }, [params, mode, renderMode, uniforms]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2((state.mouse.x + 1) / 2, (state.mouse.y + 1) / 2),
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

const SheafCanvas: React.FC<SheafCanvasProps> = ({ params, mode, renderMode }) => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <SheafPlane params={params} mode={mode} renderMode={renderMode} />
      </Canvas>
    </div>
  );
};

export default SheafCanvas;
