
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 px-8 flex items-center justify-between z-[100] bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <i className="fas fa-microchip text-sm text-white"></i>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SHEAFED PARTICULATE ENGINE
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500/80 font-bold">
            Multiscale Vector Subdivision v1.0
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 pointer-events-auto">
        <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">DOCUMENTATION</a>
        <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">COLLECTION</a>
        <div className="px-3 py-1 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-blue-400">
          RT_CORE_READY
        </div>
      </div>
    </header>
  );
};

export default Header;
