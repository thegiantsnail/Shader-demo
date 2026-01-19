
import React from 'react';
import { SheafParams, AestheticMode } from '../types';

interface ControlPanelProps {
  params: SheafParams;
  onParamChange: (key: keyof SheafParams, value: number) => void;
  mode: AestheticMode;
  onModeChange: (mode: AestheticMode) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ params, onParamChange, mode, onModeChange }) => {
  const Slider = ({ label, icon, val, min, max, step, onChange }: any) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <i className={`fas ${icon} text-slate-400`}></i> {label}
        </label>
        <span className="text-xs font-mono text-blue-400">{val.toFixed(2)}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={val} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );

  return (
    <div className="pt-20">
      <section className="mb-10">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
          Aesthetic Mode
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(AestheticMode).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-3 py-2 text-[10px] rounded border transition-all duration-300 ${
                mode === m 
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.2)]' 
                : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
          Particulate Parameters
        </h2>
        
        <Slider 
          label="Subdivision Depth" 
          icon="fa-layer-group"
          val={params.subdivision} 
          min={1} max={10} step={0.1} 
          onChange={(v: number) => onParamChange('subdivision', v)} 
        />
        
        <Slider 
          label="Sheaf Complexity" 
          icon="fa-braille"
          val={params.complexity} 
          min={0} max={1} step={0.01} 
          onChange={(v: number) => onParamChange('complexity', v)} 
        />

        <Slider 
          label="Particle Scale" 
          icon="fa-circle"
          val={params.particleSize} 
          min={0.01} max={0.5} step={0.01} 
          onChange={(v: number) => onParamChange('particleSize', v)} 
        />

        <Slider 
          label="Fluid Vectoring" 
          icon="fa-wind"
          val={params.fluidity} 
          min={0} max={1} step={0.01} 
          onChange={(v: number) => onParamChange('fluidity', v)} 
        />

        <Slider 
          label="Color Persistence" 
          icon="fa-palette"
          val={params.colorShift} 
          min={0} max={1} step={0.01} 
          onChange={(v: number) => onParamChange('colorShift', v)} 
        />

        <Slider 
          label="Z-Sheaf Depth" 
          icon="fa-cube"
          val={params.depth} 
          min={0.1} max={2.0} step={0.01} 
          onChange={(v: number) => onParamChange('depth', v)} 
        />

        <Slider 
          label="Luminous Glow" 
          icon="fa-sun"
          val={params.glow} 
          min={0} max={1.5} step={0.01} 
          onChange={(v: number) => onParamChange('glow', v)} 
        />
      </section>

      <div className="mt-12 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
        <p className="text-[9px] text-blue-400 uppercase tracking-widest mb-2 font-bold">Engine Status</p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-slate-400 font-mono uppercase">Subdivision Active (60fps)</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
