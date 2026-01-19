
import { SheafParams, AestheticMode } from './types';

export const INITIAL_PARAMS: SheafParams = {
  subdivision: 4.0,
  complexity: 0.65,
  particleSize: 0.05,
  fluidity: 0.2,
  colorShift: 0.5,
  interiorRadius: 0.6,
  noiseStrength: 0.35,
  flowSpeed: 0.4,
  colorVariance: 0.5,
  depth: 0.8,
  glow: 0.4,
};

export const MODE_PRESETS: Record<AestheticMode, Partial<SheafParams>> = {
  [AestheticMode.CRYSTALLINE]: {
    subdivision: 6.0,
    complexity: 0.8,
    particleSize: 0.02,
    fluidity: 0.1,
    colorShift: 0.3,
    interiorRadius: 0.45,
    noiseStrength: 0.2,
    flowSpeed: 0.2,
    colorVariance: 0.3,
    depth: 1.0,
    glow: 0.2
  },
  [AestheticMode.ORGANIC]: {
    subdivision: 3.5,
    complexity: 0.4,
    particleSize: 0.12,
    fluidity: 0.5,
    colorShift: 0.7,
    interiorRadius: 0.7,
    noiseStrength: 0.5,
    flowSpeed: 0.55,
    colorVariance: 0.6,
    depth: 0.6,
    glow: 0.6
  },
  [AestheticMode.TOPOLOGICAL]: {
    subdivision: 5.0,
    complexity: 0.9,
    particleSize: 0.04,
    fluidity: 0.3,
    colorShift: 0.1,
    interiorRadius: 0.5,
    noiseStrength: 0.3,
    flowSpeed: 0.35,
    colorVariance: 0.4,
    depth: 0.4,
    glow: 0.3
  },
  [AestheticMode.IMPRESSIONIST]: {
    subdivision: 2.5,
    complexity: 0.3,
    particleSize: 0.25,
    fluidity: 0.15,
    colorShift: 0.9,
    interiorRadius: 0.8,
    noiseStrength: 0.65,
    flowSpeed: 0.25,
    colorVariance: 0.75,
    depth: 0.3,
    glow: 0.8
  }
};
