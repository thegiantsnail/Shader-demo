import { useMemo } from 'react'
import { useControls } from 'leva'
import { ShaderQuad } from '@/components/ShaderQuad'
import fragmentShader from './fragment.glsl?raw'

export function GlitchDemo() {
  const { strength, chromatic } = useControls('Glitch', {
    strength: { value: 1.0, min: 0, max: 3, step: 0.1 },
    chromatic: { value: 1.0, min: 0, max: 3, step: 0.1 },
  })

  const uniforms = useMemo(
    () => ({
      uGlitchStrength: { value: strength },
      uChromaticAmount: { value: chromatic },
    }),
    [strength, chromatic],
  )

  return <ShaderQuad fragmentShader={fragmentShader} uniforms={uniforms} />
}
