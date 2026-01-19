# 🌌 Shader Showcase

An interactive gallery of WebGL shader demonstrations built with React Three Fiber, showcasing modern GPU programming techniques and visual effects.

## ✨ Live Demo

👉 [View Live Demo](https://thegiantsnail.github.io/Shader-demo)

## 🎨 Featured Shaders

### 1. **Procedural Noise**
Simplex noise generating organic, flowing patterns. Perfect for terrain generation, clouds, and natural textures.

### 2. **SDF Ray Marching**
Signed Distance Fields enable rendering complex 3D shapes without geometry, with smooth blending and morphing capabilities.

### 3. **Color Cycling**
Mesmerizing animated gradients using palette functions, commonly seen in music visualizers and generative art.

### 4. **Particle System**
GPU-driven particle system with thousands of points creating galaxy and nebula effects with circular motion patterns.

### 5. **Wave Interference**
Multiple wave sources creating realistic interference patterns that simulate water ripples and organic movement.

### 6. **Glitch Effect**
Digital distortion effects with UV warping, scanlines, and chromatic aberration for cyberpunk aesthetics.

### 7. **Moiré Patterns** 🆕
Hypnotic interference patterns created by overlapping frequencies, demonstrating wave physics and optical effects.

## 🚀 Tech Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - WebGL library
- **GLSL** - OpenGL Shading Language for custom shaders
- **Leva** - Interactive GUI controls
- **Tailwind CSS** - Utility-first styling

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/thegiantsnail/Shader-demo.git
cd Shader-demo

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Deploy to GitHub Pages
pnpm deploy
```

## 📁 Project Structure

```
src/
├── shaders/
│   ├── noise/
│   │   ├── vertex.glsl
│   │   ├── fragment.glsl
│   │   └── Demo.tsx
│   ├── sdf/
│   ├── gradient/
│   ├── particles/
│   ├── wave/
│   ├── glitch/
│   ├── moire/
│   └── registry.tsx
├── components/
│   ├── ShaderQuad.tsx
│   └── ErrorBoundary.tsx
├── App.tsx
└── main.tsx
```

## 🎮 Interactive Controls

Each shader demo includes interactive controls powered by Leva:
- Adjust parameters in real-time
- Experiment with different values
- See immediate visual feedback
- Learn how parameters affect the output

## 🔧 Adding New Shaders

1. Create a new folder in `src/shaders/`
2. Add `vertex.glsl`, `fragment.glsl`, and `Demo.tsx`
3. Register the demo in `registry.tsx`

Example Demo.tsx structure:

```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'
import vertexShader from './vertex.glsl?raw'
import fragmentShader from './fragment.glsl?raw'

export function YourDemo() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const { param1 } = useControls('Your Demo', {
    param1: { value: 1.0, min: 0, max: 2, step: 0.1 },
  })

  const uniforms = useRef({
    uTime: { value: 0 },
    uParam1: { value: param1 },
  })

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uParam1.value = param1
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

## 🎓 Learning Resources

- **GLSL**: [The Book of Shaders](https://thebookofshaders.com/)
- **Three.js**: [Official Documentation](https://threejs.org/docs/)
- **React Three Fiber**: [Official Docs](https://docs.pmnd.rs/react-three-fiber)
- **Shadertoy**: [Community Shaders](https://www.shadertoy.com/)

## 📊 Performance

- All calculations run in parallel on the GPU
- Real-time 60 FPS animations
- Device pixel ratio optimization for retina displays
- Efficient shader compilation and caching

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new shader effects
- Improve existing demos
- Fix bugs or optimize performance
- Enhance documentation

## 📄 License

MIT License - feel free to use this project for learning or your own portfolio!

## 🙏 Acknowledgments

- Inspired by the amazing shader art community on Shadertoy
- React Three Fiber team for the excellent library
- The Book of Shaders for educational resources

---

Built with ❤️ and GLSL
