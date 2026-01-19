import React, { useMemo, useRef, useState } from 'react';
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
          />

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
