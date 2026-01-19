import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Leva, useControls } from 'leva';
import Header from './components/Header';
import ShaderCanvas, { ShaderCanvasHandle } from './components/ShaderCanvas';
import ShaderSidebar from './components/ShaderSidebar';
import { SHADER_GALLERY, getDefaultUniforms } from './shaderCatalog';
import { ShaderDefinition, ShaderPreset, ShaderUniformValues } from './types';

const App: React.FC = () => {
  const [activeShaderId, setActiveShaderId] = useState(SHADER_GALLERY[0].id);
  const [uniformValues, setUniformValues] = useState<ShaderUniformValues>(
    getDefaultUniforms(SHADER_GALLERY[0])
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<ShaderCanvasHandle>(null);

  const activeShader = useMemo<ShaderDefinition>(() => {
    return SHADER_GALLERY.find((shader) => shader.id === activeShaderId) ?? SHADER_GALLERY[0];
  }, [activeShaderId]);

  useControls(
    `${activeShader.name} Controls`,
    () =>
      activeShader.uniforms.reduce<Record<string, any>>((schema, uniform) => {
        schema[uniform.key] = {
          label: uniform.label,
          value: uniformValues[uniform.key] ?? uniform.default,
          min: uniform.min,
          max: uniform.max,
          step: uniform.step,
          onChange: (value: number) =>
            setUniformValues((prev) => ({
              ...prev,
              [uniform.key]: value,
            })),
        };
        return schema;
      }, {}),
    [activeShaderId, uniformValues]
  );

  const handleShaderSelect = (id: string) => {
    const selected = SHADER_GALLERY.find((shader) => shader.id === id) ?? SHADER_GALLERY[0];
    setActiveShaderId(selected.id);
    setUniformValues(getDefaultUniforms(selected));
    setCompileError(null);
  };

  const handlePresetApply = (preset: ShaderPreset) => {
    setUniformValues((prev) => ({ ...prev, ...preset.values }));
  };

  const handleResetUniforms = () => {
    setUniformValues(getDefaultUniforms(activeShader));
  };

  const handleExport = () => {
    canvasRef.current?.capture();
  };

  const handleRandomize = () => {
    const randomUniforms: ShaderUniformValues = {};
    activeShader.uniforms.forEach(uniform => {
      const range = uniform.max - uniform.min;
      const random = Math.random() * range + uniform.min;
      randomUniforms[uniform.key] = random;
    });
    setUniformValues(randomUniforms);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShareConfig = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const config = params.get('config');
    if (config) {
      try {
        const { shader, params: urlParams } = JSON.parse(atob(config));
        const shaderDef = SHADER_GALLERY.find(s => s.id === shader);
        if (shaderDef) {
          setActiveShaderId(shader);
          setUniformValues(urlParams);
        }
      } catch (e) {
        console.warn('Invalid config URL');
      }
    }
  }, []);

  // Update URL when state changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const state = { shader: activeShaderId, params: uniformValues };
      const encoded = btoa(JSON.stringify(state));
      const url = new URL(window.location.href);
      url.searchParams.set('config', encoded);
      window.history.replaceState({}, '', url.toString());
    }, 500);
    return () => clearTimeout(timer);
  }, [activeShaderId, uniformValues]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'r':
          handleResetUniforms();
          break;
        case 's':
          handleExport();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'arrowright':
          const currentIdx = SHADER_GALLERY.findIndex(s => s.id === activeShaderId);
          const nextIdx = (currentIdx + 1) % SHADER_GALLERY.length;
          handleShaderSelect(SHADER_GALLERY[nextIdx].id);
          break;
        case 'arrowleft':
          const currIdx = SHADER_GALLERY.findIndex(s => s.id === activeShaderId);
          const prevIdx = (currIdx - 1 + SHADER_GALLERY.length) % SHADER_GALLERY.length;
          handleShaderSelect(SHADER_GALLERY[prevIdx].id);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeShaderId]);

  const insightMode = isPlaying ? 'Live' : 'Paused';
  const insightText =
    insightMode === 'Live'
      ? 'Rendering with real-time uniforms and motion-driven sampling for the active shader.'
      : 'Animation is paused. Adjust sliders or presets to study the static shader output.';

  return (
    <div className="w-full h-screen bg-black text-slate-200 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ShaderSidebar
          shaders={SHADER_GALLERY}
          activeShaderId={activeShaderId}
          onSelectShader={handleShaderSelect}
          presets={activeShader.presets}
          onApplyPreset={handlePresetApply}
          isPlaying={isPlaying}
          onTogglePlaying={() => setIsPlaying((prev) => !prev)}
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onResetUniforms={handleResetUniforms}
          onExport={handleExport}
          onRandomize={handleRandomize}
          onShareConfig={handleShareConfig}
          insightMode={insightMode}
          insightText={insightText}
        />

        <main className="relative flex-1">
          <ShaderCanvas
            ref={canvasRef}
            vertexShader={activeShader.vertexShader}
            fragmentShader={activeShader.fragmentShader}
            uniformValues={uniformValues}
            isPlaying={isPlaying}
            timeScale={timeScale}
            onCompileError={setCompileError}
            onFpsUpdate={setFps}
          />

          {/* FPS Counter */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded font-mono text-xs text-green-400">
            {fps} FPS
          </div>

          {/* Control Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleExport}
              className="w-10 h-10 bg-black/70 backdrop-blur-md border border-white/10 rounded hover:bg-white/10 transition-colors flex items-center justify-center"
              title="Screenshot (S)"
            >
              <i className="fas fa-camera text-sm"></i>
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-black/70 backdrop-blur-md border border-white/10 rounded hover:bg-white/10 transition-colors flex items-center justify-center"
              title="Fullscreen (F)"
            >
              <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'} text-sm`}></i>
            </button>
            <button
              onClick={handleRandomize}
              className="w-10 h-10 bg-black/70 backdrop-blur-md border border-white/10 rounded hover:bg-white/10 transition-colors flex items-center justify-center"
              title="Randomize (Space)"
            >
              <i className="fas fa-random text-sm"></i>
            </button>
          </div>

          {compileError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
              <div className="max-w-2xl text-left bg-black/70 border border-red-500/40 rounded-lg p-6 text-red-200">
                <h2 className="text-lg font-semibold mb-3">Shader Compilation Error</h2>
                <pre className="text-xs whitespace-pre-wrap text-red-300">{compileError}</pre>
              </div>
            </div>
          )}
        </main>
      </div>

      <Leva
        collapsed={false}
        hideCopyButton
        theme={{
          sizes: {
            rootWidth: '320px',
            controlWidth: '140px',
          },
          colors: {
            elevation1: '#0b0b0f',
            elevation2: '#101019',
            elevation3: '#161622',
            accent1: '#3b82f6',
            accent2: '#60a5fa',
            accent3: '#93c5fd',
            highlight1: '#1f2937',
            highlight2: '#1e3a8a',
            highlight3: '#2563eb',
            vivid1: '#60a5fa',
          },
        }}
      />
    </div>
  );
};

export default App;
