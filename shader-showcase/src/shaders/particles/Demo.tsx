import { useMemo, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

// Extend Three.js types for R3F
extend({ Points: THREE.Points, BufferGeometry: THREE.BufferGeometry, ShaderMaterial: THREE.ShaderMaterial })

export function ParticlesDemo() {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { count, speed, spread } = useControls('Particles', {
    count: { value: 5000, min: 1000, max: 20000, step: 1000 },
    speed: { value: 0.1, min: 0, max: 0.5, step: 0.05 },
    spread: { value: 2.0, min: 1, max: 5, step: 0.5 },
  })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = Math.random() * spread
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = radius * Math.cos(phi)
      
      col[i3] = 0.5 + Math.random() * 0.5
      col[i3 + 1] = 0.3 + Math.random() * 0.4
      col[i3 + 2] = 0.8 + Math.random() * 0.2
    }
    
    return [pos, col]
  }, [count, spread])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * speed
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} />
    </points>
  )
}
