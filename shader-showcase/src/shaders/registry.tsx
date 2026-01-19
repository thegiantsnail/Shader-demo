import type { ComponentType } from 'react'

import { NoiseDemo } from './noise/Demo'
import { SdfDemo } from './sdf/Demo'
import { GradientDemo } from './gradient/Demo'
import { ParticlesDemo } from './particles/Demo'
import { WaveDemo } from './wave/Demo'
import { GlitchDemo } from './glitch/Demo'
import { MoireDemo } from './moire/Demo'
import { VoronoiDemo } from './voronoi/Demo'

export type ShaderDemoId =
  | 'noise'
  | 'sdf'
  | 'gradient'
  | 'particles'
  | 'wave'
  | 'glitch'
  | 'moire'
  | 'voronoi'

export type ShaderDemoDefinition = {
  id: ShaderDemoId
  title: string
  description: string
  Component: ComponentType
}

export const shaderDemos: ShaderDemoDefinition[] = [
  {
    id: 'noise',
    title: 'Procedural Noise',
    description:
      'Simplex noise creates organic, flowing patterns. Used in terrain generation, clouds, and natural textures.',
    Component: NoiseDemo,
  },
  {
    id: 'sdf',
    title: 'SDF Ray Marching',
    description:
      'Signed Distance Fields enable rendering 3D shapes without geometry. Great for smooth blending and morphing forms.',
    Component: SdfDemo,
  },
  {
    id: 'gradient',
    title: 'Color Cycling',
    description:
      'Animated gradients create mesmerizing transitions. Common in music visualizers and generative art.',
    Component: GradientDemo,
  },
  {
    id: 'particles',
    title: 'Particle System',
    description:
      'GPU-driven points with circular motion. Creates galaxy/nebula effects with thousands of particles rendering in parallel.',
    Component: ParticlesDemo,
  },
  {
    id: 'wave',
    title: 'Wave Interference',
    description:
      'Multiple wave sources create interference patterns, simulating water ripples and organic movement.',
    Component: WaveDemo,
  },
  {
    id: 'glitch',
    title: 'Glitch Effect',
    description:
      'Digital distortion with UV warping, scanlines, and chromatic aberration for cyberpunk aesthetics.',
    Component: GlitchDemo,
  },
  {
    id: 'moire',
    title: 'Moiré Patterns',
    description:
      'Interference patterns from overlapping frequencies create hypnotic optical effects and demonstrate wave physics.',
    Component: MoireDemo,
  },
  {
    id: 'voronoi',
    title: 'Voronoi Sheaf',
    description:
      'Multi-scale Voronoi cells with 4 aesthetic modes: crystalline, organic, topological, and impressionist particle fields.',
    Component: VoronoiDemo,
  },
]
