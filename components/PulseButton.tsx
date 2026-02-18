import React, { useState } from 'react';

interface PulseButtonProps {
  active: boolean;
  onClick: () => void;
  count: number;
}

const PulseButton: React.FC<PulseButtonProps> = ({ active, onClick, count }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div className="flex flex-col items-center gap-1.5 group">
      <button 
        onClick={handleClick}
        className="relative w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-white/5 border border-white/5 transition-all active:scale-75 hover:bg-white/10"
      >
        {/* Ripple Effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-[1.25rem] bg-[#00f2ff]/20 animate-ping opacity-60" />
        )}
        
        {/* The Heart */}
        <svg 
          className={`w-6 h-6 transition-all duration-500 ${
            active 
              ? 'fill-[#00f2ff] text-[#00f2ff] scale-110 drop-shadow-[0_0_12px_rgba(0,242,255,0.7)]' 
              : 'text-zinc-500 group-hover:text-zinc-300'
          } ${isAnimating ? 'animate-[bounce_0.4s_ease-in-out]' : ''}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>

        {/* Shimmer Highlight */}
        {active && (
          <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-white/40 rounded-full blur-[1px] animate-pulse" />
        )}
      </button>
      <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${active ? 'text-[#00f2ff]' : 'text-zinc-600'}`}>
        {count.toLocaleString()}
      </span>
    </div>
  );
};

export default PulseButton;