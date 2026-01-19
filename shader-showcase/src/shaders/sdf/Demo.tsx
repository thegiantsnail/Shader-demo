import { useMemo } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'
import { ShaderQuad } from '@/components/ShaderQuad'
import fragmentShader from './fragment.glsl?raw'

export function SdfDemo() {
  const { speed, smoothness, color } = useControls('SDF', {
    speed: { value: 0.5, min: 0, max: 2, step: 0.1 },
    smoothness: { value: 0.5, min: 0.1, max: 1.5, step: 0.1 },
    color: '#6699e6',
  })

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uSmoothness: { value: smoothness },
      uBaseColor: { value: new THREE.Color(color) },
    }),
    [speed, smoothness, color],
  )

  return <ShaderQuad fragmentShader={fragmentShader} uniforms={uniforms} />
}
