# Adding New Shader Demos - Quick Guide

## Step-by-Step Process

### 1. Create Shader Folder
```bash
src/shaders/your-shader-name/
```

### 2. Create Three Files

#### `vertex.glsl`
```glsl
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

#### `fragment.glsl`
```glsl
uniform float uTime;
uniform vec2 uResolution;
// Add your custom uniforms here

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Your shader logic here
  vec3 color = vec3(uv.x, uv.y, sin(uTime));
  
  gl_FragColor = vec4(color, 1.0);
}
```

#### `Demo.tsx`
```tsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'
import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'

export function YourShaderDemo() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size } = useThree()

  // Add interactive controls
  const { param1, param2 } = useControls('Your Shader', {
    param1: { value: 1.0, min: 0, max: 2, step: 0.1 },
    param2: { value: 1.0, min: 0, max: 5, step: 0.5 },
  })

  // Initialize uniforms
  const uniforms = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uParam1: { value: param1 },
    uParam2: { value: param2 },
  })

  // Update uniforms each frame
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uParam1.value = param1
      material.uniforms.uParam2.value = param2
      material.uniforms.uResolution.value.set(size.width, size.height)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 4]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}
```

### 3. Register in `registry.tsx`

Add import:
```tsx
import { YourShaderDemo } from './your-shader-name/Demo'
```

Update type:
```tsx
export type ShaderDemoId =
  | 'noise'
  | 'sdf'
  // ... existing ones
  | 'your-shader-name'
```

Add to array:
```tsx
export const shaderDemos: ShaderDemoDefinition[] = [
  // ... existing demos
  {
    id: 'your-shader-name',
    title: 'Your Shader Title',
    description: 'A brief description of what this shader does.',
    Component: YourShaderDemo,
  },
]
```

## Common Shader Patterns

### Pattern 1: Screen-Space Effect
```glsl
// For full-screen effects like post-processing
vec2 uv = (vUv - 0.5) * 2.0;
uv.x *= uResolution.x / uResolution.y; // Aspect ratio correction
```

### Pattern 2: Time Animation
```glsl
float time = uTime * speed;
float animated = sin(value + time);
```

### Pattern 3: Noise Function
```glsl
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
```

### Pattern 4: Distance Field
```glsl
float circle = length(uv - center) - radius;
float smoothCircle = smoothstep(radius - 0.01, radius + 0.01, length(uv - center));
```

### Pattern 5: Color Blending
```glsl
vec3 color1 = vec3(1.0, 0.0, 0.0);
vec3 color2 = vec3(0.0, 0.0, 1.0);
vec3 finalColor = mix(color1, color2, t);
```

## Common Uniforms

Always available:
- `uTime` - Elapsed time in seconds
- `uResolution` - Canvas resolution (width, height)

Common additions:
- `uMouse` - Mouse position
- `uSpeed` - Animation speed multiplier
- `uScale` - Scale/zoom factor
- `uIntensity` - Effect intensity

## Shader Ideas to Implement

### Easy
- [ ] Checkerboard pattern
- [ ] Radial gradient
- [ ] Stripe patterns
- [ ] Color inverter

### Medium
- [ ] Mandelbrot set
- [ ] Julia set
- [ ] Voronoi cells
- [ ] Perlin worms
- [ ] Plasma effect

### Advanced
- [ ] Fluid simulation
- [ ] Ray-traced spheres
- [ ] Fractal zoom
- [ ] Metaballs with physics
- [ ] 3D tunnel effect

## Testing Your Shader

1. Run `pnpm dev`
2. Navigate to your new shader in the UI
3. Use Leva controls to test parameters
4. Check browser console for GLSL errors
5. Verify it works on mobile (check performance)

## Performance Tips

1. **Minimize texture lookups** - Expensive on mobile
2. **Avoid branching** - if/else in shaders is slow
3. **Use `smoothstep` over `if`** - Hardware optimized
4. **Precalculate when possible** - Do math in JavaScript
5. **Test on low-end devices** - Not everyone has a gaming GPU

## Common GLSL Gotchas

- ❌ `float x = 1` → ✅ `float x = 1.0` (always use decimal)
- ❌ `pow(x, 2)` → ✅ `x * x` (multiplication is faster)
- ❌ Division by zero → Always check denominators
- ❌ Missing semicolons → GLSL requires them!

## Resources

- **GLSL Reference**: https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)
- **Shader Toy**: https://www.shadertoy.com/ (inspiration)
- **Book of Shaders**: https://thebookofshaders.com/ (learning)
- **GLSL Sandbox**: https://glslsandbox.com/ (experimentation)

---

Happy shader coding! 🎨✨
