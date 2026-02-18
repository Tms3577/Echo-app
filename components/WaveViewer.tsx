
import React, { useEffect, useState } from 'react';
import { Wave } from '../types';

interface WaveViewerProps {
  wave: Wave;
  onClose: () => void;
}

const WaveViewer: React.FC<WaveViewerProps> = ({ wave, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose();
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in fade-in duration-300">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 flex gap-1 p-2 z-20">
        <div className="h-full flex-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <img src={wave.avatar} className="w-10 h-10 rounded-full border border-white/20" alt="" />
          <div>
            <p className="text-sm font-black text-white tracking-tight">@{wave.username}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Signal Intercepted</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Media */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <img 
          src={wave.media} 
          className="w-full h-full object-cover" 
          alt="Wave content"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Footer / Viewers */}
      <div className="p-8 bg-[#050505] border-t border-white/5 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-[#00f2ff] font-black uppercase tracking-[0.3em]">Viewer Nodes</p>
          <span className="text-[10px] text-zinc-600 font-bold tracking-widest">{wave.viewers.length} CONNECTIONS</span>
        </div>
        <div className="flex -space-x-3 overflow-hidden">
          {wave.viewers.length > 0 ? (
            wave.viewers.map((viewer, i) => (
              <img 
                key={i}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-[#050505] bg-zinc-800"
                src={`https://picsum.photos/seed/${viewer}/100`}
                alt=""
              />
            ))
          ) : (
            <p className="text-xs text-zinc-700 font-bold italic tracking-tight">No resonance detected yet...</p>
          )}
          {wave.viewers.length > 5 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-[#050505] text-[10px] font-black text-zinc-500">
              +{wave.viewers.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* CRT Scanline Overlay specifically for Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default WaveViewer;
