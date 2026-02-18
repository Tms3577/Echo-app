import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-lg',
    lg: 'text-3xl'
  };

  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className={`relative ${dimensions[size]} flex items-center justify-center`}>
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border border-[#00f2ff]/30 shadow-[0_0_20px_rgba(0,242,255,0.15)] group-hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] transition-all duration-700" />
        
        {/* Resonance Ripples */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="absolute w-[80%] h-[80%] rounded-full border border-[#00f2ff]/20 animate-[ping_3s_infinite]" />
          <div className="absolute w-[60%] h-[60%] rounded-full border border-[#00f2ff]/10 animate-[ping_4s_infinite]" style={{ animationDelay: '1s' }} />
        </div>

        {/* The stylized 'E' */}
        <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] z-10 drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <path 
            d="M80 25C80 25 70 15 50 15C30 15 15 30 15 50C15 70 30 85 50 85C70 85 80 75 80 75V65H50V55H75V45H50V35H80V25Z" 
            fill="url(#logoGrad)"
            className="group-hover:scale-110 transition-transform duration-500 origin-center"
          />
          {/* Internal signal bars */}
          <rect x="35" y="42" width="4" height="16" fill="white" className="animate-pulse" />
          <rect x="42" y="38" width="4" height="24" fill="white" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
          <rect x="49" y="45" width="4" height="10" fill="white" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
        </svg>
      </div>
      
      {showText && (
        <span className={`${textSizes[size]} font-black tracking-tighter text-white group-hover:text-[#00f2ff] transition-colors duration-500 uppercase tracking-widest`}>
          Echo
        </span>
      )}
    </div>
  );
};

export default Logo;