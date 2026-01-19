import { useMemo } from 'react'
import { useControls } from 'leva'
import { ShaderQuad } from '@/components/ShaderQuad'
import fragmentShader from './fragment.glsl?raw'

export function GradientDemo() {
  const { speed, intensity } = useControls('Gradient', {
    speed: { value: 0.3, min: 0, max: 2, step: 0.1 },
    intensity: { value: 1.0, min: 0.1, max: 3, step: 0.1 },
  })

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uIntensity: { value: intensity },
    }),
    [speed, intensity],
  )

  return <ShaderQuad fragmentShader={fragmentShader} uniforms={uniforms} />
}
