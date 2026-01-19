import { useMemo } from 'react'
import { useControls } from 'leva'
import { ShaderQuad } from '@/components/ShaderQuad'
import fragmentShader from './fragment.glsl?raw'

export function MoireDemo() {
  const { frequency1, frequency2, rotation, speed } = useControls('Moiré', {
    frequency1: { value: 20.0, min: 5, max: 50, step: 1 },
    frequency2: { value: 18.0, min: 5, max: 50, step: 1 },
    rotation: { value: 0.5, min: 0, max: Math.PI, step: 0.1 },
    speed: { value: 0.2, min: 0, max: 2, step: 0.1 },
  })

  const uniforms = useMemo(
    () => ({
      uFrequency1: { value: frequency1 },
      uFrequency2: { value: frequency2 },
      uRotation: { value: rotation },
      uSpeed: { value: speed },
    }),
    [frequency1, frequency2, rotation, speed],
  )

  return <ShaderQuad fragmentShader={fragmentShader} uniforms={uniforms} />
}
