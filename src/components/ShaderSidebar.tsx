import React from 'react';
import { ShaderDefinition, ShaderPreset } from '../types';

interface ShaderSidebarProps {
  shaders: ShaderDefinition[];
  activeShaderId: string;
  onSelectShader: (id: string) => void;
  presets: ShaderPreset[];
  onApplyPreset: (preset: ShaderPreset) => void;
  isPlaying: boolean;
  onTogglePlaying: () => void;
  timeScale: number;
  onTimeScaleChange: (value: number) => void;
  onResetUniforms: () => void;
  onExport: () => void;
  onRandomize?: () => void;
  onShareConfig?: () => void;
  insightMode: string;
  insightText: string;
}

const ShaderSidebar: React.FC<ShaderSidebarProps> = ({
  shaders,
  activeShaderId,
  onSelectShader,
  presets,
  onApplyPreset,
  isPlaying,
  onTogglePlaying,
  timeScale,
  onTimeScaleChange,
  onResetUniforms,
  onExport,
  onRandomize,
  onShareConfig,
  insightMode,
  insightText,
}) => {
  return (
    <aside className="w-full md:w-72 lg:w-80 border-r border-white/10 bg-black/70 backdrop-blur-md flex-shrink-0">
      <div className="p-6 space-y-8 h-full overflow-y-auto">
        <section>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Shader Demos</h2>
          <div className="space-y-2">
            {shaders.map((shader) => (
              <button
                key={shader.id}
                onClick={() => onSelectShader(shader.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-300 ${
                  shader.id === activeShaderId
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <p className="text-sm font-semibold">{shader.name}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{shader.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Presets</h2>
          <div className="grid grid-cols-1 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="px-3 py-2 text-[11px] rounded-md border border-white/10 bg-white/5 text-slate-300 hover:border-blue-400 hover:text-white transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Animation</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {onRandomize && (
                <button
                  onClick={onRandomize}
                  className="py-2 rounded-md text-xs border border-purple-500/50 bg-purple-600/20 text-white hover:bg-purple-600/30 transition-colors"
                  title="Space"
                >
                  🎲 Random
                </button>
              )}
              {onShareConfig && (
                <button
                  onClick={onShareConfig}
                  className="py-2 rounded-md text-xs border border-green-500/50 bg-green-600/20 text-white hover:bg-green-600/30 transition-colors"
                >
                  📋 Share
                </button>
              )}
            </div>
            <button
              onClick={onTogglePlaying}
              className="w-full py-2 rounded-md text-sm font-medium bg-blue-600/30 border border-blue-500 text-white"
            >
              {isPlaying ? 'Pause Animation' : 'Play Animation'}
            </button>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500">Time Scale</label>
              <input
                type="range"
                min={0}
                max={3}
                step={0.05}
                value={timeScale}
                onChange={(event) => onTimeScaleChange(parseFloat(event.target.value))}
                className="w-full h-1 mt-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-xs text-blue-400 mt-2 font-mono">{timeScale.toFixed(2)}x</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Utilities</h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={onResetUniforms}
              className="w-full py-2 rounded-md border border-white/10 bg-white/5 text-sm text-slate-200 hover:border-blue-400"
            >
              Reset Parameters
            </button>
            <button
              onClick={onExport}
              className="w-full py-2 rounded-md border border-white/10 bg-white/5 text-sm text-slate-200 hover:border-blue-400"
            >
              Export PNG
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">
            AI Insight Overlay
          </h2>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-slate-300 space-y-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-semibold">
              Mode: {insightMode}
            </div>
            <p className="leading-relaxed text-slate-400">{insightText}</p>
          </div>
        </section>

        <section className="text-[9px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400 mb-2">Keyboard shortcuts:</p>
          <p>Space: Play/Pause</p>
          <p>S: Export PNG</p>
          <p>R: Reset</p>
          <p>F: Fullscreen</p>
          <p>←/→: Switch shaders</p>
        </section>
      </div>
    </aside>
  );
};

export default ShaderSidebar;
