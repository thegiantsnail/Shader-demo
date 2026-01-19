
export interface SheafParams {
  subdivision: number;
  complexity: number;
  particleSize: number;
  fluidity: number;
  colorShift: number;
  depth: number;
  glow: number;
}

export enum AestheticMode {
  CRYSTALLINE = 'Crystalline',
  ORGANIC = 'Organic',
  TOPOLOGICAL = 'Topological',
  IMPRESSIONIST = 'Impressionist'
}
