import { useMemo } from 'react'
import { useControls } from 'leva'
import { ShaderQuad } from '@/components/ShaderQuad'
import fragmentShader from './fragment.glsl?raw'

export function WaveDemo() {
  const { waveSpeed, waveFrequency, amplitude } = useControls('Wave', {
    waveSpeed: { value: 1.0, min: 0, max: 3, step: 0.1 },
    waveFrequency: { value: 10.0, min: 2, max: 30, step: 1 },
    amplitude: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
  })

  const uniforms = useMemo(
    () => ({
      uWaveSpeed: { value: waveSpeed },
      uWaveFrequency: { value: waveFrequency },
      uAmplitude: { value: amplitude },
    }),
    [waveSpeed, waveFrequency, amplitude],
  )

  return <ShaderQuad fragmentShader={fragmentShader} uniforms={uniforms} />
}
