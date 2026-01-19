import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import quadVertex from '@/shaders/common/fullscreen.vert?raw'

export type ShaderUniforms = Record<string, THREE.IUniform>

export function ShaderQuad({
  vertexShader = quadVertex,
  fragmentShader,
  uniforms: extraUniforms,
  transparent = false,
  depthWrite = true,
}: {
  vertexShader?: string
  fragmentShader: string
  uniforms?: ShaderUniforms
  transparent?: boolean
  depthWrite?: boolean
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { gl, size } = useThree()

  const uniforms = useMemo<ShaderUniforms>(() => {
    const base: ShaderUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }

    if (extraUniforms) {
      for (const [key, value] of Object.entries(extraUniforms)) {
        base[key] = value
      }
    }

    return base
  }, [extraUniforms])

  useEffect(() => {
    const dpr = gl.getPixelRatio()
    uniforms.uResolution.value.set(size.width * dpr, size.height * dpr)
  }, [gl, size.height, size.width, uniforms])

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={transparent}
        depthWrite={depthWrite}
      />
    </mesh>
  )
}
