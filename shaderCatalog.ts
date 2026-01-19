import { ShaderDefinition, ShaderUniformValues } from './types';
import voronoiVertex from './shaders/voronoi-sheaf/vertex.glsl?raw';
import voronoiFragment from './shaders/voronoi-sheaf/fragment.glsl?raw';
import particulateVertex from './shaders/particulate-surface/vertex.glsl?raw';
import particulateFragment from './shaders/particulate-surface/fragment.glsl?raw';
import gradientVertex from './shaders/gradient-field/vertex.glsl?raw';
import gradientFragment from './shaders/gradient-field/fragment.glsl?raw';

export const SHADER_GALLERY: ShaderDefinition[] = [
  {
    id: 'voronoi-sheaf',
    name: 'Voronoi Sheaf',
    description: 'Layered Voronoi cells with glow-rich edges and cursor turbulence.',
    vertexShader: voronoiVertex,
    fragmentShader: voronoiFragment,
    uniforms: [
      { key: 'uSubdivision', label: 'Subdivision Factor', min: 0, max: 1, step: 0.01, default: 0.55 },
      { key: 'uColorVariance', label: 'Color Variation', min: 0, max: 1, step: 0.01, default: 0.45 },
      { key: 'uNoiseAmplitude', label: 'Noise Amplitude', min: 0, max: 1, step: 0.01, default: 0.35 },
      { key: 'uFlowSpeed', label: 'Flow Speed', min: 0.1, max: 2, step: 0.05, default: 0.6 },
      { key: 'uGlow', label: 'Glow Intensity', min: 0.05, max: 1.5, step: 0.05, default: 0.4 },
    ],
    presets: [
      {
        id: 'crystalline',
        name: 'Crystalline Drift',
        values: {
          uSubdivision: 0.8,
          uColorVariance: 0.25,
          uNoiseAmplitude: 0.15,
          uFlowSpeed: 0.45,
          uGlow: 0.25,
        },
      },
      {
        id: 'nocturne',
        name: 'Nocturne Pulse',
        values: {
          uSubdivision: 0.45,
          uColorVariance: 0.65,
          uNoiseAmplitude: 0.5,
          uFlowSpeed: 0.9,
          uGlow: 0.75,
        },
      },
      {
        id: 'sheaf-bloom',
        name: 'Sheaf Bloom',
        values: {
          uSubdivision: 0.6,
          uColorVariance: 0.4,
          uNoiseAmplitude: 0.25,
          uFlowSpeed: 0.75,
          uGlow: 1.1,
        },
      },
    ],
  },
  {
    id: 'particulate-surface',
    name: 'Particulate Surface',
    description: 'Granular sheets and ripple-driven topology with depth cues.',
    vertexShader: particulateVertex,
    fragmentShader: particulateFragment,
    uniforms: [
      { key: 'uSubdivision', label: 'Subdivision Factor', min: 0, max: 1, step: 0.01, default: 0.5 },
      { key: 'uNoiseAmplitude', label: 'Noise Amplitude', min: 0, max: 1, step: 0.01, default: 0.4 },
      { key: 'uColorVariance', label: 'Color Variation', min: 0, max: 1, step: 0.01, default: 0.35 },
      { key: 'uRippleStrength', label: 'Ripple Strength', min: 0, max: 1, step: 0.01, default: 0.6 },
      { key: 'uSurfaceDepth', label: 'Surface Depth', min: 0, max: 1, step: 0.01, default: 0.45 },
    ],
    presets: [
      {
        id: 'dusty',
        name: 'Dusty Plate',
        values: {
          uSubdivision: 0.35,
          uNoiseAmplitude: 0.6,
          uColorVariance: 0.2,
          uRippleStrength: 0.2,
          uSurfaceDepth: 0.3,
        },
      },
      {
        id: 'surface-wave',
        name: 'Surface Wave',
        values: {
          uSubdivision: 0.65,
          uNoiseAmplitude: 0.25,
          uColorVariance: 0.45,
          uRippleStrength: 0.85,
          uSurfaceDepth: 0.6,
        },
      },
      {
        id: 'glass-grit',
        name: 'Glass Grit',
        values: {
          uSubdivision: 0.75,
          uNoiseAmplitude: 0.45,
          uColorVariance: 0.55,
          uRippleStrength: 0.35,
          uSurfaceDepth: 0.7,
        },
      },
    ],
  },
  {
    id: 'gradient-field',
    name: 'Gradient Field',
    description: 'Flowing gradients with banded energy and harmonic drift.',
    vertexShader: gradientVertex,
    fragmentShader: gradientFragment,
    uniforms: [
      { key: 'uFlowSpeed', label: 'Flow Speed', min: 0.1, max: 2.5, step: 0.05, default: 0.9 },
      { key: 'uColorVariance', label: 'Color Variation', min: 0, max: 1, step: 0.01, default: 0.4 },
      { key: 'uNoiseAmplitude', label: 'Noise Amplitude', min: 0, max: 1, step: 0.01, default: 0.3 },
      { key: 'uBanding', label: 'Banding Factor', min: 0, max: 1, step: 0.01, default: 0.5 },
    ],
    presets: [
      {
        id: 'ember',
        name: 'Ember Flow',
        values: {
          uFlowSpeed: 1.2,
          uColorVariance: 0.65,
          uNoiseAmplitude: 0.25,
          uBanding: 0.35,
        },
      },
      {
        id: 'ocean',
        name: 'Ocean Sway',
        values: {
          uFlowSpeed: 0.6,
          uColorVariance: 0.3,
          uNoiseAmplitude: 0.5,
          uBanding: 0.65,
        },
      },
      {
        id: 'electric',
        name: 'Electric Fade',
        values: {
          uFlowSpeed: 1.8,
          uColorVariance: 0.55,
          uNoiseAmplitude: 0.4,
          uBanding: 0.2,
        },
      },
    ],
  },
];

export const getDefaultUniforms = (shader: ShaderDefinition): ShaderUniformValues => {
  return shader.uniforms.reduce<ShaderUniformValues>((acc, uniform) => {
    acc[uniform.key] = uniform.default;
    return acc;
  }, {});
};
