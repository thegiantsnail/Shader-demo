
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import SheafCanvas from './components/SheafCanvas';
import ControlPanel from './components/ControlPanel';
import { INITIAL_PARAMS, MODE_PRESETS } from './constants';
import { SheafParams, AestheticMode, RenderMode } from './types';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [params, setParams] = useState<SheafParams>(INITIAL_PARAMS);
  const [mode, setMode] = useState<AestheticMode>(AestheticMode.ORGANIC);
  const [renderMode, setRenderMode] = useState<RenderMode>(RenderMode.INTERIOR_COLOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>("Initializing the particulate sheaf...");

  const updateParam = (key: keyof SheafParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleModeChange = (newMode: AestheticMode) => {
    setMode(newMode);
    setParams(prev => ({ ...prev, ...MODE_PRESETS[newMode] }));
  };

  const askGeminiForInsight = useCallback(async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Describe the mathematical and aesthetic implications of a "Sheafed Particulate" field in the context of ${mode}. Keep it brief, poetic, and philosophical (max 2 sentences).`,
      });
      setAiInsight(response.text || "Connection lost in the sub-pixels.");
    } catch (error) {
      console.error("AI Insight failed", error);
    } finally {
      setIsGenerating(false);
    }
  }, [mode]);

  useEffect(() => {
    askGeminiForInsight();
  }, [mode, askGeminiForInsight]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-slate-200">
      <Header />
      
      <main className="absolute inset-0 flex">
        {/* Main Visual Viewport */}
        <div className="flex-grow h-full relative">
          <SheafCanvas params={params} mode={mode} renderMode={renderMode} />
          
          {/* AI Insight Overlay */}
          <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl transition-all duration-500 hover:bg-black/60">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
              {isGenerating ? 'Synthesizing...' : 'Conceptual Sheaf'}
            </h3>
            <p className="text-sm italic text-slate-300 leading-relaxed font-light">
              "{aiInsight}"
            </p>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div 
          className={`fixed md:relative top-0 right-0 h-full bg-[#0a0a0a] border-l border-white/10 transition-all duration-500 ease-in-out z-50
            ${isSidebarOpen ? 'w-full md:w-80 translate-x-0' : 'w-0 translate-x-full md:translate-x-0 md:w-0 overflow-hidden border-l-0'}`}
        >
          <div className="w-80 h-full p-6 overflow-y-auto">
            <ControlPanel 
              params={params} 
              onParamChange={updateParam} 
              mode={mode} 
              onModeChange={handleModeChange}
              renderMode={renderMode}
              onRenderModeChange={setRenderMode}
            />
            
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="mt-8 md:hidden w-full py-2 bg-blue-600 rounded text-sm font-medium"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </main>

      {/* Sidebar Toggle (Floating) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-24 right-6 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/10 transition-colors z-40"
        >
          <i className="fas fa-sliders-h text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default App;
