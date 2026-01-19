import { useMemo, useState, useEffect } from 'react'
import { useControls } from 'leva'
import { ShaderQuad } from '@/components/ShaderQuad'
import fragmentShader from './fragment.glsl?raw'

type VoronoiMode = 'crystalline' | 'organic' | 'topological' | 'impressionist'

const MODE_PRESETS: Record<VoronoiMode, {
  subdivision: number
  complexity: number
  particleSize: number
  fluidity: number
  colorShift: number
  depth: number
  glow: number
}> = {
  crystalline: {
    subdivision: 6.0,
    complexity: 0.8,
    particleSize: 0.02,
    fluidity: 0.1,
    colorShift: 0.3,
    depth: 1.0,
    glow: 0.2,
  },
  organic: {
    subdivision: 3.5,
    complexity: 0.4,
    particleSize: 0.12,
    fluidity: 0.5,
    colorShift: 0.7,
    depth: 0.6,
    glow: 0.6,
  },
  topological: {
    subdivision: 5.0,
    complexity: 0.9,
    particleSize: 0.04,
    fluidity: 0.3,
    colorShift: 0.1,
    depth: 0.4,
    glow: 0.3,
  },
  impressionist: {
    subdivision: 2.5,
    complexity: 0.3,
    particleSize: 0.25,
    fluidity: 0.15,
    colorShift: 0.9,
    depth: 0.3,
    glow: 0.8,
  },
}

export function VoronoiDemo() {
  const [mode, setMode] = useState<VoronoiMode>('organic')
  const [subdivision, setSubdivision] = useState(MODE_PRESETS.organic.subdivision)
  const [complexity, setComplexity] = useState(MODE_PRESETS.organic.complexity)
  const [particleSize, setParticleSize] = useState(MODE_PRESETS.organic.particleSize)
  const [fluidity, setFluidity] = useState(MODE_PRESETS.organic.fluidity)
  const [colorShift, setColorShift] = useState(MODE_PRESETS.organic.colorShift)
  const [depth, setDepth] = useState(MODE_PRESETS.organic.depth)
  const [glow, setGlow] = useState(MODE_PRESETS.organic.glow)

  // Update all parameters when mode changes
  useEffect(() => {
    const preset = MODE_PRESETS[mode]
    setSubdivision(preset.subdivision)
    setComplexity(preset.complexity)
    setParticleSize(preset.particleSize)
    setFluidity(preset.fluidity)
    setColorShift(preset.colorShift)
    setDepth(preset.depth)
    setGlow(preset.glow)
  }, [mode])

  useControls('Voronoi Sheaf', {
    mode: {
      value: mode,
      options: ['crystalline', 'organic', 'topological', 'impressionist'],
      onChange: (value: VoronoiMode) => setMode(value),
    },
    subdivision: {
      value: subdivision,
      min: 1,
      max: 10,
      step: 0.5,
      onChange: setSubdivision,
    },
    complexity: {
      value: complexity,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: setComplexity,
    },
    particleSize: {
      value: particleSize,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      onChange: setParticleSize,
    },
    fluidity: {
      value: fluidity,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: setFluidity,
    },
    colorShift: {
      value: colorShift,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: setColorShift,
    },
    depth: {
      value: depth,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: setDepth,
    },
    glow: {
      value: glow,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: setGlow,
    },
  })

  const uniforms = useMemo(() => {
    const modeMap: Record<VoronoiMode, number> = {
      crystalline: 0,
      organic: 1,
      topological: 2,
      impressionist: 3,
    }

    return {
      uMouse: { value: [0.5, 0.5] },
      uSubdivision: { value: subdivision },
      uComplexity: { value: complexity },
      uParticleSize: { value: particleSize },
      uFluidity: { value: fluidity },
      uColorShift: { value: colorShift },
      uDepth: { value: depth },
      uGlow: { value: glow },
      uMode: { value: modeMap[mode] },
    }
  }, [mode, subdivision, complexity, particleSize, fluidity, colorShift, depth, glow])

  return <ShaderQuad fragmentShader={fragmentShader} uniforms={uniforms} />
}
