
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.35)]">
          <i className="fas fa-wave-square text-sm text-white"></i>
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">Shader Gallery</h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-blue-400 font-bold">
            Procedural Fields &amp; Demos
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">WebGL</span>
        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">R3F</span>
        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">Live Controls</span>
      </div>
    </header>
  );
};

export default Header;
