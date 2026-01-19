import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import './App.css'

import { shaderDemos } from './shaders/registry'

function DemoRenderer({ activeDemo }: { activeDemo: string }) {
  const demo = shaderDemos.find((d) => d.id === activeDemo) ?? shaderDemos[0]
  const DemoComponent = demo.Component
  return <DemoComponent />
}

function App() {
  const [activeDemo, setActiveDemo] = useState(shaderDemos[0]?.id ?? 'noise')
  const currentDemo = useMemo(
    () => shaderDemos.find((d) => d.id === activeDemo) ?? shaderDemos[0],
    [activeDemo],
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Leva collapsed />
      {/* Header */}
      <header className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-light tracking-wide">Shader Showcase</h1>
          <p className="text-gray-400 text-sm mt-1">Interactive WebGL shader demonstrations with React Three Fiber</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-8 px-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
          {/* Demo Navigation */}
          <nav className="flex flex-wrap gap-2 mb-6">
            {shaderDemos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeDemo === demo.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </nav>

          {/* Demo Info */}
          <div className="mb-4 mt-4">
            <h2 className="text-xl font-medium mb-2">{currentDemo.title}</h2>
            <p className="text-gray-400">{currentDemo.description}</p>
          </div>

          {/* Canvas */}
          <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-black border border-gray-800">
            <Canvas
              dpr={[1, 2]}
              gl={{ powerPreference: 'high-performance', antialias: true }}
              orthographic
              camera={{ position: [0, 0, 5], zoom: 200, near: 0.1, far: 1000 }}
            >
              <DemoRenderer key={activeDemo} activeDemo={activeDemo} />
            </Canvas>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-lg font-medium mb-2">Technology</h3>
              <p className="text-gray-400 text-sm">Built with React Three Fiber (R3F), Three.js, and custom GLSL shaders running on the GPU.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-lg font-medium mb-2">Performance</h3>
              <p className="text-gray-400 text-sm">All calculations run in parallel on the GPU, enabling real-time 60fps animations.</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
              <h3 className="text-lg font-medium mb-2">Applications</h3>
              <p className="text-gray-400 text-sm">Used in games, data visualization, generative art, music visualizers, and immersive web experiences.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          Shader Showcase - React Three Fiber Demo
        </div>
      </footer>
    </div>
  )
}

export default App
