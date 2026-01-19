
export interface SheafParams {
  subdivision: number;
  complexity: number;
  particleSize: number;
  fluidity: number;
  colorShift: number;
  interiorRadius: number;
  noiseStrength: number;
  flowSpeed: number;
  colorVariance: number;
  depth: number;
  glow: number;
}

export enum AestheticMode {
  CRYSTALLINE = 'Crystalline',
  ORGANIC = 'Organic',
  TOPOLOGICAL = 'Topological',
  IMPRESSIONIST = 'Impressionist'
}

export enum RenderMode {
  EDGE_BLOOM = 'Edge Bloom Only',
  INTERIOR_COLOR = 'Full Interior Color'
}
