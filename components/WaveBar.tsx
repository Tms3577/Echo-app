import React from 'react';
import { Wave } from '../types';

interface WaveBarProps {
  waves: Wave[];
  onWaveClick: (wave: Wave) => void;
}

const WaveBar: React.FC<WaveBarProps> = ({ waves, onWaveClick }) => {
  return (
    <div className="relative mb-10 group/wavebar">
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-4 px-4 scroll-smooth">
        {/* Your Wave - Add Node */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group/add">
          <div className="relative p-[2.5px] rounded-full border border-dashed border-zinc-700 hover:border-[#00f2ff]/60 transition-all duration-500 active:scale-90 transform">
             <div className="bg-[#050505] p-[3px] rounded-full">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover/add:text-[#00f2ff] transition-colors group-hover/add:bg-[#00f2ff]/5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover/add:text-[#00f2ff] transition-colors">Add Wave</span>
        </div>

        {waves.map((wave) => (
          <div 
            key={wave.id} 
            className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer group"
            onClick={() => onWaveClick(wave)}
          >
            <div className={`relative p-[3px] rounded-full transition-all duration-700 active:scale-90 transform ${wave.hasSeen 
              ? 'bg-zinc-800 shadow-none' 
              : 'bg-gradient-to-tr from-[#00f2ff] via-cyan-400 to-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.4)] animate-pulse hover:shadow-[0_0_35px_rgba(0,242,255,0.6)]'}`}
            >
              <div className="bg-[#050505] p-[3px] rounded-full relative overflow-hidden">
                <img 
                  src={wave.avatar} 
                  alt={wave.username}
                  className="w-16 h-16 rounded-full object-cover filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                />
                {!wave.hasSeen && (
                  <div className="absolute inset-0 bg-[#00f2ff]/10 animate-pulse pointer-events-none" />
                )}
              </div>
              {!wave.hasSeen && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#00f2ff] text-black text-[8px] font-black rounded-full shadow-[0_0_12px_#00f2ff] ring-2 ring-[#050505]">
                  ACTIVE
                </div>
              )}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${wave.hasSeen ? 'text-zinc-600' : 'text-zinc-300 group-hover:text-[#00f2ff]'}`}>
              {wave.username}
            </span>
          </div>
        ))}
      </div>
      {/* Decorative Blur Masks for Premium Feel */}
      <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none opacity-0 group-hover/wavebar:opacity-100 transition-opacity" />
      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none opacity-0 group-hover/wavebar:opacity-100 transition-opacity" />
    </div>
  );
};

export default WaveBar;