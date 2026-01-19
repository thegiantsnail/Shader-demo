import { useMemo } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'
import { ShaderQuad } from '@/components/ShaderQuad'
import fragmentShader from './fragment.glsl?raw'

export function NoiseDemo() {
  const { speed, scale, color1, color2, color3 } = useControls('Noise', {
    speed: { value: 0.3, min: 0, max: 2, step: 0.1 },
    scale: { value: 3.0, min: 0.5, max: 10, step: 0.5 },
    color1: '#1a3456',
    color2: '#cc4d80',
    color3: '#33cc99',
  })

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
    }),
    [speed, scale, color1, color2, color3],
  )

  return <ShaderQuad fragmentShader={fragmentShader} uniforms={uniforms} />
}
